/*!
 * AccessibleWeb Widget v1.1.1
 * https://github.com/ifrederico/accessible-web-widget
 *
 * Copyright (c) 2025 ifrederico
 * Released under the MIT License
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.
 * See DISCLAIMER.md for important legal information.
 * This widget does not guarantee accessibility compliance.
 */
var AccessibleWebWidget = (function () {
    'use strict';

    const WIDGET_THEME = {
          // Core colors
          primaryColor: '#1976d2',        // Accessible blue (WCAG AA compliant)
          primaryColorLight: '#42a5f5',   // Lighter blue
          primaryColorDark: '#0d47a1',    // Darker blue
          backgroundColor: '#f5f7fa',
          textColor: '#222222',
          textColorInverted: '#ffffff',
          
          // UI elements
          buttonSize: '48px',
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

    const WIDGET_ICONS = {
          accessibility: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M480-720q-33 0-56.5-23.5T400-800q0-33 23.5-56.5T480-880q33 0 56.5 23.5T560-800q0 33-23.5 56.5T480-720ZM360-80v-520q-60-5-122-15t-118-25l20-80q78 21 166 30.5t174 9.5q86 0 174-9.5T820-720l20 80q-56 15-118 25t-122 15v520h-80v-240h-80v240h-80Z"/></svg>',
          largePointer: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="m320-410 79-110h170L320-716v306ZM551-80 406-392 240-160v-720l560 440H516l144 309-109 51ZM399-520Z"/></svg>',
          pauseMotion: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="m791-55-91-91q-49 32-104.5 49T480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 17-115.5T146-700l-91-91 57-57 736 736-57 57ZM480-160q43 0 83.5-11t78.5-33L204-642q-22 38-33 78.5T160-480q0 133 93.5 226.5T480-160Zm334-100-58-58q22-38 33-78.5t11-83.5q0-133-93.5-226.5T480-800q-43 0-83.5 11T318-756l-58-58q49-32 104.5-49T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 60-17 115.5T814-260ZM537-537ZM423-423Z"/></svg>',
          readingAid: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M320-80v-440l-80-120v-240h480v240l-80 120v440H320Zm160-260q-25 0-42.5-17.5T420-400q0-25 17.5-42.5T480-460q25 0 42.5 17.5T540-400q0 25-17.5 42.5T480-340ZM320-760h320v-40H320v40Zm320 80H320v16l80 120v384h160v-384l80-120v-16ZM480-480Z"/></svg>',
          boldText: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M272-200v-560h221q65 0 120 40t55 111q0 51-23 78.5T602-491q25 11 55.5 41t30.5 90q0 89-65 124.5T501-200H272Zm121-112h104q48 0 58.5-24.5T566-372q0-11-10.5-35.5T494-432H393v120Zm0-228h93q33 0 48-17t15-38q0-24-17-39t-44-15h-95v109Z"/></svg>',
          lineSpacing: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M240-160 80-320l56-56 64 62v-332l-64 62-56-56 160-160 160 160-56 56-64-62v332l64-62 56 56-160 160Zm240-40v-80h400v80H480Zm0-240v-80h400v80H480Zm0-240v-80h400v80H480Z"/></svg>',
          letterSpacing: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M320-80 160-240l160-160 57 56-64 64h334l-63-64 56-56 160 160L640-80l-57-56 64-64H313l63 64-56 56ZM200-480v-400h80v400h-80Zm240 0v-400h80v400h-80Zm240 0v-400h80v400h-80Z"/></svg>',
          dyslexiaFont: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="m131-252 165-440h79l165 440h-76l-39-112H247l-40 112h-76Zm139-176h131l-64-182h-4l-63 182Zm395 186q-51 0-81-27.5T554-342q0-44 34.5-72.5T677-443q23 0 45 4t38 11v-12q0-29-20.5-47T685-505q-23 0-42 9.5T610-468l-47-35q24-29 54.5-43t68.5-14q69 0 103 32.5t34 97.5v178h-63v-37h-4q-14 23-38 35t-53 12Zm12-54q35 0 59.5-24t24.5-56q-14-8-33.5-12.5T689-393q-32 0-50 14t-18 37q0 20 16 33t40 13Z"/></svg>',
          highlightLinks: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M440-280H280q-83 0-141.5-58.5T80-480q0-83 58.5-141.5T280-680h160v80H280q-50 0-85 35t-35 85q0 50 35 85t85 35h160v80ZM320-440v-80h320v80H320Zm200 160v-80h160q50 0 85-35t35-85q0-50-35-85t-85-35H520v-80h160q83 0 141.5 58.5T880-480q0 83-58.5 141.5T680-280H520Z"/></svg>',
          highlightTitle: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M320-280q17 0 28.5-11.5T360-320q0-17-11.5-28.5T320-360q-17 0-28.5 11.5T280-320q0 17 11.5 28.5T320-280Zm0-160q17 0 28.5-11.5T360-480q0-17-11.5-28.5T320-520q-17 0-28.5 11.5T280-480q0 17 11.5 28.5T320-440Zm0-160q17 0 28.5-11.5T360-640q0-17-11.5-28.5T320-680q-17 0-28.5 11.5T280-640q0 17 11.5 28.5T320-600Zm120 320h240v-80H440v80Zm0-160h240v-80H440v80Zm0-160h240v-80H440v80ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z"/></svg>',
          contrast: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="m480-260 60-60h100v-100l60-60-60-60v-100H540l-60-60-60 60H320v100l-60 60 60 60v100h100l60 60Zm0-100v-240q50 0 85 35t35 85q0 50-35 85t-85 35ZM160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm0-80h640v-480H160v480Zm0 0v-480 480Z"/></svg>',
          darkContrast: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M484-80q-84 0-157.5-32t-128-86.5Q144-253 112-326.5T80-484q0-146 93-257.5T410-880q-18 99 11 193.5T521-521q71 71 165.5 100T880-410q-26 144-138 237T484-80Zm0-80q88 0 163-44t118-121q-86-8-163-43.5T464-465q-61-61-97-138t-43-163q-77 43-120.5 118.5T160-484q0 135 94.5 229.5T484-160Zm-20-305Z"/></svg>',
          lightContrast: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M440-800v-120h80v120h-80Zm0 760v-120h80v120h-80Zm360-400v-80h120v80H800Zm-760 0v-80h120v80H40Zm708-252-56-56 70-72 58 58-72 70ZM198-140l-58-58 72-70 56 56-70 72Zm564 0-70-72 56-56 72 70-58 58ZM212-692l-72-70 58-58 70 72-56 56Zm268 452q-100 0-170-70t-70-170q0-100 70-170t170-70q100 0 170 70t70 170q0 100-70 170t-170 70Zm0-80q67 0 113.5-46.5T640-480q0-67-46.5-113.5T480-640q-67 0-113.5 46.5T320-480q0 67 46.5 113.5T480-320Zm0-160Z"/></svg>',
          invertColors: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-64-24.5-122.5T706-706L254-254q45 45 103.5 69.5T480-160Zm0-160v-60h200v60H480ZM320-500h60v-80h80v-60h-80v-80h-60v80h-80v60h80v80Z"/></svg>',
          saturation: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M480-120q-133 0-226.5-92.5T160-436q0-66 25-122t69-100l226-222 226 222q44 44 69 100t25 122q0 131-93.5 223.5T480-120Zm0-80v-568L310-600q-35 33-52.5 74.5T240-436q0 97 70 166.5T480-200Z"/></svg>',
          lowSaturation: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M480-120q-133 0-226.5-92T160-436q0-65 25-121.5T254-658l226-222 226 222q44 44 69 100.5T800-436q0 132-93.5 224T480-120ZM242-400h474q12-72-13.5-123T650-600L480-768 310-600q-27 26-53 77t-15 123Z"/></svg>',
          highSaturation: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 32.5-156t88-127Q256-817 330-848.5T488-880q80 0 151 27.5t124.5 76q53.5 48.5 85 115T880-518q0 115-70 176.5T640-280h-74q-9 0-12.5 5t-3.5 11q0 12 15 34.5t15 51.5q0 50-27.5 74T480-80Zm0-400Zm-220 40q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm120-160q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm200 0q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm120 160q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17ZM480-160q9 0 14.5-5t5.5-13q0-14-15-33t-15-57q0-42 29-67t71-25h70q66 0 113-38.5T800-518q0-121-92.5-201.5T488-800q-136 0-232 93t-96 227q0 133 93.5 226.5T480-160Z"/></svg>',
          reset: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M440-122q-121-15-200.5-105.5T160-440q0-66 26-126.5T260-672l57 57q-38 34-57.5 79T240-440q0 88 56 155.5T440-202v80Zm80 0v-80q87-16 143.5-83T720-440q0-100-70-170t-170-70h-3l44 44-56 56-140-140 140-140 56 56-44 44h3q134 0 227 93t93 227q0 121-79.5 211.5T520-122Z"/></svg>',
          close: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41Z"/></svg>',
          increase: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2Z"/></svg>',
          decrease: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 13H5v-2h14v2Z"/></svg>',
          arrowBack: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z"/></svg>',
          adjustFontSize: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M2 4v3h5v12h3V7h5V4H2m19 5h-9v3h3v7h3v-7h3V9Z"/></svg>',
          language: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-155.5t86-127Q252-817 325-848.5T480-880q83 0 155.5 31.5t127 86q54.5 54.5 86 127T880-480q0 82-31.5 155t-86 127.5q-54.5 54.5-127 86T480-80Zm0-82q26-36 45-75t31-83H404q12 44 31 83t45 75Zm-104-16q-18-33-31.5-68.5T322-320H204q29 50 72.5 87t99.5 55Zm208 0q56-18 99.5-55t72.5-87H638q-9 38-22.5 73.5T584-178ZM170-400h136q-3-20-4.5-39.5T300-480q0-21 1.5-40.5T306-560H170q-5 20-7.5 39.5T160-480q0 21 2.5 40.5T170-400Zm216 0h188q3-20 4.5-39.5T580-480q0-21-1.5-40.5T574-560H386q-3 20-4.5 39.5T380-480q0 21 1.5 40.5T386-400Zm268 0h136q5-20 7.5-39.5T800-480q0-21-2.5-40.5T790-560H654q3 20 4.5 39.5T660-480q0 21-1.5 40.5T654-400Zm-16-240h118q-29-50-72.5-87T584-782q18 33 31.5 68.5T638-640Zm-234 0h152q-12-44-31-83t-45-75q-26 36-45 75t-31 83Zm-200 0h118q9-38 22.5-73.5T376-782q-56 18-99.5 55T204-640Z"/></svg>',
          hideImages: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="m840-234-80-80v-446H314l-80-80h526q33 0 56.5 23.5T840-760v526ZM792-56l-64-64H200q-33 0-56.5-23.5T120-200v-528l-64-64 56-56 736 736-56 56ZM240-280l120-160 90 120 33-44-283-283v447h447l-80-80H240Zm297-257ZM424-424Z"/></svg>',
          accessibilityReport: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h168q13-36 43.5-58t68.5-22q38 0 68.5 22t43.5 58h168q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm80-80h280v-80H280v80Zm0-160h400v-80H280v80Zm0-160h400v-80H280v80Zm221.5-198.5Q510-807 510-820t-8.5-21.5Q493-850 480-850t-21.5 8.5Q450-833 450-820t8.5 21.5Q467-790 480-790t21.5-8.5ZM200-200v-560 560Z"/></svg>',
          annotations: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v268q-19-9-39-15.5t-41-9.5v-243H200v560h242q3 22 9.5 42t15.5 38H200Zm0-120v40-560 243-3 280Zm80-40h163q3-21 9.5-41t14.5-39H280v80Zm0-160h244q32-30 71.5-50t84.5-27v-3H280v80Zm0-160h400v-80H280v80ZM720-40q-83 0-141.5-58.5T520-240q0-83 58.5-141.5T720-440q83 0 141.5 58.5T920-240q0 83-58.5 141.5T720-40Zm-20-80h40v-100h100v-40H740v-100h-40v100H600v40h100v100Z"/></svg>',
          textToSpeech: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M560-131v-82q90-26 145-100t55-168q0-94-55-168T560-749v-82q124 28 202 125.5T840-481q0 127-78 224.5T560-131ZM120-360v-240h160l200-200v640L280-360H120Zm440 40v-322q47 22 73.5 66t26.5 96q0 51-26.5 94.5T560-320ZM400-606l-86 86H200v80h114l86 86v-252ZM300-480Z"/></svg>',
          highContrast: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93v640Z"/></svg>',
          simplifyLayout: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M760-360v-80H200v80h560Zm0-160v-80H200v80h560Zm0-160v-80H200v80h560ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm560-80v-80H200v80h560Z"/></svg>'
        };

    const TARGET_SELECTORS = {
          ALL: ['', '*:not(.material-icons,.acc-menu,.acc-menu *)'],
          LINKS: ["a[href]"],
          HEADERS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', '.wsite-headline', '.wsite-content-title'],
          TEXT: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', '.wsite-headline', '.wsite-content-title', 'img', 'p', 'i', 'svg', 'a', 'button:not(.acc-btn)', 'label', 'li', 'ol']
        };

    const PAGE_CONTENT_SELECTOR = 'body > *:not(.acc-container):not(.acc-rg-container):not(#acc-skip-link)';

    const TRANSLATIONS = {
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
            "Skip to accessibility menu": "Skip to accessibility menu",
            "Accessibility Report": "Accessibility Report",
            "Run Accessibility Check": "Run Accessibility Check",
            "Loading...": "Loading...",
            "Analyzing page...": "Analyzing page...",
            "Critical": "Critical",
            "Serious": "Serious",
            "Moderate": "Moderate",
            "Minor": "Minor",
            "Violations Found": "Violations Found",
            "No Issues Found": "No Issues Found",
            "Element": "Element",
            "Issue": "Issue",
            "How to Fix": "How to Fix",
            "Close Report": "Close Report",
            "Passed Tests": "Passed Tests",
            "Items Need Review": "Items Need Review",
            "Annotations": "Annotations",
            "Text to Speech": "Text to Speech",
            "Text to Speech On": "Text to Speech On",
            "Text to Speech Off": "Text to Speech Off",
            "Simplify Layout": "Simplify Layout",
            "Play": "Play",
            "Pause": "Pause",
            "Stop": "Stop",
            "Loading voice...": "Loading voice...",
            "Reading...": "Reading...",
          },
          it: {
            "Accessibility Menu": "Menu Accessibilità",
            "Reset settings": "Ripristina impostazioni",
            "Reset All Settings": "Ripristina tutte le impostazioni",
            "Close": "Chiudi",
            "Content Adjustments": "Regolazioni Contenuto",
            "Adjust Font Size": "Regola Dimensione Font",
            "Highlight Title": "Evidenzia Titoli",
            "Highlight Links": "Evidenzia Link",
            "Readable Font": "Font Leggibile",
            "Color Adjustments": "Regolazioni Colore",
            "Invert Colors": "Inverti Colori",
            "Light Contrast": "Contrasto Chiaro",
            "Dark Contrast": "Contrasto Scuro",
            "High Contrast": "Alto Contrasto",
            "High Saturation": "Alta Saturazione",
            "Low Saturation": "Bassa Saturazione",
            "Monochrome": "Monocromatico",
            "Tools": "Strumenti",
            "Reading Guide": "Guida di Lettura",
            "Stop Animations": "Ferma Animazioni",
            "Big Cursor": "Cursore Grande",
            "Increase Font Size": "Aumenta Dimensione Font",
            "Decrease Font Size": "Diminuisci Dimensione Font",
            "Letter Spacing": "Spaziatura Lettere",
            "Line Height": "Altezza Riga",
            "Font Weight": "Grassetto",
            "Dyslexia Font": "Font Dislessia",
            "Language": "Lingua",
            "Open Accessibility Menu": "Apri Menu Accessibilità",
            "Hide Images": "Nascondi Immagini",
            "Skip to accessibility menu": "Vai al menu accessibilità",
            "Accessibility Report": "Report Accessibilità",
            "Run Accessibility Check": "Esegui Controllo Accessibilità",
            "Loading...": "Caricamento...",
            "Analyzing page...": "Analisi pagina...",
            "Critical": "Critico",
            "Serious": "Grave",
            "Moderate": "Moderato",
            "Minor": "Minore",
            "Violations Found": "Violazioni Trovate",
            "No Issues Found": "Nessun Problema Trovato",
            "Element": "Elemento",
            "Issue": "Problema",
            "How to Fix": "Come Risolvere",
            "Close Report": "Chiudi Report",
            "Passed Tests": "Test Superati",
            "Items Need Review": "Elementi da Rivedere",
            "Annotations": "Annotations",
            "Text to Speech": "Text to Speech",
            "Text to Speech On": "Sintesi Vocale Attiva",
            "Text to Speech Off": "Sintesi Vocale Disattiva",
            "Simplify Layout": "Simplify Layout",
            "Play": "Play",
            "Pause": "Pause",
            "Stop": "Stop",
            "Reading...": "Reading...",
          },
          fr: {
            "Accessibility Menu": "Menu Accessibilité",
            "Reset settings": "Réinitialiser les paramètres",
            "Reset All Settings": "Réinitialiser tous les paramètres",
            "Close": "Fermer",
            "Content Adjustments": "Ajustements du Contenu",
            "Adjust Font Size": "Ajuster la Taille de Police",
            "Highlight Title": "Surligner les Titres",
            "Highlight Links": "Surligner les Liens",
            "Readable Font": "Police Lisible",
            "Color Adjustments": "Ajustements des Couleurs",
            "Invert Colors": "Inverser les Couleurs",
            "Light Contrast": "Contraste Clair",
            "Dark Contrast": "Contraste Sombre",
            "High Contrast": "Contraste Élevé",
            "High Saturation": "Saturation Élevée",
            "Low Saturation": "Saturation Faible",
            "Monochrome": "Monochrome",
            "Tools": "Outils",
            "Reading Guide": "Guide de Lecture",
            "Stop Animations": "Arrêter les Animations",
            "Big Cursor": "Grand Curseur",
            "Increase Font Size": "Augmenter la Taille de Police",
            "Decrease Font Size": "Diminuer la Taille de Police",
            "Letter Spacing": "Espacement des Lettres",
            "Line Height": "Hauteur de Ligne",
            "Font Weight": "Graisse de Police",
            "Dyslexia Font": "Police Dyslexie",
            "Language": "Langue",
            "Open Accessibility Menu": "Ouvrir le Menu Accessibilité",
            "Hide Images": "Masquer les Images",
            "Skip to accessibility menu": "Aller au menu accessibilité",
            "Accessibility Report": "Rapport d'Accessibilité",
            "Run Accessibility Check": "Lancer le Contrôle d'Accessibilité",
            "Loading...": "Chargement...",
            "Analyzing page...": "Analyse de la page...",
            "Critical": "Critique",
            "Serious": "Grave",
            "Moderate": "Modéré",
            "Minor": "Mineur",
            "Violations Found": "Violations Trouvées",
            "No Issues Found": "Aucun Problème Trouvé",
            "Element": "Élément",
            "Issue": "Problème",
            "How to Fix": "Comment Corriger",
            "Close Report": "Fermer le Rapport",
            "Passed Tests": "Tests Réussis",
            "Items Need Review": "Éléments à Vérifier",
            "Annotations": "Annotations",
            "Text to Speech": "Text to Speech",
            "Text to Speech On": "Synthèse Vocale Activée",
            "Text to Speech Off": "Synthèse Vocale Désactivée",
            "Simplify Layout": "Simplify Layout",
            "Play": "Play",
            "Pause": "Pause",
            "Stop": "Stop",
            "Reading...": "Reading...",
          },
          de: {
            "Accessibility Menu": "Barrierefreiheit-Menü",
            "Reset settings": "Einstellungen zurücksetzen",
            "Reset All Settings": "Alle Einstellungen zurücksetzen",
            "Close": "Schließen",
            "Content Adjustments": "Inhaltsanpassungen",
            "Adjust Font Size": "Schriftgröße anpassen",
            "Highlight Title": "Titel hervorheben",
            "Highlight Links": "Links hervorheben",
            "Readable Font": "Lesbare Schrift",
            "Color Adjustments": "Farbanpassungen",
            "Invert Colors": "Farben invertieren",
            "Light Contrast": "Heller Kontrast",
            "Dark Contrast": "Dunkler Kontrast",
            "High Contrast": "Hoher Kontrast",
            "High Saturation": "Hohe Sättigung",
            "Low Saturation": "Niedrige Sättigung",
            "Monochrome": "Monochrom",
            "Tools": "Werkzeuge",
            "Reading Guide": "Lesehilfe",
            "Stop Animations": "Animationen stoppen",
            "Big Cursor": "Großer Cursor",
            "Increase Font Size": "Schriftgröße erhöhen",
            "Decrease Font Size": "Schriftgröße verringern",
            "Letter Spacing": "Zeichenabstand",
            "Line Height": "Zeilenhöhe",
            "Font Weight": "Schriftstärke",
            "Dyslexia Font": "Legasthenie-Schrift",
            "Language": "Sprache",
            "Open Accessibility Menu": "Barrierefreiheit-Menü öffnen",
            "Hide Images": "Bilder ausblenden",
            "Skip to accessibility menu": "Zum Barrierefreiheit-Menü springen",
            "Accessibility Report": "Barrierefreiheit-Bericht",
            "Run Accessibility Check": "Barrierefreiheitsprüfung starten",
            "Loading...": "Laden...",
            "Analyzing page...": "Seite wird analysiert...",
            "Critical": "Kritisch",
            "Serious": "Schwerwiegend",
            "Moderate": "Mäßig",
            "Minor": "Gering",
            "Violations Found": "Verstöße gefunden",
            "No Issues Found": "Keine Probleme gefunden",
            "Element": "Element",
            "Issue": "Problem",
            "How to Fix": "Lösung",
            "Close Report": "Bericht schließen",
            "Passed Tests": "Bestandene Tests",
            "Items Need Review": "Elemente zur Überprüfung",
            "Annotations": "Annotations",
            "Text to Speech": "Text to Speech",
            "Text to Speech On": "Sprachausgabe Ein",
            "Text to Speech Off": "Sprachausgabe Aus",
            "Simplify Layout": "Simplify Layout",
            "Play": "Play",
            "Pause": "Pause",
            "Stop": "Stop",
            "Reading...": "Reading...",
          },
          es: {
            "Accessibility Menu": "Menú de Accesibilidad",
            "Reset settings": "Restablecer configuración",
            "Reset All Settings": "Restablecer toda la configuración",
            "Close": "Cerrar",
            "Content Adjustments": "Ajustes de Contenido",
            "Adjust Font Size": "Ajustar Tamaño de Fuente",
            "Highlight Title": "Resaltar Títulos",
            "Highlight Links": "Resaltar Enlaces",
            "Readable Font": "Fuente Legible",
            "Color Adjustments": "Ajustes de Color",
            "Invert Colors": "Invertir Colores",
            "Light Contrast": "Contraste Claro",
            "Dark Contrast": "Contraste Oscuro",
            "High Contrast": "Alto Contraste",
            "High Saturation": "Alta Saturación",
            "Low Saturation": "Baja Saturación",
            "Monochrome": "Monocromo",
            "Tools": "Herramientas",
            "Reading Guide": "Guía de Lectura",
            "Stop Animations": "Detener Animaciones",
            "Big Cursor": "Cursor Grande",
            "Increase Font Size": "Aumentar Tamaño de Fuente",
            "Decrease Font Size": "Disminuir Tamaño de Fuente",
            "Letter Spacing": "Espaciado de Letras",
            "Line Height": "Altura de Línea",
            "Font Weight": "Grosor de Fuente",
            "Dyslexia Font": "Fuente para Dislexia",
            "Language": "Idioma",
            "Open Accessibility Menu": "Abrir Menú de Accesibilidad",
            "Hide Images": "Ocultar Imágenes",
            "Skip to accessibility menu": "Ir al menú de accesibilidad",
            "Accessibility Report": "Informe de Accesibilidad",
            "Run Accessibility Check": "Ejecutar Comprobación de Accesibilidad",
            "Loading...": "Cargando...",
            "Analyzing page...": "Analizando página...",
            "Critical": "Crítico",
            "Serious": "Grave",
            "Moderate": "Moderado",
            "Minor": "Menor",
            "Violations Found": "Violaciones Encontradas",
            "No Issues Found": "Sin Problemas Encontrados",
            "Element": "Elemento",
            "Issue": "Problema",
            "How to Fix": "Cómo Solucionarlo",
            "Close Report": "Cerrar Informe",
            "Passed Tests": "Pruebas Superadas",
            "Items Need Review": "Elementos a Revisar",
            "Annotations": "Annotations",
            "Text to Speech": "Text to Speech",
            "Text to Speech On": "Texto a Voz Activado",
            "Text to Speech Off": "Texto a Voz Desactivado",
            "Simplify Layout": "Simplify Layout",
            "Play": "Play",
            "Pause": "Pause",
            "Stop": "Stop",
            "Reading...": "Reading...",
          },
          ru: {
            "Accessibility Menu": "Меню доступности",
            "Reset settings": "Сбросить настройки",
            "Reset All Settings": "Сбросить все настройки",
            "Close": "Закрыть",
            "Content Adjustments": "Настройки контента",
            "Adjust Font Size": "Изменить размер шрифта",
            "Highlight Title": "Выделить заголовки",
            "Highlight Links": "Выделить ссылки",
            "Readable Font": "Читаемый шрифт",
            "Color Adjustments": "Настройки цвета",
            "Invert Colors": "Инвертировать цвета",
            "Light Contrast": "Светлый контраст",
            "Dark Contrast": "Тёмный контраст",
            "High Contrast": "Высокий контраст",
            "High Saturation": "Высокая насыщенность",
            "Low Saturation": "Низкая насыщенность",
            "Monochrome": "Монохромный",
            "Tools": "Инструменты",
            "Reading Guide": "Линейка для чтения",
            "Stop Animations": "Остановить анимации",
            "Big Cursor": "Большой курсор",
            "Increase Font Size": "Увеличить размер шрифта",
            "Decrease Font Size": "Уменьшить размер шрифта",
            "Letter Spacing": "Межбуквенный интервал",
            "Line Height": "Высота строки",
            "Font Weight": "Жирный шрифт",
            "Dyslexia Font": "Шрифт для дислексии",
            "Language": "Язык",
            "Open Accessibility Menu": "Открыть меню доступности",
            "Hide Images": "Скрыть изображения",
            "Skip to accessibility menu": "Перейти к меню доступности",
            "Accessibility Report": "Отчёт о доступности",
            "Run Accessibility Check": "Запустить проверку доступности",
            "Loading...": "Загрузка...",
            "Analyzing page...": "Анализ страницы...",
            "Critical": "Критический",
            "Serious": "Серьёзный",
            "Moderate": "Умеренный",
            "Minor": "Незначительный",
            "Violations Found": "Найдены нарушения",
            "No Issues Found": "Проблем не найдено",
            "Element": "Элемент",
            "Issue": "Проблема",
            "How to Fix": "Как исправить",
            "Close Report": "Закрыть отчёт",
            "Passed Tests": "Пройденные тесты",
            "Items Need Review": "Требуют проверки",
            "Annotations": "Annotations",
            "Text to Speech": "Text to Speech",
            "Text to Speech On": "Озвучивание Включено",
            "Text to Speech Off": "Озвучивание Выключено",
            "Simplify Layout": "Simplify Layout",
            "Play": "Play",
            "Pause": "Pause",
            "Stop": "Stop",
            "Reading...": "Reading...",
          },
          pl: {
            "Accessibility Menu": "Menu Dostępności",
            "Reset settings": "Zresetuj ustawienia",
            "Reset All Settings": "Zresetuj wszystkie ustawienia",
            "Close": "Zamknij",
            "Content Adjustments": "Dostosowanie Treści",
            "Adjust Font Size": "Dostosuj Rozmiar Czcionki",
            "Highlight Title": "Podświetl Tytuły",
            "Highlight Links": "Podświetl Linki",
            "Readable Font": "Czytelna Czcionka",
            "Color Adjustments": "Dostosowanie Kolorów",
            "Invert Colors": "Odwróć Kolory",
            "Light Contrast": "Jasny Kontrast",
            "Dark Contrast": "Ciemny Kontrast",
            "High Contrast": "Wysoki Kontrast",
            "High Saturation": "Wysoka Saturacja",
            "Low Saturation": "Niska Saturacja",
            "Monochrome": "Monochromatyczny",
            "Tools": "Narzędzia",
            "Reading Guide": "Linia do Czytania",
            "Stop Animations": "Zatrzymaj Animacje",
            "Big Cursor": "Duży Kursor",
            "Increase Font Size": "Zwiększ Rozmiar Czcionki",
            "Decrease Font Size": "Zmniejsz Rozmiar Czcionki",
            "Letter Spacing": "Odstępy Między Literami",
            "Line Height": "Wysokość Linii",
            "Font Weight": "Grubość Czcionki",
            "Dyslexia Font": "Czcionka dla Dysleksji",
            "Language": "Język",
            "Open Accessibility Menu": "Otwórz Menu Dostępności",
            "Hide Images": "Ukryj Obrazy",
            "Skip to accessibility menu": "Przejdź do menu dostępności",
            "Accessibility Report": "Raport Dostępności",
            "Run Accessibility Check": "Uruchom Sprawdzanie Dostępności",
            "Loading...": "Ładowanie...",
            "Analyzing page...": "Analizowanie strony...",
            "Critical": "Krytyczny",
            "Serious": "Poważny",
            "Moderate": "Umiarkowany",
            "Minor": "Drobny",
            "Violations Found": "Znalezione Naruszenia",
            "No Issues Found": "Brak Problemów",
            "Element": "Element",
            "Issue": "Problem",
            "How to Fix": "Jak Naprawić",
            "Close Report": "Zamknij Raport",
            "Passed Tests": "Zaliczone Testy",
            "Items Need Review": "Elementy do Sprawdzenia",
            "Annotations": "Annotations",
            "Text to Speech": "Text to Speech",
            "Text to Speech On": "Czytanie Tekstu Włączone",
            "Text to Speech Off": "Czytanie Tekstu Wyłączone",
            "Simplify Layout": "Simplify Layout",
            "Play": "Play",
            "Pause": "Pause",
            "Stop": "Stop",
            "Reading...": "Reading...",
          },
          ro: {
            "Accessibility Menu": "Meniu Accesibilitate",
            "Reset settings": "Resetare setări",
            "Reset All Settings": "Resetare toate setările",
            "Close": "Închide",
            "Content Adjustments": "Ajustări Conținut",
            "Adjust Font Size": "Ajustare Dimensiune Font",
            "Highlight Title": "Evidențiere Titluri",
            "Highlight Links": "Evidențiere Linkuri",
            "Readable Font": "Font Lizibil",
            "Color Adjustments": "Ajustări Culoare",
            "Invert Colors": "Inversare Culori",
            "Light Contrast": "Contrast Luminos",
            "Dark Contrast": "Contrast Întunecat",
            "High Contrast": "Contrast Ridicat",
            "High Saturation": "Saturație Ridicată",
            "Low Saturation": "Saturație Scăzută",
            "Monochrome": "Monocrom",
            "Tools": "Instrumente",
            "Reading Guide": "Ghid de Citire",
            "Stop Animations": "Oprire Animații",
            "Big Cursor": "Cursor Mare",
            "Increase Font Size": "Mărire Dimensiune Font",
            "Decrease Font Size": "Micșorare Dimensiune Font",
            "Letter Spacing": "Spațiere Litere",
            "Line Height": "Înălțime Linie",
            "Font Weight": "Grosime Font",
            "Dyslexia Font": "Font pentru Dislexie",
            "Language": "Limbă",
            "Open Accessibility Menu": "Deschide Meniul Accesibilitate",
            "Hide Images": "Ascunde Imagini",
            "Skip to accessibility menu": "Salt la meniul de accesibilitate",
            "Accessibility Report": "Raport Accesibilitate",
            "Run Accessibility Check": "Rulează Verificare Accesibilitate",
            "Loading...": "Se încarcă...",
            "Analyzing page...": "Se analizează pagina...",
            "Critical": "Critic",
            "Serious": "Grav",
            "Moderate": "Moderat",
            "Minor": "Minor",
            "Violations Found": "Încălcări Găsite",
            "No Issues Found": "Nicio Problemă Găsită",
            "Element": "Element",
            "Issue": "Problemă",
            "How to Fix": "Cum se Remediază",
            "Close Report": "Închide Raportul",
            "Passed Tests": "Teste Trecute",
            "Items Need Review": "Elemente de Verificat",
            "Annotations": "Annotations",
            "Text to Speech": "Text to Speech",
            "Text to Speech On": "Text to Speech Pornit",
            "Text to Speech Off": "Text to Speech Oprit",
            "Simplify Layout": "Simplify Layout",
            "Play": "Play",
            "Pause": "Pause",
            "Stop": "Stop",
            "Reading...": "Reading...",
          },
          nl: {
            "Accessibility Menu": "Toegankelijkheidsmenu",
            "Reset settings": "Instellingen resetten",
            "Reset All Settings": "Alle instellingen resetten",
            "Close": "Sluiten",
            "Content Adjustments": "Inhoudsaanpassingen",
            "Adjust Font Size": "Lettergrootte aanpassen",
            "Highlight Title": "Titels markeren",
            "Highlight Links": "Links markeren",
            "Readable Font": "Leesbaar Lettertype",
            "Color Adjustments": "Kleuraanpassingen",
            "Invert Colors": "Kleuren omkeren",
            "Light Contrast": "Licht Contrast",
            "Dark Contrast": "Donker Contrast",
            "High Contrast": "Hoog Contrast",
            "High Saturation": "Hoge Verzadiging",
            "Low Saturation": "Lage Verzadiging",
            "Monochrome": "Monochroom",
            "Tools": "Hulpmiddelen",
            "Reading Guide": "Leeshulp",
            "Stop Animations": "Animaties stoppen",
            "Big Cursor": "Grote Cursor",
            "Increase Font Size": "Lettergrootte vergroten",
            "Decrease Font Size": "Lettergrootte verkleinen",
            "Letter Spacing": "Letterafstand",
            "Line Height": "Regelhoogte",
            "Font Weight": "Letterdikte",
            "Dyslexia Font": "Dyslexie Lettertype",
            "Language": "Taal",
            "Open Accessibility Menu": "Toegankelijkheidsmenu openen",
            "Hide Images": "Afbeeldingen verbergen",
            "Skip to accessibility menu": "Ga naar toegankelijkheidsmenu",
            "Accessibility Report": "Toegankelijkheidsrapport",
            "Run Accessibility Check": "Toegankelijkheidscontrole uitvoeren",
            "Loading...": "Laden...",
            "Analyzing page...": "Pagina analyseren...",
            "Critical": "Kritiek",
            "Serious": "Ernstig",
            "Moderate": "Matig",
            "Minor": "Gering",
            "Violations Found": "Overtredingen Gevonden",
            "No Issues Found": "Geen Problemen Gevonden",
            "Element": "Element",
            "Issue": "Probleem",
            "How to Fix": "Hoe op te lossen",
            "Close Report": "Rapport Sluiten",
            "Passed Tests": "Geslaagde Tests",
            "Items Need Review": "Items te Controleren",
            "Annotations": "Annotations",
            "Text to Speech": "Text to Speech",
            "Text to Speech On": "Tekst naar Spraak Aan",
            "Text to Speech Off": "Tekst naar Spraak Uit",
            "Simplify Layout": "Simplify Layout",
            "Play": "Play",
            "Pause": "Pause",
            "Stop": "Stop",
            "Reading...": "Reading...",
          },
          uk: {
            "Accessibility Menu": "Меню доступності",
            "Reset settings": "Скинути налаштування",
            "Reset All Settings": "Скинути всі налаштування",
            "Close": "Закрити",
            "Content Adjustments": "Налаштування контенту",
            "Adjust Font Size": "Змінити розмір шрифту",
            "Highlight Title": "Виділити заголовки",
            "Highlight Links": "Виділити посилання",
            "Readable Font": "Читабельний шрифт",
            "Color Adjustments": "Налаштування кольору",
            "Invert Colors": "Інвертувати кольори",
            "Light Contrast": "Світлий контраст",
            "Dark Contrast": "Темний контраст",
            "High Contrast": "Високий контраст",
            "High Saturation": "Висока насиченість",
            "Low Saturation": "Низька насиченість",
            "Monochrome": "Монохромний",
            "Tools": "Інструменти",
            "Reading Guide": "Лінійка для читання",
            "Stop Animations": "Зупинити анімації",
            "Big Cursor": "Великий курсор",
            "Increase Font Size": "Збільшити розмір шрифту",
            "Decrease Font Size": "Зменшити розмір шрифту",
            "Letter Spacing": "Міжлітерний інтервал",
            "Line Height": "Висота рядка",
            "Font Weight": "Жирний шрифт",
            "Dyslexia Font": "Шрифт для дислексії",
            "Language": "Мова",
            "Open Accessibility Menu": "Відкрити меню доступності",
            "Hide Images": "Приховати зображення",
            "Skip to accessibility menu": "Перейти до меню доступності",
            "Accessibility Report": "Звіт про доступність",
            "Run Accessibility Check": "Запустити перевірку доступності",
            "Loading...": "Завантаження...",
            "Analyzing page...": "Аналіз сторінки...",
            "Critical": "Критичний",
            "Serious": "Серйозний",
            "Moderate": "Помірний",
            "Minor": "Незначний",
            "Violations Found": "Знайдені порушення",
            "No Issues Found": "Проблем не знайдено",
            "Element": "Елемент",
            "Issue": "Проблема",
            "How to Fix": "Як виправити",
            "Close Report": "Закрити звіт",
            "Passed Tests": "Пройдені тести",
            "Items Need Review": "Потребують перевірки",
            "Annotations": "Annotations",
            "Text to Speech": "Text to Speech",
            "Text to Speech On": "Озвучування Увімкнено",
            "Text to Speech Off": "Озвучування Вимкнено",
            "Simplify Layout": "Simplify Layout",
            "Play": "Play",
            "Pause": "Pause",
            "Stop": "Stop",
            "Reading...": "Reading...",
          }
        };

    const SUPPORTED_LANGUAGES = [
          { code: "en", label: "English (English)" },
          { code: "it", label: "Italiano (Italian)" },
          { code: "fr", label: "Français (French)" },
          { code: "de", label: "Deutsch (German)" },
          { code: "es", label: "Español (Spanish)" },
          { code: "ru", label: "Русский (Russian)" },
          { code: "pl", label: "Polski (Polish)" },
          { code: "ro", label: "Română (Romanian)" },
          { code: "nl", label: "Nederlands (Dutch)" },
          { code: "uk", label: "Українська (Ukrainian)" }
        ];

    /** @typedef {import('./index.js').default} AccessibleWebWidget */

    /** @type {{ [methodName: string]: (this: AccessibleWebWidget, ...args: any[]) => any }} */
    const stateMethods = {

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

      hasExplicitColorFilterPreference() {
          const states = this.widgetConfig?.states || {};
          const systemDefaults = this.widgetConfig?.systemDefaults || {};
          const keys = Array.isArray(this.colorFilterKeys) ? this.colorFilterKeys : [];
          return keys.some((key) =>
            Object.prototype.hasOwnProperty.call(states, key) &&
            !Object.prototype.hasOwnProperty.call(systemDefaults, key)
          );
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

    var menuCSS = "/* Base styles */\n.acc-menu {\n  position: fixed;\n  left: var(--acc-menu-inline-gap, 12px);\n  top: var(--acc-menu-block-gap, 12px);\n  bottom: var(--acc-menu-block-gap, 12px);\n  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);\n  opacity: 1;\n  transition: 0.3s;\n  z-index: var(--acc-widget-z-index, 100000);\n  overflow: hidden;\n  background: var(--acc-bg-color);\n  width: min(430px, calc(100vw - (var(--acc-menu-inline-gap, 12px) * 2)));\n  line-height: 1.5;\n  font-size: 16px;\n  height: auto;\n  letter-spacing: 0.015em;\n  color: var(--acc-text-color);\n  --acc-content-inline-padding: 14px;\n  --acc-menu-inline-gap: clamp(8px, 2.3vw, 18px);\n  --acc-menu-block-gap: clamp(10px, 2.2vh, 20px);\n  border-radius: 16px;\n  box-shadow: 0 18px 42px rgba(0, 0, 0, 0.2);\n}\n\n/* Ensure all elements inherit proper colors for accessibility */\n.acc-menu * {\n  color: var(--acc-text-color);\n  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;\n  padding: 0;\n  margin: 0;\n  line-height: 1.5 !important;\n  letter-spacing: normal !important;\n}\n\n/* Header section */\n.acc-menu-header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 0 var(--acc-content-inline-padding);\n  height: var(--acc-header-height);\n  font-weight: 700 !important;\n  background-color: var(--acc-primary-color) !important;\n}\n\n.acc-menu-title {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  font-size: 18px !important;\n  color: var(--acc-text-color-inverted) !important;\n  font-weight: bold;\n}\n\n.acc-menu-title .acc-label {\n  color: var(--acc-text-color-inverted) !important;\n}\n\n.acc-menu-title-icon {\n  width: 30px;\n  height: 30px;\n  border-radius: 8px;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  flex-shrink: 0;\n}\n\n.acc-menu-title-icon svg {\n  fill: var(--acc-text-color-inverted) !important;\n  width: 18px !important;\n  height: 18px !important;\n  min-width: 18px !important;\n  min-height: 18px !important;\n  max-width: 18px !important;\n  max-height: 18px !important;\n}\n\n.acc-header-back {\n  display: flex;\n  align-items: center;\n}\n\n.acc-back-btn {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  background: transparent;\n  border: none;\n  padding: 8px;\n  cursor: pointer;\n  font-size: 16px;\n  font-weight: 600;\n  color: var(--acc-text-color-inverted) !important;\n  transition: background-color 0.2s ease;\n  border-radius: 4px;\n  visibility: hidden;\n}\n\n.acc-back-btn > span {\n  color: var(--acc-text-color-inverted) !important;\n}\n\n.acc-back-btn.visible {\n  visibility: visible;\n}\n\n.acc-back-btn:hover {\n  background-color: rgba(255, 255, 255, 0.18);\n}\n\n.acc-back-btn:focus {\n  outline: 2px solid var(--acc-text-color-inverted);\n  outline-offset: 1px;\n}\n\n.acc-back-btn svg {\n  fill: var(--acc-text-color-inverted) !important;\n  width: 24px !important;\n  height: 24px !important;\n}\n\n.acc-menu-title-dynamic {\n  display: none !important;\n}\n\n.acc-menu-title-dynamic.visible {\n  display: block !important;\n}\n\n.acc-menu-title-default {\n  display: block !important;\n}\n\n.acc-menu-title-default.hidden {\n  display: none !important;\n}\n\n.acc-menu-header svg {\n  fill: var(--acc-text-color-inverted) !important;\n  width: 28px !important;\n  height: 28px !important;\n  min-width: 28px !important;\n  min-height: 28px !important;\n  max-width: 28px !important;\n  max-height: 28px !important;\n}\n\n.acc-menu-header > div {\n  display: flex;\n  align-items: center;\n}\n\n/* Interactive elements */\n.acc-menu-header div[role=\"button\"] {\n  cursor: pointer;\n  padding: 8px;\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 36px;\n  height: 36px;\n  transition: background-color 0.2s ease;\n}\n\n.acc-menu-header div[role=\"button\"]:hover {\n  background-color: rgba(255, 255, 255, 0.18);\n}\n\n.acc-menu-header div[role=\"button\"]:focus {\n  outline: 2px solid var(--acc-text-color-inverted);\n  outline-offset: 1px;\n}\n\n.acc-menu-header .acc-header-actions {\n  display: flex;\n  align-items: center;\n}\n\n.acc-language-container {\n  margin: 0 var(--acc-content-inline-padding) 24px;\n}\n\n.acc-lang-details {\n  border: 1px solid rgba(0, 0, 0, 0.1);\n  border-radius: var(--acc-button-border-radius);\n  background: var(--acc-card-bg);\n}\n\n.acc-lang-summary {\n  list-style: none;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 12px;\n  padding: 12px 14px;\n  cursor: pointer;\n  border-radius: var(--acc-button-border-radius);\n}\n\n.acc-lang-summary::-webkit-details-marker {\n  display: none;\n}\n\n.acc-lang-summary::marker {\n  content: '';\n}\n\n.acc-lang-summary-main {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  min-width: 0;\n}\n\n.acc-lang-current-label {\n  font-size: 16px !important;\n  font-weight: 600 !important;\n}\n\n.acc-lang-summary:hover {\n  background-color: rgba(25, 118, 210, 0.06);\n}\n\n.acc-lang-summary:focus {\n  outline: var(--acc-focus-outline-width) solid var(--acc-focus-ring-color);\n  outline-offset: var(--acc-focus-outline-offset);\n}\n\n.acc-lang-summary-arrow {\n  width: 10px;\n  height: 10px;\n  border-right: 2px solid var(--acc-text-color);\n  border-bottom: 2px solid var(--acc-text-color);\n  transform: rotate(-45deg);\n  transition: transform 0.2s ease;\n}\n\n.acc-lang-details[open] .acc-lang-summary-arrow {\n  transform: rotate(45deg);\n}\n\n.acc-lang-details[open] .acc-lang-summary {\n  border-bottom: 1px solid var(--acc-border-color);\n  border-bottom-left-radius: 0;\n  border-bottom-right-radius: 0;\n}\n\n.acc-lang-details-panel {\n  padding: 12px 0 8px;\n}\n\n.acc-lang-details-panel .acc-section-title {\n  font-size: 16px !important;\n  padding: 0 16px 10px;\n}\n\n.acc-lang-flag {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  min-width: 22px;\n  font-size: 18px !important;\n  line-height: 1;\n}\n\n.acc-lang-search-wrapper {\n  padding: 0 16px 8px;\n}\n\n.acc-lang-search {\n  width: 100%;\n  padding: 10px 16px;\n  border: 1.5px solid var(--acc-border-color);\n  border-radius: var(--acc-button-border-radius);\n  font-size: 16px;\n  background-color: var(--acc-card-bg);\n  transition: border-color 0.2s ease;\n}\n\n.acc-lang-search:focus {\n  outline: var(--acc-focus-outline-width) solid var(--acc-focus-ring-color);\n  outline-offset: var(--acc-focus-outline-offset);\n  border-color: var(--acc-primary-color) !important;\n}\n\n.acc-lang-list {\n  padding: 6px 8px 12px;\n  max-height: 280px;\n  overflow-y: auto;\n}\n\n.acc-lang-item {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 8px;\n  width: 100%;\n  text-align: left;\n  padding: 11px 10px;\n  margin-bottom: 4px;\n  background-color: transparent;\n  border: none;\n  border-radius: var(--acc-button-border-radius);\n  cursor: pointer;\n  font-size: 16px;\n  color: var(--acc-text-color);\n  transition: background-color 0.12s ease;\n}\n\n.acc-lang-item:hover {\n  background-color: rgba(25, 118, 210, 0.06);\n}\n\n.acc-lang-item:focus {\n  outline: var(--acc-focus-outline-width) solid var(--acc-focus-ring-color);\n  outline-offset: var(--acc-focus-outline-offset);\n}\n\n.acc-lang-item.selected {\n  background-color: rgba(25, 118, 210, 0.08);\n  font-weight: 600;\n}\n\n.acc-lang-item-main {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  min-width: 0;\n}\n\n.acc-lang-item-label {\n  font-size: 16px !important;\n  line-height: 1.4 !important;\n}\n\n.acc-icon-check {\n  display: inline-block;\n  width: 18px;\n  height: 18px;\n  background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='%23886f60' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12'%3E%3C/polyline%3E%3C/svg%3E\");\n  background-repeat: no-repeat;\n  background-position: center;\n  opacity: 0;\n  transition: opacity 0.15s ease;\n}\n\n.acc-lang-item.selected .acc-icon-check {\n  opacity: 1;\n}\n\n.acc-menu .acc-lang-select {\n  width: 100% !important;\n  padding: 0 16px !important;\n  font-size: 16px !important;\n  font-family: inherit !important;\n  font-weight: 600 !important;\n  border-radius: var(--acc-button-border-radius) !important;\n  background: var(--acc-card-bg) !important;\n  border: 1.5px solid var(--acc-border-color) !important;\n  min-height: 48px !important;\n  max-height: 48px !important;\n  height: 48px !important;\n  color: var(--acc-text-color) !important;\n  -webkit-appearance: none !important;\n  -moz-appearance: none !important;\n  appearance: none !important;\n  background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0%20-960%20960%20960' width='24px' fill='%231f1f1f'%3E%3Cpath d='M480-344%20240-584l56-56%20184 184%20184-184%2056 56-240 240Z'/%3E%3C/svg%3E\") !important;\n  background-repeat: no-repeat !important;\n  background-position: right 12px center !important;\n  background-size: 20px !important;\n  padding-right: 44px !important;\n}\n\n/* Hide default arrows in Firefox and IE */\n.acc-menu .acc-lang-select::-ms-expand {\n  display: none !important;\n}\n\n.acc-menu .acc-lang-select:focus {\n  outline: var(--acc-focus-outline-width) solid var(--acc-focus-ring-color);\n  outline-offset: var(--acc-focus-outline-offset);\n  border-color: var(--acc-primary-color) !important;\n}\n\n/* Option grid layout */\n.acc-options-all {\n  display: flex;\n  flex-direction: column;\n  gap: 16px;\n  padding: 0 var(--acc-content-inline-padding) 12px;\n}\n\n.acc-option-category {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n}\n\n.acc-option-category-interaction {\n  padding-bottom: 12px;\n}\n\n.acc-option-category .acc-section-title {\n  font-size: 14px !important;\n  font-weight: 700 !important;\n  letter-spacing: 0.01em !important;\n  text-transform: none;\n  color: #6b7280 !important;\n  padding: 0 2px;\n}\n\n.acc-options {\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  gap: 12px;\n  margin: 0;\n}\n\n.acc-options-text {\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n}\n\n.acc-options-text-inline {\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n}\n\n.acc-btn.acc-text-inline {\n  min-height: 54px;\n  aspect-ratio: auto;\n  flex-direction: row;\n  align-items: center;\n  justify-content: flex-start;\n  text-align: left;\n  gap: 10px;\n  padding: 12px 14px;\n}\n\n.acc-btn.acc-text-inline .acc-label {\n  font-size: 14px !important;\n  flex: 1 1 auto;\n  min-width: 0;\n}\n\n.acc-btn.acc-text-inline .acc-progress-indicator {\n  margin-top: 0;\n  margin-left: auto;\n  justify-content: flex-end;\n  min-width: 24px;\n}\n\n@media only screen and (max-width: 390px) {\n  .acc-options-text-inline {\n    grid-template-columns: repeat(3, minmax(0, 1fr));\n  }\n\n  .acc-btn.acc-text-inline {\n    min-height: auto;\n    aspect-ratio: 11 / 8;\n    flex-direction: column;\n    align-items: center;\n    justify-content: center;\n    text-align: center;\n    gap: 6px;\n    padding: 10px;\n  }\n\n  .acc-btn.acc-text-inline .acc-label {\n    font-size: 13px !important;\n    flex: 0 1 auto;\n  }\n\n  .acc-btn.acc-text-inline .acc-progress-indicator {\n    margin-top: 8px;\n    margin-left: 0;\n    justify-content: center;\n  }\n}\n\n.acc-tts-toggle-container {\n  margin: 0;\n}\n\n.acc-text-scale-control {\n  width: 100%;\n  background: var(--acc-card-bg) !important;\n  border: 1px solid rgba(0, 0, 0, 0.1) !important;\n  border-radius: var(--acc-border-radius);\n  padding: 12px 14px;\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n}\n\n.acc-text-scale-meta {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n}\n\n.acc-text-scale-icon {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  flex-shrink: 0;\n}\n\n.acc-text-scale-icon svg {\n  width: 22px !important;\n  height: 22px !important;\n  min-width: 22px !important;\n  min-height: 22px !important;\n  max-width: 22px !important;\n  max-height: 22px !important;\n  fill: var(--acc-text-color);\n}\n\n.acc-text-scale-meta .acc-label {\n  font-size: 15px !important;\n  font-weight: 600 !important;\n}\n\n.acc-text-scale-percent {\n  margin-left: auto;\n  font-size: 15px !important;\n  font-weight: 700 !important;\n  color: var(--acc-primary-color) !important;\n}\n\n.acc-text-scale-range {\n  width: 100%;\n  appearance: none;\n  -webkit-appearance: none;\n  background: transparent;\n  height: 20px;\n  cursor: pointer;\n  margin: 0;\n}\n\n.acc-text-scale-range:focus {\n  outline: none;\n}\n\n.acc-text-scale-range::-webkit-slider-runnable-track {\n  width: 100%;\n  height: 4px;\n  border-radius: 999px;\n  background: linear-gradient(\n    to right,\n    var(--acc-primary-color) 0%,\n    var(--acc-primary-color) var(--acc-text-scale-progress, 0%),\n    #d8d8d8 var(--acc-text-scale-progress, 0%),\n    #d8d8d8 100%\n  );\n}\n\n.acc-text-scale-range::-webkit-slider-thumb {\n  appearance: none;\n  -webkit-appearance: none;\n  width: 18px;\n  height: 18px;\n  border-radius: 50%;\n  background: #fff;\n  border: 2px solid var(--acc-primary-color);\n  margin-top: -7px;\n  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);\n}\n\n.acc-text-scale-range::-moz-range-track {\n  width: 100%;\n  height: 4px;\n  border-radius: 999px;\n  background: #d8d8d8;\n}\n\n.acc-text-scale-range::-moz-range-progress {\n  height: 4px;\n  border-radius: 999px;\n  background: var(--acc-primary-color);\n}\n\n.acc-text-scale-range::-moz-range-thumb {\n  width: 18px;\n  height: 18px;\n  border-radius: 50%;\n  background: #fff;\n  border: 2px solid var(--acc-primary-color);\n  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);\n}\n\n.acc-btn.acc-tts-toggle {\n  width: 100%;\n  min-height: 54px;\n  aspect-ratio: auto;\n  flex-direction: row;\n  align-items: center;\n  justify-content: flex-start;\n  gap: 10px;\n  text-align: left;\n  padding: 12px 76px 12px 14px;\n}\n\n.acc-btn.acc-tts-toggle .acc-label {\n  font-size: 15px !important;\n}\n\n.acc-btn.acc-tts-toggle svg {\n  width: 22px !important;\n  height: 22px !important;\n  min-width: 22px !important;\n  min-height: 22px !important;\n  max-width: 22px !important;\n  max-height: 22px !important;\n}\n\n.acc-btn.acc-tts-toggle::before {\n  content: \"\";\n  position: absolute;\n  right: 14px;\n  top: 50%;\n  width: 44px;\n  height: 24px;\n  border-radius: 999px;\n  transform: translateY(-50%);\n  background: #dbd7d2;\n  border: 1px solid rgba(0, 0, 0, 0.08);\n}\n\n.acc-btn.acc-tts-toggle::after {\n  content: \"\";\n  position: absolute;\n  right: 38px;\n  top: 50%;\n  width: 18px;\n  height: 18px;\n  border-radius: 50%;\n  transform: translateY(-50%);\n  background: #fff;\n  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.18);\n}\n\n.acc-btn.acc-tts-toggle.acc-selected::before {\n  background: var(--acc-primary-color);\n  border-color: var(--acc-primary-color);\n}\n\n.acc-btn.acc-tts-toggle.acc-selected::after {\n  right: 16px;\n}\n\n/* Button styling */\n.acc-btn {\n  aspect-ratio: 11 / 8;\n  border-radius: var(--acc-border-radius);\n  padding: 10px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-direction: column;\n  text-align: center;\n  font-size: 15px !important;\n  background: var(--acc-card-bg) !important;\n  border: 1px solid rgba(0, 0, 0, 0.1) !important;\n  transition: background-color 0.2s ease;\n  cursor: pointer;\n  word-break: break-word;\n  gap: 6px;\n  position: relative;\n}\n\n.acc-btn:hover {\n  border-color: var(--acc-hover-color) !important;\n  border-width: 1px !important;\n  box-shadow: inset 0 0 0 1px var(--acc-hover-color);\n}\n\n.acc-btn:focus {\n  outline: var(--acc-focus-outline-width) solid var(--acc-focus-ring-color);\n  outline-offset: var(--acc-focus-outline-offset);\n  border-color: var(--acc-primary-color) !important;\n}\n\n.acc-btn .acc-label, .acc-text-adjust .acc-label div {\n  font-size: 13px !important;\n  font-weight: 600 !important;\n}\n\n/* SVG icons */\n.acc-text-adjust svg {\n  width: 20px !important;\n  height: 20px !important;\n  min-width: 20px !important;\n  min-height: 20px !important;\n  max-width: 20px !important;\n  max-height: 20px !important;\n}\n\n.acc-btn svg {\n  width: 24px !important;\n  height: 24px !important;\n  min-width: 24px !important;\n  min-height: 24px !important;\n  max-width: 24px !important;\n  max-height: 24px !important;\n  fill: var(--acc-text-color);\n}\n\n/* Selected state */\n.acc-btn.acc-selected {\n  background-color: var(--acc-primary-color) !important;\n  border-color: var(--acc-primary-color) !important;\n}\n\n.acc-btn.acc-selected .acc-progress-dot {\n  background-color: rgba(255, 255, 255, 0.5);\n}\n\n.acc-btn.acc-selected .acc-progress-dot.active {\n  background-color: var(--acc-text-color-inverted) !important;\n}\n\n.acc-btn.acc-selected svg,\n.acc-btn.acc-selected span,\n.acc-btn.acc-selected .acc-label {\n  fill: var(--acc-text-color-inverted) !important;\n  color: var(--acc-text-color-inverted) !important;\n}\n\n.acc-btn.acc-tts-toggle.acc-selected {\n  background-color: var(--acc-card-bg) !important;\n  border-color: rgba(0, 0, 0, 0.1) !important;\n}\n\n.acc-btn.acc-tts-toggle.acc-selected svg,\n.acc-btn.acc-tts-toggle.acc-selected span,\n.acc-btn.acc-tts-toggle.acc-selected .acc-label {\n  fill: var(--acc-text-color) !important;\n  color: var(--acc-text-color) !important;\n}\n\n/* Footer section */\n.acc-footer {\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  background: var(--acc-card-bg);\n  padding: 12px 16px;\n  display: flex;\n  flex-direction: column;\n  align-items: stretch;\n  gap: 10px;\n  border-top: 1px solid var(--acc-border-color);\n  z-index: 100;\n  overflow: visible;\n}\n\n.acc-footer-meta {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 12px;\n  width: 100%;\n  flex-wrap: nowrap;\n}\n\n.acc-footer-reset {\n  display: flex;\n  width: 100%;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n  padding: 12px 16px;\n  border: none;\n  border-radius: var(--acc-button-border-radius);\n  background-color: var(--acc-primary-color) !important;\n  cursor: pointer;\n  transition: background-color 0.2s ease;\n  white-space: nowrap;\n}\n\n.acc-footer-reset svg {\n  width: 24px !important;\n  height: 24px !important;\n  fill: var(--acc-text-color-inverted) !important;\n}\n\n.acc-footer-reset .acc-label {\n  font-size: 16px !important;\n  font-weight: 600 !important;\n  color: var(--acc-text-color-inverted) !important;\n  line-height: 1.2 !important;\n}\n\n.acc-footer-reset:hover {\n  background-color: var(--acc-primary-color-dark) !important;\n}\n\n.acc-footer-reset:focus {\n  outline: var(--acc-focus-outline-width) solid var(--acc-focus-ring-color);\n  outline-offset: var(--acc-focus-outline-offset);\n}\n\n.acc-footer a {\n  font-size: 12px !important;\n  text-decoration: none !important;\n  color: #6b7280 !important;\n  background: transparent !important;\n  font-weight: 500 !important;\n  padding: 4px 0;\n  border-radius: 4px;\n  transition: color 0.15s ease;\n  letter-spacing: 0.01em !important;\n  align-self: center;\n  display: inline-flex;\n  align-items: center;\n  white-space: nowrap;\n  line-height: 1.2 !important;\n}\n\n.acc-footer a:hover {\n  text-decoration: none !important;\n  color: var(--acc-primary-color) !important;\n}\n\n.acc-footer a:focus {\n  outline: var(--acc-focus-outline-width) solid var(--acc-focus-ring-color);\n  outline-offset: var(--acc-focus-outline-offset);\n}\n\n.acc-footer-lang-toggle {\n  display: inline-flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 8px;\n  min-width: 84px;\n  padding: 7px 10px 7px 12px;\n  border: 1px solid var(--acc-border-color);\n  border-radius: var(--acc-button-border-radius);\n  background: var(--acc-card-bg);\n  cursor: pointer;\n  transition: border-color 0.2s ease, background-color 0.2s ease;\n}\n\n.acc-footer-lang-toggle:hover {\n  border-color: var(--acc-hover-color);\n}\n\n.acc-footer-lang-toggle:focus {\n  outline: var(--acc-focus-outline-width) solid var(--acc-focus-ring-color);\n  outline-offset: var(--acc-focus-outline-offset);\n}\n\n.acc-footer-lang-current {\n  display: inline-block;\n  min-width: 2ch;\n  text-align: left;\n  font-size: 14px !important;\n  font-weight: 600 !important;\n  line-height: 1 !important;\n}\n\n.acc-footer-lang-arrow {\n  width: 8px;\n  height: 8px;\n  border-right: 2px solid var(--acc-text-color);\n  border-bottom: 2px solid var(--acc-text-color);\n  transform: rotate(45deg) translateY(-1px);\n  transition: transform 0.2s ease;\n}\n\n.acc-footer-lang-toggle[aria-expanded=\"true\"] .acc-footer-lang-arrow {\n  transform: rotate(-135deg) translateY(-1px);\n}\n\n.acc-lang-modal {\n  position: absolute;\n  right: 16px;\n  bottom: calc(100% + 10px);\n  width: min(320px, calc(100% - 32px));\n  border: 1px solid var(--acc-border-color);\n  border-radius: 14px;\n  background: var(--acc-card-bg);\n  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.2);\n  z-index: 120;\n  padding: 10px 0 8px;\n}\n\n.acc-lang-modal[hidden] {\n  display: none;\n}\n\n.acc-lang-modal-header {\n  padding: 0 14px 8px;\n}\n\n.acc-lang-modal .acc-section-title {\n  font-size: 14px !important;\n  font-weight: 700 !important;\n  color: #6b7280 !important;\n}\n\n.acc-lang-modal .acc-lang-search-wrapper {\n  padding: 0 12px 8px;\n}\n\n.acc-lang-modal .acc-lang-list {\n  padding: 6px 8px 8px;\n  max-height: 240px;\n}\n\n/* Content area */\n.acc-menu-content {\n  overflow: auto;\n  max-height: calc(100% - 122px);\n  padding: 24px 0 36px;\n}\n\n/* Text adjustments */\n.acc-text-adjust {\n  background: var(--acc-card-bg);\n  padding: 18px 20px;\n  margin-bottom: 20px;\n  border-radius: var(--acc-border-radius);\n  border: 1px solid rgba(0, 0, 0, 0.1);\n}\n\n.acc-text-adjust .acc-label {\n  display: flex;\n  justify-content: flex-start;\n}\n\n.acc-text-adjust > div {\n  display: flex;\n  justify-content: space-between;\n  margin-top: 20px;\n  align-items: center;\n  font-size: 16px;\n}\n\n.acc-text-adjust .acc-label div {\n  font-size: 16px !important;\n}\n\n.acc-text-adjust div[role=\"button\"] {\n  background: var(--acc-bg-color) !important;\n  border-radius: 50%;\n  width: 40px;\n  height: 40px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  border: 1px solid rgba(0, 0, 0, 0.1);\n  transition: border-color 0.2s ease;\n}\n\n.acc-text-adjust div[role=\"button\"]:hover {\n  border-color: var(--acc-primary-color);\n}\n\n.acc-text-adjust div[role=\"button\"]:focus {\n  outline: var(--acc-focus-outline-width) solid var(--acc-focus-ring-color);\n  outline-offset: var(--acc-focus-outline-offset);\n}\n\n/* Overlay */\n.acc-overlay {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  z-index: calc(var(--acc-widget-z-index, 100000) - 1);\n}\n\n/* Progress indicator */\n.acc-progress-indicator {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  gap: 4px;\n  margin-top: 8px;\n  height: 8px;\n}\n\n.acc-progress-dot {\n  width: 6px;\n  height: 6px;\n  border-radius: 50%;\n  background-color: var(--acc-border-color);\n  transition: background-color 0.2s ease;\n}\n\n.acc-progress-dot.active {\n  background-color: var(--acc-primary-color);\n}\n\n/* Selected state updates indicator colors */\n.acc-btn.acc-selected .acc-progress-dot.active {\n  background-color: var(--acc-bg-color);\n}\n\n/* Responsive adjustments */\n@media only screen and (max-width: 560px) {\n  .acc-menu {\n    width: calc(100vw - (var(--acc-menu-inline-gap, 8px) * 2));\n  }\n}\n\n@media only screen and (max-width: 420px) {\n  .acc-options {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n    gap: 12px;\n  }\n  .acc-btn {\n    padding: 8px;\n  }\n}\n\n/* Ensure proper focus visibility for assistive technology */\n@media (prefers-reduced-motion: reduce) {\n  .acc-menu,\n  .acc-btn,\n  .acc-lang-select,\n  .acc-progress-dot,\n  .acc-menu-header div[role=\"button\"],\n  .acc-lang-toggle,\n  .acc-back-btn,\n  .acc-footer-reset,\n  .acc-footer-lang-toggle,\n  .acc-footer-lang-arrow,\n  .acc-text-adjust div[role=\"button\"] {\n    transition: none;\n  }\n}\n";

    var widgetCSS = "  /* Base styles for the widget */\n  .acc-widget, .acc-menu {\n    -webkit-user-select: none;\n    -moz-user-select: none;\n    -ms-user-select: none;\n    user-select: none;\n    font-weight: 400;\n    -webkit-font-smoothing: antialiased;\n  }\n  \n  .acc-widget *, .acc-menu * { \n    box-sizing: border-box !important; \n  }\n  \n  /* Accessibility toggle button */\n  .acc-toggle-btn {\n    position: fixed;\n    z-index: var(--acc-widget-z-index, 100000);\n    left: 30px;\n    bottom: 30px;\n    border-radius: 50%;\n    align-items: center;\n    justify-content: center;\n    width: var(--acc-button-size, 48px);\n    height: var(--acc-button-size, 48px);\n    display: flex;\n    cursor: pointer;\n    outline: none !important;\n    border: none !important;\n    box-shadow: inset 0 0 0 4px var(--acc-primary-color, #1976d2), inset 0 0 0 6px white, 0 2px 5px rgba(0,0,0,0.2) !important;\n    background: var(--acc-primary-color, #1976d2) !important;\n    transition: transform 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;\n    overflow: visible;\n  }\n  \n  .acc-toggle-btn svg {\n    width: 60%;\n    height: 60%;\n    fill: white;\n    transition: none;\n  }\n  \n  .acc-toggle-btn:hover {\n    transform: scale(1.12);\n  }\n\n  .acc-toggle-btn::before,\n  .acc-toggle-btn::after {\n    content: \"\";\n    position: absolute;\n    top: 50%;\n    left: 50%;\n    width: 44%;\n    height: 2.6px;\n    border-radius: 999px;\n    background: var(--acc-text-color-inverted, #fff);\n    opacity: 0;\n    pointer-events: none;\n    transform: translate(-50%, -50%) rotate(0deg);\n    transition: none;\n  }\n\n  .acc-toggle-btn[aria-expanded=\"true\"] {\n    background: var(--acc-primary-color, #1976d2) !important;\n    box-shadow: inset 0 0 0 4px var(--acc-primary-color, #1976d2), inset 0 0 0 6px white, 0 6px 14px rgba(0, 0, 0, 0.24) !important;\n  }\n\n  .acc-toggle-btn[aria-expanded=\"true\"] svg {\n    opacity: 0;\n  }\n\n  .acc-toggle-btn[aria-expanded=\"true\"]::before,\n  .acc-toggle-btn[aria-expanded=\"true\"]::after {\n    opacity: 1;\n  }\n\n  .acc-toggle-btn[aria-expanded=\"true\"]::before {\n    transform: translate(-50%, -50%) rotate(45deg);\n  }\n\n  .acc-toggle-btn[aria-expanded=\"true\"]::after {\n    transform: translate(-50%, -50%) rotate(-45deg);\n  }\n\n  .acc-violation-bubble {\n    position: absolute;\n    top: -8px;\n    right: -8px;\n    min-width: 24px;\n    height: 24px;\n    border-radius: 12px;\n    font-size: 11px;\n    font-weight: 700;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    padding: 0 4px;\n    pointer-events: none;\n    z-index: 1;\n    color: #fff;\n    border: none;\n    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);\n  }\n\n  .acc-violation-bubble[data-severity=\"critical\"] {\n    background: #fbc02c;\n    color: #222;\n  }\n\n  .acc-violation-bubble[data-severity=\"serious\"] {\n    background: #ffab32;\n    color: #222;\n  }\n\n  .acc-violation-bubble[data-severity=\"moderate\"] {\n    background: #fbc02c;\n    color: #000;\n  }\n\n  .acc-violation-bubble[hidden] {\n    display: none;\n  }\n\n  .acc-toggle-btn:focus {\n    outline: none !important;\n  }\n\n  .acc-toggle-btn:focus-visible {\n    outline: 3px solid var(--acc-primary-color, #1976d2) !important;\n    outline-offset: 2px;\n  }\n\n  body.acc-tts-click-mode :is(h1, h2, h3, h4, h5, h6, p, li, dt, dd, blockquote, figcaption, caption, th, td, div, section):not(.acc-container *):hover {\n    cursor: pointer;\n  }\n\n  .acc-tts-active-block {\n    outline: 2px solid var(--acc-primary-color, #1976d2) !important;\n    outline-offset: 3px !important;\n    border-radius: 4px;\n  }\n  \n  @media (prefers-reduced-motion: reduce) {\n    .acc-toggle-btn {\n      transition: none;\n    }\n\n    .acc-toggle-btn svg,\n    .acc-toggle-btn::before,\n    .acc-toggle-btn::after {\n      transition: none;\n    }\n  }\n";

    var reportCSS = ".acc-report-panel {\n  display: none;\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  z-index: calc(var(--acc-widget-z-index, 100000) + 10);\n  font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif;\n}\n.acc-report-panel.acc-report-visible {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.acc-report-overlay {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: rgba(0, 0, 0, 0.6);\n}\n.acc-report-dialog {\n  position: relative;\n  background: #fff;\n  border-radius: 12px;\n  width: 90%;\n  max-width: 800px;\n  max-height: 85vh;\n  display: flex;\n  flex-direction: column;\n  box-shadow: 0 20px 60px rgba(0,0,0,0.3);\n}\n.acc-report-header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 16px 20px;\n  border-bottom: 1px solid #e0e0e0;\n}\n.acc-report-title {\n  margin: 0;\n  font-size: 18px;\n  font-weight: 600;\n  color: #1a1a1a;\n}\n.acc-report-close {\n  background: none;\n  border: none;\n  padding: 8px;\n  cursor: pointer;\n  border-radius: 6px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.acc-report-close:hover {\n  background: #f0f0f0;\n}\n.acc-report-close svg {\n  width: 20px;\n  height: 20px;\n  fill: #666;\n}\n.acc-report-status {\n  padding: 8px 20px;\n  font-size: 14px;\n  color: #666;\n  background: #f8f9fa;\n}\n.acc-report-content {\n  flex: 1;\n  overflow-y: auto;\n  padding: 16px 20px;\n}\n.acc-report-loading {\n  text-align: center;\n  padding: 40px;\n  color: #666;\n}\n.acc-report-error {\n  color: #d32f2f;\n  padding: 20px;\n  text-align: center;\n}\n.acc-report-summary {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));\n  gap: 12px;\n  margin-bottom: 20px;\n}\n.acc-report-stat {\n  background: #f8f9fa;\n  border-radius: 8px;\n  padding: 16px;\n  text-align: center;\n}\n.acc-report-stat-value {\n  font-size: 28px;\n  font-weight: 700;\n  display: block;\n}\n.acc-report-stat-label {\n  font-size: 12px;\n  color: #666;\n  text-transform: uppercase;\n  margin-top: 4px;\n}\n.acc-report-stat.critical .acc-report-stat-value { color: #d32f2f; }\n.acc-report-stat.serious .acc-report-stat-value { color: #f57c00; }\n.acc-report-stat.moderate .acc-report-stat-value { color: #fbc02d; }\n.acc-report-stat.minor .acc-report-stat-value { color: #7cb342; }\n.acc-report-stat.passed .acc-report-stat-value { color: #43a047; }\n.acc-report-section {\n  margin-bottom: 20px;\n}\n.acc-report-section-title {\n  font-size: 14px;\n  font-weight: 600;\n  color: #333;\n  margin-bottom: 12px;\n  padding-bottom: 8px;\n  border-bottom: 2px solid #e0e0e0;\n}\n.acc-report-violation {\n  background: #fff;\n  border: 1px solid #e0e0e0;\n  border-radius: 8px;\n  margin-bottom: 12px;\n  overflow: hidden;\n}\n.acc-report-violation-header {\n  padding: 12px 16px;\n  background: #f8f9fa;\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  gap: 12px;\n}\n.acc-report-violation-header:hover {\n  background: #f0f0f0;\n}\n.acc-report-violation-impact {\n  font-size: 11px;\n  font-weight: 600;\n  text-transform: uppercase;\n  padding: 4px 8px;\n  border-radius: 4px;\n  color: #fff;\n}\n.acc-report-violation-impact.critical { background: #d32f2f; }\n.acc-report-violation-impact.serious { background: #f57c00; }\n.acc-report-violation-impact.moderate { background: #fbc02d; color: #333; }\n.acc-report-violation-impact.minor { background: #7cb342; }\n.acc-report-violation-title {\n  flex: 1;\n  font-weight: 500;\n  color: #333;\n}\n.acc-report-violation-count {\n  font-size: 12px;\n  color: #666;\n  background: #e0e0e0;\n  padding: 2px 8px;\n  border-radius: 12px;\n}\n.acc-report-violation-details {\n  display: none;\n  padding: 16px;\n  border-top: 1px solid #e0e0e0;\n}\n.acc-report-violation.expanded .acc-report-violation-details {\n  display: block;\n}\n.acc-report-violation-desc {\n  color: #666;\n  font-size: 14px;\n  margin-bottom: 12px;\n}\n.acc-report-violation-help {\n  font-size: 13px;\n  margin-bottom: 12px;\n}\n.acc-report-violation-help a {\n  color: #1976d2;\n}\n.acc-report-node {\n  background: #f8f9fa;\n  border-radius: 6px;\n  padding: 12px;\n  margin-top: 8px;\n}\n.acc-report-node-html {\n  font-family: monospace;\n  font-size: 12px;\n  background: #263238;\n  color: #80cbc4;\n  padding: 8px 12px;\n  border-radius: 4px;\n  overflow-x: auto;\n  white-space: pre-wrap;\n  word-break: break-all;\n}\n.acc-report-node-fix {\n  margin-top: 8px;\n  font-size: 13px;\n  color: #333;\n}\n.acc-report-node-fix strong {\n  color: #1976d2;\n}\n.acc-report-success {\n  text-align: center;\n  padding: 40px;\n}\n.acc-report-success-icon {\n  width: 64px;\n  height: 64px;\n  background: #43a047;\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  margin: 0 auto 16px;\n}\n.acc-report-success-icon svg {\n  width: 32px;\n  height: 32px;\n  fill: #fff;\n}\n.acc-report-footer {\n  padding: 12px 20px;\n  border-top: 1px solid #e0e0e0;\n  text-align: center;\n}\n.acc-report-powered {\n  font-size: 12px;\n  color: #999;\n}\n@media (max-width: 600px) {\n  .acc-report-dialog {\n    width: 95%;\n    max-height: 90vh;\n  }\n  .acc-report-summary {\n    grid-template-columns: repeat(2, 1fr);\n  }\n}\n";

    var readingGuideCSS = ".acc-rg {\n  position: fixed;\n  left: 0;\n  right: 0;\n  width: 100%;\n  pointer-events: none;\n  background-color: rgba(0, 0, 0, 0.4);\n  z-index: calc(var(--acc-widget-z-index, 100000) + 1);\n}\n.acc-rg-top {\n  top: 0;\n}\n.acc-rg-bottom {\n  bottom: 0;\n}\n/* Softer overlay when high contrast is active */\nbody.acc-high-contrast-mode .acc-rg {\n  background-color: rgba(0, 0, 0, 0.25);\n}\n";

    var skipLinkCSS = ".acc-skip-link {\n  font-family: inherit;\n  position: fixed;\n  top: 16px;\n  left: 16px;\n  background: var(--acc-card-bg, #ffffff);\n  color: var(--acc-text-color, #222222);\n  border: 3px solid var(--acc-primary-color, #1976d2);\n  border-radius: var(--acc-button-border-radius, 0.4rem);\n  padding: 8px 16px;\n  z-index: calc(var(--acc-widget-z-index, 100000) + 2);\n  transform: translateY(-140%);\n  opacity: 0;\n  pointer-events: none;\n  transition: transform 0.2s ease, opacity 0.2s ease;\n  font-size: 16px;\n  line-height: 1.2;\n  font-weight: 600;\n  background-clip: padding-box;\n}\n.acc-skip-link:focus,\n.acc-skip-link:active {\n  transform: translateY(0);\n  opacity: 1;\n  pointer-events: auto;\n  outline: var(--acc-focus-outline-width, 3px) solid var(--acc-focus-ring-color, #1976d2);\n  outline-offset: var(--acc-focus-outline-offset, 2px);\n}\n";

    var annotationsCSS = ".acc-annotation-layer {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 0;\n  height: 0;\n  z-index: calc(var(--acc-widget-z-index, 100000) + 5);\n  pointer-events: none;\n}\n\n.acc-annotation-marker {\n  position: absolute;\n  width: 20px;\n  height: 20px;\n  border: none;\n  border-radius: 999px;\n  color: #fff;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35);\n  cursor: pointer;\n  pointer-events: auto;\n  transform: translate(-40%, -50%);\n}\n\n.acc-annotation-marker svg {\n  width: 12px;\n  height: 12px;\n  fill: currentColor;\n}\n\n.acc-annotation-marker[data-impact=\"critical\"] {\n  background: #b71c1c;\n}\n\n.acc-annotation-marker[data-impact=\"serious\"] {\n  background: #d84315;\n}\n\n.acc-annotation-marker[data-impact=\"moderate\"] {\n  background: #ef6c00;\n}\n\n.acc-annotation-marker[data-impact=\"minor\"] {\n  background: #1565c0;\n}\n\n.acc-annotation-popup {\n  position: absolute;\n  width: min(320px, 92vw);\n  background: #fff;\n  color: #1a1a1a;\n  border: 1px solid #d7d7d7;\n  border-radius: 10px;\n  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.24);\n  padding: 12px;\n  pointer-events: auto;\n}\n\n.acc-annotation-popup-header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 10px;\n}\n\n.acc-annotation-popup-title {\n  margin: 0;\n  font-size: 14px;\n  line-height: 1.3;\n}\n\n.acc-annotation-popup-close {\n  border: 0;\n  background: transparent;\n  padding: 2px;\n  width: 24px;\n  height: 24px;\n  color: #444;\n  cursor: pointer;\n}\n\n.acc-annotation-popup-close svg {\n  width: 20px;\n  height: 20px;\n  fill: currentColor;\n}\n\n.acc-annotation-popup p {\n  margin: 8px 0;\n  font-size: 13px;\n  line-height: 1.45;\n}\n\n.acc-annotation-popup a {\n  color: #0d47a1;\n  font-weight: 600;\n  text-decoration: underline;\n}\n";

    const STATIC_STYLE_ID = 'acc-static-styles';
    const STATIC_STYLES = [
      menuCSS,
      widgetCSS,
      reportCSS,
      readingGuideCSS,
      skipLinkCSS,
      annotationsCSS
    ].join('\n');

    /** @typedef {import('./index.js').default} AccessibleWebWidget */

    /** @type {{ [methodName: string]: (this: AccessibleWebWidget, ...args: any[]) => any }} */
    const styleMethods = {

      findElement(selector, parent = document) {
        try {
          return parent.querySelector(selector);
        } catch (e) {
          console.warn(`Failed to query selector: ${selector}`, e);
          return null;
        }
      },

      injectStyle(id, css) {
        if (!css || typeof document === 'undefined') return;
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
      },

      createCSS(styles) {
        let css = "";
        if (!styles) return css;
        const browserPrefixes = ['-o-', '-ms-', '-moz-', '-webkit-', ''];
        const prefixedProperties = ['filter'];
        for (let key in styles) {
          if (!Object.prototype.hasOwnProperty.call(styles, key)) continue;
          let prefixes = prefixedProperties.includes(key) ? browserPrefixes : [""];
          prefixes.forEach(prefix => {
            css += `${prefix}${key}:${styles[key]} !important;`;
          });
        }
        return css;
      },

      wrapCSS(selector, childrenSelector, css) {
        let output = "";
        childrenSelector.forEach(child => {
          output += `${selector} ${child}{${css}}`;
        });
        return output;
      },

      buildCSS(config) {
        if (!config) return "";
        let output = "";
        output += this.createCSS(config.styles || {});
        if (output.length && config.selector) {
          output = this.wrapCSS(config.selector, config.childrenSelector || [""], output);
        }
        output += config.css || "";
        return output;
      },

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
      },

      applyThemeVariables() {
        if (typeof document === 'undefined') return;

        const vars = {
          '--acc-primary-color': this.widgetTheme.primaryColor,
          '--acc-primary-color-light': this.widgetTheme.primaryColorLight,
          '--acc-primary-color-dark': this.widgetTheme.primaryColorDark,
          '--acc-bg-color': this.widgetTheme.backgroundColor,
          '--acc-text-color': this.widgetTheme.textColor,
          '--acc-text-color-inverted': this.widgetTheme.textColorInverted,
          '--acc-card-bg': this.widgetTheme.cardBackground,
          '--acc-border-color': this.widgetTheme.borderColor,
          '--acc-focus-ring-color': this.widgetTheme.focusRingColor,
          '--acc-hover-color': this.widgetTheme.hoverColor,
          '--acc-active-color': this.widgetTheme.activeColor,
          '--acc-border-radius': this.widgetTheme.borderRadius,
          '--acc-button-border-radius': this.widgetTheme.buttonBorderRadius,
          '--acc-header-height': this.widgetTheme.headerHeight,
          '--acc-focus-outline-width': this.widgetTheme.focusBorderWidth,
          '--acc-focus-outline-offset': this.widgetTheme.focusOutlineOffset,
          '--acc-widget-z-index': String(this.widgetTheme.zIndex),
          '--acc-button-size': this.widgetTheme.buttonSize
        };

        Object.entries(vars).forEach(([key, value]) => {
          document.documentElement.style.setProperty(key, value);
        });
      },

      registerStaticStyles() {
        if (this.staticStylesRegistered) return;
        this.injectStyle(STATIC_STYLE_ID, STATIC_STYLES);
        this.staticStylesRegistered = true;
      }

    };

    /** @typedef {import('./index.js').default} AccessibleWebWidget */

    const AXE_CORE_VERSION = '4.11.1';
    const AXE_CORE_SRC = `https://cdn.jsdelivr.net/npm/axe-core@${AXE_CORE_VERSION}/axe.min.js`;
    const AXE_CORE_INTEGRITY = 'sha384-wb3zgvLcZeMFSec08dk7g8K8yDFFAX2uNKVwOUuowwc/wIfE2t6XVUjTEgPrOJCS';
    const AXE_RUN_OPTIONS = {
      runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice']
    };
    const MAX_ANNOTATIONS = 50;
    const SYSTEM_PREFERS_REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

    /** @type {{ [methodName: string]: (this: AccessibleWebWidget, ...args: any[]) => any }} */
    const featureMethods = {

      getContrastToggleDisplay(index) {
          if (index === 0) {
            return { key: 'light-contrast', label: 'Light', icon: this.widgetIcons.lightContrast };
          }
          if (index === 1) {
            return { key: 'dark-contrast', label: 'Dark', icon: this.widgetIcons.darkContrast };
          }
          return { key: null, label: 'Contrast', icon: this.widgetIcons.contrast };
        },

      updateContrastToggleButton(button, index) {
          if (!button) return;
          const display = this.getContrastToggleDisplay(index);
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
          button.setAttribute('data-contrast-mode', display.key || 'off');
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
          if (!button) return;
          const display = this.getSaturationToggleDisplay(index);
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
          button.setAttribute('data-saturation-mode', display.key || 'off');
        },

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
      
          document.body.insertBefore(button, document.body.firstChild);
          this.skipLinkElement = button;
          return button;
        },

      updateSkipLinkLabel() {
          if (!this.skipLinkElement) return;
          const key = this.skipLinkElement.getAttribute('data-acc-text') || 'Skip to accessibility menu';
          const label = this.translate(key);
          this.skipLinkElement.textContent = label;
          this.skipLinkElement.setAttribute('aria-label', label);
        },

      shouldSkipScaling(element) {
          return element.closest('.acc-menu, .acc-container, .acc-widget');
        },

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
        },

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
        },

      disconnectTextScaleObserver() {
          if (!this.textScaleObserver) return;
          this.textScaleObserver.disconnect();
          this.textScaleObserver = null;
        },

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
        },

      clampTextScalePercent(percent) {
          const min = Number(this.textScaleMinPercent) || 80;
          const max = Number(this.textScaleMaxPercent) || 150;
          const step = Number(this.textScaleStepPercent) || 5;
          const numeric = Number(percent);
          if (!Number.isFinite(numeric)) return 100;
          const snapped = Math.round((numeric - min) / step) * step + min;
          return Math.min(max, Math.max(min, snapped));
        },

      getTextScalePercent(scaleValue = 1) {
          if (scaleValue === false || scaleValue === null || typeof scaleValue === 'undefined') {
            return this.clampTextScalePercent(100);
          }
          const numeric = Number(scaleValue);
          if (!Number.isFinite(numeric)) {
            return this.clampTextScalePercent(100);
          }
          if (numeric <= 0) {
            return this.clampTextScalePercent(100);
          }
          const percent = numeric > 10 ? numeric : numeric * 100;
          return this.clampTextScalePercent(percent);
        },

      syncTextScaleControlUI(menu, scaleValue = 1) {
          if (!menu || !menu.querySelector) return;
          const range = menu.querySelector('.acc-text-scale-range');
          const label = menu.querySelector('.acc-text-scale-percent');
          const percent = this.getTextScalePercent(scaleValue);
          if (range) {
            const min = Number(this.textScaleMinPercent) || 80;
            const max = Number(this.textScaleMaxPercent) || 150;
            const progress = ((percent - min) / (max - min)) * 100;
            range.value = String(percent);
            range.style.setProperty('--acc-text-scale-progress', `${Math.max(0, Math.min(100, progress))}%`);
          }
          if (label) {
            label.textContent = `${percent}%`;
          }
        },

      setTextScaleFromPercent(percent, options = {}) {
          const shouldPersist = options.persist !== false;
          const clampedPercent = this.clampTextScalePercent(percent);
          const multiplier = Number((clampedPercent / 100).toFixed(2));
          const exactIndex = this.textScaleValues.indexOf(multiplier);

          if (this.multiLevelFeatures['text-scale']) {
            this.multiLevelFeatures['text-scale'].currentIndex = exactIndex;
          }

          if (exactIndex > -1) {
            this.textScaleIndex = exactIndex;
          } else {
            let nearestIndex = 0;
            let minDistance = Infinity;
            this.textScaleValues.forEach((value, index) => {
              const distance = Math.abs(value - multiplier);
              if (distance < minDistance) {
                minDistance = distance;
                nearestIndex = index;
              }
            });
            this.textScaleIndex = nearestIndex;
          }

          this.scaleText(multiplier);

          if (shouldPersist) {
            this.updateState({ 'text-scale': multiplier });
          }

          return multiplier;
        },

      enableBoldText(enable = false) {
          const config = {
            id: "bold-text",
            selector: "html",
            childrenSelector: ['', '*:not(.material-icons,.acc-menu,.acc-menu *, .acc-widget, .acc-widget *)'],
            styles: { 'font-weight': '700' }
          };
          this.applyToolStyle({ ...config, enable });
        },

      adjustLetterSpacing(enable = false) {
          const config = {
            id: "letter-spacing",
            selector: "html",
            childrenSelector: ['', '*:not(.material-icons,.acc-menu,.acc-menu *, .acc-widget, .acc-widget *)'],
            styles: { 'letter-spacing': '2px' }
          };
          this.applyToolStyle({ ...config, enable });
        },

      adjustLineSpacing(enable = false) {
          const config = {
            id: "line-spacing",
            selector: "html",
            childrenSelector: ['', '*:not(.material-icons,.acc-menu,.acc-menu *, .acc-widget, .acc-widget *)'],
            styles: { 'line-height': '3' }
          };
          this.applyToolStyle({ ...config, enable });
        },

      enableLargePointer(enable = false) {
          const config = {
            id: "large-pointer",
            selector: "body",
            childrenSelector: ['*'],
            styles: {
              'cursor': `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='98px' height='98px' viewBox='0 0 48 48'%3E%3Cpath fill='%23FFFFFF' d='M27.8 39.7c-.1 0-.2 0-.4-.1s-.4-.3-.6-.5l-3.7-8.6-4.5 4.2c-.1.2-.3.3-.6.3-.1 0-.3 0-.4-.1-.3-.1-.6-.5-.6-.9V12c0-.4.2-.8.6-.9.1-.1.3-.1.4-.1.2 0 .5.1.7.3l16 15c.3.3.4.7.3 1.1-.1.4-.5.6-.9.7l-6.3.6 3.9 8.5c.1.2.1.5 0 .8-.1.2-.3.5-.5.6l-2.9 1.3c-.2-.2-.4-.2-.5-.2z'/%3E%3Cpath fill='%23212121' d='m18 12 16 15-7.7.7 4.5 9.8-2.9 1.3-4.3-9.9L18 34V12m0-2c-.3 0-.5.1-.8.2-.7.3-1.2 1-1.2 1.8v22c0 .8.5 1.5 1.2 1.8.3.2.6.2.8.2.5 0 1-.2 1.4-.5l3.4-3.2 3.1 7.3c.2.5.6.9 1.1 1.1.2.1.5.1.7.1.3 0 .5-.1.8-.2l2.9-1.3c.5-.2.9-.6 1.1-1.1.2-.5.2-1.1 0-1.5l-3.3-7.2 4.9-.4c.8-.1 1.5-.6 1.7-1.3.3-.7.1-1.6-.5-2.1l-16-15c-.3-.5-.8-.7-1.3-.7z'/%3E%3C/svg%3E") 40 15, auto`
            }
          };
          this.applyToolStyle({ ...config, enable });
        },

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
      },

      highlightTitles(enable = false) {
          const config = {
            id: "highlight-title",
            selector: "html",
            childrenSelector: this.targetSelectors.HEADERS,
            styles: { 'outline': `3px solid ${this.widgetTheme.primaryColor}`, 'outline-offset': '2px' }
          };
          this.applyToolStyle({ ...config, enable });
        },

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
        },

      enableReadableText(enable = false) {
          const shouldEnable = !!enable;
          if (shouldEnable) {
            this.ensureReadableFontLoaded();
          }
          // Exclude widget elements and common icon classes
          const iconExclusions = [
            ':not(.acc-widget)',
            ':not(.acc-menu)',
            ':not(.acc-container)',
            ':not(.material-icons)',
            ':not(.material-icons-outlined)',
            ':not(.material-icons-round)',
            ':not(.material-symbols-outlined)',
            ':not(.material-symbols-rounded)',
            ':not(.fa)',
            ':not(.fas)',
            ':not(.far)',
            ':not(.fab)',
            ':not(.fa-solid)',
            ':not(.fa-regular)',
            ':not(.fa-brands)',
            ':not(.glyphicon)',
            ':not(.icon)',
            ':not(.icons)',
            ':not([class*="icon-"])',
            ':not([data-icon])'
          ].join('');
          const exclusionSuffix = iconExclusions;
          const readableSelectors = [
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
        },

      pauseMotion(enable = false) {
        const config = {
          id: "pause-motion",
          selector: "html",
          childrenSelector: ['*'],
          styles: { 'transition': 'none', 'animation-fill-mode': 'forwards', 'animation-iteration-count': '1', 'animation-duration': '.01s' }
        };
        this.applyToolStyle({ ...config, enable });
      },

      enableHighContrastMode(enable = false) {
        const X = ':not(.acc-container):not(.acc-container *):not(.acc-rg-container):not(.acc-rg-container *)';
        const config = {
          id: 'high-contrast-mode',
          css: `
        /* ── Base: force black on white ── */
        body.acc-high-contrast-mode *${X} {
          color: #000 !important;
          background-color: #fff !important;
          background-image: none !important;
          text-shadow: none !important;
          box-shadow: none !important;
        }

        body.acc-high-contrast-mode {
          background: #fff !important;
        }

        /* ── Borders: solid and visible ── */
        body.acc-high-contrast-mode *${X} {
          border-color: #000 !important;
        }

        /* ── Links: underlined, distinct color ── */
        body.acc-high-contrast-mode a${X} {
          color: #00e !important;
          text-decoration: underline !important;
        }

        body.acc-high-contrast-mode a:visited${X} {
          color: #551a8b !important;
        }

        /* ── Headings: bold black ── */
        body.acc-high-contrast-mode :where(h1,h2,h3,h4,h5,h6)${X} {
          color: #000 !important;
          font-weight: 700 !important;
        }

        /* ── Images: keep visible, add border ── */
        body.acc-high-contrast-mode img${X} {
          border: 1px solid #000 !important;
        }

        /* ── Inputs & buttons: high-contrast borders ── */
        body.acc-high-contrast-mode :where(input, textarea, select, button)${X} {
          border: 2px solid #000 !important;
          background: #fff !important;
          color: #000 !important;
        }

        /* ── Focus rings: thick, high-visibility ── */
        body.acc-high-contrast-mode :focus-visible${X} {
          outline: 3px solid #000 !important;
          outline-offset: 2px !important;
        }

        /* ── Tables: visible cell borders ── */
        body.acc-high-contrast-mode :where(table, th, td)${X} {
          border: 1px solid #000 !important;
        }
      `
        };
        this.applyToolStyle({ ...config, enable });
        document.body?.classList.toggle('acc-high-contrast-mode', !!enable);
      },

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
      },

      loadAxeCore() {
        if (this.axeCoreLoaded && window.axe) {
          return Promise.resolve(window.axe);
        }
      
        if (this.axeCorePromise) {
          return this.axeCorePromise;
        }
      
        this.axeCoreLoading = true;
        this.axeCorePromise = new Promise((resolve, reject) => {
          let script = document.querySelector('script[data-acc-axe-core="true"]');
          let settled = false;
          let timeoutId = null;
      
          const settleSuccess = () => {
            if (settled) return;
            settled = true;
            if (timeoutId) clearTimeout(timeoutId);
            if (!window.axe) {
              this.axeCoreLoading = false;
              this.axeCoreLoaded = false;
              this.axeCorePromise = null;
              reject(new Error('axe-core loaded but window.axe is unavailable'));
              return;
            }
            this.axeCoreLoading = false;
            this.axeCoreLoaded = true;
            if (script) {
              script.setAttribute('data-acc-axe-core-loaded', 'true');
            }
            resolve(window.axe);
          };
      
          const settleError = (error) => {
            if (settled) return;
            settled = true;
            if (timeoutId) clearTimeout(timeoutId);
            this.axeCoreLoading = false;
            this.axeCoreLoaded = false;
            this.axeCorePromise = null;
            reject(error);
          };
      
          if (window.axe) {
            settleSuccess();
            return;
          }
      
          if (script && !script.src.includes(`/axe-core@${AXE_CORE_VERSION}/`)) {
            script.remove();
            script = null;
          }

          if (!script) {
            script = document.createElement('script');
            script.src = AXE_CORE_SRC;
            script.async = true;
            script.integrity = AXE_CORE_INTEGRITY;
            script.crossOrigin = 'anonymous';
            script.setAttribute('data-acc-axe-core', 'true');
            document.head.appendChild(script);
          }
      
          script.addEventListener('load', settleSuccess, { once: true });
          script.addEventListener('error', () => settleError(new Error('Failed to load axe-core')), { once: true });
          timeoutId = setTimeout(() => {
            settleError(new Error('Timed out loading axe-core'));
          }, 15000);
        });
      
        return this.axeCorePromise;
      },

      getAxeRunOptions() {
        return { ...AXE_RUN_OPTIONS };
      },

      getViolationCounts(results = {}) {
        const counts = { critical: 0, serious: 0, moderate: 0, minor: 0 };
        const violations = Array.isArray(results.violations) ? results.violations : [];
        violations.forEach((violation) => {
          const impact = violation?.impact;
          if (impact && counts[impact] !== undefined) {
            counts[impact] += Array.isArray(violation.nodes) ? violation.nodes.length : 0;
          }
        });
        return counts;
      },

      updateViolationBubble(results = null) {
        const bubble = this.violationBubble || this.findElement('.acc-violation-bubble');
        if (!bubble) return;

        const counts = this.getViolationCounts(results || this.axeScanResults || {});
        const devMode = this.isDevMode();

        let displayCount = 0;
        let severity = '';

        if (counts.critical > 0) {
          displayCount = counts.critical;
          severity = 'critical';
        } else if (devMode && counts.serious > 0) {
          displayCount = counts.serious;
          severity = 'serious';
        } else if (devMode && counts.moderate > 0) {
          displayCount = counts.moderate;
          severity = 'moderate';
        }

        if (displayCount <= 0) {
          bubble.textContent = '';
          bubble.hidden = true;
          bubble.removeAttribute('data-severity');
          return;
        }

        bubble.hidden = false;
        bubble.dataset.severity = severity;
        bubble.textContent = displayCount > 99 ? '99+' : String(displayCount);
      },

      async runBackgroundAxeScan({ force = false } = {}) {
        if (!force && this.axeScanResults) {
          this.updateViolationBubble(this.axeScanResults);
          return this.axeScanResults;
        }

        if (!force && this.axeScanPromise) {
          return this.axeScanPromise;
        }

        this.axeScanPromise = (async () => {
          try {
            const axe = await this.loadAxeCore();
            const results = await axe.run(document, this.getAxeRunOptions());
            this.axeScanResults = results;
            this.updateViolationBubble(results);
            return results;
          } catch (error) {
            this.updateViolationBubble({ violations: [] });
            throw error;
          } finally {
            this.axeScanPromise = null;
          }
        })();

        return this.axeScanPromise;
      },

      ensureMediaQuery(query) {
        if (!query || typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
          return null;
        }
        if (!this.systemPreferenceMediaQueries) {
          this.systemPreferenceMediaQueries = {};
        }
        if (!this.systemPreferenceMediaQueries[query]) {
          this.systemPreferenceMediaQueries[query] = window.matchMedia(query);
        }
        return this.systemPreferenceMediaQueries[query];
      },

      applySystemMotionPreference(shouldEnable) {
        this.loadConfig();
        if (this.hasExplicitStatePreference('pause-motion')) {
          return false;
        }

        const currentValue = !!this.retrieveState('pause-motion');
        if (currentValue === shouldEnable && this.isSystemControlledPreference('pause-motion')) {
          return false;
        }

        this.updateState({ 'pause-motion': shouldEnable }, { source: 'system' });
        return true;
      },

      detectSystemPreferences() {
        if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;

        const reducedMotionQuery = this.ensureMediaQuery(SYSTEM_PREFERS_REDUCED_MOTION);
        const shouldPauseMotion = !!reducedMotionQuery?.matches;
        const motionChanged = this.applySystemMotionPreference(shouldPauseMotion);

        if (motionChanged) {
          this.applyEnhancements();
        }
      },

      clearSystemPreferenceListeners() {
        const listeners = Array.isArray(this.systemPreferenceListeners) ? this.systemPreferenceListeners : [];
        listeners.forEach((remove) => {
          if (typeof remove === 'function') {
            remove();
          }
        });
        this.systemPreferenceListeners = [];
      },

      setupMediaQueryListeners() {
        this.clearSystemPreferenceListeners();
        if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;

        const reducedMotionQuery = this.ensureMediaQuery(SYSTEM_PREFERS_REDUCED_MOTION);

        const listen = (mediaQuery, handler) => {
          if (!mediaQuery || typeof handler !== 'function') return;
          if (typeof mediaQuery.addEventListener === 'function') {
            mediaQuery.addEventListener('change', handler);
            this.systemPreferenceListeners.push(() => mediaQuery.removeEventListener('change', handler));
          } else if (typeof mediaQuery.addListener === 'function') {
            mediaQuery.addListener(handler);
            this.systemPreferenceListeners.push(() => mediaQuery.removeListener(handler));
          }
        };

        const onReducedMotionChange = (event) => {
          const changed = this.applySystemMotionPreference(!!event.matches);
          if (changed) {
            this.applyEnhancements();
          }
        };

        listen(reducedMotionQuery, onReducedMotionChange);
      },

      async runAccessibilityReport() {
        // Create or get report panel
        let panel = this.findElement('.acc-report-panel');
      
        if (!panel) {
          panel = this.createReportPanel();
          document.body.appendChild(panel);
        }
      
        this.openReportPanel(panel);
      
        const contentArea = this.findElement('.acc-report-content', panel);
        const statusArea = this.findElement('.acc-report-status', panel);
      
        // Show loading state
        statusArea.textContent = this.translate('Loading...');
        contentArea.innerHTML = `<div class="acc-report-loading">${this.translate('Analyzing page...')}</div>`;
      
        try {
          const results = await this.runBackgroundAxeScan({ force: true });

          this.displayReportResults(panel, results);
      
        } catch (error) {
          contentArea.innerHTML = `<div class="acc-report-error">Error: ${error.message}</div>`;
          statusArea.textContent = '';
        }
      },

      getReportFocusableElements(panel) {
        if (!panel) return [];
        const dialog = this.findElement('.acc-report-dialog', panel);
        return this.getFocusableElements(dialog || panel);
      },

      openReportPanel(panel) {
        if (!panel) return;
      
        this.reportPreviousFocus = document.activeElement && typeof document.activeElement.focus === 'function'
          ? document.activeElement
          : null;
      
        panel.classList.add('acc-report-visible');
        panel.setAttribute('aria-hidden', 'false');
      
        const dialog = this.findElement('.acc-report-dialog', panel);
        const focusTarget = dialog || panel;
        if (!focusTarget.hasAttribute('tabindex')) {
          focusTarget.setAttribute('tabindex', '-1');
        }
      
        if (this.reportKeyListener) {
          document.removeEventListener('keydown', this.reportKeyListener, true);
        }
      
        this.reportKeyListener = (event) => {
          if (!panel.classList.contains('acc-report-visible')) return;
      
          if (event.key === 'Escape' || event.key === 'Esc') {
            event.preventDefault();
            event.stopPropagation();
            this.closeReportPanel();
            return;
          }
      
          if (event.key !== 'Tab') return;
      
          const focusables = this.getReportFocusableElements(panel);
          if (!focusables.length) {
            event.preventDefault();
            focusTarget.focus();
            return;
          }
      
          const first = focusables[0];
          const last = focusables[focusables.length - 1];
          const active = document.activeElement;
          const outsidePanel = !panel.contains(active);
      
          if (event.shiftKey) {
            if (active === first || outsidePanel) {
              event.preventDefault();
              last.focus();
            }
            return;
          }
      
          if (active === last || outsidePanel) {
            event.preventDefault();
            first.focus();
          }
        };
      
        document.addEventListener('keydown', this.reportKeyListener, true);
      
        requestAnimationFrame(() => {
          const focusables = this.getReportFocusableElements(panel);
          if (focusables.length) {
            focusables[0].focus();
            return;
          }
          focusTarget.focus();
        });
      },

      createReportPanel() {
        const panel = document.createElement('div');
        panel.className = 'acc-report-panel acc-container';
        panel.setAttribute('role', 'dialog');
        panel.setAttribute('aria-modal', 'true');
        panel.setAttribute('aria-hidden', 'true');
        panel.setAttribute('aria-labelledby', 'acc-report-title');
      
        panel.innerHTML = `
      <div class="acc-report-overlay"></div>
      <div class="acc-report-dialog">
        <div class="acc-report-header">
          <h2 id="acc-report-title" class="acc-report-title">${this.translate('Accessibility Report')}</h2>
          <button type="button" class="acc-report-close" aria-label="${this.translate('Close')}">${this.widgetIcons.close}</button>
        </div>
        <div class="acc-report-status"></div>
        <div class="acc-report-content"></div>
        <div class="acc-report-footer">
          <span class="acc-report-powered">Powered by axe-core</span>
        </div>
      </div>
    `;
      
        // Close handlers
        const closeBtn = panel.querySelector('.acc-report-close');
        const overlay = panel.querySelector('.acc-report-overlay');
      
        closeBtn.addEventListener('click', () => this.closeReportPanel());
        overlay.addEventListener('click', () => this.closeReportPanel());
      
        return panel;
      },

      displayReportResults(panel, results) {
        const contentArea = this.findElement('.acc-report-content', panel);
        const statusArea = this.findElement('.acc-report-status', panel);
      
        const violations = results.violations || [];
        const passes = results.passes || [];
        const incomplete = results.incomplete || [];
      
        // Count by severity
        const counts = { critical: 0, serious: 0, moderate: 0, minor: 0 };
        violations.forEach(v => {
          if (counts[v.impact] !== undefined) {
            counts[v.impact] += v.nodes.length;
          }
        });
      
        const totalViolations = Object.values(counts).reduce((a, b) => a + b, 0);
      
        statusArea.textContent = totalViolations > 0
          ? `${totalViolations} ${this.translate('Violations Found')}`
          : this.translate('No Issues Found');
      
        let html = `
      <div class="acc-report-summary">
        <div class="acc-report-stat critical">
          <span class="acc-report-stat-value">${counts.critical}</span>
          <span class="acc-report-stat-label">${this.translate('Critical')}</span>
        </div>
        <div class="acc-report-stat serious">
          <span class="acc-report-stat-value">${counts.serious}</span>
          <span class="acc-report-stat-label">${this.translate('Serious')}</span>
        </div>
        <div class="acc-report-stat moderate">
          <span class="acc-report-stat-value">${counts.moderate}</span>
          <span class="acc-report-stat-label">${this.translate('Moderate')}</span>
        </div>
        <div class="acc-report-stat minor">
          <span class="acc-report-stat-value">${counts.minor}</span>
          <span class="acc-report-stat-label">${this.translate('Minor')}</span>
        </div>
        <div class="acc-report-stat passed">
          <span class="acc-report-stat-value">${passes.length}</span>
          <span class="acc-report-stat-label">${this.translate('Passed Tests')}</span>
        </div>
      </div>
    `;
      
        if (violations.length === 0) {
          html += `
        <div class="acc-report-success">
          <div class="acc-report-success-icon">
            <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
          </div>
          <h3>${this.translate('No Issues Found')}</h3>
        </div>
      `;
        } else {
          html += `<div class="acc-report-section">
        <div class="acc-report-section-title">${this.translate('Violations Found')} (${violations.length})</div>
      `;
      
          // Sort by severity
          const severityOrder = { critical: 0, serious: 1, moderate: 2, minor: 3 };
          violations.sort((a, b) => (severityOrder[a.impact] || 4) - (severityOrder[b.impact] || 4));
      
          violations.forEach((violation, index) => {
            html += `
          <div class="acc-report-violation" data-index="${index}">
            <div class="acc-report-violation-header">
              <span class="acc-report-violation-impact ${violation.impact}">${this.translate(this.capitalizeFirst(violation.impact))}</span>
              <span class="acc-report-violation-title">${this.escapeHtml(violation.help)}</span>
              <span class="acc-report-violation-count">${violation.nodes.length} ${this.translate('Element')}${violation.nodes.length > 1 ? 's' : ''}</span>
            </div>
            <div class="acc-report-violation-details">
              <p class="acc-report-violation-desc">${this.escapeHtml(violation.description)}</p>
              <p class="acc-report-violation-help">
                <a href="${violation.helpUrl}" target="_blank" rel="noopener">${this.translate('How to Fix')} →</a>
              </p>
              ${violation.nodes.slice(0, 5).map(node => `
                <div class="acc-report-node">
                  <div class="acc-report-node-html">${this.escapeHtml(node.html)}</div>
                  ${node.failureSummary ? `<div class="acc-report-node-fix"><strong>${this.translate('Issue')}:</strong> ${this.escapeHtml(node.failureSummary)}</div>` : ''}
                </div>
              `).join('')}
              ${violation.nodes.length > 5 ? `<p style="color:#666;font-size:13px;margin-top:12px;">... and ${violation.nodes.length - 5} more elements</p>` : ''}
            </div>
          </div>
        `;
          });
      
          html += `</div>`;
        }
      
        if (incomplete.length > 0) {
          html += `
        <div class="acc-report-section">
          <div class="acc-report-section-title">${this.translate('Items Need Review')} (${incomplete.length})</div>
          <p style="color:#666;font-size:14px;">These items require manual verification.</p>
        </div>
      `;
        }
      
        contentArea.innerHTML = html;
      
        // Add click handlers for expandable violations
        contentArea.querySelectorAll('.acc-report-violation-header').forEach(header => {
          header.addEventListener('click', () => {
            header.parentElement.classList.toggle('expanded');
          });
        });
      },

      capitalizeFirst(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
      },

      escapeHtml(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
      },

      closeReportPanel() {
        const panel = this.findElement('.acc-report-panel');
        if (panel) {
          panel.classList.remove('acc-report-visible');
          panel.setAttribute('aria-hidden', 'true');
        }
      
        if (this.reportKeyListener) {
          document.removeEventListener('keydown', this.reportKeyListener, true);
          this.reportKeyListener = null;
        }
      
        const focusTarget = this.reportPreviousFocus;
        this.reportPreviousFocus = null;
        if (focusTarget && typeof focusTarget.focus === 'function') {
          focusTarget.focus();
        }
      },

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
      },

      supportsSpeechSynthesis() {
        if (typeof window === 'undefined') return false;
        return (
          'speechSynthesis' in window &&
          typeof window.SpeechSynthesisUtterance !== 'undefined'
        );
      },

      supportsTextToSpeech() {
        return this.supportsSpeechSynthesis();
      },

      normalizeSpeechLanguage(languageCode = 'en') {
        const code = String(languageCode || 'en').toLowerCase();
        const languageMap = {
          en: 'en-US',
          it: 'it-IT',
          fr: 'fr-FR',
          de: 'de-DE',
          es: 'es-ES',
          ru: 'ru-RU',
          pl: 'pl-PL',
          ro: 'ro-RO',
          nl: 'nl-NL',
          uk: 'uk-UA'
        };
        return languageMap[code] || code;
      },

      getNativeTtsRate() {
        const configured = Number(this.nativeTtsConfig?.rate);
        if (!Number.isFinite(configured)) return 1;
        return Math.min(2, Math.max(0.5, configured));
      },

      getNativeTtsPitch() {
        const configured = Number(this.nativeTtsConfig?.pitch);
        if (!Number.isFinite(configured)) return 1;
        return Math.min(2, Math.max(0, configured));
      },

      isElementVisibleForTts(element) {
        if (!(element instanceof Element)) return false;
        const style = window.getComputedStyle(element);
        if (style.display === 'none' || style.visibility === 'hidden') {
          return false;
        }
        const rect = element.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      },

      isTtsExcludedElement(element, { allowLandmarkRegions = false } = {}) {
        if (!(element instanceof Element)) return true;
        if (element.closest('.acc-container')) return true;
        if (element.closest('script,style,noscript,template')) return true;
        if (element.closest('[aria-hidden="true"]')) return true;
        if (
          !allowLandmarkRegions &&
          element.closest(
            'nav,header,footer,aside,form,dialog,[role="navigation"],[role="complementary"],[role="search"],[role="menu"],[role="dialog"],[role="alert"],[aria-live]'
          )
        ) {
          return true;
        }
        return false;
      },

      normalizeReadableText(text = '') {
        return String(text)
          .replace(/\s+/g, ' ')
          .replace(/[ \t]+([,.;!?])/g, '$1')
          .trim();
      },

      getTtsCandidateRoots() {
        const selectors = [
          'article',
          'main',
          '[role="main"]',
          '.content',
          '.post',
          '.entry-content',
          '#content'
        ];
        const roots = [];
        const seen = new Set();

        selectors.forEach((selector) => {
          document.querySelectorAll(selector).forEach((element) => {
            if (!(element instanceof Element)) return;
            if (this.isTtsExcludedElement(element) || !this.isElementVisibleForTts(element)) return;
            if (seen.has(element)) return;
            seen.add(element);
            roots.push(element);
          });
        });

        return roots;
      },

      getPrimaryContentRoot() {
        if (typeof document === 'undefined') return null;
        const candidates = this.getTtsCandidateRoots();
        if (!candidates.length) {
          const explicitCandidates = Array.from(
            document.querySelectorAll('main,article,[role="main"],#content,.content,.post,.entry-content')
          ).filter((element) =>
            element instanceof Element &&
            !this.isTtsExcludedElement(element) &&
            this.isElementVisibleForTts(element)
          );

          if (explicitCandidates.length) {
            let explicitBest = explicitCandidates[0];
            let explicitBestScore = -1;
            explicitCandidates.forEach((candidate) => {
              const textLength = this.normalizeReadableText(candidate.innerText || candidate.textContent || '').length;
              const rect = candidate.getBoundingClientRect();
              const score = textLength + (rect.width * rect.height * 0.0025);
              if (score > explicitBestScore) {
                explicitBestScore = score;
                explicitBest = candidate;
              }
            });
            return explicitBest;
          }

          if (document.body) {
            const topLevelCandidates = Array.from(document.body.children).filter((element) =>
              element instanceof Element &&
              !element.classList.contains('acc-container') &&
              this.isElementVisibleForTts(element)
            );

            if (topLevelCandidates.length) {
              let best = topLevelCandidates[0];
              let bestScore = -1;
              topLevelCandidates.forEach((candidate) => {
                const textLength = this.normalizeReadableText(candidate.innerText || candidate.textContent || '').length;
                const rect = candidate.getBoundingClientRect();
                const score = textLength + (rect.width * rect.height * 0.0025);
                if (score > bestScore) {
                  bestScore = score;
                  best = candidate;
                }
              });
              return best;
            }
          }

          return document.body;
        }

        let bestRoot = candidates[0];
        let bestScore = -1;
        candidates.forEach((candidate) => {
          const blocks = this.extractReadableBlocks(candidate);
          const score = blocks.join(' ').length;
          if (score > bestScore) {
            bestScore = score;
            bestRoot = candidate;
          }
        });
        return bestRoot;
      },

      extractReadableBlocks(root) {
        if (!(root instanceof Element)) return [];
        const blockSelector = 'h1,h2,h3,h4,h5,h6,p,li,dt,dd,blockquote,figcaption,caption,th,td';
        const blocks = [];
        root.querySelectorAll(blockSelector).forEach((element) => {
          if (!(element instanceof Element)) return;
          if (this.isTtsExcludedElement(element) || !this.isElementVisibleForTts(element)) return;
          const text = this.normalizeReadableText(element.innerText || element.textContent || '');
          if (text.length < 15) return;
          blocks.push(text);
        });
        return blocks;
      },

      getReadableContent() {
        if (typeof document === 'undefined') return '';
        const candidateRoots = this.getTtsCandidateRoots();
        let bestBlocks = [];
        let bestScore = -1;

        candidateRoots.forEach((root) => {
          const blocks = this.extractReadableBlocks(root);
          if (!blocks.length) return;
          const characterCount = blocks.join(' ').length;
          const score = (blocks.length * 60) + characterCount;
          if (score > bestScore) {
            bestScore = score;
            bestBlocks = blocks;
          }
        });

        if (!bestBlocks.length && document.body) {
          bestBlocks = this.extractReadableBlocks(document.body);
        }

        if (!bestBlocks.length && document.body) {
          const fallback = this.normalizeReadableText(document.body.innerText || document.body.textContent || '');
          return fallback.slice(0, 30000);
        }

        return bestBlocks.join('\n\n').slice(0, 30000);
      },

      splitLongSpeechSegment(segment, maxLength = 240) {
        if (!segment) return [];
        if (segment.length <= maxLength) return [segment];

        const parts = [];
        let remaining = segment;
        while (remaining.length > maxLength) {
          let splitIndex = remaining.lastIndexOf(',', maxLength);
          if (splitIndex < Math.floor(maxLength * 0.5)) {
            splitIndex = remaining.lastIndexOf(' ', maxLength);
          }
          if (splitIndex < Math.floor(maxLength * 0.5)) {
            splitIndex = maxLength;
          }
          parts.push(remaining.slice(0, splitIndex).trim());
          remaining = remaining.slice(splitIndex).trim();
        }
        if (remaining.length) {
          parts.push(remaining);
        }
        return parts.filter(Boolean);
      },

      buildSpeechQueue(text = '') {
        const normalized = this.normalizeReadableText(text);
        if (!normalized) return [];

        const paragraphCandidates = text
          .split(/\n{2,}/)
          .map((paragraph) => this.normalizeReadableText(paragraph))
          .filter(Boolean);

        const paragraphs = paragraphCandidates.length ? paragraphCandidates : [normalized];
        const queue = [];

        paragraphs.forEach((paragraph) => {
          const sentences = paragraph.split(/(?<=[.!?])\s+/).filter(Boolean);
          const sentenceList = sentences.length ? sentences : [paragraph];
          let chunk = '';

          sentenceList.forEach((sentence) => {
            const next = chunk ? `${chunk} ${sentence}` : sentence;
            if (next.length <= 240) {
              chunk = next;
              return;
            }
            if (chunk) {
              queue.push(...this.splitLongSpeechSegment(chunk, 240));
            }
            chunk = sentence;
          });

          if (chunk) {
            queue.push(...this.splitLongSpeechSegment(chunk, 240));
          }
        });

        return queue.slice(0, 300);
      },

      resolveSpeechVoice(languageCode) {
        if (!this.supportsSpeechSynthesis()) return null;
        const synth = window.speechSynthesis;
        const voices = synth.getVoices?.() || [];
        if (!voices.length) return null;

        const preferredVoiceName = String(this.nativeTtsConfig?.preferredVoiceName || '').trim().toLowerCase();
        if (preferredVoiceName) {
          const byExactName = voices.find((voice) => String(voice.name || '').trim().toLowerCase() === preferredVoiceName);
          if (byExactName) return byExactName;
          const byNameContains = voices.find((voice) => String(voice.name || '').toLowerCase().includes(preferredVoiceName));
          if (byNameContains) return byNameContains;
        }

        const configuredVoiceLang = String(this.nativeTtsConfig?.preferredVoiceLang || '').trim();
        const targetLanguage = configuredVoiceLang || languageCode;
        const normalized = this.normalizeSpeechLanguage(targetLanguage).toLowerCase();
        const primary = normalized.split('-')[0];
        const localExact = voices.find((voice) => (
          voice.localService &&
          String(voice.lang || '').toLowerCase() === normalized
        ));
        const exact = voices.find((voice) => String(voice.lang || '').toLowerCase() === normalized);
        const localByPrimary = voices.find((voice) => (
          voice.localService &&
          String(voice.lang || '').toLowerCase().startsWith(primary)
        ));
        const byPrimary = voices.find((voice) => String(voice.lang || '').toLowerCase().startsWith(primary));
        const defaultVoice = voices.find((voice) => voice.default);
        return localExact || exact || localByPrimary || byPrimary || defaultVoice || voices[0];
      },

      getSpeechTargetFromEvent(event) {
        const target = event?.target;
        if (!(target instanceof Element)) return null;
        if (target.closest('.acc-container')) return null;

        const block = target.closest('h1,h2,h3,h4,h5,h6,p,li,dt,dd,blockquote,figcaption,caption,th,td,div,section');
        if (!(block instanceof Element)) return null;
        if (this.isTtsExcludedElement(block, { allowLandmarkRegions: true }) || !this.isElementVisibleForTts(block)) return null;

        const text = this.normalizeReadableText(block.innerText || block.textContent || '');
        if (text.length < 2) return null;

        return {
          element: block,
          text: text.slice(0, 30000)
        };
      },

      setActiveSpeechTarget(element = null) {
        if (this.ttsActiveTarget && this.ttsActiveTarget !== element) {
          this.ttsActiveTarget.classList.remove('acc-tts-active-block');
        }
        this.ttsActiveTarget = element;
        if (this.ttsActiveTarget) {
          this.ttsActiveTarget.classList.add('acc-tts-active-block');
        }
      },

      startTtsClickMode() {
        if (typeof document === 'undefined' || this.ttsClickListener) return;
        this.ttsClickListener = (event) => {
          this.handleTtsClick(event);
        };
        document.addEventListener('click', this.ttsClickListener, true);
        document.body?.classList.add('acc-tts-click-mode');
      },

      stopTtsClickMode() {
        if (typeof document === 'undefined') return;
        if (this.ttsClickListener) {
          document.removeEventListener('click', this.ttsClickListener, true);
          this.ttsClickListener = null;
        }
        document.body?.classList.remove('acc-tts-click-mode');
        this.setActiveSpeechTarget(null);
      },

      handleTtsClick(event) {
        if (!this.retrieveState('text-to-speech')) return;
        const target = this.getSpeechTargetFromEvent(event);
        if (!target) return;

        this.setActiveSpeechTarget(target.element);
        this.ttsTextCache = target.text;
        this.startSpeechPlayback({ restart: true });
      },

      ensureTtsQueue() {
        const text = this.ttsTextCache || this.getReadableContent();
        if (!text) {
          this.ttsQueue = [];
          this.ttsQueueIndex = 0;
          return false;
        }
        this.ttsTextCache = text;
        this.ttsQueue = this.buildSpeechQueue(text);
        this.ttsQueueIndex = 0;
        return this.ttsQueue.length > 0;
      },

      speakNextTtsChunk(sessionId) {
        if (!this.supportsSpeechSynthesis()) return;
        if (sessionId !== this.ttsSessionId) return;

        if (this.ttsQueueIndex >= this.ttsQueue.length) {
          this.ttsStatus = 'stopped';
          this.setActiveSpeechTarget(null);
          return;
        }

        const synth = window.speechSynthesis;
        const chunk = this.ttsQueue[this.ttsQueueIndex];
        if (!chunk) {
          this.ttsQueueIndex += 1;
          this.speakNextTtsChunk(sessionId);
          return;
        }

        const utterance = new window.SpeechSynthesisUtterance(chunk);
        utterance.lang = this.normalizeSpeechLanguage(this.loadConfig().lang || 'en');
        if (!this.ttsVoice || this.ttsVoice.lang?.toLowerCase() !== utterance.lang.toLowerCase()) {
          this.ttsVoice = this.resolveSpeechVoice(utterance.lang);
        }
        if (this.ttsVoice) {
          utterance.voice = this.ttsVoice;
        }
        utterance.rate = this.getNativeTtsRate();
        utterance.pitch = this.getNativeTtsPitch();

        utterance.onstart = () => {
          if (sessionId !== this.ttsSessionId) return;
          this.ttsStatus = 'reading';
        };
        utterance.onpause = () => {
          if (sessionId !== this.ttsSessionId) return;
          this.ttsStatus = 'paused';
        };
        utterance.onresume = () => {
          if (sessionId !== this.ttsSessionId) return;
          this.ttsStatus = 'reading';
        };
        utterance.onend = () => {
          if (sessionId !== this.ttsSessionId) return;
          this.ttsQueueIndex += 1;
          this.speakNextTtsChunk(sessionId);
        };
        utterance.onerror = () => {
          if (sessionId !== this.ttsSessionId) return;
          this.ttsStatus = 'stopped';
          this.setActiveSpeechTarget(null);
        };

        this.ttsUtterance = utterance;
        synth.speak(utterance);
      },

      startNativeSpeechPlayback({ restart = false } = {}) {
        if (!this.supportsSpeechSynthesis()) return;
        const synth = window.speechSynthesis;

        if (!restart && synth.paused) {
          synth.resume();
          this.ttsStatus = 'reading';
          return;
        }

        const hasQueue = restart || !this.ttsQueue.length || this.ttsQueueIndex >= this.ttsQueue.length
          ? this.ensureTtsQueue()
          : true;
        if (!hasQueue) {
          this.stopSpeech();
          return;
        }

        const sessionId = this.ttsSessionId + 1;
        this.ttsSessionId = sessionId;
        synth.cancel();
        this.ttsStatus = 'reading';
        this.speakNextTtsChunk(sessionId);
      },

      startSpeechPlayback({ restart = false } = {}) {
        this.startNativeSpeechPlayback({ restart });
      },

      pauseSpeech() {
        if (!this.supportsSpeechSynthesis()) return;
        const synth = window.speechSynthesis;
        if (synth.speaking && !synth.paused) {
          synth.pause();
          this.ttsStatus = 'paused';
        }
      },

      resumeSpeech() {
        if (!this.supportsSpeechSynthesis()) return;
        const synth = window.speechSynthesis;
        if (synth.paused) {
          synth.resume();
          this.ttsStatus = 'reading';
          return;
        }
        this.startSpeechPlayback({ restart: false });
      },

      stopSpeech() {
        const synth = this.supportsSpeechSynthesis() ? window.speechSynthesis : null;
        this.ttsSessionId += 1;
        if (synth && (synth.speaking || synth.paused)) {
          synth.cancel();
        }
        this.ttsUtterance = null;
        this.ttsQueueIndex = 0;
        this.ttsStatus = 'stopped';
        this.setActiveSpeechTarget(null);
      },

      enableTextToSpeech(enable = false) {
        if (!this.supportsTextToSpeech()) return;
        const isUserToggle = this.userInitiatedToggleKey === 'text-to-speech';

        if (!enable) {
          if (isUserToggle) this.announceTtsState(false);
          this.stopSpeech();
          this.stopTtsClickMode();
          return;
        }

        const synth = window.speechSynthesis;
        if (synth?.getVoices) {
          synth.getVoices();
        }

        this.startTtsClickMode();
        this.ttsStatus = 'idle';
        if (isUserToggle) this.announceTtsState(true);
      },

      announceTtsState(active) {
        if (!this.supportsTextToSpeech()) return;
        const synth = window.speechSynthesis;
        if (!synth) return;
        const msg = active
          ? this.translate('Text to Speech On')
          : this.translate('Text to Speech Off');
        synth.cancel();
        const utterance = new SpeechSynthesisUtterance(msg);
        const lang = this.normalizeSpeechLanguage(this.loadConfig().lang || 'en');
        utterance.lang = lang;
        const voice = this.resolveSpeechVoice(lang);
        if (voice) {
          utterance.voice = voice;
        }
        utterance.rate = this.getNativeTtsRate();
        utterance.pitch = this.getNativeTtsPitch();
        synth.speak(utterance);
      },

      ensureAnnotationLayer() {
        if (this.annotationLayer && document.body.contains(this.annotationLayer)) {
          return this.annotationLayer;
        }
        const layer = document.createElement('div');
        layer.className = 'acc-annotation-layer acc-container';
        layer.setAttribute('aria-hidden', 'true');
        document.body.appendChild(layer);
        this.annotationLayer = layer;
        return layer;
      },

      resolveAnnotationTarget(selector) {
        if (!selector || typeof selector !== 'string') return null;
        try {
          const element = document.querySelector(selector);
          if (!element || element.closest('.acc-container')) return null;
          return element;
        } catch {
          return null;
        }
      },

      buildAnnotationEntries(results = {}) {
        const violations = Array.isArray(results.violations) ? results.violations : [];
        const entries = [];
        const seen = new Set();

        violations.forEach((violation) => {
          const nodes = Array.isArray(violation.nodes) ? violation.nodes : [];
          nodes.forEach((node) => {
            const targets = Array.isArray(node.target) ? node.target : [];
            const selector = targets.find((target) => typeof target === 'string' && target.trim().length);
            if (!selector) return;
            const key = `${selector}::${violation.id || violation.help || ''}`;
            if (seen.has(key)) return;

            const element = this.resolveAnnotationTarget(selector);
            if (!element) return;
            seen.add(key);
            entries.push({
              selector,
              element,
              impact: violation.impact || 'minor',
              title: violation.help || this.translate('Issue'),
              description: violation.description || '',
              helpUrl: violation.helpUrl || '',
              failureSummary: node.failureSummary || ''
            });
          });
        });

        return entries.slice(0, MAX_ANNOTATIONS);
      },

      createAnnotationMarker(annotation) {
        const marker = document.createElement('button');
        marker.type = 'button';
        marker.className = 'acc-annotation-marker';
        marker.dataset.impact = annotation.impact || 'minor';
        marker.setAttribute('aria-label', annotation.title);
        marker.title = annotation.title;
        marker.innerHTML = '';

        marker.addEventListener('click', (event) => {
          event.preventDefault();
          event.stopPropagation();
          this.showAnnotationPopup(annotation, marker);
        });

        return marker;
      },

      positionAnnotationPopup(popup, marker) {
        if (!popup || !marker) return;
        const markerRect = marker.getBoundingClientRect();
        const popupWidth = popup.offsetWidth || 300;
        const popupHeight = popup.offsetHeight || 180;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const gap = 10;

        let left = window.scrollX + markerRect.left + gap;
        let top = window.scrollY + markerRect.bottom + gap;

        if (left + popupWidth > window.scrollX + viewportWidth - gap) {
          left = window.scrollX + viewportWidth - popupWidth - gap;
        }
        if (left < window.scrollX + gap) {
          left = window.scrollX + gap;
        }

        if (top + popupHeight > window.scrollY + viewportHeight - gap) {
          top = window.scrollY + markerRect.top - popupHeight - gap;
        }
        if (top < window.scrollY + gap) {
          top = window.scrollY + gap;
        }

        popup.style.left = `${left}px`;
        popup.style.top = `${top}px`;
      },

      clearAnnotationPopup() {
        if (this.annotationPopup) {
          this.annotationPopup.remove();
          this.annotationPopup = null;
        }
      },

      showAnnotationPopup(annotation, marker) {
        if (!annotation || !marker || !this.annotationLayer) return;
        this.clearAnnotationPopup();

        const popup = document.createElement('div');
        popup.className = 'acc-annotation-popup';
        popup.innerHTML = `
      <div class="acc-annotation-popup-header">
        <h3 class="acc-annotation-popup-title">${this.escapeHtml(annotation.title)}</h3>
        <button type="button" class="acc-annotation-popup-close" aria-label="${this.translate('Close')}">${this.widgetIcons.close}</button>
      </div>
      <p><strong>${this.translate(this.capitalizeFirst(annotation.impact))}</strong></p>
      <p>${this.escapeHtml(annotation.description)}</p>
      ${annotation.failureSummary ? `<p><strong>${this.translate('Issue')}:</strong> ${this.escapeHtml(annotation.failureSummary)}</p>` : ''}
      ${annotation.helpUrl ? `<p><a href="${annotation.helpUrl}" target="_blank" rel="noopener">${this.translate('How to Fix')} →</a></p>` : ''}
    `;
        popup.__accMarker = marker;

        const closeButton = popup.querySelector('.acc-annotation-popup-close');
        closeButton?.addEventListener('click', () => this.clearAnnotationPopup());

        this.annotationLayer.appendChild(popup);
        this.annotationPopup = popup;
        this.positionAnnotationPopup(popup, marker);
      },

      positionAnnotations() {
        if (!Array.isArray(this.annotationItems) || !this.annotationItems.length) return;

        this.annotationItems.forEach((item) => {
          if (!item?.target || !item?.marker) return;
          if (!document.contains(item.target)) {
            item.marker.hidden = true;
            return;
          }

          const rect = item.target.getBoundingClientRect();
          const outOfView = (
            rect.width <= 0 ||
            rect.height <= 0 ||
            rect.bottom < 0 ||
            rect.top > window.innerHeight ||
            rect.right < 0 ||
            rect.left > window.innerWidth
          );

          if (outOfView) {
            item.marker.hidden = true;
            return;
          }

          item.marker.hidden = false;
          item.marker.style.top = `${window.scrollY + rect.top + Math.min(16, rect.height / 2)}px`;
          item.marker.style.left = `${window.scrollX + rect.right}px`;
        });

        if (this.annotationPopup?.__accMarker && !this.annotationPopup.__accMarker.hidden) {
          this.positionAnnotationPopup(this.annotationPopup, this.annotationPopup.__accMarker);
        }
      },

      enableAnnotations(enable = false) {
        if (!enable) {
          this.disableAnnotations();
          return;
        }

        const requestId = ++this.annotationRequestId;
        this.disableAnnotations({ cancelPending: false });
        const layer = this.ensureAnnotationLayer();

        this.runBackgroundAxeScan()
          .then((results) => {
            if (requestId !== this.annotationRequestId || !this.retrieveState('annotations')) {
              return;
            }
            const annotations = this.buildAnnotationEntries(results);
            this.annotationItems = annotations.map((annotation) => {
              const marker = this.createAnnotationMarker(annotation);
              layer.appendChild(marker);
              return {
                marker,
                target: annotation.element,
                data: annotation
              };
            });

            if (!this.annotationRepositionHandler) {
              this.annotationRepositionHandler = this.throttle(() => this.positionAnnotations(), 80);
            }
            window.addEventListener('scroll', this.annotationRepositionHandler, { passive: true });
            window.addEventListener('resize', this.annotationRepositionHandler, { passive: true });

            if (!this.annotationOutsideHandler) {
              this.annotationOutsideHandler = (event) => {
                if (!this.annotationPopup) return;
                const clickedPopup = this.annotationPopup.contains(event.target);
                const clickedMarker = event.target?.closest?.('.acc-annotation-marker');
                if (!clickedPopup && !clickedMarker) {
                  this.clearAnnotationPopup();
                }
              };
            }
            document.addEventListener('click', this.annotationOutsideHandler, true);

            this.positionAnnotations();
          })
          .catch((error) => {
            console.warn('Failed to render annotations:', error);
          });
      },

      disableAnnotations({ cancelPending = true } = {}) {
        if (cancelPending) {
          this.annotationRequestId += 1;
        }
        this.clearAnnotationPopup();

        if (this.annotationOutsideHandler) {
          document.removeEventListener('click', this.annotationOutsideHandler, true);
        }
        if (this.annotationRepositionHandler) {
          window.removeEventListener('scroll', this.annotationRepositionHandler);
          window.removeEventListener('resize', this.annotationRepositionHandler);
        }

        if (this.annotationLayer) {
          this.annotationLayer.remove();
          this.annotationLayer = null;
        }

        this.annotationItems = [];
      },


      clearSimpleLayoutDomMutations() {
        if (this.simpleLayoutRoot) {
          this.simpleLayoutRoot.classList.remove('acc-simple-layout-root');
          this.simpleLayoutRoot = null;
        }

        if (Array.isArray(this.simpleLayoutHiddenElements)) {
          this.simpleLayoutHiddenElements.forEach((element) => {
            if (element && element.classList) {
              element.classList.remove('acc-simple-layout-hidden');
            }
          });
        }
        this.simpleLayoutHiddenElements = [];
      },

      applySimpleLayoutDomMutations() {
        const root = this.getPrimaryContentRoot();
        if (!root || !document.body) return;

        this.simpleLayoutRoot = root;
        root.classList.add('acc-simple-layout-root');

        const hiddenElements = [];
        Array.from(document.body.children).forEach((child) => {
          if (!(child instanceof Element)) return;
          if (child.classList.contains('acc-container')) return;
          if (child === root || child.contains(root)) return;
          child.classList.add('acc-simple-layout-hidden');
          hiddenElements.push(child);
        });

        const clutterSelectors = [
          'aside',
          'nav',
          'form',
          'footer',
          '[role="complementary"]',
          '[role="search"]',
          '[role="contentinfo"]',
          '[aria-hidden="true"]',
          '[class*="cookie"]',
          '[id*="cookie"]',
          '[class*="banner"]',
          '[id*="banner"]',
          '[class*="popup"]',
          '[id*="popup"]',
          '[class*="modal"]',
          '[id*="modal"]',
          '[class*="advert"]',
          '[id*="advert"]',
          '[class*="ads"]',
          '[id*="ads"]',
          '[class*="sidebar"]',
          '[id*="sidebar"]',
          '[class*="social"]',
          '[id*="social"]',
          '[class*="share"]',
          '[id*="share"]',
          '[class*="newsletter"]',
          '[id*="newsletter"]',
          '[class*="related"]',
          '[id*="related"]',
          '[class*="comment"]',
          '[id*="comment"]',
          '[class*="footer"]',
          '[id*="footer"]',
          '[class*="promo"]',
          '[id*="promo"]'
        ].join(',');

        root.querySelectorAll(clutterSelectors).forEach((element) => {
          if (!(element instanceof Element)) return;
          if (element.closest('.acc-container')) return;
          if (element === root) return;
          element.classList.add('acc-simple-layout-hidden');
          hiddenElements.push(element);
        });

        this.simpleLayoutHiddenElements = hiddenElements;
      },

      enableSimpleLayout(enable = false) {
        const S = 'body.acc-simple-layout-enabled';
        const R = `${S} .acc-simple-layout-root`;
        const X = ':not(.acc-container):not(.acc-container *)';
        const config = {
          id: 'simple-layout',
          css: `
        /* ── Body & root container ── */
        ${S} {
          background: #fff !important;
        }

        ${S} .acc-simple-layout-hidden {
          display: none !important;
        }

        ${R} {
          max-width: 72ch !important;
          margin: 0 auto !important;
          padding: clamp(20px, 4vw, 40px) 20px !important;
          position: relative !important;
          border-radius: 0 !important;
          box-shadow: none !important;
        }

        /* ── Universal decoration strip ── */
        ${R} :where(*)${X} {
          background-color: transparent !important;
          background-image: none !important;
          box-shadow: none !important;
          text-shadow: none !important;
          border-color: transparent !important;
        }

        /* ── Layout linearization ── */
        ${R} :where(div, section, article, header, main, footer, figure, figcaption, details, summary, hgroup, search)${X} {
          display: block !important;
          position: static !important;
          float: none !important;
          transform: none !important;
          columns: auto !important;
          column-count: auto !important;
          width: auto !important;
          min-width: 0 !important;
          max-width: 100% !important;
          margin-left: 0 !important;
          margin-right: 0 !important;
          padding-left: 0 !important;
          padding-right: 0 !important;
        }

        /* ── Color reset ── */
        ${R} :where(h1, h2, h3, h4, h5, h6)${X} {
          color: #111 !important;
        }

        ${R} :where(p, li, dt, dd, td, th, span, blockquote, figcaption, label, summary, details)${X} {
          color: #222 !important;
        }

        ${R} :where(a)${X} {
          color: #1a0dab !important;
        }

        ${R} :where(a:visited)${X} {
          color: #681da8 !important;
        }

        /* ── Typography ── */
        ${R} :where(*)${X} {
          font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
        }

        ${R} :where(p, li, dt, dd, blockquote, figcaption, td, th, label, summary)${X} {
          font-size: clamp(1rem, 0.95rem + 0.25vw, 1.125rem) !important;
          line-height: 1.8 !important;
          letter-spacing: 0.01em !important;
          max-width: 70ch !important;
        }

        ${R} :where(h1)${X} {
          font-size: 2em !important;
          line-height: 1.2 !important;
          margin: 0.67em 0 !important;
          font-weight: 700 !important;
        }

        ${R} :where(h2)${X} {
          font-size: 1.5em !important;
          line-height: 1.25 !important;
          margin: 0.83em 0 !important;
          font-weight: 700 !important;
        }

        ${R} :where(h3)${X} {
          font-size: 1.25em !important;
          line-height: 1.3 !important;
          margin: 1em 0 !important;
          font-weight: 600 !important;
        }

        ${R} :where(h4, h5, h6)${X} {
          font-size: 1.1em !important;
          line-height: 1.35 !important;
          margin: 1em 0 !important;
          font-weight: 600 !important;
        }

        /* ── Decorative images hidden ── */
        ${R} :where(img[role="presentation"], img[alt=""], img:not([alt]), svg[aria-hidden="true"])${X} {
          display: none !important;
        }

        /* ── Meaningful borders restored ── */
        ${R} :where(hr)${X} {
          border: none !important;
          border-top: 1px solid #d1d5db !important;
          margin: 1.5em 0 !important;
        }

        ${R} :where(blockquote)${X} {
          border-left: 4px solid #d1d5db !important;
          padding-left: 1em !important;
          margin-left: 0 !important;
          font-style: italic !important;
        }

        ${R} :where(table)${X} {
          border-collapse: collapse !important;
          max-width: 100% !important;
          overflow-x: auto !important;
          display: table !important;
        }

        ${R} :where(th, td)${X} {
          border: 1px solid #d1d5db !important;
          padding: 8px 12px !important;
          text-align: left !important;
        }

        ${R} :where(th)${X} {
          font-weight: 600 !important;
          background: #f8f9fa !important;
        }

        /* ── Lists ── */
        ${R} :where(ul, ol)${X} {
          padding-left: 1.5em !important;
          margin: 0.75em 0 !important;
        }

        ${R} :where(li)${X} {
          display: list-item !important;
          margin: 0.25em 0 !important;
        }

        /* ── Code blocks ── */
        ${R} :where(pre)${X} {
          background: #f6f8fa !important;
          border-radius: 6px !important;
          padding: 1em !important;
          overflow-x: auto !important;
          max-width: 100% !important;
        }

        ${R} :where(code, kbd, samp)${X} {
          font-family: ui-monospace, "SFMono-Regular", "SF Mono", Menlo, Consolas, "Liberation Mono", monospace !important;
          font-size: 0.9em !important;
        }

        ${R} :where(code):not(pre code)${X} {
          background: #f0f2f5 !important;
          padding: 0.15em 0.4em !important;
          border-radius: 3px !important;
        }

        /* ── Empty wrapper collapse ── */
        ${R} :where(div:empty)${X} {
          display: none !important;
        }

        /* ── Media ── */
        ${R} :where(img, video, iframe)${X} {
          max-width: 100% !important;
          height: auto !important;
          border-radius: 4px !important;
        }
      `
        };

        this.applyToolStyle({ ...config, enable });
        document.body?.classList.toggle('acc-simple-layout-enabled', !!enable);

        this.clearSimpleLayoutDomMutations();
        if (enable) {
          this.applySimpleLayoutDomMutations();
        }
      },

      applyEnhancements() {
          const { states } = this.loadConfig();
          // Handle font size scaling
          const hasTextScaleState = !!(states && Object.prototype.hasOwnProperty.call(states, 'text-scale'));
          if (hasTextScaleState) {
            const storedScale = states['text-scale'] === false ? 1 : states['text-scale'];
            const appliedScale = this.setTextScaleFromPercent(storedScale, { persist: false });
            this.syncTextScaleControlUI(document.querySelector('.acc-menu'), appliedScale);
          } else {
            this.textScaleIndex = 0;
            if (this.multiLevelFeatures['text-scale']) {
              this.multiLevelFeatures['text-scale'].currentIndex = -1;
            }
            this.scaleText(1);
            this.syncTextScaleControlUI(document.querySelector('.acc-menu'), 1);
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
          this.enableHighContrastMode(states && states['high-contrast-mode']);
          this.enableAnnotations(states && states['annotations']);
          this.enableTextToSpeech(states && states['text-to-speech']);
          this.enableSimpleLayout(states && states['simple-layout']);
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
          this.updateState({ 'text-scale': multiply });
          return this.textScaleIndex;
        },

      cycleMultiLevelFeature(featureKey, button) {
          const feature = this.multiLevelFeatures[featureKey];
          if (!feature || !button) return;

          if (featureKey === 'contrast-toggle' || featureKey === 'saturation-toggle') {
            const newIndex = feature.currentIndex + 1;
            const newActiveKey = newIndex >= feature.levels ? null : feature.values[newIndex];
            this.updateColorFilterState(newActiveKey);
            this.setColorFilterUI(button.closest('.acc-menu'), newActiveKey);
            this.applyVisualFilters();
            return;
          }

          const newIndex = feature.currentIndex + 1;
          if (newIndex >= feature.levels) {
            feature.currentIndex = -1;
            button.classList.remove('acc-selected');
            button.setAttribute('aria-pressed', 'false');
            this.updateState({ [featureKey]: featureKey === 'text-scale' ? 1 : false });
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
        },

      resetEnhancements() {
          this.saveConfig({ states: {}, systemDefaults: {} });
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
          const menu = document.querySelector('.acc-menu');
          if (menu) {
            this.setColorFilterUI(menu, null);
            this.syncTextScaleControlUI(menu, 1);
          }
          
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
            'acc-filter-style',
            'acc-simple-layout'
          ];
          styleIds.forEach(id => {
            const style = document.getElementById(id);
            if (style) style.remove();
          });
          this.clearSimpleLayoutDomMutations();
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
            'acc-hide-images',
            'acc-high-contrast-mode',
            'acc-simple-layout'
          );
          document.body?.classList.remove('acc-simple-layout-enabled');
          document.body?.classList.remove('acc-high-contrast-mode');
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
          this.disableAnnotations();
          this.stopSpeech();
          this.stopTtsClickMode();
          this.clearSystemPreferenceListeners();
          this.detectSystemPreferences();
          this.setupMediaQueryListeners();
          this.updateViolationBubble(this.axeScanResults);
        },

    };

    /** @typedef {import('./index.js').default} AccessibleWebWidget */

    /** @type {{ [methodName: string]: (this: AccessibleWebWidget, ...args: any[]) => any }} */
    const uiMethods = {

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

      displayMenu({ container, lang, position = 'bottom-right', offset = [20, 20], size }) {
          try {
            this.applyThemeVariables();
            this.registerStaticStyles();

            const activeLanguageCode = String(lang || 'en').split(/[_-]/)[0].toLowerCase();

            const menuTemplate = `
        <div class="acc-menu" role="dialog" aria-labelledby="accessibility-title">
          <div class="acc-menu-header">
            <div id="accessibility-title" class="acc-menu-title">
              <span class="acc-menu-title-icon" aria-hidden="true">${this.widgetIcons.accessibility}</span>
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

    /*!
     * AccessibleWeb Widget v1.1.2
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
          { label: 'Reading Guide', key: 'reading-aid', icon: this.widgetIcons.readingAid },
          {
            label: 'Text to Speech',
            key: 'text-to-speech',
            icon: this.widgetIcons.textToSpeech,
            requiresSpeechSynthesis: true
          },
          { label: 'High Contrast', key: 'high-contrast-mode', icon: this.widgetIcons.highContrast },
          { label: 'Simplify Layout', key: 'simple-layout', icon: this.widgetIcons.simplifyLayout }
        ];

        // Add dev-only tools (?acc-dev=true)
        if (this.isDevMode()) {
          this.accessTools.push(
            { label: 'Annotations', key: 'annotations', icon: this.widgetIcons.annotations },
            {
              label: 'Accessibility Report',
              key: 'accessibility-report',
              icon: this.widgetIcons.accessibilityReport,
              isAction: true
            }
          );
        }

        // axe-core state
        this.axeCoreLoaded = false;
        this.axeCoreLoading = false;
        this.axeCorePromise = null;
        this.axeScanResults = null;
        this.axeScanPromise = null;
        this.violationBubble = null;

        // Accessibility report modal state
        this.reportPreviousFocus = null;
        this.reportKeyListener = null;

        // System preference state
        this.systemPreferenceListeners = [];
        this.systemPreferenceMediaQueries = {};

        // Annotation state
        this.annotationLayer = null;
        this.annotationItems = [];
        this.annotationPopup = null;
        this.annotationRepositionHandler = null;
        this.annotationOutsideHandler = null;
        this.annotationRequestId = 0;

        // Text-to-speech state
        this.ttsUtterance = null;
        this.ttsClickListener = null;
        this.ttsActiveTarget = null;
        this.ttsTextCache = '';
        this.ttsStatus = 'stopped';
        this.ttsQueue = [];
        this.ttsQueueIndex = 0;
        this.ttsSessionId = 0;
        this.ttsVoice = null;


        // Simplify layout state
        this.simpleLayoutRoot = null;
        this.simpleLayoutHiddenElements = [];

        // Track direct user toggles for features that have side effects.
        this.userInitiatedToggleKey = null;

        // Font size cycling
        this.textScaleIndex = 0;
        this.textScaleValues = [1.2, 1.4, 1.6];
        this.textScaleMinPercent = 80;
        this.textScaleMaxPercent = 150;
        this.textScaleStepPercent = 5;
        this.contrastFilterValues = ['light-contrast', 'dark-contrast'];
        this.saturationFilterValues = ['low-saturation', 'high-saturation'];

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
          },
          'contrast-toggle': {
            levels: this.contrastFilterValues.length,
            currentIndex: -1,
            values: this.contrastFilterValues
          },
          'saturation-toggle': {
            levels: this.saturationFilterValues.length,
            currentIndex: -1,
            values: this.saturationFilterValues
          }
        };

        this.readingAidTemplate = `
      <div class="acc-rg acc-rg-top" role="presentation"> </div>
      <div class="acc-rg acc-rg-bottom" role="presentation"> </div>
    `;

        this.colorOptions = [
          {
            label: 'Contrast',
            key: 'contrast-toggle',
            icon: this.widgetIcons.contrast,
            multiLevel: true,
            levels: this.contrastFilterValues.length
          },
          { label: 'Invert Colors', key: 'invert-colors', icon: this.widgetIcons.invertColors },
          {
            label: 'Saturation',
            key: 'saturation-toggle',
            icon: this.widgetIcons.saturation,
            multiLevel: true,
            levels: this.saturationFilterValues.length
          }
        ];
        this.colorFilterKeys = Object.keys(this.visualFilters);
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
          position: 'bottom-right',
          ...this.dataOptions,
          ...options
        };

        this.applyThemeOverrides(this.options);

        const normalizeTtsRate = (value) => {
          const numeric = Number(value);
          if (!Number.isFinite(numeric)) return 1;
          return Math.min(2, Math.max(0.5, numeric));
        };

        const normalizeTtsPitch = (value) => {
          const numeric = Number(value);
          if (!Number.isFinite(numeric)) return 1;
          return Math.min(2, Math.max(0, numeric));
        };

        this.nativeTtsConfig = {
          preferredVoiceName: (
            typeof options.ttsNativeVoiceName === 'string' &&
            options.ttsNativeVoiceName.trim()
          ) ? options.ttsNativeVoiceName.trim() : '',
          preferredVoiceLang: (
            typeof options.ttsNativeVoiceLang === 'string' &&
            options.ttsNativeVoiceLang.trim()
          ) ? options.ttsNativeVoiceLang.trim() : '',
          rate: normalizeTtsRate(options.ttsRate),
          pitch: normalizeTtsPitch(options.ttsPitch)
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

      applyThemeOverrides(options = {}) {
        if (!options || typeof options !== 'object') return;

        const mergedOptions = {
          ...(options.theme && typeof options.theme === 'object' ? options.theme : {}),
          ...options
        };

        const themeKeys = [
          'primaryColor',
          'primaryColorLight',
          'primaryColorDark',
          'backgroundColor',
          'textColor',
          'textColorInverted',
          'cardBackground',
          'borderColor',
          'focusRingColor',
          'hoverColor',
          'activeColor',
          'borderRadius',
          'buttonBorderRadius',
          'headerHeight',
          'focusBorderWidth',
          'focusOutlineOffset',
          'zIndex'
        ];

        themeKeys.forEach((key) => {
          const value = mergedOptions[key];
          if (value === undefined || value === null) return;

          if (typeof value === 'string') {
            const trimmed = value.trim();
            if (!trimmed) return;
            this.widgetTheme[key] = trimmed;
            return;
          }

          this.widgetTheme[key] = value;
        });

        if (mergedOptions.buttonSize !== undefined && mergedOptions.buttonSize !== null && mergedOptions.buttonSize !== '') {
          this.widgetTheme.buttonSize = this.normalizeButtonSize(mergedOptions.buttonSize);
        }
      }
    }

    /** @typedef {typeof stateMethods & typeof styleMethods & typeof featureMethods & typeof uiMethods} WidgetMixedMethods */
    /** @typedef {AccessibleWebWidget & WidgetMixedMethods} AccessibleWebWidgetInstance */

    /** @type {AccessibleWebWidget['prototype'] & WidgetMixedMethods} */
    const widgetPrototype = AccessibleWebWidget.prototype;

    Object.assign(
      widgetPrototype,
      stateMethods,
      styleMethods,
      featureMethods,
      uiMethods
    );

    if (typeof window !== 'undefined') {
      window.AccessibleWebWidget = AccessibleWebWidget;
    }

    if (typeof document !== 'undefined') {
      const globalAutoInitOptions = (
        typeof window !== 'undefined' &&
        window.AccessibleWebWidgetOptions &&
        typeof window.AccessibleWebWidgetOptions === 'object'
      ) ? window.AccessibleWebWidgetOptions : {};

      /** @type {AccessibleWebWidgetInstance} */
      const widgetInstance = new AccessibleWebWidget(globalAutoInitOptions);
      if (document.readyState === 'complete' || document.readyState === 'interactive') {
        widgetInstance.startAccessibleWebWidget();
      } else {
        document.addEventListener('DOMContentLoaded', () => widgetInstance.startAccessibleWebWidget());
      }
    }

    return AccessibleWebWidget;

})();
