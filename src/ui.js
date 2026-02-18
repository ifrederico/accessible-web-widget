export const uiMethods = {

  translate(label) {
      const { lang } = this.loadConfig();
      const dictionary = this.translations[lang] || this.translations["en"];
      return dictionary[label] || label;
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
  
      const langPanel = this.findElement('#acc-lang-panel', targetContainer);
      if (langPanel) {
        langPanel.classList.remove('open');
        if (langPanel.__accwebTrapFocus) {
          document.removeEventListener('keydown', langPanel.__accwebTrapFocus);
          delete langPanel.__accwebTrapFocus;
        }
      }
      const langToggle = this.findElement('.acc-lang-toggle', targetContainer);
      if (langToggle) {
        langToggle.setAttribute('aria-expanded', 'false');
      }
      const backButton = this.findElement('.acc-back-btn', targetContainer);
      if (backButton) {
        backButton.classList.remove('visible');
      }
      const defaultTitle = this.findElement('.acc-menu-title-default', targetContainer);
      if (defaultTitle) {
        defaultTitle.classList.remove('hidden');
      }
      const langTitle = this.findElement('.acc-menu-title-dynamic', targetContainer);
      if (langTitle) {
        langTitle.classList.remove('visible');
      }
  
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
  
      this.activeMenuContainer = null;
      this.activeMenuToggle = null;
      this.previousFocus = null;
    },

  renderOptions(options, optionClass) {
      let html = '';
      for (let i = 0; i < options.length; i++) {
        const opt = options[i];
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

        const menuTemplate = `
        <div class="acc-menu" role="dialog" aria-labelledby="accessibility-title">
          <div class="acc-menu-header">
            <div class="acc-header-back">
              <button type="button" class="acc-back-btn" aria-label="Back to accessibility menu">
                ${this.widgetIcons.arrowBack}
                <span>Back</span>
              </button>
            </div>
            <div id="accessibility-title" class="acc-menu-title acc-menu-title-default acc-label">Accessibility Menu</div>
            <div id="language-settings-title" class="acc-menu-title acc-menu-title-dynamic acc-label">Language Settings</div>
            <div class="acc-header-actions">
              <button type="button" class="acc-lang-toggle" aria-expanded="false" aria-label="Language settings" title="Language settings">
                ${this.widgetIcons.language}
              </button>
              <div role="button" class="acc-menu-close" title="Close" aria-label="Close accessibility menu" tabindex="0">
                ${this.widgetIcons.close}
              </div>
            </div>
          </div>
          <div id="acc-lang-panel" class="acc-lang-panel">
            <div class="acc-lang-current-container">
              <div class="acc-lang-current">
                <span id="acc-current-language">${this.supportedLanguages.find(l => l.code === (lang || "en"))?.label || "English (English)"}</span>
                <span class="acc-icon-check"></span>
              </div>
            </div>
            <div>
              <div class="acc-section-title">All Languages</div>
              <div class="acc-lang-search-wrapper">
                <input type="text" id="acc-lang-search" class="acc-lang-search" placeholder="Search language" aria-label="Search language">
              </div>
              <div class="acc-lang-list">
                ${this.supportedLanguages.map(l => 
                  `<button type="button" class="acc-lang-item${l.code === (lang || "en") ? ' selected' : ''}" data-lang="${l.code}">${l.label}</button>`
                ).join('')}
              </div>
            </div>
            </div>
          <div id="acc-menu-content" class="acc-menu-content">
            <div class="acc-section">
              <div class="acc-section-title">Content Adjustments</div>
              <div class="acc-options content"> </div>
            </div>
            <div class="acc-section">
              <div class="acc-section-title">Color Adjustments</div>
              <div class="acc-options filters"> </div>
            </div>
            <div class="acc-section">
              <div class="acc-section-title">Tools</div>
              <div class="acc-options tools"> </div>
            </div>
            <div class="acc-reset-container">
              <button class="acc-reset-btn" title="Reset All Settings" aria-label="Reset all accessibility settings" tabindex="0">
                ${this.widgetIcons.reset}
                <span>Reset All Settings</span>
              </button>
            </div>
          </div>
          <div class="acc-footer">
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
  
        menu.querySelector(".content").innerHTML = this.renderOptions(this.contentOptions);
        menu.querySelector(".tools").innerHTML = this.renderOptions(this.accessTools, 'acc-tools');
        menu.querySelector(".filters").innerHTML = this.renderOptions(this.colorOptions, 'acc-filter');
        const langToggle = this.findElement(".acc-lang-toggle", menu);
        const langPanel = this.findElement("#acc-lang-panel", menu);
        const langSearch = this.findElement("#acc-lang-search", menu);
        const langItems = menu.querySelectorAll(".acc-lang-item");
        const backButton = this.findElement(".acc-back-btn", menu);
        const defaultTitle = this.findElement(".acc-menu-title-default", menu);
        const langTitle = this.findElement(".acc-menu-title-dynamic", menu);
  
  
        // Focus trapping for language panel
        const trapFocus = (e) => {
          if (!langPanel.classList.contains('open')) return;
          
          const focusableElements = this.getFocusableElements(langPanel);
          if (backButton.classList.contains('visible') && !focusableElements.includes(backButton)) {
            focusableElements.unshift(backButton);
          }
          if (!focusableElements.length) return;
          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];
  
          if (e.key === 'Tab') {
            if (e.shiftKey) {
              if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
              }
            } else {
              if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
              }
            }
          }
          
          if (e.key === 'Escape' || e.key === 'Esc') {
            e.preventDefault();
            e.stopPropagation();
            closeLanguagePanel();
          }
        };
  
        const closeLanguagePanel = (returnFocus = true) => {
          langPanel.classList.remove('open');
          langToggle.setAttribute('aria-expanded', 'false');
          document.removeEventListener('keydown', trapFocus);
          delete langPanel.__accwebTrapFocus;
          backButton.classList.remove('visible');
          defaultTitle.classList.remove('hidden');
          langTitle.classList.remove('visible');
          if (returnFocus) {
            langToggle.focus();
          }
        };
  
        langToggle.addEventListener("click", () => {
          const isExpanded = langToggle.getAttribute('aria-expanded') === 'true';
          langToggle.setAttribute('aria-expanded', !isExpanded);
          langPanel.classList.toggle('open');
          
          backButton.classList.toggle('visible', !isExpanded);
          defaultTitle.classList.toggle('hidden', !isExpanded);
          langTitle.classList.toggle('visible', !isExpanded);
          
          if (!isExpanded) {
            langSearch.focus();
            document.addEventListener('keydown', trapFocus);
            langPanel.__accwebTrapFocus = trapFocus;
          } else {
            closeLanguagePanel(false);
          }
        });
  
        backButton.addEventListener("click", () => {
          closeLanguagePanel();
        });
  
        // Close language panel if clicking outside
        document.addEventListener("click", (e) => {
            if (langPanel.classList.contains('open') && 
                !langPanel.contains(e.target) && 
                !langToggle.contains(e.target) &&
                !backButton.contains(e.target)) {
              closeLanguagePanel(false);
            }
          });
  
        // Handle language search
        langSearch.addEventListener("input", () => {
          const searchValue = langSearch.value.toLowerCase();
          langItems.forEach(item => {
            const text = item.textContent.toLowerCase();
            item.style.display = text.includes(searchValue) ? "block" : "none";
          });
        });
  
        // Handle language selection
        langItems.forEach(item => {
          item.addEventListener("click", () => {
            const langCode = item.getAttribute("data-lang");
            const langLabel = item.textContent;
            
            // Update selected language
            langItems.forEach(i => i.classList.remove("selected"));
            item.classList.add("selected");
            
            // Update current language display
            const currentLang = this.findElement("#acc-current-language", menu);
            if (currentLang) {
              currentLang.textContent = langLabel;
            }
            
            // Close panel
            closeLanguagePanel(false);
            
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
          if (target.classList.contains('acc-reset-btn')) {
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
            // Handle multi-level feature for text-scale.
            else if (key === 'text-scale') {
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
              this.updateState({ [key]: isSelected });
              this.applyEnhancements();
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
          </a>
        </div>
        `;
      
        const widget = document.createElement("div");
        widget.innerHTML = widgetTemplate;
        widget.classList.add("acc-container");
        const btn = this.findElement(".acc-toggle-btn", widget);
  
        this.widgetToggleButton = btn;
      
        const { position = "bottom-left", offset = [20, 20], size } = options;
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
  
        const customButtonSizeProvided = size !== undefined && size !== null && String(size).trim() !== '';
        const buttonSize = customButtonSizeProvided
          ? this.normalizeButtonSize(size)
          : this.widgetTheme.buttonSize;
  
        if (customButtonSizeProvided) {
          btn.style.width = buttonSize;
          btn.style.height = buttonSize;
          btn.style.minWidth = buttonSize;
          btn.style.minHeight = buttonSize;
          btn.style.maxWidth = buttonSize;
          btn.style.maxHeight = buttonSize;
        }
  
        const icon = btn.querySelector('svg');
        const numericButtonSize = parseInt(buttonSize, 10);
        if (icon && Number.isFinite(numericButtonSize) && customButtonSizeProvided) {
          const iconSize = `${Math.max(20, Math.round(numericButtonSize * 0.6))}px`;
          ['width', 'height', 'minWidth', 'minHeight', 'maxWidth', 'maxHeight'].forEach(prop => {
            const cssProp = prop.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`);
            icon.style.setProperty(cssProp, iconSize, 'important');
          });
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
        
        // Add a click handler to the document to blur the toggle button when clicking outside
        document.addEventListener('click', (e) => {
          if (!btn) return;
          const clickedToggle = e.target === btn || btn.contains(e.target);
          if (menu && this.activeMenuContainer === menu && menu.style.display !== 'none') {
            const clickedInsideMenu = menu.contains(e.target);
            if (!clickedToggle && !clickedInsideMenu) {
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
  
            baseOptions.position = baseOptions.position || "bottom-left";
  
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
            let options = { lang: this.getDefaultLanguage(), position: 'bottom-left', offset: [20, 20] };
            
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
