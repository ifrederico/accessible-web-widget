/** @typedef {import('../index.js').default} AccessibleWebWidget */

/** @type {{ [methodName: string]: (this: AccessibleWebWidget, ...args: any[]) => any }} */
export const visualFilterMethods = {

  // The Contrast tile shows the active choice by name. Light Contrast is
  // stored under the old High Contrast key (see contrastModes).
  getContrastToggleDisplay(index) {
      const control = 'Contrast';
      if (index === 0) {
        return { key: 'smart-contrast', control, label: 'Smart Contrast', icon: this.widgetIcons.smartContrast };
      }
      if (index === 1) {
        return { key: 'dark-contrast', control, label: 'Dark Contrast', icon: this.widgetIcons.darkContrast };
      }
      if (index === 2) {
        return { key: 'light-contrast', control, label: 'Light Contrast', icon: this.widgetIcons.lightContrast };
      }
      return { key: null, control, label: control, icon: this.widgetIcons.contrast };
    },

  // The active Contrast choice as its state key, or null. Light wins over
  // Dark, and Dark over Smart, when a profile or an old save leaves more
  // than one on. A saved "light-contrast" is the faint filter the tile
  // once had; it now means Light Contrast.
  getContrastMode(states = this.loadConfig().states || {}) {
      if (!states) return null;
      if (states['high-contrast-mode'] || states['light-contrast']) return 'high-contrast-mode';
      if (states['dark-contrast']) return 'dark-contrast';
      if (states['smart-contrast']) return 'smart-contrast';
      return null;
    },

  setContrastUI(menu, mode = null) {
      if (!menu || !menu.querySelector) return;
      const feature = this.multiLevelFeatures?.['contrast-toggle'];
      if (!feature) return;
      const index = mode ? feature.values.indexOf(mode) : -1;
      feature.currentIndex = index;
      const button = menu.querySelector('.acc-btn[data-key="contrast-toggle"]');
      if (!button) return;
      this.updateContrastToggleButton(button, index);
      const isActive = index >= 0;
      button.classList.toggle('acc-selected', isActive);
      button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      button.querySelectorAll('.acc-progress-dot').forEach((dot, dotIndex) => {
        dot.classList.toggle('active', dotIndex === index);
      });
    },

  // Text is often laid over a picture: a banner photo with a headline on
  // it. Mark the blocks that sit over a picture, so Dark and Light
  // Contrast can dim the picture behind them rather than cover it with a
  // solid box, and so Smart Contrast leaves them alone (it cannot see the
  // picture). A block counts when at least half of it lies over the
  // picture and it is not the picture's own container.
  markMediaOverlays() {
      this.clearMediaOverlays();
      const skip = '.acc-container, .acc-rg-container, #acc-widget-host';
      const pictures = [];
      document.querySelectorAll('img, video, canvas').forEach((media) => {
        if (media.closest(skip)) return;
        const box = media.getBoundingClientRect();
        if (box.width >= 120 && box.height >= 80) pictures.push({ media, box });
      });
      const shared = (a, b) => Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left))
        * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
      pictures.forEach(({ media, box: picture }) => {
        const pictureArea = picture.width * picture.height;
        let child = media;
        let parent = media.parentElement;
        for (let depth = 0; parent && parent !== document.documentElement && depth < 6; depth++) {
          Array.from(parent.children).forEach((sibling) => {
            if (sibling === child || sibling.hasAttribute('data-acc-over-media') || sibling.matches(skip)) return;
            if (!sibling.textContent || !sibling.textContent.trim()) return;
            const box = sibling.getBoundingClientRect();
            const area = box.width * box.height;
            if (!area || !shared(picture, box)) return;
            // A banner is often two or more pictures side by side; count
            // what the block shares with all of them.
            const covered = pictures.reduce((sum, other) => sum + shared(other.box, box), 0);
            if (covered >= area * 0.5) sibling.setAttribute('data-acc-over-media', '');
          });
          // Past an ancestor far larger than the picture, nothing more
          // is laid over it.
          const frame = parent.getBoundingClientRect();
          if (parent === document.body || frame.width * frame.height > pictureArea * 4) break;
          child = parent;
          parent = parent.parentElement;
        }
      });
    },

  clearMediaOverlays() {
      document.querySelectorAll('[data-acc-over-media]').forEach((element) => {
        element.removeAttribute('data-acc-over-media');
      });
    },

  // Many icons are drawn as a mask filled with a background color. Dark
  // Contrast turns every background black, which would erase them, so
  // mark them and let them take the text color instead. "self" is an
  // element that is itself the icon; "before" and "after" are icons drawn
  // in front of or behind an element's text.
  markMaskIcons() {
      this.clearMaskIcons();
      const skip = '.acc-container, .acc-rg-container, #acc-widget-host';
      const masked = (style) => {
        const mask = style.maskImage || style.webkitMaskImage || '';
        return !!mask && mask !== 'none';
      };
      const elements = document.body.getElementsByTagName('*');
      const limit = Math.min(elements.length, 6000);
      const found = [];
      for (let index = 0; index < limit; index++) {
        const element = elements[index];
        if (element.namespaceURI !== 'http://www.w3.org/1999/xhtml') continue;
        const parts = [];
        if (!element.firstElementChild && masked(window.getComputedStyle(element))) parts.push('self');
        if (masked(window.getComputedStyle(element, '::before'))) parts.push('before');
        if (masked(window.getComputedStyle(element, '::after'))) parts.push('after');
        if (parts.length && !element.closest(skip)) found.push([element, parts.join(' ')]);
      }
      found.forEach(([element, parts]) => element.setAttribute('data-acc-mask-icon', parts));
    },

  clearMaskIcons() {
      document.querySelectorAll('[data-acc-mask-icon]').forEach((element) => {
        element.removeAttribute('data-acc-mask-icon');
      });
    },

  // Put the active Contrast choice on the page. Light is the High
  // Contrast rules, Dark has its own, and Smart Contrast runs only when
  // neither is on, since both already set every color.
  applyContrastMode(states = this.loadConfig().states || {}) {
      const mode = this.getContrastMode(states);
      try {
        if (mode) {
          this.markMediaOverlays();
        } else {
          this.clearMediaOverlays();
        }
        if (mode === 'dark-contrast') {
          this.markMaskIcons();
        } else {
          this.clearMaskIcons();
        }
      } catch (e) {
        console.warn('Error preparing contrast:', e);
      }
      this.enableHighContrastMode(mode === 'high-contrast-mode');
      const isDark = mode === 'dark-contrast';
      if (isDark) {
        this.injectStyle('acc-dark-contrast', this.buildDarkContrastCss());
      } else {
        this.removeStyle('acc-dark-contrast');
      }
      document.documentElement.classList.toggle('acc-dark-contrast', isDark);
      // The body color has just changed; a color filter must match it.
      if (this.activeColorFilterKey || this.hasStyle('acc-filter-style')) this.applyVisualFilters();
      this.refreshSmartContrast({ rescan: true });
      // Pictures and styles that arrive with the rest of the page change
      // what lies over what; look once more when the page has loaded.
      if (mode && document.readyState !== 'complete' && !this.contrastLoadHandler) {
        this.contrastLoadHandler = () => {
          this.contrastLoadHandler = null;
          this.applyContrastMode();
        };
        window.addEventListener('load', this.contrastLoadHandler, { once: true });
      }
    },

  applyModeToggleButtonDisplay(button, display, modeAttribute) {
      if (!button) return;
      const iconNode = button.querySelector('svg');
      if (iconNode) {
        iconNode.outerHTML = display.icon;
      } else {
        button.insertAdjacentHTML('afterbegin', display.icon);
      }

      const labelNode = button.querySelector('.acc-label');
      if (labelNode) {
        labelNode.setAttribute('data-acc-text', display.label);
        labelNode.innerText = this.translate(display.label);
      }
      // The visible label shows only the active level ("Light Contrast");
      // the accessible name also names the control ("Contrast: Light
      // Contrast") and is rebuilt from these attributes by translateMenuUI()
      // on a language switch.
      button.setAttribute('data-acc-text', display.control);
      if (display.key) {
        button.setAttribute('data-acc-level-text', display.label);
      } else {
        button.removeAttribute('data-acc-level-text');
      }
      const accessibleName = this.getTranslatedText(button);
      button.setAttribute('title', accessibleName);
      button.setAttribute('aria-label', accessibleName);
      button.setAttribute(modeAttribute, display.key || 'off');
    },

  updateContrastToggleButton(button, index) {
      this.applyModeToggleButtonDisplay(button, this.getContrastToggleDisplay(index), 'data-contrast-mode');
    },

  getSaturationToggleDisplay(index) {
      const control = 'Saturation';
      if (index === 0) {
        return { key: 'low-saturation', control, label: 'Low Saturation', icon: this.widgetIcons.lowSaturation };
      }
      if (index === 1) {
        return { key: 'high-saturation', control, label: 'High Saturation', icon: this.widgetIcons.highSaturation };
      }
      if (index === 2) {
        return { key: 'monochrome', control, label: 'Monochrome', icon: this.widgetIcons.monochrome };
      }
      return { key: null, control, label: control, icon: this.widgetIcons.saturation };
    },

  updateSaturationToggleButton(button, index) {
      this.applyModeToggleButtonDisplay(button, this.getSaturationToggleDisplay(index), 'data-saturation-mode');
    },

  getReadableFontDisplay(index) {
      const fontKey = index >= 0 ? (this.readableFontTileKeys || [])[index] : null;
      const choice = fontKey ? (this.readableFontChoices || []).find((entry) => entry.key === fontKey) : null;
      const control = 'Readable Font';
      return {
        key: choice ? choice.key : null,
        control,
        label: choice ? choice.label : control,
        icon: this.widgetIcons.readableFont
      };
    },

  // The Dyslexia Font tile: on when that is the reading font in use. It
  // shares the readable-text state with the Readable Font tile, so
  // switching one font on switches the other tile's font off.
  toggleDyslexiaFont(menu, button) {
      const current = this.resolveReadableFontChoice(this.retrieveState('readable-text'));
      const enable = !(current && current.key === 'dyslexic');
      const value = enable ? 'dyslexic' : false;
      this.updateState({ 'readable-text': value });
      this.enableReadableText(value);
      this.setReadableFontUI(menu, value || null);
      if (button) this.announceFeatureState(button.getAttribute('aria-label'), enable);
    },

  setReadableFontUI(menu, activeKey = null) {
      if (!menu || !menu.querySelector) return;
      const feature = this.multiLevelFeatures?.['readable-text'];
      if (!feature) return;
      const index = activeKey ? feature.values.indexOf(activeKey) : -1;
      feature.currentIndex = index;
      const dyslexiaButton = menu.querySelector('.acc-btn[data-key="dyslexia-font"]');
      if (dyslexiaButton) {
        const isDyslexic = activeKey === 'dyslexic';
        dyslexiaButton.classList.toggle('acc-selected', isDyslexic);
        dyslexiaButton.setAttribute('aria-pressed', isDyslexic ? 'true' : 'false');
      }
      const button = menu.querySelector('.acc-btn[data-key="readable-text"]');
      if (!button) return;
      this.applyModeToggleButtonDisplay(button, this.getReadableFontDisplay(index), 'data-readable-font-mode');
      const isActive = index >= 0;
      button.classList.toggle('acc-selected', isActive);
      button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      const indicator = button.querySelector('.acc-progress-indicator[data-feature="readable-text"]');
      if (indicator) {
        indicator.querySelectorAll('.acc-progress-dot').forEach((dot, dotIndex) => {
          dot.classList.toggle('active', dotIndex === index);
        });
      }
    },

  // Font Size, Line Height, Letter Spacing and Text to Speech step
  // through an amount. Their tiles keep the plain name at every step and
  // the dots show which step is on; people judge the amount on the page,
  // not from a number. The dots are only visible, so the name a screen
  // reader hears carries the step ("Font Size: 2").
  getLevelTileText(featureKey, index) {
      const feature = this.multiLevelFeatures?.[featureKey];
      return feature && index >= 0 && index < feature.levels ? String(index + 1) : '';
    },

  setLevelTileUI(menu, featureKey, index) {
      if (!menu || !menu.querySelector) return;
      const feature = this.multiLevelFeatures?.[featureKey];
      if (!feature) return;
      feature.currentIndex = index;
      const button = menu.querySelector(`.acc-btn[data-key="${featureKey}"]`);
      if (!button) return;
      const levelText = this.getLevelTileText(featureKey, index);
      if (levelText) {
        button.setAttribute('data-acc-level-text', levelText);
      } else {
        button.removeAttribute('data-acc-level-text');
      }
      const accessibleName = this.getTranslatedText(button);
      button.setAttribute('title', accessibleName);
      button.setAttribute('aria-label', accessibleName);
      const isActive = index >= 0;
      button.classList.toggle('acc-selected', isActive);
      button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      button.querySelectorAll('.acc-progress-dot').forEach((dot, dotIndex) => {
        dot.classList.toggle('active', dotIndex === index);
      });
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
        case 'monochrome': {
          // filter: grayscale(100%) — luminance-weighted
          const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
          r = lum; g = lum; b = lum;
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

  // Dark Contrast: black page, white text, yellow links. The same shape
  // as Light Contrast (the High Contrast rules) with the colors turned
  // around.
  buildDarkContrastCss() {
      const X = ':not(.acc-container):not(.acc-container *):not(.acc-rg-container):not(.acc-rg-container *)';
      const shapes = 'path, circle, ellipse, rect, polygon, polyline, line';
      // Every rule starts from the class on <html>, which makes Dark
      // Contrast outrank Simplify Layout's colors whichever came first.
      const B = 'html.acc-dark-contrast body';
      return `
        html.acc-dark-contrast, ${B} {
          background: #000 !important;
          color: #fff !important;
        }

        ${B} *${X} {
          color: #fff !important;
          background-color: #000 !important;
          background-image: none !important;
          border-color: #fff !important;
          text-shadow: none !important;
          box-shadow: none !important;
        }

        /* Decorations drawn with ::before and ::after would stay light
           behind the white text. */
        ${B} *${X}::before,
        ${B} *${X}::after {
          color: #fff !important;
          background-color: transparent !important;
          background-image: none !important;
          border-color: #fff !important;
          box-shadow: none !important;
        }

        /* Icons drawn as a mask take the text color (see markMaskIcons). */
        ${B} [data-acc-mask-icon~="self"]${X},
        ${B} [data-acc-mask-icon~="before"]${X}::before,
        ${B} [data-acc-mask-icon~="after"]${X}::after {
          background-color: currentColor !important;
        }

        /* Text laid over a picture: dim the picture behind it instead of
           covering it (see markMediaOverlays). */
        ${B} [data-acc-over-media]${X} {
          background-color: rgba(0, 0, 0, 0.65) !important;
        }

        ${B} [data-acc-over-media] *${X} {
          background-color: transparent !important;
        }

        /* Links: yellow and underlined, with whatever they wrap. */
        ${B} a${X},
        ${B} a${X} * {
          color: #ff0 !important;
        }

        ${B} a${X} {
          text-decoration: underline !important;
        }

        /* Pictures keep their own colors. */
        ${B} :where(img, picture, video, canvas, iframe, svg)${X} {
          background-color: transparent !important;
        }

        /* Icons that draw in the default black take the text color. Icons
           that set their own fill or stroke are left alone. */
        ${B} svg${X} :where(${shapes}):not([fill]):not([stroke]):not([fill] *):not([stroke] *) {
          fill: currentColor !important;
        }

        /* A logo or icon in dark ink would vanish on black; a thin light
           edge keeps its shape readable. */
        ${B} svg${X},
        ${B} :where(header, nav, footer, [role="banner"], [role="navigation"], [role="contentinfo"]) img${X} {
          filter: drop-shadow(0 0 1px #fff) drop-shadow(0 0 1px #fff) !important;
        }

        /* Inputs and buttons keep a visible edge. */
        ${B} :where(input:not([type="checkbox"]):not([type="radio"]):not([type="range"]), textarea, select, button)${X} {
          border: 2px solid #fff !important;
        }

        ${B} :where(input[type="checkbox"], input[type="radio"], input[type="range"])${X} {
          accent-color: #ff0 !important;
        }

        ${B} ::placeholder {
          color: #ccc !important;
          opacity: 1 !important;
        }

        ${B} :focus-visible${X} {
          outline: 3px solid #ff0 !important;
          outline-offset: 2px !important;
        }

        ${B} :where(table, th, td)${X} {
          border: 1px solid #fff !important;
        }
      `;
    },

  applyVisualFilters() {
      const { states } = this.loadConfig();
      const activeKey = this.getActiveColorFilterKey(states);
      this.activeColorFilterKey = activeKey;
      // Take the last filter off first, so the body color read below is
      // the page's own and not one that was already filtered.
      this.removeStyle('acc-filter-style');
      this.unfilteredBodyBackground = null;

      const filter = activeKey ? this.visualFilters[activeKey] : null;
      if (!filter) return;
      const adjustedFilter = {
        ...filter,
        selector: filter.selector || 'body > *:not(.acc-container):not(.acc-rg-container):not(#acc-skip-link)'
      };
      let css = this.buildCSS(adjustedFilter);

      // Compute a filtered body background so the body itself matches
      // the visual filter applied to its children. ":root:root" lets it
      // win over the body colors of Dark Contrast and Simplify Layout.
      const filteredBg = this.computeFilteredBodyColor(activeKey);
      if (filteredBg) {
        // Smart Contrast measures against the page's own color.
        this.unfilteredBodyBackground = window.getComputedStyle(document.body).backgroundColor;
        css += `:root:root body{background-color:${filteredBg}!important;}`;
      }

      this.injectStyle('acc-filter-style', css);
    },

  cycleMultiLevelFeature(featureKey, button) {
      const feature = this.multiLevelFeatures[featureKey];
      if (!feature || !button) return;
      const menu = button.closest('.acc-menu');

      if (featureKey === 'readable-text') {
        const newIndex = feature.currentIndex + 1;
        const newFontKey = newIndex >= feature.levels ? null : feature.values[newIndex];
        this.updateState({ 'readable-text': newFontKey || false });
        this.enableReadableText(newFontKey || false);
        this.setReadableFontUI(menu, newFontKey);
        // setReadableFontUI re-labels the button with the control and the
        // active font ("Readable Font: Lexend"), so the announcement reads
        // "Readable Font: Lexend On" / "Readable Font Off".
        this.announceFeatureState(button.getAttribute('aria-label'), !!newFontKey);
        return;
      }

      // Font Size: 110%, 125%, 150%, then back to 100% (off).
      if (featureKey === 'text-scale') {
        const newIndex = this.getTextScaleLevel(this.retrieveState('text-scale')) + 1;
        const multiplier = newIndex < feature.levels ? feature.values[newIndex] : 1;
        this.updateState({ 'text-scale': multiplier });
        this.scaleText(multiplier);
        // Large text needs less contrast than small text, so what Smart
        // Contrast fixed at the old size may no longer be right.
        this.refreshSmartContrast({ rescan: true });
        this.setLevelTileUI(menu, featureKey, multiplier > 1 ? newIndex : -1);
        this.announceFeatureState(button.getAttribute('aria-label'), multiplier > 1);
        return;
      }

      // Line Height and Letter Spacing: three steps, then off.
      if (featureKey === 'line-spacing' || featureKey === 'letter-spacing') {
        const isLine = featureKey === 'line-spacing';
        const current = isLine
          ? this.getLineSpacingLevel(this.retrieveState(featureKey))
          : this.getLetterSpacingLevel(this.retrieveState(featureKey));
        const newIndex = current + 1;
        const value = newIndex < feature.levels ? feature.values[newIndex] : false;
        this.updateState({ [featureKey]: value });
        if (isLine) {
          this.adjustLineSpacing(value);
        } else {
          this.adjustLetterSpacing(value);
        }
        this.setLevelTileUI(menu, featureKey, value ? newIndex : -1);
        this.announceFeatureState(button.getAttribute('aria-label'), !!value);
        return;
      }

      // Text to Speech: normal, slow, fast, then off. Each tap re-speaks
      // the "Text to Speech On" cue at the new speed.
      if (featureKey === 'text-to-speech') {
        const newIndex = this.getTtsSpeedLevel(this.retrieveState('text-to-speech')) + 1;
        const speedKey = newIndex < feature.levels ? feature.values[newIndex] : false;
        this.userInitiatedToggleKey = featureKey;
        try {
          this.updateState({ 'text-to-speech': speedKey });
          this.enableTextToSpeech(speedKey);
        } finally {
          this.userInitiatedToggleKey = null;
        }
        this.setLevelTileUI(menu, featureKey, speedKey ? newIndex : -1);
        this.announceFeatureState(button.getAttribute('aria-label'), !!speedKey);
        return;
      }

      // Contrast: Smart, Dark, Light, then off. One choice at a time.
      if (featureKey === 'contrast-toggle') {
        const current = feature.values.indexOf(this.getContrastMode());
        const newIndex = current + 1;
        const newMode = newIndex < feature.levels ? feature.values[newIndex] : null;
        const payload = { 'light-contrast': false };
        feature.values.forEach((modeKey) => {
          payload[modeKey] = modeKey === newMode;
        });
        this.updateState(payload);
        this.applyContrastMode();
        this.setContrastUI(menu, newMode);
        // "Contrast: Dark Contrast On" / "Contrast Off".
        this.announceFeatureState(button.getAttribute('aria-label'), !!newMode);
        return;
      }

      // Beyond those, only Saturation renders as a cycling color filter.
      if (featureKey !== 'saturation-toggle') return;

      const newIndex = feature.currentIndex + 1;
      const newActiveKey = newIndex >= feature.levels ? null : feature.values[newIndex];
      this.updateColorFilterState(newActiveKey);
      this.setColorFilterUI(menu, newActiveKey);
      this.applyVisualFilters();
      // setColorFilterUI re-labels the button with the control and the
      // active mode ("Saturation: Low Saturation"), so the announcement
      // reads "Saturation: Low Saturation On" / "Saturation Off".
      this.announceFeatureState(button.getAttribute('aria-label'), !!newActiveKey);
    },

};
