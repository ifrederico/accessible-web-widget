/** @typedef {import('./index.js').default} AccessibleWebWidget */

/** @type {{ [methodName: string]: (this: AccessibleWebWidget, ...args: any[]) => any }} */
export const uiMethods = {

  translate(label) {
      const { lang } = this.loadConfig();
      const dictionary = this.translations[lang] || this.translations["en"];
      return dictionary[label] || label;
    },

  getLanguageCountryLabel(languageCode) {
      const countryByLanguage = {
        en: 'USA',
        it: 'Italy',
        fr: 'France',
        de: 'Germany',
        es: 'Spain',
        ru: 'Russia',
        pl: 'Poland',
        ro: 'Romania',
        nl: 'Netherlands',
        uk: 'Ukraine'
      };
      return countryByLanguage[languageCode] || String(languageCode || '').toUpperCase();
    },

  getLanguageFlag(languageCode) {
      const countryCodeByLanguage = {
        en: 'US',
        it: 'IT',
        fr: 'FR',
        de: 'DE',
        es: 'ES',
        ru: 'RU',
        pl: 'PL',
        ro: 'RO',
        nl: 'NL',
        uk: 'UA'
      };
      const countryCode = (countryCodeByLanguage[languageCode] || String(languageCode || '').slice(0, 2)).toUpperCase();
      if (!/^[A-Z]{2}$/.test(countryCode)) {
        return '';
      }
      return String.fromCodePoint(...countryCode.split('').map(char => 127397 + char.charCodeAt(0)));
    },

  formatLanguageLabel(language) {
      if (!language) return 'English (USA)';
      const baseName = String(language.label || language.code || '')
        .split('(')[0]
        .trim() || String(language.code || 'en').toUpperCase();
      return `${baseName} (${this.getLanguageCountryLabel(language.code)})`;
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
      const activeElement = hasDocument ? document.activeElement : null;
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
      this.previousFocus = document.activeElement && typeof document.activeElement.focus === 'function'
        ? document.activeElement
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
  
      const focusable = this.getFocusableElements(menuContainer);
      if (focusable.length) {
        focusable[0].focus();
      } else if (menu) {
        menu.focus();
      }
  
      if (this.menuKeyListener) {
        document.removeEventListener('keydown', this.menuKeyListener, true);
      }
  
      this.menuKeyListener = (event) => {
        if (!this.activeMenuContainer) return;
        if (event.key === 'Escape' || event.key === 'Esc') {
          event.preventDefault();
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
          if (event.shiftKey) {
            if (document.activeElement === first) {
              event.preventDefault();
              last.focus();
            }
          } else if (document.activeElement === last) {
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

      const langDetails = this.findElement('.acc-lang-details', targetContainer);
      if (langDetails) {
        langDetails.removeAttribute('open');
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
  
      const focusTarget = toggle || this.previousFocus;
      if (focusTarget && typeof focusTarget.focus === 'function') {
        focusTarget.focus();
      }

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
        const isMultiLevel = opt.multiLevel === true;
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
          class="acc-btn ${optionClass || ''} ${this.multiLevelFeatures[opt.key]?.currentIndex >= 0 ? 'acc-selected' : ''}" 
          type="button" 
          data-key="${opt.key}" 
          data-multi-level="${isMultiLevel}"
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
      return this.translate(text);
    },

  translateMenuUI(menu) {
      menu.querySelectorAll(".acc-section-title, .acc-label").forEach(el => {
        el.innerText = this.getTranslatedText(el, el.innerText.trim());
      });
      menu.querySelectorAll("[title]").forEach(el => {
        el.setAttribute("title", this.getTranslatedText(el, el.getAttribute("title")));
      });
      menu.querySelectorAll("[aria-label]").forEach(el => {
        el.setAttribute("aria-label", this.getTranslatedText(el, el.getAttribute("aria-label")));
      });
      this.updateSkipLinkLabel();
    },

  displayMenu({ container, lang }) {
      try {
        this.applyThemeVariables();
        this.registerStaticStyles();

        const activeLanguageCode = String(lang || 'en').split(/[_-]/)[0].toLowerCase();
        const activeLanguage = this.supportedLanguages.find(language => language.code === activeLanguageCode) || this.supportedLanguages[0];
        const activeLanguageLabel = this.formatLanguageLabel(activeLanguage);
        const activeLanguageFlag = this.getLanguageFlag(activeLanguage?.code);

        const menuTemplate = `
        <div class="acc-menu" role="dialog" aria-labelledby="accessibility-title">
          <div class="acc-menu-header">
            <div id="accessibility-title" class="acc-menu-title acc-label">Accessibility Menu</div>
            <div class="acc-header-actions">
              <div role="button" class="acc-menu-close" title="Close" aria-label="Close accessibility menu" tabindex="0">
                ${this.widgetIcons.close}
              </div>
            </div>
          </div>
          <div id="acc-menu-content" class="acc-menu-content">
            <div class="acc-language-container">
              <details class="acc-lang-details">
                <summary class="acc-lang-summary" aria-label="Language" title="Language">
                  <span class="acc-lang-summary-main">
                    <span id="acc-current-language-flag" class="acc-lang-flag" aria-hidden="true">${activeLanguageFlag}</span>
                    <span id="acc-current-language" class="acc-lang-current-label">${activeLanguageLabel}</span>
                  </span>
                  <span class="acc-lang-summary-arrow" aria-hidden="true"> </span>
                </summary>
                <div class="acc-lang-details-panel">
                  <div class="acc-section-title">All Languages</div>
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
              </details>
            </div>
            <div class="acc-options acc-options-all"> </div>
          </div>
          <div class="acc-footer">
            <button type="button" class="acc-footer-reset" title="Reset settings" aria-label="Reset settings">
              ${this.widgetIcons.reset}
              <span class="acc-label">Reset settings</span>
            </button>
            <a href="https://github.com/ifrederico/accessible-web-widget" target="_blank" rel="noopener noreferrer">AccessibleWeb Widget</a>
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
        if (this.widgetTheme.menuPosition === 'right') {
          menu.style.right = '0px';
          menu.style.left = 'auto';
        } else {
          menu.style.left = '0px';
          menu.style.right = 'auto';
        }
  
        const pinnedTopToolKeys = ['text-to-speech', 'high-contrast-mode', 'simple-layout'];
        const pinnedTopTools = [];
        const remainingTools = [];
        this.accessTools.forEach(tool => {
          if (pinnedTopToolKeys.includes(tool.key)) {
            pinnedTopTools.push(tool);
          } else {
            remainingTools.push(tool);
          }
        });

        const allOptions = [
          this.renderOptions(pinnedTopTools, 'acc-tools'),
          this.renderOptions(this.contentOptions),
          this.renderOptions(this.colorOptions, 'acc-filter'),
          this.renderOptions(remainingTools, 'acc-tools')
        ].join('');
        menu.querySelector(".acc-options-all").innerHTML = allOptions;
        const langDetails = this.findElement(".acc-lang-details", menu);
        const langSearch = this.findElement("#acc-lang-search", menu);
        const langItems = menu.querySelectorAll(".acc-lang-item");
        if (langDetails) {
          langDetails.addEventListener('toggle', () => {
            if (langDetails.open) {
              if (langSearch) {
                langSearch.focus();
              }
              return;
            }
            if (langSearch) {
              langSearch.value = '';
            }
            langItems.forEach(item => {
              item.style.display = '';
            });
          });
        }
  
        // Handle language search
        langSearch.addEventListener("input", () => {
          const searchValue = langSearch.value.toLowerCase();
          langItems.forEach(item => {
            const labelElement = item.querySelector('.acc-lang-item-label');
            const text = (labelElement?.textContent || item.textContent).toLowerCase();
            item.style.display = text.includes(searchValue) ? '' : 'none';
          });
        });
  
        // Handle language selection
        langItems.forEach(item => {
          item.addEventListener("click", () => {
            const langCode = item.getAttribute("data-lang");
            if (!langCode) return;
            const selectedLanguage = this.supportedLanguages.find(language => language.code === langCode);
            const langLabel = this.formatLanguageLabel(selectedLanguage);
            const langFlag = this.getLanguageFlag(langCode);
            
            // Update selected language
            langItems.forEach(i => i.classList.remove("selected"));
            item.classList.add("selected");
            
            // Update current language display
            const currentLang = this.findElement("#acc-current-language", menu);
            if (currentLang) {
              currentLang.textContent = langLabel;
            }
            const currentLangFlag = this.findElement("#acc-current-language-flag", menu);
            if (currentLangFlag) {
              currentLangFlag.textContent = langFlag;
            }
            
            if (langDetails) {
              langDetails.open = false;
            }
            
            // Save language preference and update UI
            this.saveConfig({ lang: langCode });
            this.translateMenuUI(menuContainer);
          });
        });
  
        // click event handler:
        menu.addEventListener('click', (e) => {
          const target = e.target.closest('[role="button"], button, .acc-overlay');
          if (!target) return;
          if (target.classList.contains('acc-overlay') || target.classList.contains('acc-menu-close')) {
            this.closeMenu(menuContainer);
            return;
          }
          if (target.classList.contains('acc-footer-reset')) {
            this.resetEnhancements();
            return;
          }
          const btn = target.classList.contains('acc-btn') ? target : null;
          if (btn) {
            const key = btn.dataset.key;
            // Handle accessibility report action
            if (key === 'accessibility-report') {
              this.runAccessibilityReport();
            }
            // Handle multi-level features (font size, contrast).
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
            }
          }
        });
        menu.querySelectorAll('[role="button"], button').forEach(el => {
          el.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              el.click();
            }
          });
        });
        this.translateMenuUI(menuContainer);
        const config = this.loadConfig();
        const activeColorFilter = this.getActiveColorFilterKey(config.states);
        this.setColorFilterUI(menu, activeColorFilter);
        this.updateColorFilterState(activeColorFilter);
        if (config.states) {
          for (let key in config.states) {
            if (this.isColorFilterKey(key)) {
              continue;
            }
            if (config.states[key] && key !== "text-scale") {
              const selector = key; // keys now directly match our updated options.
              const btn = this.findElement(`.acc-btn[data-key="${selector}"]`, menu);
              if (btn) {
                btn.classList.add("acc-selected");
                btn.setAttribute('aria-pressed', 'true');
              }
            } else if (key === "text-scale") {
              const scaleBtn = this.findElement(`.acc-btn[data-key="text-scale"]`, menu);
              if (scaleBtn && this.textScaleIndex > 0) {
                scaleBtn.classList.add("acc-selected");
                scaleBtn.setAttribute('aria-pressed', 'true');
              }
            }
          }
        }
        container.appendChild(menuContainer);
        return menuContainer;
      } catch (e) {
        console.error('Error displaying menu:', e);
        return null;
      }
    },

  displayWidget(options) {
    try {
      this.applyThemeVariables();
      this.registerStaticStyles();

      const widgetTemplate = `
        <div class="acc-widget">
          <a href="#" id="accessibilityWidget" class="acc-toggle-btn" title="Open Accessibility Menu" role="button" aria-label="Open accessibility menu" aria-expanded="false">
            ${this.widgetIcons.accessibility}
            <span class="acc-violation-bubble" data-severity="warning" hidden> </span>
          </a>
        </div>
        `;
      
        const widget = document.createElement("div");
        widget.innerHTML = widgetTemplate;
        widget.classList.add("acc-container");
        const btn = this.findElement(".acc-toggle-btn", widget);
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
        } else if (position === "center-left") {
          buttonStyle = { top: "50%", transform: "translateY(-50%)", left: `${offsetX}px`, bottom: "auto" };
        }
        Object.assign(btn.style, buttonStyle);
  
        if (size !== undefined && size !== null && String(size).trim() !== '') {
          const buttonSize = this.normalizeButtonSize(size);
          btn.style.setProperty('--acc-button-size', buttonSize);
        }
        
        let menu;
        btn.addEventListener("click", (event) => {
          event.preventDefault();
          if (!menu) {
            menu = this.displayMenu({ ...options, container: widget });
            if (!menu) return;
            this.menuContainer = menu;
  
            const overlay = menu.querySelector('.acc-overlay');
            if (overlay) {
              overlay.addEventListener('click', (overlayEvent) => {
                overlayEvent.stopPropagation();
                this.closeMenu(menu, btn);
              });
            }
  
            const closeBtn = menu.querySelector('.acc-menu-close');
            if (closeBtn) {
              closeBtn.addEventListener('click', (closeEvent) => {
                closeEvent.stopPropagation();
                this.closeMenu(menu, btn);
              });
            }
          }
  
          const isHidden = menu.style.display === 'none' || window.getComputedStyle(menu).display === 'none';
          if (isHidden) {
            this.openMenu(menu, btn);
          } else {
            this.closeMenu(menu, btn);
          }
        });
        
        // Handle keyboard interaction
        btn.addEventListener("keydown", (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            btn.click();
          }
        });
        
        document.body.appendChild(widget);
        this.translateMenuUI(widget);
        this.ensureSkipLink();
        this.runBackgroundAxeScan().catch(() => {
          this.updateViolationBubble({ violations: [] });
        });
        
        // Add a click handler to the document to blur the toggle button when clicking outside
        document.addEventListener('click', (e) => {
          if (!btn) return;
          const clickedToggle = e.target === btn || btn.contains(e.target);
          const clickedInsideWidget = e.target.closest('.acc-container');
          if (menu && this.activeMenuContainer === menu && menu.style.display !== 'none') {
            const clickedInsideMenu = menu.contains(e.target);
            if (!clickedToggle && !clickedInsideMenu && !clickedInsideWidget) {
              this.closeMenu(menu, btn);
            }
          } else if (!clickedToggle) {
            btn.blur();
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
            if (document.querySelector('.acc-widget .acc-toggle-btn')) {
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
            const lang = baseOptions.lang ||
              document.querySelector('html')?.getAttribute('lang')?.replace(/[_-].*/, '') ||
              navigator.language ||
              "en";
            baseOptions.lang = lang;
  
            baseOptions.position = baseOptions.position || "bottom-right";
  
            if (baseOptions.offset) {
              baseOptions.offset = this.normalizeOffset(baseOptions.offset);
            }
  
            if (baseOptions.size) {
              baseOptions.size = this.normalizeButtonSize(baseOptions.size);
              this.widgetTheme.buttonSize = baseOptions.size;
            }
  
            this.options = { ...baseOptions };
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
            let options = { lang: this.getDefaultLanguage(), position: 'bottom-right', offset: [20, 20] };
            
            // Load the saved configuration
            try {
              const savedConfig = this.fetchSavedConfig();
              if (savedConfig) {
                options = { ...options, ...JSON.parse(savedConfig) };
                // Note: We don't call applyEnhancements() here anymore as it's already called in startAccessibleWebWidget
              }
            } catch (e) {
              console.warn('Error loading saved config:', e);
            }
            
            // Merge with new arguments
            options = { ...options, ...args };
            this.saveConfig(options);
            
            // Display the widget UI
            this.displayWidget(options);
          } catch (e) {
            console.error('Error in widget launch:', e);
          }
        },

};
