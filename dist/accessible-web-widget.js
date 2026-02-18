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

    const WIDGET_ICONS = {
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
          hideImages: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="m840-234-80-80v-446H314l-80-80h526q33 0 56.5 23.5T840-760v526ZM792-56l-64-64H200q-33 0-56.5-23.5T120-200v-528l-64-64 56-56 736 736-56 56ZM240-280l120-160 90 120 33-44-283-283v447h447l-80-80H240Zm297-257ZM424-424Z"/></svg>',
          accessibilityReport: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm40-80h200v-80H240v80Zm254-54 166-166-56-56-110 110-46-46-56 56 102 102ZM240-440h200v-80H240v80Zm0-160h200v-80H240v80Zm-40 400v-560 560Z"/></svg>'
        };

    const TARGET_SELECTORS = {
          ALL: ['', '*:not(.material-icons,.acc-menu,.acc-menu *)'],
          LINKS: ["a[href]"],
          HEADERS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', '.wsite-headline', '.wsite-content-title'],
          TEXT: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', '.wsite-headline', '.wsite-content-title', 'img', 'p', 'i', 'svg', 'a', 'button:not(.acc-btn)', 'label', 'li', 'ol']
        };

    const PAGE_CONTENT_SELECTOR = 'body > *:not(.acc-container)';

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
            "Items Need Review": "Items Need Review"
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
            "Items Need Review": "Elementi da Rivedere"
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
            "Items Need Review": "Éléments à Vérifier"
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
            "Items Need Review": "Elemente zur Überprüfung"
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
            "Items Need Review": "Elementos a Revisar"
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
            "Items Need Review": "Требуют проверки"
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
            "Items Need Review": "Elementy do Sprawdzenia"
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
            "Items Need Review": "Elemente de Verificat"
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
            "Items Need Review": "Items te Controleren"
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
            "Items Need Review": "Потребують перевірки"
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

    var menuCSS = "/* Base styles */\n.acc-menu {\n  position: fixed;\n  left: 0;\n  top: 0;\n  box-shadow: 0 0 8px rgba(0, 0, 0, 0.25);\n  opacity: 1;\n  transition: 0.3s;\n  z-index: var(--acc-widget-z-index, 100000);\n  overflow: hidden;\n  background: var(--acc-bg-color);\n  width: 500px;\n  line-height: 1.5;\n  font-size: 16px;\n  height: 100%;\n  letter-spacing: 0.015em;\n  color: var(--acc-text-color);\n}\n\n/* Ensure all elements inherit proper colors for accessibility */\n.acc-menu * {\n  color: var(--acc-text-color);\n  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;\n  padding: 0;\n  margin: 0;\n  line-height: 1.5 !important;\n  letter-spacing: normal !important;\n}\n\n/* Header section */\n.acc-menu-header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding-left: 16px;\n  padding-right: 16px;\n  height: var(--acc-header-height);\n  font-weight: 700 !important;\n  background-color: var(--acc-primary-color) !important;\n}\n\n.acc-menu-title {\n  font-size: 18px !important;\n  color: var(--acc-text-color-inverted) !important;\n  font-weight: bold;\n}\n\n.acc-header-back {\n  display: flex;\n  align-items: center;\n}\n\n.acc-back-btn {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  background: transparent;\n  border: none;\n  padding: 8px;\n  cursor: pointer;\n  font-size: 16px;\n  font-weight: 600;\n  color: var(--acc-text-color-inverted) !important;\n  transition: background-color 0.2s;\n  border-radius: 4px;\n  visibility: hidden;\n}\n\n.acc-back-btn > span {\n  color: var(--acc-text-color-inverted) !important;\n}\n\n.acc-back-btn.visible {\n    visibility: visible;\n  }\n\n  .acc-back-btn:hover {\n    background-color: rgba(255, 255, 255, 0.2);\n  }\n\n  .acc-back-btn:focus {\n    outline: 2px solid var(--acc-text-color-inverted);\n    outline-offset: 1px;\n  }\n\n  .acc-back-btn svg {\n    fill: var(--acc-text-color-inverted) !important;\n    width: 24px !important;\n    height: 24px !important;\n  }\n\n  .acc-menu-title-dynamic {\n    display: none !important;\n  }\n\n  .acc-menu-title-dynamic.visible {\n    display: block !important;\n  }\n\n  .acc-menu-title-default {\n    display: block !important;\n  }\n\n  .acc-menu-title-default.hidden {\n    display: none !important;\n  }\n\n.acc-menu-header svg {\n  fill: var(--acc-text-color-inverted) !important;\n  width: 28px !important;\n  height: 28px !important;\n  min-width: 28px !important;\n  min-height: 28px !important;\n  max-width: 28px !important;\n  max-height: 28px !important;\n}\n\n.acc-menu-header > div {\n  display: flex;\n  align-items: center;\n}\n\n/* Interactive elements */\n.acc-menu-header div[role=\"button\"] {\n  cursor: pointer;\n  padding: 8px;\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 36px;\n  height: 36px;\n}\n\n.acc-menu-header div[role=\"button\"]:hover {\n  background-color: rgba(255, 255, 255, 0.2);\n}\n\n.acc-menu-header div[role=\"button\"]:focus {\n  outline: 2px solid var(--acc-text-color-inverted);\n  outline-offset: 1px;\n}\n\n\n.acc-menu-header .acc-header-actions {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n}\n\n.acc-lang-toggle {\n  cursor: pointer;\n  background: transparent;\n  border: none;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 4px;\n  border-radius: 50%;\n  color: var(--acc-text-color-inverted);\n}\n\n.acc-lang-toggle:hover {\n  background-color: rgba(255, 255, 255, 0.2);\n}\n\n.acc-lang-toggle:focus {\n  outline: 2px solid var(--acc-text-color-inverted);\n  outline-offset: 1px;\n}\n\n.acc-lang-toggle svg {\n  fill: var(--acc-text-color-inverted) !important;\n  width: 28px !important;\n  height: 28px !important;\n}\n\n.acc-lang-panel {\n  position: absolute;\n  top: var(--acc-header-height);\n  right: 0;\n  width: 100%;\n  height: 100%;\n  max-height: calc(100% - var(--acc-header-height)) !important;\n  background: var(--acc-bg-color);\n  z-index: 100;\n  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);\n  overflow-y: auto;\n  display: none;\n\n}\n\n.acc-lang-panel.open {\n  display: block;\n}\n\n.acc-lang-current-container {\n  padding: 16px;\n}\n\n.acc-lang-current {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 12px 16px;\n  border: 2px solid var(--acc-primary-color);\n  border-radius: var(--acc-button-border-radius);\n  margin-top: 8px;\n  color: var(--acc-primary-color);\n  font-weight: 600;\n  background: white;\n}\n\n.acc-lang-search-wrapper {\n  padding: 0 16px 8px;\n}\n\n.acc-lang-search {\n  width: 100%;\n  padding: 10px 16px;\n  border: 2px solid var(--acc-border-color);\n  border-radius: var(--acc-button-border-radius);\n  font-size: 16px;\n  background-color: var(--acc-card-bg);\n}\n\n.acc-lang-search:focus {\n  outline: var(--acc-focus-outline-width) solid var(--acc-focus-ring-color);\n  outline-offset: var(--acc-focus-outline-offset);\n  border-color: var(--acc-primary-color) !important;\n}\n\n.acc-lang-list {\n  padding: 6px 16px 16px;\n  max-height: 300px;\n  overflow-y: auto;\n}\n\n.acc-lang-item {\n  display: block;\n  width: 100%;\n  text-align: left;\n  padding: 12px 16px;\n  margin-bottom: 4px;\n  background-color: transparent;\n  border: none;\n  border-radius: var(--acc-button-border-radius);\n  cursor: pointer;\n  font-size: 16px;\n  color: var(--acc-text-color);\n}\n\n.acc-lang-item:hover {\n  background-color: rgba(0, 0, 0, 0.05);\n}\n\n.acc-lang-item:focus {\n  outline: var(--acc-focus-outline-width) solid var(--acc-focus-ring-color);\n  outline-offset: var(--acc-focus-outline-offset);\n}\n\n.acc-lang-item.selected {\n  background-color: rgba(0, 0, 0, 0.05);\n  font-weight: 600;\n}\n\n.acc-icon-check {\n  display: inline-block;\n  width: 18px;\n  height: 18px;\n  background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='%23886f60' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12'%3E%3C/polyline%3E%3C/svg%3E\");\n  background-repeat: no-repeat;\n  background-position: center;\n}\n\n\n\n/* Content sections */\n.acc-section {\n  margin: 0 16px 24px;\n}\n\n.acc-section-title {\n  font-size: 16px !important;\n  padding: 16px 14px;\n  font-weight: 600 !important;\n  color: var(--acc-text-color);\n}\n\n.acc-menu .acc-lang-select {\n  width: 100% !important;\n  padding: 0 16px !important;\n  font-size: 16px !important;\n  font-family: inherit !important;\n  font-weight: 600 !important;\n  border-radius: var(--acc-button-border-radius) !important;\n  background: var(--acc-card-bg) !important;\n  border: 2px solid var(--acc-border-color) !important;\n  min-height: 48px !important;\n  max-height: 48px !important;\n  height: 48px !important;\n  color: var(--acc-text-color) !important;\n  color: var(--acc-text-color) !important;\n  -webkit-appearance: none !important;\n  -moz-appearance: none !important;\n  appearance: none !important;\n  background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0%20-960%20960%20960' width='24px' fill='%231f1f1f'%3E%3Cpath d='M480-344%20240-584l56-56%20184 184%20184-184%2056 56-240 240Z'/%3E%3C/svg%3E\") !important;\n  background-repeat: no-repeat !important;\n  background-position: right 12px center !important;\n  background-size: 20px !important;\n  padding-right: 44px !important;\n}\n\n/* Hide default arrows in Firefox and IE */\n.acc-menu .acc-lang-select::-ms-expand {\n  display: none !important;\n}\n\n.acc-menu .acc-lang-select:focus {\n  outline: var(--acc-focus-outline-width) solid var(--acc-focus-ring-color);\n  outline-offset: var(--acc-focus-outline-offset);\n  border-color: var(--acc-primary-color) !important;\n}\n\n/* Option grid layout */\n.acc-options {\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  gap: 16px;\n}\n\n/* Button styling */\n.acc-btn {\n  aspect-ratio: 6 / 5;\n  border-radius: var(--acc-border-radius);\n  padding: 12px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-direction: column;\n  text-align: center;\n  font-size: 16px !important;\n  background: var(--acc-card-bg) !important;\n  border: 2px solid var(--acc-border-color) !important;\n  transition: all 0.2s ease;\n  cursor: pointer;\n  word-break: break-word;\n  gap: 8px;\n  position: relative;\n}\n\n.acc-btn:hover {\n  border-color: var(--acc-hover-color) !important;\n}\n\n.acc-btn:focus {\n  outline: var(--acc-focus-outline-width) solid var(--acc-focus-ring-color);\n  outline-offset: var(--acc-focus-outline-offset);\n  border-color: var(--acc-primary-color) !important;\n}\n\n.acc-btn .acc-label, .acc-text-adjust .acc-label div {\n  font-size: 14px !important;\n  font-weight: 600 !important;\n}\n\n/* SVG icons */\n.acc-text-adjust svg {\n  width: 24px !important;\n  height: 24px !important;\n  min-width: 24px !important;\n  min-height: 24px !important;\n  max-width: 24px !important;\n  max-height: 24px !important;\n}\n\n.acc-btn svg {\n  width: 34px !important;\n  height: 34px !important;\n  min-width: 34px !important;\n  min-height: 34px !important;\n  max-width: 34px !important;\n  max-height: 34px !important;\n  fill: var(--acc-text-color);\n}\n\n/* Selected state */\n.acc-btn.acc-selected {\n  background-color: var(--acc-primary-color) !important;\n  border-color: var(--acc-primary-color) !important;\n}\n\n.acc-btn.acc-selected .acc-progress-dot {\n  background-color: rgba(255, 255, 255, 0.5);\n}\n\n.acc-btn.acc-selected .acc-progress-dot.active {\n  background-color: var(--acc-text-color-inverted) !important;\n}\n\n.acc-btn.acc-selected svg, \n.acc-btn.acc-selected span,\n.acc-btn.acc-selected .acc-label {\n  fill: var(--acc-text-color-inverted) !important;\n  color: var(--acc-text-color-inverted) !important;\n}\n\n/* Reset All Settings button */\n\n.acc-reset-container {\n  margin: 24px 16px;\n  display: flex;\n  justify-content: center;\n}\n\n.acc-reset-btn {\n  display: flex;\n  width: 100%;\n  align-items: center;\n  justify-content: center;\n  text-align: center;\n  padding: 12px 24px;\n  background-color: var(--acc-primary-color) !important;\n  border: none;\n  border-radius: var(--acc-button-border-radius);\n  font-weight: 600 !important;\n  font-size: 16px !important;\n  cursor: pointer;\n  transition: all 0.2s ease;\n}\n\n.acc-reset-btn > span {\n  color: var(--acc-text-color-inverted) !important;\n}\n\n.acc-reset-btn:hover {\n  background-color: var(--acc-primary-color-dark) !important;\n}\n\n.acc-reset-btn:focus {\n  outline: var(--acc-focus-outline-width) solid var(--acc-focus-ring-color);\n  outline-offset: var(--acc-focus-outline-offset);\n}\n\n.acc-reset-btn svg {\n  fill: var(--acc-text-color-inverted) !important;\n  width: 24px !important;\n  height: 24px !important;\n  margin-right: 8px;\n}\n\n/* Footer section */\n.acc-footer {\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  background: var(--acc-card-bg);\n  padding: 16px;\n  text-align: center;\n  border-top: 1px solid var(--acc-border-color);\n  z-index: 100;\n}\n\n.acc-footer a {\n  font-size: 14px !important;\n  text-decoration: none !important;\n  color: var(--acc-text-color) !important;\n  background: transparent !important;\n  font-weight: 600 !important;\n  padding: 8px;\n  border-radius: 4px;\n}\n\n.acc-footer a:hover {\n  text-decoration: underline !important;\n  color: var(--acc-primary-color) !important;\n}\n\n.acc-footer a:focus {\n  outline: var(--acc-focus-outline-width) solid var(--acc-focus-ring-color);\n  outline-offset: var(--acc-focus-outline-offset);\n}\n\n/* Content area */\n.acc-menu-content {\n  overflow: auto;\n  max-height: calc(100% - 80px);\n  padding: 24px 0 36px;\n}\n\n/* Text adjustments */\n.acc-text-adjust {\n  background: var(--acc-card-bg);\n  padding: 20px;\n  margin-bottom: 20px;\n  border-radius: var(--acc-border-radius);\n  border: 2px solid var(--acc-border-color);\n}\n\n.acc-text-adjust .acc-label {\n  display: flex;\n  justify-content: flex-start;\n}\n\n.acc-text-adjust > div {\n  display: flex;\n  justify-content: space-between;\n  margin-top: 20px;\n  align-items: center;\n  font-size: 16px;\n}\n\n.acc-text-adjust .acc-label div {\n  font-size: 16px !important;\n}\n\n.acc-text-adjust div[role=\"button\"] {\n  background: var(--acc-bg-color) !important;\n  border-radius: 50%;\n  width: 40px;\n  height: 40px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  border: 2px solid var(--acc-border-color);\n}\n\n.acc-text-adjust div[role=\"button\"]:hover {\n  border-color: var(--acc-hover-color);\n}\n\n.acc-text-adjust div[role=\"button\"]:focus {\n  outline: var(--acc-focus-outline-width) solid var(--acc-focus-ring-color);\n  outline-offset: var(--acc-focus-outline-offset);\n}\n\n/* Overlay */\n.acc-overlay {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  z-index: calc(var(--acc-widget-z-index, 100000) - 1);\n}\n\n/* Progress indicator */\n.acc-progress-indicator {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  gap: 4px;\n  margin-top: 8px;\n  height: 8px;\n}\n\n.acc-progress-dot {\n  width: 8px;\n  height: 8px;\n  border-radius: 50%;\n  background-color: var(--acc-border-color);\n  transition: background-color 0.2s ease;\n}\n\n.acc-progress-dot.active {\n  background-color: var(--acc-primary-color);\n}\n\n/* Selected state updates indicator colors */\n.acc-btn.acc-selected .acc-progress-dot.active {\n  background-color: var(--acc-bg-color);\n}\n\n/* Responsive adjustments */\n@media only screen and (max-width: 560px) {\n  .acc-menu { width: 100%; }\n}\n\n@media only screen and (max-width: 420px) {\n  .acc-options { \n    grid-template-columns: repeat(2, minmax(0, 1fr)); \n    gap: 12px; \n  }\n  .acc-btn {\n    padding: 8px;\n  }\n}\n\n/* Ensure proper focus visibility for assistive technology */\n@media (prefers-reduced-motion: reduce) {\n  .acc-menu,\n  .acc-btn,\n  .acc-lang-select,\n  .acc-progress-dot,\n  .acc-menu-header div[role=\"button\"],\n  .acc-reset-btn {\n    transition: none;\n  }\n}\n";

    var widgetCSS = "  /* Base styles for the widget */\n  .acc-widget, .acc-menu {\n    -webkit-user-select: none;\n    -moz-user-select: none;\n    -ms-user-select: none;\n    user-select: none;\n    font-weight: 400;\n    -webkit-font-smoothing: antialiased;\n  }\n  \n  .acc-widget *, .acc-menu * { \n    box-sizing: border-box !important; \n  }\n  \n  /* Accessibility toggle button */\n  .acc-toggle-btn {\n    position: fixed;\n    z-index: var(--acc-widget-z-index, 100000);\n    left: 30px;\n    bottom: 30px;\n    border-radius: 50%;\n    align-items: center;\n    justify-content: center;\n    width: var(--acc-button-size, 34px);\n    height: var(--acc-button-size, 34px);\n    display: flex;\n    cursor: pointer;\n    outline: 4px solid var(--acc-primary-color, #1976d2) !important;\n    border: 3px solid white !important;\n    box-shadow: 0 2px 5px rgba(0,0,0,0.2) !important;\n    background: var(--acc-primary-color, #1976d2) !important;\n    transition: transform 0.2s ease;\n  }\n  \n  .acc-toggle-btn svg {\n    width: 28px;\n    height: 28px;\n    fill: white;\n  }\n  \n  .acc-toggle-btn:hover {\n    transform: scale(1.04);\n  }\n\n  .acc-toggle-btn:focus {\n    outline: 3px solid var(--acc-primary-color, #1976d2) !important;\n    outline-offset: 2px;\n\n}\n  \n  @media (prefers-reduced-motion: reduce) {\n    .acc-toggle-btn {\n      transition: none;\n    }\n  }\n";

    var reportCSS = ".acc-report-panel {\n  display: none;\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  z-index: calc(var(--acc-widget-z-index, 100000) + 10);\n  font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif;\n}\n.acc-report-panel.acc-report-visible {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.acc-report-overlay {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: rgba(0, 0, 0, 0.6);\n}\n.acc-report-dialog {\n  position: relative;\n  background: #fff;\n  border-radius: 12px;\n  width: 90%;\n  max-width: 800px;\n  max-height: 85vh;\n  display: flex;\n  flex-direction: column;\n  box-shadow: 0 20px 60px rgba(0,0,0,0.3);\n}\n.acc-report-header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 16px 20px;\n  border-bottom: 1px solid #e0e0e0;\n}\n.acc-report-title {\n  margin: 0;\n  font-size: 18px;\n  font-weight: 600;\n  color: #1a1a1a;\n}\n.acc-report-close {\n  background: none;\n  border: none;\n  padding: 8px;\n  cursor: pointer;\n  border-radius: 6px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.acc-report-close:hover {\n  background: #f0f0f0;\n}\n.acc-report-close svg {\n  width: 20px;\n  height: 20px;\n  fill: #666;\n}\n.acc-report-status {\n  padding: 8px 20px;\n  font-size: 14px;\n  color: #666;\n  background: #f8f9fa;\n}\n.acc-report-content {\n  flex: 1;\n  overflow-y: auto;\n  padding: 16px 20px;\n}\n.acc-report-loading {\n  text-align: center;\n  padding: 40px;\n  color: #666;\n}\n.acc-report-error {\n  color: #d32f2f;\n  padding: 20px;\n  text-align: center;\n}\n.acc-report-summary {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));\n  gap: 12px;\n  margin-bottom: 20px;\n}\n.acc-report-stat {\n  background: #f8f9fa;\n  border-radius: 8px;\n  padding: 16px;\n  text-align: center;\n}\n.acc-report-stat-value {\n  font-size: 28px;\n  font-weight: 700;\n  display: block;\n}\n.acc-report-stat-label {\n  font-size: 12px;\n  color: #666;\n  text-transform: uppercase;\n  margin-top: 4px;\n}\n.acc-report-stat.critical .acc-report-stat-value { color: #d32f2f; }\n.acc-report-stat.serious .acc-report-stat-value { color: #f57c00; }\n.acc-report-stat.moderate .acc-report-stat-value { color: #fbc02d; }\n.acc-report-stat.minor .acc-report-stat-value { color: #7cb342; }\n.acc-report-stat.passed .acc-report-stat-value { color: #43a047; }\n.acc-report-section {\n  margin-bottom: 20px;\n}\n.acc-report-section-title {\n  font-size: 14px;\n  font-weight: 600;\n  color: #333;\n  margin-bottom: 12px;\n  padding-bottom: 8px;\n  border-bottom: 2px solid #e0e0e0;\n}\n.acc-report-violation {\n  background: #fff;\n  border: 1px solid #e0e0e0;\n  border-radius: 8px;\n  margin-bottom: 12px;\n  overflow: hidden;\n}\n.acc-report-violation-header {\n  padding: 12px 16px;\n  background: #f8f9fa;\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  gap: 12px;\n}\n.acc-report-violation-header:hover {\n  background: #f0f0f0;\n}\n.acc-report-violation-impact {\n  font-size: 11px;\n  font-weight: 600;\n  text-transform: uppercase;\n  padding: 4px 8px;\n  border-radius: 4px;\n  color: #fff;\n}\n.acc-report-violation-impact.critical { background: #d32f2f; }\n.acc-report-violation-impact.serious { background: #f57c00; }\n.acc-report-violation-impact.moderate { background: #fbc02d; color: #333; }\n.acc-report-violation-impact.minor { background: #7cb342; }\n.acc-report-violation-title {\n  flex: 1;\n  font-weight: 500;\n  color: #333;\n}\n.acc-report-violation-count {\n  font-size: 12px;\n  color: #666;\n  background: #e0e0e0;\n  padding: 2px 8px;\n  border-radius: 12px;\n}\n.acc-report-violation-details {\n  display: none;\n  padding: 16px;\n  border-top: 1px solid #e0e0e0;\n}\n.acc-report-violation.expanded .acc-report-violation-details {\n  display: block;\n}\n.acc-report-violation-desc {\n  color: #666;\n  font-size: 14px;\n  margin-bottom: 12px;\n}\n.acc-report-violation-help {\n  font-size: 13px;\n  margin-bottom: 12px;\n}\n.acc-report-violation-help a {\n  color: #1976d2;\n}\n.acc-report-node {\n  background: #f8f9fa;\n  border-radius: 6px;\n  padding: 12px;\n  margin-top: 8px;\n}\n.acc-report-node-html {\n  font-family: monospace;\n  font-size: 12px;\n  background: #263238;\n  color: #80cbc4;\n  padding: 8px 12px;\n  border-radius: 4px;\n  overflow-x: auto;\n  white-space: pre-wrap;\n  word-break: break-all;\n}\n.acc-report-node-fix {\n  margin-top: 8px;\n  font-size: 13px;\n  color: #333;\n}\n.acc-report-node-fix strong {\n  color: #1976d2;\n}\n.acc-report-success {\n  text-align: center;\n  padding: 40px;\n}\n.acc-report-success-icon {\n  width: 64px;\n  height: 64px;\n  background: #43a047;\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  margin: 0 auto 16px;\n}\n.acc-report-success-icon svg {\n  width: 32px;\n  height: 32px;\n  fill: #fff;\n}\n.acc-report-footer {\n  padding: 12px 20px;\n  border-top: 1px solid #e0e0e0;\n  text-align: center;\n}\n.acc-report-powered {\n  font-size: 12px;\n  color: #999;\n}\n@media (max-width: 600px) {\n  .acc-report-dialog {\n    width: 95%;\n    max-height: 90vh;\n  }\n  .acc-report-summary {\n    grid-template-columns: repeat(2, 1fr);\n  }\n}\n";

    var readingGuideCSS = ".acc-rg {\n  position: fixed;\n  left: 0;\n  right: 0;\n  width: 100%;\n  pointer-events: none;\n  background-color: rgba(0, 0, 0, 0.6);\n  z-index: calc(var(--acc-widget-z-index, 100000) + 1);\n}\n.acc-rg-top {\n  top: 0;\n}\n.acc-rg-bottom {\n  bottom: 0;\n}\n";

    var skipLinkCSS = ".acc-skip-link {\n  font-family: inherit;\n  position: fixed;\n  top: 16px;\n  left: 16px;\n  background: var(--acc-card-bg, #ffffff);\n  color: var(--acc-text-color, #222222);\n  border: 3px solid var(--acc-primary-color, #1976d2);\n  border-radius: var(--acc-button-border-radius, 0.4rem);\n  padding: 8px 16px;\n  z-index: calc(var(--acc-widget-z-index, 100000) + 2);\n  transform: translateY(-140%);\n  opacity: 0;\n  pointer-events: none;\n  transition: transform 0.2s ease, opacity 0.2s ease;\n  font-size: 16px;\n  line-height: 1.2;\n  font-weight: 600;\n  background-clip: padding-box;\n}\n.acc-skip-link:focus,\n.acc-skip-link:active {\n  transform: translateY(0);\n  opacity: 1;\n  pointer-events: auto;\n  outline: var(--acc-focus-outline-width, 3px) solid var(--acc-focus-ring-color, #1976d2);\n  outline-offset: var(--acc-focus-outline-offset, 2px);\n}\n";

    const STATIC_STYLE_ID = 'acc-static-styles';
    const STATIC_STYLES = [menuCSS, widgetCSS, reportCSS, readingGuideCSS, skipLinkCSS].join('\n');

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

    /** @type {{ [methodName: string]: (this: AccessibleWebWidget, ...args: any[]) => any }} */
    const featureMethods = {

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
              'cursor': `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='98px' height='98px' viewBox='0 0 48 48'%3E%3Cpath fill='%23E0E0E0' d='M27.8 39.7c-.1 0-.2 0-.4-.1s-.4-.3-.6-.5l-3.7-8.6-4.5 4.2c-.1.2-.3.3-.6.3-.1 0-.3 0-.4-.1-.3-.1-.6-.5-.6-.9V12c0-.4.2-.8.6-.9.1-.1.3-.1.4-.1.2 0 .5.1.7.3l16 15c.3.3.4.7.3 1.1-.1.4-.5.6-.9.7l-6.3.6 3.9 8.5c.1.2.1.5 0 .8-.1.2-.3.5-.5.6l-2.9 1.3c-.2-.2-.4-.2-.5-.2z'/%3E%3Cpath fill='%23212121' d='m18 12 16 15-7.7.7 4.5 9.8-2.9 1.3-4.3-9.9L18 34V12m0-2c-.3 0-.5.1-.8.2-.7.3-1.2 1-1.2 1.8v22c0 .8.5 1.5 1.2 1.8.3.2.6.2.8.2.5 0 1-.2 1.4-.5l3.4-3.2 3.1 7.3c.2.5.6.9 1.1 1.1.2.1.5.1.7.1.3 0 .5-.1.8-.2l2.9-1.3c.5-.2.9-.6 1.1-1.1.2-.5.2-1.1 0-1.5l-3.3-7.2 4.9-.4c.8-.1 1.5-.6 1.7-1.3.3-.7.1-1.6-.5-2.1l-16-15c-.3-.5-.8-.7-1.3-.7z'/%3E%3C/svg%3E") 40 15, auto`
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
          const axe = await this.loadAxeCore();
      
          // Run axe analysis
          const results = await axe.run(document, {
            runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice']
          });
      
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
          this.colorFilterKeys.forEach(filterKey => {
            const button = menu.querySelector(`.acc-btn[data-key="${filterKey}"]`);
            if (!button) return;
            const isActive = filterKey === activeKey;
            button.classList.toggle('acc-selected', isActive);
            button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
          });
        },

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
            selector: filter.selector || 'body > *:not(.acc-container)'
          };
          const css = this.buildCSS(adjustedFilter);
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
          this.updateState({ 'text-scale': multiply > 1 ? multiply : false });
          return this.textScaleIndex;
        },

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
        },

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
      /** @type {AccessibleWebWidgetInstance} */
      const widgetInstance = new AccessibleWebWidget();
      if (document.readyState === 'complete' || document.readyState === 'interactive') {
        widgetInstance.startAccessibleWebWidget();
      } else {
        document.addEventListener('DOMContentLoaded', () => widgetInstance.startAccessibleWebWidget());
      }
    }

    return AccessibleWebWidget;

})();
