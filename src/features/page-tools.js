/** @typedef {import('../index.js').default} AccessibleWebWidget */

const STRUCTURE_MAX_ITEMS = 100;

/** @type {{ [methodName: string]: (this: AccessibleWebWidget, ...args: any[]) => any }} */
export const pageToolMethods = {

  // ── Accessibility profiles ─────────────────────────────────────────

  toggleAccessibilityProfile(profileKey, menu = this.queryWidget('.acc-menu')) {
    const profile = (this.accessibilityProfiles || []).find(p => p.key === profileKey);
    if (!profile) return;

    const enable = !this.retrieveState(profileKey);

    // Keys also bundled by another currently-active profile must survive
    // this profile turning off, so sibling profiles stay truthful.
    const keysHeldByOtherProfiles = new Set();
    (this.accessibilityProfiles || []).forEach((other) => {
      if (other.key === profileKey || !this.retrieveState(other.key)) return;
      Object.keys(other.states).forEach((key) => keysHeldByOtherProfiles.add(key));
    });

    if (enable) {
      // Snapshot explicit user choices for the bundled keys so disabling
      // the profile can restore them. Keys without an explicit choice are
      // left out and return to "no preference" on disable, which keeps
      // system defaults (prefers-reduced-motion, prefers-contrast) working.
      const snapshot = {};
      const payload = { [profileKey]: true };
      let colorFilterKey = null;
      Object.entries(profile.states).forEach(([key, value]) => {
        if (this.isColorFilterKey(key)) {
          colorFilterKey = key;
          return;
        }
        if (this.hasExplicitStatePreference(key)) {
          snapshot[key] = this.retrieveState(key);
        }
        payload[key] = value;
      });
      this.saveConfig({
        profileSnapshots: { ...(this.widgetConfig.profileSnapshots || {}), [profileKey]: snapshot }
      });
      this.updateState(payload);
      if (colorFilterKey) {
        this.updateColorFilterState(colorFilterKey);
      }
    } else {
      const snapshots = { ...(this.widgetConfig.profileSnapshots || {}) };
      const snapshot = snapshots[profileKey] || {};
      delete snapshots[profileKey];

      const restorePayload = { [profileKey]: false };
      const clearKeys = [];
      let clearColorFilter = false;
      Object.keys(profile.states).forEach((key) => {
        if (keysHeldByOtherProfiles.has(key)) return;
        if (this.isColorFilterKey(key)) {
          // Clear only the filter this profile activated; a filter the
          // user switched to manually stays untouched.
          if (this.retrieveState(key)) clearColorFilter = true;
          return;
        }
        if (Object.prototype.hasOwnProperty.call(snapshot, key)) {
          restorePayload[key] = snapshot[key];
        } else {
          clearKeys.push(key);
        }
      });

      this.updateState(restorePayload);
      if (clearKeys.length) {
        this.clearStates(clearKeys);
      }
      this.saveConfig({ profileSnapshots: snapshots });
      if (clearColorFilter) {
        this.updateColorFilterState(null);
      }
      // Cleared keys may be governed by OS media queries; re-establish
      // those defaults immediately instead of waiting for the next load.
      this.detectSystemPreferences();
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
        // Mouse and pen magnify on hover. Touch has no hover, so a tap
        // magnifies instead, and that banner clears once the page scrolls
        // rather than lingering over the text.
        this.magnifierMoveHandler = this.throttle((event) => {
          if (event.pointerType === 'touch') return;
          this.updateTextMagnifier(event);
        }, 50);
        this.magnifierDownHandler = (event) => {
          if (event.pointerType === 'touch') this.updateTextMagnifier(event);
        };
        this.magnifierScrollHandler = () => {
          if (this.magnifierLastPointerType === 'touch') this.hideTextMagnifier();
        };
      }
      document.addEventListener('pointermove', this.magnifierMoveHandler, { passive: true });
      document.addEventListener('pointerdown', this.magnifierDownHandler, { passive: true });
      window.addEventListener('scroll', this.magnifierScrollHandler, { passive: true });
    } else {
      if (this.magnifierMoveHandler) {
        document.removeEventListener('pointermove', this.magnifierMoveHandler);
        document.removeEventListener('pointerdown', this.magnifierDownHandler);
        window.removeEventListener('scroll', this.magnifierScrollHandler);
        this.magnifierMoveHandler = null;
        this.magnifierDownHandler = null;
        this.magnifierScrollHandler = null;
      }
      if (this.magnifierElement) {
        this.magnifierElement.remove();
        this.magnifierElement = null;
      }
      this.magnifierLastBlock = null;
    }
  },

  updateTextMagnifier(event) {
    const magnifier = this.magnifierElement;
    if (!magnifier) return;
    this.magnifierLastPointerType = event.pointerType || 'mouse';
    const target = event.target instanceof Element ? event.target : null;
    let block = null;
    if (target && !target.closest('.acc-container') && !target.closest('.acc-rg-container')) {
      block = target.closest('h1,h2,h3,h4,h5,h6,p,li,dt,dd,a,button,label,blockquote,figcaption,caption,th,td,span,summary');
    }
    // Reading innerText forces a layout pass; skip it (and the DOM write)
    // while the pointer stays inside the same block.
    if (block === this.magnifierLastBlock) return;
    this.magnifierLastBlock = block;
    const text = block
      ? this.normalizeReadableText(block.innerText || block.textContent || '').slice(0, 220)
      : '';
    if (text) {
      magnifier.textContent = text;
      // Dock the banner on the other half of the screen from the pointer
      // so it never covers the text being magnified.
      magnifier.classList.toggle('acc-text-magnifier-top', event.clientY > window.innerHeight * 0.55);
      magnifier.classList.add('acc-visible');
    } else {
      magnifier.classList.remove('acc-visible');
      magnifier.textContent = '';
    }
  },

  hideTextMagnifier() {
    if (!this.magnifierElement) return;
    this.magnifierElement.classList.remove('acc-visible');
    this.magnifierElement.textContent = '';
    // Forget the block so tapping it again shows the banner again.
    this.magnifierLastBlock = null;
  },

  // ── Tooltips ───────────────────────────────────────────────────────
  // Many controls are an icon with a name only assistive technology can
  // read, and pictures carry a description nobody sees. Tooltips shows
  // that hidden text in a large bubble, on hover and on keyboard focus.

  // The hidden description of `target`, or of the control it sits in.
  // Null when there is none, or when it only repeats the visible text.
  findTooltipSource(target) {
    if (!(target instanceof Element)) return null;
    if (target.closest('.acc-container, .acc-rg-container, #acc-widget-host, #acc-skip-link')) return null;
    const controlSelector = 'a[href], button, input, select, textarea, summary, label, [role="button"], [role="link"], [role="tab"], [role="menuitem"], [role="checkbox"], [role="switch"], [tabindex]';
    const control = target.closest(controlSelector);
    const drawing = target.closest('svg');
    const candidates = [];
    for (let node = target; node && node.nodeType === 1 && node !== document.body; node = node.parentElement) {
      candidates.push(node);
      if (node === control || (!control && (node === drawing || !drawing))) break;
    }
    for (const node of candidates) {
      const tag = node.tagName.toLowerCase();
      let text = '';
      if (tag === 'img' || tag === 'area' || (tag === 'input' && node.getAttribute('type') === 'image')) {
        text = node.getAttribute('alt') || '';
      }
      if (!text && tag === 'svg') {
        const title = Array.from(node.children).find((child) => child.tagName.toLowerCase() === 'title');
        text = title ? title.textContent : '';
      }
      text = text || this.getAccessibleLabel(node) || node.getAttribute('title')
        || (node === this.tooltipAnchor ? this.tooltipHeldTitle : '') || '';
      text = this.normalizeReadableText(text).slice(0, 300);
      if (!text) continue;
      const visible = this.normalizeReadableText(node.innerText || node.textContent || '');
      if (visible && visible.toLowerCase() === text.toLowerCase()) return null;
      return { element: node, text };
    }
    return null;
  },

  showTooltip(target) {
    const source = this.findTooltipSource(target);
    if (!source) {
      this.hideTooltip();
      return;
    }
    const bubble = this.tooltipElement;
    if (!bubble) return;
    if (source.element !== this.tooltipAnchor) {
      this.hideTooltip();
      this.tooltipAnchor = source.element;
      // Hold back the element's own title so the browser does not draw a
      // second, small tooltip over ours.
      if (source.element.hasAttribute('title')) {
        this.tooltipHeldTitle = source.element.getAttribute('title');
        source.element.removeAttribute('title');
      }
    }
    bubble.textContent = source.text;
    bubble.classList.add('acc-visible');
    this.positionTooltip();
  },

  // Under the element, or above it when there is no room, and always
  // inside the screen. Once the element has scrolled out of view the
  // bubble goes with it.
  positionTooltip() {
    const bubble = this.tooltipElement;
    const element = this.tooltipAnchor;
    if (!bubble || !element) return;
    const gap = 8;
    const anchor = element.getBoundingClientRect();
    if (!element.isConnected || anchor.bottom < 0 || anchor.top > window.innerHeight
      || anchor.right < 0 || anchor.left > window.innerWidth) {
      this.hideTooltip();
      return;
    }
    const size = bubble.getBoundingClientRect();
    const maxLeft = Math.max(gap, window.innerWidth - size.width - gap);
    const left = Math.min(maxLeft, Math.max(gap, anchor.left + anchor.width / 2 - size.width / 2));
    let top = anchor.bottom + gap;
    if (top + size.height > window.innerHeight - gap) top = anchor.top - size.height - gap;
    bubble.style.left = `${Math.round(left)}px`;
    bubble.style.top = `${Math.round(Math.max(gap, top))}px`;
  },

  hideTooltip() {
    if (this.tooltipAnchor && this.tooltipHeldTitle !== null) {
      this.tooltipAnchor.setAttribute('title', this.tooltipHeldTitle);
    }
    this.tooltipAnchor = null;
    this.tooltipHeldTitle = null;
    if (this.tooltipElement) {
      this.tooltipElement.classList.remove('acc-visible');
      this.tooltipElement.textContent = '';
    }
  },

  enableTooltips(enable = false) {
    if (typeof document === 'undefined' || !document.body) return;
    if (enable) {
      if (!this.tooltipElement || !document.body.contains(this.tooltipElement)) {
        const bubble = document.createElement('div');
        bubble.className = 'acc-tooltip-bubble acc-container';
        // The text is already the element's accessible name; a screen
        // reader should not hear it twice.
        bubble.setAttribute('aria-hidden', 'true');
        document.body.appendChild(bubble);
        this.tooltipElement = bubble;
      }
      if (this.tooltipHandlers) return;
      const leaves = (event) => {
        const next = event.relatedTarget;
        if (this.tooltipAnchor && next instanceof Node && this.tooltipAnchor.contains(next)) return;
        this.hideTooltip();
      };
      this.tooltipHandlers = {
        over: (event) => this.showTooltip(event.target),
        out: leaves,
        focusin: (event) => this.showTooltip(event.target),
        focusout: leaves,
        // Focusing a control can scroll it into view; the bubble follows
        // rather than vanishing the moment it appears.
        scroll: () => this.positionTooltip(),
        keydown: (event) => {
          if (event.key === 'Escape') this.hideTooltip();
        }
      };
      document.addEventListener('mouseover', this.tooltipHandlers.over, { passive: true });
      document.addEventListener('mouseout', this.tooltipHandlers.out, { passive: true });
      document.addEventListener('focusin', this.tooltipHandlers.focusin);
      document.addEventListener('focusout', this.tooltipHandlers.focusout);
      document.addEventListener('keydown', this.tooltipHandlers.keydown);
      window.addEventListener('scroll', this.tooltipHandlers.scroll, { passive: true, capture: true });
    } else {
      this.hideTooltip();
      if (this.tooltipHandlers) {
        document.removeEventListener('mouseover', this.tooltipHandlers.over);
        document.removeEventListener('mouseout', this.tooltipHandlers.out);
        document.removeEventListener('focusin', this.tooltipHandlers.focusin);
        document.removeEventListener('focusout', this.tooltipHandlers.focusout);
        document.removeEventListener('keydown', this.tooltipHandlers.keydown);
        window.removeEventListener('scroll', this.tooltipHandlers.scroll, { capture: true });
        this.tooltipHandlers = null;
      }
      if (this.tooltipElement) {
        this.tooltipElement.remove();
        this.tooltipElement = null;
      }
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

  // A landmark's kind in plain words (a translation key), from its role
  // or its tag. A header or footer inside an article or a section belongs
  // to that part of the page, not to the page, so it is not a landmark.
  getLandmarkKind(element) {
    const role = (element.getAttribute('role') || '').trim().toLowerCase();
    const tag = element.tagName.toLowerCase();
    const byRole = {
      main: 'Main content',
      navigation: 'Navigation',
      banner: 'Header',
      contentinfo: 'Footer',
      complementary: 'Sidebar',
      search: 'Search',
      form: 'Form',
      region: 'Section'
    };
    if (byRole[role]) return byRole[role];
    if (role) return '';
    if ((tag === 'header' || tag === 'footer') && element.parentElement
      && element.parentElement.closest('article, aside, main, nav, section')) {
      return '';
    }
    const byTag = {
      main: 'Main content',
      nav: 'Navigation',
      header: 'Header',
      footer: 'Footer',
      aside: 'Sidebar',
      search: 'Search',
      form: 'Form',
      section: 'Section'
    };
    return byTag[tag] || '';
  },

  collectPageLandmarks() {
    const selector = 'main,nav,header,footer,aside,search,form,section[aria-label],section[aria-labelledby],[role="main"],[role="navigation"],[role="banner"],[role="contentinfo"],[role="complementary"],[role="search"],[role="form"],[role="region"]';
    const seen = new Set();
    const landmarks = [];
    document.querySelectorAll(selector).forEach((el) => {
      if (seen.has(el) || !this.isStructureCandidate(el)) return;
      seen.add(el);
      const kind = this.getLandmarkKind(el);
      if (!kind) return;
      // "Navigation", or "Navigation: Main menu" when the page names it.
      const name = this.getAccessibleLabel(el);
      const label = this.translate(kind);
      landmarks.push({
        element: el,
        label: name ? `${label}: ${name}`.slice(0, 120) : label
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
