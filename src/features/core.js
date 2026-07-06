/** @typedef {import('../index.js').default} AccessibleWebWidget */

import { DYSLEXIA_FONT_SRC } from '../constants/remote-defaults.js';

const SYSTEM_PREFERS_REDUCED_MOTION = '(prefers-reduced-motion: reduce)';
const SYSTEM_PREFERS_CONTRAST = '(prefers-contrast: more)';

/** @type {{ [methodName: string]: (this: AccessibleWebWidget, ...args: any[]) => any }} */
export const coreFeatureMethods = {

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

  collectDirectTextParents(rootElement = document.body) {
      const directTextParents = new Set();
      if (typeof document === 'undefined' || typeof NodeFilter === 'undefined') {
        return directTextParents;
      }

      const root = rootElement instanceof Element ? rootElement : document.body;
      if (!root) return directTextParents;

      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode: (node) => {
          if (!node || !node.textContent || !node.textContent.trim()) {
            return NodeFilter.FILTER_REJECT;
          }
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          if (this.shouldSkipScaling(parent)) return NodeFilter.FILTER_REJECT;
          if (parent.closest('script,style,noscript,textarea,pre,code,svg')) {
            return NodeFilter.FILTER_REJECT;
          }
          if (parent.matches(this.textScaleSelectors)) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      });

      let currentNode = walker.nextNode();
      while (currentNode) {
        const parent = currentNode.parentElement;
        if (parent) {
          directTextParents.add(parent);
        }
        currentNode = walker.nextNode();
      }

      return directTextParents;
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
        if (Math.abs(this.currentTextScaleMultiplier - 1) < 0.001) {
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
            this.collectDirectTextParents(node).forEach(el => pending.add(el));
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
        const numericMultiply = Number(multiply);
        const resolvedMultiply = Number.isFinite(numericMultiply) && numericMultiply > 0 ? numericMultiply : 1;
        const isDefaultScale = Math.abs(resolvedMultiply - 1) < 0.001;
        this.currentTextScaleMultiplier = resolvedMultiply;
        if (!isDefaultScale) {
          this.ensureTextScaleObserver();
          const elements = document.querySelectorAll(this.textScaleSelectors);
          elements.forEach(el => this.applyScaleToElement(el, resolvedMultiply));
          this.collectDirectTextParents(document.body).forEach(el => this.applyScaleToElement(el, resolvedMultiply));
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

  clampTextScalePercent(percent) {
      const min = Number(this.textScaleMinPercent) || 80;
      const max = Number(this.textScaleMaxPercent) || 150;
      const step = Number(this.textScaleStepPercent) || 5;
      const numeric = Number(percent);
      if (!Number.isFinite(numeric)) return 100;
      const snapped = Math.round((numeric - min) / step) * step + min;
      return Math.min(max, Math.max(min, snapped));
    },

  getTextScalePercent(scaleValue = 1) {
      if (scaleValue === false || scaleValue === null || typeof scaleValue === 'undefined') {
        return this.clampTextScalePercent(100);
      }
      const numeric = Number(scaleValue);
      if (!Number.isFinite(numeric)) {
        return this.clampTextScalePercent(100);
      }
      if (numeric <= 0) {
        return this.clampTextScalePercent(100);
      }
      const percent = numeric > 10 ? numeric : numeric * 100;
      return this.clampTextScalePercent(percent);
    },

  syncTextScaleControlUI(menu, scaleValue = 1) {
      if (!menu || !menu.querySelector) return;
      const range = menu.querySelector('.acc-text-scale-range');
      const label = menu.querySelector('.acc-text-scale-percent');
      const percent = this.getTextScalePercent(scaleValue);
      if (range) {
        const min = Number(this.textScaleMinPercent) || 80;
        const max = Number(this.textScaleMaxPercent) || 150;
        const progress = ((percent - min) / (max - min)) * 100;
        range.value = String(percent);
        range.style.setProperty('--acc-text-scale-progress', `${Math.max(0, Math.min(100, progress))}%`);
      }
      if (label) {
        label.textContent = `${percent}%`;
      }
    },

  setTextScaleFromPercent(percent, options = {}) {
      const shouldPersist = options.persist !== false;
      const clampedPercent = this.getTextScalePercent(percent);
      const multiplier = Number((clampedPercent / 100).toFixed(2));

      this.scaleText(multiplier);

      if (shouldPersist) {
        this.updateState({ 'text-scale': multiplier });
      }

      return multiplier;
    },

  enableBoldText(enable = false) {
      const contentSelector = [
        '*',
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
      const config = {
        id: "bold-text",
        selector: "body",
        childrenSelector: [contentSelector],
        styles: { 'font-weight': '700' },
        css: `
          .acc-container, .acc-container *, .acc-menu, .acc-menu * {
            font-weight: inherit !important;
          }
          input::placeholder, textarea::placeholder {
            font-weight: 700 !important;
          }
        `
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
      if (this.hasStyle('acc-readable-text-font')) {
        this.readableFontLoaded = true;
        return;
      }
      const rawFontUrl = typeof this.options?.dyslexiaFontUrl === 'string' ? this.options.dyslexiaFontUrl.trim() : '';
      const customFontUrl = rawFontUrl && !/["'()\\]/.test(rawFontUrl) ? rawFontUrl : '';
      const fontSrc = customFontUrl ? `url("${customFontUrl}")` : DYSLEXIA_FONT_SRC;
      if (!fontSrc) {
        // No font source available (WordPress build without a configured
        // dyslexiaFontUrl): the feature falls back to the system font stack.
        this.readableFontLoaded = true;
        return;
      }
      // @font-face stays a real <style> element (nonce'd under CSP):
      // constructed-stylesheet @font-face support is still inconsistent.
      this.injectStyle('acc-readable-text-font', `
        @font-face {
          font-family: "OpenDyslexic3";
          src: ${fontSrc};
          font-display: swap;
        }
      `, { forceElement: true });
      this.readableFontLoaded = true;
    },

  enableReadableText(enable = false) {
      const shouldEnable = !!enable;
      if (shouldEnable) {
        this.ensureReadableFontLoaded();
      }
      const contentSelector = [
        '*',
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
      const config = {
        id: "readable-text",
        selector: "body",
        childrenSelector: [contentSelector],
        styles: { 
          'font-family': '"OpenDyslexic3", "Comic Sans MS", Arial, Helvetica, sans-serif' 
        },
        css: `
          .acc-container, .acc-container *, .acc-menu, .acc-menu * {
            font-family: inherit !important;
          }
          input::placeholder, textarea::placeholder {
            font-family: "OpenDyslexic3", "Comic Sans MS", Arial, Helvetica, sans-serif !important;
          }
        `
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

  // Apply a system-derived default for a feature. An explicit user choice
  // always wins; returns true when the stored state actually changed.
  applySystemTogglePreference(key, shouldEnable) {
    this.loadConfig();
    if (this.hasExplicitStatePreference(key)) {
      return false;
    }

    const currentValue = !!this.retrieveState(key);
    if (currentValue === shouldEnable && this.isSystemControlledPreference(key)) {
      return false;
    }

    this.updateState({ [key]: shouldEnable }, { source: 'system' });
    return true;
  },

  applySystemMotionPreference(shouldEnable) {
    return this.applySystemTogglePreference('pause-motion', shouldEnable);
  },

  applySystemContrastPreference(shouldEnable) {
    return this.applySystemTogglePreference('high-contrast-mode', shouldEnable);
  },

  detectSystemPreferences() {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;

    const reducedMotionQuery = this.ensureMediaQuery(SYSTEM_PREFERS_REDUCED_MOTION);
    const shouldPauseMotion = !!reducedMotionQuery?.matches;
    const motionChanged = this.applySystemMotionPreference(shouldPauseMotion);

    // prefers-contrast: more → high-contrast mode by default (user override
    // wins). prefers-color-scheme is intentionally NOT auto-applied: most
    // sites handle dark mode themselves and force-filtering them would make
    // things worse, not better.
    const contrastQuery = this.ensureMediaQuery(SYSTEM_PREFERS_CONTRAST);
    const shouldHighContrast = !!contrastQuery?.matches;
    const contrastChanged = this.applySystemContrastPreference(shouldHighContrast);

    if (motionChanged || contrastChanged) {
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
    const contrastQuery = this.ensureMediaQuery(SYSTEM_PREFERS_CONTRAST);

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
        this.syncMenuUI();
      }
    };

    const onContrastChange = (event) => {
      const changed = this.applySystemContrastPreference(!!event.matches);
      if (changed) {
        this.applyEnhancements();
        this.syncMenuUI();
      }
    };

    listen(reducedMotionQuery, onReducedMotionChange);
    listen(contrastQuery, onContrastChange);
  },

  concealImages(enable = false) {
    const styleId = `acc-hide-images`;
    this.removeStyle(styleId);
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
      const hasTextScaleState = !!(states && Object.prototype.hasOwnProperty.call(states, 'text-scale'));
      if (hasTextScaleState) {
        const storedScale = states['text-scale'] === false ? 1 : states['text-scale'];
        const appliedScale = this.setTextScaleFromPercent(storedScale, { persist: false });
        this.syncTextScaleControlUI(this.queryWidget('.acc-menu'), appliedScale);
      } else {
        this.scaleText(1);
        this.syncTextScaleControlUI(this.queryWidget('.acc-menu'), 1);
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
      this.enableMuteSounds(states && states['mute-sounds']);
      this.enableTextMagnifier(states && states['text-magnifier']);
    },

  resetEnhancements() {
      this.saveConfig({ states: {}, systemDefaults: {}, profileSnapshots: {} });
      this.activeColorFilterKey = null;
      Object.keys(this.multiLevelFeatures).forEach(key => {
        this.multiLevelFeatures[key].currentIndex = -1;
      });
      const selected = this.queryWidgetAll('.acc-selected');
      selected.forEach(el => {
        el.classList.remove("acc-selected");
        el.setAttribute('aria-pressed', 'false');
      });
      const indicators = this.queryWidgetAll('.acc-progress-indicator');
      indicators.forEach(indicator => {
        const dots = indicator.querySelectorAll('.acc-progress-dot');
        dots.forEach(dot => dot.classList.remove('active'));
      });
      const menu = this.queryWidget('.acc-menu');
      if (menu) {
        this.setColorFilterUI(menu, null);
        this.syncTextScaleControlUI(menu, 1);
      }
      
      // Remove focus from active element to fix the persistent focus ring bug
      const focused = this.getActiveElement();
      if (focused && typeof focused.blur === 'function') {
        focused.blur();
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
      styleIds.forEach(id => this.removeStyle(id));
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
      this.enableMuteSounds(false);
      this.enableTextMagnifier(false);
      this.clearSystemPreferenceListeners();
      this.detectSystemPreferences();
      this.setupMediaQueryListeners();
      this.updateViolationBubble(this.axeScanResults);
    },

};
