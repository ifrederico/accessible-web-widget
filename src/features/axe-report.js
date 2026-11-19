/** @typedef {import('../index.js').default} AccessibleWebWidget */

import { AXE_CORE_SRC, AXE_CORE_INTEGRITY } from '../constants/remote-defaults.js';

const AXE_RUN_OPTIONS = {
  runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice']
};

/** @type {{ [methodName: string]: (this: AccessibleWebWidget, ...args: any[]) => any }} */
export const axeReportMethods = {

  getAxeCoreSource() {
    const rawUrl = typeof this.options?.axeCoreUrl === 'string' ? this.options.axeCoreUrl.trim() : '';
    if (rawUrl && !/["'\\\s]/.test(rawUrl)) {
      const rawIntegrity = typeof this.options?.axeCoreIntegrity === 'string' ? this.options.axeCoreIntegrity.trim() : '';
      return { src: rawUrl, integrity: rawIntegrity };
    }
    return { src: AXE_CORE_SRC, integrity: AXE_CORE_INTEGRITY };
  },

  loadAxeCore() {
    if (this.axeCoreLoaded && window.axe) {
      return Promise.resolve(window.axe);
    }
  
    if (this.axeCorePromise) {
      return this.axeCorePromise;
    }
    this.axeCorePromise = new Promise((resolve, reject) => {
      let script = document.querySelector('script[data-acc-axe-core="true"]');
      let settled = false;
      let timeoutId = null;
  
      const settleSuccess = () => {
        if (settled) return;
        settled = true;
        if (timeoutId) clearTimeout(timeoutId);
        if (!window.axe) {
          this.axeCoreLoaded = false;
          this.axeCorePromise = null;
          reject(new Error('axe-core loaded but window.axe is unavailable'));
          return;
        }
        this.axeCoreLoaded = true;
        if (script) {
          script.setAttribute('data-acc-axe-core-loaded', 'true');
        }
        resolve(window.axe);
      };
  
      const settleError = (error) => {
        if (settled) return;
        settled = true;
        if (timeoutId) clearTimeout(timeoutId);
        this.axeCoreLoaded = false;
        this.axeCorePromise = null;
        reject(error);
      };
  
      if (window.axe) {
        settleSuccess();
        return;
      }
  
      const { src, integrity } = this.getAxeCoreSource();
      if (!src) {
        settleError(new Error('No axe-core source is configured; set the axeCoreUrl option.'));
        return;
      }
      let resolvedSrc = src;
      try {
        resolvedSrc = new URL(src, document.baseURI).href;
      } catch {
        // Keep the raw value; the browser will surface a load error if it is invalid.
      }

      if (script && script.src !== resolvedSrc) {
        script.remove();
        script = null;
      }

      if (!script) {
        script = document.createElement('script');
        script.src = src;
        script.async = true;
        if (integrity) {
          script.integrity = integrity;
          script.crossOrigin = 'anonymous';
        }
        script.setAttribute('data-acc-axe-core', 'true');
        document.head.appendChild(script);
      }
  
      script.addEventListener('load', settleSuccess, { once: true });
      script.addEventListener('error', () => settleError(new Error('Failed to load axe-core')), { once: true });
      timeoutId = setTimeout(() => {
        settleError(new Error('Timed out loading axe-core'));
      }, 15000);
    });
  
    return this.axeCorePromise;
  },

  getAxeRunOptions() {
    return { ...AXE_RUN_OPTIONS };
  },

  getViolationCounts(results = {}) {
    const counts = { critical: 0, serious: 0, moderate: 0, minor: 0 };
    const violations = Array.isArray(results.violations) ? results.violations : [];
    violations.forEach((violation) => {
      const impact = violation?.impact;
      if (impact && counts[impact] !== undefined) {
        counts[impact] += Array.isArray(violation.nodes) ? violation.nodes.length : 0;
      }
    });
    return counts;
  },

  updateViolationBubble(results = null) {
    const bubble = this.violationBubble || this.queryWidget('.acc-violation-bubble');
    if (!bubble) return;

    const counts = this.getViolationCounts(results || this.axeScanResults || {});
    const devMode = this.isDevMode();

    let displayCount = 0;
    let severity = '';

    if (counts.critical > 0) {
      displayCount = counts.critical;
      severity = 'critical';
    } else if (devMode && counts.serious > 0) {
      displayCount = counts.serious;
      severity = 'serious';
    } else if (devMode && counts.moderate > 0) {
      displayCount = counts.moderate;
      severity = 'moderate';
    }

    if (displayCount <= 0) {
      bubble.textContent = '';
      bubble.hidden = true;
      bubble.removeAttribute('data-severity');
      return;
    }

    bubble.hidden = false;
    bubble.dataset.severity = severity;
    bubble.textContent = displayCount > 99 ? '99+' : String(displayCount);
  },

  async runBackgroundAxeScan({ force = false } = {}) {
    // Hard guarantee that axe-core is never fetched or run outside dev
    // mode, regardless of which feature asks for a scan.
    if (!this.isDevMode()) {
      this.updateViolationBubble({ violations: [] });
      return { violations: [] };
    }

    if (!force && this.axeScanResults) {
      this.updateViolationBubble(this.axeScanResults);
      return this.axeScanResults;
    }

    if (!force && this.axeScanPromise) {
      return this.axeScanPromise;
    }

    this.axeScanPromise = (async () => {
      try {
        const axe = await this.loadAxeCore();
        const results = await axe.run(document, this.getAxeRunOptions());
        this.axeScanResults = results;
        this.updateViolationBubble(results);
        return results;
      } catch (error) {
        this.updateViolationBubble({ violations: [] });
        throw error;
      } finally {
        this.axeScanPromise = null;
      }
    })();

    return this.axeScanPromise;
  },

  async runAccessibilityReport() {
    // Create or get report panel
    let panel = this.reportPanel && document.body.contains(this.reportPanel)
      ? this.reportPanel
      : null;

    if (!panel) {
      panel = this.createReportPanel();
      document.body.appendChild(panel);
      this.reportPanel = panel;
    }
  
    this.openReportPanel(panel);
  
    const contentArea = this.findElement('.acc-report-content', panel);
    const statusArea = this.findElement('.acc-report-status', panel);
  
    // Show loading state
    statusArea.textContent = '';
    contentArea.innerHTML = `<div class="acc-report-loading">${this.translate('Analyzing page...')}</div>`;
  
    try {
      const results = await this.runBackgroundAxeScan({ force: true });

      this.displayReportResults(panel, results);
  
    } catch (error) {
      contentArea.innerHTML = `<div class="acc-report-error">Error: ${this.escapeHtml(error.message)}</div>`;
      statusArea.textContent = '';
    }
  },

  getReportFocusableElements(panel) {
    if (!panel) return [];
    const dialog = this.findElement('.acc-report-dialog', panel);
    return this.getFocusableElements(dialog || panel);
  },

  openReportPanel(panel) {
    if (!panel) return;
  
    const currentlyFocused = this.getActiveElement();
    this.reportPreviousFocus = currentlyFocused && typeof currentlyFocused.focus === 'function'
      ? currentlyFocused
      : null;
  
    panel.classList.add('acc-report-visible');
    panel.setAttribute('aria-hidden', 'false');
    panel.setAttribute('dir', this.getUiDirection());
  
    const dialog = this.findElement('.acc-report-dialog', panel);
    const focusTarget = dialog || panel;
    if (!focusTarget.hasAttribute('tabindex')) {
      focusTarget.setAttribute('tabindex', '-1');
    }
  
    if (this.reportKeyListener) {
      document.removeEventListener('keydown', this.reportKeyListener, true);
    }
  
    this.reportKeyListener = (event) => {
      if (!panel.classList.contains('acc-report-visible')) return;
  
      if (event.key === 'Escape' || event.key === 'Esc') {
        event.preventDefault();
        event.stopPropagation();
        this.closeReportPanel(panel);
        return;
      }
  
      if (event.key !== 'Tab') return;
  
      const focusables = this.getReportFocusableElements(panel);
      if (!focusables.length) {
        event.preventDefault();
        focusTarget.focus();
        return;
      }
  
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = this.getActiveElement();
      const outsidePanel = !panel.contains(active);
  
      if (event.shiftKey) {
        if (active === first || outsidePanel) {
          event.preventDefault();
          last.focus();
        }
        return;
      }
  
      if (active === last || outsidePanel) {
        event.preventDefault();
        first.focus();
      }
    };
  
    document.addEventListener('keydown', this.reportKeyListener, true);
  
    requestAnimationFrame(() => {
      const focusables = this.getReportFocusableElements(panel);
      this.focusQuietlyAfterPointer(focusables.length ? focusables[0] : focusTarget);
    });
  },

  createReportPanel() {
    const panel = document.createElement('div');
    panel.className = 'acc-report-panel acc-container';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    panel.setAttribute('aria-hidden', 'true');
    panel.setAttribute('aria-labelledby', 'acc-report-title');
  
    panel.innerHTML = `
      <div class="acc-report-overlay"></div>
      <div class="acc-report-dialog">
        <div class="acc-report-header">
          <div class="acc-report-heading">
            <h2 id="acc-report-title" class="acc-report-title">${this.translate('Accessibility Report')}</h2>
            <div class="acc-report-status"></div>
          </div>
          <button type="button" class="acc-report-close" aria-label="${this.translate('Close')}">${this.widgetIcons.close}</button>
        </div>
        <div class="acc-report-content"></div>
        <div class="acc-report-footer">
          <span class="acc-report-powered">Powered by axe-core</span>
        </div>
      </div>
    `;
  
    // Close handlers
    const closeBtn = panel.querySelector('.acc-report-close');
    const overlay = panel.querySelector('.acc-report-overlay');
  
    closeBtn.addEventListener('click', () => this.closeReportPanel(panel));
    overlay.addEventListener('click', () => this.closeReportPanel(panel));
  
    return panel;
  },

  // Colours an HTML snippet the way a code editor would: tags, attribute
  // names and values each get a class. Every piece is escaped on the way.
  highlightHtml(source) {
    const text = String(source || '');
    const wrap = (kind, value) => `<span class="acc-code-${kind}">${this.escapeHtml(value)}</span>`;
    const pattern = /(<\/?)([A-Za-z][\w:-]*)|([^\s"'<>=/]+)(=)("[^"]*"?|'[^']*'?)|(\/?>)/g;
    let html = '';
    let last = 0;
    let match;
    while ((match = pattern.exec(text))) {
      html += this.escapeHtml(text.slice(last, match.index));
      if (match[1]) {
        html += wrap('punct', match[1]) + wrap('tag', match[2]);
      } else if (match[3]) {
        html += wrap('attr', match[3]) + wrap('punct', match[4]) + wrap('value', match[5]);
      } else {
        html += wrap('punct', match[6]);
      }
      last = pattern.lastIndex;
    }
    return html + this.escapeHtml(text.slice(last));
  },

  // What the check says about one element. Violations carry a summary;
  // items that need review only carry each check's own message.
  getReportNodeMessage(node) {
    const summary = node && node.failureSummary;
    if (summary) {
      // Drop the lead-in line ("Fix any of the following:") when one
      // reason follows it, so the reason reads on its own.
      const lines = String(summary).split('\n').map(line => line.trim()).filter(Boolean);
      return lines.length === 2 && /:$/.test(lines[0]) ? lines[1] : lines.join('\n');
    }
    const checks = [].concat(node?.any || [], node?.all || [], node?.none || []);
    const withMessage = checks.find(check => check && check.message);
    return withMessage ? String(withMessage.message) : '';
  },

  // One result as a card: a row that opens to show what is wrong, where
  // to read more, and the elements it was found on.
  renderReportItem(item, id, { showImpact = true } = {}) {
    const safeHelpUrl = this.sanitizeUrl(item.helpUrl);
    const nodes = item.nodes || [];
    return `
      <div class="acc-report-violation">
        <button type="button" class="acc-report-violation-header" aria-expanded="false" aria-controls="${id}">
          ${showImpact && item.impact ? `<span class="acc-report-violation-impact ${this.escapeHtml(item.impact)}">${this.translate(this.capitalizeFirst(item.impact))}</span>` : ''}
          <span class="acc-report-violation-title">${this.escapeHtml(item.help)}</span>
          <span class="acc-report-violation-count">${nodes.length} ${this.translate('Element')}${nodes.length > 1 ? 's' : ''}</span>
        </button>
        <div class="acc-report-violation-details" id="${id}">
          <p class="acc-report-violation-desc">${this.escapeHtml(item.description)}</p>
          ${safeHelpUrl ? `<a class="acc-report-violation-help" href="${safeHelpUrl}" target="_blank" rel="noopener"><span>${this.translate('How to Fix')}</span>${this.widgetIcons.externalLink}</a>` : ''}
          ${nodes.slice(0, 5).map(node => {
            const message = this.getReportNodeMessage(node);
            return `
            <div class="acc-report-node">
              <div class="acc-report-code">
                <div class="acc-report-code-bar">
                  <span class="acc-report-code-lang">HTML</span>
                  <button type="button" class="acc-report-copy" aria-label="${this.translate('Copy')}">${this.widgetIcons.copy}</button>
                </div>
                <pre class="acc-report-node-html">${this.highlightHtml(node.html)}</pre>
              </div>
              ${message ? `<p class="acc-report-node-fix"><strong>${this.translate('Issue')}:</strong> ${this.escapeHtml(message)}</p>` : ''}
            </div>`;
          }).join('')}
          ${nodes.length > 5 ? `<p class="acc-report-note">... and ${nodes.length - 5} more elements</p>` : ''}
        </div>
      </div>
    `;
  },

  // Copies an element's HTML and shows a check for a moment.
  copyReportCode(button) {
    const code = button.closest('.acc-report-code')?.querySelector('.acc-report-node-html');
    const text = code ? code.textContent : '';
    const done = () => {
      button.innerHTML = this.widgetIcons.check;
      button.setAttribute('aria-label', this.translate('Copied'));
      button.classList.add('acc-report-copied');
      clearTimeout(button.accCopyTimer);
      button.accCopyTimer = setTimeout(() => {
        button.innerHTML = this.widgetIcons.copy;
        button.setAttribute('aria-label', this.translate('Copy'));
        button.classList.remove('acc-report-copied');
      }, 2000);
    };
    const fallback = () => {
      // Without clipboard access (an insecure page, or permission denied),
      // select the code so the usual copy shortcut works on it.
      const selection = window.getSelection && window.getSelection();
      if (!selection || !code) return;
      const range = document.createRange();
      range.selectNodeContents(code);
      selection.removeAllRanges();
      selection.addRange(range);
      try {
        if (document.execCommand && document.execCommand('copy')) done();
      } catch {
        // The code stays selected for the visitor to copy by hand.
      }
    };
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      navigator.clipboard.writeText(text).then(done, fallback);
    } else {
      fallback();
    }
  },

  displayReportResults(panel, results) {
    const contentArea = this.findElement('.acc-report-content', panel);
    const statusArea = this.findElement('.acc-report-status', panel);
  
    const violations = results.violations || [];
    const passes = results.passes || [];
    const incomplete = results.incomplete || [];
  
    // Count by severity
    const counts = { critical: 0, serious: 0, moderate: 0, minor: 0 };
    violations.forEach(v => {
      if (counts[v.impact] !== undefined) {
        counts[v.impact] += v.nodes.length;
      }
    });
  
    // Under the title: how much passed. It is context, not a problem to
    // open, so it is a quiet line and not one of the tiles.
    statusArea.innerHTML = `<span class="acc-report-passed">${this.widgetIcons.check}<span>${passes.length} ${this.translate('Passed Tests')}</span></span>`;
  
    let html = `
      <div class="acc-report-summary">
        <div class="acc-report-stat critical">
          <span class="acc-report-stat-value">${counts.critical}</span>
          <span class="acc-report-stat-label">${this.translate('Critical')}</span>
        </div>
        <div class="acc-report-stat serious">
          <span class="acc-report-stat-value">${counts.serious}</span>
          <span class="acc-report-stat-label">${this.translate('Serious')}</span>
        </div>
        <div class="acc-report-stat moderate">
          <span class="acc-report-stat-value">${counts.moderate}</span>
          <span class="acc-report-stat-label">${this.translate('Moderate')}</span>
        </div>
        <div class="acc-report-stat minor">
          <span class="acc-report-stat-value">${counts.minor}</span>
          <span class="acc-report-stat-label">${this.translate('Minor')}</span>
        </div>
      </div>
    `;
  
    if (violations.length === 0) {
      html += `
        <div class="acc-report-success">
          <div class="acc-report-success-icon">${this.widgetIcons.check}</div>
          <h3>${this.translate('No Issues Found')}</h3>
        </div>
      `;
    } else {
      // Sort by severity
      const severityOrder = { critical: 0, serious: 1, moderate: 2, minor: 3 };
      violations.sort((a, b) => (severityOrder[a.impact] ?? 4) - (severityOrder[b.impact] ?? 4));
  
      html += `<div class="acc-report-section">
        <div class="acc-report-section-title">${this.translate('Violations Found')} (${violations.length})</div>
        ${violations.map((violation, index) => this.renderReportItem(violation, `acc-report-violation-${index}`)).join('')}
      </div>`;
    }
  
    if (incomplete.length > 0) {
      html += `
        <div class="acc-report-section">
          <div class="acc-report-section-title">${this.translate('Items Need Review')} (${incomplete.length})</div>
          <p class="acc-report-note">A person needs to check these.</p>
          ${incomplete.map((item, index) => this.renderReportItem(item, `acc-report-review-${index}`, { showImpact: false })).join('')}
        </div>
      `;
    }
  
    contentArea.innerHTML = html;
  
    // Each card opens and closes on its own.
    contentArea.querySelectorAll('.acc-report-violation-header').forEach(header => {
      header.addEventListener('click', () => {
        const expanded = header.parentElement.classList.toggle('expanded');
        header.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      });
    });
    contentArea.querySelectorAll('.acc-report-copy').forEach(button => {
      button.addEventListener('click', () => this.copyReportCode(button));
    });
  },

  capitalizeFirst(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  },

  escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },

  sanitizeUrl(url) {
    const value = String(url || '').trim();
    if (!/^https?:\/\//i.test(value)) return '';
    return value.replace(/"/g, '%22').replace(/'/g, '%27');
  },

  closeReportPanel(panel = this.reportPanel) {
    if (panel) {
      panel.classList.remove('acc-report-visible');
      panel.setAttribute('aria-hidden', 'true');
      // The structure panel's item buttons capture live page elements; drop
      // them on close so detached DOM (e.g. after SPA navigation) can be
      // garbage-collected. The panel is rebuilt from scratch on every open.
      if (panel === this.structurePanel) {
        const content = panel.querySelector('.acc-report-content');
        if (content) content.innerHTML = '';
      }
    }
  
    if (this.reportKeyListener) {
      document.removeEventListener('keydown', this.reportKeyListener, true);
      this.reportKeyListener = null;
    }
  
    const focusTarget = this.reportPreviousFocus;
    this.reportPreviousFocus = null;
    this.focusQuietlyAfterPointer(focusTarget);
  },

};
