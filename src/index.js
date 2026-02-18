/*!
 * AccessibleWeb Widget v1.1.0
 * https://github.com/ifrederico/accessible-web-widget
 *
 * Copyright (c) 2025 ifrederico
 * Released under the MIT License
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.
 * See DISCLAIMER.md for important legal information.
 * This widget does not guarantee accessibility compliance.
 */

import { WIDGET_THEME } from './constants/theme.js';
import { WIDGET_ICONS } from './constants/icons.js';
import { TARGET_SELECTORS, PAGE_CONTENT_SELECTOR } from './constants/selectors.js';
import { TRANSLATIONS, SUPPORTED_LANGUAGES } from './constants/translations.js';
import { stateMethods } from './state.js';
import { styleMethods } from './styles.js';
import { featureMethods } from './features.js';
import { uiMethods } from './ui.js';

class AccessibleWebWidget {
  constructor(options = {}) {
    // ======================================================
    // CONFIGURATION & INITIAL STATE
    // ======================================================
    this.widgetTheme = { ...WIDGET_THEME };
    this.widgetIcons = WIDGET_ICONS;
    this.targetSelectors = TARGET_SELECTORS;

    this.visualFilters = {
      'dark-contrast': {
        styles: { 'filter': 'contrast(150%) brightness(0.8)' },
        selector: PAGE_CONTENT_SELECTOR
      },
      'light-contrast': {
        styles: { 'filter': 'contrast(125%) brightness(1.2)' },
        selector: PAGE_CONTENT_SELECTOR
      },
      'invert-colors': {
        styles: { 'filter': 'invert(100%)' },
        selector: PAGE_CONTENT_SELECTOR
      },
      'low-saturation': {
        styles: { 'filter': 'saturate(50%)' },
        selector: PAGE_CONTENT_SELECTOR
      },
      'monochrome': {
        styles: { 'filter': 'grayscale(100%)' },
        selector: PAGE_CONTENT_SELECTOR
      },
      'high-saturation': {
        styles: { 'filter': 'saturate(200%)' },
        selector: PAGE_CONTENT_SELECTOR
      }
    };

    this.translations = TRANSLATIONS;
    this.supportedLanguages = SUPPORTED_LANGUAGES.map((language) => ({ ...language }));

    this.accessTools = [
      { label: 'Big Cursor', key: 'large-pointer', icon: this.widgetIcons.largePointer },
      { label: 'Stop Animations', key: 'pause-motion', icon: this.widgetIcons.pauseMotion },
      { label: 'Reading Guide', key: 'reading-aid', icon: this.widgetIcons.readingAid }
    ];

    // Add Accessibility Report only in dev mode (?acc-dev=true)
    if (this.isDevMode()) {
      this.accessTools.push({
        label: 'Accessibility Report',
        key: 'accessibility-report',
        icon: this.widgetIcons.accessibilityReport,
        isAction: true
      });
    }

    // axe-core state
    this.axeCoreLoaded = false;
    this.axeCoreLoading = false;
    this.axeCorePromise = null;

    // Accessibility report modal state
    this.reportPreviousFocus = null;
    this.reportKeyListener = null;

    // Font size cycling
    this.textScaleIndex = 0;
    this.textScaleValues = [1.2, 1.4, 1.6];

    this.contentOptions = [
      { label: 'Font Weight', key: 'bold-text', icon: this.widgetIcons.boldText },
      { label: 'Line Height', key: 'line-spacing', icon: this.widgetIcons.lineSpacing },
      { label: 'Letter Spacing', key: 'letter-spacing', icon: this.widgetIcons.letterSpacing },
      { label: 'Hide Images', key: 'hide-images', icon: this.widgetIcons.hideImages },
      { label: 'Dyslexia Font', key: 'readable-text', icon: this.widgetIcons.dyslexiaFont },
      { label: 'Highlight Links', key: 'highlight-links', icon: this.widgetIcons.highlightLinks },
      { label: 'Highlight Title', key: 'highlight-title', icon: this.widgetIcons.highlightTitle },
      {
        label: 'Font Size',
        key: 'text-scale',
        icon: this.widgetIcons.adjustFontSize,
        multiLevel: true,
        levels: this.textScaleValues.length
      }
    ];

    this.multiLevelFeatures = {
      'text-scale': {
        levels: this.textScaleValues.length,
        currentIndex: -1,
        values: this.textScaleValues
      }
    };

    this.readingAidTemplate = `
      <div class="acc-rg acc-rg-top" role="presentation"> </div>
      <div class="acc-rg acc-rg-bottom" role="presentation"> </div>
    `;

    this.colorOptions = [
      { label: 'Dark Contrast', key: 'dark-contrast', icon: this.widgetIcons.darkContrast },
      { label: 'Light Contrast', key: 'light-contrast', icon: this.widgetIcons.lightContrast },
      { label: 'Invert Colors', key: 'invert-colors', icon: this.widgetIcons.invertColors },
      { label: 'Low Saturation', key: 'low-saturation', icon: this.widgetIcons.lowSaturation },
      { label: 'Monochrome', key: 'monochrome', icon: this.widgetIcons.monochrome },
      { label: 'High Saturation', key: 'high-saturation', icon: this.widgetIcons.highSaturation }
    ];
    this.colorFilterKeys = this.colorOptions.map(option => option.key);
    this.activeColorFilterKey = null;

    this.textScaleSelectors = 'h1,h2,h3,h4,h5,h6,p,a,dl,dt,li,ol,th,td,span,blockquote,.acc-text';
    this.textScaleObserver = null;
    this.currentTextScaleMultiplier = 1;

    // Global settings and state
    this.widgetConfig = {};
    this.cookieKey = 'accweb';
    this.readingAidVisible = false;
    this.readableFontLoaded = false;

    // Menu state tracking for focus management
    this.activeMenuContainer = null;
    this.activeMenuToggle = null;
    this.menuKeyListener = null;
    this.previousFocus = null;
    this.widgetToggleButton = null;
    this.skipLinkElement = null;
    this.menuContainer = null;

    // Style registration state
    this.staticStylesRegistered = false;

    this.dataOptions = this.getDataAttributeOptions();

    this.options = {
      lang: this.getDefaultLanguage(),
      position: 'bottom-left',
      ...this.dataOptions,
      ...options
    };

    if (this.options.offset) {
      this.options.offset = this.normalizeOffset(this.options.offset);
    }

    if (this.options.size) {
      this.widgetTheme.buttonSize = this.normalizeButtonSize(this.options.size);
      this.options.size = this.widgetTheme.buttonSize;
    }

    this.applyThemeVariables();
    this.registerStaticStyles();
  }
}

Object.assign(
  AccessibleWebWidget.prototype,
  stateMethods,
  styleMethods,
  featureMethods,
  uiMethods
);

if (typeof window !== 'undefined') {
  window.AccessibleWebWidget = AccessibleWebWidget;
}

if (typeof document !== 'undefined') {
  const widgetInstance = new AccessibleWebWidget();
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    widgetInstance.startAccessibleWebWidget();
  } else {
    document.addEventListener('DOMContentLoaded', () => widgetInstance.startAccessibleWebWidget());
  }
}

export default AccessibleWebWidget;
