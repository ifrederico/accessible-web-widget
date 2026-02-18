import menuCSS from './styles/menu.css';
import widgetCSS from './styles/widget.css';
import reportCSS from './styles/report.css';
import readingGuideCSS from './styles/reading-guide.css';
import skipLinkCSS from './styles/skip-link.css';

const STATIC_STYLE_ID = 'acc-static-styles';
const STATIC_STYLES = [menuCSS, widgetCSS, reportCSS, readingGuideCSS, skipLinkCSS].join('\n');

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

  injectStyle(id, css) {
    if (!css || typeof document === 'undefined') return;
    try {
      let style = document.getElementById(id) || document.createElement('style');
      style.innerHTML = css;
      if (!style.id) {
        style.id = id;
        document.head.appendChild(style);
      }
    } catch (e) {
      console.warn('Error adding stylesheet:', e);
    }
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
      let style = document.getElementById(styleId);
      if (style) style.remove();
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
    this.injectStyle(STATIC_STYLE_ID, STATIC_STYLES);
    this.staticStylesRegistered = true;
  }

};
