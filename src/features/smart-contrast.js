/** @typedef {import('../index.js').default} AccessibleWebWidget */

// Smart Contrast: find text that is hard to read against its own
// background and recolor only that text, just far enough to pass. The
// rest of the page keeps its design.
//
// "Hard to read" is the WCAG AA measure: a contrast ratio under 4.5, or
// under 3 for large text (24px and up, or 18.66px and up when bold).

const NORMAL_TEXT_RATIO = 4.5;
const LARGE_TEXT_RATIO = 3;
// Past this many text elements the page is scanned no further, so a huge
// page cannot freeze the browser.
const MAX_ELEMENTS = 6000;
const SKIP_SELECTOR = '.acc-container, .acc-rg-container, #acc-widget-host, #acc-skip-link, script, style, noscript, template, svg, [aria-hidden="true"]';
const FIELD_SELECTOR = 'input:not([type="hidden"]):not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="color"]):not([type="file"]):not([type="image"]), textarea, select';

/** @type {{ [methodName: string]: (this: AccessibleWebWidget, ...args: any[]) => any }} */
export const smartContrastMethods = {

  // "rgb(1, 2, 3)" or "rgba(1, 2, 3, 0.5)" as numbers; null for anything
  // else (a color written in another color space is left alone).
  parseCssColor(value) {
    const match = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/.exec(String(value || '').trim());
    if (!match) return null;
    let alpha = 1;
    if (match[4] !== undefined) {
      alpha = match[4].endsWith('%') ? parseFloat(match[4]) / 100 : parseFloat(match[4]);
    }
    return { r: +match[1], g: +match[2], b: +match[3], a: Math.min(1, Math.max(0, alpha)) };
  },

  // WCAG relative luminance, 0 (black) to 1 (white).
  colorLuminance(color) {
    const channel = (value) => {
      const unit = value / 255;
      return unit <= 0.03928 ? unit / 12.92 : Math.pow((unit + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * channel(color.r) + 0.7152 * channel(color.g) + 0.0722 * channel(color.b);
  },

  // WCAG contrast ratio, 1 (same color) to 21 (black on white).
  colorContrast(first, second) {
    const a = this.colorLuminance(first);
    const b = this.colorLuminance(second);
    return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  },

  // A see-through color laid over a solid one.
  blendColors(top, bottom) {
    const alpha = top.a === undefined ? 1 : top.a;
    return {
      r: top.r * alpha + bottom.r * (1 - alpha),
      g: top.g * alpha + bottom.g * (1 - alpha),
      b: top.b * alpha + bottom.b * (1 - alpha),
      a: 1
    };
  },

  // The nearest color to `text` that reaches `target` against
  // `background`: the text is moved toward black or white, whichever the
  // background calls for, and no further than needed.
  findReadableColor(text, background, target) {
    const mix = (end, amount) => ({
      r: text.r + (end.r - text.r) * amount,
      g: text.g + (end.g - text.g) * amount,
      b: text.b + (end.b - text.b) * amount,
      a: 1
    });
    // Whole numbers, rounded toward the end color so rounding cannot
    // undo the last bit of contrast.
    const settle = (color, end) => {
      const round = end.r === 0 ? Math.floor : Math.ceil;
      return { r: round(color.r), g: round(color.g), b: round(color.b), a: 1 };
    };
    const toward = (end) => {
      if (this.colorContrast(end, background) < target) return null;
      let low = 0;
      let high = 1;
      for (let step = 0; step < 12; step++) {
        const middle = (low + high) / 2;
        if (this.colorContrast(mix(end, middle), background) >= target) {
          high = middle;
        } else {
          low = middle;
        }
      }
      for (let amount = high; amount < 1; amount += 0.01) {
        const candidate = settle(mix(end, amount), end);
        if (this.colorContrast(candidate, background) >= target) return candidate;
      }
      return end;
    };
    const black = { r: 0, g: 0, b: 0, a: 1 };
    const white = { r: 255, g: 255, b: 255, a: 1 };
    // Above this luminance black contrasts more than white does.
    const ends = this.colorLuminance(background) > 0.179 ? [black, white] : [white, black];
    return toward(ends[0]) || toward(ends[1]) || ends[0];
  },

  // The solid color behind an element: its own background and those of
  // its ancestors, laid over each other, on a white page. Null when a
  // picture or gradient is in the way, since its color cannot be known.
  getEffectiveBackground(element) {
    const layers = [];
    for (let node = element; node && node.nodeType === 1; node = node.parentElement) {
      const style = window.getComputedStyle(node);
      if (style.backgroundImage && style.backgroundImage !== 'none') return null;
      const color = this.parseCssColor(style.backgroundColor);
      if (!color) return null;
      if (color.a > 0) {
        layers.push(color);
        if (color.a >= 1) break;
      }
    }
    let result = { r: 255, g: 255, b: 255, a: 1 };
    for (let index = layers.length - 1; index >= 0; index--) {
      result = this.blendColors(layers[index], result);
    }
    return result;
  },

  // The elements under `root` that show text of their own.
  collectSmartContrastElements(root) {
    const found = new Set();
    if (!root || root.nodeType !== 1 || root.closest(SKIP_SELECTOR)) return found;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node = walker.nextNode();
    while (node && found.size < MAX_ELEMENTS) {
      const parent = node.parentElement;
      if (parent && node.nodeValue.trim() && !found.has(parent) && !parent.closest(SKIP_SELECTOR)) {
        found.add(parent);
      }
      node = walker.nextNode();
    }
    const fields = root.matches(FIELD_SELECTOR) ? [root] : [];
    root.querySelectorAll(FIELD_SELECTOR).forEach((field) => fields.push(field));
    fields.forEach((field) => {
      if (found.size < MAX_ELEMENTS && !field.closest(SKIP_SELECTOR)) found.add(field);
    });
    return found;
  },

  // Work out every fix first, then write them, so the browser lays the
  // page out once rather than once per element.
  applySmartContrast(root = document.body) {
    if (!this.smartContrastFixed) this.smartContrastFixed = new Map();
    const fixes = [];
    this.collectSmartContrastElements(root).forEach((element) => {
      if (this.smartContrastFixed.has(element)) return;
      const style = window.getComputedStyle(element);
      const text = this.parseCssColor(style.color);
      if (!text || text.a === 0) return;
      const background = this.getEffectiveBackground(element);
      if (!background) return;
      const shown = this.blendColors(text, background);
      const size = parseFloat(style.fontSize) || 16;
      const bold = (parseInt(style.fontWeight, 10) || 400) >= 700;
      const target = size >= 24 || (bold && size >= 18.66) ? LARGE_TEXT_RATIO : NORMAL_TEXT_RATIO;
      if (this.colorContrast(shown, background) >= target) return;
      fixes.push({ element, color: this.findReadableColor(shown, background, target) });
    });
    fixes.forEach(({ element, color }) => {
      this.smartContrastFixed.set(element, {
        value: element.style.getPropertyValue('color'),
        priority: element.style.getPropertyPriority('color')
      });
      element.style.setProperty('color', `rgb(${color.r}, ${color.g}, ${color.b})`, 'important');
      element.setAttribute('data-acc-smart-contrast', '');
    });
    return fixes.length;
  },

  // Put back each element's own inline color, or none.
  clearSmartContrast() {
    if (!this.smartContrastFixed) return;
    this.smartContrastFixed.forEach((previous, element) => {
      if (previous.value) {
        element.style.setProperty('color', previous.value, previous.priority);
      } else {
        element.style.removeProperty('color');
      }
      element.removeAttribute('data-acc-smart-contrast');
    });
    this.smartContrastFixed = new Map();
  },

  stopSmartContrastWatch() {
    if (this.smartContrastObserver) {
      this.smartContrastObserver.disconnect();
      this.smartContrastObserver = null;
    }
    if (this.smartContrastTimer) {
      clearTimeout(this.smartContrastTimer);
      this.smartContrastTimer = null;
    }
    if (this.smartContrastLoadHandler) {
      window.removeEventListener('load', this.smartContrastLoadHandler);
      this.smartContrastLoadHandler = null;
    }
  },

  // Content added later (a menu that opens, results that load) is checked
  // shortly after it arrives.
  startSmartContrastWatch() {
    if (this.smartContrastObserver || typeof MutationObserver === 'undefined' || !document.body) return;
    const pending = new Set();
    this.smartContrastObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          const element = node.nodeType === 1 ? node : node.parentElement;
          if (element && !element.closest(SKIP_SELECTOR)) pending.add(element);
        });
      });
      if (!pending.size || this.smartContrastTimer) return;
      this.smartContrastTimer = setTimeout(() => {
        this.smartContrastTimer = null;
        const roots = [...pending].filter((element) => element.isConnected);
        pending.clear();
        roots.forEach((element) => this.applySmartContrast(element));
      }, 250);
    });
    this.smartContrastObserver.observe(document.body, { childList: true, subtree: true });
    // Styles that arrive with the rest of the page can change the colors.
    if (document.readyState !== 'complete') {
      this.smartContrastLoadHandler = () => {
        this.smartContrastLoadHandler = null;
        if (!this.smartContrastActive) return;
        this.clearSmartContrast();
        this.applySmartContrast();
      };
      window.addEventListener('load', this.smartContrastLoadHandler, { once: true });
    }
  },

  // High Contrast and Dark Contrast set every color themselves, so Smart
  // Contrast stands down while either is on and comes back after.
  shouldRunSmartContrast() {
    if (!this.retrieveState('smart-contrast')) return false;
    if (document.documentElement.classList.contains('acc-dark-contrast')) return false;
    if (document.body && document.body.classList.contains('acc-high-contrast-mode')) return false;
    return true;
  },

  // Called whenever a setting changes. It rescans only when Smart
  // Contrast itself starts or stops, or when `rescan` asks for it because
  // the page's colors have just changed.
  refreshSmartContrast({ rescan = false } = {}) {
    try {
      const shouldRun = this.shouldRunSmartContrast();
      document.documentElement.classList.toggle('acc-smart-contrast', shouldRun);
      if (shouldRun === !!this.smartContrastActive && !(rescan && shouldRun)) return;
      this.smartContrastActive = shouldRun;
      this.clearSmartContrast();
      if (shouldRun) {
        this.applySmartContrast();
        this.startSmartContrastWatch();
      } else {
        this.stopSmartContrastWatch();
      }
    } catch (e) {
      console.warn('Error applying smart contrast:', e);
    }
  }

};
