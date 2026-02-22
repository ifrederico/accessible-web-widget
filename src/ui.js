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

  getWidgetIconMarkup(iconKey) {
      const normalized = typeof iconKey === 'string' ? iconKey.trim().toLowerCase() : '';
      const variants = this.widgetIcons?.accessibilityVariants || {};
      return variants[normalized] || variants.default || this.widgetIcons.accessibility;
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

      const langModal = this.findElement('#acc-lang-modal', targetContainer);
      if (langModal) {
        langModal.setAttribute('hidden', '');
      }

      const langToggle = this.findElement('.acc-footer-lang-toggle', targetContainer);
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

  renderTextScaleControl(scaleValue = 1) {
      const percent = this.getTextScalePercent(scaleValue);
      const min = Number(this.textScaleMinPercent) || 80;
      const max = Number(this.textScaleMaxPercent) || 150;
      const step = Number(this.textScaleStepPercent) || 5;
      const progress = ((percent - min) / (max - min)) * 100;

      return `
        <div class="acc-text-scale-control" data-key="text-scale">
          <div class="acc-text-scale-meta">
            <span class="acc-text-scale-icon" aria-hidden="true">${this.widgetIcons.adjustFontSize}</span>
            <span class="acc-label" data-acc-text="Font Size">Font Size</span>
            <span class="acc-text-scale-percent">${percent}%</span>
          </div>
          <input
            type="range"
            class="acc-text-scale-range"
            min="${min}"
            max="${max}"
            step="${step}"
            value="${percent}"
            data-acc-text="Font Size"
            aria-label="Font Size"
            style="--acc-text-scale-progress: ${Math.max(0, Math.min(100, progress))}%">
        </div>
      `;
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

  displayMenu({ container, lang, position = 'bottom-right', offset = [20, 20], size, icon }) {
      try {
        this.applyThemeVariables();
        this.registerStaticStyles();

        const activeLanguageCode = String(lang || 'en').split(/[_-]/)[0].toLowerCase();

        const menuTemplate = `
        <div class="acc-menu" role="dialog" aria-labelledby="accessibility-title">
          <div class="acc-menu-header">
            <div id="accessibility-title" class="acc-menu-title">
              <span class="acc-menu-title-icon" aria-hidden="true">${this.getWidgetIconMarkup(icon)}</span>
              <span class="acc-label">Accessibility</span>
            </div>
            <div class="acc-header-actions">
              
            </div>
          </div>
          <div id="acc-menu-content" class="acc-menu-content">
            <div class="acc-options-all"> </div>
          </div>
          <div class="acc-footer">
            <button type="button" class="acc-footer-reset" title="Reset settings" aria-label="Reset settings">
              ${this.widgetIcons.reset}
              <span class="acc-label">Reset settings</span>
            </button>
            <div class="acc-footer-meta">
              <a href="https://github.com/ifrederico/accessible-web-widget" target="_blank" rel="noopener noreferrer">AccessibleWeb Widget</a>
              <button type="button" class="acc-footer-lang-toggle" title="Language" aria-label="Language" aria-expanded="false" aria-controls="acc-lang-modal">
                <span id="acc-current-language" class="acc-footer-lang-current">${String(activeLanguageCode || 'en').toUpperCase()}</span>
                <span class="acc-footer-lang-arrow" aria-hidden="true"> </span>
              </button>
            </div>
            <div id="acc-lang-modal" class="acc-lang-modal" hidden>
              <div class="acc-lang-modal-header">
                <div class="acc-section-title acc-label">All Languages</div>
              </div>
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
        const isRightAligned = position === 'bottom-right' || position === 'top-right' || this.widgetTheme.menuPosition === 'right';
        if (isRightAligned) {
          menu.style.right = 'var(--acc-menu-inline-gap, 12px)';
          menu.style.left = 'auto';
        } else {
          menu.style.left = 'var(--acc-menu-inline-gap, 12px)';
          menu.style.right = 'auto';
        }

        const normalizedOffset = this.normalizeOffset(offset) || [20, 20];
        const offsetY = normalizedOffset[1] ?? 25;
        const buttonSize = size !== undefined && size !== null && String(size).trim() !== ''
          ? this.normalizeButtonSize(size)
          : (this.widgetTheme?.buttonSize || '48px');

        if (position === 'bottom-right' || position === 'bottom-left') {
          menu.style.bottom = `calc(${offsetY}px + ${buttonSize} + 16px)`;
        } else if (position === 'top-right' || position === 'top-left') {
          menu.style.top = `calc(${offsetY}px + ${buttonSize} + 16px)`;
        }
  
        const config = this.loadConfig();

        const textKeys = new Set(['text-scale', 'bold-text', 'line-spacing', 'letter-spacing', 'readable-text']);
        const colorKeys = new Set(['contrast-toggle', 'invert-colors', 'saturation-toggle', 'high-contrast-mode']);
        const readingAidsKeys = new Set(['reading-aid', 'highlight-links', 'highlight-title', 'simple-layout']);

        const sourceOptions = [
          ...this.contentOptions.map(option => ({ ...option })),
          ...this.colorOptions.map(option => ({ ...option, optionClass: 'acc-filter' })),
          ...this.accessTools.map(option => ({ ...option, optionClass: 'acc-tools' }))
        ];

        const groupedOptions = {
          speech: [],
          text: [],
          color: [],
          reading: [],
          interaction: []
        };

        const seenKeys = new Set();
        sourceOptions.forEach(option => {
          if (!option?.key || seenKeys.has(option.key)) return;
          seenKeys.add(option.key);

          if (option.key === 'text-to-speech') {
            groupedOptions.speech.push(option);
            return;
          }
          if (textKeys.has(option.key)) {
            groupedOptions.text.push(option);
            return;
          }
          if (colorKeys.has(option.key)) {
            groupedOptions.color.push(option);
            return;
          }
          if (readingAidsKeys.has(option.key)) {
            groupedOptions.reading.push(option);
            return;
          }
          groupedOptions.interaction.push(option);
        });

        const sectionConfig = [
          { key: 'speech', label: 'Speech', containerClass: 'acc-tts-toggle-container', optionClass: 'acc-tts-toggle' },
          { key: 'text', label: 'Text', containerClass: 'acc-options acc-options-text' },
          { key: 'color', label: 'Color & Contrast', containerClass: 'acc-options' },
          { key: 'reading', label: 'Reading Aids', containerClass: 'acc-options' },
          { key: 'interaction', label: 'Interaction', containerClass: 'acc-options' }
        ];

        const sectionMarkup = sectionConfig.map(section => {
          let sectionOptions = groupedOptions[section.key];
          let specialContent = '';

          if (section.key === 'text') {
            const textScaleOption = sectionOptions.find(option => option.key === 'text-scale');
            sectionOptions = sectionOptions.filter(option => option.key !== 'text-scale');
            const textOrder = ['line-spacing', 'letter-spacing', 'bold-text', 'readable-text'];
            sectionOptions.sort((a, b) => {
              const indexA = textOrder.indexOf(a.key);
              const indexB = textOrder.indexOf(b.key);
              const rankA = indexA === -1 ? Number.MAX_SAFE_INTEGER : indexA;
              const rankB = indexB === -1 ? Number.MAX_SAFE_INTEGER : indexB;
              return rankA - rankB;
            });
            if (textScaleOption) {
              specialContent = this.renderTextScaleControl(config.states?.['text-scale'] || 1);
            }

            const firstThinRowKeys = new Set(['line-spacing', 'letter-spacing']);
            const secondThinRowKeys = new Set(['bold-text', 'readable-text']);
            const firstThinRowOptions = sectionOptions.filter(option => firstThinRowKeys.has(option.key));
            const secondThinRowOptions = sectionOptions.filter(option => secondThinRowKeys.has(option.key));
            const remainingTextOptions = sectionOptions.filter(option => (
              !firstThinRowKeys.has(option.key) && !secondThinRowKeys.has(option.key)
            ));
            const firstThinRowHtml = firstThinRowOptions.length
              ? `<div class="acc-options acc-options-text-inline">${this.renderOptions(firstThinRowOptions, 'acc-text-inline')}</div>`
              : '';
            const secondThinRowHtml = secondThinRowOptions.length
              ? `<div class="acc-options acc-options-text-inline">${this.renderOptions(secondThinRowOptions, 'acc-text-inline')}</div>`
              : '';
            const remainingTextHtml = remainingTextOptions.length
              ? `<div class="${section.containerClass}">${this.renderOptions(remainingTextOptions, section.optionClass || '')}</div>`
              : '';

            if (!specialContent && !firstThinRowHtml && !secondThinRowHtml && !remainingTextHtml) return '';

            return `
              <section class="acc-option-category acc-option-category-${section.key}">
                <div class="acc-section-title acc-label">${section.label}</div>
                ${specialContent}
                ${firstThinRowHtml}
                ${secondThinRowHtml}
                ${remainingTextHtml}
              </section>
            `;
          }

          if (section.key === 'color') {
            const colorOrder = ['contrast-toggle', 'saturation-toggle', 'invert-colors', 'high-contrast-mode'];
            sectionOptions.sort((a, b) => {
              const indexA = colorOrder.indexOf(a.key);
              const indexB = colorOrder.indexOf(b.key);
              const rankA = indexA === -1 ? Number.MAX_SAFE_INTEGER : indexA;
              const rankB = indexB === -1 ? Number.MAX_SAFE_INTEGER : indexB;
              return rankA - rankB;
            });

            const firstThinRowKeys = new Set(['contrast-toggle', 'saturation-toggle']);
            const secondThinRowKeys = new Set(['invert-colors', 'high-contrast-mode']);
            const firstThinRowOptions = sectionOptions.filter(option => firstThinRowKeys.has(option.key));
            const secondThinRowOptions = sectionOptions.filter(option => secondThinRowKeys.has(option.key));
            const remainingColorOptions = sectionOptions.filter(option => (
              !firstThinRowKeys.has(option.key) && !secondThinRowKeys.has(option.key)
            ));

            const firstThinRowHtml = firstThinRowOptions.length
              ? `<div class="acc-options acc-options-text-inline">${this.renderOptions(firstThinRowOptions, 'acc-text-inline')}</div>`
              : '';
            const secondThinRowHtml = secondThinRowOptions.length
              ? `<div class="acc-options acc-options-text-inline">${this.renderOptions(secondThinRowOptions, 'acc-text-inline')}</div>`
              : '';
            const remainingColorHtml = remainingColorOptions.length
              ? `<div class="${section.containerClass}">${this.renderOptions(remainingColorOptions, section.optionClass || '')}</div>`
              : '';

            if (!firstThinRowHtml && !secondThinRowHtml && !remainingColorHtml) return '';

            return `
              <section class="acc-option-category acc-option-category-${section.key}">
                <div class="acc-section-title acc-label">${section.label}</div>
                ${firstThinRowHtml}
                ${secondThinRowHtml}
                ${remainingColorHtml}
              </section>
            `;
          }

          if (section.key === 'reading') {
            const readingOrder = ['highlight-links', 'highlight-title', 'reading-aid', 'simple-layout'];
            sectionOptions.sort((a, b) => {
              const indexA = readingOrder.indexOf(a.key);
              const indexB = readingOrder.indexOf(b.key);
              const rankA = indexA === -1 ? Number.MAX_SAFE_INTEGER : indexA;
              const rankB = indexB === -1 ? Number.MAX_SAFE_INTEGER : indexB;
              return rankA - rankB;
            });

            const firstThinRowKeys = new Set(['highlight-links', 'highlight-title']);
            const secondThinRowKeys = new Set(['reading-aid', 'simple-layout']);
            const firstThinRowOptions = sectionOptions.filter(option => firstThinRowKeys.has(option.key));
            const secondThinRowOptions = sectionOptions.filter(option => secondThinRowKeys.has(option.key));
            const remainingReadingOptions = sectionOptions.filter(option => (
              !firstThinRowKeys.has(option.key) && !secondThinRowKeys.has(option.key)
            ));

            const firstThinRowHtml = firstThinRowOptions.length
              ? `<div class="acc-options acc-options-text-inline">${this.renderOptions(firstThinRowOptions, 'acc-text-inline')}</div>`
              : '';
            const secondThinRowHtml = secondThinRowOptions.length
              ? `<div class="acc-options acc-options-text-inline">${this.renderOptions(secondThinRowOptions, 'acc-text-inline')}</div>`
              : '';
            const remainingReadingHtml = remainingReadingOptions.length
              ? `<div class="${section.containerClass}">${this.renderOptions(remainingReadingOptions, section.optionClass || '')}</div>`
              : '';

            if (!firstThinRowHtml && !secondThinRowHtml && !remainingReadingHtml) return '';

            return `
              <section class="acc-option-category acc-option-category-${section.key}">
                <div class="acc-section-title acc-label">${section.label}</div>
                ${firstThinRowHtml}
                ${secondThinRowHtml}
                ${remainingReadingHtml}
              </section>
            `;
          }

          const sectionOptionsHtml = sectionOptions.length
            ? this.renderOptions(sectionOptions, section.optionClass || '')
            : '';

          if (!specialContent && !sectionOptionsHtml.trim()) return '';

          const optionsContainer = sectionOptionsHtml.trim()
            ? `<div class="${section.containerClass}">${sectionOptionsHtml}</div>`
            : '';

          return `
            <section class="acc-option-category acc-option-category-${section.key}">
              <div class="acc-section-title acc-label">${section.label}</div>
              ${specialContent}
              ${optionsContainer}
            </section>
          `;
        }).join('');

        menu.querySelector(".acc-options-all").innerHTML = sectionMarkup;
        const langModal = this.findElement("#acc-lang-modal", menu);
        const langToggle = this.findElement(".acc-footer-lang-toggle", menu);
        const langSearch = this.findElement("#acc-lang-search", menu);
        const langItems = menu.querySelectorAll(".acc-lang-item");

        const closeLanguageModal = () => {
          if (langModal) {
            langModal.setAttribute('hidden', '');
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

        const openLanguageModal = () => {
          if (langModal) {
            langModal.removeAttribute('hidden');
          }
          if (langToggle) {
            langToggle.setAttribute('aria-expanded', 'true');
          }
          if (langSearch) {
            langSearch.focus();
          }
        };

        if (langToggle && langModal) {
          langToggle.addEventListener('click', (event) => {
            event.stopPropagation();
            const isOpen = !langModal.hasAttribute('hidden');
            if (isOpen) {
              closeLanguageModal();
            } else {
              openLanguageModal();
            }
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
              currentLang.textContent = String(langCode).toUpperCase();
            }
            closeLanguageModal();
            
            // Save language preference and update UI
            this.saveConfig({ lang: langCode });
            this.translateMenuUI(menuContainer);
          });
        });

        const textScaleRange = this.findElement('.acc-text-scale-range', menu);
        if (textScaleRange) {
          textScaleRange.addEventListener('input', () => {
            const multiplier = this.setTextScaleFromPercent(textScaleRange.value, { persist: false });
            this.syncTextScaleControlUI(menu, multiplier);
          });
          textScaleRange.addEventListener('change', () => {
            const multiplier = this.setTextScaleFromPercent(textScaleRange.value, { persist: true });
            this.syncTextScaleControlUI(menu, multiplier);
          });
          this.syncTextScaleControlUI(menu, config.states?.['text-scale'] || 1);
        }
  
        // click event handler:
        menu.addEventListener('click', (e) => {
          if (langModal && !langModal.hasAttribute('hidden')) {
            const clickedInsideLanguageModal = Boolean(e.target.closest('.acc-lang-modal'));
            const clickedLanguageToggle = Boolean(e.target.closest('.acc-footer-lang-toggle'));
            if (!clickedInsideLanguageModal && !clickedLanguageToggle) {
              closeLanguageModal();
            }
          }

          const target = e.target.closest('[role="button"], button, .acc-overlay');
          if (!target) return;
          if (target.classList.contains('acc-overlay')) {
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
            <span class="acc-toggle-icon" aria-hidden="true">${this.getWidgetIconMarkup(options?.icon)}</span>
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
        if (this.isDevMode()) {
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
        }
        
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
