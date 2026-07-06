/** @typedef {import('../index.js').default} AccessibleWebWidget */

/** @type {{ [methodName: string]: (this: AccessibleWebWidget, ...args: any[]) => any }} */
export const visualFilterMethods = {

  getContrastToggleDisplay(index) {
      if (index === 0) {
        return { key: 'light-contrast', label: 'Light', icon: this.widgetIcons.lightContrast };
      }
      if (index === 1) {
        return { key: 'dark-contrast', label: 'Dark', icon: this.widgetIcons.darkContrast };
      }
      return { key: null, label: 'Contrast', icon: this.widgetIcons.contrast };
    },

  applyModeToggleButtonDisplay(button, display, modeAttribute) {
      if (!button) return;
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
      button.setAttribute(modeAttribute, display.key || 'off');
    },

  updateContrastToggleButton(button, index) {
      this.applyModeToggleButtonDisplay(button, this.getContrastToggleDisplay(index), 'data-contrast-mode');
    },

  getSaturationToggleDisplay(index) {
      if (index === 0) {
        return { key: 'low-saturation', label: 'Low', icon: this.widgetIcons.lowSaturation };
      }
      if (index === 1) {
        return { key: 'high-saturation', label: 'High', icon: this.widgetIcons.highSaturation };
      }
      return { key: null, label: 'Saturation', icon: this.widgetIcons.saturation };
    },

  updateSaturationToggleButton(button, index) {
      this.applyModeToggleButtonDisplay(button, this.getSaturationToggleDisplay(index), 'data-saturation-mode');
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
        this.removeStyle('acc-filter-style');
        return;
      }
      const filter = this.visualFilters[activeKey];
      if (!filter) {
        this.removeStyle('acc-filter-style');
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

  cycleMultiLevelFeature(featureKey, button) {
      const feature = this.multiLevelFeatures[featureKey];
      if (!feature || !button) return;
      // Only the color filter toggles render as cycling buttons; text scale
      // is controlled by the slider in the Text section.
      if (featureKey !== 'contrast-toggle' && featureKey !== 'saturation-toggle') return;

      const newIndex = feature.currentIndex + 1;
      const newActiveKey = newIndex >= feature.levels ? null : feature.values[newIndex];
      this.updateColorFilterState(newActiveKey);
      this.setColorFilterUI(button.closest('.acc-menu'), newActiveKey);
      this.applyVisualFilters();
      // setColorFilterUI re-labels the button with the active mode.
      this.announceFeatureState(button.getAttribute('aria-label'), !!newActiveKey);
    },

};
