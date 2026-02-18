export const featureMethods = {

  ensureSkipLink() {
      if (typeof document === 'undefined') return null;
      if (this.skipLinkElement && document.body.contains(this.skipLinkElement)) {
        this.updateSkipLinkLabel();
        return this.skipLinkElement;
      }
      const existing = document.getElementById('acc-skip-link');
      if (existing) {
        this.skipLinkElement = existing;
        if (!existing.getAttribute('data-acc-text')) {
          existing.setAttribute('data-acc-text', 'Skip to accessibility menu');
        }
        this.updateSkipLinkLabel();
        return existing;
      }
  
      const button = document.createElement('button');
      button.type = 'button';
      button.id = 'acc-skip-link';
      button.className = 'acc-skip-link';
      button.setAttribute('tabindex', '0');
      button.setAttribute('data-acc-text', 'Skip to accessibility menu');
      button.setAttribute('aria-label', this.translate('Skip to accessibility menu'));
      button.textContent = this.translate('Skip to accessibility menu');
  
      button.addEventListener('click', (event) => {
        event.preventDefault();
        const toggle = this.widgetToggleButton;
        if (!toggle) return;
  
        const currentMenu = this.activeMenuContainer || this.menuContainer;
        const menuIsVisible = currentMenu && currentMenu.style.display !== 'none';
  
        const focusMenu = () => {
          const targetMenu = this.activeMenuContainer || this.menuContainer;
          if (!targetMenu) return;
          const focusables = this.getFocusableElements(targetMenu);
          if (focusables.length) {
            focusables[0].focus();
          }
        };
  
        if (!menuIsVisible) {
          toggle.click();
          requestAnimationFrame(focusMenu);
        } else {
          focusMenu();
        }
      });
  
      document.body.insertBefore(button, document.body.firstChild);
      this.skipLinkElement = button;
      return button;
    },

  updateSkipLinkLabel() {
      if (!this.skipLinkElement) return;
      const key = this.skipLinkElement.getAttribute('data-acc-text') || 'Skip to accessibility menu';
      const label = this.translate(key);
      this.skipLinkElement.textContent = label;
      this.skipLinkElement.setAttribute('aria-label', label);
    },

  shouldSkipScaling(element) {
      return element.closest('.acc-menu, .acc-container, .acc-widget');
    },

  applyScaleToElement(element, multiplier) {
      if (
        !element ||
        !(element instanceof Element) ||
        this.shouldSkipScaling(element) ||
        element.classList.contains('material-icons') ||
        element.classList.contains('fa')
      ) {
        return;
      }
      const baseAttr = 'data-acc-baseSize';
      if (!element.hasAttribute(baseAttr)) {
        const computedSize = parseFloat(window.getComputedStyle(element).fontSize);
        if (Number.isNaN(computedSize) || computedSize <= 0) {
          return;
        }
        element.setAttribute(baseAttr, String(computedSize));
      }
      const baseSize = parseFloat(element.getAttribute(baseAttr));
      if (Number.isNaN(baseSize) || baseSize <= 0) {
        return;
      }
      element.style.fontSize = `${baseSize * multiplier}px`;
    },

  ensureTextScaleObserver() {
      if (this.textScaleObserver || !document.body) return;
      this.textScaleObserver = new MutationObserver((mutations) => {
        if (this.currentTextScaleMultiplier <= 1) {
          return;
        }
        const pending = new Set();
        mutations.forEach(mutation => {
          mutation.addedNodes.forEach(node => {
            if (!(node instanceof Element)) return;
            if (node.matches && node.matches(this.textScaleSelectors)) {
              pending.add(node);
            }
            node.querySelectorAll?.(this.textScaleSelectors).forEach(el => pending.add(el));
          });
        });
        if (!pending.size) return;
        pending.forEach(el => this.applyScaleToElement(el, this.currentTextScaleMultiplier));
      });
      this.textScaleObserver.observe(document.body, { childList: true, subtree: true });
    },

  disconnectTextScaleObserver() {
      if (!this.textScaleObserver) return;
      this.textScaleObserver.disconnect();
      this.textScaleObserver = null;
    },

  scaleText(multiply = 1) {
      try {
        this.currentTextScaleMultiplier = multiply;
        if (multiply > 1) {
          this.ensureTextScaleObserver();
          const elements = document.querySelectorAll(this.textScaleSelectors);
          elements.forEach(el => this.applyScaleToElement(el, multiply));
        } else {
          this.disconnectTextScaleObserver();
          const scaledElements = document.querySelectorAll('[data-acc-baseSize]');
          scaledElements.forEach(el => {
            if (this.shouldSkipScaling(el)) return;
            el.style.fontSize = '';
            el.removeAttribute('data-acc-baseSize');
          });
        }
      } catch (e) {
        console.warn('Error scaling text:', e);
      }
    },

  enableBoldText(enable = false) {
      const config = {
        id: "bold-text",
        selector: "html",
        childrenSelector: ['', '*:not(.material-icons,.acc-menu,.acc-menu *, .acc-widget, .acc-widget *)'],
        styles: { 'font-weight': '700' }
      };
      this.applyToolStyle({ ...config, enable });
    },

  adjustLetterSpacing(enable = false) {
      const config = {
        id: "letter-spacing",
        selector: "html",
        childrenSelector: ['', '*:not(.material-icons,.acc-menu,.acc-menu *, .acc-widget, .acc-widget *)'],
        styles: { 'letter-spacing': '2px' }
      };
      this.applyToolStyle({ ...config, enable });
    },

  adjustLineSpacing(enable = false) {
      const config = {
        id: "line-spacing",
        selector: "html",
        childrenSelector: ['', '*:not(.material-icons,.acc-menu,.acc-menu *, .acc-widget, .acc-widget *)'],
        styles: { 'line-height': '3' }
      };
      this.applyToolStyle({ ...config, enable });
    },

  enableLargePointer(enable = false) {
      const config = {
        id: "large-pointer",
        selector: "body",
        childrenSelector: ['*'],
        styles: {
          'cursor': `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='98px' height='98px' viewBox='0 0 48 48'%3E%3Cpath fill='%23E0E0E0' d='M27.8 39.7c-.1 0-.2 0-.4-.1s-.4-.3-.6-.5l-3.7-8.6-4.5 4.2c-.1.2-.3.3-.6.3-.1 0-.3 0-.4-.1-.3-.1-.6-.5-.6-.9V12c0-.4.2-.8.6-.9.1-.1.3-.1.4-.1.2 0 .5.1.7.3l16 15c.3.3.4.7.3 1.1-.1.4-.5.6-.9.7l-6.3.6 3.9 8.5c.1.2.1.5 0 .8-.1.2-.3.5-.5.6l-2.9 1.3c-.2-.2-.4-.2-.5-.2z'/%3E%3Cpath fill='%23212121' d='m18 12 16 15-7.7.7 4.5 9.8-2.9 1.3-4.3-9.9L18 34V12m0-2c-.3 0-.5.1-.8.2-.7.3-1.2 1-1.2 1.8v22c0 .8.5 1.5 1.2 1.8.3.2.6.2.8.2.5 0 1-.2 1.4-.5l3.4-3.2 3.1 7.3c.2.5.6.9 1.1 1.1.2.1.5.1.7.1.3 0 .5-.1.8-.2l2.9-1.3c.5-.2.9-.6 1.1-1.1.2-.5.2-1.1 0-1.5l-3.3-7.2 4.9-.4c.8-.1 1.5-.6 1.7-1.3.3-.7.1-1.6-.5-2.1l-16-15c-.3-.5-.8-.7-1.3-.7z'/%3E%3C/svg%3E") 40 15, auto`
        }
      };
      this.applyToolStyle({ ...config, enable });
    },

  highlightLinks(enable = false) {
    const config = {
      id: "highlight-links",
      selector: "html",
      childrenSelector: [
        "a[href]:not(.acc-menu a, .acc-widget a)",
        "summary.header__menu-item:not(.acc-menu summary, .acc-widget summary)",
        "summary.link:not(.acc-menu summary, .acc-widget summary)",
        "summary[role='button']:not(.acc-menu summary, .acc-widget summary)",
        "details > summary.list-menu__item:not(.acc-menu summary, .acc-widget summary)",
        ".header__menu-item[role='button']:not(.acc-menu *, .acc-widget *)"
      ],
      styles: { 'outline': `3px solid ${this.widgetTheme.primaryColor}`, 'outline-offset': '2px' }
    };
    this.applyToolStyle({ ...config, enable });
  },

  highlightTitles(enable = false) {
      const config = {
        id: "highlight-title",
        selector: "html",
        childrenSelector: this.targetSelectors.HEADERS,
        styles: { 'outline': `3px solid ${this.widgetTheme.primaryColor}`, 'outline-offset': '2px' }
      };
      this.applyToolStyle({ ...config, enable });
    },

  ensureReadableFontLoaded() {
      if (this.readableFontLoaded) return;
      const existing = document.getElementById('acc-readable-text-font');
      if (existing) {
        this.readableFontLoaded = true;
        return;
      }
      const style = document.createElement('style');
      style.id = 'acc-readable-text-font';
      style.textContent = `
        @font-face {
          font-family: "OpenDyslexic3";
          src: url("https://website-widgets.pages.dev/fonts/OpenDyslexic3-Regular.woff") format("woff"),
               url("https://website-widgets.pages.dev/fonts/OpenDyslexic3-Regular.ttf") format("truetype");
          font-display: swap;
        }
      `;
      document.head.appendChild(style);
      this.readableFontLoaded = true;
    },

  enableReadableText(enable = false) {
      const shouldEnable = !!enable;
      if (shouldEnable) {
        this.ensureReadableFontLoaded();
      }
      // Exclude widget elements and common icon classes
      const iconExclusions = [
        ':not(.acc-widget)',
        ':not(.acc-menu)',
        ':not(.acc-container)',
        ':not(.material-icons)',
        ':not(.material-icons-outlined)',
        ':not(.material-icons-round)',
        ':not(.material-symbols-outlined)',
        ':not(.material-symbols-rounded)',
        ':not(.fa)',
        ':not(.fas)',
        ':not(.far)',
        ':not(.fab)',
        ':not(.fa-solid)',
        ':not(.fa-regular)',
        ':not(.fa-brands)',
        ':not(.glyphicon)',
        ':not(.icon)',
        ':not(.icons)',
        ':not([class*="icon-"])',
        ':not([data-icon])'
      ].join('');
      const exclusionSuffix = iconExclusions;
      const readableSelectors = [
        `h1${exclusionSuffix}`,
        `h2${exclusionSuffix}`,
        `h3${exclusionSuffix}`,
        `h4${exclusionSuffix}`,
        `h5${exclusionSuffix}`,
        `h6${exclusionSuffix}`,
        `.wsite-headline${exclusionSuffix}`,
        `.wsite-content-title${exclusionSuffix}`,
        `p${exclusionSuffix}`,
        `a${exclusionSuffix}`,
        `span${exclusionSuffix}`,
        `li${exclusionSuffix}`,
        `ol${exclusionSuffix}`,
        `dl${exclusionSuffix}`,
        `dt${exclusionSuffix}`,
        `th${exclusionSuffix}`,
        `td${exclusionSuffix}`,
        `blockquote${exclusionSuffix}`,
        `label${exclusionSuffix}`,
        `button:not(.acc-btn)${exclusionSuffix}`,
        `.acc-text${exclusionSuffix}`
      ];
      const config = {
        id: "readable-text",
        selector: "body",
        childrenSelector: readableSelectors,
        styles: { 
          'font-family': '"OpenDyslexic3", "Comic Sans MS", Arial, Helvetica, sans-serif' 
        },
        css: `.acc-container, .acc-container *, .acc-menu, .acc-menu * {
          font-family: inherit !important;
        }`
      };
      this.applyToolStyle({ ...config, enable: shouldEnable });
    },

  pauseMotion(enable = false) {
    const config = {
      id: "pause-motion",
      selector: "html",
      childrenSelector: ['*'],
      styles: { 'transition': 'none', 'animation-fill-mode': 'forwards', 'animation-iteration-count': '1', 'animation-duration': '.01s' }
    };
    this.applyToolStyle({ ...config, enable });
  },

  enableReadingAid(enable = false) {
    try {
      let container = this.findElement('.acc-rg-container');
      const guideHeight = 100; // Height of the clear reading window
  
      if (enable) {
        // Always clean up existing listener first to prevent duplicates
        if (window.__accweb__scrollGuide) {
          document.removeEventListener('mousemove', window.__accweb__scrollGuide);
          delete window.__accweb__scrollGuide;
        }
  
        if (!container) {
          // Create container but don't make it visible yet
          container = document.createElement('div');
          container.setAttribute('class', 'acc-rg-container');
          container.setAttribute('aria-hidden', 'true');
          container.innerHTML = this.readingAidTemplate;
          document.body.prepend(container);
        }
  
        const rgTop = container.querySelector('.acc-rg-top');
        const rgBottom = container.querySelector('.acc-rg-bottom');
        
        // Initially hide the guide completely
        rgTop.style.display = 'none';
        rgBottom.style.display = 'none';
        this.readingAidVisible = false;
  
        const updateGuidePosition = this.throttle((event) => {
          // If first mouse movement after enabling, make the guide visible
          if (!this.readingAidVisible) {
            rgTop.style.display = 'block';
            rgBottom.style.display = 'block';
            this.readingAidVisible = true;
          }
          
          // Position the guide at the mouse Y coordinate
          const mouseY = event.clientY;
          const topHeight = Math.max(0, mouseY - guideHeight / 2);
          const bottomHeight = Math.max(0, window.innerHeight - (mouseY + guideHeight / 2));
          rgTop.style.height = `${topHeight}px`;
          rgBottom.style.height = `${bottomHeight}px`;
        }, 16);
  
        window.__accweb__scrollGuide = updateGuidePosition;
        document.addEventListener('mousemove', updateGuidePosition, { passive: true });
      } else {
        // Reset visibility flag when disabled
        this.readingAidVisible = false;
        
        // Clean up event listener
        if (window.__accweb__scrollGuide) {
          document.removeEventListener('mousemove', window.__accweb__scrollGuide);
          delete window.__accweb__scrollGuide;
        }
        
        // Remove container
        if (container) {
          container.remove();
        }
      }
    } catch (e) {
      console.warn('Error with reading aid:', e);
    }
  },

  loadAxeCore() {
    if (this.axeCoreLoaded && window.axe) {
      return Promise.resolve(window.axe);
    }
  
    if (this.axeCorePromise) {
      return this.axeCorePromise;
    }
  
    this.axeCoreLoading = true;
    this.axeCorePromise = new Promise((resolve, reject) => {
      let script = document.querySelector('script[data-acc-axe-core="true"]');
      let settled = false;
      let timeoutId = null;
  
      const settleSuccess = () => {
        if (settled) return;
        settled = true;
        if (timeoutId) clearTimeout(timeoutId);
        if (!window.axe) {
          this.axeCoreLoading = false;
          this.axeCoreLoaded = false;
          this.axeCorePromise = null;
          reject(new Error('axe-core loaded but window.axe is unavailable'));
          return;
        }
        this.axeCoreLoading = false;
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
        this.axeCoreLoading = false;
        this.axeCoreLoaded = false;
        this.axeCorePromise = null;
        reject(error);
      };
  
      if (window.axe) {
        settleSuccess();
        return;
      }
  
      if (!script) {
        script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/axe-core@latest/axe.min.js';
        script.async = true;
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

  async runAccessibilityReport() {
    // Create or get report panel
    let panel = this.findElement('.acc-report-panel');
  
    if (!panel) {
      panel = this.createReportPanel();
      document.body.appendChild(panel);
    }
  
    this.openReportPanel(panel);
  
    const contentArea = this.findElement('.acc-report-content', panel);
    const statusArea = this.findElement('.acc-report-status', panel);
  
    // Show loading state
    statusArea.textContent = this.translate('Loading...');
    contentArea.innerHTML = `<div class="acc-report-loading">${this.translate('Analyzing page...')}</div>`;
  
    try {
      const axe = await this.loadAxeCore();
  
      // Run axe analysis
      const results = await axe.run(document, {
        runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice']
      });
  
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
  
    this.reportPreviousFocus = document.activeElement && typeof document.activeElement.focus === 'function'
      ? document.activeElement
      : null;
  
    panel.classList.add('acc-report-visible');
    panel.setAttribute('aria-hidden', 'false');
  
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
        this.closeReportPanel();
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
      const active = document.activeElement;
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
  
    closeBtn.addEventListener('click', () => this.closeReportPanel());
    overlay.addEventListener('click', () => this.closeReportPanel());
  
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
        html += `
          <div class="acc-report-violation" data-index="${index}">
            <div class="acc-report-violation-header">
              <span class="acc-report-violation-impact ${violation.impact}">${this.translate(this.capitalizeFirst(violation.impact))}</span>
              <span class="acc-report-violation-title">${this.escapeHtml(violation.help)}</span>
              <span class="acc-report-violation-count">${violation.nodes.length} ${this.translate('Element')}${violation.nodes.length > 1 ? 's' : ''}</span>
            </div>
            <div class="acc-report-violation-details">
              <p class="acc-report-violation-desc">${this.escapeHtml(violation.description)}</p>
              <p class="acc-report-violation-help">
                <a href="${violation.helpUrl}" target="_blank" rel="noopener">${this.translate('How to Fix')} →</a>
              </p>
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

  closeReportPanel() {
    const panel = this.findElement('.acc-report-panel');
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

  concealImages(enable = false) {
    const styleId = `acc-hide-images`;
    const existingStyle = document.getElementById(styleId);
    if (existingStyle) existingStyle.remove();
    document.documentElement.classList.toggle(styleId, enable);
    if (enable) {
      const css = `
        body > *:not(.acc-container) img,
        body > *:not(.acc-container) picture,
        body > *:not(.acc-container) svg:not(.acc-container svg),
        body > *:not(.acc-container) video,
        body > *:not(.acc-container) iframe,
        body > *:not(.acc-container) canvas,
        body > *:not(.acc-container) .video,
        body > *:not(.acc-container) .image {
          display: none !important;
        }
      `;
      this.injectStyle(styleId, css);
    }
  },

  applyEnhancements() {
      const { states } = this.loadConfig();
      // Handle font size scaling
      if (states && states['text-scale']) {
        const scaleValue = states['text-scale'];
        const scaleIndex = this.textScaleValues.indexOf(scaleValue);
        if (scaleIndex > -1) {
          this.textScaleIndex = scaleIndex;
          this.multiLevelFeatures['text-scale'].currentIndex = scaleIndex;
          this.scaleText(scaleValue);
        }
      } else {
        this.textScaleIndex = 0;
        if (this.multiLevelFeatures['text-scale']) {
          this.multiLevelFeatures['text-scale'].currentIndex = -1;
        }
      }
      // Apply other enhancements
      this.concealImages(states && states['hide-images']);
      this.highlightTitles(states && states['highlight-title']);
      this.highlightLinks(states && states['highlight-links']);
      this.adjustLetterSpacing(states && states['letter-spacing']);
      this.adjustLineSpacing(states && states['line-spacing']);
      this.enableBoldText(states && states['bold-text']);
      this.enableReadableText(states && states['readable-text']);
      this.enableReadingAid(states && states['reading-aid']);
      this.pauseMotion(states && states['pause-motion']);
      this.enableLargePointer(states && states['large-pointer']);
    },

  isColorFilterKey(key) {
      return Array.isArray(this.colorFilterKeys) && this.colorFilterKeys.includes(key);
    },

  getActiveColorFilterKey(states = this.widgetConfig.states) {
      if (!this.colorFilterKeys || !this.colorFilterKeys.length) return null;
      if (!states) return this.activeColorFilterKey || null;
      for (const key of this.colorFilterKeys) {
        if (states[key]) {
          return key;
        }
      }
      return null;
    },

  setColorFilterUI(menu, activeKey = null) {
      if (!menu || !menu.querySelectorAll) return;
      this.colorFilterKeys.forEach(filterKey => {
        const button = menu.querySelector(`.acc-btn[data-key="${filterKey}"]`);
        if (!button) return;
        const isActive = filterKey === activeKey;
        button.classList.toggle('acc-selected', isActive);
        button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      });
    },

  updateColorFilterState(activeKey = null) {
      if (!this.colorFilterKeys || !this.colorFilterKeys.length) {
        this.activeColorFilterKey = null;
        return;
      }
      const states = this.widgetConfig.states || {};
      const payload = {};
      let requiresUpdate = false;
      this.colorFilterKeys.forEach(filterKey => {
        const rawCurrent = states[filterKey];
        const shouldBeActive = activeKey === filterKey;
        if (shouldBeActive) {
          if (rawCurrent !== true) {
            payload[filterKey] = true;
            requiresUpdate = true;
          }
        } else if (rawCurrent) {
          payload[filterKey] = false;
          requiresUpdate = true;
        }
      });
      if (requiresUpdate) {
        this.updateState(payload);
      }
      this.activeColorFilterKey = activeKey;
    },

  applyVisualFilters() {
      const { states } = this.loadConfig();
      const activeKey = this.getActiveColorFilterKey(states);
      this.activeColorFilterKey = activeKey;
  
      if (!activeKey) {
        const style = document.getElementById('acc-filter-style');
        if (style) style.remove();
        return;
      }
      const filter = this.visualFilters[activeKey];
      if (!filter) {
        const style = document.getElementById('acc-filter-style');
        if (style) style.remove();
        return;
      }
      const adjustedFilter = {
        ...filter,
        selector: filter.selector || 'body > *:not(.acc-container)'
      };
      const css = this.buildCSS(adjustedFilter);
      this.injectStyle('acc-filter-style', css);
    },

  cycleTextScale(enable = false) {
      if (enable) {
        this.textScaleIndex = (this.textScaleIndex + 1) % this.textScaleValues.length;
        if (this.multiLevelFeatures['text-scale']) {
          this.multiLevelFeatures['text-scale'].currentIndex = this.textScaleIndex;
        }
      } else {
        this.textScaleIndex = 0;
        if (this.multiLevelFeatures['text-scale']) {
          this.multiLevelFeatures['text-scale'].currentIndex = -1;
        }
      }
      const progressIndicator = document.querySelector(`.acc-progress-indicator[data-feature="text-scale"]`);
      if (progressIndicator) {
        const dots = progressIndicator.querySelectorAll('.acc-progress-dot');
        dots.forEach(dot => dot.classList.remove('active'));
        if (enable && this.textScaleIndex < dots.length) {
          dots[this.textScaleIndex].classList.add('active');
        }
      }
      const multiply = enable ? this.textScaleValues[this.textScaleIndex] : 1;
      this.scaleText(multiply);
      this.updateState({ 'text-scale': multiply > 1 ? multiply : false });
      return this.textScaleIndex;
    },

  cycleMultiLevelFeature(featureKey, button) {
      // Only text-scale remains as a multi-level feature.
      const feature = this.multiLevelFeatures[featureKey];
      const newIndex = feature.currentIndex + 1;
      if (newIndex >= feature.levels) {
        feature.currentIndex = -1;
        button.classList.remove('acc-selected');
        button.setAttribute('aria-pressed', 'false');
        this.updateState({ [featureKey]: false });
        if (featureKey === 'text-scale') {
          this.textScaleIndex = 0;
        }
      } else {
        feature.currentIndex = newIndex;
        button.classList.add('acc-selected');
        button.setAttribute('aria-pressed', 'true');
        const newValue = feature.values[newIndex];
        this.updateState({ [featureKey]: newValue });
        if (featureKey === 'text-scale') {
          this.textScaleIndex = newIndex;
        }
      }
      const indicator = button.querySelector(`.acc-progress-indicator[data-feature="${featureKey}"]`);
      if (indicator) {
        const dots = indicator.querySelectorAll('.acc-progress-dot');
        dots.forEach((dot, i) => {
          dot.classList.toggle('active', i === feature.currentIndex);
        });
      }
      if (featureKey === 'text-scale') {
        const multiply = feature.currentIndex >= 0 ? feature.values[feature.currentIndex] : 1;
        this.scaleText(multiply);
      } else {
        this.applyVisualFilters();
      }
    },

  resetEnhancements() {
      this.saveConfig({ states: {} });
      this.textScaleIndex = 0;
      this.activeColorFilterKey = null;
      Object.keys(this.multiLevelFeatures).forEach(key => {
        this.multiLevelFeatures[key].currentIndex = -1;
      });
      const selected = document.querySelectorAll(".acc-selected");
      selected.forEach(el => {
        el.classList.remove("acc-selected");
        el.setAttribute('aria-pressed', 'false');
      });
      const indicators = document.querySelectorAll('.acc-progress-indicator');
      indicators.forEach(indicator => {
        const dots = indicator.querySelectorAll('.acc-progress-dot');
        dots.forEach(dot => dot.classList.remove('active'));
      });
      
      // Remove focus from active element to fix the persistent focus ring bug
      if (document.activeElement) {
        document.activeElement.blur();
      }
      const styleIds = [
        'acc-bold-text',
        'acc-letter-spacing',
        'acc-line-spacing',
        'acc-large-pointer',
        'acc-highlight-links',
        'acc-highlight-title',
        'acc-readable-text',
        'acc-pause-motion',
        'acc-hide-images',
        'acc-filter-style'
      ];
      styleIds.forEach(id => {
        const style = document.getElementById(id);
        if (style) style.remove();
      });
      document.documentElement.classList.remove(
        'acc-filter',
        'acc-saturation',
        'acc-bold-text',
        'acc-letter-spacing',
        'acc-line-spacing',
        'acc-large-pointer',
        'acc-highlight-links',
        'acc-highlight-title',
        'acc-readable-text',
        'acc-pause-motion',
        'acc-hide-images'
      );
      this.disconnectTextScaleObserver();
      this.currentTextScaleMultiplier = 1;
      const scaledElements = document.querySelectorAll('[data-acc-baseSize]');
      scaledElements.forEach(el => {
        if (!(el instanceof Element) || this.shouldSkipScaling(el)) return;
        el.style.fontSize = '';
        el.removeAttribute('data-acc-baseSize');
      });
      let guide = this.findElement('.acc-rg-container');
      if (guide) {
        guide.remove();
        if (window.__accweb__scrollGuide) {
          document.removeEventListener('mousemove', window.__accweb__scrollGuide);
          delete window.__accweb__scrollGuide;
        }
      }
    },

};
