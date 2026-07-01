/** @typedef {import('../index.js').default} AccessibleWebWidget */

const STRUCTURE_MAX_ITEMS = 100;

/** @type {{ [methodName: string]: (this: AccessibleWebWidget, ...args: any[]) => any }} */
export const pageToolMethods = {

  // ── Accessibility profiles ─────────────────────────────────────────

  toggleAccessibilityProfile(profileKey, menu = this.queryWidget('.acc-menu')) {
    const profile = (this.accessibilityProfiles || []).find(p => p.key === profileKey);
    if (!profile) return;

    const enable = !this.retrieveState(profileKey);
    const payload = { [profileKey]: enable };
    let touchesColorFilter = false;
    let colorFilterKey = null;

    Object.entries(profile.states).forEach(([key, value]) => {
      if (this.isColorFilterKey(key)) {
        touchesColorFilter = true;
        if (enable) colorFilterKey = key;
        return;
      }
      payload[key] = enable ? value : (key === 'text-scale' ? 1 : false);
    });

    // Turning a profile off also clears its state keys from any other
    // active profile that shares them — last action wins, kept simple.
    this.updateState(payload);
    if (touchesColorFilter) {
      this.updateColorFilterState(colorFilterKey);
    }

    this.applyEnhancements();
    this.applyVisualFilters();
    this.syncMenuUI(menu);
    this.announceFeatureState(this.translate(profile.label), enable);
  },

  // ── Mute sounds ────────────────────────────────────────────────────

  applyMuteToMediaElements(root) {
    if (!root || typeof root.querySelectorAll !== 'function') return;
    root.querySelectorAll('audio,video').forEach((media) => {
      if (media.muted) return;
      media.muted = true;
      media.setAttribute('data-acc-muted', 'true');
    });
  },

  enableMuteSounds(enable = false) {
    if (typeof document === 'undefined') return;
    if (enable) {
      this.applyMuteToMediaElements(document);
      if (!this.muteSoundsObserver && document.body && typeof MutationObserver === 'function') {
        this.muteSoundsObserver = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
              if (!(node instanceof Element)) return;
              if (node.matches && node.matches('audio,video') && !node.muted) {
                node.muted = true;
                node.setAttribute('data-acc-muted', 'true');
              }
              this.applyMuteToMediaElements(node);
            });
          });
        });
        this.muteSoundsObserver.observe(document.body, { childList: true, subtree: true });
      }
    } else {
      if (this.muteSoundsObserver) {
        this.muteSoundsObserver.disconnect();
        this.muteSoundsObserver = null;
      }
      document.querySelectorAll('[data-acc-muted]').forEach((media) => {
        media.muted = false;
        media.removeAttribute('data-acc-muted');
      });
    }
  },

  // ── Text magnifier ─────────────────────────────────────────────────

  enableTextMagnifier(enable = false) {
    if (typeof document === 'undefined') return;
    if (enable) {
      if (!this.magnifierElement || !document.body.contains(this.magnifierElement)) {
        const element = document.createElement('div');
        element.className = 'acc-text-magnifier acc-container';
        element.setAttribute('aria-hidden', 'true');
        document.body.appendChild(element);
        this.magnifierElement = element;
      }
      if (!this.magnifierMoveHandler) {
        this.magnifierMoveHandler = this.throttle((event) => this.updateTextMagnifier(event), 50);
      }
      document.addEventListener('mousemove', this.magnifierMoveHandler, { passive: true });
    } else {
      if (this.magnifierMoveHandler) {
        document.removeEventListener('mousemove', this.magnifierMoveHandler);
        this.magnifierMoveHandler = null;
      }
      if (this.magnifierElement) {
        this.magnifierElement.remove();
        this.magnifierElement = null;
      }
    }
  },

  updateTextMagnifier(event) {
    const magnifier = this.magnifierElement;
    if (!magnifier) return;
    const target = event.target instanceof Element ? event.target : null;
    let text = '';
    if (target && !target.closest('.acc-container') && !target.closest('.acc-rg-container')) {
      const block = target.closest('h1,h2,h3,h4,h5,h6,p,li,dt,dd,a,button,label,blockquote,figcaption,caption,th,td,span,summary');
      if (block) {
        text = this.normalizeReadableText(block.innerText || block.textContent || '').slice(0, 220);
      }
    }
    if (text) {
      magnifier.textContent = text;
      magnifier.classList.add('acc-visible');
    } else {
      magnifier.classList.remove('acc-visible');
      magnifier.textContent = '';
    }
  },

  // ── Page structure navigator ───────────────────────────────────────

  isStructureCandidate(element) {
    if (!(element instanceof Element)) return false;
    if (element.closest('.acc-container')) return false;
    if (element.closest('[aria-hidden="true"]')) return false;
    return this.isElementVisibleForTts(element);
  },

  getAccessibleLabel(element) {
    const ariaLabel = element.getAttribute('aria-label');
    if (ariaLabel && ariaLabel.trim()) return ariaLabel.trim();
    const labelledBy = element.getAttribute('aria-labelledby');
    if (labelledBy) {
      const labels = labelledBy.split(/\s+/)
        .map(id => document.getElementById(id))
        .filter(Boolean)
        .map(node => this.normalizeReadableText(node.textContent))
        .filter(Boolean);
      if (labels.length) return labels.join(' ');
    }
    return '';
  },

  collectPageHeadings() {
    return Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6'))
      .filter(el => this.isStructureCandidate(el))
      .map(el => ({
        element: el,
        level: Number(el.tagName.charAt(1)),
        label: this.normalizeReadableText(el.innerText || el.textContent || '').slice(0, 120)
      }))
      .filter(item => item.label)
      .slice(0, STRUCTURE_MAX_ITEMS);
  },

  collectPageLandmarks() {
    const selector = 'main,nav,header,footer,aside,form,section[aria-label],section[aria-labelledby],[role="main"],[role="navigation"],[role="banner"],[role="contentinfo"],[role="complementary"],[role="search"],[role="form"],[role="region"]';
    const seen = new Set();
    const landmarks = [];
    document.querySelectorAll(selector).forEach((el) => {
      if (seen.has(el) || !this.isStructureCandidate(el)) return;
      seen.add(el);
      const role = el.getAttribute('role') || el.tagName.toLowerCase();
      const name = this.getAccessibleLabel(el);
      landmarks.push({
        element: el,
        label: name ? `${role} — ${name}`.slice(0, 120) : role
      });
    });
    return landmarks.slice(0, STRUCTURE_MAX_ITEMS);
  },

  collectPageLinks() {
    const seen = new Set();
    const links = [];
    document.querySelectorAll('a[href]').forEach((el) => {
      if (!this.isStructureCandidate(el)) return;
      const label = this.normalizeReadableText(el.innerText || el.textContent || '').slice(0, 120)
        || this.getAccessibleLabel(el).slice(0, 120);
      if (!label) return;
      const dedupeKey = `${label}::${el.getAttribute('href')}`;
      if (seen.has(dedupeKey)) return;
      seen.add(dedupeKey);
      links.push({ element: el, label });
    });
    return links.slice(0, STRUCTURE_MAX_ITEMS);
  },

  focusStructureTarget(element) {
    if (!(element instanceof Element)) return;
    element.scrollIntoView({ block: 'center' });
    if (!element.hasAttribute('tabindex')) {
      element.setAttribute('tabindex', '-1');
      element.setAttribute('data-acc-temp-tabindex', 'true');
      element.addEventListener('blur', () => {
        if (element.hasAttribute('data-acc-temp-tabindex')) {
          element.removeAttribute('tabindex');
          element.removeAttribute('data-acc-temp-tabindex');
        }
      }, { once: true });
    }
    element.focus({ preventScroll: true });
  },

  buildStructureSection(titleKey, items, options = {}) {
    const section = document.createElement('div');
    section.className = 'acc-report-section';

    const title = document.createElement('div');
    title.className = 'acc-report-section-title';
    title.textContent = `${this.translate(titleKey)} (${items.length})`;
    section.appendChild(title);

    if (!items.length) {
      const empty = document.createElement('p');
      empty.className = 'acc-structure-empty';
      empty.textContent = this.translate('No items found');
      section.appendChild(empty);
      return section;
    }

    const list = document.createElement('ul');
    list.className = 'acc-structure-list';
    items.forEach((item) => {
      const entry = document.createElement('li');
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'acc-structure-item';
      if (options.indentByLevel && item.level) {
        button.style.paddingLeft = `${12 + (item.level - 1) * 16}px`;
        button.dataset.level = String(item.level);
      }
      button.textContent = options.indentByLevel && item.level
        ? `H${item.level} · ${item.label}`
        : item.label;
      button.addEventListener('click', () => {
        this.closeReportPanel(this.structurePanel);
        this.focusStructureTarget(item.element);
      });
      entry.appendChild(button);
      list.appendChild(entry);
    });
    section.appendChild(list);
    return section;
  },

  openPageStructurePanel() {
    if (typeof document === 'undefined') return;
    let panel = this.structurePanel && document.body.contains(this.structurePanel)
      ? this.structurePanel
      : null;
    if (!panel) {
      panel = document.createElement('div');
      panel.className = 'acc-report-panel acc-structure-panel acc-container';
      panel.setAttribute('role', 'dialog');
      panel.setAttribute('aria-modal', 'true');
      panel.setAttribute('aria-hidden', 'true');
      panel.setAttribute('aria-labelledby', 'acc-structure-title');
      document.body.appendChild(panel);
      this.structurePanel = panel;
    }

    // Rebuild on every open — the page may have changed.
    panel.innerHTML = `
      <div class="acc-report-overlay"></div>
      <div class="acc-report-dialog">
        <div class="acc-report-header">
          <h2 id="acc-structure-title" class="acc-report-title">${this.translate('Page Structure')}</h2>
          <button type="button" class="acc-report-close" aria-label="${this.translate('Close')}">${this.widgetIcons.close}</button>
        </div>
        <div class="acc-report-content"></div>
      </div>
    `;

    panel.querySelector('.acc-report-close').addEventListener('click', () => this.closeReportPanel(panel));
    panel.querySelector('.acc-report-overlay').addEventListener('click', () => this.closeReportPanel(panel));

    const content = panel.querySelector('.acc-report-content');
    content.appendChild(this.buildStructureSection('Headings', this.collectPageHeadings(), { indentByLevel: true }));
    content.appendChild(this.buildStructureSection('Landmarks', this.collectPageLandmarks()));
    content.appendChild(this.buildStructureSection('Links', this.collectPageLinks()));

    this.openReportPanel(panel);
  },

};
