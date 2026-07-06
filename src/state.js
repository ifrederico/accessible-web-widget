/** @typedef {import('./index.js').default} AccessibleWebWidget */

/** @type {{ [methodName: string]: (this: AccessibleWebWidget, ...args: any[]) => any }} */
export const stateMethods = {

  storageAvailable() {
      try {
        const test = '__test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
      } catch {
        return false;
      }
    },

  fetchCookie(name) {
      const cookieName = name + "=";
      try {
        const match = document.cookie.split(';')
          .map(c => c.trim())
          .find(c => c.startsWith(cookieName));
        if (!match) return "{}";
        return decodeURIComponent(match.substring(cookieName.length)) || "{}";
      } catch (e) {
        console.warn('Error reading cookie:', e);
        return "{}";
      }
    },

  storeCookie(name, value, days) {
      try {
        const d = new Date();
        d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + d.toUTCString();
        const isSecure = window.location.protocol === 'https:';
        document.cookie = name + "=" + encodeURIComponent(value) + ";" + expires + ";path=/;SameSite=Strict" + (isSecure ? ";Secure" : "");
      } catch (e) {
        console.warn('Error setting cookie:', e);
      }
    },

  getSavedLanguage() {
      try {
        const config = JSON.parse(this.fetchSavedConfig());
        if (config.lang) return config.lang;
      } catch {
        // Ignore parsing errors
      }
      return null;
    },

  // A language counts as user-selected only when picked in the widget's
  // language menu (langUserSelected flag). The lang launchWidget auto-saves
  // on every load must not outrank the embed config or <html lang>, or a
  // site owner's later configuration change would never reach returning
  // visitors.
  getUserSelectedLanguage() {
      try {
        const config = JSON.parse(this.fetchSavedConfig());
        if (config.langUserSelected && config.lang) return config.lang;
      } catch {
        // Ignore parsing errors
      }
      return null;
    },

  getBrowserLanguage() {
      if (typeof navigator === 'undefined') return 'en';
  
      const supportedCodes = this.supportedLanguages.map(lang => lang.code);
  
      // Get browser languages (navigator.languages is an array, navigator.language is a string)
      const browserLanguages = navigator.languages
        ? [...navigator.languages]
        : [navigator.language || navigator.userLanguage || 'en'];
  
      for (const browserLang of browserLanguages) {
        // Extract the primary language code (e.g., 'en-US' -> 'en')
        const primaryCode = browserLang.split('-')[0].toLowerCase();
  
        if (supportedCodes.includes(primaryCode)) {
          return primaryCode;
        }
      }
  
      // Default to English if no supported language found
      return 'en';
    },

  getDefaultLanguage() {
      // Priority: 1. Saved language, 2. Browser language, 3. English
      const savedLang = this.getSavedLanguage();
      if (savedLang) {
        const supportedCodes = this.supportedLanguages.map(lang => lang.code);
        if (supportedCodes.includes(savedLang)) {
          return savedLang;
        }
      }
      return this.getBrowserLanguage();
    },

  // Map a configured language tag to a supported dictionary code: exact
  // match first, then the primary subtag ('pt-BR' → 'pt'). 'auto' or
  // unsupported tags fall back to the saved/browser language.
  resolveSupportedLanguage(code) {
      const supportedCodes = this.supportedLanguages.map(lang => lang.code);
      const raw = String(code || '').trim();
      if (raw && raw.toLowerCase() !== 'auto') {
        if (supportedCodes.includes(raw)) return raw;
        const primary = raw.split(/[_-]/)[0].toLowerCase();
        if (supportedCodes.includes(primary)) return primary;
      }
      return this.getDefaultLanguage();
    },

  isDevMode() {
      if (typeof window === 'undefined') return false;
      try {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('acc-dev') === 'true';
      } catch {
        return false;
      }
    },

  getDataAttributeOptions() {
      const options = {};
      if (typeof document === 'undefined') return options;
  
      const attributes = ['lang', 'position', 'offset', 'size', 'icon'];
  
      const assignValue = (key, value) => {
        if (value === null || typeof value === 'undefined' || value === '') return;
        switch (key) {
          case 'lang': {
            const lang = String(value).trim();
            if (lang) options.lang = lang;
            break;
          }
          case 'position': {
            const position = String(value).trim();
            if (position) options.position = position;
            break;
          }
          case 'offset': {
            const normalized = this.normalizeOffset(value);
            if (normalized) options.offset = normalized;
            break;
          }
          case 'size': {
            const normalizedSize = this.normalizeButtonSize(value);
            if (normalizedSize) options.size = normalizedSize;
            break;
          }
          case 'icon': {
            const icon = String(value).trim();
            if (icon) options.icon = icon;
            break;
          }
          default:
            break;
        }
      };
  
      const inspectElement = (el) => {
        if (!el) return;
        attributes.forEach(key => {
          const attrName = `data-acc-${key}`;
          const attrValue = el.getAttribute ? el.getAttribute(attrName) : null;
          assignValue(key, attrValue);
        });
      };
  
      const scriptCandidates = [];
      if (document.currentScript) {
        scriptCandidates.push(document.currentScript);
      }
      document.querySelectorAll('script[data-acc-lang],script[data-acc-position],script[data-acc-offset],script[data-acc-size],script[data-acc-icon]').forEach(script => {
        if (!scriptCandidates.includes(script)) {
          scriptCandidates.push(script);
        }
      });
      scriptCandidates.forEach(inspectElement);
  
      attributes.forEach(key => {
        if (options[key] !== undefined) return;
        const el = document.querySelector(`[data-acc-${key}]`);
        if (el) {
          assignValue(key, el.getAttribute(`data-acc-${key}`));
        }
      });
  
      return options;
    },

  normalizeOffset(value) {
      if (!value && value !== 0) return undefined;
      let parts = [];
      if (Array.isArray(value)) {
        parts = value;
      } else if (typeof value === 'string') {
        parts = value.split(/[, ]+/);
      } else {
        parts = [value];
      }
      const parsed = parts
        .map(part => {
          const number = Number(part);
          return Number.isFinite(number) ? Math.round(number) : null;
        })
        .filter(number => number !== null);
  
      if (!parsed.length) return undefined;
      if (parsed.length === 1) parsed.push(parsed[0]);
      return [parsed[0], parsed[1] !== undefined ? parsed[1] : parsed[0]];
    },

  normalizeButtonSize(value) {
      const fallback = this.widgetTheme?.buttonSize || '48px';
      if (typeof value === 'number' && Number.isFinite(value)) {
        return `${Math.max(24, Math.round(value))}px`;
      }
      if (typeof value === 'string') {
        const trimmed = value.trim();
        if (!trimmed) return fallback;
        if (/^\d+(\.\d+)?(px|em|rem|%)$/i.test(trimmed)) {
          return trimmed;
        }
        const numeric = Number(trimmed);
        if (Number.isFinite(numeric)) {
          return `${Math.max(24, Math.round(numeric))}px`;
        }
        return trimmed;
      }
      return fallback;
    },


  isSystemControlledPreference(key) {
      const systemDefaults = this.widgetConfig?.systemDefaults || {};
      return Object.prototype.hasOwnProperty.call(systemDefaults, key);
    },

  hasExplicitStatePreference(key) {
      const states = this.widgetConfig?.states || {};
      if (!Object.prototype.hasOwnProperty.call(states, key)) {
        return false;
      }
      return !this.isSystemControlledPreference(key);
    },


  updateState(payload, options = {}) {
      const source = options.source || 'user';
      const previousStates = this.widgetConfig.states || {};
      const previousSystemDefaults = this.widgetConfig.systemDefaults || {};
      const nextStates = { ...previousStates, ...payload };
      const nextSystemDefaults = { ...previousSystemDefaults };
      const keys = Object.keys(payload || {});

      if (source === 'system') {
        keys.forEach((key) => {
          nextSystemDefaults[key] = payload[key];
        });
      } else {
        keys.forEach((key) => {
          if (Object.prototype.hasOwnProperty.call(nextSystemDefaults, key)) {
            delete nextSystemDefaults[key];
          }
        });
      }

      const updatedConfig = { ...this.widgetConfig, states: nextStates, systemDefaults: nextSystemDefaults };
      this.saveConfig(updatedConfig);
      return updatedConfig;
    },

  // Return keys to "no preference": unlike writing an explicit false via
  // updateState, this lets system defaults (prefers-reduced-motion,
  // prefers-contrast) re-apply afterwards.
  clearStates(keys) {
      const nextStates = { ...(this.widgetConfig.states || {}) };
      const nextSystemDefaults = { ...(this.widgetConfig.systemDefaults || {}) };
      (keys || []).forEach((key) => {
        delete nextStates[key];
        delete nextSystemDefaults[key];
      });
      const updatedConfig = { ...this.widgetConfig, states: nextStates, systemDefaults: nextSystemDefaults };
      this.saveConfig(updatedConfig);
      return updatedConfig;
    },

  saveConfig(newConfig) {
      this.widgetConfig = { ...this.widgetConfig, ...newConfig };
      if (this.storageAvailable()) {
        try {
          localStorage.setItem(this.cookieKey, JSON.stringify(this.widgetConfig));
        } catch {
          this.storeCookie(this.cookieKey, JSON.stringify(this.widgetConfig), 365);
        }
      } else {
        this.storeCookie(this.cookieKey, JSON.stringify(this.widgetConfig), 365);
      }
    },

  retrieveState(key) {
      return this.widgetConfig.states ? this.widgetConfig.states[key] : undefined;
    },

  loadConfig(cache = true) {
      if (cache) return this.widgetConfig;
      const savedConfig = this.fetchSavedConfig();
      if (savedConfig) {
        try {
          this.widgetConfig = JSON.parse(savedConfig);
        } catch (e) {
          console.warn('Error parsing config:', e);
          this.widgetConfig = {};
        }
      }
      return this.widgetConfig;
    },

  fetchSavedConfig() {
      if (this.storageAvailable()) {
        try {
          const stored = localStorage.getItem(this.cookieKey);
          if (stored) return stored;
        } catch (e) {
          console.warn('localStorage failed, falling back to cookies:', e);
        }
      }
      const cookieVal = this.fetchCookie(this.cookieKey);
      return cookieVal && cookieVal !== "" ? cookieVal : "{}";
    },


};
