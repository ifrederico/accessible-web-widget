/** @typedef {import('./index.js').default} AccessibleWebWidget */

/** @type {{ [methodName: string]: (this: AccessibleWebWidget, ...args: any[]) => any }} */
export const uiMethods = {

  translate(label) {
      const { lang } = this.loadConfig();
      // Tolerate regional tags persisted by older versions or written
      // directly into storage ('pt-BR' → 'pt') before falling back to English.
      const primary = String(lang || '').split(/[_-]/)[0].toLowerCase();
      const dictionary = this.translations[lang] || this.translations[primary] || this.translations["en"];
      return dictionary[label] || label;
    },

  isRtlLanguage(languageCode) {
      const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
      const code = String(languageCode || '').split(/[_-]/)[0].toLowerCase();
      return rtlLanguages.includes(code);
    },

  getUiDirection(languageCode = this.loadConfig().lang) {
      return this.isRtlLanguage(languageCode) ? 'rtl' : 'ltr';
    },

  getLanguageCountryLabel(languageCode) {
      const countryByLanguage = {
        en: 'USA',
        pt: 'Brazil',
        it: 'Italy',
        fr: 'France',
        de: 'Germany',
        es: 'Spain',
        ru: 'Russia',
        pl: 'Poland',
        ro: 'Romania',
        nl: 'Netherlands',
        uk: 'Ukraine',
        ar: 'Saudi Arabia',
        he: 'Israel',
        sv: 'Sweden',
        da: 'Denmark',
        ca: 'Spain',
        sl: 'Slovenia',
        lv: 'Latvia',
        el: 'Greece',
        ka: 'Georgia',
        am: "Ethiopia",
        bg: "Bulgaria",
        bn: "Bangladesh",
        cs: "Czechia",
        fa: "Iran",
        fi: "Finland",
        fil: "Philippines",
        hi: "India",
        hr: "Croatia",
        hu: "Hungary",
        id: "Indonesia",
        ja: "Japan",
        kn: "India",
        ko: "South Korea",
        ku: "Iraq",
        lb: "Luxembourg",
        ml: "India",
        mn: "Mongolia",
        ms: "Malaysia",
        my: "Myanmar",
        no: "Norway",
        pa: "India",
        si: "Sri Lanka",
        sk: "Slovakia",
        sr: "Serbia",
        sw: "Tanzania",
        ta: "India",
        te: "India",
        th: "Thailand",
        tr: "Turkey",
        ur: "Pakistan",
        vi: "Vietnam",
        zh: "China",
        "zh-TW": "Taiwan"
      };
      return countryByLanguage[languageCode] || String(languageCode || '').toUpperCase();
    },

  getLanguageFlag(languageCode) {
      const countryCodeByLanguage = {
        en: 'US',
        pt: 'BR',
        it: 'IT',
        fr: 'FR',
        de: 'DE',
        es: 'ES',
        ru: 'RU',
        pl: 'PL',
        ro: 'RO',
        nl: 'NL',
        uk: 'UA',
        ar: 'SA',
        he: 'IL',
        // Explicit codes required: the slice-two-letters fallback maps
        // sv→SV (El Salvador) and sl→SL (Sierra Leone).
        sv: 'SE',
        da: 'DK',
        ca: 'ES',
        sl: 'SI',
        lv: 'LV',
        el: 'GR',
        ka: 'GE',
        am: "ET",
        bg: "BG",
        bn: "BD",
        cs: "CZ",
        fa: "IR",
        fi: "FI",
        fil: "PH",
        hi: "IN",
        hr: "HR",
        hu: "HU",
        id: "ID",
        ja: "JP",
        kn: "IN",
        ko: "KR",
        ku: "IQ",
        lb: "LU",
        ml: "IN",
        mn: "MN",
        ms: "MY",
        my: "MM",
        no: "NO",
        pa: "IN",
        si: "LK",
        sk: "SK",
        sr: "RS",
        sw: "TZ",
        ta: "IN",
        te: "IN",
        th: "TH",
        tr: "TR",
        ur: "PK",
        vi: "VN",
        zh: "CN",
        "zh-TW": "TW"
      };
      const countryCode = (countryCodeByLanguage[languageCode] || String(languageCode || '').slice(0, 2)).toUpperCase();
      if (!/^[A-Z]{2}$/.test(countryCode)) {
        return '';
      }
      return String.fromCodePoint(...countryCode.split('').map(char => 127397 + char.charCodeAt(0)));
    },

  // Native name of a supported language: "Deutsch" from "Deutsch (German)".
  getLanguageName(language) {
      return String(language?.label || language?.code || '')
        .split('(')[0]
        .trim() || String(language?.code || 'en').toUpperCase();
    },

  formatLanguageLabel(language) {
      if (!language) return 'English (USA)';
      return `${this.getLanguageName(language)} (${this.getLanguageCountryLabel(language.code)})`;
    },

  getWidgetIconMarkup(iconKey) {
      const normalized = typeof iconKey === 'string' ? iconKey.trim().toLowerCase() : '';
      const variants = this.widgetIcons?.accessibilityVariants || {};
      return variants[normalized] || variants.default || this.widgetIcons.accessibility;
    },

  // Focus moved by the widget after a tap or click (restoring the toggle,
  // entering a popover) should not draw the keyboard ring WebKit shows for
  // programmatic focus; keyboard users keep it. Browsers without the
  // focusVisible option ignore it.
  focusQuietlyAfterPointer(element) {
      if (!element || typeof element.focus !== 'function') return;
      element.focus(this.lastInputWasPointer ? { focusVisible: false } : undefined);
    },

  // Phones and tablets without a trackpad or mouse. Unknown or mixed input
  // counts as not touch-only, so desktops never lose an option.
  isTouchOnlyDevice() {
      if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
      try {
        return window.matchMedia('(pointer: coarse)').matches &&
          !window.matchMedia('(any-pointer: fine)').matches;
      } catch {
        return false;
      }
    },

  throttle(func, limit) {
      let inThrottle;
      return function (...args) {
        if (!inThrottle) {
          func.apply(this, args);
          inThrottle = true;
          setTimeout(() => (inThrottle = false), limit);
        }
      };
    },

  ensureLiveRegion() {
      if (typeof document === 'undefined') return null;
      if (this.liveRegion && document.body.contains(this.liveRegion)) {
        return this.liveRegion;
      }
      const region = document.createElement('div');
      region.id = 'acc-live-region';
      region.className = 'acc-container';
      region.setAttribute('role', 'status');
      region.setAttribute('aria-live', 'polite');
      Object.assign(region.style, {
        position: 'absolute',
        width: '1px',
        height: '1px',
        margin: '-1px',
        padding: '0',
        border: '0',
        overflow: 'hidden',
        clip: 'rect(0 0 0 0)',
        whiteSpace: 'nowrap'
      });
      document.body.appendChild(region);
      this.liveRegion = region;
      return region;
    },

  announce(message) {
      if (!message) return;
      const region = this.ensureLiveRegion();
      if (!region) return;
      // Clear first so repeating the same message is re-announced.
      region.textContent = '';
      if (this.liveRegionTimer) {
        clearTimeout(this.liveRegionTimer);
      }
      this.liveRegionTimer = setTimeout(() => {
        region.textContent = message;
        this.liveRegionTimer = null;
      }, 50);
    },

  announceFeatureState(label, enabled) {
      if (!label) return;
      this.announce(`${label} ${this.translate(enabled ? 'On' : 'Off')}`);
    },

  syncMenuUI(menu = this.queryWidget('.acc-menu')) {
      if (!menu || !menu.querySelectorAll) return;
      const states = this.loadConfig().states || {};
      menu.querySelectorAll('.acc-btn[data-key]').forEach(btn => {
        const key = btn.dataset.key;
        if (!key || this.isColorFilterKey(key) || this.multiLevelFeatures[key]) return;
        const option = [...(this.accessTools || []), ...(this.contentOptions || [])].find(o => o.key === key);
        if (option?.isAction) return;
        const isActive = !!states[key];
        btn.classList.toggle('acc-selected', isActive);
        btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      });
      const activeColorFilter = this.getActiveColorFilterKey(states);
      this.setColorFilterUI(menu, activeColorFilter);
      const readableChoice = this.resolveReadableFontChoice(states['readable-text']);
      this.setReadableFontUI(menu, readableChoice ? readableChoice.key : null);
      this.setLevelTileUI(menu, 'text-scale', this.getTextScaleLevel(states['text-scale']));
      this.setLevelTileUI(menu, 'text-to-speech', this.getTtsSpeedLevel(states['text-to-speech']));
      this.syncMenuSummary(menu);
    },

  // The Profiles row names the active profile (a count when several are
  // on), and the Reset button counts the options that are on and turns
  // inactive when there is nothing to reset.
  syncMenuSummary(menu) {
      if (!menu || !menu.querySelector) return;
      const states = this.loadConfig().states || {};
      const activeProfiles = (this.accessibilityProfiles || []).filter(profile => states[profile.key]);
      const profileSummary = menu.querySelector('.acc-profiles-summary');
      if (profileSummary) {
        if (activeProfiles.length === 1) {
          profileSummary.textContent = this.translate(activeProfiles[0].label);
        } else {
          profileSummary.textContent = activeProfiles.length ? String(activeProfiles.length) : '';
        }
      }
      const resetButton = menu.querySelector('.acc-footer-reset');
      const resetCount = menu.querySelector('.acc-reset-count');
      if (resetButton && resetCount) {
        const activeCount = menu.querySelectorAll('.acc-options .acc-btn.acc-selected').length;
        resetCount.textContent = String(activeCount);
        resetCount.hidden = activeCount === 0;
        resetButton.disabled = activeCount === 0 && activeProfiles.length === 0;
      }
    },

  getFocusableElements(root) {
      if (!root) return [];
      const selectors = [
        'a[href]',
        'button:not([disabled])',
        'input:not([disabled])',
        'textarea:not([disabled])',
        'select:not([disabled])',
        '[tabindex]:not([tabindex="-1"])'
      ].join(',');
      const hasDocument = typeof document !== 'undefined';
      const activeElement = hasDocument ? this.getActiveElement() : null;
      return Array.from(root.querySelectorAll(selectors)).filter(el => {
        if (el.hasAttribute('disabled')) return false;
        if (el.getAttribute('aria-hidden') === 'true') return false;
        if (el.closest('[aria-hidden="true"]')) return false;
        const rect = el.getBoundingClientRect();
        const style = typeof window !== 'undefined' && window.getComputedStyle ? window.getComputedStyle(el) : { visibility: 'visible', display: 'block' };
        const hasSize = rect.width > 0 || rect.height > 0;
        const isVisible = (hasSize || (hasDocument && el === activeElement)) && style.visibility !== 'hidden' && style.display !== 'none';
        return isVisible;
      });
    },

  openMenu(menuContainer, toggleBtn) {
      if (!menuContainer) return;
      const menu = this.findElement('.acc-menu', menuContainer);
      this.activeMenuContainer = menuContainer;
      this.activeMenuToggle = toggleBtn || this.activeMenuToggle;
      const currentlyFocused = this.getActiveElement();
      this.previousFocus = currentlyFocused && typeof currentlyFocused.focus === 'function'
        ? currentlyFocused
        : null;
  
      menuContainer.style.display = 'block';
      if (menu) {
        menu.setAttribute('aria-hidden', 'false');
        menu.setAttribute('aria-modal', 'true');
        if (!menu.hasAttribute('tabindex')) {
          menu.setAttribute('tabindex', '-1');
        }
      }
  
      if (this.activeMenuToggle) {
        this.activeMenuToggle.setAttribute('aria-expanded', 'true');
      }
  
      // Focus the dialog itself rather than its first control: screen
      // readers announce the dialog name, and the first Tab lands on the
      // first control without implying any one of them is the primary action.
      if (menu) {
        menu.focus();
      } else {
        const focusable = this.getFocusableElements(menuContainer);
        if (focusable.length) focusable[0].focus();
      }
  
      if (this.menuKeyListener) {
        document.removeEventListener('keydown', this.menuKeyListener, true);
      }
  
      this.menuKeyListener = (event) => {
        if (!this.activeMenuContainer) return;
        if (event.key === 'Escape' || event.key === 'Esc') {
          event.preventDefault();
          // Escape peels back one layer: an open language list closes
          // first (its row restores focus), then the menu itself.
          const langPanel = this.findElement('#acc-lang-panel', this.activeMenuContainer);
          const langToggle = this.findElement('.acc-lang-row', this.activeMenuContainer);
          if (langPanel && !langPanel.hasAttribute('hidden') && langToggle) {
            langToggle.click();
            return;
          }
          this.closeMenu(this.activeMenuContainer);
          return;
        }
        if (event.key === 'Tab') {
          const focusables = this.getFocusableElements(this.activeMenuContainer);
          if (!focusables.length) {
            event.preventDefault();
            return;
          }
          const first = focusables[0];
          const last = focusables[focusables.length - 1];
          const active = this.getActiveElement();
          const insideMenu = this.activeMenuContainer.contains(active);
          // Focus can rest on the dialog itself right after opening;
          // Shift+Tab must wrap to the last control instead of escaping.
          const onDialog = active === this.findElement('.acc-menu', this.activeMenuContainer);
          if (event.shiftKey) {
            if (active === first || onDialog || !insideMenu) {
              event.preventDefault();
              last.focus();
            }
          } else if (active === last || !insideMenu) {
            event.preventDefault();
            first.focus();
          }
        }
      };
  
      document.addEventListener('keydown', this.menuKeyListener, true);
    },

  closeMenu(menuContainer, toggleBtn) {
      const targetContainer = menuContainer || this.activeMenuContainer;
      if (!targetContainer) return;
      const menu = this.findElement('.acc-menu', targetContainer);
      targetContainer.style.display = 'none';
      if (menu) {
        menu.setAttribute('aria-hidden', 'true');
        menu.setAttribute('aria-modal', 'false');
      }

      const langPanel = this.findElement('#acc-lang-panel', targetContainer);
      if (langPanel) {
        langPanel.setAttribute('hidden', '');
      }

      const langToggle = this.findElement('.acc-lang-row', targetContainer);
      if (langToggle) {
        langToggle.setAttribute('aria-expanded', 'false');
      }

      const langSearch = this.findElement('#acc-lang-search', targetContainer);
      if (langSearch) {
        langSearch.value = '';
      }

      targetContainer.querySelectorAll('.acc-lang-item').forEach(item => {
        item.style.display = '';
      });
  
      if (this.menuKeyListener) {
        document.removeEventListener('keydown', this.menuKeyListener, true);
        this.menuKeyListener = null;
      }
  
      const toggle = toggleBtn || this.activeMenuToggle;
      if (toggle) {
        toggle.setAttribute('aria-expanded', 'false');
      }
  
      this.focusQuietlyAfterPointer(toggle || this.previousFocus);

      this.stopSpeech();
  
      this.activeMenuContainer = null;
      this.activeMenuToggle = null;
      this.previousFocus = null;
    },

  renderOptions(options, optionClass) {
      let html = '';
      for (let i = 0; i < options.length; i++) {
        const opt = options[i];
        if (opt.requiresSpeechSynthesis && !this.supportsTextToSpeech()) {
          continue;
        }
        if (opt.requiresFinePointer && this.isTouchOnlyDevice()) {
          continue;
        }
        const isMultiLevel = opt.multiLevel === true;
        const mergedOptionClass = [optionClass, opt.optionClass].filter(Boolean).join(' ');
        let progressIndicator = '';
        if (isMultiLevel) {
          const featureData = this.multiLevelFeatures[opt.key];
          if (featureData) {
            progressIndicator = `<div class="acc-progress-indicator" data-feature="${opt.key}">`;
            for (let j = 0; j < featureData.levels; j++) {
              const isActive = featureData.currentIndex === j;
              progressIndicator += `<div class="acc-progress-dot${isActive ? ' active' : ''}" data-level="${j}"> </div>`;
            }
            progressIndicator += ` </div>`;
          }
        }
        html += `<button 
          class="acc-btn ${mergedOptionClass} ${this.multiLevelFeatures[opt.key]?.currentIndex >= 0 ? 'acc-selected' : ''}" 
          type="button" 
          data-key="${opt.key}" 
          data-multi-level="${isMultiLevel}"
          data-acc-text="${opt.label}"
          title="${opt.label}"
          aria-label="${opt.label}"
          aria-pressed="${this.multiLevelFeatures[opt.key]?.currentIndex >= 0 || false}"
          aria-controls="acc-menu-content">
            ${opt.icon}
            <span class="acc-label">${opt.label}</span>
            ${progressIndicator}
          </button>`;
      }
      return html;
    },

  getTranslatedText(el, defaultValue) {
      let text = el.getAttribute("data-acc-text");
      if (!text && defaultValue) {
        text = defaultValue;
        el.setAttribute("data-acc-text", text);
      }
      // Cycling buttons keep their active level in a separate key so both
      // parts of the name ("Contrast: Light") are translated.
      const levelText = el.getAttribute("data-acc-level-text");
      if (levelText) {
        return `${this.translate(text)}: ${this.translate(levelText)}`;
      }
      return this.translate(text);
    },

  translateMenuUI(menu) {
      const direction = this.getUiDirection();
      const menuElement = menu.classList && menu.classList.contains('acc-menu')
        ? menu
        : menu.querySelector && menu.querySelector('.acc-menu');
      if (menuElement) {
        menuElement.setAttribute('dir', direction);
      }
      // The widget speaks its own UI language, which can differ from the
      // page's <html lang>; screen readers pick pronunciation from this.
      if (this.widgetContainerEl) {
        this.widgetContainerEl.setAttribute('lang', this.loadConfig().lang || 'en');
      }
      menu.querySelectorAll(".acc-section-title, .acc-label").forEach(el => {
        el.innerText = this.getTranslatedText(el, el.innerText.trim());
      });
      menu.querySelectorAll("[title]").forEach(el => {
        el.setAttribute("title", this.getTranslatedText(el, el.getAttribute("title")));
      });
      menu.querySelectorAll("[aria-label]").forEach(el => {
        el.setAttribute("aria-label", this.getTranslatedText(el, el.getAttribute("aria-label")));
      });
      this.syncMenuSummary(menuElement);
      this.updateSkipLinkLabel();
    },

  displayMenu({ container, lang, position = 'bottom-right' }) {
      try {
        this.applyThemeVariables();
        this.registerStaticStyles();

        const activeLanguageCode = String(lang || 'en').split(/[_-]/)[0].toLowerCase();
        const activeLanguage = this.supportedLanguages.find(language => language.code === lang) ||
          this.supportedLanguages.find(language => language.code === activeLanguageCode);

        const sourceOptions = [
          ...this.contentOptions.map(option => ({ ...option })),
          ...this.colorOptions.map(option => ({ ...option, optionClass: 'acc-filter' })),
          ...this.accessTools
            .filter(option => !option.devOnly || this.isDevMode())
            .map(option => ({ ...option, optionClass: 'acc-tools' }))
        ];
        const optionsByKey = new Map();
        sourceOptions.forEach(option => {
          if (option?.key && !optionsByKey.has(option.key)) optionsByKey.set(option.key, option);
        });

        // One grid of tiles in this order. The group names are not shown,
        // but stay as visually hidden headings so screen reader users can
        // still jump between groups. Options missing from these lists join
        // the last group.
        const tileGroups = [
          { label: 'Speech', keys: ['text-to-speech'] },
          { label: 'Text', keys: ['text-scale', 'line-spacing', 'letter-spacing', 'bold-text', 'readable-text'] },
          { label: 'Color & Contrast', keys: ['contrast-toggle', 'saturation-toggle', 'invert-colors', 'high-contrast-mode'] },
          { label: 'Reading Aids', keys: ['highlight-links', 'highlight-title', 'reading-aid', 'simple-layout', 'text-magnifier', 'page-structure'] },
          { label: 'Interaction', keys: ['hide-images', 'large-pointer', 'pause-motion', 'mute-sounds', 'annotations', 'accessibility-report'] }
        ];
        const groupedKeys = new Set(tileGroups.flatMap(group => group.keys));
        const ungroupedKeys = [...optionsByKey.keys()].filter(key => !groupedKeys.has(key));
        const tilesMarkup = tileGroups.map((group, index) => {
          const keys = index === tileGroups.length - 1 ? [...group.keys, ...ungroupedKeys] : group.keys;
          const tiles = this.renderOptions(keys.map(key => optionsByKey.get(key)).filter(Boolean));
          return tiles ? `<h2 class="acc-section-title acc-label acc-sr-only">${group.label}</h2>${tiles}` : '';
        }).join('');

        const profilesMarkup = this.renderOptions((this.accessibilityProfiles || []).map(profile => ({ ...profile })), 'acc-profile-tile');

        const menuTemplate = `
        <div class="acc-menu" role="dialog" aria-labelledby="accessibility-title">
          <div class="acc-menu-header">
            <div id="accessibility-title" class="acc-menu-title">
              <span class="acc-label">Accessibility Options</span>
            </div>
            <button type="button" class="acc-menu-close" title="Close" aria-label="Close">
              ${this.widgetIcons.close}
            </button>
          </div>
          <div id="acc-menu-content" class="acc-menu-content">
            <div class="acc-options-all">
              <div class="acc-card">
                <button type="button" class="acc-card-row acc-lang-row" aria-expanded="false" aria-controls="acc-lang-panel">
                  <span class="acc-card-row-icon" aria-hidden="true">${this.widgetIcons.language}</span>
                  <span class="acc-card-row-label acc-label">Language</span>
                  <span id="acc-current-language" class="acc-card-row-value">${this.getLanguageName(activeLanguage)}</span>
                  <span class="acc-card-row-chevron" aria-hidden="true"> </span>
                </button>
                <div id="acc-lang-panel" class="acc-card-panel acc-lang-panel" hidden>
                  <div class="acc-lang-search-wrapper">
                    <input type="text" id="acc-lang-search" class="acc-lang-search" placeholder="Search language" aria-label="Search language">
                  </div>
                  <div class="acc-lang-list">
                    ${this.supportedLanguages.map(language => {
                      const languageLabel = this.formatLanguageLabel(language);
                      const languageFlag = this.getLanguageFlag(language.code);
                      return `<button type="button" class="acc-lang-item${language.code === activeLanguageCode ? ' selected' : ''}" data-lang="${language.code}" aria-label="${languageLabel}">
                        <span class="acc-lang-item-main">
                          <span class="acc-lang-flag" aria-hidden="true">${languageFlag}</span>
                          <span class="acc-lang-item-label">${languageLabel}</span>
                        </span>
                        <span class="acc-icon-check" aria-hidden="true"> </span>
                      </button>`;
                    }).join('')}
                  </div>
                </div>
                <button type="button" class="acc-card-row acc-profiles-row" aria-expanded="false" aria-controls="acc-profiles-panel">
                  <span class="acc-card-row-icon" aria-hidden="true">${this.widgetIcons.profiles}</span>
                  <span class="acc-card-row-label acc-label">Profiles</span>
                  <span class="acc-card-row-value acc-profiles-summary"></span>
                  <span class="acc-card-row-chevron" aria-hidden="true"> </span>
                </button>
                <div id="acc-profiles-panel" class="acc-card-panel acc-profiles-panel" role="group" aria-label="Profiles" hidden>
                  ${profilesMarkup}
                </div>
              </div>
              <div class="acc-options">${tilesMarkup}</div>
            </div>
          </div>
          <div class="acc-footer">
            <button type="button" class="acc-footer-reset">
              ${this.widgetIcons.reset}
              <span class="acc-label">Reset settings</span>
              <span class="acc-reset-count" hidden></span>
            </button>
            ${this.options.hideAttribution === true ? '' : '<a class="acc-footer-brand" href="https://accessibleweb.pages.dev/" target="_blank" rel="noopener noreferrer">AccessibleWeb Widget</a>'}
          </div>
        </div>
        <div class="acc-overlay"> </div>
        `;
        const menuContainer = document.createElement("div");
        menuContainer.innerHTML = menuTemplate;
        menuContainer.style.display = 'none';
        const menu = this.findElement(".acc-menu", menuContainer);
        if (menu) {
          menu.setAttribute('aria-hidden', 'true');
          if (!menu.hasAttribute('tabindex')) {
            menu.setAttribute('tabindex', '-1');
          }
        }
        // The menu opens as a full-height side panel (top/bottom gaps come
        // from the base CSS) docked to whichever edge hosts the button.
        // theme.menuPosition ('left' | 'right'), when set, overrides that.
        const dockOverride = this.widgetTheme.menuPosition === 'left' || this.widgetTheme.menuPosition === 'right'
          ? this.widgetTheme.menuPosition
          : null;
        const isRightAligned = dockOverride
          ? dockOverride === 'right'
          : position === 'bottom-right' || position === 'top-right';
        if (isRightAligned) {
          menu.style.right = 'var(--acc-menu-inline-gap, 12px)';
          menu.style.left = 'auto';
        } else {
          menu.style.left = 'var(--acc-menu-inline-gap, 12px)';
          menu.style.right = 'auto';
        }

        const config = this.loadConfig();

        const langPanel = this.findElement("#acc-lang-panel", menu);
        const langToggle = this.findElement(".acc-lang-row", menu);
        const langSearch = this.findElement("#acc-lang-search", menu);
        const langItems = menu.querySelectorAll(".acc-lang-item");
        const profilesPanel = this.findElement("#acc-profiles-panel", menu);
        const profilesToggle = this.findElement(".acc-profiles-row", menu);

        const closeLanguagePanel = () => {
          // Hiding the list would otherwise drop focus out of the dialog.
          const focusWasInside = Boolean(langPanel && langPanel.contains(this.getActiveElement()));
          if (langPanel) {
            langPanel.setAttribute('hidden', '');
          }
          if (focusWasInside && langToggle) {
            this.focusQuietlyAfterPointer(langToggle);
          }
          if (langToggle) {
            langToggle.setAttribute('aria-expanded', 'false');
          }
          if (langSearch) {
            langSearch.value = '';
          }
          langItems.forEach(item => {
            item.style.display = '';
          });
        };

        const openLanguagePanel = () => {
          if (langPanel) {
            langPanel.removeAttribute('hidden');
          }
          if (langToggle) {
            langToggle.setAttribute('aria-expanded', 'true');
          }
          // On touch-only devices focusing the search field pops the
          // on-screen keyboard over the list, so land on the current
          // language; with a keyboard, typing filters right away.
          const selectedItem = this.findElement('.acc-lang-item.selected', langPanel) || langItems[0];
          if (this.isTouchOnlyDevice() && selectedItem) {
            this.focusQuietlyAfterPointer(selectedItem);
          } else if (langSearch) {
            langSearch.focus();
          }
        };

        if (langToggle && langPanel) {
          langToggle.addEventListener('click', () => {
            if (langPanel.hasAttribute('hidden')) {
              openLanguagePanel();
            } else {
              closeLanguagePanel();
            }
          });
        }

        if (profilesToggle && profilesPanel) {
          profilesToggle.addEventListener('click', () => {
            const willOpen = profilesPanel.hasAttribute('hidden');
            profilesPanel.toggleAttribute('hidden', !willOpen);
            profilesToggle.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
          });
        }
  
        // Handle language search
        if (langSearch) {
          langSearch.addEventListener("input", () => {
            const searchValue = langSearch.value.toLowerCase();
            langItems.forEach(item => {
              const labelElement = item.querySelector('.acc-lang-item-label');
              const text = (labelElement?.textContent || item.textContent).toLowerCase();
              item.style.display = text.includes(searchValue) ? '' : 'none';
            });
          });
        }
  
        // Handle language selection
        langItems.forEach(item => {
          item.addEventListener("click", () => {
            const langCode = item.getAttribute("data-lang");
            if (!langCode) return;
            
            // Update selected language
            langItems.forEach(i => i.classList.remove("selected"));
            item.classList.add("selected");
            
            // Update current language display
            const currentLang = this.findElement("#acc-current-language", menu);
            if (currentLang) {
              currentLang.textContent = this.getLanguageName(this.supportedLanguages.find(language => language.code === langCode));
            }
            closeLanguagePanel();
            
            // Save language preference and update UI. langUserSelected marks
            // this as an explicit visitor choice that outranks the embed
            // config and <html lang> on future visits.
            this.saveConfig({ lang: langCode, langUserSelected: true });
            this.translateMenuUI(menuContainer);
          });
        });
  
        // click event handler:
        menu.addEventListener('click', (e) => {
          const target = e.target.closest('[role="button"], button, .acc-overlay');
          if (!target) return;
          if (target.classList.contains('acc-overlay')) {
            this.closeMenu(menuContainer);
            return;
          }
          if (target.classList.contains('acc-footer-reset')) {
            this.resetEnhancements();
            this.announce(this.translate('Settings reset'));
            // Reset usually leaves nothing to reset and disables itself;
            // keep focus inside the dialog rather than on a dead button.
            this.focusQuietlyAfterPointer(target.disabled ? menu : target);
            return;
          }
          const btn = target.classList.contains('acc-btn') ? target : null;
          if (btn) {
            const key = btn.dataset.key;
            // Handle action buttons (open a panel; no persistent state).
            // Close the menu first: the panel is its own modal surface, and
            // leaving the menu open would leave two competing document-level
            // focus traps active at once. Closing also parks focus on the
            // toggle, which the panel captures as its restore target.
            if (key === 'accessibility-report') {
              this.closeMenu(menuContainer);
              this.runAccessibilityReport();
            }
            else if (key === 'page-structure') {
              this.closeMenu(menuContainer);
              this.openPageStructurePanel();
            }
            // One-tap profiles bundle several feature states.
            else if (key && key.startsWith('profile-')) {
              this.toggleAccessibilityProfile(key, menu);
            }
            // Handle multi-level features (speech, font size, contrast).
            else if (this.multiLevelFeatures[key]) {
              this.cycleMultiLevelFeature(key, btn);
            }
            // For color adjustments, deselect any other active color filter.
            else if (this.isColorFilterKey(key)) {
              const isCurrentlyActive = btn.classList.contains('acc-selected');
              const newActiveKey = isCurrentlyActive ? null : key;
              this.setColorFilterUI(menu, newActiveKey);
              this.updateColorFilterState(newActiveKey);
              this.applyVisualFilters();
              this.announceFeatureState(btn.getAttribute('aria-label'), !isCurrentlyActive);
            }
            // For other adjustments, simply toggle.
            else {
              const isSelected = !btn.classList.contains("acc-selected");
              btn.classList.toggle('acc-selected', isSelected);
              btn.setAttribute('aria-pressed', isSelected);
              this.userInitiatedToggleKey = key;
              try {
                this.updateState({ [key]: isSelected });
                this.applyEnhancements();
              } finally {
                this.userInitiatedToggleKey = null;
              }
              this.announceFeatureState(btn.getAttribute('aria-label'), isSelected);
            }
            this.syncMenuSummary(menu);
          }
        });
        this.translateMenuUI(menuContainer);
        this.updateColorFilterState(this.getActiveColorFilterKey(config.states));
        this.syncMenuUI(menu);
        container.appendChild(menuContainer);
        return menuContainer;
      } catch (e) {
        console.error('Error displaying menu:', e);
        return null;
      }
    },

  // ── Public panel API ─────────────────────────────────────────────
  // Used by the toggle button, the skip link, and host pages that hide
  // the default button (AccessibleWebWidget.instance.open()).

  ensureMenuCreated() {
      if (this.menuContainer) return this.menuContainer;
      if (!this.widgetContainerEl) return null;
      const launchOptions = this.launchOptions || this.options || {};
      const menu = this.displayMenu({ ...launchOptions, container: this.widgetContainerEl });
      if (!menu) return null;
      this.menuContainer = menu;

      const overlay = menu.querySelector('.acc-overlay');
      if (overlay) {
        overlay.addEventListener('click', (overlayEvent) => {
          overlayEvent.stopPropagation();
          this.close();
        });
      }

      const closeBtn = menu.querySelector('.acc-menu-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', (closeEvent) => {
          closeEvent.stopPropagation();
          this.close();
        });
      }
      return menu;
    },

  isMenuOpen() {
      const menu = this.menuContainer;
      if (!menu) return false;
      if (menu.style.display === 'none') return false;
      if (typeof window !== 'undefined' && window.getComputedStyle(menu).display === 'none') {
        return false;
      }
      return true;
    },

  open() {
      const menu = this.ensureMenuCreated();
      if (!menu) return false;
      if (!this.isMenuOpen()) {
        this.openMenu(menu, this.widgetToggleButton);
      }
      return true;
    },

  close() {
      if (!this.menuContainer || !this.isMenuOpen()) return;
      this.closeMenu(this.menuContainer, this.widgetToggleButton);
    },

  toggle() {
      if (this.isMenuOpen()) {
        this.close();
      } else {
        this.open();
      }
    },

  displayWidget(options) {
    try {
      this.applyThemeVariables();
      this.registerStaticStyles();

      const widgetTemplate = `
        <div class="acc-widget">
          <button type="button" id="accessibilityWidget" class="acc-toggle-btn" title="Open Accessibility Menu" aria-label="Open accessibility menu" aria-expanded="false">
            <span class="acc-toggle-icon" aria-hidden="true">${this.getWidgetIconMarkup(options?.icon)}</span>
            <span class="acc-violation-bubble" data-severity="warning" hidden> </span>
          </button>
        </div>
        `;
      
        const widget = document.createElement("div");
        widget.innerHTML = widgetTemplate;
        widget.classList.add("acc-container");

        // Encapsulate the widget UI in a shadow root so host-page CSS cannot
        // break it (and widget UI styles cannot leak out). Falls back to
        // light DOM when attachShadow is unavailable.
        const host = document.createElement('div');
        host.className = 'acc-container';
        host.id = 'acc-widget-host';
        this.shadowHost = host;
        if (typeof host.attachShadow === 'function') {
          this.widgetRoot = host.attachShadow({ mode: 'open' });
          this.applyWidgetUiStyles(this.widgetRoot);
          this.widgetRoot.appendChild(widget);
        } else {
          this.widgetRoot = null;
          this.injectStyle('acc-widget-ui-styles', this.getWidgetUiStyles());
          host.appendChild(widget);
        }

        const btn = this.findElement(".acc-toggle-btn", widget);
        this.widgetContainerEl = widget;
        this.launchOptions = { ...options };

        const hideButton = options.hideButton === true ||
          String(options.hideButton).trim().toLowerCase() === 'true';

        if (hideButton) {
          // Host page provides its own trigger and drives the panel via
          // open()/close()/toggle(). The bubble lives inside the button,
          // so it goes with it.
          if (btn) btn.remove();
          this.widgetToggleButton = null;
          this.violationBubble = null;
        } else {
          this.violationBubble = this.findElement('.acc-violation-bubble', widget);
          this.widgetToggleButton = btn;

          const { position = "bottom-right", offset = [20, 20], size } = options;
          const normalizedOffset = this.normalizeOffset(offset) || [20, 20];
          const offsetX = normalizedOffset[0] ?? 20;
          const offsetY = normalizedOffset[1] ?? 25;
          let buttonStyle = { left: `${offsetX}px`, bottom: `${offsetY}px` };
          if (position === "bottom-right") {
            buttonStyle = { right: `${offsetX}px`, left: "auto", bottom: `${offsetY}px` };
          } else if (position === "top-left") {
            buttonStyle = { top: `${offsetY}px`, bottom: "auto", left: `${offsetX}px` };
          } else if (position === "top-right") {
            buttonStyle = { top: `${offsetY}px`, right: `${offsetX}px`, bottom: "auto", left: "auto" };
          }
          Object.assign(btn.style, buttonStyle);

          if (size !== undefined && size !== null && String(size).trim() !== '') {
            const buttonSize = this.normalizeButtonSize(size);
            btn.style.setProperty('--acc-button-size', buttonSize);
          }

          btn.addEventListener("click", () => this.toggle());
        }

        document.body.appendChild(host);
        this.translateMenuUI(widget);
        this.ensureSkipLink();
        // axe-core and the violation bubble are dev tooling: only fetch the
        // engine and scan the page in dev mode (owner allows it and the URL
        // asks for it), so regular visitors never download or run the audit.
        if (this.isDevMode()) {
          this.runBackgroundAxeScan().catch(() => {
            this.updateViolationBubble({ violations: [] });
          });
          const rerunDevScan = () => {
            this.runBackgroundAxeScan({ force: true }).catch(() => {
              this.updateViolationBubble(this.axeScanResults || { violations: [] });
            });
          };
          if (document.readyState === 'complete') {
            setTimeout(rerunDevScan, 250);
          } else {
            window.addEventListener('load', () => {
              setTimeout(rerunDevScan, 150);
            }, { once: true });
          }
        } else if (this.isDevToolsRequested()) {
          console.info("AccessibleWeb Widget: developer tools are off on this site. Add data-acc-dev-tools to the widget's script tag (or devTools: true to its options) to use ?acc-dev.");
        }
        
        // Track the last input modality for focusQuietlyAfterPointer().
        const trackInputModality = (event) => {
          this.lastInputWasPointer = event.type === 'pointerdown';
        };
        document.addEventListener('pointerdown', trackInputModality, { capture: true, passive: true });
        document.addEventListener('keydown', trackInputModality, { capture: true, passive: true });

        // Add a click handler to the document to blur the toggle button when clicking outside.
        // e.target is retargeted to the shadow host for clicks inside the shadow
        // root, so resolve the real click path via composedPath().
        document.addEventListener('click', (e) => {
          const toggleBtn = this.widgetToggleButton;
          const path = typeof e.composedPath === 'function' ? e.composedPath() : [e.target];
          const clickedToggle = toggleBtn ? path.includes(toggleBtn) : false;
          const clickedInsideWidget = path.some((node) =>
            node instanceof Element && node.classList.contains('acc-container'));
          const menu = this.menuContainer;
          if (menu && this.activeMenuContainer === menu && menu.style.display !== 'none') {
            const clickedInsideMenu = path.includes(menu);
            if (!clickedToggle && !clickedInsideMenu && !clickedInsideWidget) {
              this.closeMenu(menu, toggleBtn);
            }
          } else if (toggleBtn && !clickedToggle) {
            toggleBtn.blur();
          }
        });
        
        return widget;
      } catch (e) {
        console.error('Error displaying widget:', e);
        return null;
      }
    },

  startAccessibleWebWidget() {
          try {
            if (document.getElementById('acc-widget-host') || document.querySelector('.acc-widget .acc-toggle-btn')) {
              return;
            }
  
            const dataAttributeOptions = this.getDataAttributeOptions();
            if (dataAttributeOptions && Object.keys(dataAttributeOptions).length) {
              this.dataOptions = dataAttributeOptions;
              this.options = {
                ...this.options,
                ...dataAttributeOptions
              };
            }
  
            const baseOptions = { ...this.options };
            // Language priority: the visitor's own pick in the language menu
            // wins, then the embed config (options.lang / data-acc-lang),
            // then the page's declared <html lang>. Anything empty or
            // unsupported falls back to the browser language inside
            // resolveSupportedLanguage() → getDefaultLanguage().
            baseOptions.lang = this.getUserSelectedLanguage() ||
              baseOptions.lang ||
              document.documentElement?.getAttribute('lang') ||
              '';
  
            baseOptions.position = baseOptions.position || "bottom-right";
  
            if (baseOptions.offset) {
              baseOptions.offset = this.normalizeOffset(baseOptions.offset);
            }
  
            if (baseOptions.size) {
              baseOptions.size = this.normalizeButtonSize(baseOptions.size);
              this.widgetTheme.buttonSize = baseOptions.size;
            }

            this.options = { ...baseOptions };
            this.applyThemeOverrides(baseOptions);
            this.applyThemeVariables();
            this.registerStaticStyles();
            
            // First load the saved configuration
            this.loadConfig(false);
            this.detectSystemPreferences();
            this.setupMediaQueryListeners();
            const initialColorFilter = this.getActiveColorFilterKey(this.widgetConfig.states);
            this.updateColorFilterState(initialColorFilter);
            
            // Apply all saved settings immediately on page load
            this.applyEnhancements();
            this.applyVisualFilters();
            
            // Then launch the widget UI
            this.launchWidget(baseOptions);
          } catch (e) {
            console.error('Error starting AccessibleWeb Widget:', e);
          }
        },

  launchWidget(args = {}) {
          try {
            // getDefaultLanguage() already prefers the saved language, so the
            // saved config only contributes `lang` here. Presentation options
            // (position, offset, size, icon) always come from the embed
            // configuration and are never persisted.
            const options = {
              position: 'bottom-right',
              offset: [20, 20],
              ...args
            };
            // Resolve regional tags ('pt-BR' → 'pt') and 'auto' to a
            // supported dictionary code before persisting.
            options.lang = this.resolveSupportedLanguage(options.lang);

            if (options.lang) {
              // Preserve an existing langUserSelected flag. Legacy configs
              // (lang without the flag) migrate to true — their saved value
              // always won pre-1.4.0; fresh visitors get an explicit false
              // so embed config / <html lang> keep applying on later visits.
              const previousFlag = this.widgetConfig?.langUserSelected;
              const langUserSelected = previousFlag !== undefined
                ? previousFlag
                : !!this.widgetConfig?.lang;
              this.saveConfig({ lang: options.lang, langUserSelected });
            }

            // Display the widget UI
            this.displayWidget(options);
          } catch (e) {
            console.error('Error in widget launch:', e);
          }
        },

};
