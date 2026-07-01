/** @typedef {import('../index.js').default} AccessibleWebWidget */

const AXE_CORE_VERSION = '4.11.1';
const AXE_CORE_SRC = `https://cdn.jsdelivr.net/npm/axe-core@${AXE_CORE_VERSION}/axe.min.js`;
const AXE_CORE_INTEGRITY = 'sha384-wb3zgvLcZeMFSec08dk7g8K8yDFFAX2uNKVwOUuowwc/wIfE2t6XVUjTEgPrOJCS';
const AXE_RUN_OPTIONS = {
  runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice']
};

/** @type {{ [methodName: string]: (this: AccessibleWebWidget, ...args: any[]) => any }} */
export const axeReportMethods = {

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
  
      if (script && !script.src.includes(`/axe-core@${AXE_CORE_VERSION}/`)) {
        script.remove();
        script = null;
      }

      if (!script) {
        script = document.createElement('script');
        script.src = AXE_CORE_SRC;
        script.async = true;
        script.integrity = AXE_CORE_INTEGRITY;
        script.crossOrigin = 'anonymous';
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
    statusArea.textContent = this.translate('Loading...');
    contentArea.innerHTML = `<div class="acc-report-loading">${this.translate('Analyzing page...')}</div>`;
  
    try {
      const results = await this.runBackgroundAxeScan({ force: true });

      this.displayReportResults(panel, results);
  
    } catch (error) {
      contentArea.innerHTML = `<div class="acc-report-error">Error: ${error.message}</div>`;
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
      if (focusables.length) {
        focusables[0].focus();
        return;
      }
      focusTarget.focus();
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
          <h2 id="acc-report-title" class="acc-report-title">${this.translate('Accessibility Report')}</h2>
          <button type="button" class="acc-report-close" aria-label="${this.translate('Close')}">${this.widgetIcons.close}</button>
        </div>
        <div class="acc-report-status"></div>
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
  
    const totalViolations = Object.values(counts).reduce((a, b) => a + b, 0);
  
    statusArea.textContent = totalViolations > 0
      ? `${totalViolations} ${this.translate('Violations Found')}`
      : this.translate('No Issues Found');
  
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
        <div class="acc-report-stat passed">
          <span class="acc-report-stat-value">${passes.length}</span>
          <span class="acc-report-stat-label">${this.translate('Passed Tests')}</span>
        </div>
      </div>
    `;
  
    if (violations.length === 0) {
      html += `
        <div class="acc-report-success">
          <div class="acc-report-success-icon">
            <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
          </div>
          <h3>${this.translate('No Issues Found')}</h3>
        </div>
      `;
    } else {
      html += `<div class="acc-report-section">
        <div class="acc-report-section-title">${this.translate('Violations Found')} (${violations.length})</div>
      `;
  
      // Sort by severity
      const severityOrder = { critical: 0, serious: 1, moderate: 2, minor: 3 };
      violations.sort((a, b) => (severityOrder[a.impact] || 4) - (severityOrder[b.impact] || 4));
  
      violations.forEach((violation, index) => {
        const safeHelpUrl = this.sanitizeUrl(violation.helpUrl);
        html += `
          <div class="acc-report-violation" data-index="${index}">
            <div class="acc-report-violation-header">
              <span class="acc-report-violation-impact ${violation.impact}">${this.translate(this.capitalizeFirst(violation.impact))}</span>
              <span class="acc-report-violation-title">${this.escapeHtml(violation.help)}</span>
              <span class="acc-report-violation-count">${violation.nodes.length} ${this.translate('Element')}${violation.nodes.length > 1 ? 's' : ''}</span>
            </div>
            <div class="acc-report-violation-details">
              <p class="acc-report-violation-desc">${this.escapeHtml(violation.description)}</p>
              ${safeHelpUrl ? `<p class="acc-report-violation-help">
                <a href="${safeHelpUrl}" target="_blank" rel="noopener">${this.translate('How to Fix')} →</a>
              </p>` : ''}
              ${violation.nodes.slice(0, 5).map(node => `
                <div class="acc-report-node">
                  <div class="acc-report-node-html">${this.escapeHtml(node.html)}</div>
                  ${node.failureSummary ? `<div class="acc-report-node-fix"><strong>${this.translate('Issue')}:</strong> ${this.escapeHtml(node.failureSummary)}</div>` : ''}
                </div>
              `).join('')}
              ${violation.nodes.length > 5 ? `<p style="color:#666;font-size:13px;margin-top:12px;">... and ${violation.nodes.length - 5} more elements</p>` : ''}
            </div>
          </div>
        `;
      });
  
      html += `</div>`;
    }
  
    if (incomplete.length > 0) {
      html += `
        <div class="acc-report-section">
          <div class="acc-report-section-title">${this.translate('Items Need Review')} (${incomplete.length})</div>
          <p style="color:#666;font-size:14px;">These items require manual verification.</p>
        </div>
      `;
    }
  
    contentArea.innerHTML = html;
  
    // Add click handlers for expandable violations
    contentArea.querySelectorAll('.acc-report-violation-header').forEach(header => {
      header.addEventListener('click', () => {
        header.parentElement.classList.toggle('expanded');
      });
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
    }
  
    if (this.reportKeyListener) {
      document.removeEventListener('keydown', this.reportKeyListener, true);
      this.reportKeyListener = null;
    }
  
    const focusTarget = this.reportPreviousFocus;
    this.reportPreviousFocus = null;
    if (focusTarget && typeof focusTarget.focus === 'function') {
      focusTarget.focus();
    }
  },

};
