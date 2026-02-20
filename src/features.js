/** @typedef {import('./index.js').default} AccessibleWebWidget */

const AXE_CORE_VERSION = '4.11.1';
const AXE_CORE_SRC = `https://cdn.jsdelivr.net/npm/axe-core@${AXE_CORE_VERSION}/axe.min.js`;
const AXE_CORE_INTEGRITY = 'sha384-wb3zgvLcZeMFSec08dk7g8K8yDFFAX2uNKVwOUuowwc/wIfE2t6XVUjTEgPrOJCS';
const AXE_RUN_OPTIONS = {
  runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice']
};
const MAX_ANNOTATIONS = 50;
const SYSTEM_PREFERS_REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

/** @type {{ [methodName: string]: (this: AccessibleWebWidget, ...args: any[]) => any }} */
export const featureMethods = {

  getContrastToggleDisplay(index) {
      if (index === 0) {
        return { key: 'light-contrast', label: 'Light Contrast', icon: this.widgetIcons.lightContrast };
      }
      if (index === 1) {
        return { key: 'dark-contrast', label: 'Dark Contrast', icon: this.widgetIcons.darkContrast };
      }
      return { key: null, label: 'Contrast', icon: this.widgetIcons.contrast };
    },

  updateContrastToggleButton(button, index) {
      if (!button) return;
      const display = this.getContrastToggleDisplay(index);
      const iconNode = button.querySelector('svg');
      if (iconNode) {
        iconNode.outerHTML = display.icon;
      } else {
        button.insertAdjacentHTML('afterbegin', display.icon);
      }

      const translatedLabel = this.translate(display.label);
      const labelNode = button.querySelector('.acc-label');
      if (labelNode) {
        labelNode.setAttribute('data-acc-text', display.label);
        labelNode.innerText = translatedLabel;
      }
      button.setAttribute('title', translatedLabel);
      button.setAttribute('aria-label', translatedLabel);
      button.setAttribute('data-contrast-mode', display.key || 'off');
    },

  getSaturationToggleDisplay(index) {
      if (index === 0) {
        return { key: 'low-saturation', label: 'Low Saturation', icon: this.widgetIcons.lowSaturation };
      }
      if (index === 1) {
        return { key: 'high-saturation', label: 'High Saturation', icon: this.widgetIcons.highSaturation };
      }
      return { key: null, label: 'Saturation', icon: this.widgetIcons.saturation };
    },

  updateSaturationToggleButton(button, index) {
      if (!button) return;
      const display = this.getSaturationToggleDisplay(index);
      const iconNode = button.querySelector('svg');
      if (iconNode) {
        iconNode.outerHTML = display.icon;
      } else {
        button.insertAdjacentHTML('afterbegin', display.icon);
      }

      const translatedLabel = this.translate(display.label);
      const labelNode = button.querySelector('.acc-label');
      if (labelNode) {
        labelNode.setAttribute('data-acc-text', display.label);
        labelNode.innerText = translatedLabel;
      }
      button.setAttribute('title', translatedLabel);
      button.setAttribute('aria-label', translatedLabel);
      button.setAttribute('data-saturation-mode', display.key || 'off');
    },

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
          'cursor': `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='98px' height='98px' viewBox='0 0 48 48'%3E%3Cpath fill='%23FFFFFF' d='M27.8 39.7c-.1 0-.2 0-.4-.1s-.4-.3-.6-.5l-3.7-8.6-4.5 4.2c-.1.2-.3.3-.6.3-.1 0-.3 0-.4-.1-.3-.1-.6-.5-.6-.9V12c0-.4.2-.8.6-.9.1-.1.3-.1.4-.1.2 0 .5.1.7.3l16 15c.3.3.4.7.3 1.1-.1.4-.5.6-.9.7l-6.3.6 3.9 8.5c.1.2.1.5 0 .8-.1.2-.3.5-.5.6l-2.9 1.3c-.2-.2-.4-.2-.5-.2z'/%3E%3Cpath fill='%23212121' d='m18 12 16 15-7.7.7 4.5 9.8-2.9 1.3-4.3-9.9L18 34V12m0-2c-.3 0-.5.1-.8.2-.7.3-1.2 1-1.2 1.8v22c0 .8.5 1.5 1.2 1.8.3.2.6.2.8.2.5 0 1-.2 1.4-.5l3.4-3.2 3.1 7.3c.2.5.6.9 1.1 1.1.2.1.5.1.7.1.3 0 .5-.1.8-.2l2.9-1.3c.5-.2.9-.6 1.1-1.1.2-.5.2-1.1 0-1.5l-3.3-7.2 4.9-.4c.8-.1 1.5-.6 1.7-1.3.3-.7.1-1.6-.5-2.1l-16-15c-.3-.5-.8-.7-1.3-.7z'/%3E%3C/svg%3E") 40 15, auto`
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

  enableHighContrastMode(enable = false) {
    const X = ':not(.acc-container):not(.acc-container *):not(.acc-rg-container):not(.acc-rg-container *)';
    const config = {
      id: 'high-contrast-mode',
      css: `
        /* ── Base: force black on white ── */
        body.acc-high-contrast-mode *${X} {
          color: #000 !important;
          background-color: #fff !important;
          background-image: none !important;
          text-shadow: none !important;
          box-shadow: none !important;
        }

        body.acc-high-contrast-mode {
          background: #fff !important;
        }

        /* ── Borders: solid and visible ── */
        body.acc-high-contrast-mode *${X} {
          border-color: #000 !important;
        }

        /* ── Links: underlined, distinct color ── */
        body.acc-high-contrast-mode a${X} {
          color: #00e !important;
          text-decoration: underline !important;
        }

        body.acc-high-contrast-mode a:visited${X} {
          color: #551a8b !important;
        }

        /* ── Headings: bold black ── */
        body.acc-high-contrast-mode :where(h1,h2,h3,h4,h5,h6)${X} {
          color: #000 !important;
          font-weight: 700 !important;
        }

        /* ── Images: keep visible, add border ── */
        body.acc-high-contrast-mode img${X} {
          border: 1px solid #000 !important;
        }

        /* ── Inputs & buttons: high-contrast borders ── */
        body.acc-high-contrast-mode :where(input, textarea, select, button)${X} {
          border: 2px solid #000 !important;
          background: #fff !important;
          color: #000 !important;
        }

        /* ── Focus rings: thick, high-visibility ── */
        body.acc-high-contrast-mode :focus-visible${X} {
          outline: 3px solid #000 !important;
          outline-offset: 2px !important;
        }

        /* ── Tables: visible cell borders ── */
        body.acc-high-contrast-mode :where(table, th, td)${X} {
          border: 1px solid #000 !important;
        }
      `
    };
    this.applyToolStyle({ ...config, enable });
    document.body?.classList.toggle('acc-high-contrast-mode', !!enable);
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
    const bubble = this.violationBubble || this.findElement('.acc-violation-bubble');
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

  ensureMediaQuery(query) {
    if (!query || typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return null;
    }
    if (!this.systemPreferenceMediaQueries) {
      this.systemPreferenceMediaQueries = {};
    }
    if (!this.systemPreferenceMediaQueries[query]) {
      this.systemPreferenceMediaQueries[query] = window.matchMedia(query);
    }
    return this.systemPreferenceMediaQueries[query];
  },

  applySystemMotionPreference(shouldEnable) {
    this.loadConfig();
    if (this.hasExplicitStatePreference('pause-motion')) {
      return false;
    }

    const currentValue = !!this.retrieveState('pause-motion');
    if (currentValue === shouldEnable && this.isSystemControlledPreference('pause-motion')) {
      return false;
    }

    this.updateState({ 'pause-motion': shouldEnable }, { source: 'system' });
    return true;
  },

  detectSystemPreferences() {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;

    const reducedMotionQuery = this.ensureMediaQuery(SYSTEM_PREFERS_REDUCED_MOTION);
    const shouldPauseMotion = !!reducedMotionQuery?.matches;
    const motionChanged = this.applySystemMotionPreference(shouldPauseMotion);

    if (motionChanged) {
      this.applyEnhancements();
    }
  },

  clearSystemPreferenceListeners() {
    const listeners = Array.isArray(this.systemPreferenceListeners) ? this.systemPreferenceListeners : [];
    listeners.forEach((remove) => {
      if (typeof remove === 'function') {
        remove();
      }
    });
    this.systemPreferenceListeners = [];
  },

  setupMediaQueryListeners() {
    this.clearSystemPreferenceListeners();
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;

    const reducedMotionQuery = this.ensureMediaQuery(SYSTEM_PREFERS_REDUCED_MOTION);

    const listen = (mediaQuery, handler) => {
      if (!mediaQuery || typeof handler !== 'function') return;
      if (typeof mediaQuery.addEventListener === 'function') {
        mediaQuery.addEventListener('change', handler);
        this.systemPreferenceListeners.push(() => mediaQuery.removeEventListener('change', handler));
      } else if (typeof mediaQuery.addListener === 'function') {
        mediaQuery.addListener(handler);
        this.systemPreferenceListeners.push(() => mediaQuery.removeListener(handler));
      }
    };

    const onReducedMotionChange = (event) => {
      const changed = this.applySystemMotionPreference(!!event.matches);
      if (changed) {
        this.applyEnhancements();
      }
    };

    listen(reducedMotionQuery, onReducedMotionChange);
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
        event.stopPropagation();
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

  supportsSpeechSynthesis() {
    if (typeof window === 'undefined') return false;
    return (
      'speechSynthesis' in window &&
      typeof window.SpeechSynthesisUtterance !== 'undefined'
    );
  },

  supportsTextToSpeech() {
    return this.supportsSpeechSynthesis();
  },

  normalizeSpeechLanguage(languageCode = 'en') {
    const code = String(languageCode || 'en').toLowerCase();
    const languageMap = {
      en: 'en-US',
      it: 'it-IT',
      fr: 'fr-FR',
      de: 'de-DE',
      es: 'es-ES',
      ru: 'ru-RU',
      pl: 'pl-PL',
      ro: 'ro-RO',
      nl: 'nl-NL',
      uk: 'uk-UA'
    };
    return languageMap[code] || code;
  },

  getNativeTtsRate() {
    const configured = Number(this.nativeTtsConfig?.rate);
    if (!Number.isFinite(configured)) return 1;
    return Math.min(2, Math.max(0.5, configured));
  },

  getNativeTtsPitch() {
    const configured = Number(this.nativeTtsConfig?.pitch);
    if (!Number.isFinite(configured)) return 1;
    return Math.min(2, Math.max(0, configured));
  },

  isElementVisibleForTts(element) {
    if (!(element instanceof Element)) return false;
    const style = window.getComputedStyle(element);
    if (style.display === 'none' || style.visibility === 'hidden') {
      return false;
    }
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  },

  isTtsExcludedElement(element, { allowLandmarkRegions = false } = {}) {
    if (!(element instanceof Element)) return true;
    if (element.closest('.acc-container')) return true;
    if (element.closest('script,style,noscript,template')) return true;
    if (element.closest('[aria-hidden="true"]')) return true;
    if (
      !allowLandmarkRegions &&
      element.closest(
        'nav,header,footer,aside,form,dialog,[role="navigation"],[role="complementary"],[role="search"],[role="menu"],[role="dialog"],[role="alert"],[aria-live]'
      )
    ) {
      return true;
    }
    return false;
  },

  normalizeReadableText(text = '') {
    return String(text)
      .replace(/\s+/g, ' ')
      .replace(/[ \t]+([,.;!?])/g, '$1')
      .trim();
  },

  getTtsCandidateRoots() {
    const selectors = [
      'article',
      'main',
      '[role="main"]',
      '.content',
      '.post',
      '.entry-content',
      '#content'
    ];
    const roots = [];
    const seen = new Set();

    selectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((element) => {
        if (!(element instanceof Element)) return;
        if (this.isTtsExcludedElement(element) || !this.isElementVisibleForTts(element)) return;
        if (seen.has(element)) return;
        seen.add(element);
        roots.push(element);
      });
    });

    return roots;
  },

  getPrimaryContentRoot() {
    if (typeof document === 'undefined') return null;
    const candidates = this.getTtsCandidateRoots();
    if (!candidates.length) {
      const explicitCandidates = Array.from(
        document.querySelectorAll('main,article,[role="main"],#content,.content,.post,.entry-content')
      ).filter((element) =>
        element instanceof Element &&
        !this.isTtsExcludedElement(element) &&
        this.isElementVisibleForTts(element)
      );

      if (explicitCandidates.length) {
        let explicitBest = explicitCandidates[0];
        let explicitBestScore = -1;
        explicitCandidates.forEach((candidate) => {
          const textLength = this.normalizeReadableText(candidate.innerText || candidate.textContent || '').length;
          const rect = candidate.getBoundingClientRect();
          const score = textLength + (rect.width * rect.height * 0.0025);
          if (score > explicitBestScore) {
            explicitBestScore = score;
            explicitBest = candidate;
          }
        });
        return explicitBest;
      }

      if (document.body) {
        const topLevelCandidates = Array.from(document.body.children).filter((element) =>
          element instanceof Element &&
          !element.classList.contains('acc-container') &&
          this.isElementVisibleForTts(element)
        );

        if (topLevelCandidates.length) {
          let best = topLevelCandidates[0];
          let bestScore = -1;
          topLevelCandidates.forEach((candidate) => {
            const textLength = this.normalizeReadableText(candidate.innerText || candidate.textContent || '').length;
            const rect = candidate.getBoundingClientRect();
            const score = textLength + (rect.width * rect.height * 0.0025);
            if (score > bestScore) {
              bestScore = score;
              best = candidate;
            }
          });
          return best;
        }
      }

      return document.body;
    }

    let bestRoot = candidates[0];
    let bestScore = -1;
    candidates.forEach((candidate) => {
      const blocks = this.extractReadableBlocks(candidate);
      const score = blocks.join(' ').length;
      if (score > bestScore) {
        bestScore = score;
        bestRoot = candidate;
      }
    });
    return bestRoot;
  },

  extractReadableBlocks(root) {
    if (!(root instanceof Element)) return [];
    const blockSelector = 'h1,h2,h3,h4,h5,h6,p,li,dt,dd,blockquote,figcaption,caption,th,td';
    const blocks = [];
    root.querySelectorAll(blockSelector).forEach((element) => {
      if (!(element instanceof Element)) return;
      if (this.isTtsExcludedElement(element) || !this.isElementVisibleForTts(element)) return;
      const text = this.normalizeReadableText(element.innerText || element.textContent || '');
      if (text.length < 15) return;
      blocks.push(text);
    });
    return blocks;
  },

  getReadableContent() {
    if (typeof document === 'undefined') return '';
    const candidateRoots = this.getTtsCandidateRoots();
    let bestBlocks = [];
    let bestScore = -1;

    candidateRoots.forEach((root) => {
      const blocks = this.extractReadableBlocks(root);
      if (!blocks.length) return;
      const characterCount = blocks.join(' ').length;
      const score = (blocks.length * 60) + characterCount;
      if (score > bestScore) {
        bestScore = score;
        bestBlocks = blocks;
      }
    });

    if (!bestBlocks.length && document.body) {
      bestBlocks = this.extractReadableBlocks(document.body);
    }

    if (!bestBlocks.length && document.body) {
      const fallback = this.normalizeReadableText(document.body.innerText || document.body.textContent || '');
      return fallback.slice(0, 30000);
    }

    return bestBlocks.join('\n\n').slice(0, 30000);
  },

  splitLongSpeechSegment(segment, maxLength = 240) {
    if (!segment) return [];
    if (segment.length <= maxLength) return [segment];

    const parts = [];
    let remaining = segment;
    while (remaining.length > maxLength) {
      let splitIndex = remaining.lastIndexOf(',', maxLength);
      if (splitIndex < Math.floor(maxLength * 0.5)) {
        splitIndex = remaining.lastIndexOf(' ', maxLength);
      }
      if (splitIndex < Math.floor(maxLength * 0.5)) {
        splitIndex = maxLength;
      }
      parts.push(remaining.slice(0, splitIndex).trim());
      remaining = remaining.slice(splitIndex).trim();
    }
    if (remaining.length) {
      parts.push(remaining);
    }
    return parts.filter(Boolean);
  },

  buildSpeechQueue(text = '') {
    const normalized = this.normalizeReadableText(text);
    if (!normalized) return [];

    const paragraphCandidates = text
      .split(/\n{2,}/)
      .map((paragraph) => this.normalizeReadableText(paragraph))
      .filter(Boolean);

    const paragraphs = paragraphCandidates.length ? paragraphCandidates : [normalized];
    const queue = [];

    paragraphs.forEach((paragraph) => {
      const sentences = paragraph.split(/(?<=[.!?])\s+/).filter(Boolean);
      const sentenceList = sentences.length ? sentences : [paragraph];
      let chunk = '';

      sentenceList.forEach((sentence) => {
        const next = chunk ? `${chunk} ${sentence}` : sentence;
        if (next.length <= 240) {
          chunk = next;
          return;
        }
        if (chunk) {
          queue.push(...this.splitLongSpeechSegment(chunk, 240));
        }
        chunk = sentence;
      });

      if (chunk) {
        queue.push(...this.splitLongSpeechSegment(chunk, 240));
      }
    });

    return queue.slice(0, 300);
  },

  resolveSpeechVoice(languageCode) {
    if (!this.supportsSpeechSynthesis()) return null;
    const synth = window.speechSynthesis;
    const voices = synth.getVoices?.() || [];
    if (!voices.length) return null;

    const preferredVoiceName = String(this.nativeTtsConfig?.preferredVoiceName || '').trim().toLowerCase();
    if (preferredVoiceName) {
      const byExactName = voices.find((voice) => String(voice.name || '').trim().toLowerCase() === preferredVoiceName);
      if (byExactName) return byExactName;
      const byNameContains = voices.find((voice) => String(voice.name || '').toLowerCase().includes(preferredVoiceName));
      if (byNameContains) return byNameContains;
    }

    const configuredVoiceLang = String(this.nativeTtsConfig?.preferredVoiceLang || '').trim();
    const targetLanguage = configuredVoiceLang || languageCode;
    const normalized = this.normalizeSpeechLanguage(targetLanguage).toLowerCase();
    const primary = normalized.split('-')[0];
    const localExact = voices.find((voice) => (
      voice.localService &&
      String(voice.lang || '').toLowerCase() === normalized
    ));
    const exact = voices.find((voice) => String(voice.lang || '').toLowerCase() === normalized);
    const localByPrimary = voices.find((voice) => (
      voice.localService &&
      String(voice.lang || '').toLowerCase().startsWith(primary)
    ));
    const byPrimary = voices.find((voice) => String(voice.lang || '').toLowerCase().startsWith(primary));
    const defaultVoice = voices.find((voice) => voice.default);
    return localExact || exact || localByPrimary || byPrimary || defaultVoice || voices[0];
  },

  getSpeechTargetFromEvent(event) {
    const target = event?.target;
    if (!(target instanceof Element)) return null;
    if (target.closest('.acc-container')) return null;

    const block = target.closest('h1,h2,h3,h4,h5,h6,p,li,dt,dd,blockquote,figcaption,caption,th,td,div,section');
    if (!(block instanceof Element)) return null;
    if (this.isTtsExcludedElement(block, { allowLandmarkRegions: true }) || !this.isElementVisibleForTts(block)) return null;

    const text = this.normalizeReadableText(block.innerText || block.textContent || '');
    if (text.length < 2) return null;

    return {
      element: block,
      text: text.slice(0, 30000)
    };
  },

  setActiveSpeechTarget(element = null) {
    if (this.ttsActiveTarget && this.ttsActiveTarget !== element) {
      this.ttsActiveTarget.classList.remove('acc-tts-active-block');
    }
    this.ttsActiveTarget = element;
    if (this.ttsActiveTarget) {
      this.ttsActiveTarget.classList.add('acc-tts-active-block');
    }
  },

  startTtsClickMode() {
    if (typeof document === 'undefined' || this.ttsClickListener) return;
    this.ttsClickListener = (event) => {
      this.handleTtsClick(event);
    };
    document.addEventListener('click', this.ttsClickListener, true);
    document.body?.classList.add('acc-tts-click-mode');
  },

  stopTtsClickMode() {
    if (typeof document === 'undefined') return;
    if (this.ttsClickListener) {
      document.removeEventListener('click', this.ttsClickListener, true);
      this.ttsClickListener = null;
    }
    document.body?.classList.remove('acc-tts-click-mode');
    this.setActiveSpeechTarget(null);
  },

  handleTtsClick(event) {
    if (!this.retrieveState('text-to-speech')) return;
    const target = this.getSpeechTargetFromEvent(event);
    if (!target) return;

    this.setActiveSpeechTarget(target.element);
    this.ttsTextCache = target.text;
    this.startSpeechPlayback({ restart: true });
  },

  ensureTtsQueue() {
    const text = this.ttsTextCache || this.getReadableContent();
    if (!text) {
      this.ttsQueue = [];
      this.ttsQueueIndex = 0;
      return false;
    }
    this.ttsTextCache = text;
    this.ttsQueue = this.buildSpeechQueue(text);
    this.ttsQueueIndex = 0;
    return this.ttsQueue.length > 0;
  },

  speakNextTtsChunk(sessionId) {
    if (!this.supportsSpeechSynthesis()) return;
    if (sessionId !== this.ttsSessionId) return;

    if (this.ttsQueueIndex >= this.ttsQueue.length) {
      this.ttsStatus = 'stopped';
      this.setActiveSpeechTarget(null);
      return;
    }

    const synth = window.speechSynthesis;
    const chunk = this.ttsQueue[this.ttsQueueIndex];
    if (!chunk) {
      this.ttsQueueIndex += 1;
      this.speakNextTtsChunk(sessionId);
      return;
    }

    const utterance = new window.SpeechSynthesisUtterance(chunk);
    utterance.lang = this.normalizeSpeechLanguage(this.loadConfig().lang || 'en');
    if (!this.ttsVoice || this.ttsVoice.lang?.toLowerCase() !== utterance.lang.toLowerCase()) {
      this.ttsVoice = this.resolveSpeechVoice(utterance.lang);
    }
    if (this.ttsVoice) {
      utterance.voice = this.ttsVoice;
    }
    utterance.rate = this.getNativeTtsRate();
    utterance.pitch = this.getNativeTtsPitch();

    utterance.onstart = () => {
      if (sessionId !== this.ttsSessionId) return;
      this.ttsStatus = 'reading';
    };
    utterance.onpause = () => {
      if (sessionId !== this.ttsSessionId) return;
      this.ttsStatus = 'paused';
    };
    utterance.onresume = () => {
      if (sessionId !== this.ttsSessionId) return;
      this.ttsStatus = 'reading';
    };
    utterance.onend = () => {
      if (sessionId !== this.ttsSessionId) return;
      this.ttsQueueIndex += 1;
      this.speakNextTtsChunk(sessionId);
    };
    utterance.onerror = () => {
      if (sessionId !== this.ttsSessionId) return;
      this.ttsStatus = 'stopped';
      this.setActiveSpeechTarget(null);
    };

    this.ttsUtterance = utterance;
    synth.speak(utterance);
  },

  startNativeSpeechPlayback({ restart = false } = {}) {
    if (!this.supportsSpeechSynthesis()) return;
    const synth = window.speechSynthesis;

    if (!restart && synth.paused) {
      synth.resume();
      this.ttsStatus = 'reading';
      return;
    }

    const hasQueue = restart || !this.ttsQueue.length || this.ttsQueueIndex >= this.ttsQueue.length
      ? this.ensureTtsQueue()
      : true;
    if (!hasQueue) {
      this.stopSpeech();
      return;
    }

    const sessionId = this.ttsSessionId + 1;
    this.ttsSessionId = sessionId;
    synth.cancel();
    this.ttsStatus = 'reading';
    this.speakNextTtsChunk(sessionId);
  },

  startSpeechPlayback({ restart = false } = {}) {
    this.startNativeSpeechPlayback({ restart });
  },

  pauseSpeech() {
    if (!this.supportsSpeechSynthesis()) return;
    const synth = window.speechSynthesis;
    if (synth.speaking && !synth.paused) {
      synth.pause();
      this.ttsStatus = 'paused';
    }
  },

  resumeSpeech() {
    if (!this.supportsSpeechSynthesis()) return;
    const synth = window.speechSynthesis;
    if (synth.paused) {
      synth.resume();
      this.ttsStatus = 'reading';
      return;
    }
    this.startSpeechPlayback({ restart: false });
  },

  stopSpeech() {
    const synth = this.supportsSpeechSynthesis() ? window.speechSynthesis : null;
    this.ttsSessionId += 1;
    if (synth && (synth.speaking || synth.paused)) {
      synth.cancel();
    }
    this.ttsUtterance = null;
    this.ttsQueueIndex = 0;
    this.ttsStatus = 'stopped';
    this.setActiveSpeechTarget(null);
  },

  enableTextToSpeech(enable = false) {
    if (!this.supportsTextToSpeech()) return;
    const isUserToggle = this.userInitiatedToggleKey === 'text-to-speech';

    if (!enable) {
      if (isUserToggle) this.announceTtsState(false);
      this.stopSpeech();
      this.stopTtsClickMode();
      return;
    }

    const synth = window.speechSynthesis;
    if (synth?.getVoices) {
      synth.getVoices();
    }

    this.startTtsClickMode();
    this.ttsStatus = 'idle';
    if (isUserToggle) this.announceTtsState(true);
  },

  announceTtsState(active) {
    if (!this.supportsTextToSpeech()) return;
    const synth = window.speechSynthesis;
    if (!synth) return;
    const msg = active
      ? this.translate('Text to Speech On')
      : this.translate('Text to Speech Off');
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(msg);
    const lang = this.normalizeSpeechLanguage(this.loadConfig().lang || 'en');
    utterance.lang = lang;
    const voice = this.resolveSpeechVoice(lang);
    if (voice) {
      utterance.voice = voice;
    }
    utterance.rate = this.getNativeTtsRate();
    utterance.pitch = this.getNativeTtsPitch();
    synth.speak(utterance);
  },

  ensureAnnotationLayer() {
    if (this.annotationLayer && document.body.contains(this.annotationLayer)) {
      return this.annotationLayer;
    }
    const layer = document.createElement('div');
    layer.className = 'acc-annotation-layer acc-container';
    layer.setAttribute('aria-hidden', 'true');
    document.body.appendChild(layer);
    this.annotationLayer = layer;
    return layer;
  },

  resolveAnnotationTarget(selector) {
    if (!selector || typeof selector !== 'string') return null;
    try {
      const element = document.querySelector(selector);
      if (!element || element.closest('.acc-container')) return null;
      return element;
    } catch {
      return null;
    }
  },

  buildAnnotationEntries(results = {}) {
    const violations = Array.isArray(results.violations) ? results.violations : [];
    const entries = [];
    const seen = new Set();

    violations.forEach((violation) => {
      const nodes = Array.isArray(violation.nodes) ? violation.nodes : [];
      nodes.forEach((node) => {
        const targets = Array.isArray(node.target) ? node.target : [];
        const selector = targets.find((target) => typeof target === 'string' && target.trim().length);
        if (!selector) return;
        const key = `${selector}::${violation.id || violation.help || ''}`;
        if (seen.has(key)) return;

        const element = this.resolveAnnotationTarget(selector);
        if (!element) return;
        seen.add(key);
        entries.push({
          selector,
          element,
          impact: violation.impact || 'minor',
          title: violation.help || this.translate('Issue'),
          description: violation.description || '',
          helpUrl: violation.helpUrl || '',
          failureSummary: node.failureSummary || ''
        });
      });
    });

    return entries.slice(0, MAX_ANNOTATIONS);
  },

  createAnnotationMarker(annotation) {
    const marker = document.createElement('button');
    marker.type = 'button';
    marker.className = 'acc-annotation-marker';
    marker.dataset.impact = annotation.impact || 'minor';
    marker.setAttribute('aria-label', annotation.title);
    marker.title = annotation.title;
    marker.innerHTML = '';

    marker.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      this.showAnnotationPopup(annotation, marker);
    });

    return marker;
  },

  positionAnnotationPopup(popup, marker) {
    if (!popup || !marker) return;
    const markerRect = marker.getBoundingClientRect();
    const popupWidth = popup.offsetWidth || 300;
    const popupHeight = popup.offsetHeight || 180;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const gap = 10;

    let left = window.scrollX + markerRect.left + gap;
    let top = window.scrollY + markerRect.bottom + gap;

    if (left + popupWidth > window.scrollX + viewportWidth - gap) {
      left = window.scrollX + viewportWidth - popupWidth - gap;
    }
    if (left < window.scrollX + gap) {
      left = window.scrollX + gap;
    }

    if (top + popupHeight > window.scrollY + viewportHeight - gap) {
      top = window.scrollY + markerRect.top - popupHeight - gap;
    }
    if (top < window.scrollY + gap) {
      top = window.scrollY + gap;
    }

    popup.style.left = `${left}px`;
    popup.style.top = `${top}px`;
  },

  clearAnnotationPopup() {
    if (this.annotationPopup) {
      this.annotationPopup.remove();
      this.annotationPopup = null;
    }
  },

  showAnnotationPopup(annotation, marker) {
    if (!annotation || !marker || !this.annotationLayer) return;
    this.clearAnnotationPopup();

    const popup = document.createElement('div');
    popup.className = 'acc-annotation-popup';
    popup.innerHTML = `
      <div class="acc-annotation-popup-header">
        <h3 class="acc-annotation-popup-title">${this.escapeHtml(annotation.title)}</h3>
        <button type="button" class="acc-annotation-popup-close" aria-label="${this.translate('Close')}">${this.widgetIcons.close}</button>
      </div>
      <p><strong>${this.translate(this.capitalizeFirst(annotation.impact))}</strong></p>
      <p>${this.escapeHtml(annotation.description)}</p>
      ${annotation.failureSummary ? `<p><strong>${this.translate('Issue')}:</strong> ${this.escapeHtml(annotation.failureSummary)}</p>` : ''}
      ${annotation.helpUrl ? `<p><a href="${annotation.helpUrl}" target="_blank" rel="noopener">${this.translate('How to Fix')} →</a></p>` : ''}
    `;
    popup.__accMarker = marker;

    const closeButton = popup.querySelector('.acc-annotation-popup-close');
    closeButton?.addEventListener('click', () => this.clearAnnotationPopup());

    this.annotationLayer.appendChild(popup);
    this.annotationPopup = popup;
    this.positionAnnotationPopup(popup, marker);
  },

  positionAnnotations() {
    if (!Array.isArray(this.annotationItems) || !this.annotationItems.length) return;

    this.annotationItems.forEach((item) => {
      if (!item?.target || !item?.marker) return;
      if (!document.contains(item.target)) {
        item.marker.hidden = true;
        return;
      }

      const rect = item.target.getBoundingClientRect();
      const outOfView = (
        rect.width <= 0 ||
        rect.height <= 0 ||
        rect.bottom < 0 ||
        rect.top > window.innerHeight ||
        rect.right < 0 ||
        rect.left > window.innerWidth
      );

      if (outOfView) {
        item.marker.hidden = true;
        return;
      }

      item.marker.hidden = false;
      item.marker.style.top = `${window.scrollY + rect.top + Math.min(16, rect.height / 2)}px`;
      item.marker.style.left = `${window.scrollX + rect.right}px`;
    });

    if (this.annotationPopup?.__accMarker && !this.annotationPopup.__accMarker.hidden) {
      this.positionAnnotationPopup(this.annotationPopup, this.annotationPopup.__accMarker);
    }
  },

  enableAnnotations(enable = false) {
    if (!enable) {
      this.disableAnnotations();
      return;
    }

    const requestId = ++this.annotationRequestId;
    this.disableAnnotations({ cancelPending: false });
    const layer = this.ensureAnnotationLayer();

    this.runBackgroundAxeScan()
      .then((results) => {
        if (requestId !== this.annotationRequestId || !this.retrieveState('annotations')) {
          return;
        }
        const annotations = this.buildAnnotationEntries(results);
        this.annotationItems = annotations.map((annotation) => {
          const marker = this.createAnnotationMarker(annotation);
          layer.appendChild(marker);
          return {
            marker,
            target: annotation.element,
            data: annotation
          };
        });

        if (!this.annotationRepositionHandler) {
          this.annotationRepositionHandler = this.throttle(() => this.positionAnnotations(), 80);
        }
        window.addEventListener('scroll', this.annotationRepositionHandler, { passive: true });
        window.addEventListener('resize', this.annotationRepositionHandler, { passive: true });

        if (!this.annotationOutsideHandler) {
          this.annotationOutsideHandler = (event) => {
            if (!this.annotationPopup) return;
            const clickedPopup = this.annotationPopup.contains(event.target);
            const clickedMarker = event.target?.closest?.('.acc-annotation-marker');
            if (!clickedPopup && !clickedMarker) {
              this.clearAnnotationPopup();
            }
          };
        }
        document.addEventListener('click', this.annotationOutsideHandler, true);

        this.positionAnnotations();
      })
      .catch((error) => {
        console.warn('Failed to render annotations:', error);
      });
  },

  disableAnnotations({ cancelPending = true } = {}) {
    if (cancelPending) {
      this.annotationRequestId += 1;
    }
    this.clearAnnotationPopup();

    if (this.annotationOutsideHandler) {
      document.removeEventListener('click', this.annotationOutsideHandler, true);
    }
    if (this.annotationRepositionHandler) {
      window.removeEventListener('scroll', this.annotationRepositionHandler);
      window.removeEventListener('resize', this.annotationRepositionHandler);
    }

    if (this.annotationLayer) {
      this.annotationLayer.remove();
      this.annotationLayer = null;
    }

    this.annotationItems = [];
  },


  clearSimpleLayoutDomMutations() {
    if (this.simpleLayoutRoot) {
      this.simpleLayoutRoot.classList.remove('acc-simple-layout-root');
      this.simpleLayoutRoot = null;
    }

    if (Array.isArray(this.simpleLayoutHiddenElements)) {
      this.simpleLayoutHiddenElements.forEach((element) => {
        if (element && element.classList) {
          element.classList.remove('acc-simple-layout-hidden');
        }
      });
    }
    this.simpleLayoutHiddenElements = [];
  },

  applySimpleLayoutDomMutations() {
    const root = this.getPrimaryContentRoot();
    if (!root || !document.body) return;

    this.simpleLayoutRoot = root;
    root.classList.add('acc-simple-layout-root');

    const hiddenElements = [];
    Array.from(document.body.children).forEach((child) => {
      if (!(child instanceof Element)) return;
      if (child.classList.contains('acc-container')) return;
      if (child === root || child.contains(root)) return;
      child.classList.add('acc-simple-layout-hidden');
      hiddenElements.push(child);
    });

    const clutterSelectors = [
      'aside',
      'nav',
      'form',
      'footer',
      '[role="complementary"]',
      '[role="search"]',
      '[role="contentinfo"]',
      '[aria-hidden="true"]',
      '[class*="cookie"]',
      '[id*="cookie"]',
      '[class*="banner"]',
      '[id*="banner"]',
      '[class*="popup"]',
      '[id*="popup"]',
      '[class*="modal"]',
      '[id*="modal"]',
      '[class*="advert"]',
      '[id*="advert"]',
      '[class*="ads"]',
      '[id*="ads"]',
      '[class*="sidebar"]',
      '[id*="sidebar"]',
      '[class*="social"]',
      '[id*="social"]',
      '[class*="share"]',
      '[id*="share"]',
      '[class*="newsletter"]',
      '[id*="newsletter"]',
      '[class*="related"]',
      '[id*="related"]',
      '[class*="comment"]',
      '[id*="comment"]',
      '[class*="footer"]',
      '[id*="footer"]',
      '[class*="promo"]',
      '[id*="promo"]'
    ].join(',');

    root.querySelectorAll(clutterSelectors).forEach((element) => {
      if (!(element instanceof Element)) return;
      if (element.closest('.acc-container')) return;
      if (element === root) return;
      element.classList.add('acc-simple-layout-hidden');
      hiddenElements.push(element);
    });

    this.simpleLayoutHiddenElements = hiddenElements;
  },

  enableSimpleLayout(enable = false) {
    const S = 'body.acc-simple-layout-enabled';
    const R = `${S} .acc-simple-layout-root`;
    const X = ':not(.acc-container):not(.acc-container *)';
    const config = {
      id: 'simple-layout',
      css: `
        /* ── Body & root container ── */
        ${S} {
          background: #fff !important;
        }

        ${S} .acc-simple-layout-hidden {
          display: none !important;
        }

        ${R} {
          max-width: 72ch !important;
          margin: 0 auto !important;
          padding: clamp(20px, 4vw, 40px) 20px !important;
          position: relative !important;
          border-radius: 0 !important;
          box-shadow: none !important;
        }

        /* ── Universal decoration strip ── */
        ${R} :where(*)${X} {
          background-color: transparent !important;
          background-image: none !important;
          box-shadow: none !important;
          text-shadow: none !important;
          border-color: transparent !important;
        }

        /* ── Layout linearization ── */
        ${R} :where(div, section, article, header, main, footer, figure, figcaption, details, summary, hgroup, search)${X} {
          display: block !important;
          position: static !important;
          float: none !important;
          transform: none !important;
          columns: auto !important;
          column-count: auto !important;
          width: auto !important;
          min-width: 0 !important;
          max-width: 100% !important;
          margin-left: 0 !important;
          margin-right: 0 !important;
          padding-left: 0 !important;
          padding-right: 0 !important;
        }

        /* ── Color reset ── */
        ${R} :where(h1, h2, h3, h4, h5, h6)${X} {
          color: #111 !important;
        }

        ${R} :where(p, li, dt, dd, td, th, span, blockquote, figcaption, label, summary, details)${X} {
          color: #222 !important;
        }

        ${R} :where(a)${X} {
          color: #1a0dab !important;
        }

        ${R} :where(a:visited)${X} {
          color: #681da8 !important;
        }

        /* ── Typography ── */
        ${R} :where(*)${X} {
          font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
        }

        ${R} :where(p, li, dt, dd, blockquote, figcaption, td, th, label, summary)${X} {
          font-size: clamp(1rem, 0.95rem + 0.25vw, 1.125rem) !important;
          line-height: 1.8 !important;
          letter-spacing: 0.01em !important;
          max-width: 70ch !important;
        }

        ${R} :where(h1)${X} {
          font-size: 2em !important;
          line-height: 1.2 !important;
          margin: 0.67em 0 !important;
          font-weight: 700 !important;
        }

        ${R} :where(h2)${X} {
          font-size: 1.5em !important;
          line-height: 1.25 !important;
          margin: 0.83em 0 !important;
          font-weight: 700 !important;
        }

        ${R} :where(h3)${X} {
          font-size: 1.25em !important;
          line-height: 1.3 !important;
          margin: 1em 0 !important;
          font-weight: 600 !important;
        }

        ${R} :where(h4, h5, h6)${X} {
          font-size: 1.1em !important;
          line-height: 1.35 !important;
          margin: 1em 0 !important;
          font-weight: 600 !important;
        }

        /* ── Decorative images hidden ── */
        ${R} :where(img[role="presentation"], img[alt=""], img:not([alt]), svg[aria-hidden="true"])${X} {
          display: none !important;
        }

        /* ── Meaningful borders restored ── */
        ${R} :where(hr)${X} {
          border: none !important;
          border-top: 1px solid #d1d5db !important;
          margin: 1.5em 0 !important;
        }

        ${R} :where(blockquote)${X} {
          border-left: 4px solid #d1d5db !important;
          padding-left: 1em !important;
          margin-left: 0 !important;
          font-style: italic !important;
        }

        ${R} :where(table)${X} {
          border-collapse: collapse !important;
          max-width: 100% !important;
          overflow-x: auto !important;
          display: table !important;
        }

        ${R} :where(th, td)${X} {
          border: 1px solid #d1d5db !important;
          padding: 8px 12px !important;
          text-align: left !important;
        }

        ${R} :where(th)${X} {
          font-weight: 600 !important;
          background: #f8f9fa !important;
        }

        /* ── Lists ── */
        ${R} :where(ul, ol)${X} {
          padding-left: 1.5em !important;
          margin: 0.75em 0 !important;
        }

        ${R} :where(li)${X} {
          display: list-item !important;
          margin: 0.25em 0 !important;
        }

        /* ── Code blocks ── */
        ${R} :where(pre)${X} {
          background: #f6f8fa !important;
          border-radius: 6px !important;
          padding: 1em !important;
          overflow-x: auto !important;
          max-width: 100% !important;
        }

        ${R} :where(code, kbd, samp)${X} {
          font-family: ui-monospace, "SFMono-Regular", "SF Mono", Menlo, Consolas, "Liberation Mono", monospace !important;
          font-size: 0.9em !important;
        }

        ${R} :where(code):not(pre code)${X} {
          background: #f0f2f5 !important;
          padding: 0.15em 0.4em !important;
          border-radius: 3px !important;
        }

        /* ── Empty wrapper collapse ── */
        ${R} :where(div:empty)${X} {
          display: none !important;
        }

        /* ── Media ── */
        ${R} :where(img, video, iframe)${X} {
          max-width: 100% !important;
          height: auto !important;
          border-radius: 4px !important;
        }
      `
    };

    this.applyToolStyle({ ...config, enable });
    document.body?.classList.toggle('acc-simple-layout-enabled', !!enable);

    this.clearSimpleLayoutDomMutations();
    if (enable) {
      this.applySimpleLayoutDomMutations();
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
      this.enableHighContrastMode(states && states['high-contrast-mode']);
      this.enableAnnotations(states && states['annotations']);
      this.enableTextToSpeech(states && states['text-to-speech']);
      this.enableSimpleLayout(states && states['simple-layout']);
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
      const contrastFeature = this.multiLevelFeatures?.['contrast-toggle'];
      const contrastButton = menu.querySelector('.acc-btn[data-key="contrast-toggle"]');
      if (contrastFeature) {
        const contrastIndex = contrastFeature.values.indexOf(activeKey);
        contrastFeature.currentIndex = contrastIndex;
        this.updateContrastToggleButton(contrastButton, contrastIndex);
        if (contrastButton) {
          const isContrastActive = contrastIndex >= 0;
          contrastButton.classList.toggle('acc-selected', isContrastActive);
          contrastButton.setAttribute('aria-pressed', isContrastActive ? 'true' : 'false');
          const indicator = contrastButton.querySelector('.acc-progress-indicator[data-feature="contrast-toggle"]');
          if (indicator) {
            const dots = indicator.querySelectorAll('.acc-progress-dot');
            dots.forEach((dot, index) => {
              dot.classList.toggle('active', index === contrastIndex);
            });
          }
        }
      }
      const saturationFeature = this.multiLevelFeatures?.['saturation-toggle'];
      const saturationButton = menu.querySelector('.acc-btn[data-key="saturation-toggle"]');
      if (saturationFeature) {
        const saturationIndex = saturationFeature.values.indexOf(activeKey);
        saturationFeature.currentIndex = saturationIndex;
        this.updateSaturationToggleButton(saturationButton, saturationIndex);
        if (saturationButton) {
          const isSaturationActive = saturationIndex >= 0;
          saturationButton.classList.toggle('acc-selected', isSaturationActive);
          saturationButton.setAttribute('aria-pressed', isSaturationActive ? 'true' : 'false');
          const indicator = saturationButton.querySelector('.acc-progress-indicator[data-feature="saturation-toggle"]');
          if (indicator) {
            const dots = indicator.querySelectorAll('.acc-progress-dot');
            dots.forEach((dot, index) => {
              dot.classList.toggle('active', index === saturationIndex);
            });
          }
        }
      }
      this.colorFilterKeys.forEach(filterKey => {
        const button = menu.querySelector(`.acc-btn[data-key="${filterKey}"]`);
        if (!button) return;
        const isActive = filterKey === activeKey;
        button.classList.toggle('acc-selected', isActive);
        button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      });
    },

  updateColorFilterState(activeKey = null, source = 'user') {
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
        this.updateState(payload, { source });
      }
      this.activeColorFilterKey = activeKey;
    },

  computeFilteredBodyColor(filterKey) {
      const bg = window.getComputedStyle(document.body).backgroundColor;
      const m = bg.match(/rgba?\(\s*(\d+),\s*(\d+),\s*(\d+)/);
      if (!m) return null;
      let r = +m[1], g = +m[2], b = +m[3];
      const clamp = (v) => Math.min(255, Math.max(0, Math.round(v)));

      switch (filterKey) {
        case 'invert-colors':
          r = 255 - r; g = 255 - g; b = 255 - b;
          break;
        case 'dark-contrast': {
          // filter: contrast(150%) brightness(0.8) — applied left to right
          r = 128 + (r - 128) * 1.5; g = 128 + (g - 128) * 1.5; b = 128 + (b - 128) * 1.5;
          r *= 0.8; g *= 0.8; b *= 0.8;
          break;
        }
        case 'light-contrast': {
          // filter: contrast(125%) brightness(1.2)
          r = 128 + (r - 128) * 1.25; g = 128 + (g - 128) * 1.25; b = 128 + (b - 128) * 1.25;
          r *= 1.2; g *= 1.2; b *= 1.2;
          break;
        }
        case 'low-saturation': {
          // filter: saturate(50%) — use standard saturate matrix with s=0.5
          const s = 0.5;
          const nr = (0.213 + 0.787 * s) * r + (0.715 - 0.715 * s) * g + (0.072 - 0.072 * s) * b;
          const ng = (0.213 - 0.213 * s) * r + (0.715 + 0.285 * s) * g + (0.072 - 0.072 * s) * b;
          const nb = (0.213 - 0.213 * s) * r + (0.715 - 0.715 * s) * g + (0.072 + 0.928 * s) * b;
          r = nr; g = ng; b = nb;
          break;
        }
        case 'high-saturation': {
          // filter: saturate(200%) — use standard saturate matrix with s=2
          const s2 = 2;
          const hr = (0.213 + 0.787 * s2) * r + (0.715 - 0.715 * s2) * g + (0.072 - 0.072 * s2) * b;
          const hg = (0.213 - 0.213 * s2) * r + (0.715 + 0.285 * s2) * g + (0.072 - 0.072 * s2) * b;
          const hb = (0.213 - 0.213 * s2) * r + (0.715 - 0.715 * s2) * g + (0.072 + 0.928 * s2) * b;
          r = hr; g = hg; b = hb;
          break;
        }
        default:
          return null;
      }
      r = clamp(r); g = clamp(g); b = clamp(b);
      // Skip if the result is the same as the original (no visible change)
      if (r === +m[1] && g === +m[2] && b === +m[3]) return null;
      return `rgb(${r},${g},${b})`;
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
        selector: filter.selector || 'body > *:not(.acc-container):not(.acc-rg-container):not(#acc-skip-link)'
      };
      let css = this.buildCSS(adjustedFilter);

      // Compute a filtered body background so the body itself matches
      // the visual filter applied to its children.
      const filteredBg = this.computeFilteredBodyColor(activeKey);
      if (filteredBg) {
        css += `body{background-color:${filteredBg}!important;}`;
      }

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
      const feature = this.multiLevelFeatures[featureKey];
      if (!feature || !button) return;

      if (featureKey === 'contrast-toggle' || featureKey === 'saturation-toggle') {
        const newIndex = feature.currentIndex + 1;
        const newActiveKey = newIndex >= feature.levels ? null : feature.values[newIndex];
        this.updateColorFilterState(newActiveKey);
        this.setColorFilterUI(button.closest('.acc-menu'), newActiveKey);
        this.applyVisualFilters();
        return;
      }

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
      this.saveConfig({ states: {}, systemDefaults: {} });
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
      const menu = document.querySelector('.acc-menu');
      if (menu) {
        this.setColorFilterUI(menu, null);
      }
      
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
        'acc-filter-style',
        'acc-simple-layout'
      ];
      styleIds.forEach(id => {
        const style = document.getElementById(id);
        if (style) style.remove();
      });
      this.clearSimpleLayoutDomMutations();
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
        'acc-hide-images',
        'acc-high-contrast-mode',
        'acc-simple-layout'
      );
      document.body?.classList.remove('acc-simple-layout-enabled');
      document.body?.classList.remove('acc-high-contrast-mode');
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
      this.disableAnnotations();
      this.stopSpeech();
      this.stopTtsClickMode();
      this.clearSystemPreferenceListeners();
      this.detectSystemPreferences();
      this.setupMediaQueryListeners();
      this.updateViolationBubble(this.axeScanResults);
    },

};
