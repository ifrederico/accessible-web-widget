/** @typedef {import('../index.js').default} AccessibleWebWidget */

// Smart Contrast: find text that is hard to read against its own
// background and recolor only that text, just far enough to pass. The
// rest of the page keeps its design.
//
// "Hard to read" is the WCAG AA measure: a contrast ratio under 4.5, or
// under 3 for large text (24px and up, or 18.66px and up when bold).
// Over a gradient the text must pass against its lightest and its darkest
// color. Text over a picture is left alone: its background is unknown.

const NORMAL_TEXT_RATIO = 4.5;
const LARGE_TEXT_RATIO = 3;
// What the scan aims for when it runs as a net under Dark Contrast and
// Light Contrast, which promise strong contrast (the WCAG AAA measure).
const NET_TEXT_RATIO = 7;
// Past this many text elements the page is scanned no further, so a huge
// page cannot freeze the browser.
const MAX_ELEMENTS = 6000;
// Text marked as lying over a picture is skipped too: the picture is its
// real background, and that cannot be measured.
const SKIP_SELECTOR = '.acc-container, .acc-rg-container, #acc-widget-host, #acc-skip-link, script, style, noscript, template, svg, [aria-hidden="true"], [data-acc-over-media]';
// Text this close to its background color would be invisible, which no
// page intends. Something else is behind it (a picture placed under the
// text), so it is left alone.
const INVISIBLE_RATIO = 1.25;
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

  // The colors a background-image value is made of: none for "none", the
  // color stops for a gradient, and null for a picture, or a color written
  // some other way, since what it shows cannot be known.
  parseGradientColors(value) {
    const text = String(value || '').trim();
    if (!text || text === 'none') return [];
    if (!/gradient\(/i.test(text) || /url\(|image-set\(|element\(|cross-fade\(/i.test(text)) return null;
    const stops = text.match(/rgba?\([^)]*\)/g) || [];
    const rest = text.replace(/rgba?\([^)]*\)/g, '');
    if (!stops.length || /(?:color|color-mix|oklch|oklab|lab|lch|hsl|hsla|hwb)\(/i.test(rest)) return null;
    const colors = stops.map((stop) => this.parseCssColor(stop));
    return colors.every(Boolean) ? colors : null;
  },

  // The lightest and the darkest of some colors. Text that reads against
  // both reads against everything in between.
  colorExtremes(colors) {
    let lightest = colors[0];
    let darkest = colors[0];
    colors.forEach((color) => {
      if (this.colorLuminance(color) > this.colorLuminance(lightest)) lightest = color;
      if (this.colorLuminance(color) < this.colorLuminance(darkest)) darkest = color;
    });
    return lightest === darkest ? [lightest] : [lightest, darkest];
  },

  // The solid colors behind an element: its own background and those of
  // its ancestors, laid over each other, on a white page. One color for a
  // plain background; the lightest and darkest for a gradient. Null when
  // a picture is in the way.
  getBackgroundColors(element) {
    const layers = [];
    for (let node = element; node && node.nodeType === 1; node = node.parentElement) {
      const style = window.getComputedStyle(node);
      // A background clipped to the text paints the letters themselves.
      if (style.backgroundClip === 'text' || style.webkitBackgroundClip === 'text') {
        if (node === element) return null;
        continue;
      }
      const gradient = this.parseGradientColors(style.backgroundImage);
      // Under Invert Colors or Saturation the body carries a filtered
      // color; the text is filtered with it, so measure the page's own.
      const ownColor = node === document.body && this.activeColorFilterKey && this.unfilteredBodyBackground
        ? this.unfilteredBodyBackground
        : style.backgroundColor;
      const color = this.parseCssColor(ownColor);
      if (!gradient || !color) return null;
      if (gradient.length) layers.push(gradient);
      if (color.a > 0) layers.push([color]);
      if (color.a >= 1 || (gradient.length && gradient.every((stop) => stop.a >= 1))) break;
    }
    let results = [{ r: 255, g: 255, b: 255, a: 1 }];
    for (let index = layers.length - 1; index >= 0; index--) {
      const blended = [];
      layers[index].forEach((top) => {
        results.forEach((bottom) => blended.push(this.blendColors(top, bottom)));
      });
      results = this.colorExtremes(blended);
    }
    return results;
  },

  // The lowest contrast `text` has against any of `backgrounds`.
  lowestContrast(text, backgrounds) {
    return Math.min(...backgrounds.map((background) => this.colorContrast(this.blendColors(text, background), background)));
  },

  // A readable color against every one of `backgrounds`. One background
  // has an exact answer. For several, the text is stepped toward black
  // and toward white and the smallest step that passes them all wins.
  // Null when nothing passes and nothing reads clearly better than the
  // text does already.
  findReadableColorAcross(text, backgrounds, target) {
    if (backgrounds.length === 1) {
      return this.findReadableColor(this.blendColors(text, backgrounds[0]), backgrounds[0], target);
    }
    const start = this.blendColors(text, backgrounds[0]);
    const ends = [{ r: 0, g: 0, b: 0, a: 1 }, { r: 255, g: 255, b: 255, a: 1 }];
    let best = null;
    let bestContrast = this.lowestContrast(text, backgrounds);
    for (let step = 1; step <= 64; step++) {
      for (const end of ends) {
        const amount = step / 64;
        const candidate = {
          r: Math.round(start.r + (end.r - start.r) * amount),
          g: Math.round(start.g + (end.g - start.g) * amount),
          b: Math.round(start.b + (end.b - start.b) * amount),
          a: 1
        };
        const contrast = this.lowestContrast(candidate, backgrounds);
        if (contrast >= target) return candidate;
        if (contrast > bestContrast + 0.5) {
          best = candidate;
          bestContrast = contrast;
        }
      }
    }
    return best;
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
    // Under Dark and Light Contrast and Simplify Layout nothing is left
    // behind the text but the colors those set, so text that vanished
    // is fixed too.
    const net = this.smartContrastActive === 'net';
    const simple = !!document.body && document.body.classList.contains('acc-simple-layout-enabled');
    const floor = net || simple ? 0 : INVISIBLE_RATIO;
    const fixes = [];
    // A color that is still fading from one value to another would be
    // read part-way (a page that animates its colors, just after Dark
    // Contrast went on). Hold every transition still while measuring.
    this.injectStyle('acc-contrast-measure', '*, *::before, *::after { transition: none !important; }');
    try {
      this.collectSmartContrastElements(root).forEach((element) => {
        if (this.smartContrastFixed.has(element)) return;
        const style = window.getComputedStyle(element);
        const text = this.parseCssColor(style.color);
        if (!text || text.a === 0) return;
        const backgrounds = this.getBackgroundColors(element);
        if (!backgrounds) return;
        const size = parseFloat(style.fontSize) || 16;
        const bold = (parseInt(style.fontWeight, 10) || 400) >= 700;
        let target = size >= 24 || (bold && size >= 18.66) ? LARGE_TEXT_RATIO : NORMAL_TEXT_RATIO;
        // The net works for modes that promise strong contrast.
        if (net) target = NET_TEXT_RATIO;
        const contrast = this.lowestContrast(text, backgrounds);
        if (contrast >= target || contrast < floor) return;
        const color = this.findReadableColorAcross(text, backgrounds, target);
        if (color) fixes.push({ element, color });
      });
    } finally {
      this.removeStyle('acc-contrast-measure');
    }
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
      // Removed first: writing a plain value over an important one leaves
      // some browsers treating it as important still.
      element.style.removeProperty('color');
      if (previous.value) {
        element.style.setProperty('color', previous.value, previous.priority);
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
  },

  // How the scan should run, if at all. "smart" is Smart Contrast itself.
  // Dark Contrast, Light Contrast and Simplify Layout set colors with
  // rules, but a color the page wrote on an element as important beats
  // any rule; under those the same scan runs as a "net" that catches what
  // the rules could not.
  getSmartContrastRun() {
    if (document.documentElement.classList.contains('acc-dark-contrast')) return 'net';
    if (document.body && document.body.classList.contains('acc-high-contrast-mode')) return 'net';
    if (this.retrieveState('smart-contrast')) return 'smart';
    // Simplify Layout sets its own text colors the same way. There the
    // scan only mends what fails the usual measure.
    if (document.body && document.body.classList.contains('acc-simple-layout-enabled')) return 'simple';
    return null;
  },

  // Called whenever a setting changes. It rescans only when Smart
  // Contrast itself starts or stops, or when `rescan` asks for it because
  // the page's colors have just changed.
  refreshSmartContrast({ rescan = false } = {}) {
    try {
      const run = this.getSmartContrastRun();
      document.documentElement.classList.toggle('acc-smart-contrast', run === 'smart');
      if (run === (this.smartContrastActive || null) && !(rescan && run)) return;
      this.clearSmartContrast();
      this.smartContrastActive = run;
      if (run) {
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
