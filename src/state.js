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
        const decodedCookie = decodeURIComponent(document.cookie);
        return decodedCookie.split(';')
          .map(c => c.trim())
          .find(c => c.startsWith(cookieName))
          ?.substring(cookieName.length) || "{}";
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
        document.cookie = name + "=" + value + ";" + expires + ";path=/;SameSite=Strict" + (isSecure ? ";Secure" : "");
      } catch (e) {
        console.warn('Error setting cookie:', e);
      }
    },

  getSavedLanguage() {
      try {
        // Try localStorage first
        if (this.storageAvailable()) {
          const stored = localStorage.getItem(this.cookieKey);
          if (stored) {
            const config = JSON.parse(stored);
            if (config.lang) return config.lang;
          }
        }
        // Fallback to cookie
        const cookieVal = this.fetchCookie(this.cookieKey);
        if (cookieVal && cookieVal !== "") {
          const config = JSON.parse(cookieVal);
          if (config.lang) return config.lang;
        }
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
  
      const attributes = ['lang', 'position', 'offset', 'size'];
  
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
      document.querySelectorAll('script[data-acc-lang],script[data-acc-position],script[data-acc-offset],script[data-acc-size]').forEach(script => {
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
      const fallback = this.widgetTheme?.buttonSize || '34px';
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

  toggleDisplay(el, state) {
      if (!el) return;
      try {
        el.style.display = (typeof state === "undefined") 
          ? (el.style.display === "none" ? "block" : "none") 
          : (state ? "block" : "none");
      } catch (e) {
        console.warn('Error toggling element:', e);
      }
    },

  updateState(payload) {
      const updatedConfig = { ...this.widgetConfig, states: { ...this.widgetConfig.states, ...payload } };
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

  fetchDataAttr(attr) {
      try {
        const dataAttr = `data-acc-${attr}`;
        const element = document.querySelector(`[${dataAttr}]`);
        return element ? element.getAttribute(dataAttr) : null;
      } catch (e) {
        console.warn(`Error getting data attribute: ${attr}`, e);
        return null;
      }
    },

};
