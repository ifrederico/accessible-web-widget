/*!
 * AccessibleWeb Widget v1.0.2
 * https://github.com/ifrederico/accessible-web-widget
 * 
 * Copyright (c) 2025 ifrederico
 * Released under the MIT License
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.
 * See DISCLAIMER.md for important legal information.
 * This widget does not guarantee accessibility compliance.
 */

class AccessibleWebWidget {
  constructor(options = {}) {
    // ======================================================
    // CONFIGURATION & INITIAL STATE
    // ======================================================
    this.widgetTheme = {
      // Core colors
      primaryColor: '#1976d2',        // Accessible blue (WCAG AA compliant)
      primaryColorLight: '#42a5f5',   // Lighter blue
      primaryColorDark: '#0d47a1',    // Darker blue
      backgroundColor: '#f5f7fa',
      textColor: '#222222',
      textColorInverted: '#ffffff',
      
      // UI elements
      buttonSize: '34px',
      cardBackground: '#ffffff',
      borderColor: '#d1d5db',
      focusRingColor: '#1976d2',      // Match primary
      
      // Interactive states
      hoverColor: '#42a5f5',          // Use light blue for hover
      activeColor: '#0d47a1',         // Use dark blue for active
      
      // Feedback colors
      successColor: '#2e7d32', // Green
      errorColor: '#c62828', // Red
      warningColor: '#f57c00', // Orange
      
      // Other UI properties
      headerHeight: '54px',
      borderRadius: '8px',
      buttonBorderRadius: '0.4rem',
      menuPosition: 'right', // or 'left'
      zIndex: 100000,
      
      // WCAG-specific
      focusBorderWidth: '3px',
      focusOutlineOffset: '2px'
    };

    this.widgetIcons = {
      accessibility: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M480-720q-33 0-56.5-23.5T400-800q0-33 23.5-56.5T480-880q33 0 56.5 23.5T560-800q0 33-23.5 56.5T480-720ZM360-80v-520q-60-5-122-15t-118-25l20-80q78 21 166 30.5t174 9.5q86 0 174-9.5T820-720l20 80q-56 15-118 25t-122 15v520h-80v-240h-80v240h-80Z"/></svg>',
      largePointer: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="m320-410 79-110h170L320-716v306ZM551-80 406-392 240-160v-720l560 440H516l144 309-109 51ZM399-520Z"/></svg>',
      pauseMotion: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="m791-55-91-91q-49 32-104.5 49T480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 17-115.5T146-700l-91-91 57-57 736 736-57 57ZM480-160q43 0 83.5-11t78.5-33L204-642q-22 38-33 78.5T160-480q0 133 93.5 226.5T480-160Zm334-100-58-58q22-38 33-78.5t11-83.5q0-133-93.5-226.5T480-800q-43 0-83.5 11T318-756l-58-58q49-32 104.5-49T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 60-17 115.5T814-260ZM537-537ZM423-423Z"/></svg>',
      readingAid: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M320-80v-440l-80-120v-240h480v240l-80 120v440H320Zm160-260q-25 0-42.5-17.5T420-400q0-25 17.5-42.5T480-460q25 0 42.5 17.5T540-400q0 25-17.5 42.5T480-340ZM320-760h320v-40H320v40Zm320 80H320v16l80 120v384h160v-384l80-120v-16ZM480-480Z"/></svg>',
      boldText: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M272-200v-560h221q65 0 120 40t55 111q0 51-23 78.5T602-491q25 11 55.5 41t30.5 90q0 89-65 124.5T501-200H272Zm121-112h104q48 0 58.5-24.5T566-372q0-11-10.5-35.5T494-432H393v120Zm0-228h93q33 0 48-17t15-38q0-24-17-39t-44-15h-95v109Z"/></svg>',
      lineSpacing: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M240-160 80-320l56-56 64 62v-332l-64 62-56-56 160-160 160 160-56 56-64-62v332l64-62 56 56-160 160Zm240-40v-80h400v80H480Zm0-240v-80h400v80H480Zm0-240v-80h400v80H480Z"/></svg>',
      letterSpacing: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M320-80 160-240l160-160 57 56-64 64h334l-63-64 56-56 160 160L640-80l-57-56 64-64H313l63 64-56 56ZM200-480v-400h80v400h-80Zm240 0v-400h80v400h-80Zm240 0v-400h80v400h-80Z"/></svg>',
      dyslexiaFont: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="m131-252 165-440h79l165 440h-76l-39-112H247l-40 112h-76Zm139-176h131l-64-182h-4l-63 182Zm395 186q-51 0-81-27.5T554-342q0-44 34.5-72.5T677-443q23 0 45 4t38 11v-12q0-29-20.5-47T685-505q-23 0-42 9.5T610-468l-47-35q24-29 54.5-43t68.5-14q69 0 103 32.5t34 97.5v178h-63v-37h-4q-14 23-38 35t-53 12Zm12-54q35 0 59.5-24t24.5-56q-14-8-33.5-12.5T689-393q-32 0-50 14t-18 37q0 20 16 33t40 13Z"/></svg>',
      highlightLinks: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M440-280H280q-83 0-141.5-58.5T80-480q0-83 58.5-141.5T280-680h160v80H280q-50 0-85 35t-35 85q0 50 35 85t85 35h160v80ZM320-440v-80h320v80H320Zm200 160v-80h160q50 0 85-35t35-85q0-50-35-85t-85-35H520v-80h160q83 0 141.5 58.5T880-480q0 83-58.5 141.5T680-280H520Z"/></svg>',
      highlightTitle: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M320-280q17 0 28.5-11.5T360-320q0-17-11.5-28.5T320-360q-17 0-28.5 11.5T280-320q0 17 11.5 28.5T320-280Zm0-160q17 0 28.5-11.5T360-480q0-17-11.5-28.5T320-520q-17 0-28.5 11.5T280-480q0 17 11.5 28.5T320-440Zm0-160q17 0 28.5-11.5T360-640q0-17-11.5-28.5T320-680q-17 0-28.5 11.5T280-640q0 17 11.5 28.5T320-600Zm120 320h240v-80H440v80Zm0-160h240v-80H440v80Zm0-160h240v-80H440v80ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z"/></svg>',
      darkContrast: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M484-80q-84 0-157.5-32t-128-86.5Q144-253 112-326.5T80-484q0-146 93-257.5T410-880q-18 99 11 193.5T521-521q71 71 165.5 100T880-410q-26 144-138 237T484-80Zm0-80q88 0 163-44t118-121q-86-8-163-43.5T464-465q-61-61-97-138t-43-163q-77 43-120.5 118.5T160-484q0 135 94.5 229.5T484-160Zm-20-305Z"/></svg>',
      lightContrast: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M440-800v-120h80v120h-80Zm0 760v-120h80v120h-80Zm360-400v-80h120v80H800Zm-760 0v-80h120v80H40Zm708-252-56-56 70-72 58 58-72 70ZM198-140l-58-58 72-70 56 56-70 72Zm564 0-70-72 56-56 72 70-58 58ZM212-692l-72-70 58-58 70 72-56 56Zm268 452q-100 0-170-70t-70-170q0-100 70-170t170-70q100 0 170 70t70 170q0 100-70 170t-170 70Zm0-80q67 0 113.5-46.5T640-480q0-67-46.5-113.5T480-640q-67 0-113.5 46.5T320-480q0 67 46.5 113.5T480-320Zm0-160Z"/></svg>',
      invertColors: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-64-24.5-122.5T706-706L254-254q45 45 103.5 69.5T480-160Zm0-160v-60h200v60H480ZM320-500h60v-80h80v-60h-80v-80h-60v80h-80v60h80v80Z"/></svg>',
      lowSaturation: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M480-120q-133 0-226.5-92T160-436q0-65 25-121.5T254-658l226-222 226 222q44 44 69 100.5T800-436q0 132-93.5 224T480-120ZM242-400h474q12-72-13.5-123T650-600L480-768 310-600q-27 26-53 77t-15 123Z"/></svg>',
      highSaturation: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 32.5-156t88-127Q256-817 330-848.5T488-880q80 0 151 27.5t124.5 76q53.5 48.5 85 115T880-518q0 115-70 176.5T640-280h-74q-9 0-12.5 5t-3.5 11q0 12 15 34.5t15 51.5q0 50-27.5 74T480-80Zm0-400Zm-220 40q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm120-160q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm200 0q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm120 160q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17ZM480-160q9 0 14.5-5t5.5-13q0-14-15-33t-15-57q0-42 29-67t71-25h70q66 0 113-38.5T800-518q0-121-92.5-201.5T488-800q-136 0-232 93t-96 227q0 133 93.5 226.5T480-160Z"/></svg>',
      monochrome: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm40-83q119-15 199.5-104.5T800-480q0-123-80.5-212.5T520-797v634Z"/></svg>',
      reset: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M440-122q-121-15-200.5-105.5T160-440q0-66 26-126.5T260-672l57 57q-38 34-57.5 79T240-440q0 88 56 155.5T440-202v80Zm80 0v-80q87-16 143.5-83T720-440q0-100-70-170t-170-70h-3l44 44-56 56-140-140 140-140 56 56-44 44h3q134 0 227 93t93 227q0 121-79.5 211.5T520-122Z"/></svg>',
      close: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41Z"/></svg>',
      increase: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2Z"/></svg>',
      decrease: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 13H5v-2h14v2Z"/></svg>',
      arrowBack: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z"/></svg>',
      adjustFontSize: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M2 4v3h5v12h3V7h5V4H2m19 5h-9v3h3v7h3v-7h3V9Z"/></svg>',
      language: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-155.5t86-127Q252-817 325-848.5T480-880q83 0 155.5 31.5t127 86q54.5 54.5 86 127T880-480q0 82-31.5 155t-86 127.5q-54.5 54.5-127 86T480-80Zm0-82q26-36 45-75t31-83H404q12 44 31 83t45 75Zm-104-16q-18-33-31.5-68.5T322-320H204q29 50 72.5 87t99.5 55Zm208 0q56-18 99.5-55t72.5-87H638q-9 38-22.5 73.5T584-178ZM170-400h136q-3-20-4.5-39.5T300-480q0-21 1.5-40.5T306-560H170q-5 20-7.5 39.5T160-480q0 21 2.5 40.5T170-400Zm216 0h188q3-20 4.5-39.5T580-480q0-21-1.5-40.5T574-560H386q-3 20-4.5 39.5T380-480q0 21 1.5 40.5T386-400Zm268 0h136q5-20 7.5-39.5T800-480q0-21-2.5-40.5T790-560H654q3 20 4.5 39.5T660-480q0 21-1.5 40.5T654-400Zm-16-240h118q-29-50-72.5-87T584-782q18 33 31.5 68.5T638-640Zm-234 0h152q-12-44-31-83t-45-75q-26 36-45 75t-31 83Zm-200 0h118q9-38 22.5-73.5T376-782q-56 18-99.5 55T204-640Z"/></svg>',
      hideImages: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="m840-234-80-80v-446H314l-80-80h526q33 0 56.5 23.5T840-760v526ZM792-56l-64-64H200q-33 0-56.5-23.5T120-200v-528l-64-64 56-56 736 736-56 56ZM240-280l120-160 90 120 33-44-283-283v447h447l-80-80H240Zm297-257ZM424-424Z"/></svg>'
    };

    this.targetSelectors = {
      ALL: ['', '*:not(.material-icons,.acc-menu,.acc-menu *)'],
      LINKS: ["a[href]"],
      HEADERS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', '.wsite-headline', '.wsite-content-title'],
      TEXT: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', '.wsite-headline', '.wsite-content-title', 'img', 'p', 'i', 'svg', 'a', 'button:not(.acc-btn)', 'label', 'li', 'ol']
    };

    // UPDATED visualFilters with new keys for color adjustments.
    this.visualFilters = {
      'dark-contrast': { 
        styles: { 'filter': 'contrast(150%) brightness(0.8)' },
        selector: 'html:not(.acc-menu, .acc-widget)'
      },
      'light-contrast': { 
        styles: { 'filter': 'contrast(125%) brightness(1.2)' },
        selector: 'html:not(.acc-menu, .acc-widget)'
      },
      'invert-colors': { 
        styles: { 'filter': 'invert(100%)' },
        selector: 'html:not(.acc-menu, .acc-widget)'
      },
      'low-saturation': { 
        styles: { 'filter': 'saturate(50%)' },
        selector: 'html:not(.acc-menu, .acc-widget)' 
      },
      'monochrome': { 
        styles: { 'filter': 'grayscale(100%)' },
        selector: 'html:not(.acc-menu, .acc-widget)'
      },
      'high-saturation': { 
        styles: { 'filter': 'saturate(200%)' },
        selector: 'html:not(.acc-menu, .acc-widget)'
      }
    };

    this.translations = {
      en: {
        "Accessibility Menu": "Accessibility Menu",
        "Reset settings": "Reset settings",
        "Reset All Settings": "Reset All Settings",
        "Close": "Close",
        "Content Adjustments": "Content Adjustments",
        "Adjust Font Size": "Adjust Font Size",
        "Highlight Title": "Highlight Title",
        "Highlight Links": "Highlight Links",
        "Readable Font": "Readable Font",
        "Color Adjustments": "Color Adjustments",
        "Invert Colors": "Invert Colors",
        "Light Contrast": "Light Contrast",
        "Dark Contrast": "Dark Contrast",
        "High Contrast": "High Contrast",
        "High Saturation": "High Saturation",
        "Low Saturation": "Low Saturation",
        "Monochrome": "Monochrome",
        "Tools": "Tools",
        "Reading Guide": "Reading Guide",
        "Stop Animations": "Stop Animations",
        "Big Cursor": "Big Cursor",
        "Increase Font Size": "Increase Font Size",
        "Decrease Font Size": "Decrease Font Size",
        "Letter Spacing": "Letter Spacing",
        "Line Height": "Line Height",
        "Font Weight": "Font Weight",
        "Dyslexia Font": "Dyslexia Font",
        "Language": "Language",
        "Open Accessibility Menu": "Open Accessibility Menu",
        "Hide Images": "Hide Images",
        "Skip to accessibility menu": "Skip to accessibility menu"
      }
    };

    this.supportedLanguages = [{ code: "en", label: "English (English)" }];

    this.accessTools = [
      { label: 'Big Cursor', key: 'large-pointer', icon: this.widgetIcons.largePointer },
      { label: 'Stop Animations', key: 'pause-motion', icon: this.widgetIcons.pauseMotion },
      { label: 'Reading Guide', key: 'reading-aid', icon: this.widgetIcons.readingAid }
    ];

    // Font size cycling
    this.textScaleIndex = 0;
    this.textScaleValues = [1.2, 1.4, 1.6];

    // Content adjustment buttons remain unchanged.
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

    // Remove old multi-level features for contrast and saturation; keep only text-scale.
    this.multiLevelFeatures = {
      'text-scale': {
        levels: this.textScaleValues.length,
        currentIndex: -1,  // -1 means OFF
        values: this.textScaleValues
      }
    };

    this.readingAidTemplate = `
          <style>
            .acc-rg {
              position: fixed;
              left: 0;
              right: 0;
              width: 100%;
              pointer-events: none;
              background-color: rgba(0, 0, 0, 0.6);
              z-index: ${this.widgetTheme.zIndex + 1};
            }
            .acc-rg-top {
              top: 0;
            }
            .acc-rg-bottom {
              bottom: 0;
            }
          </style>
          <div class="acc-rg acc-rg-top" role="presentation"> </div>
          <div class="acc-rg acc-rg-bottom" role="presentation"> </div>
        `;

    // UPDATED colorOptions array with six independent toggles.
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

    this.textScaleSelectors = "h1,h2,h3,h4,h5,h6,p,a,dl,dt,li,ol,th,td,span,blockquote,.acc-text";
    this.textScaleObserver = null;
    this.currentTextScaleMultiplier = 1;

    // Global settings and state
    this.widgetConfig = {};
    this.cookieKey = "accweb";
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

    this.dataOptions = this.getDataAttributeOptions();

    // Merge any passed options (for instance, widget position or language)
    this.options = {
      lang: 'en',
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
  }

  // ======================================================
  // UTILITY METHODS
  // ======================================================
  storageAvailable() {
    try {
      const test = '__test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

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
  }

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
  }

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
  }

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
  }

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
  }

  findElement(selector, parent = document) {
    try {
      return parent.querySelector(selector);
    } catch (e) {
      console.warn(`Failed to query selector: ${selector}`, e);
      return null;
    }
  }

  injectStyle(id, css) {
    if (!css) return;
    try {
      let style = document.getElementById(id) || document.createElement('style');
      style.innerHTML = css;
      if (!style.id) {
        style.id = id;
        document.head.appendChild(style);
      }
    } catch (e) {
      console.warn('Error adding stylesheet:', e);
    }
  }

  createCSS(styles) {
    let css = "";
    if (!styles) return css;
    const browserPrefixes = ['-o-', '-ms-', '-moz-', '-webkit-', ''];
    const prefixedProperties = ['filter'];
    for (let key in styles) {
      if (!styles.hasOwnProperty(key)) continue;
      let prefixes = prefixedProperties.includes(key) ? browserPrefixes : [""];
      prefixes.forEach(prefix => {
        css += `${prefix}${key}:${styles[key]} !important;`;
      });
    }
    return css;
  }

  wrapCSS(selector, childrenSelector, css) {
    let output = "";
    childrenSelector.forEach(child => {
      output += `${selector} ${child}{${css}}`;
    });
    return output;
  }

  buildCSS(config) {
    if (!config) return "";
    let output = "";
    output += this.createCSS(config.styles || {});
    if (output.length && config.selector) {
      output = this.wrapCSS(config.selector, config.childrenSelector || [""], output);
    }
    output += config.css || "";
    return output;
  }

  applyToolStyle(config) {
    let { id = "", enable = false } = config;
    let styleId = `acc-${id}`;
    if (enable) {
      let css = this.buildCSS(config);
      this.injectStyle(styleId, css);
    } else {
      let style = document.getElementById(styleId);
      if (style) style.remove();
    }
    document.documentElement.classList.toggle(styleId, enable);
  }

  toggleDisplay(el, state) {
    if (!el) return;
    try {
      el.style.display = (typeof state === "undefined") 
        ? (el.style.display === "none" ? "block" : "none") 
        : (state ? "block" : "none");
    } catch (e) {
      console.warn('Error toggling element:', e);
    }
  }

  updateState(payload) {
    const updatedConfig = { ...this.widgetConfig, states: { ...this.widgetConfig.states, ...payload } };
    this.saveConfig(updatedConfig);
    return updatedConfig;
  }

  saveConfig(newConfig) {
    this.widgetConfig = { ...this.widgetConfig, ...newConfig };
    if (this.storageAvailable()) {
      try {
        localStorage.setItem(this.cookieKey, JSON.stringify(this.widgetConfig));
      } catch (e) {
        this.storeCookie(this.cookieKey, JSON.stringify(this.widgetConfig), 365);
      }
    } else {
      this.storeCookie(this.cookieKey, JSON.stringify(this.widgetConfig), 365);
    }
  }

  retrieveState(key) {
    return this.widgetConfig.states ? this.widgetConfig.states[key] : undefined;
  }

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
  }

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
  }

  translate(label) {
    const { lang } = this.loadConfig();
    const dictionary = this.translations[lang] || this.translations["en"];
    return dictionary[label] || label;
  }

  throttle(func, limit) {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

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
  }

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
  }

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
  }

  ensureSkipLink() {
    if (typeof document === 'undefined') return null;
    if (this.skipLinkElement && document.body.contains(this.skipLinkElement)) {
      this.updateSkipLinkLabel();
      return this.skipLinkElement;
    }
    const existing = document.getElementById('acc-skip-link');
    if (existing) {
      this.skipLinkElement = existing;
      if (!existing.getAttribute('data-acc-text')) {
        existing.setAttribute('data-acc-text', 'Skip to accessibility menu');
      }
      this.updateSkipLinkLabel();
      return existing;
    }

    const button = document.createElement('button');
    button.type = 'button';
    button.id = 'acc-skip-link';
    button.className = 'acc-skip-link';
    button.setAttribute('tabindex', '0');
    button.setAttribute('data-acc-text', 'Skip to accessibility menu');
    button.setAttribute('aria-label', this.translate('Skip to accessibility menu'));
    button.textContent = this.translate('Skip to accessibility menu');

    button.addEventListener('click', (event) => {
      event.preventDefault();
      const toggle = this.widgetToggleButton;
      if (!toggle) return;

      const currentMenu = this.activeMenuContainer || this.menuContainer;
      const menuIsVisible = currentMenu && currentMenu.style.display !== 'none';

      const focusMenu = () => {
        const targetMenu = this.activeMenuContainer || this.menuContainer;
        if (!targetMenu) return;
        const focusables = this.getFocusableElements(targetMenu);
        if (focusables.length) {
          focusables[0].focus();
        }
      };

      if (!menuIsVisible) {
        toggle.click();
        requestAnimationFrame(focusMenu);
      } else {
        focusMenu();
      }
    });

    const skipCSS = `
      .acc-skip-link {
        font-family: inherit;
        position: fixed;
        top: 16px;
        left: 16px;
        background: ${this.widgetTheme.cardBackground};
        color: ${this.widgetTheme.textColor};
        border: 3px solid ${this.widgetTheme.primaryColor};
        border-radius: ${this.widgetTheme.buttonBorderRadius};
        padding: 8px 16px;
        z-index: ${Number(this.widgetTheme.zIndex) + 2};
        transform: translateY(-140%);
        opacity: 0;
        pointer-events: none;
        transition: transform 0.2s ease, opacity 0.2s ease;
        font-size: 16px;
        line-height: 1.2;
        font-weight: 600;
        background-clip: padding-box;
      }
      .acc-skip-link:focus,
      .acc-skip-link:active {
        transform: translateY(0);
        opacity: 1;
        pointer-events: auto;
        outline: ${this.widgetTheme.focusBorderWidth} solid ${this.widgetTheme.focusRingColor};
        outline-offset: ${this.widgetTheme.focusOutlineOffset};
      }
    `;
    this.injectStyle('acc-skip-link-style', skipCSS);

    document.body.insertBefore(button, document.body.firstChild);
    this.skipLinkElement = button;
    return button;
  }

  updateSkipLinkLabel() {
    if (!this.skipLinkElement) return;
    const key = this.skipLinkElement.getAttribute('data-acc-text') || 'Skip to accessibility menu';
    const label = this.translate(key);
    this.skipLinkElement.textContent = label;
    this.skipLinkElement.setAttribute('aria-label', label);
  }

  // ======================================================
  // ACCESSIBILITY FEATURES
  // ======================================================
  shouldSkipScaling(element) {
    return element.closest('.acc-menu, .acc-container, .acc-widget');
  }

  applyScaleToElement(element, multiplier) {
    if (
      !element ||
      !(element instanceof Element) ||
      this.shouldSkipScaling(element) ||
      element.classList.contains('material-icons') ||
      element.classList.contains('fa')
    ) {
      return;
    }
    const baseAttr = 'data-acc-baseSize';
    if (!element.hasAttribute(baseAttr)) {
      const computedSize = parseFloat(window.getComputedStyle(element).fontSize);
      if (Number.isNaN(computedSize) || computedSize <= 0) {
        return;
      }
      element.setAttribute(baseAttr, String(computedSize));
    }
    const baseSize = parseFloat(element.getAttribute(baseAttr));
    if (Number.isNaN(baseSize) || baseSize <= 0) {
      return;
    }
    element.style.fontSize = `${baseSize * multiplier}px`;
  }

  ensureTextScaleObserver() {
    if (this.textScaleObserver || !document.body) return;
    this.textScaleObserver = new MutationObserver((mutations) => {
      if (this.currentTextScaleMultiplier <= 1) {
        return;
      }
      const pending = new Set();
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (!(node instanceof Element)) return;
          if (node.matches && node.matches(this.textScaleSelectors)) {
            pending.add(node);
          }
          node.querySelectorAll?.(this.textScaleSelectors).forEach(el => pending.add(el));
        });
      });
      if (!pending.size) return;
      pending.forEach(el => this.applyScaleToElement(el, this.currentTextScaleMultiplier));
    });
    this.textScaleObserver.observe(document.body, { childList: true, subtree: true });
  }

  disconnectTextScaleObserver() {
    if (!this.textScaleObserver) return;
    this.textScaleObserver.disconnect();
    this.textScaleObserver = null;
  }

  scaleText(multiply = 1) {
    try {
      this.currentTextScaleMultiplier = multiply;
      if (multiply > 1) {
        this.ensureTextScaleObserver();
        const elements = document.querySelectorAll(this.textScaleSelectors);
        elements.forEach(el => this.applyScaleToElement(el, multiply));
      } else {
        this.disconnectTextScaleObserver();
        const scaledElements = document.querySelectorAll('[data-acc-baseSize]');
        scaledElements.forEach(el => {
          if (this.shouldSkipScaling(el)) return;
          el.style.fontSize = '';
          el.removeAttribute('data-acc-baseSize');
        });
      }
    } catch (e) {
      console.warn('Error scaling text:', e);
    }
  }

  enableBoldText(enable = false) {
    const config = {
      id: "bold-text",
      selector: "html",
      childrenSelector: ['', '*:not(.material-icons,.acc-menu,.acc-menu *, .acc-widget, .acc-widget *)'],
      styles: { 'font-weight': '700' }
    };
    this.applyToolStyle({ ...config, enable });
  }

  adjustLetterSpacing(enable = false) {
    const config = {
      id: "letter-spacing",
      selector: "html",
      childrenSelector: ['', '*:not(.material-icons,.acc-menu,.acc-menu *, .acc-widget, .acc-widget *)'],
      styles: { 'letter-spacing': '2px' }
    };
    this.applyToolStyle({ ...config, enable });
  }

  adjustLineSpacing(enable = false) {
    const config = {
      id: "line-spacing",
      selector: "html",
      childrenSelector: ['', '*:not(.material-icons,.acc-menu,.acc-menu *, .acc-widget, .acc-widget *)'],
      styles: { 'line-height': '3' }
    };
    this.applyToolStyle({ ...config, enable });
  }

  enableLargePointer(enable = false) {
    const config = {
      id: "large-pointer",
      selector: "body",
      childrenSelector: ['*'],
      styles: {
        'cursor': `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='98px' height='98px' viewBox='0 0 48 48'%3E%3Cpath fill='%23E0E0E0' d='M27.8 39.7c-.1 0-.2 0-.4-.1s-.4-.3-.6-.5l-3.7-8.6-4.5 4.2c-.1.2-.3.3-.6.3-.1 0-.3 0-.4-.1-.3-.1-.6-.5-.6-.9V12c0-.4.2-.8.6-.9.1-.1.3-.1.4-.1.2 0 .5.1.7.3l16 15c.3.3.4.7.3 1.1-.1.4-.5.6-.9.7l-6.3.6 3.9 8.5c.1.2.1.5 0 .8-.1.2-.3.5-.5.6l-2.9 1.3c-.2-.2-.4-.2-.5-.2z'/%3E%3Cpath fill='%23212121' d='m18 12 16 15-7.7.7 4.5 9.8-2.9 1.3-4.3-9.9L18 34V12m0-2c-.3 0-.5.1-.8.2-.7.3-1.2 1-1.2 1.8v22c0 .8.5 1.5 1.2 1.8.3.2.6.2.8.2.5 0 1-.2 1.4-.5l3.4-3.2 3.1 7.3c.2.5.6.9 1.1 1.1.2.1.5.1.7.1.3 0 .5-.1.8-.2l2.9-1.3c.5-.2.9-.6 1.1-1.1.2-.5.2-1.1 0-1.5l-3.3-7.2 4.9-.4c.8-.1 1.5-.6 1.7-1.3.3-.7.1-1.6-.5-2.1l-16-15c-.3-.5-.8-.7-1.3-.7z'/%3E%3C/svg%3E") 40 15, auto`
      }
    };
    this.applyToolStyle({ ...config, enable });
  }

  highlightLinks(enable = false) {
  const config = {
    id: "highlight-links",
    selector: "html",
    childrenSelector: [
      "a[href]:not(.acc-menu a, .acc-widget a)",
      "summary.header__menu-item:not(.acc-menu summary, .acc-widget summary)",
      "summary.link:not(.acc-menu summary, .acc-widget summary)",
      "summary[role='button']:not(.acc-menu summary, .acc-widget summary)",
      "details > summary.list-menu__item:not(.acc-menu summary, .acc-widget summary)",
      ".header__menu-item[role='button']:not(.acc-menu *, .acc-widget *)"
    ],
    styles: { 'outline': `3px solid ${this.widgetTheme.primaryColor}`, 'outline-offset': '2px' }
  };
  this.applyToolStyle({ ...config, enable });
}

  highlightTitles(enable = false) {
    const config = {
      id: "highlight-title",
      selector: "html",
      childrenSelector: this.targetSelectors.HEADERS,
      styles: { 'outline': `3px solid ${this.widgetTheme.primaryColor}`, 'outline-offset': '2px' }
    };
    this.applyToolStyle({ ...config, enable });
  }

  ensureReadableFontLoaded() {
    if (this.readableFontLoaded) return;
    const existing = document.getElementById('acc-readable-text-font');
    if (existing) {
      this.readableFontLoaded = true;
      return;
    }
    const style = document.createElement('style');
    style.id = 'acc-readable-text-font';
    style.textContent = `
      @font-face {
        font-family: "OpenDyslexic3";
        src: url("https://website-widgets.pages.dev/fonts/OpenDyslexic3-Regular.woff") format("woff"),
             url("https://website-widgets.pages.dev/fonts/OpenDyslexic3-Regular.ttf") format("truetype");
        font-display: swap;
      }
    `;
    document.head.appendChild(style);
    this.readableFontLoaded = true;
  }

  enableReadableText(enable = false) {
    const shouldEnable = !!enable;
    if (shouldEnable) {
      this.ensureReadableFontLoaded();
    }
    const exclusionSuffix = ':not(.acc-widget):not(.acc-menu):not(.acc-container)';
    const readableSelectors = [
      `*:not(.acc-widget):not(.acc-menu):not(.acc-container)`,
      `h1${exclusionSuffix}`,
      `h2${exclusionSuffix}`,
      `h3${exclusionSuffix}`,
      `h4${exclusionSuffix}`,
      `h5${exclusionSuffix}`,
      `h6${exclusionSuffix}`,
      `.wsite-headline${exclusionSuffix}`,
      `.wsite-content-title${exclusionSuffix}`,
      `p${exclusionSuffix}`,
      `a${exclusionSuffix}`,
      `span${exclusionSuffix}`,
      `li${exclusionSuffix}`,
      `ol${exclusionSuffix}`,
      `dl${exclusionSuffix}`,
      `dt${exclusionSuffix}`,
      `th${exclusionSuffix}`,
      `td${exclusionSuffix}`,
      `blockquote${exclusionSuffix}`,
      `label${exclusionSuffix}`,
      `button:not(.acc-btn)${exclusionSuffix}`,
      `svg${exclusionSuffix}`,
      `i${exclusionSuffix}`,
      `img${exclusionSuffix}`,
      `.acc-text${exclusionSuffix}`
    ];
    const config = {
      id: "readable-text",
      selector: "body",
      childrenSelector: readableSelectors,
      styles: { 
        'font-family': '"OpenDyslexic3", "Comic Sans MS", Arial, Helvetica, sans-serif' 
      },
      css: `.acc-container, .acc-container *, .acc-menu, .acc-menu * {
        font-family: inherit !important;
      }`
    };
    this.applyToolStyle({ ...config, enable: shouldEnable });
  }

  pauseMotion(enable = false) {
  const config = {
    id: "pause-motion",
    selector: "html",
    childrenSelector: ['*'],
    styles: { 'transition': 'none', 'animation-fill-mode': 'forwards', 'animation-iteration-count': '1', 'animation-duration': '.01s' }
  };
  this.applyToolStyle({ ...config, enable });
}

