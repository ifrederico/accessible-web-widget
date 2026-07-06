import menuCSS from './styles/menu.css';
import widgetCSS from './styles/widget.css';
import reportCSS from './styles/report.css';
import readingGuideCSS from './styles/reading-guide.css';
import skipLinkCSS from './styles/skip-link.css';
import annotationsCSS from './styles/annotations.css';
import extrasCSS from './styles/extras.css';

const STATIC_STYLE_ID = 'acc-static-styles';
// Widget UI styles live inside the shadow root so host-page CSS cannot
// override them; page-level overlay styles (report modal, reading guide,
// skip link, annotations) target light-DOM elements and stay in <head>.
const WIDGET_UI_STYLES = [
  menuCSS,
  widgetCSS
].join('\n');
const PAGE_OVERLAY_STYLES = [
  reportCSS,
  readingGuideCSS,
  skipLinkCSS,
  annotationsCSS,
  extrasCSS
].join('\n');

/** @typedef {import('./index.js').default} AccessibleWebWidget */

/** @type {{ [methodName: string]: (this: AccessibleWebWidget, ...args: any[]) => any }} */
export const styleMethods = {

  findElement(selector, parent = document) {
    try {
      return parent.querySelector(selector);
    } catch (e) {
      console.warn(`Failed to query selector: ${selector}`, e);
      return null;
    }
  },

  // Constructable stylesheets are exempt from CSP style-src, so strict-CSP
  // pages work without any configuration. The <style>-element fallback
  // (old browsers, @font-face) carries the nonce when one is configured.
  canUseAdoptedStyleSheets() {
    if (this._adoptedSheetsSupported === undefined) {
      this._adoptedSheetsSupported = typeof document !== 'undefined' &&
        'adoptedStyleSheets' in document &&
        typeof CSSStyleSheet === 'function' &&
        (() => {
          try {
            new CSSStyleSheet();
            return true;
          } catch {
            return false;
          }
        })();
    }
    return this._adoptedSheetsSupported;
  },

  injectStyle(id, css, { forceElement = false } = {}) {
    if (!css || typeof document === 'undefined') return;
    try {
      if (!forceElement && this.canUseAdoptedStyleSheets()) {
        let sheet = this.adoptedSheets.get(id);
        if (!sheet) {
          sheet = new CSSStyleSheet();
          this.adoptedSheets.set(id, sheet);
        }
        sheet.replaceSync(css);
        if (!document.adoptedStyleSheets.includes(sheet)) {
          document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
        }
        return;
      }
      let style = document.getElementById(id) || document.createElement('style');
      style.textContent = css;
      if (this.styleNonce) {
        style.nonce = this.styleNonce;
      }
      if (!style.id) {
        style.id = id;
        document.head.appendChild(style);
      }
    } catch (e) {
      console.warn('Error adding stylesheet:', e);
    }
  },

  removeStyle(id) {
    if (typeof document === 'undefined') return;
    try {
      const sheet = this.adoptedSheets?.get(id);
      if (sheet) {
        this.adoptedSheets.delete(id);
        document.adoptedStyleSheets = document.adoptedStyleSheets.filter(s => s !== sheet);
      }
      const style = document.getElementById(id);
      if (style && style.tagName === 'STYLE') {
        style.remove();
      }
    } catch (e) {
      console.warn('Error removing stylesheet:', e);
    }
  },

  hasStyle(id) {
    if (typeof document === 'undefined') return false;
    return !!(this.adoptedSheets?.has(id) || document.getElementById(id));
  },

  // Widget UI styles live inside the shadow root; use its adoptedStyleSheets
  // when available so strict-CSP pages need no nonce.
  applyWidgetUiStyles(shadowRoot) {
    const css = this.getWidgetUiStyles();
    if (this.canUseAdoptedStyleSheets() && shadowRoot && 'adoptedStyleSheets' in shadowRoot) {
      try {
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(css);
        shadowRoot.adoptedStyleSheets = [...shadowRoot.adoptedStyleSheets, sheet];
        return;
      } catch (e) {
        console.warn('Falling back to <style> for widget UI styles:', e);
      }
    }
    const style = document.createElement('style');
    style.textContent = css;
    if (this.styleNonce) {
      style.nonce = this.styleNonce;
    }
    shadowRoot.appendChild(style);
  },

  createCSS(styles) {
    let css = "";
    if (!styles) return css;
    const browserPrefixes = ['-o-', '-ms-', '-moz-', '-webkit-', ''];
    const prefixedProperties = ['filter'];
    for (let key in styles) {
      if (!Object.prototype.hasOwnProperty.call(styles, key)) continue;
      let prefixes = prefixedProperties.includes(key) ? browserPrefixes : [""];
      prefixes.forEach(prefix => {
        css += `${prefix}${key}:${styles[key]} !important;`;
      });
    }
    return css;
  },

  wrapCSS(selector, childrenSelector, css) {
    let output = "";
    childrenSelector.forEach(child => {
      output += `${selector} ${child}{${css}}`;
    });
    return output;
  },

  buildCSS(config) {
    if (!config) return "";
    let output = "";
    output += this.createCSS(config.styles || {});
    if (output.length && config.selector) {
      output = this.wrapCSS(config.selector, config.childrenSelector || [""], output);
    }
    output += config.css || "";
    return output;
  },

  applyToolStyle(config) {
    let { id = "", enable = false } = config;
    let styleId = `acc-${id}`;
    if (enable) {
      let css = this.buildCSS(config);
      this.injectStyle(styleId, css);
    } else {
      this.removeStyle(styleId);
    }
    document.documentElement.classList.toggle(styleId, enable);
  },

  applyThemeVariables() {
    if (typeof document === 'undefined') return;

    const vars = {
      '--acc-primary-color': this.widgetTheme.primaryColor,
      '--acc-primary-color-light': this.widgetTheme.primaryColorLight,
      '--acc-primary-color-dark': this.widgetTheme.primaryColorDark,
      '--acc-bg-color': this.widgetTheme.backgroundColor,
      '--acc-text-color': this.widgetTheme.textColor,
      '--acc-text-color-inverted': this.widgetTheme.textColorInverted,
      '--acc-card-bg': this.widgetTheme.cardBackground,
      '--acc-border-color': this.widgetTheme.borderColor,
      '--acc-focus-ring-color': this.widgetTheme.focusRingColor,
      '--acc-hover-color': this.widgetTheme.hoverColor,
      '--acc-active-color': this.widgetTheme.activeColor,
      '--acc-border-radius': this.widgetTheme.borderRadius,
      '--acc-button-border-radius': this.widgetTheme.buttonBorderRadius,
      '--acc-header-height': this.widgetTheme.headerHeight,
      '--acc-focus-outline-width': this.widgetTheme.focusBorderWidth,
      '--acc-focus-outline-offset': this.widgetTheme.focusOutlineOffset,
      '--acc-widget-z-index': String(this.widgetTheme.zIndex),
      '--acc-button-size': this.widgetTheme.buttonSize
    };

    Object.entries(vars).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  },

  registerStaticStyles() {
    if (this.staticStylesRegistered) return;
    this.injectStyle(STATIC_STYLE_ID, PAGE_OVERLAY_STYLES);
    this.staticStylesRegistered = true;
  },

  getWidgetUiStyles() {
    return WIDGET_UI_STYLES;
  },

  // Query the widget's own UI. Before the shadow root exists (or if
  // attachShadow is unavailable) this falls back to the document.
  queryWidget(selector) {
    const root = this.widgetRoot || document;
    try {
      return root.querySelector(selector);
    } catch (e) {
      console.warn(`Failed to query widget selector: ${selector}`, e);
      return null;
    }
  },

  queryWidgetAll(selector) {
    const root = this.widgetRoot || document;
    try {
      return Array.from(root.querySelectorAll(selector));
    } catch (e) {
      console.warn(`Failed to query widget selector: ${selector}`, e);
      return [];
    }
  },

  // document.activeElement reports the shadow host once focus moves inside
  // the shadow root; resolve the real focused element.
  getActiveElement() {
    if (typeof document === 'undefined') return null;
    if (this.widgetRoot && this.widgetRoot.activeElement) {
      return this.widgetRoot.activeElement;
    }
    return document.activeElement;
  }

};