enableReadingAid(enable = false) {
  try {
    let container = this.findElement('.acc-rg-container');
    const guideHeight = 100; // Height of the clear reading window

    if (enable) {
      // Always clean up existing listener first to prevent duplicates
      if (window.__accweb__scrollGuide) {
        document.removeEventListener('mousemove', window.__accweb__scrollGuide);
        delete window.__accweb__scrollGuide;
      }

      if (!container) {
        // Create container but don't make it visible yet
        container = document.createElement('div');
        container.setAttribute('class', 'acc-rg-container');
        container.setAttribute('aria-hidden', 'true');
        container.innerHTML = this.readingAidTemplate;
        document.body.prepend(container);
      }

      const rgTop = container.querySelector('.acc-rg-top');
      const rgBottom = container.querySelector('.acc-rg-bottom');
      
      // Initially hide the guide completely
      rgTop.style.display = 'none';
      rgBottom.style.display = 'none';
      this.readingAidVisible = false;

      const updateGuidePosition = this.throttle((event) => {
        // If first mouse movement after enabling, make the guide visible
        if (!this.readingAidVisible) {
          rgTop.style.display = 'block';
          rgBottom.style.display = 'block';
          this.readingAidVisible = true;
        }
        
        // Position the guide at the mouse Y coordinate
        const mouseY = event.clientY;
        const topHeight = Math.max(0, mouseY - guideHeight / 2);
        const bottomHeight = Math.max(0, window.innerHeight - (mouseY + guideHeight / 2));
        rgTop.style.height = `${topHeight}px`;
        rgBottom.style.height = `${bottomHeight}px`;
      }, 16);

      window.__accweb__scrollGuide = updateGuidePosition;
      document.addEventListener('mousemove', updateGuidePosition, { passive: true });
    } else {
      // Reset visibility flag when disabled
      this.readingAidVisible = false;
      
      // Clean up event listener
      if (window.__accweb__scrollGuide) {
        document.removeEventListener('mousemove', window.__accweb__scrollGuide);
        delete window.__accweb__scrollGuide;
      }
      
      // Remove container
      if (container) {
        container.remove();
      }
    }
  } catch (e) {
    console.warn('Error with reading aid:', e);
  }
}

concealImages(enable = false) {
  const styleId = `acc-hide-images`;
  const existingStyle = document.getElementById(styleId);
  if (existingStyle) existingStyle.remove();
  document.documentElement.classList.toggle(styleId, enable);
  if (enable) {
    const css = `
      body > *:not(.acc-container) img,
      body > *:not(.acc-container) picture,
      body > *:not(.acc-container) svg:not(.acc-container svg),
      body > *:not(.acc-container) video,
      body > *:not(.acc-container) iframe,
      body > *:not(.acc-container) canvas,
      body > *:not(.acc-container) .video,
      body > *:not(.acc-container) .image {
        display: none !important;
      }
    `;
    this.injectStyle(styleId, css);
  }
}


  applyEnhancements() {
    const { states } = this.loadConfig();
    // Handle font size scaling
    if (states && states['text-scale']) {
      const scaleValue = states['text-scale'];
      const scaleIndex = this.textScaleValues.indexOf(scaleValue);
      if (scaleIndex > -1) {
        this.textScaleIndex = scaleIndex;
        this.multiLevelFeatures['text-scale'].currentIndex = scaleIndex;
        this.scaleText(scaleValue);
      }
    } else {
      this.textScaleIndex = 0;
      if (this.multiLevelFeatures['text-scale']) {
        this.multiLevelFeatures['text-scale'].currentIndex = -1;
      }
    }
    // Apply other enhancements
    this.concealImages(states && states['hide-images']);
    this.highlightTitles(states && states['highlight-title']);
    this.highlightLinks(states && states['highlight-links']);
    this.adjustLetterSpacing(states && states['letter-spacing']);
    this.adjustLineSpacing(states && states['line-spacing']);
    this.enableBoldText(states && states['bold-text']);
    this.enableReadableText(states && states['readable-text']);
    this.enableReadingAid(states && states['reading-aid']);
    this.pauseMotion(states && states['pause-motion']);
    this.enableLargePointer(states && states['large-pointer']);
  }

  isColorFilterKey(key) {
    return Array.isArray(this.colorFilterKeys) && this.colorFilterKeys.includes(key);
  }

  getActiveColorFilterKey(states = this.widgetConfig.states) {
    if (!this.colorFilterKeys || !this.colorFilterKeys.length) return null;
    if (!states) return this.activeColorFilterKey || null;
    for (const key of this.colorFilterKeys) {
      if (states[key]) {
        return key;
      }
    }
    return null;
  }

  setColorFilterUI(menu, activeKey = null) {
    if (!menu || !menu.querySelectorAll) return;
    this.colorFilterKeys.forEach(filterKey => {
      const button = menu.querySelector(`.acc-btn[data-key="${filterKey}"]`);
      if (!button) return;
      const isActive = filterKey === activeKey;
      button.classList.toggle('acc-selected', isActive);
      button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }

  updateColorFilterState(activeKey = null) {
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
      this.updateState(payload);
    }
    this.activeColorFilterKey = activeKey;
  }

  applyVisualFilters() {
    const { states } = this.loadConfig();
    const activeKey = this.getActiveColorFilterKey(states);
    this.activeColorFilterKey = activeKey;

    if (!activeKey) {
      const style = document.getElementById('acc-filter-style');
      if (style) style.remove();
      return;
    }
    const filter = this.visualFilters[activeKey];
    if (!filter) {
      const style = document.getElementById('acc-filter-style');
      if (style) style.remove();
      return;
    }
    const adjustedFilter = {
      ...filter,
      selector: filter.selector || 'body > *:not(.acc-container)'
    };
    const css = this.buildCSS(adjustedFilter);
    this.injectStyle('acc-filter-style', css);
  }

  cycleTextScale(enable = false) {
    if (enable) {
      this.textScaleIndex = (this.textScaleIndex + 1) % this.textScaleValues.length;
      if (this.multiLevelFeatures['text-scale']) {
        this.multiLevelFeatures['text-scale'].currentIndex = this.textScaleIndex;
      }
    } else {
      this.textScaleIndex = 0;
      if (this.multiLevelFeatures['text-scale']) {
        this.multiLevelFeatures['text-scale'].currentIndex = -1;
      }
    }
    const progressIndicator = document.querySelector(`.acc-progress-indicator[data-feature="text-scale"]`);
    if (progressIndicator) {
      const dots = progressIndicator.querySelectorAll('.acc-progress-dot');
      dots.forEach(dot => dot.classList.remove('active'));
      if (enable && this.textScaleIndex < dots.length) {
        dots[this.textScaleIndex].classList.add('active');
      }
    }
    const multiply = enable ? this.textScaleValues[this.textScaleIndex] : 1;
    this.scaleText(multiply);
    this.updateState({ 'text-scale': multiply > 1 ? multiply : false });
    return this.textScaleIndex;
  }

  cycleMultiLevelFeature(featureKey, button) {
    // Only text-scale remains as a multi-level feature.
    const feature = this.multiLevelFeatures[featureKey];
    const newIndex = feature.currentIndex + 1;
    if (newIndex >= feature.levels) {
      feature.currentIndex = -1;
      button.classList.remove('acc-selected');
      button.setAttribute('aria-pressed', 'false');
      this.updateState({ [featureKey]: false });
      if (featureKey === 'text-scale') {
        this.textScaleIndex = 0;
      }
    } else {
      feature.currentIndex = newIndex;
      button.classList.add('acc-selected');
      button.setAttribute('aria-pressed', 'true');
      const newValue = feature.values[newIndex];
      this.updateState({ [featureKey]: newValue });
      if (featureKey === 'text-scale') {
        this.textScaleIndex = newIndex;
      }
    }
    const indicator = button.querySelector(`.acc-progress-indicator[data-feature="${featureKey}"]`);
    if (indicator) {
      const dots = indicator.querySelectorAll('.acc-progress-dot');
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === feature.currentIndex);
      });
    }
    if (featureKey === 'text-scale') {
      const multiply = feature.currentIndex >= 0 ? feature.values[feature.currentIndex] : 1;
      this.scaleText(multiply);
    } else {
      this.applyVisualFilters();
    }
  }

  resetEnhancements() {
    this.saveConfig({ states: {} });
    this.textScaleIndex = 0;
    this.activeColorFilterKey = null;
    Object.keys(this.multiLevelFeatures).forEach(key => {
      this.multiLevelFeatures[key].currentIndex = -1;
    });
    const selected = document.querySelectorAll(".acc-selected");
    selected.forEach(el => {
      el.classList.remove("acc-selected");
      el.setAttribute('aria-pressed', 'false');
    });
    const indicators = document.querySelectorAll('.acc-progress-indicator');
    indicators.forEach(indicator => {
      const dots = indicator.querySelectorAll('.acc-progress-dot');
      dots.forEach(dot => dot.classList.remove('active'));
    });
    
    // Remove focus from active element to fix the persistent focus ring bug
    if (document.activeElement) {
      document.activeElement.blur();
    }
    const styleIds = [
      'acc-bold-text',
      'acc-letter-spacing',
      'acc-line-spacing',
      'acc-large-pointer',
      'acc-highlight-links',
      'acc-highlight-title',
      'acc-readable-text',
      'acc-pause-motion',
      'acc-hide-images',
      'acc-filter-style'
    ];
    styleIds.forEach(id => {
      const style = document.getElementById(id);
      if (style) style.remove();
    });
    document.documentElement.classList.remove(
      'acc-filter',
      'acc-saturation',
      'acc-bold-text',
      'acc-letter-spacing',
      'acc-line-spacing',
      'acc-large-pointer',
      'acc-highlight-links',
      'acc-highlight-title',
      'acc-readable-text',
      'acc-pause-motion',
      'acc-hide-images'
    );
    this.disconnectTextScaleObserver();
    this.currentTextScaleMultiplier = 1;
    const scaledElements = document.querySelectorAll('[data-acc-baseSize]');
    scaledElements.forEach(el => {
      if (!(el instanceof Element) || this.shouldSkipScaling(el)) return;
      el.style.fontSize = '';
      el.removeAttribute('data-acc-baseSize');
    });
    let guide = this.findElement('.acc-rg-container');
    if (guide) {
      guide.remove();
      if (window.__accweb__scrollGuide) {
        document.removeEventListener('mousemove', window.__accweb__scrollGuide);
        delete window.__accweb__scrollGuide;
      }
    }
  }

  // ======================================================
  // UI COMPONENTS & TEMPLATES
  // ======================================================
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
  }

  getTranslatedText(el, defaultValue) {
    let text = el.getAttribute("data-acc-text");
    if (!text && defaultValue) {
      text = defaultValue;
      el.setAttribute("data-acc-text", text);
    }
    return this.translate(text);
  }

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
  }

  displayMenu({ container, lang }) {
    try {
      const menuTemplate = `
      <style>
        /* WCAG-friendly CSS Variables */
        :root {
          /* Core colors */
          --acc-primary-color: ${this.widgetTheme.primaryColor};
          --acc-primary-color-light: ${this.widgetTheme.primaryColorLight};
          --acc-primary-color-dark: ${this.widgetTheme.primaryColorDark};
          --acc-bg-color: ${this.widgetTheme.backgroundColor};
          --acc-text-color: ${this.widgetTheme.textColor};
          --acc-text-color-inverted: ${this.widgetTheme.textColorInverted};
          
          /* UI elements */
          --acc-card-bg: ${this.widgetTheme.cardBackground};
          --acc-border-color: ${this.widgetTheme.borderColor};
          --acc-focus-ring-color: ${this.widgetTheme.focusRingColor};
          
          /* Interactive states */
          --acc-hover-color: ${this.widgetTheme.hoverColor};
          --acc-active-color: ${this.widgetTheme.activeColor};
          
          /* Other UI properties */
          --acc-border-radius: ${this.widgetTheme.borderRadius};
          --acc-button-border-radius: ${this.widgetTheme.buttonBorderRadius};
          --acc-header-height: ${this.widgetTheme.headerHeight};
          --acc-focus-outline-width: ${this.widgetTheme.focusBorderWidth};
          --acc-focus-outline-offset: ${this.widgetTheme.focusOutlineOffset};
        }
        
        /* Base styles */
        .acc-menu {
          position: fixed;
          left: 0;
          top: 0;
          box-shadow: 0 0 8px rgba(0, 0, 0, 0.25);
          opacity: 1;
          transition: 0.3s;
          z-index: ${this.widgetTheme.zIndex};
          overflow: hidden;
          background: var(--acc-bg-color);
          width: 500px;
          line-height: 1.5;
          font-size: 16px;
          height: 100%;
          letter-spacing: 0.015em;
          color: var(--acc-text-color);
        }
        
        /* Ensure all elements inherit proper colors for accessibility */
        .acc-menu * {
          color: var(--acc-text-color);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          padding: 0;
          margin: 0;
          line-height: 1.5 !important;
          letter-spacing: normal !important;
        }
        
        /* Header section */
        .acc-menu-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-left: 16px;
          padding-right: 16px;
          height: var(--acc-header-height);
          font-weight: 700 !important;
          background-color: var(--acc-primary-color) !important;
        }
        
        .acc-menu-title {
          font-size: 18px !important;
          color: var(--acc-text-color-inverted) !important;
          font-weight: bold;
        }

        .acc-header-back {
          display: flex;
          align-items: center;
        }

        .acc-back-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          border: none;
          padding: 8px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 600;
          color: var(--acc-text-color-inverted) !important;
          transition: background-color 0.2s;
          border-radius: 4px;
          visibility: hidden;
        }

        .acc-back-btn > span {
          color: var(--acc-text-color-inverted) !important;
        }

        .acc-back-btn.visible {
            visibility: visible;
          }

          .acc-back-btn:hover {
            background-color: rgba(255, 255, 255, 0.2);
          }

          .acc-back-btn:focus {
            outline: 2px solid var(--acc-text-color-inverted);
            outline-offset: 1px;
          }

          .acc-back-btn svg {
            fill: var(--acc-text-color-inverted) !important;
            width: 24px !important;
            height: 24px !important;
          }

          .acc-menu-title-dynamic {
            display: none !important;
          }

          .acc-menu-title-dynamic.visible {
            display: block !important;
          }

          .acc-menu-title-default {
            display: block !important;
          }

          .acc-menu-title-default.hidden {
            display: none !important;
          }
        
        .acc-menu-header svg {
          fill: var(--acc-text-color-inverted) !important;
          width: 28px !important;
          height: 28px !important;
          min-width: 28px !important;
          min-height: 28px !important;
          max-width: 28px !important;
          max-height: 28px !important;
        }
        
        .acc-menu-header > div {
          display: flex;
          align-items: center;
        }
        
        /* Interactive elements */
        .acc-menu-header div[role="button"] {
          cursor: pointer;
          padding: 8px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
        }
        
        .acc-menu-header div[role="button"]:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }
        
        .acc-menu-header div[role="button"]:focus {
          outline: 2px solid var(--acc-text-color-inverted);
          outline-offset: 1px;
        }


        .acc-menu-header .acc-header-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .acc-lang-toggle {
          cursor: pointer;
          background: transparent;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          border-radius: 50%;
          color: var(--acc-text-color-inverted);
        }

        .acc-lang-toggle:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }

        .acc-lang-toggle:focus {
          outline: 2px solid var(--acc-text-color-inverted);
          outline-offset: 1px;
        }

        .acc-lang-toggle svg {
          fill: var(--acc-text-color-inverted) !important;
          width: 28px !important;
          height: 28px !important;
        }

        .acc-lang-panel {
          position: absolute;
          top: var(--acc-header-height);
          right: 0;
          width: 100%;
          height: 100%;
          max-height: calc(100% - var(--acc-header-height)) !important;
          background: var(--acc-bg-color);
          z-index: 100;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          overflow-y: auto;
          display: none;

        }

        .acc-lang-panel.open {
          display: block;
        }

        .acc-lang-current-container {
          padding: 16px;
        }

        .acc-lang-current {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          border: 2px solid var(--acc-primary-color);
          border-radius: var(--acc-button-border-radius);
          margin-top: 8px;
          color: var(--acc-primary-color);
          font-weight: 600;
          background: white;
        }

        .acc-lang-search-wrapper {
          padding: 0 16px 8px;
        }

        .acc-lang-search {
          width: 100%;
          padding: 10px 16px;
          border: 2px solid var(--acc-border-color);
          border-radius: var(--acc-button-border-radius);
          font-size: 16px;
          background-color: var(--acc-card-bg);
        }

        .acc-lang-search:focus {
          outline: var(--acc-focus-outline-width) solid var(--acc-focus-ring-color);
          outline-offset: var(--acc-focus-outline-offset);
          border-color: var(--acc-primary-color) !important;
        }

        .acc-lang-list {
          padding: 6px 16px 16px;
          max-height: 300px;
          overflow-y: auto;
        }

        .acc-lang-item {
          display: block;
          width: 100%;
          text-align: left;
          padding: 12px 16px;
          margin-bottom: 4px;
          background-color: transparent;
          border: none;
          border-radius: var(--acc-button-border-radius);
          cursor: pointer;
          font-size: 16px;
          color: var(--acc-text-color);
        }

        .acc-lang-item:hover {
          background-color: rgba(0, 0, 0, 0.05);
        }

        .acc-lang-item:focus {
          outline: var(--acc-focus-outline-width) solid var(--acc-focus-ring-color);
          outline-offset: var(--acc-focus-outline-offset);
        }

        .acc-lang-item.selected {
          background-color: rgba(0, 0, 0, 0.05);
          font-weight: 600;
        }

        .acc-icon-check {
          display: inline-block;
          width: 18px;
          height: 18px;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='%23886f60' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: center;
        }


        
        /* Content sections */
        .acc-section {
          margin: 0 16px 24px;
        }
        
        .acc-section-title {
          font-size: 16px !important;
          padding: 16px 14px;
          font-weight: 600 !important;
          color: var(--acc-text-color);
        }
        
        .acc-menu .acc-lang-select {
          width: 100% !important;
          padding: 0 16px !important;
          font-size: 16px !important;
          font-family: inherit !important;
          font-weight: 600 !important;
          border-radius: var(--acc-button-border-radius) !important;
          background: var(--acc-card-bg) !important;
          border: 2px solid var(--acc-border-color) !important;
          min-height: 48px !important;
          max-height: 48px !important;
          height: 48px !important;
          color: var(--acc-text-color) !important;
          color: var(--acc-text-color) !important;
          -webkit-appearance: none !important;
          -moz-appearance: none !important;
          appearance: none !important;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0%20-960%20960%20960' width='24px' fill='%231f1f1f'%3E%3Cpath d='M480-344%20240-584l56-56%20184 184%20184-184%2056 56-240 240Z'/%3E%3C/svg%3E") !important;
          background-repeat: no-repeat !important;
          background-position: right 12px center !important;
          background-size: 20px !important;
          padding-right: 44px !important;
        }
        
        /* Hide default arrows in Firefox and IE */
        .acc-menu .acc-lang-select::-ms-expand {
          display: none !important;
        }
        
        .acc-menu .acc-lang-select:focus {
          outline: var(--acc-focus-outline-width) solid var(--acc-focus-ring-color);
          outline-offset: var(--acc-focus-outline-offset);
          border-color: var(--acc-primary-color) !important;
        }
        
        /* Option grid layout */
        .acc-options {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }
        
        /* Button styling */
        .acc-btn {
          aspect-ratio: 6 / 5;
          border-radius: var(--acc-border-radius);
          padding: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          text-align: center;
          font-size: 16px !important;
          background: var(--acc-card-bg) !important;
          border: 2px solid var(--acc-border-color) !important;
          transition: all 0.2s ease;
          cursor: pointer;
          word-break: break-word;
          gap: 8px;
          position: relative;
        }
        
        .acc-btn:hover {
          border-color: var(--acc-hover-color) !important;
        }
        
        .acc-btn:focus {
          outline: var(--acc-focus-outline-width) solid var(--acc-focus-ring-color);
          outline-offset: var(--acc-focus-outline-offset);
          border-color: var(--acc-primary-color) !important;
        }
        
        .acc-btn .acc-label, .acc-text-adjust .acc-label div {
          font-size: 14px !important;
          font-weight: 600 !important;
        }
        
        /* SVG icons */
        .acc-text-adjust svg {
          width: 24px !important;
          height: 24px !important;
          min-width: 24px !important;
          min-height: 24px !important;
          max-width: 24px !important;
          max-height: 24px !important;
        }
        
        .acc-btn svg {
          width: 34px !important;
          height: 34px !important;
          min-width: 34px !important;
          min-height: 34px !important;
          max-width: 34px !important;
          max-height: 34px !important;
          fill: var(--acc-text-color);
        }
        
        /* Selected state */
        .acc-btn.acc-selected {
          background-color: var(--acc-primary-color) !important;
          border-color: var(--acc-primary-color) !important;
        }
        
        .acc-btn.acc-selected .acc-progress-dot {
          background-color: rgba(255, 255, 255, 0.5);
        }
        
        .acc-btn.acc-selected .acc-progress-dot.active {
          background-color: var(--acc-text-color-inverted) !important;
        }
        
        .acc-btn.acc-selected svg, 
        .acc-btn.acc-selected span,
        .acc-btn.acc-selected .acc-label {
          fill: var(--acc-text-color-inverted) !important;
          color: var(--acc-text-color-inverted) !important;
        }
        
        /* Reset All Settings button */

        .acc-reset-container {
          margin: 24px 16px;
          display: flex;
          justify-content: center;
        }

        .acc-reset-btn {
          display: flex;
          width: 100%;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 12px 24px;
          background-color: var(--acc-primary-color) !important;
          border: none;
          border-radius: var(--acc-button-border-radius);
          font-weight: 600 !important;
          font-size: 16px !important;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .acc-reset-btn > span {
          color: var(--acc-text-color-inverted) !important;
        }

        .acc-reset-btn:hover {
          background-color: var(--acc-primary-color-dark) !important;
        }

        .acc-reset-btn:focus {
          outline: var(--acc-focus-outline-width) solid var(--acc-focus-ring-color);
          outline-offset: var(--acc-focus-outline-offset);
        }

        .acc-reset-btn svg {
          fill: var(--acc-text-color-inverted) !important;
          width: 24px !important;
          height: 24px !important;
          margin-right: 8px;
        }
        
        /* Footer section */
        .acc-footer {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: var(--acc-card-bg);
          padding: 16px;
          text-align: center;
          border-top: 1px solid var(--acc-border-color);
          z-index: 100;
        }
        
        .acc-footer a {
          font-size: 14px !important;
          text-decoration: none !important;
          color: var(--acc-text-color) !important;
          background: transparent !important;
          font-weight: 600 !important;
          padding: 8px;
          border-radius: 4px;
        }
        
        .acc-footer a:hover {
          text-decoration: underline !important;
          color: var(--acc-primary-color) !important;
        }
        
        .acc-footer a:focus {
          outline: var(--acc-focus-outline-width) solid var(--acc-focus-ring-color);
          outline-offset: var(--acc-focus-outline-offset);
        }
        
        /* Content area */
        .acc-menu-content {
          overflow: auto;
          max-height: calc(100% - 80px);
          padding: 24px 0 36px;
        }
        
        /* Text adjustments */
        .acc-text-adjust {
          background: var(--acc-card-bg);
          padding: 20px;
          margin-bottom: 20px;
          border-radius: var(--acc-border-radius);
          border: 2px solid var(--acc-border-color);
        }
        
        .acc-text-adjust .acc-label {
          display: flex;
          justify-content: flex-start;
        }
        
        .acc-text-adjust > div {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
          align-items: center;
          font-size: 16px;
        }
        
        .acc-text-adjust .acc-label div {
          font-size: 16px !important;
        }
        
        .acc-text-adjust div[role="button"] {
          background: var(--acc-bg-color) !important;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border: 2px solid var(--acc-border-color);
        }
        
        .acc-text-adjust div[role="button"]:hover {
          border-color: var(--acc-hover-color);
        }
        
        .acc-text-adjust div[role="button"]:focus {
          outline: var(--acc-focus-outline-width) solid var(--acc-focus-ring-color);
          outline-offset: var(--acc-focus-outline-offset);
        }
        
        /* Overlay */
        .acc-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: ${parseInt(this.widgetTheme.zIndex) - 1};
        }
        
        /* Progress indicator */
        .acc-progress-indicator {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 4px;
          margin-top: 8px;
          height: 8px;
        }
        
        .acc-progress-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: var(--acc-border-color);
          transition: background-color 0.2s ease;
        }
        
        .acc-progress-dot.active {
          background-color: var(--acc-primary-color);
        }
        
        /* Selected state updates indicator colors */
        .acc-btn.acc-selected .acc-progress-dot.active {
          background-color: var(--acc-bg-color);
        }
        
        /* Responsive adjustments */
        @media only screen and (max-width: 560px) {
          .acc-menu { width: 100%; }
        }
        
        @media only screen and (max-width: 420px) {
          .acc-options { 
            grid-template-columns: repeat(2, minmax(0, 1fr)); 
            gap: 12px; 
          }
          .acc-btn {
            padding: 8px;
          }
        }
        
        /* Ensure proper focus visibility for assistive technology */
        @media (prefers-reduced-motion: reduce) {
          .acc-menu,
          .acc-btn,
          .acc-lang-select,
          .acc-progress-dot,
          .acc-menu-header div[role="button"],
          .acc-reset-btn {
            transition: none;
          }
        }
      </style>
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
          // Handle multi-level feature for text-scale.
          if (key === 'text-scale') {
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
  }

  displayWidget(options) {
  try {
    const widgetTemplate = `
      <style>
        /* Base styles for the widget */
        .acc-widget, .acc-menu {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          font-weight: 400;
          -webkit-font-smoothing: antialiased;
        }
        
        .acc-widget *, .acc-menu * { 
          box-sizing: border-box !important; 
        }
        
        /* Accessibility toggle button */
        .acc-toggle-btn {
          position: fixed;
          z-index: ${this.widgetTheme.zIndex};
          left: 30px;
          bottom: 30px;
          border-radius: 50%;
          align-items: center;
          justify-content: center;
          width: ${this.widgetTheme.buttonSize};
          height: ${this.widgetTheme.buttonSize};
          display: flex;
          cursor: pointer;
          outline: 4px solid ${this.widgetTheme.primaryColor} !important;
          border: 3px solid white !important;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2) !important;
          background: ${this.widgetTheme.primaryColor} !important;
          transition: transform 0.2s ease;
        }
        
        .acc-toggle-btn svg {
          width: 28px;
          height: 28px;
          fill: white;
        }
        
        .acc-toggle-btn:hover {
          transform: scale(1.04);
        }

        .acc-toggle-btn:focus {
          outline: 3px solid ${this.widgetTheme.primaryColor} !important;
          outline-offset: 2px;

      }
        
        @media (prefers-reduced-motion: reduce) {
          .acc-toggle-btn {
            transition: none;
          }
        }
      </style>
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
  }

  fetchDataAttr(attr) {
    try {
      const dataAttr = `data-acc-${attr}`;
      const element = document.querySelector(`[${dataAttr}]`);
      return element ? element.getAttribute(dataAttr) : null;
    } catch (e) {
      console.warn(`Error getting data attribute: ${attr}`, e);
      return null;
    }
  }

  
      startAccessibleWebWidget() {
        try {
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
      }
      
     
      launchWidget(args = {}) {
        try {
          let options = { lang: 'en', position: 'bottom-left', offset: [20, 20] };
          
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
      }
}

// ======================================================
// INITIALIZATION
// ======================================================
const widgetInstance = new AccessibleWebWidget();
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  widgetInstance.startAccessibleWebWidget();
} else {
  document.addEventListener('DOMContentLoaded', () => widgetInstance.startAccessibleWebWidget());
}
