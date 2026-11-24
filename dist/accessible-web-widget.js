/*!
 * AccessibleWeb Widget v1.7.0
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

    var _documentCurrentScript = typeof document !== 'undefined' ? document.currentScript : null;
    const WIDGET_THEME = {
          // Core colors
          primaryColor: '#0072e4',        // Blue, oklch(0.56 0.199 253); 4.6:1 with white (WCAG AA)
          primaryColorLight: '#4da1fe',   // Lighter blue, oklch(0.70 0.16 253)
          primaryColorDark: '#0049a5',    // Darker blue, oklch(0.42 0.17 253)
          backgroundColor: '#f3f5f8',
          textColor: '#222222',
          textColorInverted: '#ffffff',
          
          // UI elements
          buttonSize: '48px',
          cardBackground: '#ffffff',
          borderColor: '#d1d5db',
          focusRingColor: '#0072e4',      // Match primary
          
          // Interactive states
          hoverColor: '#c4cad3',          // Neutral grey; blue is kept for "on" and keyboard focus
          activeColor: '#0049a5',         // Use dark blue for active
          
          // Feedback colors
          successColor: '#2e7d32', // Green
          errorColor: '#c62828', // Red
          warningColor: '#f57c00', // Orange
          
          // Other UI properties
          headerHeight: '56px',
          borderRadius: '8px',
          buttonBorderRadius: '0.4rem',
          menuPosition: '', // optional 'left' | 'right'; empty follows the button position
          zIndex: 100000,
          
          // WCAG-specific
          focusBorderWidth: '3px',
          focusOutlineOffset: '2px'
        };

    // Menu icons: Phosphor Icons, Light weight (MIT, © Phosphor Icons). The
    // floating button's icons are Google Material Symbols (Apache 2.0).
    // Hide Images is the set's picture icon with a slash added here.
    const WIDGET_ICONS = {
          accessibility: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M423.5-743.5Q400-767 400-800t23.5-56.5Q447-880 480-880t56.5 23.5Q560-833 560-800t-23.5 56.5Q513-720 480-720t-56.5-23.5ZM360-80v-520q-60-5-122-15t-118-25l20-80q78 21 166 30.5t174 9.5q86 0 174-9.5T820-720l20 80q-56 15-118 25t-122 15v520h-80v-240h-80v240h-80Z"/></svg>',
          accessibilityVariants: {
                default: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M423.5-743.5Q400-767 400-800t23.5-56.5Q447-880 480-880t56.5 23.5Q560-833 560-800t-23.5 56.5Q513-720 480-720t-56.5-23.5ZM360-80v-520q-60-5-122-15t-118-25l20-80q78 21 166 30.5t174 9.5q86 0 174-9.5T820-720l20 80q-56 15-118 25t-122 15v520h-80v-240h-80v240h-80Z"/></svg>',
                'icon-2': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M423.5-743.5Q400-767 400-800t23.5-56.5Q447-880 480-880t56.5 23.5Q560-833 560-800t-23.5 56.5Q513-720 480-720t-56.5-23.5ZM360-80v-520H120v-80h720v80H600v520h-80v-240h-80v240h-80Z"/></svg>',
                'icon-3': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M423.5-743.5Q400-767 400-800t23.5-56.5Q447-880 480-880t56.5 23.5Q560-833 560-800t-23.5 56.5Q513-720 480-720t-56.5-23.5ZM680-80v-200H480q-33 0-56.5-23.5T400-360v-240q0-33 23.5-56.5T480-680q24 0 41.5 10.5T559-636q55 66 99.5 90.5T760-520v80q-53 0-107-23t-93-55v138h120q33 0 56.5 23.5T760-300v220h-80Zm-280 0q-83 0-141.5-58.5T200-280q0-72 45.5-127T360-476v82q-35 14-57.5 44.5T280-280q0 50 35 85t85 35q39 0 69.5-22.5T514-240h82q-14 69-69 114.5T400-80Z"/></svg>',
                'icon-4': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M320-80q-83 0-141.5-58.5T120-280q0-83 58.5-141.5T320-480v80q-50 0-85 35t-35 85q0 50 35 85t85 35q50 0 85-35t35-85h80q0 83-58.5 141.5T320-80Zm360-40v-200H440q-44 0-68-37.5t-6-78.5l74-164h-91l-24 62-77-22 28-72q9-23 29.5-35.5T350-680h208q45 0 68.5 36.5T632-566l-66 146h114q33 0 56.5 23.5T760-340v220h-80Zm-96.5-603.5Q560-747 560-780t23.5-56.5Q607-860 640-860t56.5 23.5Q720-813 720-780t-23.5 56.5Q673-700 640-700t-56.5-23.5Z"/></svg>'
          },
          largePointer: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path d="M166.59,134.1a1.91,1.91,0,0,1-.55-1.79,2,2,0,0,1,1.08-1.42l46.25-17.76.24-.1A14,14,0,0,0,212.38,87L52.29,34.7A13.95,13.95,0,0,0,34.7,52.29L87,212.38a13.82,13.82,0,0,0,12.6,9.6c.23,0,.46,0,.69,0A13.84,13.84,0,0,0,113,213.61a2.44,2.44,0,0,0,.1-.24l17.76-46.25a2,2,0,0,1,3.21-.53l51.31,51.31a14,14,0,0,0,19.8,0l12.69-12.69a14,14,0,0,0,0-19.8Zm42.82,62.63-12.68,12.68a2,2,0,0,1-2.83,0L142.59,158.1a14,14,0,0,0-22.74,4.32,2.44,2.44,0,0,0-.1.24L102,208.91a2,2,0,0,1-3.61-.26L46.11,48.57a1.87,1.87,0,0,1,.47-2A1.92,1.92,0,0,1,47.93,46a2.22,2.22,0,0,1,.64.1L208.65,98.38a2,2,0,0,1,.26,3.61l-46.25,17.76-.24.1a14,14,0,0,0-4.32,22.74h0l51.31,51.31A2,2,0,0,1,209.41,196.73Z"/></svg>',
          pauseMotion: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path d="M128,26A102,102,0,1,0,230,128,102.12,102.12,0,0,0,128,26Zm0,192a90,90,0,1,1,90-90A90.1,90.1,0,0,1,128,218ZM110,96v64a6,6,0,0,1-12,0V96a6,6,0,0,1,12,0Zm48,0v64a6,6,0,0,1-12,0V96a6,6,0,0,1,12,0Z"/></svg>',
          readingAid: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path d="M184,18H72A14,14,0,0,0,58,32V77.33a14,14,0,0,0,2.8,8.4l20.8,27.73a2,2,0,0,1,.4,1.21V224a14,14,0,0,0,14,14h64a14,14,0,0,0,14-14V114.67a2,2,0,0,1,.4-1.2l20.8-27.74a14,14,0,0,0,2.8-8.4V32A14,14,0,0,0,184,18ZM72,30H184a2,2,0,0,1,2,2V58H70V32A2,2,0,0,1,72,30ZM185.6,78.53l-20.8,27.74a14,14,0,0,0-2.8,8.4V224a2,2,0,0,1-2,2H96a2,2,0,0,1-2-2V114.67a14,14,0,0,0-2.8-8.4L70.4,78.54a2,2,0,0,1-.4-1.21V70H186v7.33A2,2,0,0,1,185.6,78.53ZM134,120v32a6,6,0,0,1-12,0V120a6,6,0,0,1,12,0Z"/></svg>',
          boldText: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path d="M174.69,116.41A42,42,0,0,0,148,42H80a6,6,0,0,0-6,6V200a6,6,0,0,0,6,6h80a46,46,0,0,0,14.69-89.59ZM86,54h62a30,30,0,0,1,0,60H86Zm74,140H86V126h74a34,34,0,0,1,0,68Z"/></svg>',
          lineSpacing: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path d="M222,128a6,6,0,0,1-6,6H40a6,6,0,0,1,0-12H216A6,6,0,0,1,222,128ZM100.24,52.24,122,30.49V96a6,6,0,0,0,12,0V30.49l21.76,21.75a6,6,0,0,0,8.48-8.48l-32-32a6,6,0,0,0-8.48,0l-32,32a6,6,0,0,0,8.48,8.48Zm55.52,151.52L134,225.51V160a6,6,0,0,0-12,0v65.51l-21.76-21.75a6,6,0,0,0-8.48,8.48l32,32a6,6,0,0,0,8.48,0l32-32a6,6,0,0,0-8.48-8.48Z"/></svg>',
          letterSpacing: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path d="M134,40V216a6,6,0,0,1-12,0V40a6,6,0,0,1,12,0ZM96,122H30.49l21.75-21.76a6,6,0,0,0-8.48-8.48l-32,32a6,6,0,0,0,0,8.48l32,32a6,6,0,0,0,8.48-8.48L30.49,134H96a6,6,0,0,0,0-12Zm148.24,1.76-32-32a6,6,0,0,0-8.48,8.48L225.51,122H160a6,6,0,0,0,0,12h65.51l-21.75,21.76a6,6,0,1,0,8.48,8.48l32-32A6,6,0,0,0,244.24,123.76Z"/></svg>',
          // Drawn by hand in the weight of the Phosphor Light set: the letters "Df".
          dyslexiaFont: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path fill-rule="evenodd" d="M42,58H74a70,70,0,0,1,0,140H42a6,6,0,0,1-6-6V64A6,6,0,0,1,42,58ZM48,70V186H74a58,58,0,0,0,0-116Z"/><path d="M178,198a6,6,0,0,0,12,0V92a22,22,0,0,1,22-22h4a6,6,0,0,0,0-12h-4a34,34,0,0,0-34,34Z"/><path d="M166,106H206a6,6,0,0,1,0,12H166a6,6,0,0,1,0-12Z"/></svg>',
          readableFont: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path d="M61.45,173.43a6,6,0,0,0,8-2.88L86.63,134h82.74l17.2,36.55A6,6,0,0,0,192,174a5.92,5.92,0,0,0,2.55-.57,6,6,0,0,0,2.88-8l-64-136a6,6,0,0,0-10.86,0l-64,136A6,6,0,0,0,61.45,173.43ZM128,46.09,163.72,122H92.28ZM222,216a6,6,0,0,1-6,6H40a6,6,0,0,1,0-12H216A6,6,0,0,1,222,216Z"/></svg>',
          highlightLinks: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path d="M238,88.18a52.42,52.42,0,0,1-15.4,35.66l-34.75,34.75A52.28,52.28,0,0,1,150.62,174h-.05A52.63,52.63,0,0,1,98,119.9a6,6,0,0,1,6-5.84h.17a6,6,0,0,1,5.83,6.16A40.62,40.62,0,0,0,150.58,162h0a40.4,40.4,0,0,0,28.73-11.9l34.75-34.74A40.63,40.63,0,0,0,156.63,57.9l-11,11a6,6,0,0,1-8.49-8.49l11-11a52.62,52.62,0,0,1,74.43,0A52.83,52.83,0,0,1,238,88.18Zm-127.62,98.9-11,11A40.36,40.36,0,0,1,70.6,210h0a40.63,40.63,0,0,1-28.7-69.36L76.62,105.9A40.63,40.63,0,0,1,146,135.77a6,6,0,0,0,5.83,6.16H152a6,6,0,0,0,6-5.84A52.63,52.63,0,0,0,68.14,97.42L33.38,132.16A52.63,52.63,0,0,0,70.56,222h0a52.26,52.26,0,0,0,37.22-15.42l11-11a6,6,0,1,0-8.49-8.48Z"/></svg>',
          contrast: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path d="M128,26A102,102,0,1,0,230,128,102.12,102.12,0,0,0,128,26Zm6,12.2a89.86,89.86,0,0,1,20,3.63V214.17a89.86,89.86,0,0,1-20,3.63Zm32,8.23a90.48,90.48,0,0,1,20,12.81V196.76a90.48,90.48,0,0,1-20,12.81ZM38,128a90.12,90.12,0,0,1,84-89.8V217.8A90.12,90.12,0,0,1,38,128Zm160,56.5V71.5a89.81,89.81,0,0,1,0,113Z"/></svg>',
          smartContrast: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path d="M246,152a6,6,0,0,1-6,6H222v18a6,6,0,0,1-12,0V158H192a6,6,0,0,1,0-12h18V128a6,6,0,0,1,12,0v18h18A6,6,0,0,1,246,152ZM56,70H74V88a6,6,0,0,0,12,0V70h18a6,6,0,0,0,0-12H86V40a6,6,0,0,0-12,0V58H56a6,6,0,0,0,0,12ZM184,194H174V184a6,6,0,0,0-12,0v10H152a6,6,0,0,0,0,12h10v10a6,6,0,0,0,12,0V206h10a6,6,0,0,0,0-12ZM217.9,78.59,78.58,217.9a14,14,0,0,1-19.8,0L38.09,197.21a14,14,0,0,1,0-19.8L177.41,38.1a14,14,0,0,1,19.8,0L217.9,58.79A14,14,0,0,1,217.9,78.59ZM167.51,112,144,88.49,46.58,185.9a2,2,0,0,0,0,2.83l20.69,20.68a2,2,0,0,0,2.82,0h0Zm41.9-44.73L188.73,46.59a2,2,0,0,0-2.83,0L152.48,80,176,103.52,209.41,70.1A2,2,0,0,0,209.41,67.27Z"/></svg>',
          darkContrast: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path d="M232.13,143.64a6,6,0,0,0-6-1.49A90.07,90.07,0,0,1,113.86,29.85a6,6,0,0,0-7.49-7.48A102.88,102.88,0,0,0,54.48,58.68,102,102,0,0,0,197.32,201.52a102.88,102.88,0,0,0,36.31-51.89A6,6,0,0,0,232.13,143.64Zm-42,48.29a90,90,0,0,1-126-126A90.9,90.9,0,0,1,99.65,37.66,102.06,102.06,0,0,0,218.34,156.35,90.9,90.9,0,0,1,190.1,191.93Z"/></svg>',
          lightContrast: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path d="M122,40V16a6,6,0,0,1,12,0V40a6,6,0,0,1-12,0Zm68,88a62,62,0,1,1-62-62A62.07,62.07,0,0,1,190,128Zm-12,0a50,50,0,1,0-50,50A50.06,50.06,0,0,0,178,128ZM59.76,68.24a6,6,0,1,0,8.48-8.48l-16-16a6,6,0,0,0-8.48,8.48Zm0,119.52-16,16a6,6,0,1,0,8.48,8.48l16-16a6,6,0,1,0-8.48-8.48ZM192,70a6,6,0,0,0,4.24-1.76l16-16a6,6,0,0,0-8.48-8.48l-16,16A6,6,0,0,0,192,70Zm4.24,117.76a6,6,0,0,0-8.48,8.48l16,16a6,6,0,0,0,8.48-8.48ZM46,128a6,6,0,0,0-6-6H16a6,6,0,0,0,0,12H40A6,6,0,0,0,46,128Zm82,82a6,6,0,0,0-6,6v24a6,6,0,0,0,12,0V216A6,6,0,0,0,128,210Zm112-88H216a6,6,0,0,0,0,12h24a6,6,0,0,0,0-12Z"/></svg>',
          invertColors: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path d="M172.53,49.06a251.42,251.42,0,0,0-41.09-38,6,6,0,0,0-6.88,0,251.42,251.42,0,0,0-41.09,38C56.34,80.26,42,113.09,42,144a86,86,0,0,0,172,0C214,113.09,199.66,80.26,172.53,49.06ZM202,144a75,75,0,0,1-.69,10H134V134h67.44A92.09,92.09,0,0,1,202,144ZM186.8,90H134V70h39.89A176,176,0,0,1,186.8,90ZM134,198h44.52A73.76,73.76,0,0,1,134,217.74Zm0-12V166h64.66a74.05,74.05,0,0,1-9.78,20Zm0-64V102h58.7a117.43,117.43,0,0,1,6.69,20Zm30.29-64H134V28.3A257.09,257.09,0,0,1,164.29,58ZM54,144c0-53.42,47.35-98.56,68-115.7V217.74A74.09,74.09,0,0,1,54,144Z"/></svg>',
          saturation: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path d="M172.53,49.06a252.86,252.86,0,0,0-41.09-38,6,6,0,0,0-6.88,0,252.86,252.86,0,0,0-41.09,38C56.34,80.26,42,113.09,42,144a86,86,0,0,0,172,0C214,113.09,199.66,80.26,172.53,49.06ZM128,218a74.09,74.09,0,0,1-74-74c0-59.62,59-108.93,74-120.51C143,35.07,202,84.38,202,144A74.09,74.09,0,0,1,128,218Zm53.92-65A55.58,55.58,0,0,1,137,197.92a7,7,0,0,1-1,.08,6,6,0,0,1-1-11.92c17.38-2.92,32.13-17.68,35.08-35.08a6,6,0,1,1,11.84,2Z"/></svg>',
          lowSaturation: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path d="M172.53,49.06a251.42,251.42,0,0,0-41.09-38,6,6,0,0,0-6.88,0,251.42,251.42,0,0,0-41.09,38C56.34,80.26,42,113.09,42,144a86,86,0,0,0,172,0C214,113.09,199.66,80.26,172.53,49.06ZM188.88,186H67.12a74.05,74.05,0,0,1-9.78-20H198.66A74.05,74.05,0,0,1,188.88,186ZM54.69,154A75,75,0,0,1,54,144a92.09,92.09,0,0,1,.56-10H201.44a92.09,92.09,0,0,1,.56,10,75,75,0,0,1-.69,10ZM128,23.49c13.13,10.12,59.83,49.06,71.39,98.51H56.61C68.17,72.55,114.87,33.61,128,23.49ZM77.48,198h101a73.81,73.81,0,0,1-101,0Z"/></svg>',
          highSaturation: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path d="M199.37,55.31A101.32,101.32,0,0,0,128,26h-1A102,102,0,0,0,26,128c0,42.09,26.07,77.44,68,92.26A30.21,30.21,0,0,0,104.11,222,30.06,30.06,0,0,0,134,192a18,18,0,0,1,18-18h46.21a29.82,29.82,0,0,0,29.25-23.31A102.71,102.71,0,0,0,230,127.11,101.25,101.25,0,0,0,199.37,55.31ZM215.76,148a17.89,17.89,0,0,1-17.55,14H152a30,30,0,0,0-30,30,18,18,0,0,1-24,17C61,195.86,38,164.85,38,128a90,90,0,0,1,89.07-90H128a90.34,90.34,0,0,1,90,89.22A90.46,90.46,0,0,1,215.76,148ZM138,76a10,10,0,1,1-10-10A10,10,0,0,1,138,76ZM94,100A10,10,0,1,1,84,90,10,10,0,0,1,94,100Zm0,56a10,10,0,1,1-10-10A10,10,0,0,1,94,156Zm88-56a10,10,0,1,1-10-10A10,10,0,0,1,182,100Z"/></svg>',
          monochrome: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path d="M52.44,36A6,6,0,0,0,43.56,44l23.7,26.07C50.51,94.93,42,119.77,42,144a86,86,0,0,0,147.28,60.33L203.56,220a6,6,0,0,0,8.88-8.08ZM128,218a74.09,74.09,0,0,1-74-74c0-21,7.27-42.76,21.59-64.73L181.18,195.42A73.81,73.81,0,0,1,128,218ZM91.4,49.07a6,6,0,0,1-.2-8.49,245.6,245.6,0,0,1,33.36-29.49,6,6,0,0,1,6.88,0,251.42,251.42,0,0,1,41.09,38C199.66,80.26,214,113.09,214,144a86.2,86.2,0,0,1-3.08,22.87,6,6,0,0,1-5.78,4.41,6.2,6.2,0,0,1-1.59-.21,6,6,0,0,1-4.2-7.38A74,74,0,0,0,202,144c0-59.63-59-108.94-74-120.52A253.83,253.83,0,0,0,99.88,48.86,6,6,0,0,1,91.4,49.07Z"/></svg>',
          more: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path d="M144,128a16,16,0,1,1-16-16A16,16,0,0,1,144,128ZM60,112a16,16,0,1,0,16,16A16,16,0,0,0,60,112Zm136,0a16,16,0,1,0,16,16A16,16,0,0,0,196,112Z"/></svg>',
          moveWidget: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path d="M212.24,171.76a6,6,0,0,1,0,8.48l-32,32a6,6,0,0,1-8.48-8.48L193.51,182H48a6,6,0,0,1,0-12H193.51l-21.75-21.76a6,6,0,0,1,8.48-8.48ZM75.76,116.24a6,6,0,0,0,8.48-8.48L62.49,86H208a6,6,0,0,0,0-12H62.49L84.24,52.24a6,6,0,0,0-8.48-8.48l-32,32a6,6,0,0,0,0,8.48Z"/></svg>',
          hideWidget: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path d="M52.44,36A6,6,0,0,0,43.56,44L64.44,67c-37.28,21.9-53.23,57-53.92,58.57a6,6,0,0,0,0,4.88c.34.77,8.66,19.22,27.24,37.8C55,185.47,84.62,206,128,206a124.91,124.91,0,0,0,52.57-11.25l23,25.29a6,6,0,0,0,8.88-8.08Zm48.62,71.32,45,49.52a34,34,0,0,1-45-49.52ZM128,194c-31.38,0-58.78-11.42-81.45-33.93A134.57,134.57,0,0,1,22.69,128c4.29-8.2,20.1-35.18,50-51.91L92.89,98.3a46,46,0,0,0,61.35,67.48l17.81,19.6A113.47,113.47,0,0,1,128,194Zm6.4-99.4a6,6,0,0,1,2.25-11.79,46.17,46.17,0,0,1,37.15,40.87,6,6,0,0,1-5.42,6.53l-.56,0a6,6,0,0,1-6-5.45A34.1,34.1,0,0,0,134.4,94.6Zm111.08,35.85c-.41.92-10.37,23-32.86,43.12a6,6,0,1,1-8-8.94A134.07,134.07,0,0,0,233.31,128a134.67,134.67,0,0,0-23.86-32.07C186.78,73.42,159.38,62,128,62a120.19,120.19,0,0,0-19.69,1.6,6,6,0,1,1-2-11.83A131.12,131.12,0,0,1,128,50c43.38,0,73,20.54,90.24,37.76,18.58,18.58,26.9,37,27.24,37.81A6,6,0,0,1,245.48,130.45Z"/></svg>',
          reset: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path d="M222,128a94,94,0,0,1-92.74,94H128a93.43,93.43,0,0,1-64.5-25.65,6,6,0,1,1,8.24-8.72A82,82,0,1,0,70,70l-.19.19L39.44,98H72a6,6,0,0,1,0,12H24a6,6,0,0,1-6-6V56a6,6,0,0,1,12,0V90.34L61.63,61.4A94,94,0,0,1,222,128Z"/></svg>',
          copy: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path d="M216,34H88a6,6,0,0,0-6,6V82H40a6,6,0,0,0-6,6V216a6,6,0,0,0,6,6H168a6,6,0,0,0,6-6V174h42a6,6,0,0,0,6-6V40A6,6,0,0,0,216,34ZM162,210H46V94H162Zm48-48H174V88a6,6,0,0,0-6-6H94V46H210Z"/></svg>',
          check: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path d="M228.24,76.24l-128,128a6,6,0,0,1-8.48,0l-56-56a6,6,0,0,1,8.48-8.48L96,191.51,219.76,67.76a6,6,0,0,1,8.48,8.48Z"/></svg>',
          externalLink: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path d="M222,104a6,6,0,0,1-12,0V54.49l-69.75,69.75a6,6,0,0,1-8.48-8.48L201.51,46H152a6,6,0,0,1,0-12h64a6,6,0,0,1,6,6Zm-38,26a6,6,0,0,0-6,6v72a2,2,0,0,1-2,2H48a2,2,0,0,1-2-2V80a2,2,0,0,1,2-2h72a6,6,0,0,0,0-12H48A14,14,0,0,0,34,80V208a14,14,0,0,0,14,14H176a14,14,0,0,0,14-14V136A6,6,0,0,0,184,130Z"/></svg>',
          close: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path d="M204.24,195.76a6,6,0,1,1-8.48,8.48L128,136.49,60.24,204.24a6,6,0,0,1-8.48-8.48L119.51,128,51.76,60.24a6,6,0,0,1,8.48-8.48L128,119.51l67.76-67.75a6,6,0,0,1,8.48,8.48L136.49,128Z"/></svg>',
          language: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path d="M128,26A102,102,0,1,0,230,128,102.12,102.12,0,0,0,128,26Zm81.57,64H169.19a132.58,132.58,0,0,0-25.73-50.67A90.29,90.29,0,0,1,209.57,90ZM218,128a89.7,89.7,0,0,1-3.83,26H171.81a155.43,155.43,0,0,0,0-52h42.36A89.7,89.7,0,0,1,218,128Zm-90,87.83a110,110,0,0,1-15.19-19.45A124.24,124.24,0,0,1,99.35,166h57.3a124.24,124.24,0,0,1-13.46,30.38A110,110,0,0,1,128,215.83ZM96.45,154a139.18,139.18,0,0,1,0-52h63.1a139.18,139.18,0,0,1,0,52ZM38,128a89.7,89.7,0,0,1,3.83-26H84.19a155.43,155.43,0,0,0,0,52H41.83A89.7,89.7,0,0,1,38,128Zm90-87.83a110,110,0,0,1,15.19,19.45A124.24,124.24,0,0,1,156.65,90H99.35a124.24,124.24,0,0,1,13.46-30.38A110,110,0,0,1,128,40.17Zm-15.46-.84A132.58,132.58,0,0,0,86.81,90H46.43A90.29,90.29,0,0,1,112.54,39.33ZM46.43,166H86.81a132.58,132.58,0,0,0,25.73,50.67A90.29,90.29,0,0,1,46.43,166Zm97,50.67A132.58,132.58,0,0,0,169.19,166h40.38A90.29,90.29,0,0,1,143.46,216.67Z"/></svg>',
          profiles: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path d="M229.19,213c-15.81-27.32-40.63-46.49-69.47-54.62a70,70,0,1,0-63.44,0C67.44,166.5,42.62,185.67,26.81,213a6,6,0,1,0,10.38,6C56.4,185.81,90.34,166,128,166s71.6,19.81,90.81,53a6,6,0,1,0,10.38-6ZM70,96a58,58,0,1,1,58,58A58.07,58.07,0,0,1,70,96Z"/></svg>',
          adjustFontSize: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path d="M85.43,53.45a6,6,0,0,0-10.86,0l-64,136a6,6,0,1,0,10.86,5.11L38.63,158h82.74l17.2,36.55a6,6,0,1,0,10.86-5.11ZM44.28,146,80,70.09,115.72,146ZM200,98c-12.21,0-21.71,3.28-28.23,9.74a6,6,0,0,0,8.46,8.52c4.18-4.15,10.84-6.26,19.77-6.26,14.34,0,26,9.87,26,22v7.24A40.36,40.36,0,0,0,200,130c-20.95,0-38,15.25-38,34s17.05,34,38,34a40.36,40.36,0,0,0,26-9.24V192a6,6,0,0,0,12,0V132C238,113.25,221,98,200,98Zm0,88c-14.34,0-26-9.87-26-22s11.66-22,26-22,26,9.87,26,22S214.34,186,200,186Z"/></svg>',
          hideImages: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><mask id="acc-hide-images-cut"><rect width="256" height="256" fill="#fff"/><path d="M48 40 208 216" fill="none" stroke="#000" stroke-width="30" stroke-linecap="round"/></mask><path mask="url(#acc-hide-images-cut)" d="M216,42H40A14,14,0,0,0,26,56V200a14,14,0,0,0,14,14H216a14,14,0,0,0,14-14V56A14,14,0,0,0,216,42ZM40,54H216a2,2,0,0,1,2,2V163.57L188.53,134.1a14,14,0,0,0-19.8,0l-21.42,21.42L101.9,110.1a14,14,0,0,0-19.8,0L38,154.2V56A2,2,0,0,1,40,54ZM38,200V171.17l52.58-52.58a2,2,0,0,1,2.84,0L176.83,202H40A2,2,0,0,1,38,200Zm178,2H193.8l-38-38,21.41-21.42a2,2,0,0,1,2.83,0l38,38V200A2,2,0,0,1,216,202ZM146,100a10,10,0,1,1,10,10A10,10,0,0,1,146,100Z"/><path d="M43.56 44.04 203.56 220.04a6 6 0 0 0 8.88-8.08L52.44 35.96a6 6 0 0 0-8.88 8.08z"/></svg>',
          accessibilityReport: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path d="M166,152a6,6,0,0,1-6,6H96a6,6,0,0,1,0-12h64A6,6,0,0,1,166,152Zm-6-38H96a6,6,0,0,0,0,12h64a6,6,0,0,0,0-12Zm54-66V216a14,14,0,0,1-14,14H56a14,14,0,0,1-14-14V48A14,14,0,0,1,56,34H93.17a45.91,45.91,0,0,1,69.66,0H200A14,14,0,0,1,214,48ZM94,64v2h68V64a34,34,0,0,0-68,0ZM202,48a2,2,0,0,0-2-2H170.33A45.77,45.77,0,0,1,174,64v8a6,6,0,0,1-6,6H88a6,6,0,0,1-6-6V64a45.77,45.77,0,0,1,3.67-18H56a2,2,0,0,0-2,2V216a2,2,0,0,0,2,2H200a2,2,0,0,0,2-2Z"/></svg>',
          annotations: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path d="M228.24,59.76l-32-32a6,6,0,0,0-8.48,0l-96,96A6,6,0,0,0,90,128v32a6,6,0,0,0,6,6h32a6,6,0,0,0,4.24-1.76l96-96A6,6,0,0,0,228.24,59.76ZM125.51,154H102V130.49l66-66L191.51,88ZM200,79.51,176.49,56,192,40.49,215.51,64ZM222,128v80a14,14,0,0,1-14,14H48a14,14,0,0,1-14-14V48A14,14,0,0,1,48,34h80a6,6,0,0,1,0,12H48a2,2,0,0,0-2,2V208a2,2,0,0,0,2,2H208a2,2,0,0,0,2-2V128a6,6,0,0,1,12,0Z"/></svg>',
          textToSpeech: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path d="M154.64,26.61a6,6,0,0,0-6.32.65L77.94,82H32A14,14,0,0,0,18,96v64a14,14,0,0,0,14,14H77.94l70.38,54.74A6,6,0,0,0,158,224V32A6,6,0,0,0,154.64,26.61ZM30,160V96a2,2,0,0,1,2-2H74v68H32A2,2,0,0,1,30,160Zm116,51.73L86,165.07V90.93l60-46.66Zm50.53-108.85a38,38,0,0,1,0,50.24,6,6,0,1,1-9-7.94,26,26,0,0,0,0-34.37,6,6,0,0,1,9-7.93ZM246,128a77.86,77.86,0,0,1-19.86,52,6,6,0,1,1-8.94-8,66,66,0,0,0,0-88,6,6,0,1,1,8.94-8A77.86,77.86,0,0,1,246,128Z"/></svg>',
          highContrast: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path d="M200.12,55.88A102,102,0,1,0,55.88,200.13,102,102,0,1,0,200.12,55.88ZM90,209.62a89.61,89.61,0,0,1-21.23-13.89L90,174.49Zm32,8.16a90,90,0,0,1-20-3.58V162.49l20-20Zm32-3.58a89.8,89.8,0,0,1-20,3.58V130.49l20-20Zm32-17.4a89.45,89.45,0,0,1-20,12.83V98.49l20-20ZM60.27,187.24a90,90,0,0,1,127-127ZM198,184.57V71.43a90,90,0,0,1,0,113.14Z"/></svg>',
          simplifyLayout: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path d="M216,42H40A14,14,0,0,0,26,56V200a14,14,0,0,0,14,14H216a14,14,0,0,0,14-14V56A14,14,0,0,0,216,42Zm2,158a2,2,0,0,1-2,2H40a2,2,0,0,1-2-2V56a2,2,0,0,1,2-2H216a2,2,0,0,1,2,2ZM182,96a6,6,0,0,1-6,6H80a6,6,0,0,1,0-12h96A6,6,0,0,1,182,96Zm0,32a6,6,0,0,1-6,6H80a6,6,0,0,1,0-12h96A6,6,0,0,1,182,128Zm0,32a6,6,0,0,1-6,6H80a6,6,0,0,1,0-12h96A6,6,0,0,1,182,160Z"/></svg>',
          muteSounds: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path d="M52.44,36A6,6,0,0,0,43.56,44L78,81.94l-.08.06H32A14,14,0,0,0,18,96v64a14,14,0,0,0,14,14H77.94l70.38,54.74A6,6,0,0,0,158,224V169.92L203.56,220a6,6,0,0,0,8.88-8.08ZM30,160V96a2,2,0,0,1,2-2H74v68H32A2,2,0,0,1,30,160Zm116,51.73L86,165.07V90.93l.11-.08L146,156.72Zm41.5-66.53a26,26,0,0,0,0-34.37,6,6,0,1,1,9-7.93,38,38,0,0,1,0,50.24,6,6,0,0,1-9-7.94ZM107.41,66.68a6,6,0,0,1,1.06-8.42l39.85-31A6,6,0,0,1,158,32v74.83a6,6,0,0,1-12,0V44.27L115.83,67.73A6,6,0,0,1,107.41,66.68ZM246,128a77.86,77.86,0,0,1-19.86,52,6,6,0,1,1-8.94-8,66,66,0,0,0,0-88,6,6,0,1,1,8.94-8A77.86,77.86,0,0,1,246,128Z"/></svg>',
          tooltips: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path d="M166,104a6,6,0,0,1-6,6H96a6,6,0,0,1,0-12h64A6,6,0,0,1,166,104Zm-6,26H96a6,6,0,0,0,0,12h64a6,6,0,0,0,0-12Zm70-74V184a14,14,0,0,1-14,14H154.41L140.16,223a14,14,0,0,1-24.32,0L101.59,198H40a14,14,0,0,1-14-14V56A14,14,0,0,1,40,42H216A14,14,0,0,1,230,56Zm-12,0a2,2,0,0,0-2-2H40a2,2,0,0,0-2,2V184a2,2,0,0,0,2,2h65.07a6,6,0,0,1,5.21,3l16,28a2,2,0,0,0,3.48,0l16-28a6,6,0,0,1,5.21-3H216a2,2,0,0,0,2-2Z"/></svg>',
          textMagnifier: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path d="M150,112a6,6,0,0,1-6,6H118v26a6,6,0,0,1-12,0V118H80a6,6,0,0,1,0-12h26V80a6,6,0,0,1,12,0v26h26A6,6,0,0,1,150,112Zm78.24,116.24a6,6,0,0,1-8.48,0l-51.38-51.38a86.15,86.15,0,1,1,8.48-8.48l51.38,51.38A6,6,0,0,1,228.24,228.24ZM112,186a74,74,0,1,0-74-74A74.09,74.09,0,0,0,112,186Z"/></svg>',
          pageStructure: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path d="M160,110h48a14,14,0,0,0,14-14V48a14,14,0,0,0-14-14H160a14,14,0,0,0-14,14V66H128a22,22,0,0,0-22,22v34H70V112A14,14,0,0,0,56,98H24a14,14,0,0,0-14,14v32a14,14,0,0,0,14,14H56a14,14,0,0,0,14-14V134h36v34a22,22,0,0,0,22,22h18v18a14,14,0,0,0,14,14h48a14,14,0,0,0,14-14V160a14,14,0,0,0-14-14H160a14,14,0,0,0-14,14v18H128a10,10,0,0,1-10-10V88a10,10,0,0,1,10-10h18V96A14,14,0,0,0,160,110ZM58,144a2,2,0,0,1-2,2H24a2,2,0,0,1-2-2V112a2,2,0,0,1,2-2H56a2,2,0,0,1,2,2Zm100,16a2,2,0,0,1,2-2h48a2,2,0,0,1,2,2v48a2,2,0,0,1-2,2H160a2,2,0,0,1-2-2Zm0-112a2,2,0,0,1,2-2h48a2,2,0,0,1,2,2V96a2,2,0,0,1-2,2H160a2,2,0,0,1-2-2Z"/></svg>'
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
            "Accessibility": "Accessibility",
            "Accessibility Options": "Accessibility Options",
            "Accessibility Menu": "Accessibility Menu",
            "Accessibility Statement": "Accessibility Statement",
            "Hide widget": "Hide widget",
            "Move widget": "Move widget",
            "This visit": "This visit",
            "One day": "One day",
            "One week": "One week",
            "Always": "Always",
            "The widget stays hidden until you clear this site's data in your browser.": "The widget stays hidden until you clear this site's data in your browser.",
            "To bring it back sooner, clear this site's data in your browser.": "To bring it back sooner, clear this site's data in your browser.",
            "Hide": "Hide",
            "Reset settings": "Reset settings",
            "Reset All Settings": "Reset All Settings",
            "Close": "Close",
            "Content Adjustments": "Content Adjustments",
            "Adjust Font Size": "Adjust Font Size",
            "Highlight Links": "Highlight Links",
            "Readable Font": "Readable Font",
            "Color Adjustments": "Color Adjustments",
            "Invert Colors": "Invert Colors",
            "Light Contrast": "Light Contrast",
            "Dark Contrast": "Dark Contrast",
            "High Contrast": "High Contrast",
            "Smart Contrast": "Smart Contrast",
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
            "Legible Font": "Legible Font",
            "Font Size": "Font Size",
            "Language": "Language",
            "All Languages": "All Languages",
            "Search language": "Search language",
            "Open Accessibility Menu": "Open Accessibility Menu",
            "Open accessibility menu": "Open accessibility menu",
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
            "Speech": "Speech",
            "Text": "Text",
            "Color & Contrast": "Color & Contrast",
            "Reading Aids": "Reading Aids",
            "Interaction": "Interaction",
            "Contrast": "Contrast",
            "Saturation": "Saturation",
            "Light": "Light",
            "Dark": "Dark",
            "High": "High",
            "Low": "Low",
            "Play": "Play",
            "Pause": "Pause",
            "Stop": "Stop",
            "Loading voice...": "Loading voice...",
            "Reading...": "Reading...",
            "Profiles": "Profiles",
            "Seizure Safe": "Seizure Safe",
            "Vision Impaired": "Vision Impaired",
            "ADHD Friendly": "ADHD Friendly",
            "Dyslexia Friendly": "Dyslexia Friendly",
            "On": "On",
            "Off": "Off",
            "Mute Sounds": "Mute Sounds",
            "Page Structure": "Page Structure",
            "Text Magnifier": "Text Magnifier",
            "Tooltips": "Tooltips",
            "Navigation": "Navigation",
            "Header": "Header",
            "Main content": "Main content",
            "Footer": "Footer",
            "Sidebar": "Sidebar",
            "Search": "Search",
            "Form": "Form",
            "Section": "Section",
            "Headings": "Headings",
            "Landmarks": "Landmarks",
            "Links": "Links",
            "No items found": "No items found",
            "Settings reset": "Settings reset",
          },
          pt: {
            "Accessibility": "Acessibilidade",
            "Accessibility Options": "Opções de acessibilidade",
            "Accessibility Menu": "Menu de Acessibilidade",
            "Accessibility Statement": "Declaração de Acessibilidade",
            "Hide widget": "Ocultar widget",
            "Move widget": "Mover widget",
            "This visit": "Esta visita",
            "One day": "Um dia",
            "One week": "Uma semana",
            "Always": "Sempre",
            "The widget stays hidden until you clear this site's data in your browser.": "O widget fica oculto até limpar os dados deste site no seu navegador.",
            "To bring it back sooner, clear this site's data in your browser.": "Para trazê-lo de volta antes, limpe os dados deste site no seu navegador.",
            "Hide": "Ocultar",
            "Reset settings": "Redefinir configurações",
            "Reset All Settings": "Redefinir todas as configurações",
            "Close": "Fechar",
            "Content Adjustments": "Ajustes de Conteúdo",
            "Adjust Font Size": "Ajustar Tamanho da Fonte",
            "Highlight Links": "Destacar Links",
            "Readable Font": "Fonte Legível",
            "Color Adjustments": "Ajustes de Cor",
            "Invert Colors": "Inverter Cores",
            "Light Contrast": "Contraste Claro",
            "Dark Contrast": "Contraste Escuro",
            "High Contrast": "Alto Contraste",
            "Smart Contrast": "Contraste Inteligente",
            "High Saturation": "Alta Saturação",
            "Low Saturation": "Baixa Saturação",
            "Monochrome": "Monocromático",
            "Tools": "Ferramentas",
            "Reading Guide": "Guia de Leitura",
            "Stop Animations": "Parar Animações",
            "Big Cursor": "Cursor Grande",
            "Increase Font Size": "Aumentar Tamanho da Fonte",
            "Decrease Font Size": "Diminuir Tamanho da Fonte",
            "Letter Spacing": "Espaçamento entre Letras",
            "Line Height": "Altura da Linha",
            "Font Weight": "Peso da Fonte",
            "Dyslexia Font": "Fonte para Dislexia",
            "Legible Font": "Fonte Legível",
            "Font Size": "Tamanho da Fonte",
            "Language": "Idioma",
            "All Languages": "Todos os Idiomas",
            "Search language": "Buscar idioma",
            "Open Accessibility Menu": "Abrir Menu de Acessibilidade",
            "Open accessibility menu": "Abrir menu de acessibilidade",
            "Hide Images": "Ocultar Imagens",
            "Skip to accessibility menu": "Ir para o menu de acessibilidade",
            "Accessibility Report": "Relatório de Acessibilidade",
            "Run Accessibility Check": "Executar Verificação de Acessibilidade",
            "Loading...": "Carregando...",
            "Analyzing page...": "Analisando página...",
            "Critical": "Crítico",
            "Serious": "Sério",
            "Moderate": "Moderado",
            "Minor": "Leve",
            "Violations Found": "Violações Encontradas",
            "No Issues Found": "Nenhum Problema Encontrado",
            "Element": "Elemento",
            "Issue": "Problema",
            "How to Fix": "Como Corrigir",
            "Close Report": "Fechar Relatório",
            "Passed Tests": "Testes Aprovados",
            "Items Need Review": "Itens Precisam de Revisão",
            "Annotations": "Anotações",
            "Text to Speech": "Texto para Fala",
            "Text to Speech On": "Texto para Fala Ativado",
            "Text to Speech Off": "Texto para Fala Desativado",
            "Simplify Layout": "Simplificar Layout",
            "Speech": "Fala",
            "Text": "Texto",
            "Color & Contrast": "Cor e Contraste",
            "Reading Aids": "Ajudas de Leitura",
            "Interaction": "Interação",
            "Contrast": "Contraste",
            "Saturation": "Saturação",
            "Light": "Claro",
            "Dark": "Escuro",
            "High": "Alto",
            "Low": "Baixo",
            "Play": "Reproduzir",
            "Pause": "Pausar",
            "Stop": "Parar",
            "Loading voice...": "Carregando voz...",
            "Reading...": "Lendo...",
            "Profiles": "Perfis",
            "Seizure Safe": "Seguro para Epilepsia",
            "Vision Impaired": "Deficiência Visual",
            "ADHD Friendly": "Adaptado para TDAH",
            "Dyslexia Friendly": "Adaptado para Dislexia",
            "On": "Ativado",
            "Off": "Desativado",
            "Mute Sounds": "Silenciar Sons",
            "Page Structure": "Estrutura da Página",
            "Text Magnifier": "Lupa de Texto",
            "Tooltips": "Dicas",
            "Navigation": "Navegação",
            "Header": "Cabeçalho",
            "Main content": "Conteúdo principal",
            "Footer": "Rodapé",
            "Sidebar": "Barra lateral",
            "Search": "Busca",
            "Form": "Formulário",
            "Section": "Seção",
            "Headings": "Títulos",
            "Landmarks": "Pontos de Referência",
            "Links": "Links",
            "No items found": "Nenhum item encontrado",
            "Settings reset": "Configurações redefinidas",
          },
          it: {
            "Accessibility": "Accessibilità",
            "Accessibility Options": "Opzioni di accessibilità",
            "Accessibility Menu": "Menu Accessibilità",
            "Accessibility Statement": "Dichiarazione di accessibilità",
            "Hide widget": "Nascondi widget",
            "Move widget": "Sposta widget",
            "This visit": "Questa visita",
            "One day": "Un giorno",
            "One week": "Una settimana",
            "Always": "Sempre",
            "The widget stays hidden until you clear this site's data in your browser.": "Il widget resta nascosto finché non cancelli i dati di questo sito nel browser.",
            "To bring it back sooner, clear this site's data in your browser.": "Per riaverlo prima, cancella i dati di questo sito nel browser.",
            "Hide": "Nascondi",
            "Reset settings": "Ripristina impostazioni",
            "Reset All Settings": "Ripristina tutte le impostazioni",
            "Close": "Chiudi",
            "Content Adjustments": "Regolazioni Contenuto",
            "Adjust Font Size": "Regola Dimensione Font",
            "Highlight Links": "Evidenzia Link",
            "Readable Font": "Font Leggibile",
            "Color Adjustments": "Regolazioni Colore",
            "Invert Colors": "Inverti Colori",
            "Light Contrast": "Contrasto Chiaro",
            "Dark Contrast": "Contrasto Scuro",
            "High Contrast": "Alto Contrasto",
            "Smart Contrast": "Contrasto Intelligente",
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
            "Legible Font": "Carattere Leggibile",
            "Font Size": "Dimensione Font",
            "Language": "Lingua",
            "All Languages": "Tutte le Lingue",
            "Search language": "Cerca lingua",
            "Open Accessibility Menu": "Apri Menu Accessibilità",
            "Open accessibility menu": "Apri menu accessibilità",
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
            "Speech": "Voce",
            "Text": "Testo",
            "Color & Contrast": "Colore e Contrasto",
            "Reading Aids": "Aiuti alla Lettura",
            "Interaction": "Interazione",
            "Contrast": "Contrasto",
            "Saturation": "Saturazione",
            "Light": "Chiaro",
            "Dark": "Scuro",
            "High": "Alta",
            "Low": "Bassa",
            "Play": "Play",
            "Pause": "Pause",
            "Stop": "Stop",
            "Loading voice...": "Caricamento voce...",
            "Reading...": "Reading...",
            "Profiles": "Profili",
            "Seizure Safe": "Sicuro per Epilessia",
            "Vision Impaired": "Ipovisione",
            "ADHD Friendly": "Adatto per ADHD",
            "Dyslexia Friendly": "Adatto per Dislessia",
            "On": "Attivato",
            "Off": "Disattivato",
            "Mute Sounds": "Disattiva Suoni",
            "Page Structure": "Struttura della Pagina",
            "Text Magnifier": "Lente d'Ingrandimento Testo",
            "Tooltips": "Suggerimenti",
            "Navigation": "Navigazione",
            "Header": "Intestazione",
            "Main content": "Contenuto principale",
            "Footer": "Piè di pagina",
            "Sidebar": "Barra laterale",
            "Search": "Ricerca",
            "Form": "Modulo",
            "Section": "Sezione",
            "Headings": "Intestazioni",
            "Landmarks": "Punti di Riferimento",
            "Links": "Link",
            "No items found": "Nessun elemento trovato",
            "Settings reset": "Impostazioni ripristinate",
          },
          fr: {
            "Accessibility": "Accessibilité",
            "Accessibility Options": "Options d'accessibilité",
            "Accessibility Menu": "Menu Accessibilité",
            "Accessibility Statement": "Déclaration d'accessibilité",
            "Hide widget": "Masquer le widget",
            "Move widget": "Déplacer le widget",
            "This visit": "Cette visite",
            "One day": "Un jour",
            "One week": "Une semaine",
            "Always": "Toujours",
            "The widget stays hidden until you clear this site's data in your browser.": "Le widget reste masqué jusqu'à ce que vous effaciez les données de ce site dans votre navigateur.",
            "To bring it back sooner, clear this site's data in your browser.": "Pour le retrouver plus tôt, effacez les données de ce site dans votre navigateur.",
            "Hide": "Masquer",
            "Reset settings": "Réinitialiser les paramètres",
            "Reset All Settings": "Réinitialiser tous les paramètres",
            "Close": "Fermer",
            "Content Adjustments": "Ajustements du Contenu",
            "Adjust Font Size": "Ajuster la Taille de Police",
            "Highlight Links": "Surligner les Liens",
            "Readable Font": "Police Lisible",
            "Color Adjustments": "Ajustements des Couleurs",
            "Invert Colors": "Inverser les Couleurs",
            "Light Contrast": "Contraste Clair",
            "Dark Contrast": "Contraste Sombre",
            "High Contrast": "Contraste Élevé",
            "Smart Contrast": "Contraste Intelligent",
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
            "Legible Font": "Police Lisible",
            "Font Size": "Taille de Police",
            "Language": "Langue",
            "All Languages": "Toutes les Langues",
            "Search language": "Rechercher une langue",
            "Open Accessibility Menu": "Ouvrir le Menu Accessibilité",
            "Open accessibility menu": "Ouvrir le menu accessibilité",
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
            "Speech": "Voix",
            "Text": "Texte",
            "Color & Contrast": "Couleur et Contraste",
            "Reading Aids": "Aides à la Lecture",
            "Interaction": "Interaction",
            "Contrast": "Contraste",
            "Saturation": "Saturation",
            "Light": "Clair",
            "Dark": "Sombre",
            "High": "Élevée",
            "Low": "Faible",
            "Play": "Play",
            "Pause": "Pause",
            "Stop": "Stop",
            "Loading voice...": "Chargement de la voix...",
            "Reading...": "Reading...",
            "Profiles": "Profils",
            "Seizure Safe": "Protection Épilepsie",
            "Vision Impaired": "Déficience Visuelle",
            "ADHD Friendly": "Adapté TDAH",
            "Dyslexia Friendly": "Adapté Dyslexie",
            "On": "Activé",
            "Off": "Désactivé",
            "Mute Sounds": "Couper les Sons",
            "Page Structure": "Structure de la Page",
            "Text Magnifier": "Loupe de Texte",
            "Tooltips": "Infobulles",
            "Navigation": "Navigation",
            "Header": "En-tête",
            "Main content": "Contenu principal",
            "Footer": "Pied de page",
            "Sidebar": "Barre latérale",
            "Search": "Recherche",
            "Form": "Formulaire",
            "Section": "Section",
            "Headings": "Titres",
            "Landmarks": "Points de Repère",
            "Links": "Liens",
            "No items found": "Aucun élément trouvé",
            "Settings reset": "Paramètres réinitialisés",
          },
          de: {
            "Accessibility": "Barrierefreiheit",
            "Accessibility Options": "Optionen für Barrierefreiheit",
            "Accessibility Menu": "Barrierefreiheit-Menü",
            "Accessibility Statement": "Erklärung zur Barrierefreiheit",
            "Hide widget": "Widget ausblenden",
            "Move widget": "Widget verschieben",
            "This visit": "Dieser Besuch",
            "One day": "Ein Tag",
            "One week": "Eine Woche",
            "Always": "Immer",
            "The widget stays hidden until you clear this site's data in your browser.": "Das Widget bleibt ausgeblendet, bis Sie die Daten dieser Website in Ihrem Browser löschen.",
            "To bring it back sooner, clear this site's data in your browser.": "Um es früher zurückzuholen, löschen Sie die Daten dieser Website in Ihrem Browser.",
            "Hide": "Ausblenden",
            "Reset settings": "Einstellungen zurücksetzen",
            "Reset All Settings": "Alle Einstellungen zurücksetzen",
            "Close": "Schließen",
            "Content Adjustments": "Inhaltsanpassungen",
            "Adjust Font Size": "Schriftgröße anpassen",
            "Highlight Links": "Links hervorheben",
            "Readable Font": "Lesbare Schrift",
            "Color Adjustments": "Farbanpassungen",
            "Invert Colors": "Farben invertieren",
            "Light Contrast": "Heller Kontrast",
            "Dark Contrast": "Dunkler Kontrast",
            "High Contrast": "Hoher Kontrast",
            "Smart Contrast": "Intelligenter Kontrast",
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
            "Legible Font": "Gut lesbare Schrift",
            "Font Size": "Schriftgröße",
            "Language": "Sprache",
            "All Languages": "Alle Sprachen",
            "Search language": "Sprache suchen",
            "Open Accessibility Menu": "Barrierefreiheit-Menü öffnen",
            "Open accessibility menu": "Barrierefreiheit-Menü öffnen",
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
            "Speech": "Sprachausgabe",
            "Text": "Text",
            "Color & Contrast": "Farbe & Kontrast",
            "Reading Aids": "Lesehilfen",
            "Interaction": "Interaktion",
            "Contrast": "Kontrast",
            "Saturation": "Sättigung",
            "Light": "Hell",
            "Dark": "Dunkel",
            "High": "Hoch",
            "Low": "Niedrig",
            "Play": "Play",
            "Pause": "Pause",
            "Stop": "Stop",
            "Loading voice...": "Stimme wird geladen...",
            "Reading...": "Reading...",
            "Profiles": "Profile",
            "Seizure Safe": "Anfallssicher",
            "Vision Impaired": "Sehbeeinträchtigung",
            "ADHD Friendly": "ADHS-freundlich",
            "Dyslexia Friendly": "Legasthenie-freundlich",
            "On": "Ein",
            "Off": "Aus",
            "Mute Sounds": "Töne stummschalten",
            "Page Structure": "Seitenstruktur",
            "Text Magnifier": "Textlupe",
            "Tooltips": "Tooltips",
            "Navigation": "Navigation",
            "Header": "Kopfbereich",
            "Main content": "Hauptinhalt",
            "Footer": "Fußbereich",
            "Sidebar": "Seitenleiste",
            "Search": "Suche",
            "Form": "Formular",
            "Section": "Abschnitt",
            "Headings": "Überschriften",
            "Landmarks": "Orientierungspunkte",
            "Links": "Links",
            "No items found": "Keine Einträge gefunden",
            "Settings reset": "Einstellungen zurückgesetzt",
          },
          es: {
            "Accessibility": "Accesibilidad",
            "Accessibility Options": "Opciones de accesibilidad",
            "Accessibility Menu": "Menú de Accesibilidad",
            "Accessibility Statement": "Declaración de accesibilidad",
            "Hide widget": "Ocultar widget",
            "Move widget": "Mover widget",
            "This visit": "Esta visita",
            "One day": "Un día",
            "One week": "Una semana",
            "Always": "Siempre",
            "The widget stays hidden until you clear this site's data in your browser.": "El widget permanece oculto hasta que borre los datos de este sitio en su navegador.",
            "To bring it back sooner, clear this site's data in your browser.": "Para recuperarlo antes, borre los datos de este sitio en su navegador.",
            "Hide": "Ocultar",
            "Reset settings": "Restablecer configuración",
            "Reset All Settings": "Restablecer toda la configuración",
            "Close": "Cerrar",
            "Content Adjustments": "Ajustes de Contenido",
            "Adjust Font Size": "Ajustar Tamaño de Fuente",
            "Highlight Links": "Resaltar Enlaces",
            "Readable Font": "Fuente Legible",
            "Color Adjustments": "Ajustes de Color",
            "Invert Colors": "Invertir Colores",
            "Light Contrast": "Contraste Claro",
            "Dark Contrast": "Contraste Oscuro",
            "High Contrast": "Alto Contraste",
            "Smart Contrast": "Contraste Inteligente",
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
            "Legible Font": "Fuente Legible",
            "Font Size": "Tamaño de Fuente",
            "Language": "Idioma",
            "All Languages": "Todos los Idiomas",
            "Search language": "Buscar idioma",
            "Open Accessibility Menu": "Abrir Menú de Accesibilidad",
            "Open accessibility menu": "Abrir menú de accesibilidad",
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
            "Annotations": "Anotaciones",
            "Text to Speech": "Texto a voz",
            "Text to Speech On": "Texto a Voz Activado",
            "Text to Speech Off": "Texto a Voz Desactivado",
            "Simplify Layout": "Simplificar diseño",
            "Speech": "Voz",
            "Text": "Texto",
            "Color & Contrast": "Color y Contraste",
            "Reading Aids": "Ayudas de Lectura",
            "Interaction": "Interacción",
            "Contrast": "Contraste",
            "Saturation": "Saturación",
            "Light": "Claro",
            "Dark": "Oscuro",
            "High": "Alta",
            "Low": "Baja",
            "Play": "Reproducir",
            "Pause": "Pausar",
            "Stop": "Detener",
            "Loading voice...": "Cargando voz...",
            "Reading...": "Leyendo...",
            "Profiles": "Perfiles",
            "Seizure Safe": "Seguro para Epilepsia",
            "Vision Impaired": "Discapacidad Visual",
            "ADHD Friendly": "Adaptado para TDAH",
            "Dyslexia Friendly": "Adaptado para Dislexia",
            "On": "Activado",
            "Off": "Desactivado",
            "Mute Sounds": "Silenciar Sonidos",
            "Page Structure": "Estructura de la Página",
            "Text Magnifier": "Lupa de Texto",
            "Tooltips": "Descripciones",
            "Navigation": "Navegación",
            "Header": "Encabezado",
            "Main content": "Contenido principal",
            "Footer": "Pie de página",
            "Sidebar": "Barra lateral",
            "Search": "Búsqueda",
            "Form": "Formulario",
            "Section": "Sección",
            "Headings": "Encabezados",
            "Landmarks": "Puntos de Referencia",
            "Links": "Enlaces",
            "No items found": "No se encontraron elementos",
            "Settings reset": "Configuración restablecida",
          },
          ru: {
            "Accessibility": "Доступность",
            "Accessibility Options": "Настройки доступности",
            "Accessibility Menu": "Меню доступности",
            "Accessibility Statement": "Заявление о доступности",
            "Hide widget": "Скрыть виджет",
            "Move widget": "Переместить виджет",
            "This visit": "Этот визит",
            "One day": "Один день",
            "One week": "Одна неделя",
            "Always": "Всегда",
            "The widget stays hidden until you clear this site's data in your browser.": "Виджет останется скрытым, пока вы не очистите данные этого сайта в браузере.",
            "To bring it back sooner, clear this site's data in your browser.": "Чтобы вернуть его раньше, очистите данные этого сайта в браузере.",
            "Hide": "Скрыть",
            "Reset settings": "Сбросить настройки",
            "Reset All Settings": "Сбросить все настройки",
            "Close": "Закрыть",
            "Content Adjustments": "Настройки контента",
            "Adjust Font Size": "Изменить размер шрифта",
            "Highlight Links": "Выделить ссылки",
            "Readable Font": "Читаемый шрифт",
            "Color Adjustments": "Настройки цвета",
            "Invert Colors": "Инвертировать цвета",
            "Light Contrast": "Светлый контраст",
            "Dark Contrast": "Тёмный контраст",
            "High Contrast": "Высокий контраст",
            "Smart Contrast": "Умный контраст",
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
            "Legible Font": "Разборчивый шрифт",
            "Font Size": "Размер шрифта",
            "Language": "Язык",
            "All Languages": "Все языки",
            "Search language": "Поиск языка",
            "Open Accessibility Menu": "Открыть меню доступности",
            "Open accessibility menu": "Открыть меню доступности",
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
            "Speech": "Речь",
            "Text": "Текст",
            "Color & Contrast": "Цвет и контраст",
            "Reading Aids": "Помощь при чтении",
            "Interaction": "Взаимодействие",
            "Contrast": "Контраст",
            "Saturation": "Насыщенность",
            "Light": "Светлый",
            "Dark": "Тёмный",
            "High": "Высокая",
            "Low": "Низкая",
            "Play": "Play",
            "Pause": "Pause",
            "Stop": "Stop",
            "Loading voice...": "Загрузка голоса...",
            "Reading...": "Reading...",
            "Profiles": "Профили",
            "Seizure Safe": "Защита от эпилепсии",
            "Vision Impaired": "Для слабовидящих",
            "ADHD Friendly": "Для людей с СДВГ",
            "Dyslexia Friendly": "Для людей с дислексией",
            "On": "Включено",
            "Off": "Выключено",
            "Mute Sounds": "Отключить звук",
            "Page Structure": "Структура страницы",
            "Text Magnifier": "Текстовая лупа",
            "Tooltips": "Подсказки",
            "Navigation": "Навигация",
            "Header": "Шапка",
            "Main content": "Основное содержимое",
            "Footer": "Подвал",
            "Sidebar": "Боковая панель",
            "Search": "Поиск",
            "Form": "Форма",
            "Section": "Раздел",
            "Headings": "Заголовки",
            "Landmarks": "Ориентиры",
            "Links": "Ссылки",
            "No items found": "Ничего не найдено",
            "Settings reset": "Настройки сброшены",
          },
          pl: {
            "Accessibility": "Dostępność",
            "Accessibility Options": "Opcje dostępności",
            "Accessibility Menu": "Menu Dostępności",
            "Accessibility Statement": "Deklaracja dostępności",
            "Hide widget": "Ukryj widżet",
            "Move widget": "Przenieś widżet",
            "This visit": "Ta wizyta",
            "One day": "Jeden dzień",
            "One week": "Jeden tydzień",
            "Always": "Zawsze",
            "The widget stays hidden until you clear this site's data in your browser.": "Widżet pozostanie ukryty, dopóki nie wyczyścisz danych tej witryny w przeglądarce.",
            "To bring it back sooner, clear this site's data in your browser.": "Aby przywrócić go wcześniej, wyczyść dane tej witryny w przeglądarce.",
            "Hide": "Ukryj",
            "Reset settings": "Zresetuj ustawienia",
            "Reset All Settings": "Zresetuj wszystkie ustawienia",
            "Close": "Zamknij",
            "Content Adjustments": "Dostosowanie Treści",
            "Adjust Font Size": "Dostosuj Rozmiar Czcionki",
            "Highlight Links": "Podświetl Linki",
            "Readable Font": "Czytelna Czcionka",
            "Color Adjustments": "Dostosowanie Kolorów",
            "Invert Colors": "Odwróć Kolory",
            "Light Contrast": "Jasny Kontrast",
            "Dark Contrast": "Ciemny Kontrast",
            "High Contrast": "Wysoki Kontrast",
            "Smart Contrast": "Inteligentny Kontrast",
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
            "Legible Font": "Czytelna Czcionka",
            "Font Size": "Rozmiar Czcionki",
            "Language": "Język",
            "All Languages": "Wszystkie Języki",
            "Search language": "Szukaj języka",
            "Open Accessibility Menu": "Otwórz Menu Dostępności",
            "Open accessibility menu": "Otwórz menu dostępności",
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
            "Speech": "Mowa",
            "Text": "Tekst",
            "Color & Contrast": "Kolor i Kontrast",
            "Reading Aids": "Pomoce do Czytania",
            "Interaction": "Interakcja",
            "Contrast": "Kontrast",
            "Saturation": "Saturacja",
            "Light": "Jasny",
            "Dark": "Ciemny",
            "High": "Wysoka",
            "Low": "Niska",
            "Play": "Play",
            "Pause": "Pause",
            "Stop": "Stop",
            "Loading voice...": "Ładowanie głosu...",
            "Reading...": "Reading...",
            "Profiles": "Profile",
            "Seizure Safe": "Bezpieczny dla Epileptyków",
            "Vision Impaired": "Dla Słabowidzących",
            "ADHD Friendly": "Przyjazny dla ADHD",
            "Dyslexia Friendly": "Przyjazny dla Dysleksji",
            "On": "Włączone",
            "Off": "Wyłączone",
            "Mute Sounds": "Wycisz Dźwięki",
            "Page Structure": "Struktura Strony",
            "Text Magnifier": "Lupa Tekstu",
            "Tooltips": "Podpowiedzi",
            "Navigation": "Nawigacja",
            "Header": "Nagłówek",
            "Main content": "Główna treść",
            "Footer": "Stopka",
            "Sidebar": "Panel boczny",
            "Search": "Wyszukiwanie",
            "Form": "Formularz",
            "Section": "Sekcja",
            "Headings": "Nagłówki",
            "Landmarks": "Punkty Orientacyjne",
            "Links": "Linki",
            "No items found": "Nie znaleziono elementów",
            "Settings reset": "Ustawienia zresetowane",
          },
          ro: {
            "Accessibility": "Accesibilitate",
            "Accessibility Options": "Opțiuni de accesibilitate",
            "Accessibility Menu": "Meniu Accesibilitate",
            "Accessibility Statement": "Declarație de accesibilitate",
            "Hide widget": "Ascunde widgetul",
            "Move widget": "Mută widgetul",
            "This visit": "Această vizită",
            "One day": "O zi",
            "One week": "O săptămână",
            "Always": "Întotdeauna",
            "The widget stays hidden until you clear this site's data in your browser.": "Widgetul rămâne ascuns până când ștergeți datele acestui site din browser.",
            "To bring it back sooner, clear this site's data in your browser.": "Pentru a-l readuce mai devreme, ștergeți datele acestui site din browser.",
            "Hide": "Ascunde",
            "Reset settings": "Resetare setări",
            "Reset All Settings": "Resetare toate setările",
            "Close": "Închide",
            "Content Adjustments": "Ajustări Conținut",
            "Adjust Font Size": "Ajustare Dimensiune Font",
            "Highlight Links": "Evidențiere Linkuri",
            "Readable Font": "Font Lizibil",
            "Color Adjustments": "Ajustări Culoare",
            "Invert Colors": "Inversare Culori",
            "Light Contrast": "Contrast Luminos",
            "Dark Contrast": "Contrast Întunecat",
            "High Contrast": "Contrast Ridicat",
            "Smart Contrast": "Contrast Inteligent",
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
            "Legible Font": "Font Lizibil",
            "Font Size": "Dimensiune Font",
            "Language": "Limbă",
            "All Languages": "Toate Limbile",
            "Search language": "Căutare limbă",
            "Open Accessibility Menu": "Deschide Meniul Accesibilitate",
            "Open accessibility menu": "Deschide meniul de accesibilitate",
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
            "Speech": "Voce",
            "Text": "Text",
            "Color & Contrast": "Culoare și Contrast",
            "Reading Aids": "Ajutoare de Citire",
            "Interaction": "Interacțiune",
            "Contrast": "Contrast",
            "Saturation": "Saturație",
            "Light": "Luminos",
            "Dark": "Întunecat",
            "High": "Ridicată",
            "Low": "Scăzută",
            "Play": "Play",
            "Pause": "Pause",
            "Stop": "Stop",
            "Loading voice...": "Se încarcă vocea...",
            "Reading...": "Reading...",
            "Profiles": "Profiluri",
            "Seizure Safe": "Protecție Epilepsie",
            "Vision Impaired": "Deficiențe de Vedere",
            "ADHD Friendly": "Adaptat pentru ADHD",
            "Dyslexia Friendly": "Adaptat pentru Dislexie",
            "On": "Activat",
            "Off": "Dezactivat",
            "Mute Sounds": "Dezactivare Sunete",
            "Page Structure": "Structura Paginii",
            "Text Magnifier": "Lupă pentru Text",
            "Tooltips": "Sugestii",
            "Navigation": "Navigare",
            "Header": "Antet",
            "Main content": "Conținut principal",
            "Footer": "Subsol",
            "Sidebar": "Bară laterală",
            "Search": "Căutare",
            "Form": "Formular",
            "Section": "Secțiune",
            "Headings": "Titluri",
            "Landmarks": "Repere",
            "Links": "Linkuri",
            "No items found": "Niciun element găsit",
            "Settings reset": "Setări resetate",
          },
          nl: {
            "Accessibility": "Toegankelijkheid",
            "Accessibility Options": "Toegankelijkheidsopties",
            "Accessibility Menu": "Toegankelijkheidsmenu",
            "Accessibility Statement": "Toegankelijkheidsverklaring",
            "Hide widget": "Widget verbergen",
            "Move widget": "Widget verplaatsen",
            "This visit": "Dit bezoek",
            "One day": "Eén dag",
            "One week": "Eén week",
            "Always": "Altijd",
            "The widget stays hidden until you clear this site's data in your browser.": "De widget blijft verborgen totdat u de gegevens van deze site in uw browser wist.",
            "To bring it back sooner, clear this site's data in your browser.": "Om de widget eerder terug te halen, wist u de gegevens van deze site in uw browser.",
            "Hide": "Verbergen",
            "Reset settings": "Instellingen resetten",
            "Reset All Settings": "Alle instellingen resetten",
            "Close": "Sluiten",
            "Content Adjustments": "Inhoudsaanpassingen",
            "Adjust Font Size": "Lettergrootte aanpassen",
            "Highlight Links": "Links markeren",
            "Readable Font": "Leesbaar Lettertype",
            "Color Adjustments": "Kleuraanpassingen",
            "Invert Colors": "Kleuren omkeren",
            "Light Contrast": "Licht Contrast",
            "Dark Contrast": "Donker Contrast",
            "High Contrast": "Hoog Contrast",
            "Smart Contrast": "Slim Contrast",
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
            "Legible Font": "Leesbaar Lettertype",
            "Font Size": "Lettergrootte",
            "Language": "Taal",
            "All Languages": "Alle Talen",
            "Search language": "Taal zoeken",
            "Open Accessibility Menu": "Toegankelijkheidsmenu openen",
            "Open accessibility menu": "Toegankelijkheidsmenu openen",
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
            "Speech": "Spraak",
            "Text": "Tekst",
            "Color & Contrast": "Kleur & Contrast",
            "Reading Aids": "Leeshulpmiddelen",
            "Interaction": "Interactie",
            "Contrast": "Contrast",
            "Saturation": "Verzadiging",
            "Light": "Licht",
            "Dark": "Donker",
            "High": "Hoog",
            "Low": "Laag",
            "Play": "Play",
            "Pause": "Pause",
            "Stop": "Stop",
            "Loading voice...": "Stem laden...",
            "Reading...": "Reading...",
            "Profiles": "Profielen",
            "Seizure Safe": "Epilepsieveilig",
            "Vision Impaired": "Slechtziend",
            "ADHD Friendly": "ADHD-vriendelijk",
            "Dyslexia Friendly": "Dyslexievriendelijk",
            "On": "Aan",
            "Off": "Uit",
            "Mute Sounds": "Geluiden dempen",
            "Page Structure": "Paginastructuur",
            "Text Magnifier": "Tekstvergrootglas",
            "Tooltips": "Tooltips",
            "Navigation": "Navigatie",
            "Header": "Koptekst",
            "Main content": "Hoofdinhoud",
            "Footer": "Voettekst",
            "Sidebar": "Zijbalk",
            "Search": "Zoeken",
            "Form": "Formulier",
            "Section": "Sectie",
            "Headings": "Koppen",
            "Landmarks": "Oriëntatiepunten",
            "Links": "Links",
            "No items found": "Geen items gevonden",
            "Settings reset": "Instellingen gereset",
          },
          uk: {
            "Accessibility": "Доступність",
            "Accessibility Options": "Параметри доступності",
            "Accessibility Menu": "Меню доступності",
            "Accessibility Statement": "Заява про доступність",
            "Hide widget": "Сховати віджет",
            "Move widget": "Перемістити віджет",
            "This visit": "Цей візит",
            "One day": "Один день",
            "One week": "Один тиждень",
            "Always": "Завжди",
            "The widget stays hidden until you clear this site's data in your browser.": "Віджет залишатиметься прихованим, доки ви не очистите дані цього сайту в браузері.",
            "To bring it back sooner, clear this site's data in your browser.": "Щоб повернути його раніше, очистіть дані цього сайту в браузері.",
            "Hide": "Сховати",
            "Reset settings": "Скинути налаштування",
            "Reset All Settings": "Скинути всі налаштування",
            "Close": "Закрити",
            "Content Adjustments": "Налаштування контенту",
            "Adjust Font Size": "Змінити розмір шрифту",
            "Highlight Links": "Виділити посилання",
            "Readable Font": "Читабельний шрифт",
            "Color Adjustments": "Налаштування кольору",
            "Invert Colors": "Інвертувати кольори",
            "Light Contrast": "Світлий контраст",
            "Dark Contrast": "Темний контраст",
            "High Contrast": "Високий контраст",
            "Smart Contrast": "Розумний контраст",
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
            "Legible Font": "Розбірливий шрифт",
            "Font Size": "Розмір шрифту",
            "Language": "Мова",
            "All Languages": "Усі мови",
            "Search language": "Пошук мови",
            "Open Accessibility Menu": "Відкрити меню доступності",
            "Open accessibility menu": "Відкрити меню доступності",
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
            "Speech": "Мовлення",
            "Text": "Текст",
            "Color & Contrast": "Колір і контраст",
            "Reading Aids": "Допомога при читанні",
            "Interaction": "Взаємодія",
            "Contrast": "Контраст",
            "Saturation": "Насиченість",
            "Light": "Світлий",
            "Dark": "Темний",
            "High": "Висока",
            "Low": "Низька",
            "Play": "Play",
            "Pause": "Pause",
            "Stop": "Stop",
            "Loading voice...": "Завантаження голосу...",
            "Reading...": "Reading...",
            "Profiles": "Профілі",
            "Seizure Safe": "Захист від епілепсії",
            "Vision Impaired": "Для людей з вадами зору",
            "ADHD Friendly": "Для людей з РДУГ",
            "Dyslexia Friendly": "Для людей з дислексією",
            "On": "Увімкнено",
            "Off": "Вимкнено",
            "Mute Sounds": "Вимкнути звук",
            "Page Structure": "Структура сторінки",
            "Text Magnifier": "Текстова лупа",
            "Tooltips": "Підказки",
            "Navigation": "Навігація",
            "Header": "Шапка",
            "Main content": "Основний вміст",
            "Footer": "Підвал",
            "Sidebar": "Бічна панель",
            "Search": "Пошук",
            "Form": "Форма",
            "Section": "Розділ",
            "Headings": "Заголовки",
            "Landmarks": "Орієнтири",
            "Links": "Посилання",
            "No items found": "Нічого не знайдено",
            "Settings reset": "Налаштування скинуто",
          },
          ar: {
            "Accessibility": "إمكانية الوصول",
            "Accessibility Options": "خيارات إمكانية الوصول",
            "Accessibility Menu": "قائمة إمكانية الوصول",
            "Accessibility Statement": "بيان إمكانية الوصول",
            "Hide widget": "إخفاء الأداة",
            "Move widget": "نقل الأداة",
            "This visit": "هذه الزيارة",
            "One day": "يوم واحد",
            "One week": "أسبوع واحد",
            "Always": "دائمًا",
            "The widget stays hidden until you clear this site's data in your browser.": "تبقى الأداة مخفية حتى تمسح بيانات هذا الموقع من متصفحك.",
            "To bring it back sooner, clear this site's data in your browser.": "لإعادتها قبل ذلك، امسح بيانات هذا الموقع من متصفحك.",
            "Hide": "إخفاء",
            "Reset settings": "إعادة تعيين الإعدادات",
            "Reset All Settings": "إعادة تعيين جميع الإعدادات",
            "Close": "إغلاق",
            "Content Adjustments": "تعديلات المحتوى",
            "Adjust Font Size": "تعديل حجم الخط",
            "Highlight Links": "تمييز الروابط",
            "Readable Font": "خط سهل القراءة",
            "Color Adjustments": "تعديلات الألوان",
            "Invert Colors": "عكس الألوان",
            "Light Contrast": "تباين فاتح",
            "Dark Contrast": "تباين داكن",
            "High Contrast": "تباين عالٍ",
            "Smart Contrast": "تباين ذكي",
            "High Saturation": "تشبع عالٍ",
            "Low Saturation": "تشبع منخفض",
            "Monochrome": "أحادي اللون",
            "Tools": "أدوات",
            "Reading Guide": "دليل القراءة",
            "Stop Animations": "إيقاف الرسوم المتحركة",
            "Big Cursor": "مؤشر كبير",
            "Increase Font Size": "تكبير حجم الخط",
            "Decrease Font Size": "تصغير حجم الخط",
            "Letter Spacing": "تباعد الأحرف",
            "Line Height": "ارتفاع السطر",
            "Font Weight": "سُمك الخط",
            "Dyslexia Font": "خط لعُسر القراءة",
            "Legible Font": "خط واضح",
            "Font Size": "حجم الخط",
            "Language": "اللغة",
            "All Languages": "جميع اللغات",
            "Search language": "البحث عن لغة",
            "Open Accessibility Menu": "فتح قائمة إمكانية الوصول",
            "Open accessibility menu": "فتح قائمة إمكانية الوصول",
            "Hide Images": "إخفاء الصور",
            "Skip to accessibility menu": "الانتقال إلى قائمة إمكانية الوصول",
            "Accessibility Report": "تقرير إمكانية الوصول",
            "Run Accessibility Check": "تشغيل فحص إمكانية الوصول",
            "Loading...": "جارٍ التحميل...",
            "Analyzing page...": "جارٍ تحليل الصفحة...",
            "Critical": "حرج",
            "Serious": "خطير",
            "Moderate": "متوسط",
            "Minor": "طفيف",
            "Violations Found": "المخالفات المكتشفة",
            "No Issues Found": "لم يتم العثور على مشاكل",
            "Element": "العنصر",
            "Issue": "المشكلة",
            "How to Fix": "كيفية الإصلاح",
            "Close Report": "إغلاق التقرير",
            "Passed Tests": "الاختبارات الناجحة",
            "Items Need Review": "عناصر تحتاج إلى مراجعة",
            "Annotations": "التعليقات التوضيحية",
            "Text to Speech": "تحويل النص إلى كلام",
            "Text to Speech On": "تحويل النص إلى كلام مفعّل",
            "Text to Speech Off": "تحويل النص إلى كلام معطّل",
            "Simplify Layout": "تبسيط التخطيط",
            "Speech": "الكلام",
            "Text": "النص",
            "Color & Contrast": "اللون والتباين",
            "Reading Aids": "مساعدات القراءة",
            "Interaction": "التفاعل",
            "Contrast": "التباين",
            "Saturation": "التشبع",
            "Light": "فاتح",
            "Dark": "داكن",
            "High": "عالٍ",
            "Low": "منخفض",
            "Play": "تشغيل",
            "Pause": "إيقاف مؤقت",
            "Stop": "إيقاف",
            "Loading voice...": "جارٍ تحميل الصوت...",
            "Reading...": "جارٍ القراءة...",
            "Profiles": "الملفات الشخصية",
            "Seizure Safe": "آمن لمرضى الصرع",
            "Vision Impaired": "لضعاف البصر",
            "ADHD Friendly": "مناسب لفرط الحركة وتشتت الانتباه",
            "Dyslexia Friendly": "مناسب لعُسر القراءة",
            "On": "مفعّل",
            "Off": "معطّل",
            "Mute Sounds": "كتم الأصوات",
            "Page Structure": "بنية الصفحة",
            "Text Magnifier": "مكبّر النص",
            "Tooltips": "تلميحات",
            "Navigation": "التنقل",
            "Header": "الرأس",
            "Main content": "المحتوى الرئيسي",
            "Footer": "التذييل",
            "Sidebar": "الشريط الجانبي",
            "Search": "بحث",
            "Form": "نموذج",
            "Section": "قسم",
            "Headings": "العناوين",
            "Landmarks": "المعالم",
            "Links": "الروابط",
            "No items found": "لم يتم العثور على عناصر",
            "Settings reset": "تمت إعادة تعيين الإعدادات",
          },
          he: {
            "Accessibility": "נגישות",
            "Accessibility Options": "אפשרויות נגישות",
            "Accessibility Menu": "תפריט נגישות",
            "Accessibility Statement": "הצהרת נגישות",
            "Hide widget": "הסתר את הווידג'ט",
            "Move widget": "הזז את הווידג'ט",
            "This visit": "הביקור הזה",
            "One day": "יום אחד",
            "One week": "שבוע אחד",
            "Always": "תמיד",
            "The widget stays hidden until you clear this site's data in your browser.": "הווידג'ט יישאר מוסתר עד שתנקה את נתוני האתר הזה בדפדפן.",
            "To bring it back sooner, clear this site's data in your browser.": "כדי להחזיר אותו מוקדם יותר, נקה את נתוני האתר הזה בדפדפן.",
            "Hide": "הסתר",
            "Reset settings": "איפוס הגדרות",
            "Reset All Settings": "איפוס כל ההגדרות",
            "Close": "סגירה",
            "Content Adjustments": "התאמות תוכן",
            "Adjust Font Size": "התאמת גודל גופן",
            "Highlight Links": "הדגשת קישורים",
            "Readable Font": "גופן קריא",
            "Color Adjustments": "התאמות צבע",
            "Invert Colors": "היפוך צבעים",
            "Light Contrast": "ניגודיות בהירה",
            "Dark Contrast": "ניגודיות כהה",
            "High Contrast": "ניגודיות גבוהה",
            "Smart Contrast": "ניגודיות חכמה",
            "High Saturation": "רוויה גבוהה",
            "Low Saturation": "רוויה נמוכה",
            "Monochrome": "מונוכרום",
            "Tools": "כלים",
            "Reading Guide": "סרגל קריאה",
            "Stop Animations": "עצירת אנימציות",
            "Big Cursor": "סמן גדול",
            "Increase Font Size": "הגדלת גודל גופן",
            "Decrease Font Size": "הקטנת גודל גופן",
            "Letter Spacing": "ריווח אותיות",
            "Line Height": "גובה שורה",
            "Font Weight": "עובי גופן",
            "Dyslexia Font": "גופן מותאם לדיסלקציה",
            "Legible Font": "גופן קריא",
            "Font Size": "גודל גופן",
            "Language": "שפה",
            "All Languages": "כל השפות",
            "Search language": "חיפוש שפה",
            "Open Accessibility Menu": "פתיחת תפריט נגישות",
            "Open accessibility menu": "פתיחת תפריט נגישות",
            "Hide Images": "הסתרת תמונות",
            "Skip to accessibility menu": "דילוג לתפריט הנגישות",
            "Accessibility Report": "דוח נגישות",
            "Run Accessibility Check": "הפעלת בדיקת נגישות",
            "Loading...": "טוען...",
            "Analyzing page...": "מנתח את הדף...",
            "Critical": "קריטי",
            "Serious": "חמור",
            "Moderate": "בינוני",
            "Minor": "קל",
            "Violations Found": "הפרות שנמצאו",
            "No Issues Found": "לא נמצאו בעיות",
            "Element": "רכיב",
            "Issue": "בעיה",
            "How to Fix": "כיצד לתקן",
            "Close Report": "סגירת הדוח",
            "Passed Tests": "בדיקות שעברו",
            "Items Need Review": "פריטים הדורשים בדיקה",
            "Annotations": "הערות",
            "Text to Speech": "הקראת טקסט",
            "Text to Speech On": "הקראת טקסט פועלת",
            "Text to Speech Off": "הקראת טקסט כבויה",
            "Simplify Layout": "פישוט הפריסה",
            "Speech": "דיבור",
            "Text": "טקסט",
            "Color & Contrast": "צבע וניגודיות",
            "Reading Aids": "עזרי קריאה",
            "Interaction": "אינטראקציה",
            "Contrast": "ניגודיות",
            "Saturation": "רוויה",
            "Light": "בהיר",
            "Dark": "כהה",
            "High": "גבוהה",
            "Low": "נמוכה",
            "Play": "נגן",
            "Pause": "השהה",
            "Stop": "עצור",
            "Loading voice...": "טוען קול...",
            "Reading...": "מקריא...",
            "Profiles": "פרופילים",
            "Seizure Safe": "מותאם לאפילפסיה",
            "Vision Impaired": "מותאם ללקויי ראייה",
            "ADHD Friendly": "מותאם להפרעות קשב",
            "Dyslexia Friendly": "מותאם לדיסלקציה",
            "On": "מופעל",
            "Off": "כבוי",
            "Mute Sounds": "השתקת צלילים",
            "Page Structure": "מבנה הדף",
            "Text Magnifier": "זכוכית מגדלת לטקסט",
            "Tooltips": "רמזים",
            "Navigation": "ניווט",
            "Header": "כותרת עליונה",
            "Main content": "תוכן ראשי",
            "Footer": "כותרת תחתונה",
            "Sidebar": "סרגל צד",
            "Search": "חיפוש",
            "Form": "טופס",
            "Section": "מקטע",
            "Headings": "כותרות",
            "Landmarks": "ציוני דרך",
            "Links": "קישורים",
            "No items found": "לא נמצאו פריטים",
            "Settings reset": "ההגדרות אופסו",
          },
          sv: {
            "Accessibility": "Tillgänglighet",
            "Accessibility Options": "Tillgänglighetsalternativ",
            "Accessibility Menu": "Tillgänglighetsmeny",
            "Accessibility Statement": "Tillgänglighetsredogörelse",
            "Hide widget": "Dölj widgeten",
            "Move widget": "Flytta widgeten",
            "This visit": "Det här besöket",
            "One day": "En dag",
            "One week": "En vecka",
            "Always": "Alltid",
            "The widget stays hidden until you clear this site's data in your browser.": "Widgeten förblir dold tills du rensar webbplatsens data i din webbläsare.",
            "To bring it back sooner, clear this site's data in your browser.": "För att få tillbaka den tidigare rensar du webbplatsens data i din webbläsare.",
            "Hide": "Dölj",
            "Reset settings": "Återställ inställningar",
            "Reset All Settings": "Återställ alla inställningar",
            "Close": "Stäng",
            "Content Adjustments": "Innehållsjusteringar",
            "Adjust Font Size": "Justera textstorlek",
            "Highlight Links": "Markera länkar",
            "Readable Font": "Läsbart typsnitt",
            "Color Adjustments": "Färgjusteringar",
            "Invert Colors": "Invertera färger",
            "Light Contrast": "Ljus kontrast",
            "Dark Contrast": "Mörk kontrast",
            "High Contrast": "Hög kontrast",
            "Smart Contrast": "Smart kontrast",
            "High Saturation": "Hög mättnad",
            "Low Saturation": "Låg mättnad",
            "Monochrome": "Monokrom",
            "Tools": "Verktyg",
            "Reading Guide": "Läslinjal",
            "Stop Animations": "Stoppa animationer",
            "Big Cursor": "Stor muspekare",
            "Increase Font Size": "Öka textstorlek",
            "Decrease Font Size": "Minska textstorlek",
            "Letter Spacing": "Teckenavstånd",
            "Line Height": "Radavstånd",
            "Font Weight": "Teckentjocklek",
            "Dyslexia Font": "Dyslexitypsnitt",
            "Legible Font": "Tydligt typsnitt",
            "Font Size": "Textstorlek",
            "Language": "Språk",
            "All Languages": "Alla språk",
            "Search language": "Sök språk",
            "Open Accessibility Menu": "Öppna tillgänglighetsmenyn",
            "Open accessibility menu": "Öppna tillgänglighetsmenyn",
            "Hide Images": "Dölj bilder",
            "Skip to accessibility menu": "Hoppa till tillgänglighetsmenyn",
            "Accessibility Report": "Tillgänglighetsrapport",
            "Run Accessibility Check": "Kör tillgänglighetskontroll",
            "Loading...": "Läser in...",
            "Analyzing page...": "Analyserar sidan...",
            "Critical": "Kritisk",
            "Serious": "Allvarlig",
            "Moderate": "Måttlig",
            "Minor": "Mindre",
            "Violations Found": "Problem hittade",
            "No Issues Found": "Inga problem hittade",
            "Element": "Element",
            "Issue": "Problem",
            "How to Fix": "Så åtgärdar du",
            "Close Report": "Stäng rapport",
            "Passed Tests": "Godkända tester",
            "Items Need Review": "Objekt som behöver granskas",
            "Annotations": "Markeringar",
            "Text to Speech": "Text till tal",
            "Text to Speech On": "Text till tal på",
            "Text to Speech Off": "Text till tal av",
            "Simplify Layout": "Förenkla layout",
            "Speech": "Tal",
            "Text": "Text",
            "Color & Contrast": "Färg och kontrast",
            "Reading Aids": "Läshjälpmedel",
            "Interaction": "Interaktion",
            "Contrast": "Kontrast",
            "Saturation": "Mättnad",
            "Light": "Ljus",
            "Dark": "Mörk",
            "High": "Hög",
            "Low": "Låg",
            "Play": "Spela upp",
            "Pause": "Pausa",
            "Stop": "Stoppa",
            "Loading voice...": "Läser in röst...",
            "Reading...": "Läser...",
            "Profiles": "Profiler",
            "Seizure Safe": "Anfallssäker",
            "Vision Impaired": "Nedsatt syn",
            "ADHD Friendly": "ADHD-vänlig",
            "Dyslexia Friendly": "Dyslexivänlig",
            "On": "På",
            "Off": "Av",
            "Mute Sounds": "Stäng av ljud",
            "Page Structure": "Sidstruktur",
            "Text Magnifier": "Textförstorare",
            "Tooltips": "Verktygstips",
            "Navigation": "Navigering",
            "Header": "Sidhuvud",
            "Main content": "Huvudinnehåll",
            "Footer": "Sidfot",
            "Sidebar": "Sidofält",
            "Search": "Sök",
            "Form": "Formulär",
            "Section": "Avsnitt",
            "Headings": "Rubriker",
            "Landmarks": "Landmärken",
            "Links": "Länkar",
            "No items found": "Inga objekt hittades",
            "Settings reset": "Inställningarna har återställts",
          },
          da: {
            "Accessibility": "Tilgængelighed",
            "Accessibility Options": "Tilgængelighedsindstillinger",
            "Accessibility Menu": "Tilgængelighedsmenu",
            "Accessibility Statement": "Tilgængelighedserklæring",
            "Hide widget": "Skjul widget",
            "Move widget": "Flyt widget",
            "This visit": "Dette besøg",
            "One day": "En dag",
            "One week": "En uge",
            "Always": "Altid",
            "The widget stays hidden until you clear this site's data in your browser.": "Widgetten forbliver skjult, indtil du rydder dette websteds data i din browser.",
            "To bring it back sooner, clear this site's data in your browser.": "Hvis du vil have den tilbage før, skal du rydde dette websteds data i din browser.",
            "Hide": "Skjul",
            "Reset settings": "Nulstil indstillinger",
            "Reset All Settings": "Nulstil alle indstillinger",
            "Close": "Luk",
            "Content Adjustments": "Indholdsjusteringer",
            "Adjust Font Size": "Juster skriftstørrelse",
            "Highlight Links": "Fremhæv links",
            "Readable Font": "Letlæselig skrifttype",
            "Color Adjustments": "Farvejusteringer",
            "Invert Colors": "Invertér farver",
            "Light Contrast": "Lys kontrast",
            "Dark Contrast": "Mørk kontrast",
            "High Contrast": "Høj kontrast",
            "Smart Contrast": "Smart kontrast",
            "High Saturation": "Høj mætning",
            "Low Saturation": "Lav mætning",
            "Monochrome": "Monokrom",
            "Tools": "Værktøjer",
            "Reading Guide": "Læselinjal",
            "Stop Animations": "Stop animationer",
            "Big Cursor": "Stor markør",
            "Increase Font Size": "Større skrift",
            "Decrease Font Size": "Mindre skrift",
            "Letter Spacing": "Bogstavafstand",
            "Line Height": "Linjeafstand",
            "Font Weight": "Skriftvægt",
            "Dyslexia Font": "Ordblindevenlig skrifttype",
            "Legible Font": "Tydelig skrifttype",
            "Font Size": "Skriftstørrelse",
            "Language": "Sprog",
            "All Languages": "Alle sprog",
            "Search language": "Søg sprog",
            "Open Accessibility Menu": "Åbn tilgængelighedsmenu",
            "Open accessibility menu": "Åbn tilgængelighedsmenu",
            "Hide Images": "Skjul billeder",
            "Skip to accessibility menu": "Spring til tilgængelighedsmenu",
            "Accessibility Report": "Tilgængelighedsrapport",
            "Run Accessibility Check": "Kør tilgængelighedstjek",
            "Loading...": "Indlæser...",
            "Analyzing page...": "Analyserer siden...",
            "Critical": "Kritisk",
            "Serious": "Alvorlig",
            "Moderate": "Moderat",
            "Minor": "Mindre",
            "Violations Found": "Problemer fundet",
            "No Issues Found": "Ingen problemer fundet",
            "Element": "Element",
            "Issue": "Problem",
            "How to Fix": "Sådan rettes det",
            "Close Report": "Luk rapport",
            "Passed Tests": "Beståede test",
            "Items Need Review": "Elementer kræver gennemgang",
            "Annotations": "Markeringer",
            "Text to Speech": "Tekst til tale",
            "Text to Speech On": "Tekst til tale slået til",
            "Text to Speech Off": "Tekst til tale slået fra",
            "Simplify Layout": "Forenkl layout",
            "Speech": "Tale",
            "Text": "Tekst",
            "Color & Contrast": "Farve og kontrast",
            "Reading Aids": "Læsehjælpemidler",
            "Interaction": "Interaktion",
            "Contrast": "Kontrast",
            "Saturation": "Mætning",
            "Light": "Lys",
            "Dark": "Mørk",
            "High": "Høj",
            "Low": "Lav",
            "Play": "Afspil",
            "Pause": "Pause",
            "Stop": "Stop",
            "Loading voice...": "Indlæser stemme...",
            "Reading...": "Læser...",
            "Profiles": "Profiler",
            "Seizure Safe": "Epilepsisikker",
            "Vision Impaired": "Nedsat syn",
            "ADHD Friendly": "ADHD-venlig",
            "Dyslexia Friendly": "Ordblindevenlig",
            "On": "Til",
            "Off": "Fra",
            "Mute Sounds": "Slå lyd fra",
            "Page Structure": "Sidestruktur",
            "Text Magnifier": "Tekstforstørrer",
            "Tooltips": "Værktøjstip",
            "Navigation": "Navigation",
            "Header": "Sidehoved",
            "Main content": "Hovedindhold",
            "Footer": "Sidefod",
            "Sidebar": "Sidepanel",
            "Search": "Søg",
            "Form": "Formular",
            "Section": "Sektion",
            "Headings": "Overskrifter",
            "Landmarks": "Landemærker",
            "Links": "Links",
            "No items found": "Ingen elementer fundet",
            "Settings reset": "Indstillinger nulstillet",
          },
          ca: {
            "Accessibility": "Accessibilitat",
            "Accessibility Options": "Opcions d'accessibilitat",
            "Accessibility Menu": "Menú d'accessibilitat",
            "Accessibility Statement": "Declaració d'accessibilitat",
            "Hide widget": "Amaga el giny",
            "Move widget": "Mou el giny",
            "This visit": "Aquesta visita",
            "One day": "Un dia",
            "One week": "Una setmana",
            "Always": "Sempre",
            "The widget stays hidden until you clear this site's data in your browser.": "El giny continua amagat fins que esborreu les dades d'aquest lloc al navegador.",
            "To bring it back sooner, clear this site's data in your browser.": "Per recuperar-lo abans, esborreu les dades d'aquest lloc al navegador.",
            "Hide": "Amaga",
            "Reset settings": "Restableix la configuració",
            "Reset All Settings": "Restableix tota la configuració",
            "Close": "Tanca",
            "Content Adjustments": "Ajustos de contingut",
            "Adjust Font Size": "Ajusta la mida del text",
            "Highlight Links": "Ressalta els enllaços",
            "Readable Font": "Tipografia llegible",
            "Color Adjustments": "Ajustos de color",
            "Invert Colors": "Inverteix els colors",
            "Light Contrast": "Contrast clar",
            "Dark Contrast": "Contrast fosc",
            "High Contrast": "Contrast alt",
            "Smart Contrast": "Contrast intel·ligent",
            "High Saturation": "Saturació alta",
            "Low Saturation": "Saturació baixa",
            "Monochrome": "Monocrom",
            "Tools": "Eines",
            "Reading Guide": "Guia de lectura",
            "Stop Animations": "Atura les animacions",
            "Big Cursor": "Cursor gran",
            "Increase Font Size": "Augmenta la mida del text",
            "Decrease Font Size": "Redueix la mida del text",
            "Letter Spacing": "Espaiat entre lletres",
            "Line Height": "Interlineat",
            "Font Weight": "Gruix de la lletra",
            "Dyslexia Font": "Tipografia per a dislèxia",
            "Legible Font": "Tipografia clara",
            "Font Size": "Mida del text",
            "Language": "Idioma",
            "All Languages": "Tots els idiomes",
            "Search language": "Cerca un idioma",
            "Open Accessibility Menu": "Obre el menú d'accessibilitat",
            "Open accessibility menu": "Obre el menú d'accessibilitat",
            "Hide Images": "Amaga les imatges",
            "Skip to accessibility menu": "Ves al menú d'accessibilitat",
            "Accessibility Report": "Informe d'accessibilitat",
            "Run Accessibility Check": "Executa la comprovació d'accessibilitat",
            "Loading...": "S'està carregant...",
            "Analyzing page...": "S'està analitzant la pàgina...",
            "Critical": "Crític",
            "Serious": "Greu",
            "Moderate": "Moderat",
            "Minor": "Menor",
            "Violations Found": "Problemes trobats",
            "No Issues Found": "No s'han trobat problemes",
            "Element": "Element",
            "Issue": "Problema",
            "How to Fix": "Com solucionar-ho",
            "Close Report": "Tanca l'informe",
            "Passed Tests": "Proves superades",
            "Items Need Review": "Elements per revisar",
            "Annotations": "Anotacions",
            "Text to Speech": "Text a veu",
            "Text to Speech On": "Text a veu activat",
            "Text to Speech Off": "Text a veu desactivat",
            "Simplify Layout": "Simplifica el disseny",
            "Speech": "Veu",
            "Text": "Text",
            "Color & Contrast": "Color i contrast",
            "Reading Aids": "Ajudes de lectura",
            "Interaction": "Interacció",
            "Contrast": "Contrast",
            "Saturation": "Saturació",
            "Light": "Clar",
            "Dark": "Fosc",
            "High": "Alt",
            "Low": "Baix",
            "Play": "Reprodueix",
            "Pause": "Pausa",
            "Stop": "Atura",
            "Loading voice...": "S'està carregant la veu...",
            "Reading...": "S'està llegint...",
            "Profiles": "Perfils",
            "Seizure Safe": "Segur per a epilèpsia",
            "Vision Impaired": "Visió reduïda",
            "ADHD Friendly": "Adaptat per a TDAH",
            "Dyslexia Friendly": "Adaptat per a dislèxia",
            "On": "Activat",
            "Off": "Desactivat",
            "Mute Sounds": "Silencia els sons",
            "Page Structure": "Estructura de la pàgina",
            "Text Magnifier": "Lupa de text",
            "Tooltips": "Descripcions",
            "Navigation": "Navegació",
            "Header": "Capçalera",
            "Main content": "Contingut principal",
            "Footer": "Peu de pàgina",
            "Sidebar": "Barra lateral",
            "Search": "Cerca",
            "Form": "Formulari",
            "Section": "Secció",
            "Headings": "Encapçalaments",
            "Landmarks": "Punts de referència",
            "Links": "Enllaços",
            "No items found": "No s'han trobat elements",
            "Settings reset": "S'ha restablert la configuració",
          },
          sl: {
            "Accessibility": "Dostopnost",
            "Accessibility Options": "Možnosti dostopnosti",
            "Accessibility Menu": "Meni dostopnosti",
            "Accessibility Statement": "Izjava o dostopnosti",
            "Hide widget": "Skrij gradnik",
            "Move widget": "Premakni gradnik",
            "This visit": "Ta obisk",
            "One day": "En dan",
            "One week": "En teden",
            "Always": "Vedno",
            "The widget stays hidden until you clear this site's data in your browser.": "Gradnik ostane skrit, dokler v brskalniku ne počistite podatkov tega spletnega mesta.",
            "To bring it back sooner, clear this site's data in your browser.": "Če ga želite prej vrniti, v brskalniku počistite podatke tega spletnega mesta.",
            "Hide": "Skrij",
            "Reset settings": "Ponastavi nastavitve",
            "Reset All Settings": "Ponastavi vse nastavitve",
            "Close": "Zapri",
            "Content Adjustments": "Prilagoditve vsebine",
            "Adjust Font Size": "Prilagodi velikost pisave",
            "Highlight Links": "Označi povezave",
            "Readable Font": "Berljiva pisava",
            "Color Adjustments": "Prilagoditve barv",
            "Invert Colors": "Obrni barve",
            "Light Contrast": "Svetli kontrast",
            "Dark Contrast": "Temni kontrast",
            "High Contrast": "Visok kontrast",
            "Smart Contrast": "Pametni kontrast",
            "High Saturation": "Visoka nasičenost",
            "Low Saturation": "Nizka nasičenost",
            "Monochrome": "Enobarvno",
            "Tools": "Orodja",
            "Reading Guide": "Bralno ravnilo",
            "Stop Animations": "Ustavi animacije",
            "Big Cursor": "Velik kazalec",
            "Increase Font Size": "Povečaj pisavo",
            "Decrease Font Size": "Zmanjšaj pisavo",
            "Letter Spacing": "Razmik med črkami",
            "Line Height": "Razmik med vrsticami",
            "Font Weight": "Debelina pisave",
            "Dyslexia Font": "Pisava za disleksijo",
            "Legible Font": "Čitljiva pisava",
            "Font Size": "Velikost pisave",
            "Language": "Jezik",
            "All Languages": "Vsi jeziki",
            "Search language": "Išči jezik",
            "Open Accessibility Menu": "Odpri meni dostopnosti",
            "Open accessibility menu": "Odpri meni dostopnosti",
            "Hide Images": "Skrij slike",
            "Skip to accessibility menu": "Skoči na meni dostopnosti",
            "Accessibility Report": "Poročilo o dostopnosti",
            "Run Accessibility Check": "Zaženi preverjanje dostopnosti",
            "Loading...": "Nalaganje ...",
            "Analyzing page...": "Analiziranje strani ...",
            "Critical": "Kritično",
            "Serious": "Resno",
            "Moderate": "Zmerno",
            "Minor": "Manjše",
            "Violations Found": "Najdene težave",
            "No Issues Found": "Ni najdenih težav",
            "Element": "Element",
            "Issue": "Težava",
            "How to Fix": "Kako odpraviti",
            "Close Report": "Zapri poročilo",
            "Passed Tests": "Uspešni preizkusi",
            "Items Need Review": "Elementi za pregled",
            "Annotations": "Oznake",
            "Text to Speech": "Besedilo v govor",
            "Text to Speech On": "Besedilo v govor vklopljeno",
            "Text to Speech Off": "Besedilo v govor izklopljeno",
            "Simplify Layout": "Poenostavi postavitev",
            "Speech": "Govor",
            "Text": "Besedilo",
            "Color & Contrast": "Barva in kontrast",
            "Reading Aids": "Bralni pripomočki",
            "Interaction": "Interakcija",
            "Contrast": "Kontrast",
            "Saturation": "Nasičenost",
            "Light": "Svetlo",
            "Dark": "Temno",
            "High": "Visoko",
            "Low": "Nizko",
            "Play": "Predvajaj",
            "Pause": "Premor",
            "Stop": "Ustavi",
            "Loading voice...": "Nalaganje glasu ...",
            "Reading...": "Branje ...",
            "Profiles": "Profili",
            "Seizure Safe": "Varno pri epilepsiji",
            "Vision Impaired": "Okvara vida",
            "ADHD Friendly": "Prijazno za ADHD",
            "Dyslexia Friendly": "Prijazno za disleksijo",
            "On": "Vklopljeno",
            "Off": "Izklopljeno",
            "Mute Sounds": "Izklopi zvok",
            "Page Structure": "Struktura strani",
            "Text Magnifier": "Povečevalnik besedila",
            "Tooltips": "Namigi",
            "Navigation": "Navigacija",
            "Header": "Glava",
            "Main content": "Glavna vsebina",
            "Footer": "Noga",
            "Sidebar": "Stranska vrstica",
            "Search": "Iskanje",
            "Form": "Obrazec",
            "Section": "Razdelek",
            "Headings": "Naslovi",
            "Landmarks": "Mejniki",
            "Links": "Povezave",
            "No items found": "Ni najdenih elementov",
            "Settings reset": "Nastavitve so ponastavljene",
          },
          lv: {
            "Accessibility": "Piekļūstamība",
            "Accessibility Options": "Piekļūstamības opcijas",
            "Accessibility Menu": "Piekļūstamības izvēlne",
            "Accessibility Statement": "Piekļūstamības paziņojums",
            "Hide widget": "Paslēpt logrīku",
            "Move widget": "Pārvietot logrīku",
            "This visit": "Šis apmeklējums",
            "One day": "Viena diena",
            "One week": "Viena nedēļa",
            "Always": "Vienmēr",
            "The widget stays hidden until you clear this site's data in your browser.": "Logrīks paliek paslēpts, līdz pārlūkprogrammā notīrāt šīs vietnes datus.",
            "To bring it back sooner, clear this site's data in your browser.": "Lai to atgūtu ātrāk, pārlūkprogrammā notīriet šīs vietnes datus.",
            "Hide": "Paslēpt",
            "Reset settings": "Atiestatīt iestatījumus",
            "Reset All Settings": "Atiestatīt visus iestatījumus",
            "Close": "Aizvērt",
            "Content Adjustments": "Satura pielāgojumi",
            "Adjust Font Size": "Pielāgot fonta lielumu",
            "Highlight Links": "Izcelt saites",
            "Readable Font": "Lasāms fonts",
            "Color Adjustments": "Krāsu pielāgojumi",
            "Invert Colors": "Invertēt krāsas",
            "Light Contrast": "Gaišs kontrasts",
            "Dark Contrast": "Tumšs kontrasts",
            "High Contrast": "Augsts kontrasts",
            "Smart Contrast": "Viedais kontrasts",
            "High Saturation": "Augsts piesātinājums",
            "Low Saturation": "Zems piesātinājums",
            "Monochrome": "Vienkrāsains",
            "Tools": "Rīki",
            "Reading Guide": "Lasīšanas līnija",
            "Stop Animations": "Apturēt animācijas",
            "Big Cursor": "Liels kursors",
            "Increase Font Size": "Palielināt fontu",
            "Decrease Font Size": "Samazināt fontu",
            "Letter Spacing": "Burtu atstarpe",
            "Line Height": "Rindstarpa",
            "Font Weight": "Fonta biezums",
            "Dyslexia Font": "Disleksijas fonts",
            "Legible Font": "Salasāms fonts",
            "Font Size": "Fonta lielums",
            "Language": "Valoda",
            "All Languages": "Visas valodas",
            "Search language": "Meklēt valodu",
            "Open Accessibility Menu": "Atvērt piekļūstamības izvēlni",
            "Open accessibility menu": "Atvērt piekļūstamības izvēlni",
            "Hide Images": "Paslēpt attēlus",
            "Skip to accessibility menu": "Pāriet uz piekļūstamības izvēlni",
            "Accessibility Report": "Piekļūstamības pārskats",
            "Run Accessibility Check": "Palaist piekļūstamības pārbaudi",
            "Loading...": "Notiek ielāde...",
            "Analyzing page...": "Analizē lapu...",
            "Critical": "Kritisks",
            "Serious": "Nopietns",
            "Moderate": "Mērens",
            "Minor": "Neliels",
            "Violations Found": "Atrastas problēmas",
            "No Issues Found": "Problēmas nav atrastas",
            "Element": "Elements",
            "Issue": "Problēma",
            "How to Fix": "Kā novērst",
            "Close Report": "Aizvērt pārskatu",
            "Passed Tests": "Izturētie testi",
            "Items Need Review": "Vienumi jāpārskata",
            "Annotations": "Anotācijas",
            "Text to Speech": "Teksta nolasīšana",
            "Text to Speech On": "Teksta nolasīšana ieslēgta",
            "Text to Speech Off": "Teksta nolasīšana izslēgta",
            "Simplify Layout": "Vienkāršot izkārtojumu",
            "Speech": "Runa",
            "Text": "Teksts",
            "Color & Contrast": "Krāsa un kontrasts",
            "Reading Aids": "Lasīšanas palīgi",
            "Interaction": "Mijiedarbība",
            "Contrast": "Kontrasts",
            "Saturation": "Piesātinājums",
            "Light": "Gaišs",
            "Dark": "Tumšs",
            "High": "Augsts",
            "Low": "Zems",
            "Play": "Atskaņot",
            "Pause": "Pauzēt",
            "Stop": "Apturēt",
            "Loading voice...": "Ielādē balsi...",
            "Reading...": "Lasa...",
            "Profiles": "Profili",
            "Seizure Safe": "Drošs epilepsijai",
            "Vision Impaired": "Redzes traucējumi",
            "ADHD Friendly": "ADHD draudzīgs",
            "Dyslexia Friendly": "Disleksijai draudzīgs",
            "On": "Ieslēgts",
            "Off": "Izslēgts",
            "Mute Sounds": "Izslēgt skaņu",
            "Page Structure": "Lapas struktūra",
            "Text Magnifier": "Teksta lupa",
            "Tooltips": "Padomi",
            "Navigation": "Navigācija",
            "Header": "Galvene",
            "Main content": "Galvenais saturs",
            "Footer": "Kājene",
            "Sidebar": "Sānjosla",
            "Search": "Meklēšana",
            "Form": "Veidlapa",
            "Section": "Sadaļa",
            "Headings": "Virsraksti",
            "Landmarks": "Orientieri",
            "Links": "Saites",
            "No items found": "Nekas nav atrasts",
            "Settings reset": "Iestatījumi atiestatīti",
          },
          el: {
            "Accessibility": "Προσβασιμότητα",
            "Accessibility Options": "Επιλογές προσβασιμότητας",
            "Accessibility Menu": "Μενού προσβασιμότητας",
            "Accessibility Statement": "Δήλωση προσβασιμότητας",
            "Hide widget": "Απόκρυψη widget",
            "Move widget": "Μετακίνηση widget",
            "This visit": "Αυτή η επίσκεψη",
            "One day": "Μία ημέρα",
            "One week": "Μία εβδομάδα",
            "Always": "Πάντα",
            "The widget stays hidden until you clear this site's data in your browser.": "Το widget παραμένει κρυφό μέχρι να διαγράψετε τα δεδομένα αυτού του ιστότοπου στο πρόγραμμα περιήγησής σας.",
            "To bring it back sooner, clear this site's data in your browser.": "Για να το επαναφέρετε νωρίτερα, διαγράψτε τα δεδομένα αυτού του ιστότοπου στο πρόγραμμα περιήγησής σας.",
            "Hide": "Απόκρυψη",
            "Reset settings": "Επαναφορά ρυθμίσεων",
            "Reset All Settings": "Επαναφορά όλων των ρυθμίσεων",
            "Close": "Κλείσιμο",
            "Content Adjustments": "Προσαρμογές περιεχομένου",
            "Adjust Font Size": "Προσαρμογή μεγέθους γραμματοσειράς",
            "Highlight Links": "Επισήμανση συνδέσμων",
            "Readable Font": "Ευανάγνωστη γραμματοσειρά",
            "Color Adjustments": "Προσαρμογές χρωμάτων",
            "Invert Colors": "Αντιστροφή χρωμάτων",
            "Light Contrast": "Φωτεινή αντίθεση",
            "Dark Contrast": "Σκοτεινή αντίθεση",
            "High Contrast": "Υψηλή αντίθεση",
            "Smart Contrast": "Έξυπνη αντίθεση",
            "High Saturation": "Υψηλός κορεσμός",
            "Low Saturation": "Χαμηλός κορεσμός",
            "Monochrome": "Μονόχρωμο",
            "Tools": "Εργαλεία",
            "Reading Guide": "Οδηγός ανάγνωσης",
            "Stop Animations": "Διακοπή κινούμενων στοιχείων",
            "Big Cursor": "Μεγάλος δείκτης",
            "Increase Font Size": "Αύξηση μεγέθους γραμματοσειράς",
            "Decrease Font Size": "Μείωση μεγέθους γραμματοσειράς",
            "Letter Spacing": "Απόσταση γραμμάτων",
            "Line Height": "Διάστιχο",
            "Font Weight": "Πάχος γραμματοσειράς",
            "Dyslexia Font": "Γραμματοσειρά για δυσλεξία",
            "Legible Font": "Καθαρή γραμματοσειρά",
            "Font Size": "Μέγεθος γραμματοσειράς",
            "Language": "Γλώσσα",
            "All Languages": "Όλες οι γλώσσες",
            "Search language": "Αναζήτηση γλώσσας",
            "Open Accessibility Menu": "Άνοιγμα μενού προσβασιμότητας",
            "Open accessibility menu": "Άνοιγμα μενού προσβασιμότητας",
            "Hide Images": "Απόκρυψη εικόνων",
            "Skip to accessibility menu": "Μετάβαση στο μενού προσβασιμότητας",
            "Accessibility Report": "Αναφορά προσβασιμότητας",
            "Run Accessibility Check": "Εκτέλεση ελέγχου προσβασιμότητας",
            "Loading...": "Φόρτωση...",
            "Analyzing page...": "Ανάλυση σελίδας...",
            "Critical": "Κρίσιμο",
            "Serious": "Σοβαρό",
            "Moderate": "Μέτριο",
            "Minor": "Μικρό",
            "Violations Found": "Βρέθηκαν προβλήματα",
            "No Issues Found": "Δεν βρέθηκαν προβλήματα",
            "Element": "Στοιχείο",
            "Issue": "Πρόβλημα",
            "How to Fix": "Τρόπος διόρθωσης",
            "Close Report": "Κλείσιμο αναφοράς",
            "Passed Tests": "Επιτυχημένοι έλεγχοι",
            "Items Need Review": "Στοιχεία προς έλεγχο",
            "Annotations": "Επισημάνσεις",
            "Text to Speech": "Κείμενο σε ομιλία",
            "Text to Speech On": "Κείμενο σε ομιλία ενεργό",
            "Text to Speech Off": "Κείμενο σε ομιλία ανενεργό",
            "Simplify Layout": "Απλοποίηση διάταξης",
            "Speech": "Ομιλία",
            "Text": "Κείμενο",
            "Color & Contrast": "Χρώμα και αντίθεση",
            "Reading Aids": "Βοηθήματα ανάγνωσης",
            "Interaction": "Αλληλεπίδραση",
            "Contrast": "Αντίθεση",
            "Saturation": "Κορεσμός",
            "Light": "Φωτεινό",
            "Dark": "Σκοτεινό",
            "High": "Υψηλό",
            "Low": "Χαμηλό",
            "Play": "Αναπαραγωγή",
            "Pause": "Παύση",
            "Stop": "Διακοπή",
            "Loading voice...": "Φόρτωση φωνής...",
            "Reading...": "Ανάγνωση...",
            "Profiles": "Προφίλ",
            "Seizure Safe": "Ασφαλές για επιληψία",
            "Vision Impaired": "Προβλήματα όρασης",
            "ADHD Friendly": "Φιλικό για ΔΕΠΥ",
            "Dyslexia Friendly": "Φιλικό για δυσλεξία",
            "On": "Ενεργό",
            "Off": "Ανενεργό",
            "Mute Sounds": "Σίγαση ήχων",
            "Page Structure": "Δομή σελίδας",
            "Text Magnifier": "Μεγεθυντής κειμένου",
            "Tooltips": "Συμβουλές",
            "Navigation": "Πλοήγηση",
            "Header": "Κεφαλίδα",
            "Main content": "Κύριο περιεχόμενο",
            "Footer": "Υποσέλιδο",
            "Sidebar": "Πλαϊνή στήλη",
            "Search": "Αναζήτηση",
            "Form": "Φόρμα",
            "Section": "Ενότητα",
            "Headings": "Επικεφαλίδες",
            "Landmarks": "Ορόσημα",
            "Links": "Σύνδεσμοι",
            "No items found": "Δεν βρέθηκαν στοιχεία",
            "Settings reset": "Οι ρυθμίσεις επαναφέρθηκαν",
          },
          ka: {
            "Accessibility": "ხელმისაწვდომობა",
            "Accessibility Options": "ხელმისაწვდომობის პარამეტრები",
            "Accessibility Menu": "ხელმისაწვდომობის მენიუ",
            "Accessibility Statement": "ხელმისაწვდომობის განცხადება",
            "Hide widget": "ვიჯეტის დამალვა",
            "Move widget": "ვიჯეტის გადატანა",
            "This visit": "ეს ვიზიტი",
            "One day": "ერთი დღე",
            "One week": "ერთი კვირა",
            "Always": "ყოველთვის",
            "The widget stays hidden until you clear this site's data in your browser.": "ვიჯეტი დამალული დარჩება, სანამ ბრაუზერში ამ საიტის მონაცემებს არ გაასუფთავებთ.",
            "To bring it back sooner, clear this site's data in your browser.": "მის უფრო ადრე დასაბრუნებლად გაასუფთავეთ ამ საიტის მონაცემები ბრაუზერში.",
            "Hide": "დამალვა",
            "Reset settings": "პარამეტრების აღდგენა",
            "Reset All Settings": "ყველა პარამეტრის აღდგენა",
            "Close": "დახურვა",
            "Content Adjustments": "შინაარსის მორგება",
            "Adjust Font Size": "შრიფტის ზომის მორგება",
            "Highlight Links": "ბმულების გამოკვეთა",
            "Readable Font": "ადვილად წასაკითხი შრიფტი",
            "Color Adjustments": "ფერების მორგება",
            "Invert Colors": "ფერების ინვერსია",
            "Light Contrast": "ღია კონტრასტი",
            "Dark Contrast": "მუქი კონტრასტი",
            "High Contrast": "მაღალი კონტრასტი",
            "Smart Contrast": "ჭკვიანი კონტრასტი",
            "High Saturation": "მაღალი გაჯერებულობა",
            "Low Saturation": "დაბალი გაჯერებულობა",
            "Monochrome": "მონოქრომული",
            "Tools": "ინსტრუმენტები",
            "Reading Guide": "კითხვის ხაზი",
            "Stop Animations": "ანიმაციების შეჩერება",
            "Big Cursor": "დიდი კურსორი",
            "Increase Font Size": "შრიფტის გაზრდა",
            "Decrease Font Size": "შრიფტის შემცირება",
            "Letter Spacing": "ასოებს შორის მანძილი",
            "Line Height": "სტრიქონებს შორის მანძილი",
            "Font Weight": "შრიფტის სისქე",
            "Dyslexia Font": "დისლექსიის შრიფტი",
            "Legible Font": "მკაფიო შრიფტი",
            "Font Size": "შრიფტის ზომა",
            "Language": "ენა",
            "All Languages": "ყველა ენა",
            "Search language": "ენის ძიება",
            "Open Accessibility Menu": "ხელმისაწვდომობის მენიუს გახსნა",
            "Open accessibility menu": "ხელმისაწვდომობის მენიუს გახსნა",
            "Hide Images": "სურათების დამალვა",
            "Skip to accessibility menu": "ხელმისაწვდომობის მენიუზე გადასვლა",
            "Accessibility Report": "ხელმისაწვდომობის ანგარიში",
            "Run Accessibility Check": "ხელმისაწვდომობის შემოწმების გაშვება",
            "Loading...": "იტვირთება...",
            "Analyzing page...": "გვერდის ანალიზი...",
            "Critical": "კრიტიკული",
            "Serious": "სერიოზული",
            "Moderate": "ზომიერი",
            "Minor": "მცირე",
            "Violations Found": "ნაპოვნია პრობლემები",
            "No Issues Found": "პრობლემები არ მოიძებნა",
            "Element": "ელემენტი",
            "Issue": "პრობლემა",
            "How to Fix": "როგორ გამოვასწოროთ",
            "Close Report": "ანგარიშის დახურვა",
            "Passed Tests": "წარმატებული ტესტები",
            "Items Need Review": "გადასამოწმებელი ელემენტები",
            "Annotations": "ანოტაციები",
            "Text to Speech": "ტექსტის გახმოვანება",
            "Text to Speech On": "ტექსტის გახმოვანება ჩართულია",
            "Text to Speech Off": "ტექსტის გახმოვანება გამორთულია",
            "Simplify Layout": "განლაგების გამარტივება",
            "Speech": "მეტყველება",
            "Text": "ტექსტი",
            "Color & Contrast": "ფერი და კონტრასტი",
            "Reading Aids": "კითხვის დამხმარეები",
            "Interaction": "ინტერაქცია",
            "Contrast": "კონტრასტი",
            "Saturation": "გაჯერებულობა",
            "Light": "ღია",
            "Dark": "მუქი",
            "High": "მაღალი",
            "Low": "დაბალი",
            "Play": "დაკვრა",
            "Pause": "პაუზა",
            "Stop": "შეჩერება",
            "Loading voice...": "ხმა იტვირთება...",
            "Reading...": "იკითხება...",
            "Profiles": "პროფილები",
            "Seizure Safe": "უსაფრთხო ეპილეფსიისთვის",
            "Vision Impaired": "მხედველობის დარღვევა",
            "ADHD Friendly": "მოსახერხებელი ADHD-სთვის",
            "Dyslexia Friendly": "მოსახერხებელი დისლექსიისთვის",
            "On": "ჩართულია",
            "Off": "გამორთულია",
            "Mute Sounds": "ხმის გამორთვა",
            "Page Structure": "გვერდის სტრუქტურა",
            "Text Magnifier": "ტექსტის გამადიდებელი",
            "Tooltips": "მინიშნებები",
            "Navigation": "ნავიგაცია",
            "Header": "ზედა კოლონტიტული",
            "Main content": "მთავარი შინაარსი",
            "Footer": "ქვედა კოლონტიტული",
            "Sidebar": "გვერდითი პანელი",
            "Search": "ძიება",
            "Form": "ფორმა",
            "Section": "სექცია",
            "Headings": "სათაურები",
            "Landmarks": "ორიენტირები",
            "Links": "ბმულები",
            "No items found": "ელემენტები არ მოიძებნა",
            "Settings reset": "პარამეტრები აღდგენილია",
          },
          am: {
            "Accessibility": "ተደራሽነት",
            "Accessibility Options": "የተደራሽነት አማራጮች",
            "Accessibility Menu": "የተደራሽነት ምናሌ",
            "Accessibility Statement": "የተደራሽነት መግለጫ",
            "Hide widget": "ዊጅቱን ደብቅ",
            "Move widget": "ዊጅቱን አንቀሳቅስ",
            "This visit": "ይህ ጉብኝት",
            "One day": "አንድ ቀን",
            "One week": "አንድ ሳምንት",
            "Always": "ሁልጊዜ",
            "The widget stays hidden until you clear this site's data in your browser.": "በአሳሽዎ ውስጥ የዚህን ጣቢያ ውሂብ እስኪያጸዱ ድረስ ዊጅቱ ተደብቆ ይቆያል።",
            "To bring it back sooner, clear this site's data in your browser.": "ቀደም ብሎ ለመመለስ በአሳሽዎ ውስጥ የዚህን ጣቢያ ውሂብ ያጽዱ።",
            "Hide": "ደብቅ",
            "Reset settings": "ቅንብሮችን ዳግም አስጀምር",
            "Reset All Settings": "ሁሉንም ቅንብሮች ዳግም አስጀምር",
            "Close": "ዝጋ",
            "Content Adjustments": "የይዘት ማስተካከያዎች",
            "Adjust Font Size": "የቅርጸ-ቁምፊ መጠን አስተካክል",
            "Highlight Links": "አገናኞችን አድምቅ",
            "Readable Font": "ተነባቢ ቅርጸ-ቁምፊ",
            "Color Adjustments": "የቀለም ማስተካከያዎች",
            "Invert Colors": "ቀለማትን ገልብጥ",
            "Light Contrast": "ብሩህ ንፅፅር",
            "Dark Contrast": "ጨለማ ንፅፅር",
            "High Contrast": "ከፍተኛ ንፅፅር",
            "Smart Contrast": "ብልህ ንፅፅር",
            "High Saturation": "ከፍተኛ ሙሌት",
            "Low Saturation": "ዝቅተኛ ሙሌት",
            "Monochrome": "ነጠላ ቀለም",
            "Tools": "መሣሪያዎች",
            "Reading Guide": "የንባብ መሪ",
            "Stop Animations": "እነማዎችን አቁም",
            "Big Cursor": "ትልቅ ጠቋሚ",
            "Increase Font Size": "የቅርጸ-ቁምፊ መጠን ጨምር",
            "Decrease Font Size": "የቅርጸ-ቁምፊ መጠን ቀንስ",
            "Letter Spacing": "የፊደል ክፍተት",
            "Line Height": "የመስመር ቁመት",
            "Font Weight": "የቅርጸ-ቁምፊ ውፍረት",
            "Dyslexia Font": "የዲስሌክሲያ ቅርጸ-ቁምፊ",
            "Legible Font": "ግልጽ ቅርጸ-ቁምፊ",
            "Font Size": "የቅርጸ-ቁምፊ መጠን",
            "Language": "ቋንቋ",
            "All Languages": "ሁሉም ቋንቋዎች",
            "Search language": "ቋንቋ ፈልግ",
            "Open Accessibility Menu": "የተደራሽነት ምናሌ ክፈት",
            "Open accessibility menu": "የተደራሽነት ምናሌ ክፈት",
            "Hide Images": "ምስሎችን ደብቅ",
            "Skip to accessibility menu": "ወደ ተደራሽነት ምናሌ ዝለል",
            "Accessibility Report": "የተደራሽነት ሪፖርት",
            "Run Accessibility Check": "የተደራሽነት ፍተሻ አካሂድ",
            "Loading...": "በመጫን ላይ...",
            "Analyzing page...": "ገጹን በመተንተን ላይ...",
            "Critical": "ወሳኝ",
            "Serious": "ከባድ",
            "Moderate": "መካከለኛ",
            "Minor": "አነስተኛ",
            "Violations Found": "የተገኙ ጥሰቶች",
            "No Issues Found": "ምንም ችግር አልተገኘም",
            "Element": "አካል",
            "Issue": "ችግር",
            "How to Fix": "እንዴት እንደሚስተካከል",
            "Close Report": "ሪፖርቱን ዝጋ",
            "Passed Tests": "ያለፉ ፍተሻዎች",
            "Items Need Review": "ግምገማ የሚያስፈልጋቸው ንጥሎች",
            "Annotations": "ማብራሪያዎች",
            "Text to Speech": "ጽሑፍ ወደ ንግግር",
            "Text to Speech On": "ጽሑፍ ወደ ንግግር በርቷል",
            "Text to Speech Off": "ጽሑፍ ወደ ንግግር ጠፍቷል",
            "Simplify Layout": "አቀማመጥን አቃልል",
            "Speech": "ንግግር",
            "Text": "ጽሑፍ",
            "Color & Contrast": "ቀለም እና ንፅፅር",
            "Reading Aids": "የንባብ አጋዦች",
            "Interaction": "መስተጋብር",
            "Contrast": "ንፅፅር",
            "Saturation": "ሙሌት",
            "Light": "ብሩህ",
            "Dark": "ጨለማ",
            "High": "ከፍተኛ",
            "Low": "ዝቅተኛ",
            "Play": "አጫውት",
            "Pause": "ለአፍታ አቁም",
            "Stop": "አቁም",
            "Loading voice...": "ድምፅ በመጫን ላይ...",
            "Reading...": "በማንበብ ላይ...",
            "Profiles": "መገለጫዎች",
            "Seizure Safe": "ለሚጥል በሽታ አስተማማኝ",
            "Vision Impaired": "የእይታ እክል",
            "ADHD Friendly": "ለኤዲኤችዲ ምቹ",
            "Dyslexia Friendly": "ለዲስሌክሲያ ምቹ",
            "On": "በርቷል",
            "Off": "ጠፍቷል",
            "Mute Sounds": "ድምፆችን አጥፋ",
            "Page Structure": "የገጽ መዋቅር",
            "Text Magnifier": "የጽሑፍ ማጉያ",
            "Tooltips": "ፍንጮች",
            "Navigation": "አሰሳ",
            "Header": "ራስጌ",
            "Main content": "ዋና ይዘት",
            "Footer": "ግርጌ",
            "Sidebar": "የጎን አሞሌ",
            "Search": "ፍለጋ",
            "Form": "ቅጽ",
            "Section": "ክፍል",
            "Headings": "ርዕሶች",
            "Landmarks": "ምልክቶች",
            "Links": "አገናኞች",
            "No items found": "ምንም ንጥል አልተገኘም",
            "Settings reset": "ቅንብሮች ዳግም ተጀምረዋል",
          },
          bg: {
            "Accessibility": "Достъпност",
            "Accessibility Options": "Опции за достъпност",
            "Accessibility Menu": "Меню за достъпност",
            "Accessibility Statement": "Декларация за достъпност",
            "Hide widget": "Скриване на уиджета",
            "Move widget": "Преместване на уиджета",
            "This visit": "Това посещение",
            "One day": "Един ден",
            "One week": "Една седмица",
            "Always": "Винаги",
            "The widget stays hidden until you clear this site's data in your browser.": "Уиджетът остава скрит, докато не изчистите данните на този сайт в браузъра си.",
            "To bring it back sooner, clear this site's data in your browser.": "За да го върнете по-рано, изчистете данните на този сайт в браузъра си.",
            "Hide": "Скриване",
            "Reset settings": "Нулиране на настройките",
            "Reset All Settings": "Нулиране на всички настройки",
            "Close": "Затвори",
            "Content Adjustments": "Настройки на съдържанието",
            "Adjust Font Size": "Промяна на размера на шрифта",
            "Highlight Links": "Открояване на връзки",
            "Readable Font": "Четлив шрифт",
            "Color Adjustments": "Настройки на цветовете",
            "Invert Colors": "Инвертиране на цветовете",
            "Light Contrast": "Светъл контраст",
            "Dark Contrast": "Тъмен контраст",
            "High Contrast": "Висок контраст",
            "Smart Contrast": "Умен контраст",
            "High Saturation": "Висока наситеност",
            "Low Saturation": "Ниска наситеност",
            "Monochrome": "Монохром",
            "Tools": "Инструменти",
            "Reading Guide": "Линия за четене",
            "Stop Animations": "Спиране на анимациите",
            "Big Cursor": "Голям курсор",
            "Increase Font Size": "Увеличаване на шрифта",
            "Decrease Font Size": "Намаляване на шрифта",
            "Letter Spacing": "Разстояние между буквите",
            "Line Height": "Междуредие",
            "Font Weight": "Дебелина на шрифта",
            "Dyslexia Font": "Шрифт за дислексия",
            "Legible Font": "Ясен шрифт",
            "Font Size": "Размер на шрифта",
            "Language": "Език",
            "All Languages": "Всички езици",
            "Search language": "Търсене на език",
            "Open Accessibility Menu": "Отваряне на менюто за достъпност",
            "Open accessibility menu": "Отваряне на менюто за достъпност",
            "Hide Images": "Скриване на изображенията",
            "Skip to accessibility menu": "Към менюто за достъпност",
            "Accessibility Report": "Доклад за достъпност",
            "Run Accessibility Check": "Стартиране на проверка за достъпност",
            "Loading...": "Зареждане...",
            "Analyzing page...": "Анализиране на страницата...",
            "Critical": "Критично",
            "Serious": "Сериозно",
            "Moderate": "Умерено",
            "Minor": "Незначително",
            "Violations Found": "Открити нарушения",
            "No Issues Found": "Не са открити проблеми",
            "Element": "Елемент",
            "Issue": "Проблем",
            "How to Fix": "Как да се поправи",
            "Close Report": "Затваряне на доклада",
            "Passed Tests": "Преминати тестове",
            "Items Need Review": "Елементи за преглед",
            "Annotations": "Анотации",
            "Text to Speech": "Четене на глас",
            "Text to Speech On": "Четене на глас: включено",
            "Text to Speech Off": "Четене на глас: изключено",
            "Simplify Layout": "Опростяване на изгледа",
            "Speech": "Говор",
            "Text": "Текст",
            "Color & Contrast": "Цвят и контраст",
            "Reading Aids": "Помощ при четене",
            "Interaction": "Взаимодействие",
            "Contrast": "Контраст",
            "Saturation": "Наситеност",
            "Light": "Светло",
            "Dark": "Тъмно",
            "High": "Високо",
            "Low": "Ниско",
            "Play": "Възпроизвеждане",
            "Pause": "Пауза",
            "Stop": "Стоп",
            "Loading voice...": "Зареждане на глас...",
            "Reading...": "Четене...",
            "Profiles": "Профили",
            "Seizure Safe": "Безопасен при епилепсия",
            "Vision Impaired": "За увредено зрение",
            "ADHD Friendly": "Подходящ при СДВХ",
            "Dyslexia Friendly": "Подходящ при дислексия",
            "On": "Вкл.",
            "Off": "Изкл.",
            "Mute Sounds": "Заглушаване на звука",
            "Page Structure": "Структура на страницата",
            "Text Magnifier": "Лупа за текст",
            "Tooltips": "Подсказки",
            "Navigation": "Навигация",
            "Header": "Заглавна част",
            "Main content": "Основно съдържание",
            "Footer": "Долна част",
            "Sidebar": "Странична лента",
            "Search": "Търсене",
            "Form": "Формуляр",
            "Section": "Раздел",
            "Headings": "Заглавия",
            "Landmarks": "Ориентири",
            "Links": "Връзки",
            "No items found": "Няма намерени елементи",
            "Settings reset": "Настройките са нулирани",
          },
          bn: {
            "Accessibility": "অ্যাক্সেসিবিলিটি",
            "Accessibility Options": "অ্যাক্সেসিবিলিটি অপশন",
            "Accessibility Menu": "অ্যাক্সেসিবিলিটি মেনু",
            "Accessibility Statement": "অ্যাক্সেসিবিলিটি বিবৃতি",
            "Hide widget": "উইজেট লুকান",
            "Move widget": "উইজেট সরান",
            "This visit": "এই ভিজিট",
            "One day": "এক দিন",
            "One week": "এক সপ্তাহ",
            "Always": "সবসময়",
            "The widget stays hidden until you clear this site's data in your browser.": "আপনি ব্রাউজারে এই সাইটের ডেটা না মোছা পর্যন্ত উইজেটটি লুকানো থাকবে।",
            "To bring it back sooner, clear this site's data in your browser.": "এটি আগে ফিরিয়ে আনতে, আপনার ব্রাউজারে এই সাইটের ডেটা মুছুন।",
            "Hide": "লুকান",
            "Reset settings": "সেটিংস রিসেট করুন",
            "Reset All Settings": "সব সেটিংস রিসেট করুন",
            "Close": "বন্ধ করুন",
            "Content Adjustments": "কনটেন্ট সমন্বয়",
            "Adjust Font Size": "ফন্টের আকার সমন্বয় করুন",
            "Highlight Links": "লিঙ্ক হাইলাইট করুন",
            "Readable Font": "পাঠযোগ্য ফন্ট",
            "Color Adjustments": "রঙের সমন্বয়",
            "Invert Colors": "রং উল্টান",
            "Light Contrast": "হালকা কনট্রাস্ট",
            "Dark Contrast": "গাঢ় কনট্রাস্ট",
            "High Contrast": "উচ্চ কনট্রাস্ট",
            "Smart Contrast": "স্মার্ট কনট্রাস্ট",
            "High Saturation": "উচ্চ স্যাচুরেশন",
            "Low Saturation": "কম স্যাচুরেশন",
            "Monochrome": "একরঙা",
            "Tools": "টুলস",
            "Reading Guide": "পড়ার গাইড",
            "Stop Animations": "অ্যানিমেশন বন্ধ করুন",
            "Big Cursor": "বড় কার্সার",
            "Increase Font Size": "ফন্টের আকার বাড়ান",
            "Decrease Font Size": "ফন্টের আকার কমান",
            "Letter Spacing": "অক্ষরের ব্যবধান",
            "Line Height": "লাইনের উচ্চতা",
            "Font Weight": "ফন্টের পুরুত্ব",
            "Dyslexia Font": "ডিসলেক্সিয়া ফন্ট",
            "Legible Font": "সুস্পষ্ট ফন্ট",
            "Font Size": "ফন্টের আকার",
            "Language": "ভাষা",
            "All Languages": "সব ভাষা",
            "Search language": "ভাষা খুঁজুন",
            "Open Accessibility Menu": "অ্যাক্সেসিবিলিটি মেনু খুলুন",
            "Open accessibility menu": "অ্যাক্সেসিবিলিটি মেনু খুলুন",
            "Hide Images": "ছবি লুকান",
            "Skip to accessibility menu": "অ্যাক্সেসিবিলিটি মেনুতে যান",
            "Accessibility Report": "অ্যাক্সেসিবিলিটি রিপোর্ট",
            "Run Accessibility Check": "অ্যাক্সেসিবিলিটি পরীক্ষা চালান",
            "Loading...": "লোড হচ্ছে...",
            "Analyzing page...": "পৃষ্ঠা বিশ্লেষণ করা হচ্ছে...",
            "Critical": "অতি গুরুতর",
            "Serious": "গুরুতর",
            "Moderate": "মাঝারি",
            "Minor": "সামান্য",
            "Violations Found": "লঙ্ঘন পাওয়া গেছে",
            "No Issues Found": "কোনো সমস্যা পাওয়া যায়নি",
            "Element": "এলিমেন্ট",
            "Issue": "সমস্যা",
            "How to Fix": "কীভাবে ঠিক করবেন",
            "Close Report": "রিপোর্ট বন্ধ করুন",
            "Passed Tests": "উত্তীর্ণ পরীক্ষা",
            "Items Need Review": "পর্যালোচনা প্রয়োজন এমন আইটেম",
            "Annotations": "টীকা",
            "Text to Speech": "টেক্সট টু স্পিচ",
            "Text to Speech On": "টেক্সট টু স্পিচ চালু",
            "Text to Speech Off": "টেক্সট টু স্পিচ বন্ধ",
            "Simplify Layout": "লেআউট সরল করুন",
            "Speech": "স্পিচ",
            "Text": "টেক্সট",
            "Color & Contrast": "রং ও কনট্রাস্ট",
            "Reading Aids": "পড়ার সহায়তা",
            "Interaction": "ইন্টারঅ্যাকশন",
            "Contrast": "কনট্রাস্ট",
            "Saturation": "স্যাচুরেশন",
            "Light": "হালকা",
            "Dark": "গাঢ়",
            "High": "উচ্চ",
            "Low": "কম",
            "Play": "চালান",
            "Pause": "বিরতি দিন",
            "Stop": "থামান",
            "Loading voice...": "ভয়েস লোড হচ্ছে...",
            "Reading...": "পড়া হচ্ছে...",
            "Profiles": "প্রোফাইল",
            "Seizure Safe": "খিঁচুনি-নিরাপদ",
            "Vision Impaired": "দৃষ্টিপ্রতিবন্ধী",
            "ADHD Friendly": "এডিএইচডি-বান্ধব",
            "Dyslexia Friendly": "ডিসলেক্সিয়া-বান্ধব",
            "On": "চালু",
            "Off": "বন্ধ",
            "Mute Sounds": "শব্দ বন্ধ করুন",
            "Page Structure": "পৃষ্ঠার কাঠামো",
            "Text Magnifier": "টেক্সট ম্যাগনিফায়ার",
            "Tooltips": "টুলটিপ",
            "Navigation": "নেভিগেশন",
            "Header": "হেডার",
            "Main content": "মূল বিষয়বস্তু",
            "Footer": "ফুটার",
            "Sidebar": "সাইডবার",
            "Search": "অনুসন্ধান",
            "Form": "ফর্ম",
            "Section": "বিভাগ",
            "Headings": "শিরোনাম",
            "Landmarks": "ল্যান্ডমার্ক",
            "Links": "লিঙ্ক",
            "No items found": "কোনো আইটেম পাওয়া যায়নি",
            "Settings reset": "সেটিংস রিসেট হয়েছে",
          },
          cs: {
            "Accessibility": "Přístupnost",
            "Accessibility Options": "Možnosti přístupnosti",
            "Accessibility Menu": "Nabídka přístupnosti",
            "Accessibility Statement": "Prohlášení o přístupnosti",
            "Hide widget": "Skrýt widget",
            "Move widget": "Přesunout widget",
            "This visit": "Tato návštěva",
            "One day": "Jeden den",
            "One week": "Jeden týden",
            "Always": "Vždy",
            "The widget stays hidden until you clear this site's data in your browser.": "Widget zůstane skrytý, dokud v prohlížeči nevymažete data tohoto webu.",
            "To bring it back sooner, clear this site's data in your browser.": "Chcete-li jej vrátit dříve, vymažte v prohlížeči data tohoto webu.",
            "Hide": "Skrýt",
            "Reset settings": "Obnovit nastavení",
            "Reset All Settings": "Obnovit všechna nastavení",
            "Close": "Zavřít",
            "Content Adjustments": "Úpravy obsahu",
            "Adjust Font Size": "Upravit velikost písma",
            "Highlight Links": "Zvýraznit odkazy",
            "Readable Font": "Čitelné písmo",
            "Color Adjustments": "Úpravy barev",
            "Invert Colors": "Invertovat barvy",
            "Light Contrast": "Světlý kontrast",
            "Dark Contrast": "Tmavý kontrast",
            "High Contrast": "Vysoký kontrast",
            "Smart Contrast": "Chytrý kontrast",
            "High Saturation": "Vysoká sytost",
            "Low Saturation": "Nízká sytost",
            "Monochrome": "Monochromatický režim",
            "Tools": "Nástroje",
            "Reading Guide": "Vodítko pro čtení",
            "Stop Animations": "Zastavit animace",
            "Big Cursor": "Velký kurzor",
            "Increase Font Size": "Zvětšit písmo",
            "Decrease Font Size": "Zmenšit písmo",
            "Letter Spacing": "Mezery mezi písmeny",
            "Line Height": "Výška řádku",
            "Font Weight": "Tloušťka písma",
            "Dyslexia Font": "Písmo pro dyslektiky",
            "Legible Font": "Zřetelné písmo",
            "Font Size": "Velikost písma",
            "Language": "Jazyk",
            "All Languages": "Všechny jazyky",
            "Search language": "Hledat jazyk",
            "Open Accessibility Menu": "Otevřít nabídku přístupnosti",
            "Open accessibility menu": "Otevřít nabídku přístupnosti",
            "Hide Images": "Skrýt obrázky",
            "Skip to accessibility menu": "Přeskočit na nabídku přístupnosti",
            "Accessibility Report": "Zpráva o přístupnosti",
            "Run Accessibility Check": "Spustit kontrolu přístupnosti",
            "Loading...": "Načítání...",
            "Analyzing page...": "Probíhá analýza stránky...",
            "Critical": "Kritické",
            "Serious": "Závažné",
            "Moderate": "Střední",
            "Minor": "Drobné",
            "Violations Found": "Nalezená porušení",
            "No Issues Found": "Nebyly nalezeny žádné problémy",
            "Element": "Prvek",
            "Issue": "Problém",
            "How to Fix": "Jak opravit",
            "Close Report": "Zavřít zprávu",
            "Passed Tests": "Úspěšné testy",
            "Items Need Review": "Položky ke kontrole",
            "Annotations": "Anotace",
            "Text to Speech": "Předčítání textu",
            "Text to Speech On": "Předčítání textu zapnuto",
            "Text to Speech Off": "Předčítání textu vypnuto",
            "Simplify Layout": "Zjednodušit rozložení",
            "Speech": "Řeč",
            "Text": "Text",
            "Color & Contrast": "Barvy a kontrast",
            "Reading Aids": "Pomůcky pro čtení",
            "Interaction": "Interakce",
            "Contrast": "Kontrast",
            "Saturation": "Sytost",
            "Light": "Světlý",
            "Dark": "Tmavý",
            "High": "Vysoká",
            "Low": "Nízká",
            "Play": "Přehrát",
            "Pause": "Pozastavit",
            "Stop": "Zastavit",
            "Loading voice...": "Načítání hlasu...",
            "Reading...": "Předčítání...",
            "Profiles": "Profily",
            "Seizure Safe": "Bezpečné při epilepsii",
            "Vision Impaired": "Pro slabozraké",
            "ADHD Friendly": "Vhodné pro ADHD",
            "Dyslexia Friendly": "Vhodné pro dyslektiky",
            "On": "Zapnuto",
            "Off": "Vypnuto",
            "Mute Sounds": "Ztlumit zvuky",
            "Page Structure": "Struktura stránky",
            "Text Magnifier": "Textová lupa",
            "Tooltips": "Nápovědy",
            "Navigation": "Navigace",
            "Header": "Záhlaví",
            "Main content": "Hlavní obsah",
            "Footer": "Zápatí",
            "Sidebar": "Postranní panel",
            "Search": "Hledání",
            "Form": "Formulář",
            "Section": "Sekce",
            "Headings": "Nadpisy",
            "Landmarks": "Orientační body",
            "Links": "Odkazy",
            "No items found": "Nebyly nalezeny žádné položky",
            "Settings reset": "Nastavení obnoveno",
          },
          fa: {
            "Accessibility": "دسترس‌پذیری",
            "Accessibility Options": "گزینه‌های دسترس‌پذیری",
            "Accessibility Menu": "منوی دسترس‌پذیری",
            "Accessibility Statement": "بیانیه دسترس‌پذیری",
            "Hide widget": "پنهان کردن ابزارک",
            "Move widget": "جابه‌جایی ابزارک",
            "This visit": "این بازدید",
            "One day": "یک روز",
            "One week": "یک هفته",
            "Always": "همیشه",
            "The widget stays hidden until you clear this site's data in your browser.": "ابزارک تا زمانی که داده‌های این سایت را در مرورگر خود پاک نکنید پنهان می‌ماند.",
            "To bring it back sooner, clear this site's data in your browser.": "برای بازگرداندن زودتر آن، داده‌های این سایت را در مرورگر خود پاک کنید.",
            "Hide": "پنهان کردن",
            "Reset settings": "بازنشانی تنظیمات",
            "Reset All Settings": "بازنشانی همهٔ تنظیمات",
            "Close": "بستن",
            "Content Adjustments": "تنظیمات محتوا",
            "Adjust Font Size": "تنظیم اندازهٔ قلم",
            "Highlight Links": "برجسته‌سازی پیوندها",
            "Readable Font": "قلم خوانا",
            "Color Adjustments": "تنظیمات رنگ",
            "Invert Colors": "معکوس کردن رنگ‌ها",
            "Light Contrast": "کنتراست روشن",
            "Dark Contrast": "کنتراست تیره",
            "High Contrast": "کنتراست بالا",
            "Smart Contrast": "کنتراست هوشمند",
            "High Saturation": "اشباع بالا",
            "Low Saturation": "اشباع پایین",
            "Monochrome": "تک‌رنگ",
            "Tools": "ابزارها",
            "Reading Guide": "راهنمای خواندن",
            "Stop Animations": "توقف انیمیشن‌ها",
            "Big Cursor": "اشاره‌گر بزرگ",
            "Increase Font Size": "افزایش اندازهٔ قلم",
            "Decrease Font Size": "کاهش اندازهٔ قلم",
            "Letter Spacing": "فاصلهٔ حروف",
            "Line Height": "فاصلهٔ خطوط",
            "Font Weight": "ضخامت قلم",
            "Dyslexia Font": "قلم مخصوص نارساخوانی",
            "Legible Font": "قلم واضح",
            "Font Size": "اندازهٔ قلم",
            "Language": "زبان",
            "All Languages": "همهٔ زبان‌ها",
            "Search language": "جستجوی زبان",
            "Open Accessibility Menu": "باز کردن منوی دسترس‌پذیری",
            "Open accessibility menu": "باز کردن منوی دسترس‌پذیری",
            "Hide Images": "پنهان کردن تصاویر",
            "Skip to accessibility menu": "پرش به منوی دسترس‌پذیری",
            "Accessibility Report": "گزارش دسترس‌پذیری",
            "Run Accessibility Check": "اجرای بررسی دسترس‌پذیری",
            "Loading...": "در حال بارگذاری...",
            "Analyzing page...": "در حال تحلیل صفحه...",
            "Critical": "بحرانی",
            "Serious": "جدی",
            "Moderate": "متوسط",
            "Minor": "جزئی",
            "Violations Found": "موارد نقض یافت‌شده",
            "No Issues Found": "مشکلی یافت نشد",
            "Element": "عنصر",
            "Issue": "مشکل",
            "How to Fix": "نحوهٔ رفع",
            "Close Report": "بستن گزارش",
            "Passed Tests": "آزمون‌های موفق",
            "Items Need Review": "موارد نیازمند بررسی",
            "Annotations": "حاشیه‌نویسی‌ها",
            "Text to Speech": "متن به گفتار",
            "Text to Speech On": "متن به گفتار روشن",
            "Text to Speech Off": "متن به گفتار خاموش",
            "Simplify Layout": "ساده‌سازی چیدمان",
            "Speech": "گفتار",
            "Text": "متن",
            "Color & Contrast": "رنگ و کنتراست",
            "Reading Aids": "کمک‌های خواندن",
            "Interaction": "تعامل",
            "Contrast": "کنتراست",
            "Saturation": "اشباع",
            "Light": "روشن",
            "Dark": "تیره",
            "High": "بالا",
            "Low": "پایین",
            "Play": "پخش",
            "Pause": "مکث",
            "Stop": "توقف",
            "Loading voice...": "در حال بارگذاری صدا...",
            "Reading...": "در حال خواندن...",
            "Profiles": "پروفایل‌ها",
            "Seizure Safe": "ایمن برای صرع",
            "Vision Impaired": "کم‌بینایی",
            "ADHD Friendly": "سازگار با بیش‌فعالی",
            "Dyslexia Friendly": "سازگار با نارساخوانی",
            "On": "روشن",
            "Off": "خاموش",
            "Mute Sounds": "قطع صدا",
            "Page Structure": "ساختار صفحه",
            "Text Magnifier": "ذره‌بین متن",
            "Tooltips": "راهنمای ابزار",
            "Navigation": "ناوبری",
            "Header": "سربرگ",
            "Main content": "محتوای اصلی",
            "Footer": "پابرگ",
            "Sidebar": "نوار کناری",
            "Search": "جستجو",
            "Form": "فرم",
            "Section": "بخش",
            "Headings": "سرفصل‌ها",
            "Landmarks": "مرزنماها",
            "Links": "پیوندها",
            "No items found": "موردی یافت نشد",
            "Settings reset": "تنظیمات بازنشانی شد",
          },
          fi: {
            "Accessibility": "Saavutettavuus",
            "Accessibility Options": "Saavutettavuusasetukset",
            "Accessibility Menu": "Saavutettavuusvalikko",
            "Accessibility Statement": "Saavutettavuusseloste",
            "Hide widget": "Piilota widget",
            "Move widget": "Siirrä widget",
            "This visit": "Tämä käynti",
            "One day": "Yksi päivä",
            "One week": "Yksi viikko",
            "Always": "Aina",
            "The widget stays hidden until you clear this site's data in your browser.": "Widget pysyy piilossa, kunnes tyhjennät tämän sivuston tiedot selaimestasi.",
            "To bring it back sooner, clear this site's data in your browser.": "Saat sen takaisin aiemmin tyhjentämällä tämän sivuston tiedot selaimestasi.",
            "Hide": "Piilota",
            "Reset settings": "Palauta asetukset",
            "Reset All Settings": "Palauta kaikki asetukset",
            "Close": "Sulje",
            "Content Adjustments": "Sisällön säädöt",
            "Adjust Font Size": "Säädä fonttikokoa",
            "Highlight Links": "Korosta linkit",
            "Readable Font": "Luettava fontti",
            "Color Adjustments": "Värisäädöt",
            "Invert Colors": "Käänteiset värit",
            "Light Contrast": "Vaalea kontrasti",
            "Dark Contrast": "Tumma kontrasti",
            "High Contrast": "Korkea kontrasti",
            "Smart Contrast": "Älykäs kontrasti",
            "High Saturation": "Korkea värikylläisyys",
            "Low Saturation": "Matala värikylläisyys",
            "Monochrome": "Yksivärinen",
            "Tools": "Työkalut",
            "Reading Guide": "Lukuviivain",
            "Stop Animations": "Pysäytä animaatiot",
            "Big Cursor": "Suuri osoitin",
            "Increase Font Size": "Suurenna fonttikokoa",
            "Decrease Font Size": "Pienennä fonttikokoa",
            "Letter Spacing": "Kirjainväli",
            "Line Height": "Riviväli",
            "Font Weight": "Fontin paksuus",
            "Dyslexia Font": "Dysleksiafontti",
            "Legible Font": "Selkeä fontti",
            "Font Size": "Fonttikoko",
            "Language": "Kieli",
            "All Languages": "Kaikki kielet",
            "Search language": "Hae kieltä",
            "Open Accessibility Menu": "Avaa saavutettavuusvalikko",
            "Open accessibility menu": "Avaa saavutettavuusvalikko",
            "Hide Images": "Piilota kuvat",
            "Skip to accessibility menu": "Siirry saavutettavuusvalikkoon",
            "Accessibility Report": "Saavutettavuusraportti",
            "Run Accessibility Check": "Suorita saavutettavuustarkistus",
            "Loading...": "Ladataan...",
            "Analyzing page...": "Analysoidaan sivua...",
            "Critical": "Kriittinen",
            "Serious": "Vakava",
            "Moderate": "Kohtalainen",
            "Minor": "Vähäinen",
            "Violations Found": "Löydetyt rikkomukset",
            "No Issues Found": "Ongelmia ei löytynyt",
            "Element": "Elementti",
            "Issue": "Ongelma",
            "How to Fix": "Korjausohje",
            "Close Report": "Sulje raportti",
            "Passed Tests": "Läpäistyt testit",
            "Items Need Review": "Tarkistettavat kohteet",
            "Annotations": "Merkinnät",
            "Text to Speech": "Tekstistä puheeksi",
            "Text to Speech On": "Tekstistä puheeksi käytössä",
            "Text to Speech Off": "Tekstistä puheeksi pois käytöstä",
            "Simplify Layout": "Yksinkertaista asettelu",
            "Speech": "Puhe",
            "Text": "Teksti",
            "Color & Contrast": "Värit ja kontrasti",
            "Reading Aids": "Lukemisen apuvälineet",
            "Interaction": "Vuorovaikutus",
            "Contrast": "Kontrasti",
            "Saturation": "Värikylläisyys",
            "Light": "Vaalea",
            "Dark": "Tumma",
            "High": "Korkea",
            "Low": "Matala",
            "Play": "Toista",
            "Pause": "Keskeytä",
            "Stop": "Pysäytä",
            "Loading voice...": "Ladataan ääntä...",
            "Reading...": "Luetaan...",
            "Profiles": "Profiilit",
            "Seizure Safe": "Epilepsiaturvallinen",
            "Vision Impaired": "Näkövammaiset",
            "ADHD Friendly": "ADHD-ystävällinen",
            "Dyslexia Friendly": "Dysleksiaystävällinen",
            "On": "Päällä",
            "Off": "Pois",
            "Mute Sounds": "Mykistä äänet",
            "Page Structure": "Sivun rakenne",
            "Text Magnifier": "Tekstin suurennuslasi",
            "Tooltips": "Työkaluvihjeet",
            "Navigation": "Navigointi",
            "Header": "Ylätunniste",
            "Main content": "Pääsisältö",
            "Footer": "Alatunniste",
            "Sidebar": "Sivupalkki",
            "Search": "Haku",
            "Form": "Lomake",
            "Section": "Osio",
            "Headings": "Otsikot",
            "Landmarks": "Maamerkit",
            "Links": "Linkit",
            "No items found": "Kohteita ei löytynyt",
            "Settings reset": "Asetukset palautettu",
          },
          fil: {
            "Accessibility": "Accessibility",
            "Accessibility Options": "Mga Opsyon sa Accessibility",
            "Accessibility Menu": "Menu ng Accessibility",
            "Accessibility Statement": "Pahayag sa Accessibility",
            "Hide widget": "Itago ang widget",
            "Move widget": "Ilipat ang widget",
            "This visit": "Sa pagbisitang ito",
            "One day": "Isang araw",
            "One week": "Isang linggo",
            "Always": "Palagi",
            "The widget stays hidden until you clear this site's data in your browser.": "Mananatiling nakatago ang widget hanggang i-clear mo ang data ng site na ito sa iyong browser.",
            "To bring it back sooner, clear this site's data in your browser.": "Para maibalik ito nang mas maaga, i-clear ang data ng site na ito sa iyong browser.",
            "Hide": "Itago",
            "Reset settings": "I-reset ang mga setting",
            "Reset All Settings": "I-reset ang Lahat ng Setting",
            "Close": "Isara",
            "Content Adjustments": "Mga Pagsasaayos sa Nilalaman",
            "Adjust Font Size": "Isaayos ang Laki ng Font",
            "Highlight Links": "I-highlight ang Mga Link",
            "Readable Font": "Nababasang Font",
            "Color Adjustments": "Mga Pagsasaayos sa Kulay",
            "Invert Colors": "I-invert ang Mga Kulay",
            "Light Contrast": "Maliwanag na Contrast",
            "Dark Contrast": "Madilim na Contrast",
            "High Contrast": "Mataas na Contrast",
            "Smart Contrast": "Matalinong Contrast",
            "High Saturation": "Mataas na Saturation",
            "Low Saturation": "Mababang Saturation",
            "Monochrome": "Monochrome",
            "Tools": "Mga Tool",
            "Reading Guide": "Gabay sa Pagbabasa",
            "Stop Animations": "Ihinto ang Mga Animation",
            "Big Cursor": "Malaking Cursor",
            "Increase Font Size": "Palakihin ang Font",
            "Decrease Font Size": "Paliitin ang Font",
            "Letter Spacing": "Pagitan ng Mga Titik",
            "Line Height": "Taas ng Linya",
            "Font Weight": "Kapal ng Font",
            "Dyslexia Font": "Font para sa Dyslexia",
            "Legible Font": "Malinaw na Font",
            "Font Size": "Laki ng Font",
            "Language": "Wika",
            "All Languages": "Lahat ng Wika",
            "Search language": "Maghanap ng wika",
            "Open Accessibility Menu": "Buksan ang Menu ng Accessibility",
            "Open accessibility menu": "Buksan ang menu ng accessibility",
            "Hide Images": "Itago ang Mga Larawan",
            "Skip to accessibility menu": "Lumaktaw sa menu ng accessibility",
            "Accessibility Report": "Ulat sa Accessibility",
            "Run Accessibility Check": "Patakbuhin ang Pagsusuri sa Accessibility",
            "Loading...": "Naglo-load...",
            "Analyzing page...": "Sinusuri ang pahina...",
            "Critical": "Kritikal",
            "Serious": "Malubha",
            "Moderate": "Katamtaman",
            "Minor": "Maliit",
            "Violations Found": "Mga Nakitang Paglabag",
            "No Issues Found": "Walang Nakitang Isyu",
            "Element": "Elemento",
            "Issue": "Isyu",
            "How to Fix": "Paano Aayusin",
            "Close Report": "Isara ang Ulat",
            "Passed Tests": "Mga Pumasang Pagsusuri",
            "Items Need Review": "Mga Item na Kailangang Suriin",
            "Annotations": "Mga Anotasyon",
            "Text to Speech": "Text to Speech",
            "Text to Speech On": "Naka-on ang Text to Speech",
            "Text to Speech Off": "Naka-off ang Text to Speech",
            "Simplify Layout": "Pasimplehin ang Layout",
            "Speech": "Pagsasalita",
            "Text": "Teksto",
            "Color & Contrast": "Kulay at Contrast",
            "Reading Aids": "Mga Tulong sa Pagbabasa",
            "Interaction": "Interaksyon",
            "Contrast": "Contrast",
            "Saturation": "Saturation",
            "Light": "Maliwanag",
            "Dark": "Madilim",
            "High": "Mataas",
            "Low": "Mababa",
            "Play": "I-play",
            "Pause": "I-pause",
            "Stop": "Ihinto",
            "Loading voice...": "Naglo-load ng boses...",
            "Reading...": "Binabasa...",
            "Profiles": "Mga Profile",
            "Seizure Safe": "Ligtas sa Seizure",
            "Vision Impaired": "May Kapansanan sa Paningin",
            "ADHD Friendly": "Angkop sa ADHD",
            "Dyslexia Friendly": "Angkop sa Dyslexia",
            "On": "Naka-on",
            "Off": "Naka-off",
            "Mute Sounds": "I-mute ang Mga Tunog",
            "Page Structure": "Istruktura ng Pahina",
            "Text Magnifier": "Pampalaki ng Teksto",
            "Tooltips": "Mga Tooltip",
            "Navigation": "Nabigasyon",
            "Header": "Header",
            "Main content": "Pangunahing nilalaman",
            "Footer": "Footer",
            "Sidebar": "Sidebar",
            "Search": "Paghahanap",
            "Form": "Form",
            "Section": "Seksyon",
            "Headings": "Mga Heading",
            "Landmarks": "Mga Landmark",
            "Links": "Mga Link",
            "No items found": "Walang nakitang item",
            "Settings reset": "Na-reset ang mga setting",
          },
          hi: {
            "Accessibility": "सुलभता",
            "Accessibility Options": "सुलभता विकल्प",
            "Accessibility Menu": "सुलभता मेनू",
            "Accessibility Statement": "सुलभता वक्तव्य",
            "Hide widget": "विजेट छिपाएँ",
            "Move widget": "विजेट की जगह बदलें",
            "This visit": "यह विज़िट",
            "One day": "एक दिन",
            "One week": "एक सप्ताह",
            "Always": "हमेशा",
            "The widget stays hidden until you clear this site's data in your browser.": "जब तक आप अपने ब्राउज़र में इस साइट का डेटा साफ़ नहीं करते, विजेट छिपा रहेगा।",
            "To bring it back sooner, clear this site's data in your browser.": "इसे पहले वापस लाने के लिए, अपने ब्राउज़र में इस साइट का डेटा साफ़ करें।",
            "Hide": "छिपाएँ",
            "Reset settings": "सेटिंग्स रीसेट करें",
            "Reset All Settings": "सभी सेटिंग्स रीसेट करें",
            "Close": "बंद करें",
            "Content Adjustments": "सामग्री समायोजन",
            "Adjust Font Size": "फ़ॉन्ट आकार समायोजित करें",
            "Highlight Links": "लिंक हाइलाइट करें",
            "Readable Font": "पठनीय फ़ॉन्ट",
            "Color Adjustments": "रंग समायोजन",
            "Invert Colors": "रंग उलटें",
            "Light Contrast": "हल्का कंट्रास्ट",
            "Dark Contrast": "गहरा कंट्रास्ट",
            "High Contrast": "उच्च कंट्रास्ट",
            "Smart Contrast": "स्मार्ट कंट्रास्ट",
            "High Saturation": "उच्च सैचुरेशन",
            "Low Saturation": "कम सैचुरेशन",
            "Monochrome": "मोनोक्रोम",
            "Tools": "टूल्स",
            "Reading Guide": "पठन गाइड",
            "Stop Animations": "एनिमेशन रोकें",
            "Big Cursor": "बड़ा कर्सर",
            "Increase Font Size": "फ़ॉन्ट आकार बढ़ाएँ",
            "Decrease Font Size": "फ़ॉन्ट आकार घटाएँ",
            "Letter Spacing": "अक्षर अंतराल",
            "Line Height": "पंक्ति ऊँचाई",
            "Font Weight": "फ़ॉन्ट मोटाई",
            "Dyslexia Font": "डिस्लेक्सिया फ़ॉन्ट",
            "Legible Font": "सुपाठ्य फ़ॉन्ट",
            "Font Size": "फ़ॉन्ट आकार",
            "Language": "भाषा",
            "All Languages": "सभी भाषाएँ",
            "Search language": "भाषा खोजें",
            "Open Accessibility Menu": "सुलभता मेनू खोलें",
            "Open accessibility menu": "सुलभता मेनू खोलें",
            "Hide Images": "छवियाँ छिपाएँ",
            "Skip to accessibility menu": "सुलभता मेनू पर जाएँ",
            "Accessibility Report": "सुलभता रिपोर्ट",
            "Run Accessibility Check": "सुलभता जाँच चलाएँ",
            "Loading...": "लोड हो रहा है...",
            "Analyzing page...": "पृष्ठ का विश्लेषण हो रहा है...",
            "Critical": "अति गंभीर",
            "Serious": "गंभीर",
            "Moderate": "मध्यम",
            "Minor": "मामूली",
            "Violations Found": "उल्लंघन पाए गए",
            "No Issues Found": "कोई समस्या नहीं मिली",
            "Element": "एलिमेंट",
            "Issue": "समस्या",
            "How to Fix": "ठीक करने का तरीका",
            "Close Report": "रिपोर्ट बंद करें",
            "Passed Tests": "पास हुए परीक्षण",
            "Items Need Review": "समीक्षा के लिए आइटम",
            "Annotations": "एनोटेशन",
            "Text to Speech": "टेक्स्ट-टू-स्पीच",
            "Text to Speech On": "टेक्स्ट-टू-स्पीच चालू",
            "Text to Speech Off": "टेक्स्ट-टू-स्पीच बंद",
            "Simplify Layout": "लेआउट सरल करें",
            "Speech": "स्पीच",
            "Text": "टेक्स्ट",
            "Color & Contrast": "रंग और कंट्रास्ट",
            "Reading Aids": "पठन सहायता",
            "Interaction": "इंटरैक्शन",
            "Contrast": "कंट्रास्ट",
            "Saturation": "सैचुरेशन",
            "Light": "हल्का",
            "Dark": "गहरा",
            "High": "उच्च",
            "Low": "कम",
            "Play": "चलाएँ",
            "Pause": "पॉज़ करें",
            "Stop": "रोकें",
            "Loading voice...": "आवाज़ लोड हो रही है...",
            "Reading...": "पढ़ा जा रहा है...",
            "Profiles": "प्रोफ़ाइल",
            "Seizure Safe": "मिर्गी सुरक्षित",
            "Vision Impaired": "दृष्टिबाधित",
            "ADHD Friendly": "एडीएचडी अनुकूल",
            "Dyslexia Friendly": "डिस्लेक्सिया अनुकूल",
            "On": "चालू",
            "Off": "बंद",
            "Mute Sounds": "ध्वनि म्यूट करें",
            "Page Structure": "पृष्ठ संरचना",
            "Text Magnifier": "टेक्स्ट आवर्धक",
            "Tooltips": "टूलटिप",
            "Navigation": "नेविगेशन",
            "Header": "हेडर",
            "Main content": "मुख्य सामग्री",
            "Footer": "फ़ुटर",
            "Sidebar": "साइडबार",
            "Search": "खोज",
            "Form": "फ़ॉर्म",
            "Section": "अनुभाग",
            "Headings": "हेडिंग",
            "Landmarks": "लैंडमार्क",
            "Links": "लिंक",
            "No items found": "कोई आइटम नहीं मिला",
            "Settings reset": "सेटिंग्स रीसेट हो गईं",
          },
          hr: {
            "Accessibility": "Pristupačnost",
            "Accessibility Options": "Opcije pristupačnosti",
            "Accessibility Menu": "Izbornik pristupačnosti",
            "Accessibility Statement": "Izjava o pristupačnosti",
            "Hide widget": "Sakrij widget",
            "Move widget": "Premjesti widget",
            "This visit": "Ovaj posjet",
            "One day": "Jedan dan",
            "One week": "Jedan tjedan",
            "Always": "Uvijek",
            "The widget stays hidden until you clear this site's data in your browser.": "Widget ostaje skriven dok u pregledniku ne izbrišete podatke ove stranice.",
            "To bring it back sooner, clear this site's data in your browser.": "Da biste ga vratili ranije, izbrišite podatke ove stranice u pregledniku.",
            "Hide": "Sakrij",
            "Reset settings": "Vrati postavke na zadano",
            "Reset All Settings": "Vrati sve postavke na zadano",
            "Close": "Zatvori",
            "Content Adjustments": "Prilagodbe sadržaja",
            "Adjust Font Size": "Prilagodi veličinu fonta",
            "Highlight Links": "Istakni poveznice",
            "Readable Font": "Čitljiv font",
            "Color Adjustments": "Prilagodbe boja",
            "Invert Colors": "Invertiraj boje",
            "Light Contrast": "Svijetli kontrast",
            "Dark Contrast": "Tamni kontrast",
            "High Contrast": "Visoki kontrast",
            "Smart Contrast": "Pametni kontrast",
            "High Saturation": "Visoka zasićenost",
            "Low Saturation": "Niska zasićenost",
            "Monochrome": "Monokromatski",
            "Tools": "Alati",
            "Reading Guide": "Vodilica za čitanje",
            "Stop Animations": "Zaustavi animacije",
            "Big Cursor": "Veliki pokazivač",
            "Increase Font Size": "Povećaj veličinu fonta",
            "Decrease Font Size": "Smanji veličinu fonta",
            "Letter Spacing": "Razmak između slova",
            "Line Height": "Prored",
            "Font Weight": "Debljina fonta",
            "Dyslexia Font": "Font za disleksiju",
            "Legible Font": "Čitak font",
            "Font Size": "Veličina fonta",
            "Language": "Jezik",
            "All Languages": "Svi jezici",
            "Search language": "Pretraži jezike",
            "Open Accessibility Menu": "Otvori izbornik pristupačnosti",
            "Open accessibility menu": "Otvori izbornik pristupačnosti",
            "Hide Images": "Sakrij slike",
            "Skip to accessibility menu": "Preskoči na izbornik pristupačnosti",
            "Accessibility Report": "Izvješće o pristupačnosti",
            "Run Accessibility Check": "Pokreni provjeru pristupačnosti",
            "Loading...": "Učitavanje...",
            "Analyzing page...": "Analiza stranice...",
            "Critical": "Kritično",
            "Serious": "Ozbiljno",
            "Moderate": "Umjereno",
            "Minor": "Blago",
            "Violations Found": "Pronađena kršenja",
            "No Issues Found": "Nema pronađenih problema",
            "Element": "Element",
            "Issue": "Problem",
            "How to Fix": "Kako ispraviti",
            "Close Report": "Zatvori izvješće",
            "Passed Tests": "Uspješni testovi",
            "Items Need Review": "Stavke za provjeru",
            "Annotations": "Oznake",
            "Text to Speech": "Tekst u govor",
            "Text to Speech On": "Tekst u govor uključen",
            "Text to Speech Off": "Tekst u govor isključen",
            "Simplify Layout": "Pojednostavi prikaz",
            "Speech": "Govor",
            "Text": "Tekst",
            "Color & Contrast": "Boje i kontrast",
            "Reading Aids": "Pomagala za čitanje",
            "Interaction": "Interakcija",
            "Contrast": "Kontrast",
            "Saturation": "Zasićenost",
            "Light": "Svijetlo",
            "Dark": "Tamno",
            "High": "Visoko",
            "Low": "Nisko",
            "Play": "Reproduciraj",
            "Pause": "Pauziraj",
            "Stop": "Zaustavi",
            "Loading voice...": "Učitavanje glasa...",
            "Reading...": "Čitanje...",
            "Profiles": "Profili",
            "Seizure Safe": "Sigurno za epilepsiju",
            "Vision Impaired": "Oštećenje vida",
            "ADHD Friendly": "Prilagođeno za ADHD",
            "Dyslexia Friendly": "Prilagođeno za disleksiju",
            "On": "Uključeno",
            "Off": "Isključeno",
            "Mute Sounds": "Isključi zvukove",
            "Page Structure": "Struktura stranice",
            "Text Magnifier": "Povećalo teksta",
            "Tooltips": "Savjeti",
            "Navigation": "Navigacija",
            "Header": "Zaglavlje",
            "Main content": "Glavni sadržaj",
            "Footer": "Podnožje",
            "Sidebar": "Bočna traka",
            "Search": "Pretraživanje",
            "Form": "Obrazac",
            "Section": "Odjeljak",
            "Headings": "Naslovi",
            "Landmarks": "Orijentiri",
            "Links": "Poveznice",
            "No items found": "Nema pronađenih stavki",
            "Settings reset": "Postavke su vraćene na zadano",
          },
          hu: {
            "Accessibility": "Akadálymentesítés",
            "Accessibility Options": "Akadálymentesítési beállítások",
            "Accessibility Menu": "Akadálymentesítési menü",
            "Accessibility Statement": "Akadálymentesítési nyilatkozat",
            "Hide widget": "Widget elrejtése",
            "Move widget": "Widget áthelyezése",
            "This visit": "Ez a látogatás",
            "One day": "Egy nap",
            "One week": "Egy hét",
            "Always": "Mindig",
            "The widget stays hidden until you clear this site's data in your browser.": "A widget rejtve marad, amíg nem törli a webhely adatait a böngészőjében.",
            "To bring it back sooner, clear this site's data in your browser.": "Ha hamarabb szeretné visszahozni, törölje a webhely adatait a böngészőjében.",
            "Hide": "Elrejtés",
            "Reset settings": "Beállítások visszaállítása",
            "Reset All Settings": "Összes beállítás visszaállítása",
            "Close": "Bezárás",
            "Content Adjustments": "Tartalmi beállítások",
            "Adjust Font Size": "Betűméret módosítása",
            "Highlight Links": "Hivatkozások kiemelése",
            "Readable Font": "Olvasható betűtípus",
            "Color Adjustments": "Színbeállítások",
            "Invert Colors": "Színek invertálása",
            "Light Contrast": "Világos kontraszt",
            "Dark Contrast": "Sötét kontraszt",
            "High Contrast": "Magas kontraszt",
            "Smart Contrast": "Intelligens kontraszt",
            "High Saturation": "Magas telítettség",
            "Low Saturation": "Alacsony telítettség",
            "Monochrome": "Monokróm",
            "Tools": "Eszközök",
            "Reading Guide": "Olvasási segédvonal",
            "Stop Animations": "Animációk leállítása",
            "Big Cursor": "Nagy kurzor",
            "Increase Font Size": "Betűméret növelése",
            "Decrease Font Size": "Betűméret csökkentése",
            "Letter Spacing": "Betűköz",
            "Line Height": "Sormagasság",
            "Font Weight": "Betűvastagság",
            "Dyslexia Font": "Diszlexiabarát betűtípus",
            "Legible Font": "Könnyen olvasható betűtípus",
            "Font Size": "Betűméret",
            "Language": "Nyelv",
            "All Languages": "Összes nyelv",
            "Search language": "Nyelv keresése",
            "Open Accessibility Menu": "Akadálymentesítési menü megnyitása",
            "Open accessibility menu": "Akadálymentesítési menü megnyitása",
            "Hide Images": "Képek elrejtése",
            "Skip to accessibility menu": "Ugrás az akadálymentesítési menüre",
            "Accessibility Report": "Akadálymentesítési jelentés",
            "Run Accessibility Check": "Akadálymentesítési ellenőrzés futtatása",
            "Loading...": "Betöltés...",
            "Analyzing page...": "Oldal elemzése...",
            "Critical": "Kritikus",
            "Serious": "Súlyos",
            "Moderate": "Közepes",
            "Minor": "Enyhe",
            "Violations Found": "Talált hibák",
            "No Issues Found": "Nem található probléma",
            "Element": "Elem",
            "Issue": "Probléma",
            "How to Fix": "Javítás módja",
            "Close Report": "Jelentés bezárása",
            "Passed Tests": "Sikeres tesztek",
            "Items Need Review": "Ellenőrzendő elemek",
            "Annotations": "Jelölések",
            "Text to Speech": "Szövegfelolvasás",
            "Text to Speech On": "Szövegfelolvasás bekapcsolva",
            "Text to Speech Off": "Szövegfelolvasás kikapcsolva",
            "Simplify Layout": "Elrendezés egyszerűsítése",
            "Speech": "Beszéd",
            "Text": "Szöveg",
            "Color & Contrast": "Szín és kontraszt",
            "Reading Aids": "Olvasási segédeszközök",
            "Interaction": "Interakció",
            "Contrast": "Kontraszt",
            "Saturation": "Telítettség",
            "Light": "Világos",
            "Dark": "Sötét",
            "High": "Magas",
            "Low": "Alacsony",
            "Play": "Lejátszás",
            "Pause": "Szünet",
            "Stop": "Leállítás",
            "Loading voice...": "Hang betöltése...",
            "Reading...": "Felolvasás...",
            "Profiles": "Profilok",
            "Seizure Safe": "Epilepsziabiztos",
            "Vision Impaired": "Látássérült",
            "ADHD Friendly": "ADHD-barát",
            "Dyslexia Friendly": "Diszlexiabarát",
            "On": "Be",
            "Off": "Ki",
            "Mute Sounds": "Hangok némítása",
            "Page Structure": "Oldalszerkezet",
            "Text Magnifier": "Szövegnagyító",
            "Tooltips": "Eszköztippek",
            "Navigation": "Navigáció",
            "Header": "Fejléc",
            "Main content": "Fő tartalom",
            "Footer": "Lábléc",
            "Sidebar": "Oldalsáv",
            "Search": "Keresés",
            "Form": "Űrlap",
            "Section": "Szakasz",
            "Headings": "Címsorok",
            "Landmarks": "Tájékozódási pontok",
            "Links": "Hivatkozások",
            "No items found": "Nincs találat",
            "Settings reset": "Beállítások visszaállítva",
          },
          id: {
            "Accessibility": "Aksesibilitas",
            "Accessibility Options": "Opsi Aksesibilitas",
            "Accessibility Menu": "Menu Aksesibilitas",
            "Accessibility Statement": "Pernyataan Aksesibilitas",
            "Hide widget": "Sembunyikan widget",
            "Move widget": "Pindahkan widget",
            "This visit": "Kunjungan ini",
            "One day": "Satu hari",
            "One week": "Satu minggu",
            "Always": "Selalu",
            "The widget stays hidden until you clear this site's data in your browser.": "Widget tetap tersembunyi sampai Anda menghapus data situs ini di browser Anda.",
            "To bring it back sooner, clear this site's data in your browser.": "Untuk memunculkannya kembali lebih cepat, hapus data situs ini di browser Anda.",
            "Hide": "Sembunyikan",
            "Reset settings": "Atur ulang pengaturan",
            "Reset All Settings": "Atur Ulang Semua Pengaturan",
            "Close": "Tutup",
            "Content Adjustments": "Penyesuaian Konten",
            "Adjust Font Size": "Sesuaikan Ukuran Font",
            "Highlight Links": "Sorot Tautan",
            "Readable Font": "Font Mudah Dibaca",
            "Color Adjustments": "Penyesuaian Warna",
            "Invert Colors": "Balikkan Warna",
            "Light Contrast": "Kontras Terang",
            "Dark Contrast": "Kontras Gelap",
            "High Contrast": "Kontras Tinggi",
            "Smart Contrast": "Kontras Cerdas",
            "High Saturation": "Saturasi Tinggi",
            "Low Saturation": "Saturasi Rendah",
            "Monochrome": "Monokrom",
            "Tools": "Alat",
            "Reading Guide": "Panduan Membaca",
            "Stop Animations": "Hentikan Animasi",
            "Big Cursor": "Kursor Besar",
            "Increase Font Size": "Perbesar Ukuran Font",
            "Decrease Font Size": "Perkecil Ukuran Font",
            "Letter Spacing": "Jarak Huruf",
            "Line Height": "Jarak Baris",
            "Font Weight": "Ketebalan Font",
            "Dyslexia Font": "Font Disleksia",
            "Legible Font": "Font Jelas",
            "Font Size": "Ukuran Font",
            "Language": "Bahasa",
            "All Languages": "Semua Bahasa",
            "Search language": "Cari bahasa",
            "Open Accessibility Menu": "Buka Menu Aksesibilitas",
            "Open accessibility menu": "Buka menu aksesibilitas",
            "Hide Images": "Sembunyikan Gambar",
            "Skip to accessibility menu": "Langsung ke menu aksesibilitas",
            "Accessibility Report": "Laporan Aksesibilitas",
            "Run Accessibility Check": "Jalankan Pemeriksaan Aksesibilitas",
            "Loading...": "Memuat...",
            "Analyzing page...": "Menganalisis halaman...",
            "Critical": "Kritis",
            "Serious": "Serius",
            "Moderate": "Sedang",
            "Minor": "Ringan",
            "Violations Found": "Pelanggaran Ditemukan",
            "No Issues Found": "Tidak Ditemukan Masalah",
            "Element": "Elemen",
            "Issue": "Masalah",
            "How to Fix": "Cara Memperbaiki",
            "Close Report": "Tutup Laporan",
            "Passed Tests": "Tes yang Lolos",
            "Items Need Review": "Item Perlu Ditinjau",
            "Annotations": "Anotasi",
            "Text to Speech": "Teks ke Ucapan",
            "Text to Speech On": "Teks ke Ucapan Aktif",
            "Text to Speech Off": "Teks ke Ucapan Nonaktif",
            "Simplify Layout": "Sederhanakan Tata Letak",
            "Speech": "Ucapan",
            "Text": "Teks",
            "Color & Contrast": "Warna & Kontras",
            "Reading Aids": "Alat Bantu Baca",
            "Interaction": "Interaksi",
            "Contrast": "Kontras",
            "Saturation": "Saturasi",
            "Light": "Terang",
            "Dark": "Gelap",
            "High": "Tinggi",
            "Low": "Rendah",
            "Play": "Putar",
            "Pause": "Jeda",
            "Stop": "Berhenti",
            "Loading voice...": "Memuat suara...",
            "Reading...": "Membaca...",
            "Profiles": "Profil",
            "Seizure Safe": "Aman dari Kejang",
            "Vision Impaired": "Gangguan Penglihatan",
            "ADHD Friendly": "Ramah ADHD",
            "Dyslexia Friendly": "Ramah Disleksia",
            "On": "Aktif",
            "Off": "Nonaktif",
            "Mute Sounds": "Bisukan Suara",
            "Page Structure": "Struktur Halaman",
            "Text Magnifier": "Pembesar Teks",
            "Tooltips": "Tooltip",
            "Navigation": "Navigasi",
            "Header": "Header",
            "Main content": "Konten utama",
            "Footer": "Footer",
            "Sidebar": "Bilah sisi",
            "Search": "Pencarian",
            "Form": "Formulir",
            "Section": "Bagian",
            "Headings": "Judul",
            "Landmarks": "Landmark",
            "Links": "Tautan",
            "No items found": "Tidak ada item yang ditemukan",
            "Settings reset": "Pengaturan diatur ulang",
          },
          ja: {
            "Accessibility": "アクセシビリティ",
            "Accessibility Options": "アクセシビリティオプション",
            "Accessibility Menu": "アクセシビリティメニュー",
            "Accessibility Statement": "アクセシビリティ声明",
            "Hide widget": "ウィジェットを非表示",
            "Move widget": "ウィジェットを移動",
            "This visit": "今回の訪問",
            "One day": "1日",
            "One week": "1週間",
            "Always": "常に",
            "The widget stays hidden until you clear this site's data in your browser.": "ブラウザでこのサイトのデータを消去するまで、ウィジェットは非表示のままです。",
            "To bring it back sooner, clear this site's data in your browser.": "もっと早く表示を戻すには、ブラウザでこのサイトのデータを消去してください。",
            "Hide": "非表示",
            "Reset settings": "設定をリセット",
            "Reset All Settings": "すべての設定をリセット",
            "Close": "閉じる",
            "Content Adjustments": "コンテンツの調整",
            "Adjust Font Size": "文字サイズの調整",
            "Highlight Links": "リンクを強調表示",
            "Readable Font": "読みやすいフォント",
            "Color Adjustments": "色の調整",
            "Invert Colors": "色を反転",
            "Light Contrast": "ライトコントラスト",
            "Dark Contrast": "ダークコントラスト",
            "High Contrast": "ハイコントラスト",
            "Smart Contrast": "スマートコントラスト",
            "High Saturation": "高彩度",
            "Low Saturation": "低彩度",
            "Monochrome": "モノクロ",
            "Tools": "ツール",
            "Reading Guide": "リーディングガイド",
            "Stop Animations": "アニメーションを停止",
            "Big Cursor": "大きなカーソル",
            "Increase Font Size": "文字サイズを拡大",
            "Decrease Font Size": "文字サイズを縮小",
            "Letter Spacing": "文字間隔",
            "Line Height": "行間",
            "Font Weight": "文字の太さ",
            "Dyslexia Font": "ディスレクシア対応フォント",
            "Legible Font": "視認性の高いフォント",
            "Font Size": "文字サイズ",
            "Language": "言語",
            "All Languages": "すべての言語",
            "Search language": "言語を検索",
            "Open Accessibility Menu": "アクセシビリティメニューを開く",
            "Open accessibility menu": "アクセシビリティメニューを開く",
            "Hide Images": "画像を非表示",
            "Skip to accessibility menu": "アクセシビリティメニューへスキップ",
            "Accessibility Report": "アクセシビリティレポート",
            "Run Accessibility Check": "アクセシビリティチェックを実行",
            "Loading...": "読み込み中…",
            "Analyzing page...": "ページを分析中…",
            "Critical": "重大",
            "Serious": "深刻",
            "Moderate": "中程度",
            "Minor": "軽微",
            "Violations Found": "検出された違反",
            "No Issues Found": "問題は見つかりませんでした",
            "Element": "要素",
            "Issue": "問題",
            "How to Fix": "修正方法",
            "Close Report": "レポートを閉じる",
            "Passed Tests": "合格したテスト",
            "Items Need Review": "要確認の項目",
            "Annotations": "注釈",
            "Text to Speech": "テキスト読み上げ",
            "Text to Speech On": "テキスト読み上げオン",
            "Text to Speech Off": "テキスト読み上げオフ",
            "Simplify Layout": "レイアウトを簡素化",
            "Speech": "音声",
            "Text": "テキスト",
            "Color & Contrast": "色とコントラスト",
            "Reading Aids": "読書補助",
            "Interaction": "操作",
            "Contrast": "コントラスト",
            "Saturation": "彩度",
            "Light": "ライト",
            "Dark": "ダーク",
            "High": "高",
            "Low": "低",
            "Play": "再生",
            "Pause": "一時停止",
            "Stop": "停止",
            "Loading voice...": "音声を読み込み中…",
            "Reading...": "読み上げ中…",
            "Profiles": "プロファイル",
            "Seizure Safe": "発作予防",
            "Vision Impaired": "視覚障害対応",
            "ADHD Friendly": "ADHD対応",
            "Dyslexia Friendly": "ディスレクシア対応",
            "On": "オン",
            "Off": "オフ",
            "Mute Sounds": "サウンドをミュート",
            "Page Structure": "ページ構造",
            "Text Magnifier": "テキスト拡大鏡",
            "Tooltips": "ツールチップ",
            "Navigation": "ナビゲーション",
            "Header": "ヘッダー",
            "Main content": "メインコンテンツ",
            "Footer": "フッター",
            "Sidebar": "サイドバー",
            "Search": "検索",
            "Form": "フォーム",
            "Section": "セクション",
            "Headings": "見出し",
            "Landmarks": "ランドマーク",
            "Links": "リンク",
            "No items found": "項目が見つかりません",
            "Settings reset": "設定をリセットしました",
          },
          kn: {
            "Accessibility": "ಪ್ರವೇಶಿಸುವಿಕೆ",
            "Accessibility Options": "ಪ್ರವೇಶಿಸುವಿಕೆ ಆಯ್ಕೆಗಳು",
            "Accessibility Menu": "ಪ್ರವೇಶಿಸುವಿಕೆ ಮೆನು",
            "Accessibility Statement": "ಪ್ರವೇಶಿಸುವಿಕೆ ಹೇಳಿಕೆ",
            "Hide widget": "ವಿಜೆಟ್ ಮರೆಮಾಡಿ",
            "Move widget": "ವಿಜೆಟ್ ಸರಿಸಿ",
            "This visit": "ಈ ಭೇಟಿ",
            "One day": "ಒಂದು ದಿನ",
            "One week": "ಒಂದು ವಾರ",
            "Always": "ಯಾವಾಗಲೂ",
            "The widget stays hidden until you clear this site's data in your browser.": "ನಿಮ್ಮ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಈ ಸೈಟ್‌ನ ಡೇಟಾವನ್ನು ತೆರವುಗೊಳಿಸುವವರೆಗೆ ವಿಜೆಟ್ ಮರೆಯಾಗಿರುತ್ತದೆ.",
            "To bring it back sooner, clear this site's data in your browser.": "ಇದನ್ನು ಬೇಗ ಮರಳಿ ತರಲು, ನಿಮ್ಮ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಈ ಸೈಟ್‌ನ ಡೇಟಾವನ್ನು ತೆರವುಗೊಳಿಸಿ.",
            "Hide": "ಮರೆಮಾಡಿ",
            "Reset settings": "ಸೆಟ್ಟಿಂಗ್‌ಗಳನ್ನು ಮರುಹೊಂದಿಸಿ",
            "Reset All Settings": "ಎಲ್ಲಾ ಸೆಟ್ಟಿಂಗ್‌ಗಳನ್ನು ಮರುಹೊಂದಿಸಿ",
            "Close": "ಮುಚ್ಚಿ",
            "Content Adjustments": "ವಿಷಯ ಹೊಂದಾಣಿಕೆಗಳು",
            "Adjust Font Size": "ಫಾಂಟ್ ಗಾತ್ರ ಹೊಂದಿಸಿ",
            "Highlight Links": "ಲಿಂಕ್‌ಗಳನ್ನು ಹೈಲೈಟ್ ಮಾಡಿ",
            "Readable Font": "ಓದಬಹುದಾದ ಫಾಂಟ್",
            "Color Adjustments": "ಬಣ್ಣ ಹೊಂದಾಣಿಕೆಗಳು",
            "Invert Colors": "ಬಣ್ಣಗಳನ್ನು ವಿಲೋಮಗೊಳಿಸಿ",
            "Light Contrast": "ತಿಳಿ ಕಾಂಟ್ರಾಸ್ಟ್",
            "Dark Contrast": "ಗಾಢ ಕಾಂಟ್ರಾಸ್ಟ್",
            "High Contrast": "ಅಧಿಕ ಕಾಂಟ್ರಾಸ್ಟ್",
            "Smart Contrast": "ಸ್ಮಾರ್ಟ್ ಕಾಂಟ್ರಾಸ್ಟ್",
            "High Saturation": "ಅಧಿಕ ಸ್ಯಾಚುರೇಶನ್",
            "Low Saturation": "ಕಡಿಮೆ ಸ್ಯಾಚುರೇಶನ್",
            "Monochrome": "ಏಕವರ್ಣ",
            "Tools": "ಪರಿಕರಗಳು",
            "Reading Guide": "ಓದುವ ಮಾರ್ಗದರ್ಶಿ",
            "Stop Animations": "ಅನಿಮೇಶನ್‌ಗಳನ್ನು ನಿಲ್ಲಿಸಿ",
            "Big Cursor": "ದೊಡ್ಡ ಕರ್ಸರ್",
            "Increase Font Size": "ಫಾಂಟ್ ಗಾತ್ರ ಹೆಚ್ಚಿಸಿ",
            "Decrease Font Size": "ಫಾಂಟ್ ಗಾತ್ರ ಕಡಿಮೆ ಮಾಡಿ",
            "Letter Spacing": "ಅಕ್ಷರ ಅಂತರ",
            "Line Height": "ಸಾಲಿನ ಎತ್ತರ",
            "Font Weight": "ಫಾಂಟ್ ದಪ್ಪ",
            "Dyslexia Font": "ಡಿಸ್ಲೆಕ್ಸಿಯಾ ಫಾಂಟ್",
            "Legible Font": "ಸ್ಪಷ್ಟ ಫಾಂಟ್",
            "Font Size": "ಫಾಂಟ್ ಗಾತ್ರ",
            "Language": "ಭಾಷೆ",
            "All Languages": "ಎಲ್ಲಾ ಭಾಷೆಗಳು",
            "Search language": "ಭಾಷೆ ಹುಡುಕಿ",
            "Open Accessibility Menu": "ಪ್ರವೇಶಿಸುವಿಕೆ ಮೆನು ತೆರೆಯಿರಿ",
            "Open accessibility menu": "ಪ್ರವೇಶಿಸುವಿಕೆ ಮೆನು ತೆರೆಯಿರಿ",
            "Hide Images": "ಚಿತ್ರಗಳನ್ನು ಮರೆಮಾಡಿ",
            "Skip to accessibility menu": "ಪ್ರವೇಶಿಸುವಿಕೆ ಮೆನುಗೆ ತೆರಳಿ",
            "Accessibility Report": "ಪ್ರವೇಶಿಸುವಿಕೆ ವರದಿ",
            "Run Accessibility Check": "ಪ್ರವೇಶಿಸುವಿಕೆ ಪರಿಶೀಲನೆ ನಡೆಸಿ",
            "Loading...": "ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
            "Analyzing page...": "ಪುಟವನ್ನು ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...",
            "Critical": "ತೀವ್ರ",
            "Serious": "ಗಂಭೀರ",
            "Moderate": "ಮಧ್ಯಮ",
            "Minor": "ಸಣ್ಣ",
            "Violations Found": "ಉಲ್ಲಂಘನೆಗಳು ಕಂಡುಬಂದಿವೆ",
            "No Issues Found": "ಯಾವುದೇ ಸಮಸ್ಯೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ",
            "Element": "ಘಟಕ",
            "Issue": "ಸಮಸ್ಯೆ",
            "How to Fix": "ಸರಿಪಡಿಸುವುದು ಹೇಗೆ",
            "Close Report": "ವರದಿ ಮುಚ್ಚಿ",
            "Passed Tests": "ಉತ್ತೀರ್ಣಗೊಂಡ ಪರೀಕ್ಷೆಗಳು",
            "Items Need Review": "ಪರಿಶೀಲನೆ ಅಗತ್ಯವಿರುವ ಅಂಶಗಳು",
            "Annotations": "ಟಿಪ್ಪಣಿಗಳು",
            "Text to Speech": "ಪಠ್ಯದಿಂದ ಧ್ವನಿ",
            "Text to Speech On": "ಪಠ್ಯದಿಂದ ಧ್ವನಿ ಆನ್",
            "Text to Speech Off": "ಪಠ್ಯದಿಂದ ಧ್ವನಿ ಆಫ್",
            "Simplify Layout": "ವಿನ್ಯಾಸ ಸರಳಗೊಳಿಸಿ",
            "Speech": "ಧ್ವನಿ",
            "Text": "ಪಠ್ಯ",
            "Color & Contrast": "ಬಣ್ಣ ಮತ್ತು ಕಾಂಟ್ರಾಸ್ಟ್",
            "Reading Aids": "ಓದುವ ಸಹಾಯಕಗಳು",
            "Interaction": "ಪರಸ್ಪರ ಕ್ರಿಯೆ",
            "Contrast": "ಕಾಂಟ್ರಾಸ್ಟ್",
            "Saturation": "ಸ್ಯಾಚುರೇಶನ್",
            "Light": "ತಿಳಿ",
            "Dark": "ಗಾಢ",
            "High": "ಅಧಿಕ",
            "Low": "ಕಡಿಮೆ",
            "Play": "ಪ್ಲೇ",
            "Pause": "ವಿರಾಮ",
            "Stop": "ನಿಲ್ಲಿಸಿ",
            "Loading voice...": "ಧ್ವನಿ ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
            "Reading...": "ಓದಲಾಗುತ್ತಿದೆ...",
            "Profiles": "ಪ್ರೊಫೈಲ್‌ಗಳು",
            "Seizure Safe": "ಅಪಸ್ಮಾರ ಸುರಕ್ಷಿತ",
            "Vision Impaired": "ದೃಷ್ಟಿದೋಷವುಳ್ಳವರು",
            "ADHD Friendly": "ಎಡಿಎಚ್‌ಡಿ ಸ್ನೇಹಿ",
            "Dyslexia Friendly": "ಡಿಸ್ಲೆಕ್ಸಿಯಾ ಸ್ನೇಹಿ",
            "On": "ಆನ್",
            "Off": "ಆಫ್",
            "Mute Sounds": "ಶಬ್ದಗಳನ್ನು ಮ್ಯೂಟ್ ಮಾಡಿ",
            "Page Structure": "ಪುಟದ ರಚನೆ",
            "Text Magnifier": "ಪಠ್ಯ ವರ್ಧಕ",
            "Tooltips": "ಟೂಲ್‌ಟಿಪ್‌ಗಳು",
            "Navigation": "ನ್ಯಾವಿಗೇಷನ್",
            "Header": "ಹೆಡರ್",
            "Main content": "ಮುಖ್ಯ ವಿಷಯ",
            "Footer": "ಫೂಟರ್",
            "Sidebar": "ಸೈಡ್‌ಬಾರ್",
            "Search": "ಹುಡುಕಾಟ",
            "Form": "ಫಾರ್ಮ್",
            "Section": "ವಿಭಾಗ",
            "Headings": "ಶೀರ್ಷಿಕೆಗಳು",
            "Landmarks": "ಲ್ಯಾಂಡ್‌ಮಾರ್ಕ್‌ಗಳು",
            "Links": "ಲಿಂಕ್‌ಗಳು",
            "No items found": "ಯಾವುದೇ ಅಂಶಗಳು ಕಂಡುಬಂದಿಲ್ಲ",
            "Settings reset": "ಸೆಟ್ಟಿಂಗ್‌ಗಳನ್ನು ಮರುಹೊಂದಿಸಲಾಗಿದೆ",
          },
          ko: {
            "Accessibility": "접근성",
            "Accessibility Options": "접근성 옵션",
            "Accessibility Menu": "접근성 메뉴",
            "Accessibility Statement": "접근성 선언문",
            "Hide widget": "위젯 숨기기",
            "Move widget": "위젯 이동",
            "This visit": "이번 방문",
            "One day": "하루",
            "One week": "일주일",
            "Always": "항상",
            "The widget stays hidden until you clear this site's data in your browser.": "브라우저에서 이 사이트의 데이터를 지울 때까지 위젯이 숨겨집니다.",
            "To bring it back sooner, clear this site's data in your browser.": "더 일찍 다시 표시하려면 브라우저에서 이 사이트의 데이터를 지우세요.",
            "Hide": "숨기기",
            "Reset settings": "설정 초기화",
            "Reset All Settings": "모든 설정 초기화",
            "Close": "닫기",
            "Content Adjustments": "콘텐츠 조정",
            "Adjust Font Size": "글자 크기 조정",
            "Highlight Links": "링크 강조",
            "Readable Font": "읽기 쉬운 글꼴",
            "Color Adjustments": "색상 조정",
            "Invert Colors": "색상 반전",
            "Light Contrast": "밝은 대비",
            "Dark Contrast": "어두운 대비",
            "High Contrast": "고대비",
            "Smart Contrast": "스마트 대비",
            "High Saturation": "고채도",
            "Low Saturation": "저채도",
            "Monochrome": "흑백",
            "Tools": "도구",
            "Reading Guide": "읽기 가이드",
            "Stop Animations": "애니메이션 중지",
            "Big Cursor": "큰 커서",
            "Increase Font Size": "글자 크기 확대",
            "Decrease Font Size": "글자 크기 축소",
            "Letter Spacing": "자간",
            "Line Height": "줄 간격",
            "Font Weight": "글자 굵기",
            "Dyslexia Font": "난독증 글꼴",
            "Legible Font": "가독성 높은 글꼴",
            "Font Size": "글자 크기",
            "Language": "언어",
            "All Languages": "모든 언어",
            "Search language": "언어 검색",
            "Open Accessibility Menu": "접근성 메뉴 열기",
            "Open accessibility menu": "접근성 메뉴 열기",
            "Hide Images": "이미지 숨기기",
            "Skip to accessibility menu": "접근성 메뉴로 건너뛰기",
            "Accessibility Report": "접근성 보고서",
            "Run Accessibility Check": "접근성 검사 실행",
            "Loading...": "불러오는 중...",
            "Analyzing page...": "페이지 분석 중...",
            "Critical": "치명적",
            "Serious": "심각",
            "Moderate": "보통",
            "Minor": "경미",
            "Violations Found": "발견된 위반 사항",
            "No Issues Found": "발견된 문제 없음",
            "Element": "요소",
            "Issue": "문제",
            "How to Fix": "해결 방법",
            "Close Report": "보고서 닫기",
            "Passed Tests": "통과한 검사",
            "Items Need Review": "검토가 필요한 항목",
            "Annotations": "주석",
            "Text to Speech": "텍스트 음성 변환",
            "Text to Speech On": "텍스트 음성 변환 켜짐",
            "Text to Speech Off": "텍스트 음성 변환 꺼짐",
            "Simplify Layout": "레이아웃 단순화",
            "Speech": "음성",
            "Text": "텍스트",
            "Color & Contrast": "색상 및 대비",
            "Reading Aids": "읽기 보조",
            "Interaction": "상호작용",
            "Contrast": "대비",
            "Saturation": "채도",
            "Light": "밝음",
            "Dark": "어두움",
            "High": "높음",
            "Low": "낮음",
            "Play": "재생",
            "Pause": "일시정지",
            "Stop": "정지",
            "Loading voice...": "음성 불러오는 중...",
            "Reading...": "읽는 중...",
            "Profiles": "프로필",
            "Seizure Safe": "발작 방지",
            "Vision Impaired": "시각 장애 지원",
            "ADHD Friendly": "ADHD 친화적",
            "Dyslexia Friendly": "난독증 친화적",
            "On": "켜짐",
            "Off": "꺼짐",
            "Mute Sounds": "음소거",
            "Page Structure": "페이지 구조",
            "Text Magnifier": "텍스트 돋보기",
            "Tooltips": "도구 설명",
            "Navigation": "탐색",
            "Header": "머리글",
            "Main content": "주요 콘텐츠",
            "Footer": "바닥글",
            "Sidebar": "사이드바",
            "Search": "검색",
            "Form": "양식",
            "Section": "섹션",
            "Headings": "제목",
            "Landmarks": "랜드마크",
            "Links": "링크",
            "No items found": "항목을 찾을 수 없습니다",
            "Settings reset": "설정이 초기화되었습니다",
          },
          ku: {
            "Accessibility": "Gihîştinbarî",
            "Accessibility Options": "Vebijêrkên Gihîştinbariyê",
            "Accessibility Menu": "Menûya Gihîştinbariyê",
            "Accessibility Statement": "Daxuyaniya gihîştinbariyê",
            "Hide widget": "Widgetê veşêre",
            "Move widget": "Widgetê biguhezîne",
            "This visit": "Ev serdan",
            "One day": "Rojek",
            "One week": "Hefteyek",
            "Always": "Hertim",
            "The widget stays hidden until you clear this site's data in your browser.": "Widget veşartî dimîne heta ku hûn daneyên vê malperê di geroka xwe de paqij bikin.",
            "To bring it back sooner, clear this site's data in your browser.": "Ji bo ku zûtir vegerînin, daneyên vê malperê di geroka xwe de paqij bikin.",
            "Hide": "Veşêre",
            "Reset settings": "Mîhengan vegerîne",
            "Reset All Settings": "Hemû Mîhengan Vegerîne",
            "Close": "Bigire",
            "Content Adjustments": "Eyarên Naverokê",
            "Adjust Font Size": "Mezinahiya Fontê Eyar Bike",
            "Highlight Links": "Girêdanan Diyar Bike",
            "Readable Font": "Fonta Xwendinbar",
            "Color Adjustments": "Eyarên Rengan",
            "Invert Colors": "Rengan Berevajî Bike",
            "Light Contrast": "Kontrasta Ronî",
            "Dark Contrast": "Kontrasta Tarî",
            "High Contrast": "Kontrasta Bilind",
            "Smart Contrast": "Kontrasta Jîr",
            "High Saturation": "Têrbûna Bilind",
            "Low Saturation": "Têrbûna Nizm",
            "Monochrome": "Yekreng",
            "Tools": "Amûr",
            "Reading Guide": "Rêbera Xwendinê",
            "Stop Animations": "Anîmasyonan Rawestîne",
            "Big Cursor": "Kursora Mezin",
            "Increase Font Size": "Mezinahiya Fontê Zêde Bike",
            "Decrease Font Size": "Mezinahiya Fontê Kêm Bike",
            "Letter Spacing": "Navbera Tîpan",
            "Line Height": "Bilindahiya Rêzê",
            "Font Weight": "Giraniya Fontê",
            "Dyslexia Font": "Fonta Dîsleksiyê",
            "Legible Font": "Fonta Zelal",
            "Font Size": "Mezinahiya Fontê",
            "Language": "Ziman",
            "All Languages": "Hemû Zimanan",
            "Search language": "Li zimanan bigere",
            "Open Accessibility Menu": "Menûya Gihîştinbariyê Veke",
            "Open accessibility menu": "Menûya gihîştinbariyê veke",
            "Hide Images": "Wêneyan Veşêre",
            "Skip to accessibility menu": "Derbasî menûya gihîştinbariyê bibe",
            "Accessibility Report": "Rapora Gihîştinbariyê",
            "Run Accessibility Check": "Kontrola Gihîştinbariyê Bimeşîne",
            "Loading...": "Tê barkirin...",
            "Analyzing page...": "Rûpel tê analîzkirin...",
            "Critical": "Krîtîk",
            "Serious": "Giran",
            "Moderate": "Navîn",
            "Minor": "Sivik",
            "Violations Found": "Binpêkirin Hatin Dîtin",
            "No Issues Found": "Tu Pirsgirêk Nehat Dîtin",
            "Element": "Hêman",
            "Issue": "Pirsgirêk",
            "How to Fix": "Çawa Tê Çareserkirin",
            "Close Report": "Raporê Bigire",
            "Passed Tests": "Testên Derbasbûyî",
            "Items Need Review": "Hêmanên Hewceyî Vekolînê",
            "Annotations": "Têbinî",
            "Text to Speech": "Xwendina bi Deng",
            "Text to Speech On": "Xwendina bi Deng Vekirî",
            "Text to Speech Off": "Xwendina bi Deng Girtî",
            "Simplify Layout": "Rûpelê Sade Bike",
            "Speech": "Axaftin",
            "Text": "Nivîs",
            "Color & Contrast": "Reng û Kontrast",
            "Reading Aids": "Alîkariyên Xwendinê",
            "Interaction": "Têkilî",
            "Contrast": "Kontrast",
            "Saturation": "Têrbûna Rengan",
            "Light": "Ronî",
            "Dark": "Tarî",
            "High": "Bilind",
            "Low": "Nizm",
            "Play": "Lê bide",
            "Pause": "Bisekinîne",
            "Stop": "Rawestîne",
            "Loading voice...": "Deng tê barkirin...",
            "Reading...": "Tê xwendin...",
            "Profiles": "Profîl",
            "Seizure Safe": "Ewlehiya Epîlepsiyê",
            "Vision Impaired": "Kêmbînî",
            "ADHD Friendly": "Guncan ji bo ADHD",
            "Dyslexia Friendly": "Guncan ji bo Dîsleksiyê",
            "On": "Vekirî",
            "Off": "Girtî",
            "Mute Sounds": "Dengan Bigire",
            "Page Structure": "Struktura Rûpelê",
            "Text Magnifier": "Mezinkera Nivîsê",
            "Tooltips": "Serişte",
            "Navigation": "Navîgasyon",
            "Header": "Sernav",
            "Main content": "Naveroka sereke",
            "Footer": "Jêrnav",
            "Sidebar": "Darika kêlekê",
            "Search": "Lêgerîn",
            "Form": "Form",
            "Section": "Beş",
            "Headings": "Sernav",
            "Landmarks": "Nîşangeh",
            "Links": "Girêdan",
            "No items found": "Tu hêman nehat dîtin",
            "Settings reset": "Mîheng hatin vegerandin",
          },
          lb: {
            "Accessibility": "Accessibilitéit",
            "Accessibility Options": "Accessibilitéitsoptiounen",
            "Accessibility Menu": "Accessibilitéitsmenü",
            "Accessibility Statement": "Erklärung iwwer d'Accessibilitéit",
            "Hide widget": "Widget verstoppen",
            "Move widget": "Widget réckelen",
            "This visit": "Dëse Besuch",
            "One day": "Een Dag",
            "One week": "Eng Woch",
            "Always": "Ëmmer",
            "The widget stays hidden until you clear this site's data in your browser.": "De Widget bleift verstoppt, bis Dir d'Date vun dësem Site an Ärem Browser läscht.",
            "To bring it back sooner, clear this site's data in your browser.": "Fir en éischter zeréckzekréien, läscht d'Date vun dësem Site an Ärem Browser.",
            "Hide": "Verstoppen",
            "Reset settings": "Astellungen zerécksetzen",
            "Reset All Settings": "All Astellungen zerécksetzen",
            "Close": "Zoumaachen",
            "Content Adjustments": "Inhaltsupassungen",
            "Adjust Font Size": "Schrëftgréisst upassen",
            "Highlight Links": "Linken ervirhiewen",
            "Readable Font": "Liesbar Schrëft",
            "Color Adjustments": "Faarfupassungen",
            "Invert Colors": "Faarwen invertéieren",
            "Light Contrast": "Helle Kontrast",
            "Dark Contrast": "Donkele Kontrast",
            "High Contrast": "Héije Kontrast",
            "Smart Contrast": "Intelligente Kontrast",
            "High Saturation": "Héich Saturatioun",
            "Low Saturation": "Niddreg Saturatioun",
            "Monochrome": "Monochrom",
            "Tools": "Instrumenter",
            "Reading Guide": "Lieslineal",
            "Stop Animations": "Animatioune stoppen",
            "Big Cursor": "Grousse Cursor",
            "Increase Font Size": "Schrëft vergréisseren",
            "Decrease Font Size": "Schrëft verklengeren",
            "Letter Spacing": "Buschtawenofstand",
            "Line Height": "Zeilenhéicht",
            "Font Weight": "Schrëftstäerkt",
            "Dyslexia Font": "Dyslexie-Schrëft",
            "Legible Font": "Kloer Schrëft",
            "Font Size": "Schrëftgréisst",
            "Language": "Sprooch",
            "All Languages": "All Sproochen",
            "Search language": "Sprooch sichen",
            "Open Accessibility Menu": "Accessibilitéitsmenü opmaachen",
            "Open accessibility menu": "Accessibilitéitsmenü opmaachen",
            "Hide Images": "Biller verstoppen",
            "Skip to accessibility menu": "Zum Accessibilitéitsmenü sprangen",
            "Accessibility Report": "Accessibilitéitsrapport",
            "Run Accessibility Check": "Accessibilitéitsiwwerpréiwung starten",
            "Loading...": "Gëtt gelueden...",
            "Analyzing page...": "Säit gëtt analyséiert...",
            "Critical": "Kritesch",
            "Serious": "Schwéier",
            "Moderate": "Moderat",
            "Minor": "Geréng",
            "Violations Found": "Verstéiss fonnt",
            "No Issues Found": "Keng Problemer fonnt",
            "Element": "Element",
            "Issue": "Problem",
            "How to Fix": "Léisung",
            "Close Report": "Rapport zoumaachen",
            "Passed Tests": "Bestanen Tester",
            "Items Need Review": "Elementer ze iwwerpréiwen",
            "Annotations": "Annotatiounen",
            "Text to Speech": "Virliesfunktioun",
            "Text to Speech On": "Virliesfunktioun un",
            "Text to Speech Off": "Virliesfunktioun aus",
            "Simplify Layout": "Layout vereinfachen",
            "Speech": "Virliesen",
            "Text": "Text",
            "Color & Contrast": "Faarf & Kontrast",
            "Reading Aids": "Lieshëllefen",
            "Interaction": "Interaktioun",
            "Contrast": "Kontrast",
            "Saturation": "Saturatioun",
            "Light": "Hell",
            "Dark": "Donkel",
            "High": "Héich",
            "Low": "Niddreg",
            "Play": "Ofspillen",
            "Pause": "Paus",
            "Stop": "Stopp",
            "Loading voice...": "Stëmm gëtt gelueden...",
            "Reading...": "Gëtt virgelies...",
            "Profiles": "Profiller",
            "Seizure Safe": "Epilepsie-sécher",
            "Vision Impaired": "Siichtbehënnert",
            "ADHD Friendly": "ADHS-frëndlech",
            "Dyslexia Friendly": "Dyslexie-frëndlech",
            "On": "Un",
            "Off": "Aus",
            "Mute Sounds": "Toun ausmaachen",
            "Page Structure": "Säitestruktur",
            "Text Magnifier": "Textlupp",
            "Tooltips": "Tooltips",
            "Navigation": "Navigatioun",
            "Header": "Kappberäich",
            "Main content": "Haaptinhalt",
            "Footer": "Foussberäich",
            "Sidebar": "Säiteleescht",
            "Search": "Sich",
            "Form": "Formulaire",
            "Section": "Sektioun",
            "Headings": "Iwwerschrëften",
            "Landmarks": "Regiounen",
            "Links": "Linken",
            "No items found": "Keng Elementer fonnt",
            "Settings reset": "Astellungen zeréckgesat",
          },
          ml: {
            "Accessibility": "പ്രവേശനക്ഷമത",
            "Accessibility Options": "പ്രവേശനക്ഷമതാ ഓപ്ഷനുകൾ",
            "Accessibility Menu": "പ്രവേശനക്ഷമതാ മെനു",
            "Accessibility Statement": "പ്രവേശനക്ഷമതാ പ്രസ്താവന",
            "Hide widget": "വിജറ്റ് മറയ്ക്കുക",
            "Move widget": "വിജറ്റ് നീക്കുക",
            "This visit": "ഈ സന്ദർശനം",
            "One day": "ഒരു ദിവസം",
            "One week": "ഒരു ആഴ്ച",
            "Always": "എപ്പോഴും",
            "The widget stays hidden until you clear this site's data in your browser.": "നിങ്ങളുടെ ബ്രൗസറിൽ ഈ സൈറ്റിന്റെ ഡാറ്റ മായ്ക്കുന്നതുവരെ വിജറ്റ് മറഞ്ഞിരിക്കും.",
            "To bring it back sooner, clear this site's data in your browser.": "ഇത് നേരത്തെ തിരികെ കൊണ്ടുവരാൻ, നിങ്ങളുടെ ബ്രൗസറിൽ ഈ സൈറ്റിന്റെ ഡാറ്റ മായ്ക്കുക.",
            "Hide": "മറയ്ക്കുക",
            "Reset settings": "ക്രമീകരണങ്ങൾ പുനഃസജ്ജമാക്കുക",
            "Reset All Settings": "എല്ലാ ക്രമീകരണങ്ങളും പുനഃസജ്ജമാക്കുക",
            "Close": "അടയ്ക്കുക",
            "Content Adjustments": "ഉള്ളടക്ക ക്രമീകരണങ്ങൾ",
            "Adjust Font Size": "ഫോണ്ട് വലുപ്പം ക്രമീകരിക്കുക",
            "Highlight Links": "ലിങ്കുകൾ ഹൈലൈറ്റ് ചെയ്യുക",
            "Readable Font": "വായനായോഗ്യ ഫോണ്ട്",
            "Color Adjustments": "നിറ ക്രമീകരണങ്ങൾ",
            "Invert Colors": "നിറങ്ങൾ വിപരീതമാക്കുക",
            "Light Contrast": "ഇളം കോൺട്രാസ്റ്റ്",
            "Dark Contrast": "ഇരുണ്ട കോൺട്രാസ്റ്റ്",
            "High Contrast": "ഉയർന്ന കോൺട്രാസ്റ്റ്",
            "Smart Contrast": "സ്മാർട്ട് കോൺട്രാസ്റ്റ്",
            "High Saturation": "ഉയർന്ന സാച്ചുറേഷൻ",
            "Low Saturation": "കുറഞ്ഞ സാച്ചുറേഷൻ",
            "Monochrome": "മോണോക്രോം",
            "Tools": "ഉപകരണങ്ങൾ",
            "Reading Guide": "വായനാ വഴികാട്ടി",
            "Stop Animations": "ആനിമേഷനുകൾ നിർത്തുക",
            "Big Cursor": "വലിയ കർസർ",
            "Increase Font Size": "ഫോണ്ട് വലുപ്പം കൂട്ടുക",
            "Decrease Font Size": "ഫോണ്ട് വലുപ്പം കുറയ്ക്കുക",
            "Letter Spacing": "അക്ഷര അകലം",
            "Line Height": "വരി അകലം",
            "Font Weight": "ഫോണ്ട് കനം",
            "Dyslexia Font": "ഡിസ്‌ലെക്സിയ ഫോണ്ട്",
            "Legible Font": "വ്യക്തമായ ഫോണ്ട്",
            "Font Size": "ഫോണ്ട് വലുപ്പം",
            "Language": "ഭാഷ",
            "All Languages": "എല്ലാ ഭാഷകളും",
            "Search language": "ഭാഷ തിരയുക",
            "Open Accessibility Menu": "പ്രവേശനക്ഷമതാ മെനു തുറക്കുക",
            "Open accessibility menu": "പ്രവേശനക്ഷമതാ മെനു തുറക്കുക",
            "Hide Images": "ചിത്രങ്ങൾ മറയ്ക്കുക",
            "Skip to accessibility menu": "പ്രവേശനക്ഷമതാ മെനുവിലേക്ക് നേരിട്ട് പോകുക",
            "Accessibility Report": "പ്രവേശനക്ഷമതാ റിപ്പോർട്ട്",
            "Run Accessibility Check": "പ്രവേശനക്ഷമതാ പരിശോധന നടത്തുക",
            "Loading...": "ലോഡ് ചെയ്യുന്നു...",
            "Analyzing page...": "പേജ് വിശകലനം ചെയ്യുന്നു...",
            "Critical": "അതീവ ഗുരുതരം",
            "Serious": "ഗുരുതരം",
            "Moderate": "ഇടത്തരം",
            "Minor": "നിസ്സാരം",
            "Violations Found": "കണ്ടെത്തിയ ലംഘനങ്ങൾ",
            "No Issues Found": "പ്രശ്നങ്ങളൊന്നും കണ്ടെത്തിയില്ല",
            "Element": "ഘടകം",
            "Issue": "പ്രശ്നം",
            "How to Fix": "എങ്ങനെ പരിഹരിക്കാം",
            "Close Report": "റിപ്പോർട്ട് അടയ്ക്കുക",
            "Passed Tests": "വിജയിച്ച പരിശോധനകൾ",
            "Items Need Review": "അവലോകനം ആവശ്യമുള്ള ഇനങ്ങൾ",
            "Annotations": "അടയാളപ്പെടുത്തലുകൾ",
            "Text to Speech": "എഴുത്ത് സംസാരമാക്കൽ",
            "Text to Speech On": "എഴുത്ത് സംസാരമാക്കൽ ഓൺ",
            "Text to Speech Off": "എഴുത്ത് സംസാരമാക്കൽ ഓഫ്",
            "Simplify Layout": "ലേഔട്ട് ലളിതമാക്കുക",
            "Speech": "സംസാരം",
            "Text": "ടെക്സ്റ്റ്",
            "Color & Contrast": "നിറവും കോൺട്രാസ്റ്റും",
            "Reading Aids": "വായനാ സഹായങ്ങൾ",
            "Interaction": "ഇടപെടൽ",
            "Contrast": "കോൺട്രാസ്റ്റ്",
            "Saturation": "സാച്ചുറേഷൻ",
            "Light": "ഇളം",
            "Dark": "ഇരുണ്ട",
            "High": "ഉയർന്ന",
            "Low": "കുറഞ്ഞ",
            "Play": "പ്ലേ",
            "Pause": "പോസ്",
            "Stop": "സ്റ്റോപ്പ്",
            "Loading voice...": "ശബ്ദം ലോഡ് ചെയ്യുന്നു...",
            "Reading...": "വായിക്കുന്നു...",
            "Profiles": "പ്രൊഫൈലുകൾ",
            "Seizure Safe": "അപസ്മാര സുരക്ഷിതം",
            "Vision Impaired": "കാഴ്ച പരിമിതി",
            "ADHD Friendly": "ADHD സൗഹൃദം",
            "Dyslexia Friendly": "ഡിസ്‌ലെക്സിയ സൗഹൃദം",
            "On": "ഓൺ",
            "Off": "ഓഫ്",
            "Mute Sounds": "ശബ്ദം മ്യൂട്ട് ചെയ്യുക",
            "Page Structure": "പേജ് ഘടന",
            "Text Magnifier": "ടെക്സ്റ്റ് ഭൂതക്കണ്ണാടി",
            "Tooltips": "ടൂൾടിപ്പുകൾ",
            "Navigation": "നാവിഗേഷൻ",
            "Header": "ഹെഡർ",
            "Main content": "പ്രധാന ഉള്ളടക്കം",
            "Footer": "ഫൂട്ടർ",
            "Sidebar": "സൈഡ്ബാർ",
            "Search": "തിരയൽ",
            "Form": "ഫോം",
            "Section": "വിഭാഗം",
            "Headings": "തലക്കെട്ടുകൾ",
            "Landmarks": "ലാൻഡ്മാർക്കുകൾ",
            "Links": "ലിങ്കുകൾ",
            "No items found": "ഇനങ്ങളൊന്നും കണ്ടെത്തിയില്ല",
            "Settings reset": "ക്രമീകരണങ്ങൾ പുനഃസജ്ജമാക്കി",
          },
          mn: {
            "Accessibility": "Хүртээмж",
            "Accessibility Options": "Хүртээмжийн сонголтууд",
            "Accessibility Menu": "Хүртээмжийн цэс",
            "Accessibility Statement": "Хүртээмжийн мэдэгдэл",
            "Hide widget": "Виджетийг нуух",
            "Move widget": "Виджетийг зөөх",
            "This visit": "Энэ зочлолт",
            "One day": "Нэг өдөр",
            "One week": "Нэг долоо хоног",
            "Always": "Үргэлж",
            "The widget stays hidden until you clear this site's data in your browser.": "Та хөтөч дээрээ энэ сайтын өгөгдлийг цэвэрлэх хүртэл виджет нуугдсан хэвээр байна.",
            "To bring it back sooner, clear this site's data in your browser.": "Үүнийг эрт буцааж гаргахын тулд хөтөч дээрээ энэ сайтын өгөгдлийг цэвэрлэнэ үү.",
            "Hide": "Нуух",
            "Reset settings": "Тохиргоог сэргээх",
            "Reset All Settings": "Бүх тохиргоог сэргээх",
            "Close": "Хаах",
            "Content Adjustments": "Агуулгын тохируулга",
            "Adjust Font Size": "Үсгийн хэмжээг тохируулах",
            "Highlight Links": "Холбоосыг тодруулах",
            "Readable Font": "Уншигдахуйц фонт",
            "Color Adjustments": "Өнгөний тохируулга",
            "Invert Colors": "Өнгийг урвуулах",
            "Light Contrast": "Цайвар контраст",
            "Dark Contrast": "Бараан контраст",
            "High Contrast": "Өндөр контраст",
            "Smart Contrast": "Ухаалаг контраст",
            "High Saturation": "Өндөр ханалт",
            "Low Saturation": "Бага ханалт",
            "Monochrome": "Хар цагаан",
            "Tools": "Хэрэгслүүд",
            "Reading Guide": "Унших шугам",
            "Stop Animations": "Анимацийг зогсоох",
            "Big Cursor": "Том курсор",
            "Increase Font Size": "Үсгийн хэмжээг томсгох",
            "Decrease Font Size": "Үсгийн хэмжээг багасгах",
            "Letter Spacing": "Үсэг хоорондын зай",
            "Line Height": "Мөр хоорондын зай",
            "Font Weight": "Үсгийн зузаан",
            "Dyslexia Font": "Дислекси фонт",
            "Legible Font": "Гаргацтай фонт",
            "Font Size": "Үсгийн хэмжээ",
            "Language": "Хэл",
            "All Languages": "Бүх хэл",
            "Search language": "Хэл хайх",
            "Open Accessibility Menu": "Хүртээмжийн цэсийг нээх",
            "Open accessibility menu": "Хүртээмжийн цэсийг нээх",
            "Hide Images": "Зургийг нуух",
            "Skip to accessibility menu": "Хүртээмжийн цэс рүү шилжих",
            "Accessibility Report": "Хүртээмжийн тайлан",
            "Run Accessibility Check": "Хүртээмжийн шалгалт хийх",
            "Loading...": "Ачаалж байна...",
            "Analyzing page...": "Хуудсыг шинжилж байна...",
            "Critical": "Онц ноцтой",
            "Serious": "Ноцтой",
            "Moderate": "Дунд зэрэг",
            "Minor": "Бага зэрэг",
            "Violations Found": "Илэрсэн зөрчлүүд",
            "No Issues Found": "Асуудал илрээгүй",
            "Element": "Элемент",
            "Issue": "Асуудал",
            "How to Fix": "Хэрхэн засах",
            "Close Report": "Тайланг хаах",
            "Passed Tests": "Тэнцсэн шалгалтууд",
            "Items Need Review": "Хянах шаардлагатай зүйлс",
            "Annotations": "Тэмдэглэгээ",
            "Text to Speech": "Дуут унших",
            "Text to Speech On": "Дуут унших асаалттай",
            "Text to Speech Off": "Дуут унших унтраалттай",
            "Simplify Layout": "Хуудсыг хялбарчлах",
            "Speech": "Яриа",
            "Text": "Текст",
            "Color & Contrast": "Өнгө ба контраст",
            "Reading Aids": "Унших тусламж",
            "Interaction": "Харилцан үйлдэл",
            "Contrast": "Контраст",
            "Saturation": "Ханалт",
            "Light": "Цайвар",
            "Dark": "Бараан",
            "High": "Өндөр",
            "Low": "Бага",
            "Play": "Тоглуулах",
            "Pause": "Түр зогсоох",
            "Stop": "Зогсоох",
            "Loading voice...": "Дуу хоолойг ачаалж байна...",
            "Reading...": "Уншиж байна...",
            "Profiles": "Профайлууд",
            "Seizure Safe": "Таталтаас сэргийлсэн",
            "Vision Impaired": "Харааны бэрхшээлтэй",
            "ADHD Friendly": "Анхаарлын дутагдалд ээлтэй",
            "Dyslexia Friendly": "Дислексид ээлтэй",
            "On": "Асаалттай",
            "Off": "Унтраалттай",
            "Mute Sounds": "Дууг хаах",
            "Page Structure": "Хуудасны бүтэц",
            "Text Magnifier": "Текст томруулагч",
            "Tooltips": "Зөвлөмж",
            "Navigation": "Навигац",
            "Header": "Толгой хэсэг",
            "Main content": "Үндсэн агуулга",
            "Footer": "Хөл хэсэг",
            "Sidebar": "Хажуугийн самбар",
            "Search": "Хайлт",
            "Form": "Маягт",
            "Section": "Хэсэг",
            "Headings": "Гарчгууд",
            "Landmarks": "Бүсүүд",
            "Links": "Холбоосууд",
            "No items found": "Илэрц олдсонгүй",
            "Settings reset": "Тохиргоог сэргээлээ",
          },
          ms: {
            "Accessibility": "Kebolehcapaian",
            "Accessibility Options": "Pilihan Kebolehcapaian",
            "Accessibility Menu": "Menu Kebolehcapaian",
            "Accessibility Statement": "Penyata Kebolehcapaian",
            "Hide widget": "Sembunyikan widget",
            "Move widget": "Alihkan widget",
            "This visit": "Lawatan ini",
            "One day": "Satu hari",
            "One week": "Satu minggu",
            "Always": "Sentiasa",
            "The widget stays hidden until you clear this site's data in your browser.": "Widget kekal tersembunyi sehingga anda mengosongkan data laman ini dalam pelayar anda.",
            "To bring it back sooner, clear this site's data in your browser.": "Untuk memaparkannya semula lebih awal, kosongkan data laman ini dalam pelayar anda.",
            "Hide": "Sembunyikan",
            "Reset settings": "Tetapkan semula tetapan",
            "Reset All Settings": "Tetapkan Semula Semua Tetapan",
            "Close": "Tutup",
            "Content Adjustments": "Pelarasan Kandungan",
            "Adjust Font Size": "Laraskan Saiz Fon",
            "Highlight Links": "Serlahkan Pautan",
            "Readable Font": "Fon Mudah Dibaca",
            "Color Adjustments": "Pelarasan Warna",
            "Invert Colors": "Songsangkan Warna",
            "Light Contrast": "Kontras Terang",
            "Dark Contrast": "Kontras Gelap",
            "High Contrast": "Kontras Tinggi",
            "Smart Contrast": "Kontras Pintar",
            "High Saturation": "Ketepuan Tinggi",
            "Low Saturation": "Ketepuan Rendah",
            "Monochrome": "Monokrom",
            "Tools": "Alatan",
            "Reading Guide": "Panduan Bacaan",
            "Stop Animations": "Hentikan Animasi",
            "Big Cursor": "Kursor Besar",
            "Increase Font Size": "Besarkan Saiz Fon",
            "Decrease Font Size": "Kecilkan Saiz Fon",
            "Letter Spacing": "Jarak Huruf",
            "Line Height": "Jarak Baris",
            "Font Weight": "Ketebalan Fon",
            "Dyslexia Font": "Fon Disleksia",
            "Legible Font": "Fon Jelas",
            "Font Size": "Saiz Fon",
            "Language": "Bahasa",
            "All Languages": "Semua Bahasa",
            "Search language": "Cari bahasa",
            "Open Accessibility Menu": "Buka Menu Kebolehcapaian",
            "Open accessibility menu": "Buka menu kebolehcapaian",
            "Hide Images": "Sembunyikan Imej",
            "Skip to accessibility menu": "Langkau ke menu kebolehcapaian",
            "Accessibility Report": "Laporan Kebolehcapaian",
            "Run Accessibility Check": "Jalankan Semakan Kebolehcapaian",
            "Loading...": "Memuatkan...",
            "Analyzing page...": "Menganalisis halaman...",
            "Critical": "Kritikal",
            "Serious": "Serius",
            "Moderate": "Sederhana",
            "Minor": "Kecil",
            "Violations Found": "Pelanggaran Ditemui",
            "No Issues Found": "Tiada Isu Ditemui",
            "Element": "Elemen",
            "Issue": "Isu",
            "How to Fix": "Cara Membaiki",
            "Close Report": "Tutup Laporan",
            "Passed Tests": "Ujian Lulus",
            "Items Need Review": "Item Perlu Semakan",
            "Annotations": "Anotasi",
            "Text to Speech": "Teks ke Pertuturan",
            "Text to Speech On": "Teks ke Pertuturan Dihidupkan",
            "Text to Speech Off": "Teks ke Pertuturan Dimatikan",
            "Simplify Layout": "Ringkaskan Susun Atur",
            "Speech": "Pertuturan",
            "Text": "Teks",
            "Color & Contrast": "Warna & Kontras",
            "Reading Aids": "Bantuan Bacaan",
            "Interaction": "Interaksi",
            "Contrast": "Kontras",
            "Saturation": "Ketepuan",
            "Light": "Terang",
            "Dark": "Gelap",
            "High": "Tinggi",
            "Low": "Rendah",
            "Play": "Main",
            "Pause": "Jeda",
            "Stop": "Berhenti",
            "Loading voice...": "Memuatkan suara...",
            "Reading...": "Membaca...",
            "Profiles": "Profil",
            "Seizure Safe": "Selamat Sawan",
            "Vision Impaired": "Masalah Penglihatan",
            "ADHD Friendly": "Mesra ADHD",
            "Dyslexia Friendly": "Mesra Disleksia",
            "On": "Hidup",
            "Off": "Mati",
            "Mute Sounds": "Redam Bunyi",
            "Page Structure": "Struktur Halaman",
            "Text Magnifier": "Pembesar Teks",
            "Tooltips": "Petua alat",
            "Navigation": "Navigasi",
            "Header": "Pengepala",
            "Main content": "Kandungan utama",
            "Footer": "Pengaki",
            "Sidebar": "Bar sisi",
            "Search": "Carian",
            "Form": "Borang",
            "Section": "Bahagian",
            "Headings": "Tajuk",
            "Landmarks": "Mercu Tanda",
            "Links": "Pautan",
            "No items found": "Tiada item ditemui",
            "Settings reset": "Tetapan ditetapkan semula",
          },
          my: {
            "Accessibility": "အများသုံးစွဲနိုင်မှု",
            "Accessibility Options": "အများသုံးစွဲနိုင်မှု ရွေးချယ်စရာများ",
            "Accessibility Menu": "အများသုံးစွဲနိုင်မှု မီနူး",
            "Accessibility Statement": "အများသုံးစွဲနိုင်မှု ထုတ်ပြန်ချက်",
            "Hide widget": "ဝစ်ဂျက်ကို ဖျောက်ရန်",
            "Move widget": "ဝစ်ဂျက်ကို ရွှေ့ရန်",
            "This visit": "ဤလည်ပတ်မှု",
            "One day": "တစ်ရက်",
            "One week": "တစ်ပတ်",
            "Always": "အမြဲတမ်း",
            "The widget stays hidden until you clear this site's data in your browser.": "သင့်ဘရောက်ဇာတွင် ဤဆိုက်၏ဒေတာကို မရှင်းလင်းမချင်း ဝစ်ဂျက်ကို ဖျောက်ထားပါမည်။",
            "To bring it back sooner, clear this site's data in your browser.": "၎င်းကို စောစောပြန်ပေါ်စေရန် သင့်ဘရောက်ဇာတွင် ဤဆိုက်၏ဒေတာကို ရှင်းလင်းပါ။",
            "Hide": "ဖျောက်ရန်",
            "Reset settings": "ဆက်တင်များ ပြန်လည်သတ်မှတ်ရန်",
            "Reset All Settings": "ဆက်တင်အားလုံး ပြန်လည်သတ်မှတ်ရန်",
            "Close": "ပိတ်ရန်",
            "Content Adjustments": "အကြောင်းအရာ ချိန်ညှိမှုများ",
            "Adjust Font Size": "ဖောင့်အရွယ်အစား ချိန်ညှိရန်",
            "Highlight Links": "လင့်ခ်များ မီးမောင်းထိုးရန်",
            "Readable Font": "ဖတ်ရလွယ်သော ဖောင့်",
            "Color Adjustments": "အရောင် ချိန်ညှိမှုများ",
            "Invert Colors": "အရောင် ပြောင်းပြန်လုပ်ရန်",
            "Light Contrast": "ကွန်ထရက်စ်အလင်း",
            "Dark Contrast": "ကွန်ထရက်စ်အမှောင်",
            "High Contrast": "ကွန်ထရက်စ်မြင့်",
            "Smart Contrast": "စမတ်ကွန်ထရက်စ်",
            "High Saturation": "ရောင်စိုမှုမြင့်",
            "Low Saturation": "ရောင်စိုမှုနိမ့်",
            "Monochrome": "တစ်ရောင်တည်း",
            "Tools": "ကိရိယာများ",
            "Reading Guide": "စာဖတ်လမ်းညွှန်",
            "Stop Animations": "လှုပ်ရှားသက်ဝင်ပုံများ ရပ်ရန်",
            "Big Cursor": "ကာဆာကြီး",
            "Increase Font Size": "ဖောင့်အရွယ်အစား တိုးရန်",
            "Decrease Font Size": "ဖောင့်အရွယ်အစား လျှော့ရန်",
            "Letter Spacing": "စာလုံးကြား အကွာအဝေး",
            "Line Height": "စာကြောင်းအမြင့်",
            "Font Weight": "စာလုံးအထူ",
            "Dyslexia Font": "ဒစ်စလက်ဆီးယား ဖောင့်",
            "Legible Font": "ရှင်းလင်းပြတ်သားသော ဖောင့်",
            "Font Size": "ဖောင့်အရွယ်အစား",
            "Language": "ဘာသာစကား",
            "All Languages": "ဘာသာစကားအားလုံး",
            "Search language": "ဘာသာစကား ရှာဖွေရန်",
            "Open Accessibility Menu": "အများသုံးစွဲနိုင်မှု မီနူး ဖွင့်ရန်",
            "Open accessibility menu": "အများသုံးစွဲနိုင်မှု မီနူး ဖွင့်ရန်",
            "Hide Images": "ပုံများ ဖျောက်ရန်",
            "Skip to accessibility menu": "အများသုံးစွဲနိုင်မှု မီနူးသို့ ကျော်သွားရန်",
            "Accessibility Report": "အများသုံးစွဲနိုင်မှု အစီရင်ခံစာ",
            "Run Accessibility Check": "အများသုံးစွဲနိုင်မှု စစ်ဆေးရန်",
            "Loading...": "ရယူနေသည်...",
            "Analyzing page...": "စာမျက်နှာကို ခွဲခြမ်းစိတ်ဖြာနေသည်...",
            "Critical": "အလွန်ပြင်းထန်",
            "Serious": "ပြင်းထန်",
            "Moderate": "အလယ်အလတ်",
            "Minor": "သေးငယ်",
            "Violations Found": "တွေ့ရှိသည့် ချိုးဖောက်မှုများ",
            "No Issues Found": "ပြဿနာ မတွေ့ပါ",
            "Element": "အစိတ်အပိုင်း",
            "Issue": "ပြဿနာ",
            "How to Fix": "ပြင်ဆင်နည်း",
            "Close Report": "အစီရင်ခံစာ ပိတ်ရန်",
            "Passed Tests": "အောင်မြင်သည့် စစ်ဆေးမှုများ",
            "Items Need Review": "ပြန်လည်သုံးသပ်ရန် လိုအပ်သည့် အချက်များ",
            "Annotations": "မှတ်ချက်များ",
            "Text to Speech": "စာသားမှ အသံထွက်",
            "Text to Speech On": "စာသားမှ အသံထွက် ဖွင့်ထားသည်",
            "Text to Speech Off": "စာသားမှ အသံထွက် ပိတ်ထားသည်",
            "Simplify Layout": "အပြင်အဆင် ရိုးရှင်းစေရန်",
            "Speech": "အသံထွက်",
            "Text": "စာသား",
            "Color & Contrast": "အရောင်နှင့် ကွန်ထရက်စ်",
            "Reading Aids": "စာဖတ်ခြင်း အထောက်အကူများ",
            "Interaction": "အပြန်အလှန်လုပ်ဆောင်မှု",
            "Contrast": "ကွန်ထရက်စ်",
            "Saturation": "ရောင်စိုမှု",
            "Light": "အလင်း",
            "Dark": "အမှောင်",
            "High": "မြင့်",
            "Low": "နိမ့်",
            "Play": "ဖွင့်ရန်",
            "Pause": "ခဏရပ်ရန်",
            "Stop": "ရပ်ရန်",
            "Loading voice...": "အသံ ရယူနေသည်...",
            "Reading...": "ဖတ်နေသည်...",
            "Profiles": "ပရိုဖိုင်များ",
            "Seizure Safe": "အတက်ရောဂါ ဘေးကင်း",
            "Vision Impaired": "အမြင်အာရုံ ချို့ယွင်းသူ",
            "ADHD Friendly": "ADHD အတွက် သင့်လျော်",
            "Dyslexia Friendly": "ဒစ်စလက်ဆီးယားအတွက် သင့်လျော်",
            "On": "ဖွင့်",
            "Off": "ပိတ်",
            "Mute Sounds": "အသံ ပိတ်ရန်",
            "Page Structure": "စာမျက်နှာ ဖွဲ့စည်းပုံ",
            "Text Magnifier": "စာသား မှန်ဘီလူး",
            "Tooltips": "အကြံပြုချက်များ",
            "Navigation": "လမ်းညွှန်",
            "Header": "ခေါင်းစီး",
            "Main content": "အဓိကအကြောင်းအရာ",
            "Footer": "အောက်ခြေ",
            "Sidebar": "ဘေးဘား",
            "Search": "ရှာဖွေရန်",
            "Form": "ဖောင်",
            "Section": "အပိုင်း",
            "Headings": "ခေါင်းစဉ်များ",
            "Landmarks": "မှတ်တိုင်များ",
            "Links": "လင့်ခ်များ",
            "No items found": "မည်သည့်အရာမှ မတွေ့ပါ",
            "Settings reset": "ဆက်တင်များ ပြန်လည်သတ်မှတ်ပြီးပါပြီ",
          },
          no: {
            "Accessibility": "Tilgjengelighet",
            "Accessibility Options": "Tilgjengelighetsvalg",
            "Accessibility Menu": "Tilgjengelighetsmeny",
            "Accessibility Statement": "Tilgjengelighetserklæring",
            "Hide widget": "Skjul widget",
            "Move widget": "Flytt widget",
            "This visit": "Dette besøket",
            "One day": "Én dag",
            "One week": "Én uke",
            "Always": "Alltid",
            "The widget stays hidden until you clear this site's data in your browser.": "Widgeten forblir skjult til du sletter dette nettstedets data i nettleseren din.",
            "To bring it back sooner, clear this site's data in your browser.": "For å få den tilbake tidligere, slett dette nettstedets data i nettleseren din.",
            "Hide": "Skjul",
            "Reset settings": "Tilbakestill innstillinger",
            "Reset All Settings": "Tilbakestill alle innstillinger",
            "Close": "Lukk",
            "Content Adjustments": "Innholdsjusteringer",
            "Adjust Font Size": "Juster skriftstørrelse",
            "Highlight Links": "Uthev lenker",
            "Readable Font": "Lesbar skrift",
            "Color Adjustments": "Fargejusteringer",
            "Invert Colors": "Inverter farger",
            "Light Contrast": "Lys kontrast",
            "Dark Contrast": "Mørk kontrast",
            "High Contrast": "Høy kontrast",
            "Smart Contrast": "Smart kontrast",
            "High Saturation": "Høy metning",
            "Low Saturation": "Lav metning",
            "Monochrome": "Monokrom",
            "Tools": "Verktøy",
            "Reading Guide": "Leselinjal",
            "Stop Animations": "Stopp animasjoner",
            "Big Cursor": "Stor peker",
            "Increase Font Size": "Øk skriftstørrelse",
            "Decrease Font Size": "Reduser skriftstørrelse",
            "Letter Spacing": "Bokstavavstand",
            "Line Height": "Linjeavstand",
            "Font Weight": "Skrifttykkelse",
            "Dyslexia Font": "Dysleksiskrift",
            "Legible Font": "Tydelig skrift",
            "Font Size": "Skriftstørrelse",
            "Language": "Språk",
            "All Languages": "Alle språk",
            "Search language": "Søk etter språk",
            "Open Accessibility Menu": "Åpne tilgjengelighetsmenyen",
            "Open accessibility menu": "Åpne tilgjengelighetsmenyen",
            "Hide Images": "Skjul bilder",
            "Skip to accessibility menu": "Hopp til tilgjengelighetsmenyen",
            "Accessibility Report": "Tilgjengelighetsrapport",
            "Run Accessibility Check": "Kjør tilgjengelighetssjekk",
            "Loading...": "Laster inn...",
            "Analyzing page...": "Analyserer siden...",
            "Critical": "Kritisk",
            "Serious": "Alvorlig",
            "Moderate": "Moderat",
            "Minor": "Mindre",
            "Violations Found": "Brudd funnet",
            "No Issues Found": "Ingen problemer funnet",
            "Element": "Element",
            "Issue": "Problem",
            "How to Fix": "Slik retter du det",
            "Close Report": "Lukk rapport",
            "Passed Tests": "Beståtte tester",
            "Items Need Review": "Elementer som må gjennomgås",
            "Annotations": "Merknader",
            "Text to Speech": "Opplesing",
            "Text to Speech On": "Opplesing på",
            "Text to Speech Off": "Opplesing av",
            "Simplify Layout": "Forenkle oppsett",
            "Speech": "Tale",
            "Text": "Tekst",
            "Color & Contrast": "Farge og kontrast",
            "Reading Aids": "Lesehjelp",
            "Interaction": "Interaksjon",
            "Contrast": "Kontrast",
            "Saturation": "Metning",
            "Light": "Lys",
            "Dark": "Mørk",
            "High": "Høy",
            "Low": "Lav",
            "Play": "Spill av",
            "Pause": "Pause",
            "Stop": "Stopp",
            "Loading voice...": "Laster inn stemme...",
            "Reading...": "Leser...",
            "Profiles": "Profiler",
            "Seizure Safe": "Epilepsisikker",
            "Vision Impaired": "Synshemmet",
            "ADHD Friendly": "ADHD-vennlig",
            "Dyslexia Friendly": "Dysleksivennlig",
            "On": "På",
            "Off": "Av",
            "Mute Sounds": "Demp lyder",
            "Page Structure": "Sidestruktur",
            "Text Magnifier": "Tekstforstørrer",
            "Tooltips": "Verktøytips",
            "Navigation": "Navigasjon",
            "Header": "Topptekst",
            "Main content": "Hovedinnhold",
            "Footer": "Bunntekst",
            "Sidebar": "Sidefelt",
            "Search": "Søk",
            "Form": "Skjema",
            "Section": "Seksjon",
            "Headings": "Overskrifter",
            "Landmarks": "Landemerker",
            "Links": "Lenker",
            "No items found": "Ingen elementer funnet",
            "Settings reset": "Innstillinger tilbakestilt",
          },
          pa: {
            "Accessibility": "ਪਹੁੰਚਯੋਗਤਾ",
            "Accessibility Options": "ਪਹੁੰਚਯੋਗਤਾ ਵਿਕਲਪ",
            "Accessibility Menu": "ਪਹੁੰਚਯੋਗਤਾ ਮੀਨੂ",
            "Accessibility Statement": "ਪਹੁੰਚਯੋਗਤਾ ਬਿਆਨ",
            "Hide widget": "ਵਿਜੇਟ ਲੁਕਾਓ",
            "Move widget": "ਵਿਜੇਟ ਹਿਲਾਓ",
            "This visit": "ਇਹ ਫੇਰੀ",
            "One day": "ਇੱਕ ਦਿਨ",
            "One week": "ਇੱਕ ਹਫ਼ਤਾ",
            "Always": "ਹਮੇਸ਼ਾ",
            "The widget stays hidden until you clear this site's data in your browser.": "ਜਦੋਂ ਤੱਕ ਤੁਸੀਂ ਆਪਣੇ ਬ੍ਰਾਊਜ਼ਰ ਵਿੱਚ ਇਸ ਸਾਈਟ ਦਾ ਡਾਟਾ ਸਾਫ਼ ਨਹੀਂ ਕਰਦੇ, ਵਿਜੇਟ ਲੁਕਿਆ ਰਹੇਗਾ।",
            "To bring it back sooner, clear this site's data in your browser.": "ਇਸਨੂੰ ਪਹਿਲਾਂ ਵਾਪਸ ਲਿਆਉਣ ਲਈ, ਆਪਣੇ ਬ੍ਰਾਊਜ਼ਰ ਵਿੱਚ ਇਸ ਸਾਈਟ ਦਾ ਡਾਟਾ ਸਾਫ਼ ਕਰੋ।",
            "Hide": "ਲੁਕਾਓ",
            "Reset settings": "ਸੈਟਿੰਗਾਂ ਰੀਸੈੱਟ ਕਰੋ",
            "Reset All Settings": "ਸਾਰੀਆਂ ਸੈਟਿੰਗਾਂ ਰੀਸੈੱਟ ਕਰੋ",
            "Close": "ਬੰਦ ਕਰੋ",
            "Content Adjustments": "ਸਮੱਗਰੀ ਵਿਵਸਥਾਵਾਂ",
            "Adjust Font Size": "ਫੌਂਟ ਦਾ ਆਕਾਰ ਵਿਵਸਥਿਤ ਕਰੋ",
            "Highlight Links": "ਲਿੰਕ ਹਾਈਲਾਈਟ ਕਰੋ",
            "Readable Font": "ਪੜ੍ਹਨਯੋਗ ਫੌਂਟ",
            "Color Adjustments": "ਰੰਗ ਵਿਵਸਥਾਵਾਂ",
            "Invert Colors": "ਰੰਗ ਉਲਟਾਓ",
            "Light Contrast": "ਹਲਕਾ ਕੰਟਰਾਸਟ",
            "Dark Contrast": "ਗੂੜ੍ਹਾ ਕੰਟਰਾਸਟ",
            "High Contrast": "ਉੱਚ ਕੰਟਰਾਸਟ",
            "Smart Contrast": "ਸਮਾਰਟ ਕੰਟਰਾਸਟ",
            "High Saturation": "ਉੱਚ ਸੈਚੁਰੇਸ਼ਨ",
            "Low Saturation": "ਘੱਟ ਸੈਚੁਰੇਸ਼ਨ",
            "Monochrome": "ਮੋਨੋਕ੍ਰੋਮ",
            "Tools": "ਟੂਲ",
            "Reading Guide": "ਪੜ੍ਹਨ ਗਾਈਡ",
            "Stop Animations": "ਐਨੀਮੇਸ਼ਨ ਰੋਕੋ",
            "Big Cursor": "ਵੱਡਾ ਕਰਸਰ",
            "Increase Font Size": "ਫੌਂਟ ਦਾ ਆਕਾਰ ਵਧਾਓ",
            "Decrease Font Size": "ਫੌਂਟ ਦਾ ਆਕਾਰ ਘਟਾਓ",
            "Letter Spacing": "ਅੱਖਰਾਂ ਦੀ ਵਿੱਥ",
            "Line Height": "ਲਾਈਨ ਦੀ ਉਚਾਈ",
            "Font Weight": "ਫੌਂਟ ਦੀ ਮੋਟਾਈ",
            "Dyslexia Font": "ਡਿਸਲੈਕਸੀਆ ਫੌਂਟ",
            "Legible Font": "ਸਪੱਸ਼ਟ ਫੌਂਟ",
            "Font Size": "ਫੌਂਟ ਦਾ ਆਕਾਰ",
            "Language": "ਭਾਸ਼ਾ",
            "All Languages": "ਸਾਰੀਆਂ ਭਾਸ਼ਾਵਾਂ",
            "Search language": "ਭਾਸ਼ਾ ਖੋਜੋ",
            "Open Accessibility Menu": "ਪਹੁੰਚਯੋਗਤਾ ਮੀਨੂ ਖੋਲ੍ਹੋ",
            "Open accessibility menu": "ਪਹੁੰਚਯੋਗਤਾ ਮੀਨੂ ਖੋਲ੍ਹੋ",
            "Hide Images": "ਤਸਵੀਰਾਂ ਲੁਕਾਓ",
            "Skip to accessibility menu": "ਪਹੁੰਚਯੋਗਤਾ ਮੀਨੂ 'ਤੇ ਜਾਓ",
            "Accessibility Report": "ਪਹੁੰਚਯੋਗਤਾ ਰਿਪੋਰਟ",
            "Run Accessibility Check": "ਪਹੁੰਚਯੋਗਤਾ ਜਾਂਚ ਚਲਾਓ",
            "Loading...": "ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...",
            "Analyzing page...": "ਪੰਨੇ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਹੋ ਰਿਹਾ ਹੈ...",
            "Critical": "ਅਤਿ ਗੰਭੀਰ",
            "Serious": "ਗੰਭੀਰ",
            "Moderate": "ਦਰਮਿਆਨਾ",
            "Minor": "ਮਾਮੂਲੀ",
            "Violations Found": "ਉਲੰਘਣਾਵਾਂ ਮਿਲੀਆਂ",
            "No Issues Found": "ਕੋਈ ਸਮੱਸਿਆ ਨਹੀਂ ਮਿਲੀ",
            "Element": "ਐਲੀਮੈਂਟ",
            "Issue": "ਸਮੱਸਿਆ",
            "How to Fix": "ਠੀਕ ਕਰਨ ਦਾ ਤਰੀਕਾ",
            "Close Report": "ਰਿਪੋਰਟ ਬੰਦ ਕਰੋ",
            "Passed Tests": "ਪਾਸ ਹੋਏ ਟੈਸਟ",
            "Items Need Review": "ਸਮੀਖਿਆ ਦੀ ਲੋੜ ਵਾਲੀਆਂ ਆਈਟਮਾਂ",
            "Annotations": "ਐਨੋਟੇਸ਼ਨ",
            "Text to Speech": "ਲਿਖਤ ਤੋਂ ਬੋਲੀ",
            "Text to Speech On": "ਲਿਖਤ ਤੋਂ ਬੋਲੀ ਚਾਲੂ",
            "Text to Speech Off": "ਲਿਖਤ ਤੋਂ ਬੋਲੀ ਬੰਦ",
            "Simplify Layout": "ਲੇਆਉਟ ਸਰਲ ਕਰੋ",
            "Speech": "ਬੋਲੀ",
            "Text": "ਲਿਖਤ",
            "Color & Contrast": "ਰੰਗ ਅਤੇ ਕੰਟਰਾਸਟ",
            "Reading Aids": "ਪੜ੍ਹਨ ਸਹਾਇਤਾ",
            "Interaction": "ਇੰਟਰੈਕਸ਼ਨ",
            "Contrast": "ਕੰਟਰਾਸਟ",
            "Saturation": "ਸੈਚੁਰੇਸ਼ਨ",
            "Light": "ਹਲਕਾ",
            "Dark": "ਗੂੜ੍ਹਾ",
            "High": "ਉੱਚ",
            "Low": "ਘੱਟ",
            "Play": "ਚਲਾਓ",
            "Pause": "ਵਿਰਾਮ",
            "Stop": "ਰੋਕੋ",
            "Loading voice...": "ਅਵਾਜ਼ ਲੋਡ ਹੋ ਰਹੀ ਹੈ...",
            "Reading...": "ਪੜ੍ਹਿਆ ਜਾ ਰਿਹਾ ਹੈ...",
            "Profiles": "ਪ੍ਰੋਫਾਈਲ",
            "Seizure Safe": "ਦੌਰੇ ਤੋਂ ਸੁਰੱਖਿਅਤ",
            "Vision Impaired": "ਕਮਜ਼ੋਰ ਨਜ਼ਰ",
            "ADHD Friendly": "ADHD ਅਨੁਕੂਲ",
            "Dyslexia Friendly": "ਡਿਸਲੈਕਸੀਆ ਅਨੁਕੂਲ",
            "On": "ਚਾਲੂ",
            "Off": "ਬੰਦ",
            "Mute Sounds": "ਅਵਾਜ਼ਾਂ ਮਿਊਟ ਕਰੋ",
            "Page Structure": "ਪੰਨੇ ਦੀ ਬਣਤਰ",
            "Text Magnifier": "ਲਿਖਤ ਵੱਡਦਰਸ਼ੀ",
            "Tooltips": "ਟੂਲਟਿਪ",
            "Navigation": "ਨੈਵੀਗੇਸ਼ਨ",
            "Header": "ਹੈਡਰ",
            "Main content": "ਮੁੱਖ ਸਮੱਗਰੀ",
            "Footer": "ਫੁੱਟਰ",
            "Sidebar": "ਸਾਈਡਬਾਰ",
            "Search": "ਖੋਜ",
            "Form": "ਫਾਰਮ",
            "Section": "ਭਾਗ",
            "Headings": "ਸਿਰਲੇਖ",
            "Landmarks": "ਲੈਂਡਮਾਰਕ",
            "Links": "ਲਿੰਕ",
            "No items found": "ਕੋਈ ਆਈਟਮ ਨਹੀਂ ਮਿਲੀ",
            "Settings reset": "ਸੈਟਿੰਗਾਂ ਰੀਸੈੱਟ ਹੋ ਗਈਆਂ",
          },
          si: {
            "Accessibility": "ප්‍රවේශ්‍යතාව",
            "Accessibility Options": "ප්‍රවේශ්‍යතා විකල්ප",
            "Accessibility Menu": "ප්‍රවේශ්‍යතා මෙනුව",
            "Accessibility Statement": "ප්‍රවේශ්‍යතා ප්‍රකාශය",
            "Hide widget": "විජට් එක සඟවන්න",
            "Move widget": "විජට් එක ගෙනයන්න",
            "This visit": "මෙම පිවිසුම",
            "One day": "එක් දිනක්",
            "One week": "එක් සතියක්",
            "Always": "සැමවිටම",
            "The widget stays hidden until you clear this site's data in your browser.": "ඔබගේ බ්‍රවුසරයේ මෙම අඩවියේ දත්ත හිස් කරන තුරු විජට් එක සැඟවී පවතී.",
            "To bring it back sooner, clear this site's data in your browser.": "එය කලින් නැවත ගෙන ඒමට, ඔබගේ බ්‍රවුසරයේ මෙම අඩවියේ දත්ත හිස් කරන්න.",
            "Hide": "සඟවන්න",
            "Reset settings": "සැකසුම් යළි සකසන්න",
            "Reset All Settings": "සියලු සැකසුම් යළි සකසන්න",
            "Close": "වසන්න",
            "Content Adjustments": "අන්තර්ගත ගැලපීම්",
            "Adjust Font Size": "අකුරු ප්‍රමාණය සකසන්න",
            "Highlight Links": "සබැඳි ඉස්මතු කරන්න",
            "Readable Font": "කියවීමට පහසු අකුරු",
            "Color Adjustments": "වර්ණ ගැලපීම්",
            "Invert Colors": "වර්ණ ප්‍රතිලෝම කරන්න",
            "Light Contrast": "ලා ප්‍රභේදනය",
            "Dark Contrast": "අඳුරු ප්‍රභේදනය",
            "High Contrast": "ඉහළ ප්‍රභේදනය",
            "Smart Contrast": "ස්මාර්ට් ප්‍රභේදනය",
            "High Saturation": "ඉහළ සන්තෘප්තිය",
            "Low Saturation": "අඩු සන්තෘප්තිය",
            "Monochrome": "ඒකවර්ණ",
            "Tools": "මෙවලම්",
            "Reading Guide": "කියවීමේ මාර්ගෝපදේශය",
            "Stop Animations": "සජීවීකරණ නවත්වන්න",
            "Big Cursor": "විශාල කර්සරය",
            "Increase Font Size": "අකුරු ප්‍රමාණය වැඩි කරන්න",
            "Decrease Font Size": "අකුරු ප්‍රමාණය අඩු කරන්න",
            "Letter Spacing": "අකුරු පරතරය",
            "Line Height": "පේළි උස",
            "Font Weight": "අකුරු ඝනකම",
            "Dyslexia Font": "ඩිස්ලෙක්සියා අකුරු",
            "Legible Font": "පැහැදිලි අකුරු",
            "Font Size": "අකුරු ප්‍රමාණය",
            "Language": "භාෂාව",
            "All Languages": "සියලු භාෂා",
            "Search language": "භාෂාව සොයන්න",
            "Open Accessibility Menu": "ප්‍රවේශ්‍යතා මෙනුව විවෘත කරන්න",
            "Open accessibility menu": "ප්‍රවේශ්‍යතා මෙනුව විවෘත කරන්න",
            "Hide Images": "රූප සඟවන්න",
            "Skip to accessibility menu": "ප්‍රවේශ්‍යතා මෙනුව වෙත යන්න",
            "Accessibility Report": "ප්‍රවේශ්‍යතා වාර්තාව",
            "Run Accessibility Check": "ප්‍රවේශ්‍යතා පරීක්ෂාව ක්‍රියාත්මක කරන්න",
            "Loading...": "පූරණය වෙමින්...",
            "Analyzing page...": "පිටුව විශ්ලේෂණය කරමින්...",
            "Critical": "ඉතා බරපතළ",
            "Serious": "බරපතළ",
            "Moderate": "මධ්‍යම",
            "Minor": "සුළු",
            "Violations Found": "හමු වූ උල්ලංඝන",
            "No Issues Found": "ගැටලු හමු නොවීය",
            "Element": "මූලාංගය",
            "Issue": "ගැටලුව",
            "How to Fix": "නිවැරදි කරන ආකාරය",
            "Close Report": "වාර්තාව වසන්න",
            "Passed Tests": "සමත් වූ පරීක්ෂණ",
            "Items Need Review": "සමාලෝචනය අවශ්‍ය අයිතම",
            "Annotations": "විවරණ",
            "Text to Speech": "පෙළින් කථනය",
            "Text to Speech On": "පෙළින් කථනය සක්‍රීයයි",
            "Text to Speech Off": "පෙළින් කථනය අක්‍රීයයි",
            "Simplify Layout": "පිරිසැලසුම සරල කරන්න",
            "Speech": "කථනය",
            "Text": "පෙළ",
            "Color & Contrast": "වර්ණ සහ ප්‍රභේදනය",
            "Reading Aids": "කියවීමේ ආධාරක",
            "Interaction": "අන්තර්ක්‍රියා",
            "Contrast": "ප්‍රභේදනය",
            "Saturation": "සන්තෘප්තිය",
            "Light": "ලා",
            "Dark": "අඳුරු",
            "High": "ඉහළ",
            "Low": "අඩු",
            "Play": "වාදනය කරන්න",
            "Pause": "විරාම කරන්න",
            "Stop": "නවත්වන්න",
            "Loading voice...": "හඬ පූරණය වෙමින්...",
            "Reading...": "කියවමින්...",
            "Profiles": "පැතිකඩ",
            "Seizure Safe": "අපස්මාර ආරක්ෂිත",
            "Vision Impaired": "දෘෂ්ටි ආබාධිත",
            "ADHD Friendly": "ADHD හිතකාමී",
            "Dyslexia Friendly": "ඩිස්ලෙක්සියා හිතකාමී",
            "On": "සක්‍රීයයි",
            "Off": "අක්‍රීයයි",
            "Mute Sounds": "ශබ්ද නිහඬ කරන්න",
            "Page Structure": "පිටු ව්‍යුහය",
            "Text Magnifier": "පෙළ විශාලකය",
            "Tooltips": "මෙවලම් ඉඟි",
            "Navigation": "සංචාලනය",
            "Header": "ශීර්ෂකය",
            "Main content": "ප්‍රධාන අන්තර්ගතය",
            "Footer": "පාදකය",
            "Sidebar": "පැති තීරුව",
            "Search": "සෙවීම",
            "Form": "පෝරමය",
            "Section": "කොටස",
            "Headings": "ශීර්ෂ",
            "Landmarks": "සලකුණු",
            "Links": "සබැඳි",
            "No items found": "අයිතම හමු නොවීය",
            "Settings reset": "සැකසුම් යළි සකසන ලදී",
          },
          sk: {
            "Accessibility": "Prístupnosť",
            "Accessibility Options": "Možnosti prístupnosti",
            "Accessibility Menu": "Ponuka prístupnosti",
            "Accessibility Statement": "Vyhlásenie o prístupnosti",
            "Hide widget": "Skryť widget",
            "Move widget": "Presunúť widget",
            "This visit": "Táto návšteva",
            "One day": "Jeden deň",
            "One week": "Jeden týždeň",
            "Always": "Vždy",
            "The widget stays hidden until you clear this site's data in your browser.": "Widget zostane skrytý, kým v prehliadači nevymažete údaje tejto stránky.",
            "To bring it back sooner, clear this site's data in your browser.": "Ak ho chcete vrátiť skôr, vymažte v prehliadači údaje tejto stránky.",
            "Hide": "Skryť",
            "Reset settings": "Obnoviť nastavenia",
            "Reset All Settings": "Obnoviť všetky nastavenia",
            "Close": "Zavrieť",
            "Content Adjustments": "Úpravy obsahu",
            "Adjust Font Size": "Upraviť veľkosť písma",
            "Highlight Links": "Zvýrazniť odkazy",
            "Readable Font": "Čitateľné písmo",
            "Color Adjustments": "Úpravy farieb",
            "Invert Colors": "Invertovať farby",
            "Light Contrast": "Svetlý kontrast",
            "Dark Contrast": "Tmavý kontrast",
            "High Contrast": "Vysoký kontrast",
            "Smart Contrast": "Inteligentný kontrast",
            "High Saturation": "Vysoká sýtosť",
            "Low Saturation": "Nízka sýtosť",
            "Monochrome": "Čiernobiele",
            "Tools": "Nástroje",
            "Reading Guide": "Pravítko na čítanie",
            "Stop Animations": "Zastaviť animácie",
            "Big Cursor": "Veľký kurzor",
            "Increase Font Size": "Zväčšiť veľkosť písma",
            "Decrease Font Size": "Zmenšiť veľkosť písma",
            "Letter Spacing": "Rozostup písmen",
            "Line Height": "Riadkovanie",
            "Font Weight": "Hrúbka písma",
            "Dyslexia Font": "Písmo pre dyslektikov",
            "Legible Font": "Zreteľné písmo",
            "Font Size": "Veľkosť písma",
            "Language": "Jazyk",
            "All Languages": "Všetky jazyky",
            "Search language": "Hľadať jazyk",
            "Open Accessibility Menu": "Otvoriť ponuku prístupnosti",
            "Open accessibility menu": "Otvoriť ponuku prístupnosti",
            "Hide Images": "Skryť obrázky",
            "Skip to accessibility menu": "Preskočiť na ponuku prístupnosti",
            "Accessibility Report": "Správa o prístupnosti",
            "Run Accessibility Check": "Spustiť kontrolu prístupnosti",
            "Loading...": "Načítava sa...",
            "Analyzing page...": "Analyzuje sa stránka...",
            "Critical": "Kritické",
            "Serious": "Závažné",
            "Moderate": "Stredne závažné",
            "Minor": "Menej závažné",
            "Violations Found": "Zistené porušenia",
            "No Issues Found": "Nenašli sa žiadne problémy",
            "Element": "Prvok",
            "Issue": "Problém",
            "How to Fix": "Ako opraviť",
            "Close Report": "Zavrieť správu",
            "Passed Tests": "Úspešné testy",
            "Items Need Review": "Položky na kontrolu",
            "Annotations": "Anotácie",
            "Text to Speech": "Prevod textu na reč",
            "Text to Speech On": "Prevod textu na reč zapnutý",
            "Text to Speech Off": "Prevod textu na reč vypnutý",
            "Simplify Layout": "Zjednodušiť rozloženie",
            "Speech": "Reč",
            "Text": "Text",
            "Color & Contrast": "Farby a kontrast",
            "Reading Aids": "Pomôcky na čítanie",
            "Interaction": "Interakcia",
            "Contrast": "Kontrast",
            "Saturation": "Sýtosť",
            "Light": "Svetlý",
            "Dark": "Tmavý",
            "High": "Vysoká",
            "Low": "Nízka",
            "Play": "Prehrať",
            "Pause": "Pozastaviť",
            "Stop": "Zastaviť",
            "Loading voice...": "Načítava sa hlas...",
            "Reading...": "Číta sa...",
            "Profiles": "Profily",
            "Seizure Safe": "Bezpečný pri epilepsii",
            "Vision Impaired": "Pre slabozrakých",
            "ADHD Friendly": "Vhodný pri ADHD",
            "Dyslexia Friendly": "Vhodný pri dyslexii",
            "On": "Zapnuté",
            "Off": "Vypnuté",
            "Mute Sounds": "Stlmiť zvuky",
            "Page Structure": "Štruktúra stránky",
            "Text Magnifier": "Textová lupa",
            "Tooltips": "Popisy",
            "Navigation": "Navigácia",
            "Header": "Hlavička",
            "Main content": "Hlavný obsah",
            "Footer": "Päta",
            "Sidebar": "Bočný panel",
            "Search": "Hľadanie",
            "Form": "Formulár",
            "Section": "Sekcia",
            "Headings": "Nadpisy",
            "Landmarks": "Orientačné body",
            "Links": "Odkazy",
            "No items found": "Nenašli sa žiadne položky",
            "Settings reset": "Nastavenia boli obnovené",
          },
          sr: {
            "Accessibility": "Приступачност",
            "Accessibility Options": "Опције приступачности",
            "Accessibility Menu": "Мени приступачности",
            "Accessibility Statement": "Изјава о приступачности",
            "Hide widget": "Сакриј виџет",
            "Move widget": "Премести виџет",
            "This visit": "Ова посета",
            "One day": "Један дан",
            "One week": "Једна недеља",
            "Always": "Увек",
            "The widget stays hidden until you clear this site's data in your browser.": "Виџет остаје сакривен док у прегледачу не обришете податке овог сајта.",
            "To bring it back sooner, clear this site's data in your browser.": "Да бисте га раније вратили, обришите податке овог сајта у прегледачу.",
            "Hide": "Сакриј",
            "Reset settings": "Ресетуј подешавања",
            "Reset All Settings": "Ресетуј сва подешавања",
            "Close": "Затвори",
            "Content Adjustments": "Прилагођавање садржаја",
            "Adjust Font Size": "Прилагоди величину фонта",
            "Highlight Links": "Истакни везе",
            "Readable Font": "Читљив фонт",
            "Color Adjustments": "Прилагођавање боја",
            "Invert Colors": "Инвертуј боје",
            "Light Contrast": "Светли контраст",
            "Dark Contrast": "Тамни контраст",
            "High Contrast": "Високи контраст",
            "Smart Contrast": "Паметни контраст",
            "High Saturation": "Висока засићеност",
            "Low Saturation": "Ниска засићеност",
            "Monochrome": "Црно-бело",
            "Tools": "Алатке",
            "Reading Guide": "Водич за читање",
            "Stop Animations": "Заустави анимације",
            "Big Cursor": "Велики курсор",
            "Increase Font Size": "Повећај величину фонта",
            "Decrease Font Size": "Смањи величину фонта",
            "Letter Spacing": "Размак између слова",
            "Line Height": "Проред",
            "Font Weight": "Дебљина фонта",
            "Dyslexia Font": "Фонт за дислексију",
            "Legible Font": "Читак фонт",
            "Font Size": "Величина фонта",
            "Language": "Језик",
            "All Languages": "Сви језици",
            "Search language": "Претражи језике",
            "Open Accessibility Menu": "Отвори мени приступачности",
            "Open accessibility menu": "Отвори мени приступачности",
            "Hide Images": "Сакриј слике",
            "Skip to accessibility menu": "Пређи на мени приступачности",
            "Accessibility Report": "Извештај о приступачности",
            "Run Accessibility Check": "Покрени проверу приступачности",
            "Loading...": "Учитавање...",
            "Analyzing page...": "Анализирање странице...",
            "Critical": "Критично",
            "Serious": "Озбиљно",
            "Moderate": "Умерено",
            "Minor": "Незнатно",
            "Violations Found": "Пронађени проблеми",
            "No Issues Found": "Нема пронађених проблема",
            "Element": "Елемент",
            "Issue": "Проблем",
            "How to Fix": "Како исправити",
            "Close Report": "Затвори извештај",
            "Passed Tests": "Успешни тестови",
            "Items Need Review": "Ставке за преглед",
            "Annotations": "Анотације",
            "Text to Speech": "Текст у говор",
            "Text to Speech On": "Текст у говор укључен",
            "Text to Speech Off": "Текст у говор искључен",
            "Simplify Layout": "Поједностави распоред",
            "Speech": "Говор",
            "Text": "Текст",
            "Color & Contrast": "Боје и контраст",
            "Reading Aids": "Помагала за читање",
            "Interaction": "Интеракција",
            "Contrast": "Контраст",
            "Saturation": "Засићеност",
            "Light": "Светло",
            "Dark": "Тамно",
            "High": "Високо",
            "Low": "Ниско",
            "Play": "Пусти",
            "Pause": "Паузирај",
            "Stop": "Заустави",
            "Loading voice...": "Учитавање гласа...",
            "Reading...": "Читање...",
            "Profiles": "Профили",
            "Seizure Safe": "Безбедно за епилепсију",
            "Vision Impaired": "Оштећен вид",
            "ADHD Friendly": "Прилагођено за АДХД",
            "Dyslexia Friendly": "Прилагођено за дислексију",
            "On": "Укључено",
            "Off": "Искључено",
            "Mute Sounds": "Искључи звук",
            "Page Structure": "Структура странице",
            "Text Magnifier": "Лупа за текст",
            "Tooltips": "Савети",
            "Navigation": "Навигација",
            "Header": "Заглавље",
            "Main content": "Главни садржај",
            "Footer": "Подножје",
            "Sidebar": "Бочна трака",
            "Search": "Претрага",
            "Form": "Образац",
            "Section": "Одељак",
            "Headings": "Наслови",
            "Landmarks": "Оријентири",
            "Links": "Везе",
            "No items found": "Нема пронађених ставки",
            "Settings reset": "Подешавања су ресетована",
          },
          sw: {
            "Accessibility": "Ufikivu",
            "Accessibility Options": "Chaguo za Ufikivu",
            "Accessibility Menu": "Menyu ya Ufikivu",
            "Accessibility Statement": "Taarifa ya Ufikivu",
            "Hide widget": "Ficha wijeti",
            "Move widget": "Hamisha wijeti",
            "This visit": "Ziara hii",
            "One day": "Siku moja",
            "One week": "Wiki moja",
            "Always": "Daima",
            "The widget stays hidden until you clear this site's data in your browser.": "Wijeti itabaki imefichwa hadi ufute data ya tovuti hii kwenye kivinjari chako.",
            "To bring it back sooner, clear this site's data in your browser.": "Ili kuirudisha mapema, futa data ya tovuti hii kwenye kivinjari chako.",
            "Hide": "Ficha",
            "Reset settings": "Weka upya mipangilio",
            "Reset All Settings": "Weka Upya Mipangilio Yote",
            "Close": "Funga",
            "Content Adjustments": "Marekebisho ya Maudhui",
            "Adjust Font Size": "Rekebisha Ukubwa wa Fonti",
            "Highlight Links": "Angazia Viungo",
            "Readable Font": "Fonti Inayosomeka",
            "Color Adjustments": "Marekebisho ya Rangi",
            "Invert Colors": "Geuza Rangi Kinyume",
            "Light Contrast": "Utofautishaji Angavu",
            "Dark Contrast": "Utofautishaji wa Giza",
            "High Contrast": "Utofautishaji wa Juu",
            "Smart Contrast": "Utofautishaji Mahiri",
            "High Saturation": "Ukolezi wa Juu",
            "Low Saturation": "Ukolezi wa Chini",
            "Monochrome": "Rangi Moja",
            "Tools": "Zana",
            "Reading Guide": "Mwongozo wa Kusoma",
            "Stop Animations": "Simamisha Uhuishaji",
            "Big Cursor": "Kishale Kikubwa",
            "Increase Font Size": "Ongeza Ukubwa wa Fonti",
            "Decrease Font Size": "Punguza Ukubwa wa Fonti",
            "Letter Spacing": "Nafasi ya Herufi",
            "Line Height": "Nafasi ya Mistari",
            "Font Weight": "Unene wa Fonti",
            "Dyslexia Font": "Fonti ya Disleksia",
            "Legible Font": "Fonti Rahisi Kusoma",
            "Font Size": "Ukubwa wa Fonti",
            "Language": "Lugha",
            "All Languages": "Lugha Zote",
            "Search language": "Tafuta lugha",
            "Open Accessibility Menu": "Fungua Menyu ya Ufikivu",
            "Open accessibility menu": "Fungua menyu ya ufikivu",
            "Hide Images": "Ficha Picha",
            "Skip to accessibility menu": "Ruka hadi menyu ya ufikivu",
            "Accessibility Report": "Ripoti ya Ufikivu",
            "Run Accessibility Check": "Fanya Ukaguzi wa Ufikivu",
            "Loading...": "Inapakia...",
            "Analyzing page...": "Inachanganua ukurasa...",
            "Critical": "Hatari",
            "Serious": "Kali",
            "Moderate": "Wastani",
            "Minor": "Ndogo",
            "Violations Found": "Ukiukaji Uliopatikana",
            "No Issues Found": "Hakuna Matatizo Yaliyopatikana",
            "Element": "Kipengele",
            "Issue": "Tatizo",
            "How to Fix": "Jinsi ya Kurekebisha",
            "Close Report": "Funga Ripoti",
            "Passed Tests": "Majaribio Yaliyofaulu",
            "Items Need Review": "Vipengele Vinavyohitaji Ukaguzi",
            "Annotations": "Vidokezo",
            "Text to Speech": "Kusoma kwa Sauti",
            "Text to Speech On": "Kusoma kwa Sauti Kumewashwa",
            "Text to Speech Off": "Kusoma kwa Sauti Kumezimwa",
            "Simplify Layout": "Rahisisha Mpangilio",
            "Speech": "Sauti",
            "Text": "Maandishi",
            "Color & Contrast": "Rangi na Utofautishaji",
            "Reading Aids": "Visaidizi vya Kusoma",
            "Interaction": "Mwingiliano",
            "Contrast": "Utofautishaji",
            "Saturation": "Ukolezi wa Rangi",
            "Light": "Angavu",
            "Dark": "Giza",
            "High": "Juu",
            "Low": "Chini",
            "Play": "Cheza",
            "Pause": "Sitisha",
            "Stop": "Simamisha",
            "Loading voice...": "Inapakia sauti...",
            "Reading...": "Inasoma...",
            "Profiles": "Wasifu",
            "Seizure Safe": "Salama kwa Kifafa",
            "Vision Impaired": "Wenye Uoni Hafifu",
            "ADHD Friendly": "Rafiki kwa ADHD",
            "Dyslexia Friendly": "Rafiki kwa Disleksia",
            "On": "Imewashwa",
            "Off": "Imezimwa",
            "Mute Sounds": "Zima Sauti",
            "Page Structure": "Muundo wa Ukurasa",
            "Text Magnifier": "Kikuza Maandishi",
            "Tooltips": "Vidokezo",
            "Navigation": "Urambazaji",
            "Header": "Kichwa",
            "Main content": "Maudhui makuu",
            "Footer": "Kijachini",
            "Sidebar": "Upau wa kando",
            "Search": "Tafuta",
            "Form": "Fomu",
            "Section": "Sehemu",
            "Headings": "Vichwa",
            "Landmarks": "Alama Muhimu",
            "Links": "Viungo",
            "No items found": "Hakuna vipengele vilivyopatikana",
            "Settings reset": "Mipangilio imewekwa upya",
          },
          ta: {
            "Accessibility": "அணுகல்தன்மை",
            "Accessibility Options": "அணுகல்தன்மை விருப்பங்கள்",
            "Accessibility Menu": "அணுகல்தன்மை மெனு",
            "Accessibility Statement": "அணுகல்தன்மை அறிக்கை",
            "Hide widget": "விட்ஜெட்டை மறை",
            "Move widget": "விட்ஜெட்டை நகர்த்து",
            "This visit": "இந்த வருகை",
            "One day": "ஒரு நாள்",
            "One week": "ஒரு வாரம்",
            "Always": "எப்போதும்",
            "The widget stays hidden until you clear this site's data in your browser.": "உங்கள் உலாவியில் இந்தத் தளத்தின் தரவை அழிக்கும் வரை விட்ஜெட் மறைந்திருக்கும்.",
            "To bring it back sooner, clear this site's data in your browser.": "இதை முன்கூட்டியே திரும்பக் கொண்டுவர, உங்கள் உலாவியில் இந்தத் தளத்தின் தரவை அழிக்கவும்.",
            "Hide": "மறை",
            "Reset settings": "அமைப்புகளை மீட்டமை",
            "Reset All Settings": "எல்லா அமைப்புகளையும் மீட்டமை",
            "Close": "மூடு",
            "Content Adjustments": "உள்ளடக்கச் சீரமைப்புகள்",
            "Adjust Font Size": "எழுத்துரு அளவைச் சரிசெய்",
            "Highlight Links": "இணைப்புகளை முன்னிலைப்படுத்து",
            "Readable Font": "படிக்க எளிதான எழுத்துரு",
            "Color Adjustments": "வண்ணச் சீரமைப்புகள்",
            "Invert Colors": "வண்ணங்களை நேர்மாறாக்கு",
            "Light Contrast": "வெளிர் மாறுபாடு",
            "Dark Contrast": "இருண்ட மாறுபாடு",
            "High Contrast": "அதிக மாறுபாடு",
            "Smart Contrast": "ஸ்மார்ட் மாறுபாடு",
            "High Saturation": "அதிக நிறச்செறிவு",
            "Low Saturation": "குறைந்த நிறச்செறிவு",
            "Monochrome": "ஒற்றை வண்ணம்",
            "Tools": "கருவிகள்",
            "Reading Guide": "வாசிப்பு வழிகாட்டி",
            "Stop Animations": "அனிமேஷன்களை நிறுத்து",
            "Big Cursor": "பெரிய கர்சர்",
            "Increase Font Size": "எழுத்துரு அளவை அதிகரி",
            "Decrease Font Size": "எழுத்துரு அளவைக் குறை",
            "Letter Spacing": "எழுத்து இடைவெளி",
            "Line Height": "வரி உயரம்",
            "Font Weight": "எழுத்துருத் தடிமன்",
            "Dyslexia Font": "டிஸ்லெக்ஸியா எழுத்துரு",
            "Legible Font": "தெளிவான எழுத்துரு",
            "Font Size": "எழுத்துரு அளவு",
            "Language": "மொழி",
            "All Languages": "அனைத்து மொழிகளும்",
            "Search language": "மொழியைத் தேடு",
            "Open Accessibility Menu": "அணுகல்தன்மை மெனுவைத் திற",
            "Open accessibility menu": "அணுகல்தன்மை மெனுவைத் திற",
            "Hide Images": "படங்களை மறை",
            "Skip to accessibility menu": "அணுகல்தன்மை மெனுவிற்குத் தாவு",
            "Accessibility Report": "அணுகல்தன்மை அறிக்கை",
            "Run Accessibility Check": "அணுகல்தன்மை சோதனையை இயக்கு",
            "Loading...": "ஏற்றுகிறது...",
            "Analyzing page...": "பக்கம் பகுப்பாய்வு செய்யப்படுகிறது...",
            "Critical": "மிகத் தீவிரம்",
            "Serious": "தீவிரம்",
            "Moderate": "மிதமானது",
            "Minor": "சிறியது",
            "Violations Found": "கண்டறியப்பட்ட மீறல்கள்",
            "No Issues Found": "சிக்கல்கள் எதுவும் கண்டறியப்படவில்லை",
            "Element": "உறுப்பு",
            "Issue": "சிக்கல்",
            "How to Fix": "சரிசெய்வது எப்படி",
            "Close Report": "அறிக்கையை மூடு",
            "Passed Tests": "தேர்ச்சியடைந்த சோதனைகள்",
            "Items Need Review": "மதிப்பாய்வு தேவைப்படும் உருப்படிகள்",
            "Annotations": "விளக்கக்குறிப்புகள்",
            "Text to Speech": "உரையிலிருந்து பேச்சு",
            "Text to Speech On": "உரையிலிருந்து பேச்சு இயக்கப்பட்டது",
            "Text to Speech Off": "உரையிலிருந்து பேச்சு முடக்கப்பட்டது",
            "Simplify Layout": "தளவமைப்பை எளிமையாக்கு",
            "Speech": "பேச்சு",
            "Text": "உரை",
            "Color & Contrast": "வண்ணம் மற்றும் மாறுபாடு",
            "Reading Aids": "வாசிப்பு உதவிகள்",
            "Interaction": "ஊடாட்டம்",
            "Contrast": "மாறுபாடு",
            "Saturation": "நிறச்செறிவு",
            "Light": "வெளிர்",
            "Dark": "இருண்ட",
            "High": "அதிகம்",
            "Low": "குறைவு",
            "Play": "இயக்கு",
            "Pause": "இடைநிறுத்து",
            "Stop": "நிறுத்து",
            "Loading voice...": "குரல் ஏற்றப்படுகிறது...",
            "Reading...": "வாசிக்கிறது...",
            "Profiles": "சுயவிவரங்கள்",
            "Seizure Safe": "வலிப்புப் பாதுகாப்பு",
            "Vision Impaired": "பார்வைக் குறைபாடு",
            "ADHD Friendly": "ADHD-க்கு ஏற்றது",
            "Dyslexia Friendly": "டிஸ்லெக்ஸியாவுக்கு ஏற்றது",
            "On": "இயக்கம்",
            "Off": "முடக்கம்",
            "Mute Sounds": "ஒலியை முடக்கு",
            "Page Structure": "பக்க அமைப்பு",
            "Text Magnifier": "உரைப் பெரிதாக்கி",
            "Tooltips": "உதவிக்குறிப்புகள்",
            "Navigation": "வழிசெலுத்தல்",
            "Header": "தலைப்புப் பகுதி",
            "Main content": "முதன்மை உள்ளடக்கம்",
            "Footer": "அடிக்குறிப்பு",
            "Sidebar": "பக்கப்பட்டி",
            "Search": "தேடல்",
            "Form": "படிவம்",
            "Section": "பிரிவு",
            "Headings": "தலைப்புகள்",
            "Landmarks": "அடையாளங்கள்",
            "Links": "இணைப்புகள்",
            "No items found": "உருப்படிகள் எதுவும் இல்லை",
            "Settings reset": "அமைப்புகள் மீட்டமைக்கப்பட்டன",
          },
          te: {
            "Accessibility": "యాక్సెసిబిలిటీ",
            "Accessibility Options": "యాక్సెసిబిలిటీ ఎంపికలు",
            "Accessibility Menu": "యాక్సెసిబిలిటీ మెనూ",
            "Accessibility Statement": "యాక్సెసిబిలిటీ ప్రకటన",
            "Hide widget": "విడ్జెట్‌ను దాచు",
            "Move widget": "విడ్జెట్‌ను తరలించు",
            "This visit": "ఈ సందర్శన",
            "One day": "ఒక రోజు",
            "One week": "ఒక వారం",
            "Always": "ఎల్లప్పుడూ",
            "The widget stays hidden until you clear this site's data in your browser.": "మీ బ్రౌజర్‌లో ఈ సైట్ డేటాను క్లియర్ చేసే వరకు విడ్జెట్ దాగి ఉంటుంది.",
            "To bring it back sooner, clear this site's data in your browser.": "దీన్ని ముందుగానే తిరిగి తీసుకురావడానికి, మీ బ్రౌజర్‌లో ఈ సైట్ డేటాను క్లియర్ చేయండి.",
            "Hide": "దాచు",
            "Reset settings": "సెట్టింగ్‌లను రీసెట్ చేయండి",
            "Reset All Settings": "అన్ని సెట్టింగ్‌లను రీసెట్ చేయండి",
            "Close": "మూసివేయండి",
            "Content Adjustments": "కంటెంట్ సర్దుబాట్లు",
            "Adjust Font Size": "ఫాంట్ పరిమాణాన్ని సర్దుబాటు చేయండి",
            "Highlight Links": "లింక్‌లను హైలైట్ చేయండి",
            "Readable Font": "చదవగలిగే ఫాంట్",
            "Color Adjustments": "రంగు సర్దుబాట్లు",
            "Invert Colors": "రంగులను విలోమం చేయండి",
            "Light Contrast": "లేత కాంట్రాస్ట్",
            "Dark Contrast": "ముదురు కాంట్రాస్ట్",
            "High Contrast": "అధిక కాంట్రాస్ట్",
            "Smart Contrast": "స్మార్ట్ కాంట్రాస్ట్",
            "High Saturation": "అధిక సంతృప్తత",
            "Low Saturation": "తక్కువ సంతృప్తత",
            "Monochrome": "ఏకవర్ణం",
            "Tools": "సాధనాలు",
            "Reading Guide": "పఠన మార్గదర్శి",
            "Stop Animations": "యానిమేషన్‌లను ఆపండి",
            "Big Cursor": "పెద్ద కర్సర్",
            "Increase Font Size": "ఫాంట్ పరిమాణాన్ని పెంచండి",
            "Decrease Font Size": "ఫాంట్ పరిమాణాన్ని తగ్గించండి",
            "Letter Spacing": "అక్షరాల అంతరం",
            "Line Height": "పంక్తి ఎత్తు",
            "Font Weight": "ఫాంట్ మందం",
            "Dyslexia Font": "డిస్లెక్సియా ఫాంట్",
            "Legible Font": "స్పష్టమైన ఫాంట్",
            "Font Size": "ఫాంట్ పరిమాణం",
            "Language": "భాష",
            "All Languages": "అన్ని భాషలు",
            "Search language": "భాషను వెతకండి",
            "Open Accessibility Menu": "యాక్సెసిబిలిటీ మెనూను తెరవండి",
            "Open accessibility menu": "యాక్సెసిబిలిటీ మెనూను తెరవండి",
            "Hide Images": "చిత్రాలను దాచండి",
            "Skip to accessibility menu": "యాక్సెసిబిలిటీ మెనూకు నేరుగా వెళ్ళండి",
            "Accessibility Report": "యాక్సెసిబిలిటీ నివేదిక",
            "Run Accessibility Check": "యాక్సెసిబిలిటీ తనిఖీ చేయండి",
            "Loading...": "లోడ్ అవుతోంది...",
            "Analyzing page...": "పేజీని విశ్లేషిస్తోంది...",
            "Critical": "అత్యంత తీవ్రం",
            "Serious": "తీవ్రం",
            "Moderate": "మధ్యస్థం",
            "Minor": "స్వల్పం",
            "Violations Found": "కనుగొనబడిన ఉల్లంఘనలు",
            "No Issues Found": "సమస్యలు ఏవీ కనుగొనబడలేదు",
            "Element": "ఎలిమెంట్",
            "Issue": "సమస్య",
            "How to Fix": "ఎలా సరిచేయాలి",
            "Close Report": "నివేదికను మూసివేయండి",
            "Passed Tests": "ఉత్తీర్ణమైన పరీక్షలు",
            "Items Need Review": "సమీక్ష అవసరమైన అంశాలు",
            "Annotations": "వ్యాఖ్యలు",
            "Text to Speech": "వచనం నుండి ప్రసంగం",
            "Text to Speech On": "వచనం నుండి ప్రసంగం ఆన్",
            "Text to Speech Off": "వచనం నుండి ప్రసంగం ఆఫ్",
            "Simplify Layout": "లేఅవుట్‌ను సరళీకరించండి",
            "Speech": "ప్రసంగం",
            "Text": "వచనం",
            "Color & Contrast": "రంగు & కాంట్రాస్ట్",
            "Reading Aids": "పఠన సహాయాలు",
            "Interaction": "పరస్పర చర్య",
            "Contrast": "కాంట్రాస్ట్",
            "Saturation": "సంతృప్తత",
            "Light": "లేత",
            "Dark": "ముదురు",
            "High": "అధికం",
            "Low": "తక్కువ",
            "Play": "ప్లే",
            "Pause": "పాజ్",
            "Stop": "స్టాప్",
            "Loading voice...": "వాయిస్ లోడ్ అవుతోంది...",
            "Reading...": "చదువుతోంది...",
            "Profiles": "ప్రొఫైల్‌లు",
            "Seizure Safe": "మూర్ఛ సురక్షితం",
            "Vision Impaired": "దృష్టి లోపం",
            "ADHD Friendly": "ADHD అనుకూలం",
            "Dyslexia Friendly": "డిస్లెక్సియా అనుకూలం",
            "On": "ఆన్",
            "Off": "ఆఫ్",
            "Mute Sounds": "శబ్దాలను మ్యూట్ చేయండి",
            "Page Structure": "పేజీ నిర్మాణం",
            "Text Magnifier": "వచన మాగ్నిఫైయర్",
            "Tooltips": "టూల్‌టిప్‌లు",
            "Navigation": "నావిగేషన్",
            "Header": "హెడర్",
            "Main content": "ప్రధాన కంటెంట్",
            "Footer": "ఫుటర్",
            "Sidebar": "సైడ్‌బార్",
            "Search": "శోధన",
            "Form": "ఫారమ్",
            "Section": "విభాగం",
            "Headings": "శీర్షికలు",
            "Landmarks": "ల్యాండ్‌మార్క్‌లు",
            "Links": "లింక్‌లు",
            "No items found": "అంశాలు ఏవీ కనుగొనబడలేదు",
            "Settings reset": "సెట్టింగ్‌లు రీసెట్ చేయబడ్డాయి",
          },
          th: {
            "Accessibility": "การช่วยการเข้าถึง",
            "Accessibility Options": "ตัวเลือกการช่วยการเข้าถึง",
            "Accessibility Menu": "เมนูการช่วยการเข้าถึง",
            "Accessibility Statement": "แถลงการณ์การช่วยการเข้าถึง",
            "Hide widget": "ซ่อนวิดเจ็ต",
            "Move widget": "ย้ายวิดเจ็ต",
            "This visit": "การเข้าชมครั้งนี้",
            "One day": "หนึ่งวัน",
            "One week": "หนึ่งสัปดาห์",
            "Always": "ตลอดไป",
            "The widget stays hidden until you clear this site's data in your browser.": "วิดเจ็ตจะถูกซ่อนไว้จนกว่าคุณจะล้างข้อมูลของเว็บไซต์นี้ในเบราว์เซอร์",
            "To bring it back sooner, clear this site's data in your browser.": "หากต้องการให้กลับมาเร็วขึ้น ให้ล้างข้อมูลของเว็บไซต์นี้ในเบราว์เซอร์",
            "Hide": "ซ่อน",
            "Reset settings": "รีเซ็ตการตั้งค่า",
            "Reset All Settings": "รีเซ็ตการตั้งค่าทั้งหมด",
            "Close": "ปิด",
            "Content Adjustments": "การปรับเนื้อหา",
            "Adjust Font Size": "ปรับขนาดตัวอักษร",
            "Highlight Links": "เน้นลิงก์",
            "Readable Font": "ฟอนต์อ่านง่าย",
            "Color Adjustments": "การปรับสี",
            "Invert Colors": "กลับสี",
            "Light Contrast": "ความคมชัดสว่าง",
            "Dark Contrast": "ความคมชัดมืด",
            "High Contrast": "ความคมชัดสูง",
            "Smart Contrast": "ความคมชัดอัจฉริยะ",
            "High Saturation": "ความอิ่มตัวของสีสูง",
            "Low Saturation": "ความอิ่มตัวของสีต่ำ",
            "Monochrome": "โทนสีเดียว",
            "Tools": "เครื่องมือ",
            "Reading Guide": "เส้นนำสายตา",
            "Stop Animations": "หยุดภาพเคลื่อนไหว",
            "Big Cursor": "เคอร์เซอร์ขนาดใหญ่",
            "Increase Font Size": "เพิ่มขนาดตัวอักษร",
            "Decrease Font Size": "ลดขนาดตัวอักษร",
            "Letter Spacing": "ระยะห่างตัวอักษร",
            "Line Height": "ระยะห่างบรรทัด",
            "Font Weight": "ความหนาตัวอักษร",
            "Dyslexia Font": "ฟอนต์สำหรับผู้มีภาวะดิสเล็กเซีย",
            "Legible Font": "ฟอนต์ชัดเจน",
            "Font Size": "ขนาดตัวอักษร",
            "Language": "ภาษา",
            "All Languages": "ภาษาทั้งหมด",
            "Search language": "ค้นหาภาษา",
            "Open Accessibility Menu": "เปิดเมนูการช่วยการเข้าถึง",
            "Open accessibility menu": "เปิดเมนูการช่วยการเข้าถึง",
            "Hide Images": "ซ่อนรูปภาพ",
            "Skip to accessibility menu": "ข้ามไปยังเมนูการช่วยการเข้าถึง",
            "Accessibility Report": "รายงานการช่วยการเข้าถึง",
            "Run Accessibility Check": "ตรวจสอบการช่วยการเข้าถึง",
            "Loading...": "กำลังโหลด...",
            "Analyzing page...": "กำลังวิเคราะห์หน้าเว็บ...",
            "Critical": "วิกฤต",
            "Serious": "ร้ายแรง",
            "Moderate": "ปานกลาง",
            "Minor": "เล็กน้อย",
            "Violations Found": "พบปัญหา",
            "No Issues Found": "ไม่พบปัญหา",
            "Element": "องค์ประกอบ",
            "Issue": "ปัญหา",
            "How to Fix": "วิธีแก้ไข",
            "Close Report": "ปิดรายงาน",
            "Passed Tests": "การทดสอบที่ผ่าน",
            "Items Need Review": "รายการที่ต้องตรวจสอบ",
            "Annotations": "คำอธิบายประกอบ",
            "Text to Speech": "อ่านออกเสียง",
            "Text to Speech On": "เปิดการอ่านออกเสียง",
            "Text to Speech Off": "ปิดการอ่านออกเสียง",
            "Simplify Layout": "ปรับหน้าให้เรียบง่าย",
            "Speech": "เสียงพูด",
            "Text": "ข้อความ",
            "Color & Contrast": "สีและความคมชัด",
            "Reading Aids": "ตัวช่วยการอ่าน",
            "Interaction": "การโต้ตอบ",
            "Contrast": "ความคมชัด",
            "Saturation": "ความอิ่มตัวของสี",
            "Light": "สว่าง",
            "Dark": "มืด",
            "High": "สูง",
            "Low": "ต่ำ",
            "Play": "เล่น",
            "Pause": "หยุดชั่วคราว",
            "Stop": "หยุด",
            "Loading voice...": "กำลังโหลดเสียง...",
            "Reading...": "กำลังอ่าน...",
            "Profiles": "โปรไฟล์",
            "Seizure Safe": "ปลอดภัยจากอาการชัก",
            "Vision Impaired": "ผู้บกพร่องทางการมองเห็น",
            "ADHD Friendly": "เหมาะกับผู้มีสมาธิสั้น",
            "Dyslexia Friendly": "เหมาะกับผู้มีภาวะดิสเล็กเซีย",
            "On": "เปิด",
            "Off": "ปิด",
            "Mute Sounds": "ปิดเสียง",
            "Page Structure": "โครงสร้างหน้าเว็บ",
            "Text Magnifier": "แว่นขยายข้อความ",
            "Tooltips": "คำแนะนำเครื่องมือ",
            "Navigation": "การนำทาง",
            "Header": "ส่วนหัว",
            "Main content": "เนื้อหาหลัก",
            "Footer": "ส่วนท้าย",
            "Sidebar": "แถบด้านข้าง",
            "Search": "ค้นหา",
            "Form": "แบบฟอร์ม",
            "Section": "ส่วน",
            "Headings": "หัวข้อ",
            "Landmarks": "จุดสังเกต",
            "Links": "ลิงก์",
            "No items found": "ไม่พบรายการ",
            "Settings reset": "รีเซ็ตการตั้งค่าแล้ว",
          },
          tr: {
            "Accessibility": "Erişilebilirlik",
            "Accessibility Options": "Erişilebilirlik Seçenekleri",
            "Accessibility Menu": "Erişilebilirlik Menüsü",
            "Accessibility Statement": "Erişilebilirlik Beyanı",
            "Hide widget": "Widget'ı gizle",
            "Move widget": "Widget'ı taşı",
            "This visit": "Bu ziyaret",
            "One day": "Bir gün",
            "One week": "Bir hafta",
            "Always": "Her zaman",
            "The widget stays hidden until you clear this site's data in your browser.": "Tarayıcınızda bu sitenin verilerini temizleyene kadar widget gizli kalır.",
            "To bring it back sooner, clear this site's data in your browser.": "Daha erken geri getirmek için tarayıcınızda bu sitenin verilerini temizleyin.",
            "Hide": "Gizle",
            "Reset settings": "Ayarları sıfırla",
            "Reset All Settings": "Tüm Ayarları Sıfırla",
            "Close": "Kapat",
            "Content Adjustments": "İçerik Ayarları",
            "Adjust Font Size": "Yazı Boyutunu Ayarla",
            "Highlight Links": "Bağlantıları Vurgula",
            "Readable Font": "Okunabilir Yazı Tipi",
            "Color Adjustments": "Renk Ayarları",
            "Invert Colors": "Renkleri Ters Çevir",
            "Light Contrast": "Açık Kontrast",
            "Dark Contrast": "Koyu Kontrast",
            "High Contrast": "Yüksek Kontrast",
            "Smart Contrast": "Akıllı Kontrast",
            "High Saturation": "Yüksek Doygunluk",
            "Low Saturation": "Düşük Doygunluk",
            "Monochrome": "Tek Renk",
            "Tools": "Araçlar",
            "Reading Guide": "Okuma Kılavuzu",
            "Stop Animations": "Animasyonları Durdur",
            "Big Cursor": "Büyük İmleç",
            "Increase Font Size": "Yazı Boyutunu Büyüt",
            "Decrease Font Size": "Yazı Boyutunu Küçült",
            "Letter Spacing": "Harf Aralığı",
            "Line Height": "Satır Yüksekliği",
            "Font Weight": "Yazı Kalınlığı",
            "Dyslexia Font": "Disleksi Yazı Tipi",
            "Legible Font": "Okunaklı Yazı Tipi",
            "Font Size": "Yazı Boyutu",
            "Language": "Dil",
            "All Languages": "Tüm Diller",
            "Search language": "Dil ara",
            "Open Accessibility Menu": "Erişilebilirlik Menüsünü Aç",
            "Open accessibility menu": "Erişilebilirlik menüsünü aç",
            "Hide Images": "Görselleri Gizle",
            "Skip to accessibility menu": "Erişilebilirlik menüsüne atla",
            "Accessibility Report": "Erişilebilirlik Raporu",
            "Run Accessibility Check": "Erişilebilirlik Denetimi Yap",
            "Loading...": "Yükleniyor...",
            "Analyzing page...": "Sayfa analiz ediliyor...",
            "Critical": "Kritik",
            "Serious": "Ciddi",
            "Moderate": "Orta",
            "Minor": "Düşük",
            "Violations Found": "Bulunan İhlaller",
            "No Issues Found": "Sorun Bulunamadı",
            "Element": "Öğe",
            "Issue": "Sorun",
            "How to Fix": "Nasıl Düzeltilir",
            "Close Report": "Raporu Kapat",
            "Passed Tests": "Başarılı Testler",
            "Items Need Review": "İncelenmesi Gereken Öğeler",
            "Annotations": "Ek Açıklamalar",
            "Text to Speech": "Metin Okuma",
            "Text to Speech On": "Metin Okuma Açık",
            "Text to Speech Off": "Metin Okuma Kapalı",
            "Simplify Layout": "Düzeni Sadeleştir",
            "Speech": "Konuşma",
            "Text": "Metin",
            "Color & Contrast": "Renk ve Kontrast",
            "Reading Aids": "Okuma Yardımcıları",
            "Interaction": "Etkileşim",
            "Contrast": "Kontrast",
            "Saturation": "Doygunluk",
            "Light": "Açık",
            "Dark": "Koyu",
            "High": "Yüksek",
            "Low": "Düşük",
            "Play": "Oynat",
            "Pause": "Duraklat",
            "Stop": "Durdur",
            "Loading voice...": "Ses yükleniyor...",
            "Reading...": "Okunuyor...",
            "Profiles": "Profiller",
            "Seizure Safe": "Epilepsi Dostu",
            "Vision Impaired": "Görme Engelli",
            "ADHD Friendly": "DEHB Dostu",
            "Dyslexia Friendly": "Disleksi Dostu",
            "On": "Açık",
            "Off": "Kapalı",
            "Mute Sounds": "Sesleri Kapat",
            "Page Structure": "Sayfa Yapısı",
            "Text Magnifier": "Metin Büyüteci",
            "Tooltips": "İpuçları",
            "Navigation": "Gezinme",
            "Header": "Üst bilgi",
            "Main content": "Ana içerik",
            "Footer": "Alt bilgi",
            "Sidebar": "Kenar çubuğu",
            "Search": "Arama",
            "Form": "Form",
            "Section": "Bölüm",
            "Headings": "Başlıklar",
            "Landmarks": "Sınırlar",
            "Links": "Bağlantılar",
            "No items found": "Öğe bulunamadı",
            "Settings reset": "Ayarlar sıfırlandı",
          },
          ur: {
            "Accessibility": "رسائی",
            "Accessibility Options": "رسائی کے اختیارات",
            "Accessibility Menu": "رسائی مینو",
            "Accessibility Statement": "رسائی کا بیان",
            "Hide widget": "ویجٹ چھپائیں",
            "Move widget": "ویجٹ منتقل کریں",
            "This visit": "یہ وزٹ",
            "One day": "ایک دن",
            "One week": "ایک ہفتہ",
            "Always": "ہمیشہ",
            "The widget stays hidden until you clear this site's data in your browser.": "جب تک آپ اپنے براؤزر میں اس سائٹ کا ڈیٹا صاف نہیں کرتے، ویجٹ چھپا رہے گا۔",
            "To bring it back sooner, clear this site's data in your browser.": "اسے پہلے واپس لانے کے لیے، اپنے براؤزر میں اس سائٹ کا ڈیٹا صاف کریں۔",
            "Hide": "چھپائیں",
            "Reset settings": "ترتیبات بحال کریں",
            "Reset All Settings": "تمام ترتیبات بحال کریں",
            "Close": "بند کریں",
            "Content Adjustments": "مواد کی تبدیلیاں",
            "Adjust Font Size": "فونٹ سائز تبدیل کریں",
            "Highlight Links": "روابط نمایاں کریں",
            "Readable Font": "پڑھنے میں آسان فونٹ",
            "Color Adjustments": "رنگوں کی تبدیلیاں",
            "Invert Colors": "رنگ الٹ دیں",
            "Light Contrast": "روشن کنٹراسٹ",
            "Dark Contrast": "گہرا کنٹراسٹ",
            "High Contrast": "زیادہ کنٹراسٹ",
            "Smart Contrast": "سمارٹ کنٹراسٹ",
            "High Saturation": "زیادہ سیچوریشن",
            "Low Saturation": "کم سیچوریشن",
            "Monochrome": "یک رنگی",
            "Tools": "اوزار",
            "Reading Guide": "پڑھنے کا رہنما",
            "Stop Animations": "اینیمیشن روکیں",
            "Big Cursor": "بڑا کرسر",
            "Increase Font Size": "فونٹ سائز بڑھائیں",
            "Decrease Font Size": "فونٹ سائز کم کریں",
            "Letter Spacing": "حروف کا فاصلہ",
            "Line Height": "سطر کی اونچائی",
            "Font Weight": "فونٹ کی موٹائی",
            "Dyslexia Font": "ڈسلیکسیا فونٹ",
            "Legible Font": "واضح فونٹ",
            "Font Size": "فونٹ سائز",
            "Language": "زبان",
            "All Languages": "تمام زبانیں",
            "Search language": "زبان تلاش کریں",
            "Open Accessibility Menu": "رسائی مینو کھولیں",
            "Open accessibility menu": "رسائی مینو کھولیں",
            "Hide Images": "تصاویر چھپائیں",
            "Skip to accessibility menu": "رسائی مینو پر جائیں",
            "Accessibility Report": "رسائی رپورٹ",
            "Run Accessibility Check": "رسائی کی جانچ کریں",
            "Loading...": "لوڈ ہو رہا ہے...",
            "Analyzing page...": "صفحے کا تجزیہ ہو رہا ہے...",
            "Critical": "انتہائی سنگین",
            "Serious": "سنگین",
            "Moderate": "درمیانہ",
            "Minor": "معمولی",
            "Violations Found": "خلاف ورزیاں پائی گئیں",
            "No Issues Found": "کوئی مسئلہ نہیں ملا",
            "Element": "عنصر",
            "Issue": "مسئلہ",
            "How to Fix": "درست کرنے کا طریقہ",
            "Close Report": "رپورٹ بند کریں",
            "Passed Tests": "کامیاب ٹیسٹ",
            "Items Need Review": "جائزہ طلب اشیاء",
            "Annotations": "تشریحات",
            "Text to Speech": "متن سے تقریر",
            "Text to Speech On": "متن سے تقریر آن",
            "Text to Speech Off": "متن سے تقریر آف",
            "Simplify Layout": "خاکہ سادہ بنائیں",
            "Speech": "تقریر",
            "Text": "متن",
            "Color & Contrast": "رنگ اور کنٹراسٹ",
            "Reading Aids": "پڑھنے کی سہولیات",
            "Interaction": "تعامل",
            "Contrast": "کنٹراسٹ",
            "Saturation": "سیچوریشن",
            "Light": "روشن",
            "Dark": "گہرا",
            "High": "زیادہ",
            "Low": "کم",
            "Play": "چلائیں",
            "Pause": "توقف کریں",
            "Stop": "روکیں",
            "Loading voice...": "آواز لوڈ ہو رہی ہے...",
            "Reading...": "پڑھا جا رہا ہے...",
            "Profiles": "پروفائلز",
            "Seizure Safe": "دوروں سے محفوظ",
            "Vision Impaired": "کمزور بینائی",
            "ADHD Friendly": "ADHD دوستانہ",
            "Dyslexia Friendly": "ڈسلیکسیا دوستانہ",
            "On": "آن",
            "Off": "آف",
            "Mute Sounds": "آوازیں خاموش کریں",
            "Page Structure": "صفحے کی ساخت",
            "Text Magnifier": "متن میگنیفائر",
            "Tooltips": "ٹول ٹپس",
            "Navigation": "نیویگیشن",
            "Header": "ہیڈر",
            "Main content": "مرکزی مواد",
            "Footer": "فوٹر",
            "Sidebar": "سائڈبار",
            "Search": "تلاش",
            "Form": "فارم",
            "Section": "سیکشن",
            "Headings": "سرخیاں",
            "Landmarks": "نشانات",
            "Links": "روابط",
            "No items found": "کوئی چیز نہیں ملی",
            "Settings reset": "ترتیبات بحال ہو گئیں",
          },
          vi: {
            "Accessibility": "Trợ năng",
            "Accessibility Options": "Tùy chọn trợ năng",
            "Accessibility Menu": "Menu trợ năng",
            "Accessibility Statement": "Tuyên bố trợ năng",
            "Hide widget": "Ẩn tiện ích",
            "Move widget": "Di chuyển tiện ích",
            "This visit": "Lần truy cập này",
            "One day": "Một ngày",
            "One week": "Một tuần",
            "Always": "Luôn luôn",
            "The widget stays hidden until you clear this site's data in your browser.": "Tiện ích sẽ bị ẩn cho đến khi bạn xóa dữ liệu của trang web này trong trình duyệt.",
            "To bring it back sooner, clear this site's data in your browser.": "Để hiện lại sớm hơn, hãy xóa dữ liệu của trang web này trong trình duyệt.",
            "Hide": "Ẩn",
            "Reset settings": "Đặt lại cài đặt",
            "Reset All Settings": "Đặt lại tất cả các cài đặt",
            "Close": "Đóng",
            "Content Adjustments": "Điều chỉnh nội dung",
            "Adjust Font Size": "Điều chỉnh cỡ chữ",
            "Highlight Links": "Làm nổi bật liên kết",
            "Readable Font": "Phông chữ dễ đọc",
            "Color Adjustments": "Điều chỉnh màu sắc",
            "Invert Colors": "Đảo ngược màu",
            "Light Contrast": "Tương phản sáng",
            "Dark Contrast": "Tương phản tối",
            "High Contrast": "Tương phản cao",
            "Smart Contrast": "Tương phản thông minh",
            "High Saturation": "Độ bão hòa cao",
            "Low Saturation": "Độ bão hòa thấp",
            "Monochrome": "Đơn sắc",
            "Tools": "Công cụ",
            "Reading Guide": "Thước đọc",
            "Stop Animations": "Dừng hoạt ảnh",
            "Big Cursor": "Con trỏ lớn",
            "Increase Font Size": "Tăng cỡ chữ",
            "Decrease Font Size": "Giảm cỡ chữ",
            "Letter Spacing": "Khoảng cách ký tự",
            "Line Height": "Khoảng cách dòng",
            "Font Weight": "Độ đậm chữ",
            "Dyslexia Font": "Phông chữ cho chứng khó đọc",
            "Legible Font": "Phông chữ rõ ràng",
            "Font Size": "Cỡ chữ",
            "Language": "Ngôn ngữ",
            "All Languages": "Tất cả các ngôn ngữ",
            "Search language": "Tìm ngôn ngữ",
            "Open Accessibility Menu": "Mở menu trợ năng",
            "Open accessibility menu": "Mở menu trợ năng",
            "Hide Images": "Ẩn hình ảnh",
            "Skip to accessibility menu": "Chuyển đến menu trợ năng",
            "Accessibility Report": "Báo cáo trợ năng",
            "Run Accessibility Check": "Chạy kiểm tra trợ năng",
            "Loading...": "Đang tải...",
            "Analyzing page...": "Đang phân tích trang...",
            "Critical": "Nghiêm trọng",
            "Serious": "Nặng",
            "Moderate": "Trung bình",
            "Minor": "Nhẹ",
            "Violations Found": "Đã tìm thấy vi phạm",
            "No Issues Found": "Không tìm thấy vấn đề nào",
            "Element": "Phần tử",
            "Issue": "Vấn đề",
            "How to Fix": "Cách khắc phục",
            "Close Report": "Đóng báo cáo",
            "Passed Tests": "Kiểm tra đã đạt",
            "Items Need Review": "Mục cần xem xét",
            "Annotations": "Chú thích",
            "Text to Speech": "Đọc thành tiếng",
            "Text to Speech On": "Đã bật đọc thành tiếng",
            "Text to Speech Off": "Đã tắt đọc thành tiếng",
            "Simplify Layout": "Đơn giản hóa bố cục",
            "Speech": "Giọng nói",
            "Text": "Văn bản",
            "Color & Contrast": "Màu sắc & tương phản",
            "Reading Aids": "Hỗ trợ đọc",
            "Interaction": "Tương tác",
            "Contrast": "Độ tương phản",
            "Saturation": "Độ bão hòa",
            "Light": "Sáng",
            "Dark": "Tối",
            "High": "Cao",
            "Low": "Thấp",
            "Play": "Phát",
            "Pause": "Tạm dừng",
            "Stop": "Dừng",
            "Loading voice...": "Đang tải giọng nói...",
            "Reading...": "Đang đọc...",
            "Profiles": "Hồ sơ",
            "Seizure Safe": "An toàn cho người động kinh",
            "Vision Impaired": "Hỗ trợ khiếm thị",
            "ADHD Friendly": "Thân thiện với ADHD",
            "Dyslexia Friendly": "Thân thiện với chứng khó đọc",
            "On": "Bật",
            "Off": "Tắt",
            "Mute Sounds": "Tắt âm thanh",
            "Page Structure": "Cấu trúc trang",
            "Text Magnifier": "Kính lúp văn bản",
            "Tooltips": "Chú giải",
            "Navigation": "Điều hướng",
            "Header": "Đầu trang",
            "Main content": "Nội dung chính",
            "Footer": "Chân trang",
            "Sidebar": "Thanh bên",
            "Search": "Tìm kiếm",
            "Form": "Biểu mẫu",
            "Section": "Phần",
            "Headings": "Đề mục",
            "Landmarks": "Điểm mốc",
            "Links": "Liên kết",
            "No items found": "Không tìm thấy mục nào",
            "Settings reset": "Đã đặt lại cài đặt",
          },
          zh: {
            "Accessibility": "无障碍",
            "Accessibility Options": "无障碍选项",
            "Accessibility Menu": "无障碍菜单",
            "Accessibility Statement": "无障碍声明",
            "Hide widget": "隐藏小工具",
            "Move widget": "移动小工具",
            "This visit": "本次访问",
            "One day": "一天",
            "One week": "一周",
            "Always": "始终",
            "The widget stays hidden until you clear this site's data in your browser.": "在您清除浏览器中此网站的数据之前，小工具将保持隐藏。",
            "To bring it back sooner, clear this site's data in your browser.": "如需提前恢复显示，请清除浏览器中此网站的数据。",
            "Hide": "隐藏",
            "Reset settings": "重置设置",
            "Reset All Settings": "重置所有设置",
            "Close": "关闭",
            "Content Adjustments": "内容调整",
            "Adjust Font Size": "调整字号",
            "Highlight Links": "高亮链接",
            "Readable Font": "易读字体",
            "Color Adjustments": "颜色调整",
            "Invert Colors": "反转颜色",
            "Light Contrast": "浅色对比度",
            "Dark Contrast": "深色对比度",
            "High Contrast": "高对比度",
            "Smart Contrast": "智能对比度",
            "High Saturation": "高饱和度",
            "Low Saturation": "低饱和度",
            "Monochrome": "单色",
            "Tools": "工具",
            "Reading Guide": "阅读辅助线",
            "Stop Animations": "停止动画",
            "Big Cursor": "大光标",
            "Increase Font Size": "增大字号",
            "Decrease Font Size": "减小字号",
            "Letter Spacing": "字间距",
            "Line Height": "行高",
            "Font Weight": "字体粗细",
            "Dyslexia Font": "阅读障碍字体",
            "Legible Font": "清晰字体",
            "Font Size": "字号",
            "Language": "语言",
            "All Languages": "所有语言",
            "Search language": "搜索语言",
            "Open Accessibility Menu": "打开无障碍菜单",
            "Open accessibility menu": "打开无障碍菜单",
            "Hide Images": "隐藏图片",
            "Skip to accessibility menu": "跳转到无障碍菜单",
            "Accessibility Report": "无障碍报告",
            "Run Accessibility Check": "运行无障碍检查",
            "Loading...": "加载中…",
            "Analyzing page...": "正在分析页面…",
            "Critical": "严重",
            "Serious": "较严重",
            "Moderate": "中等",
            "Minor": "轻微",
            "Violations Found": "发现的违规项",
            "No Issues Found": "未发现问题",
            "Element": "元素",
            "Issue": "问题",
            "How to Fix": "修复方法",
            "Close Report": "关闭报告",
            "Passed Tests": "通过的测试",
            "Items Need Review": "待审查项目",
            "Annotations": "标注",
            "Text to Speech": "文本转语音",
            "Text to Speech On": "文本转语音已开启",
            "Text to Speech Off": "文本转语音已关闭",
            "Simplify Layout": "简化布局",
            "Speech": "语音",
            "Text": "文本",
            "Color & Contrast": "颜色与对比度",
            "Reading Aids": "阅读辅助",
            "Interaction": "交互",
            "Contrast": "对比度",
            "Saturation": "饱和度",
            "Light": "浅色",
            "Dark": "深色",
            "High": "高",
            "Low": "低",
            "Play": "播放",
            "Pause": "暂停",
            "Stop": "停止",
            "Loading voice...": "正在加载语音…",
            "Reading...": "朗读中…",
            "Profiles": "无障碍模式",
            "Seizure Safe": "癫痫安全",
            "Vision Impaired": "视力障碍",
            "ADHD Friendly": "ADHD 友好",
            "Dyslexia Friendly": "阅读障碍友好",
            "On": "开",
            "Off": "关",
            "Mute Sounds": "静音",
            "Page Structure": "页面结构",
            "Text Magnifier": "文本放大镜",
            "Tooltips": "工具提示",
            "Navigation": "导航",
            "Header": "页眉",
            "Main content": "主要内容",
            "Footer": "页脚",
            "Sidebar": "侧边栏",
            "Search": "搜索",
            "Form": "表单",
            "Section": "区域",
            "Headings": "标题",
            "Landmarks": "地标",
            "Links": "链接",
            "No items found": "未找到任何项目",
            "Settings reset": "设置已重置",
          },
          "zh-TW": {
            "Accessibility": "無障礙",
            "Accessibility Options": "無障礙選項",
            "Accessibility Menu": "無障礙選單",
            "Accessibility Statement": "無障礙聲明",
            "Hide widget": "隱藏小工具",
            "Move widget": "移動小工具",
            "This visit": "本次造訪",
            "One day": "一天",
            "One week": "一週",
            "Always": "一律",
            "The widget stays hidden until you clear this site's data in your browser.": "在您清除瀏覽器中此網站的資料之前，小工具將保持隱藏。",
            "To bring it back sooner, clear this site's data in your browser.": "如需提前恢復顯示，請清除瀏覽器中此網站的資料。",
            "Hide": "隱藏",
            "Reset settings": "重設設定",
            "Reset All Settings": "重設所有設定",
            "Close": "關閉",
            "Content Adjustments": "內容調整",
            "Adjust Font Size": "調整文字大小",
            "Highlight Links": "突顯連結",
            "Readable Font": "易讀字型",
            "Color Adjustments": "色彩調整",
            "Invert Colors": "反轉色彩",
            "Light Contrast": "淺色對比",
            "Dark Contrast": "深色對比",
            "High Contrast": "高對比",
            "Smart Contrast": "智慧對比",
            "High Saturation": "高飽和度",
            "Low Saturation": "低飽和度",
            "Monochrome": "單色",
            "Tools": "工具",
            "Reading Guide": "閱讀導引線",
            "Stop Animations": "停止動畫",
            "Big Cursor": "大型游標",
            "Increase Font Size": "放大文字",
            "Decrease Font Size": "縮小文字",
            "Letter Spacing": "字元間距",
            "Line Height": "行高",
            "Font Weight": "字型粗細",
            "Dyslexia Font": "讀寫障礙字型",
            "Legible Font": "清晰字型",
            "Font Size": "文字大小",
            "Language": "語言",
            "All Languages": "所有語言",
            "Search language": "搜尋語言",
            "Open Accessibility Menu": "開啟無障礙選單",
            "Open accessibility menu": "開啟無障礙選單",
            "Hide Images": "隱藏圖片",
            "Skip to accessibility menu": "跳至無障礙選單",
            "Accessibility Report": "無障礙報告",
            "Run Accessibility Check": "執行無障礙檢查",
            "Loading...": "載入中…",
            "Analyzing page...": "正在分析頁面…",
            "Critical": "危急",
            "Serious": "嚴重",
            "Moderate": "中度",
            "Minor": "輕微",
            "Violations Found": "發現違規項目",
            "No Issues Found": "未發現問題",
            "Element": "元素",
            "Issue": "問題",
            "How to Fix": "修正方式",
            "Close Report": "關閉報告",
            "Passed Tests": "通過的測試",
            "Items Need Review": "待檢視項目",
            "Annotations": "標註",
            "Text to Speech": "文字轉語音",
            "Text to Speech On": "文字轉語音已開啟",
            "Text to Speech Off": "文字轉語音已關閉",
            "Simplify Layout": "簡化版面",
            "Speech": "語音",
            "Text": "文字",
            "Color & Contrast": "色彩與對比",
            "Reading Aids": "閱讀輔助",
            "Interaction": "互動",
            "Contrast": "對比",
            "Saturation": "飽和度",
            "Light": "淺色",
            "Dark": "深色",
            "High": "高",
            "Low": "低",
            "Play": "播放",
            "Pause": "暫停",
            "Stop": "停止",
            "Loading voice...": "正在載入語音…",
            "Reading...": "朗讀中…",
            "Profiles": "設定檔",
            "Seizure Safe": "癲癇安全",
            "Vision Impaired": "視覺障礙",
            "ADHD Friendly": "過動症友善",
            "Dyslexia Friendly": "讀寫障礙友善",
            "On": "開啟",
            "Off": "關閉",
            "Mute Sounds": "靜音",
            "Page Structure": "頁面結構",
            "Text Magnifier": "文字放大鏡",
            "Tooltips": "工具提示",
            "Navigation": "導覽",
            "Header": "頁首",
            "Main content": "主要內容",
            "Footer": "頁尾",
            "Sidebar": "側邊欄",
            "Search": "搜尋",
            "Form": "表單",
            "Section": "區段",
            "Headings": "標題",
            "Landmarks": "地標",
            "Links": "連結",
            "No items found": "找不到項目",
            "Settings reset": "設定已重設",
          }
        };

    const SUPPORTED_LANGUAGES = [
          { code: "en", label: "English (English)" },
          { code: "pt", label: "Português (Portuguese)" },
          { code: "it", label: "Italiano (Italian)" },
          { code: "fr", label: "Français (French)" },
          { code: "de", label: "Deutsch (German)" },
          { code: "es", label: "Español (Spanish)" },
          { code: "ru", label: "Русский (Russian)" },
          { code: "pl", label: "Polski (Polish)" },
          { code: "ro", label: "Română (Romanian)" },
          { code: "nl", label: "Nederlands (Dutch)" },
          { code: "uk", label: "Українська (Ukrainian)" },
          { code: "ar", label: "العربية (Arabic)" },
          { code: "he", label: "עברית (Hebrew)" },
          { code: "sv", label: "Svenska (Swedish)" },
          { code: "da", label: "Dansk (Danish)" },
          { code: "ca", label: "Català (Catalan)" },
          { code: "sl", label: "Slovenščina (Slovenian)" },
          { code: "lv", label: "Latviešu (Latvian)" },
          { code: "el", label: "Ελληνικά (Greek)" },
          { code: "ka", label: "ქართული (Georgian)" },
          { code: "am", label: "አማርኛ (Amharic)" },
          { code: "bg", label: "Български (Bulgarian)" },
          { code: "bn", label: "বাংলা (Bengali)" },
          { code: "cs", label: "Čeština (Czech)" },
          { code: "fa", label: "فارسی (Persian)" },
          { code: "fi", label: "Suomi (Finnish)" },
          { code: "fil", label: "Filipino (Filipino)" },
          { code: "hi", label: "हिन्दी (Hindi)" },
          { code: "hr", label: "Hrvatski (Croatian)" },
          { code: "hu", label: "Magyar (Hungarian)" },
          { code: "id", label: "Bahasa Indonesia (Indonesian)" },
          { code: "ja", label: "日本語 (Japanese)" },
          { code: "kn", label: "ಕನ್ನಡ (Kannada)" },
          { code: "ko", label: "한국어 (Korean)" },
          { code: "ku", label: "Kurdî (Kurmancî) (Kurdish)" },
          { code: "lb", label: "Lëtzebuergesch (Luxembourgish)" },
          { code: "ml", label: "മലയാളം (Malayalam)" },
          { code: "mn", label: "Монгол (Mongolian)" },
          { code: "ms", label: "Bahasa Melayu (Malay)" },
          { code: "my", label: "မြန်မာ (Burmese)" },
          { code: "no", label: "Norsk bokmål (Norwegian)" },
          { code: "pa", label: "ਪੰਜਾਬੀ (Punjabi)" },
          { code: "si", label: "සිංහල (Sinhala)" },
          { code: "sk", label: "Slovenčina (Slovak)" },
          { code: "sr", label: "Српски (Serbian)" },
          { code: "sw", label: "Kiswahili (Swahili)" },
          { code: "ta", label: "தமிழ் (Tamil)" },
          { code: "te", label: "తెలుగు (Telugu)" },
          { code: "th", label: "ไทย (Thai)" },
          { code: "tr", label: "Türkçe (Turkish)" },
          { code: "ur", label: "اردو (Urdu)" },
          { code: "vi", label: "Tiếng Việt (Vietnamese)" },
          { code: "zh", label: "简体中文 (Chinese (Simplified))" },
          { code: "zh-TW", label: "繁體中文 (Chinese (Traditional))" }
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

      // A language counts as user-selected when picked in the widget's language
      // menu (langUserSelected: true). Auto-saves stamp the flag false so they
      // never outrank the embed config or <html lang>. Pre-1.4.0 configs saved
      // lang with no flag at all, and under the old semantics the saved value
      // always won — so a missing flag also counts as user-selected, otherwise
      // upgrading would switch languages on returning visitors.
      getUserSelectedLanguage() {
          try {
            const config = JSON.parse(this.fetchSavedConfig());
            if (config.lang && config.langUserSelected !== false) return config.lang;
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

      // Developer mode needs two keys. The site owner allows it (devTools: true
      // or data-acc-dev-tools on the script tag), and the developer asks for it
      // on this visit (?acc-dev). The URL alone is visitor-controlled, so it
      // must never be enough to load the audit engine on someone's site.
      isDevToolsAllowed() {
          const value = this.options?.devTools;
          if (value === true) return true;
          return typeof value === 'string' && value.trim().toLowerCase() === 'true';
        },

      isDevToolsRequested() {
          if (typeof window === 'undefined') return false;
          try {
            const urlParams = new URLSearchParams(window.location.search);
            if (!urlParams.has('acc-dev')) return false;
            return urlParams.get('acc-dev').trim().toLowerCase() !== 'false';
          } catch {
            return false;
          }
        },

      isDevMode() {
          return this.isDevToolsAllowed() && this.isDevToolsRequested();
        },

      getDataAttributeOptions() {
          const options = {};
          if (typeof document === 'undefined') return options;
      
          const attributes = ['lang', 'position', 'offset', 'size', 'icon', 'nonce', 'hide-button', 'dev-tools'];
      
          const assignValue = (key, value) => {
            if (value === null || typeof value === 'undefined') return;
            // data-acc-dev-tools works as a bare attribute, so '' means on.
            if (value === '' && key !== 'dev-tools') return;
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
              case 'nonce': {
                const nonce = String(value).trim();
                if (nonce) options.nonce = nonce;
                break;
              }
              case 'hide-button': {
                options.hideButton = String(value).trim().toLowerCase() !== 'false';
                break;
              }
              case 'dev-tools': {
                options.devTools = String(value).trim().toLowerCase() !== 'false';
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
          document.querySelectorAll('script[data-acc-lang],script[data-acc-position],script[data-acc-offset],script[data-acc-size],script[data-acc-icon],script[data-acc-nonce],script[data-acc-hide-button],script[data-acc-dev-tools]').forEach(script => {
            if (!scriptCandidates.includes(script)) {
              scriptCandidates.push(script);
            }
          });
          scriptCandidates.forEach(inspectElement);
      
          attributes.forEach(key => {
            // The dev tools key only counts on a script tag, never on page markup.
            if (key === 'dev-tools') return;
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
          let parts;
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

    var menuCSS = "/* Base styles */\n.acc-menu {\n  position: fixed;\n  left: var(--acc-menu-inline-gap, 12px);\n  top: var(--acc-menu-block-gap, 12px);\n  bottom: var(--acc-menu-block-gap, 12px);\n  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);\n  opacity: 1;\n  transition: 0.3s;\n  z-index: var(--acc-widget-z-index, 100000);\n  overflow: hidden;\n  /* The primary color shows through the content margins, framing the body\n     like a gate: header across the top, posts down both sides. It goes a\n     little darker toward the bottom. The shade is laid over the colour,\n     so it follows any theme, and the lightest point is the primary\n     colour itself, so the title and the footer links read as well as\n     before or better. The header and footer are see-through to show it\n     as one run. */\n  background: var(--acc-primary-color);\n  background-image: linear-gradient(180deg, rgba(0, 0, 0, 0) 0, rgba(0, 0, 0, 0.16) calc(var(--acc-menu-header-height) + 1.75rem), rgba(0, 0, 0, 0.16) 100%);\n  /* Wide enough for three tiles whose longest English labels stay on one\n     line. */\n  width: min(456px, calc(100vw - (var(--acc-menu-inline-gap, 12px) * 2)));\n  display: flex;\n  flex-direction: column;\n  line-height: 1.5;\n  font-size: 16px;\n  height: auto;\n  letter-spacing: 0.015em;\n  word-spacing: normal;\n  color: var(--acc-text-color);\n  --acc-content-inline-padding: 20px;\n  /* Theme headerHeight, capped on small screens by the media queries. */\n  --acc-menu-header-height: var(--acc-header-height);\n  --acc-menu-inline-gap: 8px;\n  /* Text sizes. Title 17; rows and buttons 15; tile labels and small\n     print 13. The search field stays 16 so phones do not zoom in on it,\n     and the Reset count is 12.\n     Two weights. Semibold (600): the title and the name of anything you\n     press. Regular (400): everything else, including values, notes and\n     the choices in a list, picked or not. */\n  /* One hover look for the whole menu: a grey fill, mixed from the\n     theme's hover colour. It is a step darker than the panel background,\n     so a hovered white tile stands out from both the white it was and\n     the grey around it. Grey tiles that sit on a white card go darker\n     still. */\n  --acc-hover-tint: #e7eaee;\n  --acc-hover-tint-strong: #dfe3e8;\n  --acc-menu-block-gap: var(--acc-menu-inline-gap);\n  border-radius: 1.75rem;\n  box-shadow: 0 18px 42px rgba(0, 0, 0, 0.2);\n  /* Clear notches and the home indicator when the host page opts into\n     edge-to-edge layout (viewport-fit=cover); env() is 0 everywhere else. */\n  margin: env(safe-area-inset-top, 0px) env(safe-area-inset-right, 0px) env(safe-area-inset-bottom, 0px) env(safe-area-inset-left, 0px);\n}\n\n/* Dragging the panel's fixed chrome must not scroll the page behind it.\n   Scrolling areas (options, language list) are deliberately left out so\n   they keep panning; pinch-zoom stays available everywhere. */\n.acc-menu-header,\n.acc-footer {\n  touch-action: pinch-zoom;\n}\n\n/* The dialog receives programmatic focus on open (tabindex=\"-1\", never\n   Tab-reachable); a focus ring around the whole panel would be noise. */\n.acc-menu:focus {\n  outline: none;\n}\n\n/* Ensure all elements inherit proper colors for accessibility */\n.acc-menu * {\n  color: var(--acc-text-color);\n  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;\n  padding: 0;\n  margin: 0;\n  line-height: 1.5 !important;\n  letter-spacing: normal !important;\n  /* Letter Spacing widens the gaps between words on the page; the menu\n     keeps its own. */\n  word-spacing: normal !important;\n}\n\n/* The menu's own font, once it is registered (see ensureMenuFontLoaded).\n   Its name is the widget's own, so it cannot clash with a font of the\n   same family on the host page. */\n.acc-menu.acc-menu-inter * {\n  font-family: \"AccessibleWeb Inter\", -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;\n}\n\n/* Header section */\n.acc-menu-header {\n  flex-shrink: 0;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 0 var(--acc-content-inline-padding);\n  height: var(--acc-menu-header-height);\n  font-weight: 600 !important;\n  background-color: transparent !important;\n}\n\n.acc-menu-title {\n  display: flex;\n  align-items: center;\n  min-width: 0;\n  font-size: 17px !important;\n  color: var(--acc-text-color-inverted) !important;\n  font-weight: 600;\n}\n\n.acc-menu-title .acc-label {\n  color: var(--acc-text-color-inverted) !important;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.acc-menu-close,\n.acc-menu-more {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 36px;\n  height: 36px;\n  padding: 0;\n  border: none;\n  border-radius: 50%;\n  background: transparent;\n  cursor: pointer;\n  transition: background-color 0.2s ease;\n}\n\n@media (hover: hover) {\n  .acc-menu-close:hover,\n  .acc-menu-more:hover {\n    background-color: rgba(255, 255, 255, 0.18);\n  }\n}\n\n.acc-menu-more[aria-expanded=\"true\"] {\n  background-color: rgba(255, 255, 255, 0.24);\n}\n\n.acc-menu-close:focus-visible,\n.acc-menu-more:focus-visible {\n  outline: 2px solid var(--acc-text-color-inverted);\n  outline-offset: 1px;\n}\n\n.acc-menu-header .acc-menu-close svg,\n.acc-menu-header .acc-menu-more svg {\n  fill: var(--acc-text-color-inverted) !important;\n  width: 24px !important;\n  height: 24px !important;\n  min-width: 24px !important;\n  min-height: 24px !important;\n  max-width: 24px !important;\n  max-height: 24px !important;\n}\n\n.acc-header-back {\n  display: flex;\n  align-items: center;\n}\n\n.acc-back-btn {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  background: transparent;\n  border: none;\n  padding: 8px;\n  cursor: pointer;\n  font-size: 16px;\n  font-weight: 600;\n  color: var(--acc-text-color-inverted) !important;\n  transition: background-color 0.2s ease;\n  border-radius: 4px;\n  visibility: hidden;\n}\n\n.acc-back-btn > span {\n  color: var(--acc-text-color-inverted) !important;\n}\n\n.acc-back-btn.visible {\n  visibility: visible;\n}\n\n.acc-back-btn:hover {\n  background-color: rgba(255, 255, 255, 0.18);\n}\n\n.acc-back-btn:focus {\n  outline: 2px solid var(--acc-text-color-inverted);\n  outline-offset: 1px;\n}\n\n.acc-back-btn svg {\n  fill: var(--acc-text-color-inverted) !important;\n  width: 24px !important;\n  height: 24px !important;\n}\n\n.acc-menu-header svg {\n  fill: var(--acc-text-color-inverted) !important;\n  width: 28px !important;\n  height: 28px !important;\n  min-width: 28px !important;\n  min-height: 28px !important;\n  max-width: 28px !important;\n  max-height: 28px !important;\n}\n\n.acc-menu-header > div {\n  display: flex;\n  align-items: center;\n}\n\n/* Interactive elements */\n.acc-menu-header div[role=\"button\"] {\n  cursor: pointer;\n  padding: 8px;\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 36px;\n  height: 36px;\n  transition: background-color 0.2s ease;\n}\n\n.acc-menu-header div[role=\"button\"]:hover {\n  background-color: rgba(255, 255, 255, 0.18);\n}\n\n.acc-menu-header div[role=\"button\"]:focus {\n  outline: 2px solid var(--acc-text-color-inverted);\n  outline-offset: 1px;\n}\n\n.acc-language-container {\n  margin: 0 var(--acc-content-inline-padding) 24px;\n}\n\n.acc-lang-details {\n  border: 1px solid rgba(0, 0, 0, 0.1);\n  border-radius: var(--acc-button-border-radius);\n  background: var(--acc-card-bg);\n}\n\n.acc-lang-summary {\n  list-style: none;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 12px;\n  padding: 12px 14px;\n  cursor: pointer;\n  border-radius: var(--acc-button-border-radius);\n}\n\n.acc-lang-summary::-webkit-details-marker {\n  display: none;\n}\n\n.acc-lang-summary::marker {\n  content: '';\n}\n\n.acc-lang-summary-main {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  min-width: 0;\n}\n\n.acc-lang-current-label {\n  font-size: 16px !important;\n  font-weight: 600 !important;\n}\n\n.acc-lang-summary:hover {\n  background-color: rgba(0, 114, 228, 0.06);\n}\n\n.acc-lang-summary:focus {\n  outline: var(--acc-focus-outline-width) solid var(--acc-focus-ring-color);\n  outline-offset: var(--acc-focus-outline-offset);\n}\n\n.acc-lang-summary-arrow {\n  width: 10px;\n  height: 10px;\n  border-right: 2px solid var(--acc-text-color);\n  border-bottom: 2px solid var(--acc-text-color);\n  transform: rotate(-45deg);\n  transition: transform 0.2s ease;\n}\n\n.acc-lang-details[open] .acc-lang-summary-arrow {\n  transform: rotate(45deg);\n}\n\n.acc-lang-details[open] .acc-lang-summary {\n  border-bottom: 1px solid var(--acc-border-color);\n  border-bottom-left-radius: 0;\n  border-bottom-right-radius: 0;\n}\n\n.acc-lang-details-panel {\n  padding: 12px 0 8px;\n}\n\n.acc-lang-details-panel .acc-section-title {\n  font-size: 16px !important;\n  padding: 0 16px 10px;\n}\n\n.acc-lang-flag {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  min-width: 22px;\n  font-size: 18px !important;\n  line-height: 1;\n}\n\n.acc-lang-search-wrapper {\n  padding: 4px 12px 8px;\n}\n\n/* A soft field with a magnifier, shaped like the Reset button. */\n.acc-lang-search {\n  width: 100%;\n  height: 48px;\n  padding-block: 0;\n  padding-inline: 44px 16px;\n  border: 0;\n  border-radius: 16px;\n  font-size: 16px;\n  background-color: var(--acc-bg-color);\n  background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%235b6472' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='7'/%3E%3Cpath d='M20 20l-4-4'/%3E%3C/svg%3E\");\n  background-repeat: no-repeat;\n  background-position: left 14px center;\n  background-size: 18px;\n}\n\n.acc-menu[dir=\"rtl\"] .acc-lang-search {\n  background-position: right 14px center;\n}\n\n/* The field is focused as soon as the panel opens, so its focus look is\n   a quiet grey line, not the blue ring used for keyboard focus elsewhere. */\n.acc-lang-search:focus {\n  outline: 1.5px solid #7c8594;\n  outline-offset: -1.5px;\n  background-color: var(--acc-card-bg);\n}\n\n.acc-lang-list {\n  padding: 6px 8px 12px;\n  max-height: 280px;\n  overflow-y: auto;\n  overscroll-behavior: contain;\n}\n\n.acc-lang-item {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 8px;\n  width: 100%;\n  text-align: left;\n  min-height: 48px;\n  padding: 10px 12px;\n  margin-bottom: 2px;\n  background-color: transparent;\n  border: none;\n  border-radius: 14px;\n  cursor: pointer;\n  font-size: 15px;\n  color: var(--acc-text-color);\n  transition: background-color 0.12s ease;\n}\n\n@media (hover: hover) {\n  .acc-lang-item:hover {\n    background-color: var(--acc-hover-tint);\n  }\n}\n\n.acc-lang-item:focus-visible {\n  outline: var(--acc-focus-outline-width) solid var(--acc-focus-ring-color);\n  outline-offset: var(--acc-focus-outline-offset);\n}\n\n/* A picked language keeps its weight: the tint and the check mark show\n   it, and the words do not shift. */\n.acc-lang-item.selected {\n  background-color: rgba(0, 114, 228, 0.08);\n}\n\n.acc-lang-item-main {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  min-width: 0;\n}\n\n.acc-lang-item-label {\n  font-size: 15px !important;\n  line-height: 1.4 !important;\n}\n\n/* The country reads as a quiet note after the language's name. */\n.acc-lang-item-region {\n  margin-inline-start: 4px;\n  font-size: 13px !important;\n  font-weight: 400 !important;\n  color: #5b6472 !important;\n}\n\n.acc-icon-check {\n  display: inline-block;\n  flex-shrink: 0;\n  width: 18px;\n  height: 18px;\n  background-color: var(--acc-primary-color);\n  -webkit-mask: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12'%3E%3C/polyline%3E%3C/svg%3E\") center / contain no-repeat;\n  mask: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12'%3E%3C/polyline%3E%3C/svg%3E\") center / contain no-repeat;\n  opacity: 0;\n  transition: opacity 0.15s ease;\n}\n\n.acc-lang-item.selected .acc-icon-check {\n  opacity: 1;\n}\n\n.acc-menu .acc-lang-select {\n  width: 100% !important;\n  padding: 0 16px !important;\n  font-size: 16px !important;\n  font-family: inherit !important;\n  font-weight: 600 !important;\n  border-radius: var(--acc-button-border-radius) !important;\n  background: var(--acc-card-bg) !important;\n  border: 1.5px solid var(--acc-border-color) !important;\n  min-height: 48px !important;\n  max-height: 48px !important;\n  height: 48px !important;\n  color: var(--acc-text-color) !important;\n  -webkit-appearance: none !important;\n  -moz-appearance: none !important;\n  appearance: none !important;\n  background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0%20-960%20960%20960' width='24px' fill='%231f1f1f'%3E%3Cpath d='M480-344%20240-584l56-56%20184 184%20184-184%2056 56-240 240Z'/%3E%3C/svg%3E\") !important;\n  background-repeat: no-repeat !important;\n  background-position: right 12px center !important;\n  background-size: 20px !important;\n  padding-right: 44px !important;\n}\n\n/* Hide default arrows in Firefox and IE */\n.acc-menu .acc-lang-select::-ms-expand {\n  display: none !important;\n}\n\n.acc-menu .acc-lang-select:focus {\n  outline: var(--acc-focus-outline-width) solid var(--acc-focus-ring-color);\n  outline-offset: var(--acc-focus-outline-offset);\n  border-color: var(--acc-primary-color) !important;\n}\n\n/* Options: the Language and Profiles card, then one grid of tiles. */\n.acc-options-all {\n  display: flex;\n  flex-direction: column;\n  gap: 20px;\n  padding: 0 var(--acc-content-inline-padding);\n  /* The scrollbar, where the system always shows one, sits in the end\n     margin; see syncScrollbarGutter. */\n  padding-inline-end: max(4px, calc(var(--acc-content-inline-padding) - var(--acc-scrollbar-gutter, 0px)));\n}\n\n.acc-card {\n  overflow: hidden;\n  border-radius: 22px;\n  background: var(--acc-card-bg);\n  box-shadow: 0 1px 2px rgba(31, 41, 51, 0.06);\n}\n\n.acc-card-row {\n  position: relative;\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  width: 100%;\n  min-height: 56px;\n  padding: 0 16px;\n  border: none;\n  background: transparent;\n  text-align: start;\n  cursor: pointer;\n  transition: background-color 0.2s ease;\n}\n\n/* Inset divider between the two rows. */\n.acc-profiles-row::before {\n  content: \"\";\n  position: absolute;\n  top: 0;\n  inset-inline: 16px;\n  height: 1px;\n  background: var(--acc-border-color);\n}\n\n@media (hover: hover) {\n  .acc-card-row:hover {\n    background-color: var(--acc-hover-tint);\n  }\n}\n\n/* The card clips its children, so the ring sits inside the row, rounded\n   to clear the card's corners. */\n.acc-card-row:focus-visible {\n  border-radius: 22px;\n  outline: var(--acc-focus-outline-width) solid var(--acc-focus-ring-color);\n  outline-offset: calc(-1 * var(--acc-focus-outline-width) - 3px);\n}\n\n.acc-card-row-icon {\n  display: inline-flex;\n  flex-shrink: 0;\n}\n\n.acc-card-row-icon svg {\n  width: 26px;\n  height: 26px;\n  fill: var(--acc-text-color);\n}\n\n.acc-card-row .acc-card-row-label {\n  flex: 1 1 auto;\n  min-width: 0;\n  font-size: 15px !important;\n  font-weight: 600 !important;\n}\n\n.acc-card-row .acc-card-row-value {\n  flex: 0 1 auto;\n  min-width: 0;\n  max-width: 50%;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  font-size: 15px !important;\n  color: #5b6472 !important;\n}\n\n.acc-card-row .acc-profiles-summary {\n  font-weight: 400 !important;\n  color: var(--acc-primary-color) !important;\n}\n\n.acc-card-row-chevron {\n  flex-shrink: 0;\n  width: 8px;\n  height: 8px;\n  margin: 0 4px 3px !important;\n  border-right: 1.5px solid #5b6472;\n  border-bottom: 1.5px solid #5b6472;\n  transform: rotate(45deg);\n  transition: transform 0.2s ease;\n}\n\n.acc-card-row[aria-expanded=\"true\"] .acc-card-row-chevron {\n  margin: 3px 4px 0 !important;\n  transform: rotate(-135deg);\n}\n\n.acc-card-panel[hidden] {\n  display: none;\n}\n\n.acc-lang-panel {\n  padding-bottom: 8px;\n}\n\n/* Five and a half rows show, fading out at the bottom, so it is plain\n   that the list scrolls. The bottom padding lets the last row clear the\n   fade. */\n.acc-lang-panel .acc-lang-list {\n  max-height: 276px;\n  padding: 2px 6px 20px 12px;\n  scrollbar-width: thin;\n  scrollbar-color: #7c8594 transparent;\n  -webkit-mask-image: linear-gradient(to bottom, #000 calc(100% - 28px), transparent);\n  mask-image: linear-gradient(to bottom, #000 calc(100% - 28px), transparent);\n}\n\n.acc-menu[dir=\"rtl\"] .acc-lang-panel .acc-lang-list {\n  padding: 2px 12px 20px 6px;\n}\n\n.acc-profiles-panel {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 8px;\n  padding: 4px 8px 8px;\n}\n\n/* Hidden group headings sit in the grid without taking a cell. */\n.acc-options {\n  position: relative;\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  gap: 8px;\n}\n\n.acc-menu .acc-sr-only {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  margin: -1px;\n  padding: 0;\n  overflow: hidden;\n  clip: rect(0 0 0 0);\n  clip-path: inset(50%);\n  white-space: nowrap;\n  border: 0;\n}\n\n/* Tiles: icon above the label. A transparent border still draws in\n   forced-colors mode, where shadows disappear. */\n.acc-btn {\n  position: relative;\n  /* Wider than tall, and the same height at every width; a tile still\n     grows if a long label wraps. */\n  min-height: 112px;\n  /* The same in every tile, so icons and labels line up along a row.\n     The bottom keeps a strip free for the level dots. */\n  padding: 18px 8px 22px;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n  text-align: center;\n  border-radius: 22px;\n  background: var(--acc-card-bg) !important;\n  border: 1px solid transparent !important;\n  box-shadow: 0 1px 2px rgba(31, 41, 51, 0.06);\n  transition: background-color 0.15s ease, box-shadow 0.2s ease;\n  cursor: pointer;\n  overflow-wrap: anywhere;\n  hyphens: auto;\n}\n\n/* Profile tiles are short rows, icon then name, two by two. Grey so they\n   show on the white card. */\n.acc-btn.acc-profile-tile {\n  min-height: 56px;\n  padding: 8px 12px;\n  flex-direction: row;\n  justify-content: flex-start;\n  gap: 8px;\n  text-align: start;\n  border-radius: 16px;\n  background: var(--acc-bg-color) !important;\n  box-shadow: none;\n}\n\n.acc-btn.acc-profile-tile svg {\n  width: 28px !important;\n  height: 28px !important;\n  min-width: 28px !important;\n  min-height: 28px !important;\n  max-width: 28px !important;\n  max-height: 28px !important;\n}\n\n/* The check sits at the end of the row, level with the name. */\n.acc-btn.acc-profile-tile.acc-selected {\n  padding-inline-end: 36px;\n}\n\n.acc-btn.acc-profile-tile.acc-selected::before {\n  top: calc(50% - 9px);\n  inset-inline-end: 10px;\n}\n\n.acc-btn.acc-profile-tile.acc-selected::after {\n  top: calc(50% - 6px);\n  inset-inline-end: 16px;\n}\n\n/* Inside the white card an on tile would vanish, so it lifts off the card\n   with a hairline and a soft shadow. */\n.acc-btn.acc-profile-tile.acc-selected {\n  background: var(--acc-card-bg) !important;\n  box-shadow: 0 0 0 1px var(--acc-border-color), 0 2px 6px rgba(31, 41, 51, 0.1);\n}\n\n/* Touch screens emulate :hover on tap and keep it until the next tap\n   elsewhere, which left the last-tapped option looking highlighted. */\n@media (hover: hover) {\n  .acc-btn:hover,\n  .acc-btn.acc-selected:hover,\n  .acc-btn.acc-profile-tile.acc-selected:hover {\n    background: var(--acc-hover-tint) !important;\n  }\n\n  .acc-btn.acc-profile-tile:not(.acc-selected):hover {\n    background: var(--acc-hover-tint-strong) !important;\n  }\n}\n\n/* :focus-visible keeps the ring for keyboard users without leaving it\n   stuck on whatever a mouse click or tap last pressed. */\n.acc-btn:focus-visible {\n  outline: var(--acc-focus-outline-width) solid var(--acc-focus-ring-color);\n  outline-offset: var(--acc-focus-outline-offset);\n}\n\n.acc-btn svg {\n  width: 34px !important;\n  height: 34px !important;\n  min-width: 34px !important;\n  min-height: 34px !important;\n  max-width: 34px !important;\n  max-height: 34px !important;\n  flex-shrink: 0;\n  fill: var(--acc-text-color);\n}\n\n.acc-btn .acc-label {\n  font-size: 13px !important;\n  font-weight: 600 !important;\n  line-height: 1.25 !important;\n}\n\n/* Rapid taps (cycling Contrast or Font Size) must not trigger\n   double-tap-to-zoom on pages without a mobile viewport. */\n.acc-btn,\n.acc-menu-close,\n.acc-menu-more,\n.acc-more-item,\n.acc-card-row,\n.acc-action-reset,\n.acc-lang-item {\n  touch-action: manipulation;\n}\n\n/* On: primary icon and label, and a check badge in the inline-end\n   corner. The tile itself stays as it is. */\n.acc-btn.acc-selected {\n  background: var(--acc-card-bg) !important;\n}\n\n.acc-btn.acc-selected svg {\n  fill: var(--acc-primary-color) !important;\n}\n\n.acc-btn.acc-selected .acc-label {\n  color: var(--acc-primary-color) !important;\n}\n\n.acc-btn.acc-selected::before,\n.acc-btn.acc-selected::after {\n  content: \"\";\n  position: absolute;\n  box-sizing: border-box;\n}\n\n.acc-btn.acc-selected::before {\n  top: 9px;\n  inset-inline-end: 9px;\n  width: 18px;\n  height: 18px;\n  border-radius: 50%;\n  background: var(--acc-primary-color);\n}\n\n.acc-btn.acc-selected::after {\n  top: 12px;\n  inset-inline-end: 15px;\n  width: 6px;\n  height: 10px;\n  border: solid var(--acc-text-color-inverted);\n  border-width: 0 2px 2px 0;\n  transform: rotate(45deg);\n}\n\n/* Actions and the credit line */\n.acc-more-panel[hidden],\n.acc-more-list[hidden],\n.acc-hide-panel[hidden] {\n  display: none;\n}\n\n/* The \"more\" button in the header, beside Close. */\n.acc-menu-header-actions {\n  display: flex;\n  align-items: center;\n  gap: 4px;\n  flex-shrink: 0;\n}\n\n/* Move widget and Hide widget drop down from it, over the options. */\n.acc-more-panel {\n  position: absolute;\n  z-index: 3;\n  top: calc(var(--acc-menu-header-height) - 6px);\n  inset-inline-end: 12px;\n  /* As wide as its two lines need; the \"how long\" step sets its own width. */\n  width: max-content;\n  max-width: calc(100% - 24px);\n  box-sizing: border-box;\n  max-height: calc(100% - var(--acc-menu-header-height) - 6px);\n  overflow: auto;\n  padding: 6px;\n  border-radius: 20px;\n  background: var(--acc-card-bg);\n  box-shadow: 0 0 0 1px rgba(31, 41, 51, 0.08), 0 10px 30px rgba(0, 0, 0, 0.22);\n}\n\n.acc-more-list {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n\n.acc-more-item {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  width: 100%;\n  min-height: 48px;\n  padding: 4px 20px 4px 10px;\n  padding-inline: 10px 20px;\n  border: none;\n  border-radius: 14px;\n  background: transparent;\n  text-align: start;\n  cursor: pointer;\n}\n\n.acc-more-item svg {\n  flex-shrink: 0;\n  width: 24px !important;\n  height: 24px !important;\n  fill: var(--acc-text-color) !important;\n}\n\n.acc-more-item .acc-label {\n  flex: 1 1 auto;\n  min-width: 0;\n  font-size: 15px !important;\n  font-weight: 600 !important;\n}\n\n@media (hover: hover) {\n  .acc-more-item:hover,\n  .acc-hide-choice:not([aria-checked=\"true\"]):hover {\n    background-color: var(--acc-hover-tint);\n  }\n}\n\n.acc-more-item:focus-visible {\n  outline: var(--acc-focus-outline-width) solid var(--acc-focus-ring-color);\n  outline-offset: -2px;\n}\n\n/* Hide widget, already hidden: shown as on. Clicking brings the button back. */\n.acc-more-hide[aria-pressed=\"true\"] svg {\n  fill: var(--acc-primary-color) !important;\n}\n\n.acc-more-hide[aria-pressed=\"true\"] .acc-label {\n  color: var(--acc-primary-color) !important;\n}\n\n/* The step after Hide widget: for how long. It takes the list's place\n   inside the drop-down. */\n.acc-hide-panel {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  box-sizing: border-box;\n  width: 292px;\n  max-width: 100%;\n  padding: 10px;\n}\n\n.acc-hide-title {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n}\n\n.acc-hide-title svg {\n  flex-shrink: 0;\n  width: 24px !important;\n  height: 24px !important;\n  fill: var(--acc-text-color) !important;\n}\n\n.acc-hide-title .acc-label {\n  font-size: 15px !important;\n  font-weight: 600 !important;\n}\n\n.acc-hide-choices {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n\n.acc-hide-choice {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  width: 100%;\n  min-height: 44px;\n  padding: 4px 10px;\n  border: none;\n  border-radius: 12px;\n  background: transparent;\n  text-align: start;\n  cursor: pointer;\n}\n\n.acc-hide-choice[aria-checked=\"true\"] {\n  background: var(--acc-bg-color);\n}\n\n.acc-hide-radio {\n  flex-shrink: 0;\n  box-sizing: border-box;\n  width: 20px;\n  height: 20px;\n  border: 1.5px solid #7c8594;\n  border-radius: 50%;\n  background: var(--acc-card-bg);\n}\n\n.acc-hide-choice[aria-checked=\"true\"] .acc-hide-radio {\n  border: 6px solid var(--acc-primary-color);\n}\n\n.acc-hide-choice .acc-label {\n  font-size: 15px !important;\n  font-weight: 400 !important;\n}\n\n\n/* Shown before an \"Always\" hide: how to get the widget back. */\n.acc-hide-warning {\n  margin: 0;\n  padding: 12px;\n  border-radius: 12px;\n  background: var(--acc-bg-color);\n  font-size: 15px !important;\n  font-weight: 400 !important;\n  line-height: 1.4 !important;\n}\n\n.acc-hide-warning[hidden],\n.acc-hide-choices[hidden] {\n  display: none;\n}\n\n/* The way back, said before any choice is made. It leaves with the\n   choices when the \"Always\" warning takes their place. */\n.acc-hide-note {\n  margin: 0;\n  padding: 0 12px;\n  font-size: 14px !important;\n  font-weight: 400 !important;\n  line-height: 1.4 !important;\n}\n\n.acc-hide-choices[hidden] + .acc-hide-note {\n  display: none;\n}\n\n.acc-hide-buttons {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 8px;\n}\n\n.acc-hide-cancel,\n.acc-hide-confirm {\n  min-height: 48px;\n  padding: 6px 12px;\n  border: none;\n  border-radius: 24px;\n  background: var(--acc-bg-color);\n  cursor: pointer;\n}\n\n.acc-hide-confirm {\n  background: var(--acc-primary-color);\n}\n\n.acc-hide-cancel .acc-label,\n.acc-hide-confirm .acc-label {\n  font-size: 15px !important;\n  font-weight: 600 !important;\n}\n\n.acc-hide-confirm .acc-label {\n  color: var(--acc-text-color-inverted) !important;\n}\n\n.acc-hide-choice:focus-visible,\n.acc-hide-cancel:focus-visible,\n.acc-hide-confirm:focus-visible {\n  outline: var(--acc-focus-outline-width) solid var(--acc-focus-ring-color);\n  outline-offset: var(--acc-focus-outline-offset);\n}\n\n/* Reset: one wide button between the card and the tiles. */\n.acc-actions {\n  display: grid;\n  grid-auto-flow: column;\n  grid-auto-columns: minmax(0, 1fr);\n  gap: 8px;\n}\n\n.acc-action-reset {\n  display: flex;\n  min-width: 0;\n  min-height: 48px;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n  /* Room on both sides for the count, which hangs off the end of the\n     label, so the icon and label stay centred when it appears. */\n  padding: 6px 42px;\n  border: 1px solid transparent;\n  border-radius: 24px;\n  /* A pale tint of the primary colour (set below, where the browser can\n     mix colours; white otherwise). */\n  background-color: var(--acc-card-bg) !important;\n  box-shadow: 0 1px 2px rgba(31, 41, 51, 0.06);\n  cursor: pointer;\n  transition: background-color 0.15s ease;\n}\n\n.acc-action-reset svg {\n  flex-shrink: 0;\n  width: 22px !important;\n  height: 22px !important;\n  fill: var(--acc-text-color) !important;\n}\n\n.acc-action-reset .acc-reset-text {\n  position: relative;\n  display: flex;\n  min-width: 0;\n  align-items: center;\n}\n\n/* Long translations wrap to a second line on narrow phones. */\n.acc-action-reset .acc-label {\n  min-width: 0;\n  text-align: center;\n  font-size: 15px !important;\n  font-weight: 600 !important;\n  line-height: 1.2 !important;\n}\n\n/* How many options are on. Out of the flow, so the label does not shift\n   when it appears. */\n.acc-action-reset .acc-reset-count {\n  position: absolute;\n  inset-block-start: 50%;\n  inset-inline-start: calc(100% + 8px);\n  transform: translateY(-50%);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  min-width: 22px;\n  height: 22px;\n  padding: 0 6px;\n  border-radius: 11px;\n  background: var(--acc-text-color);\n  color: var(--acc-text-color-inverted) !important;\n  flex-shrink: 0;\n  font-size: 12px !important;\n  font-weight: 600 !important;\n  line-height: 1 !important;\n}\n\n.acc-action-reset .acc-reset-count[hidden] {\n  display: none;\n}\n\n/* Nothing to reset: subdued, though still readable. */\n.acc-action-reset:disabled {\n  cursor: default;\n}\n\n.acc-action-reset:disabled svg {\n  fill: #5b6472 !important;\n}\n\n.acc-action-reset:disabled .acc-label {\n  color: #5b6472 !important;\n}\n\n@media (hover: hover) {\n  .acc-action-reset:not(:disabled):hover {\n    background-color: var(--acc-hover-tint) !important;\n  }\n}\n\n@supports (color: color-mix(in srgb, red 50%, transparent)) {\n  .acc-action-reset {\n    background-color: color-mix(in srgb, var(--acc-primary-color) 12%, var(--acc-card-bg)) !important;\n  }\n\n  @media (hover: hover) {\n    .acc-action-reset:not(:disabled):hover {\n      background-color: color-mix(in srgb, var(--acc-primary-color) 22%, var(--acc-card-bg)) !important;\n    }\n  }\n}\n\n.acc-action-reset:focus-visible {\n  outline: var(--acc-focus-outline-width) solid var(--acc-focus-ring-color);\n  outline-offset: var(--acc-focus-outline-offset);\n}\n\n/* Footer bar: the project's name, and its statement on what a widget\n   can and cannot do for a site. It takes the header's colour, so the\n   options read as a sheet lying between the two. */\n.acc-footer {\n  flex-shrink: 0;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 12px;\n  position: relative;\n  padding: 4px calc(var(--acc-content-inline-padding) + 6px);\n  background: var(--acc-bg-color);\n}\n\n/* A faint line above the footer, as wide as the tiles: it stops short\n   of the panel's edges. */\n.acc-footer::before {\n  content: \"\";\n  position: absolute;\n  inset-block-start: 0;\n  inset-inline: var(--acc-content-inline-padding);\n  height: 1px;\n  background: rgba(31, 41, 51, 0.1);\n}\n\n.acc-footer-brand,\n.acc-footer-statement {\n  padding: 4px 0;\n  font-size: 13px !important;\n  line-height: 1.2 !important;\n  text-decoration: none;\n}\n\n.acc-footer-brand {\n  font-weight: 600 !important;\n  color: var(--acc-text-color) !important;\n}\n\n.acc-footer-statement {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n}\n\n.acc-footer-statement .acc-label {\n  font-size: 13px !important;\n  font-weight: 600 !important;\n  line-height: 1.2 !important;\n  color: var(--acc-text-color) !important;\n}\n\n/* Arrow after the link; it points the other way in right-to-left. */\n.acc-footer-statement::after {\n  content: \"\";\n  flex-shrink: 0;\n  width: 6px;\n  height: 6px;\n  border-top: 1.5px solid var(--acc-text-color);\n  border-inline-end: 1.5px solid var(--acc-text-color);\n  transform: rotate(45deg);\n}\n\n.acc-menu[dir=\"rtl\"] .acc-footer-statement::after {\n  transform: rotate(-45deg);\n}\n\n@media (hover: hover) {\n  .acc-footer-brand:hover,\n  .acc-footer-statement:hover .acc-label {\n    text-decoration: underline;\n  }\n}\n\n.acc-footer-brand:focus-visible,\n.acc-footer-statement:focus-visible {\n  outline: 2px solid var(--acc-focus-ring-color);\n  outline-offset: 2px;\n  border-radius: 4px;\n}\n\n/* Content area */\n/* The sheet holds the rounded top corners and the shadow; the scrolling\n   area sits inside it. A scrolling box does not always round its own\n   corner where its scrollbar is, so the sheet does the clipping. */\n.acc-menu-sheet {\n  flex: 1 1 auto;\n  min-height: 0;\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n  isolation: isolate;\n  border-top-left-radius: 1.75rem;\n  border-top-right-radius: 1.75rem;\n  background: var(--acc-bg-color);\n}\n\n.acc-menu-content {\n  flex: 1 1 auto;\n  min-height: 0;\n  overflow: auto;\n  /* Reaching the end of the options must not hand the scroll (wheel or\n     touch) to the page behind the panel. */\n  overscroll-behavior: contain;\n  /* Thin and quiet, with no track, where the system always shows\n     scrollbars. Its room is kept even when nothing scrolls, so opening\n     Language does not shift the options sideways. */\n  scrollbar-width: thin;\n  scrollbar-color: #7c8594 transparent;\n  scrollbar-gutter: stable;\n  padding: var(--acc-content-inline-padding) 0;\n}\n\n/* An always-visible scrollbar (see syncScrollbarGutter), where the\n   browser lets it be shaped: a rounded bar that starts below the sheet's\n   rounded corner instead of being cut by it. The standard properties\n   have to be switched off for these rules to apply. Other browsers keep\n   the thin standard bar. */\n@supports selector(::-webkit-scrollbar) {\n  .acc-menu.acc-classic-scrollbar .acc-menu-content {\n    scrollbar-width: auto;\n    scrollbar-color: auto;\n  }\n\n  .acc-menu.acc-classic-scrollbar .acc-menu-content::-webkit-scrollbar {\n    width: 11px;\n  }\n\n  .acc-menu.acc-classic-scrollbar .acc-menu-content::-webkit-scrollbar-track {\n    margin-top: 20px;\n    margin-bottom: 8px;\n    background: transparent;\n  }\n\n  .acc-menu.acc-classic-scrollbar .acc-menu-content::-webkit-scrollbar-thumb {\n    border: 2px solid transparent;\n    border-radius: 6px;\n    background: #7c8594;\n    background-clip: padding-box;\n  }\n}\n\n/* Browsers without the standard scrollbar properties. */\n@supports not (scrollbar-width: thin) {\n  .acc-menu-content::-webkit-scrollbar,\n  .acc-lang-panel .acc-lang-list::-webkit-scrollbar {\n    width: 11px;\n  }\n\n  .acc-menu-content::-webkit-scrollbar-track,\n  .acc-lang-panel .acc-lang-list::-webkit-scrollbar-track {\n    background: transparent;\n  }\n\n  .acc-menu-content::-webkit-scrollbar-track {\n    margin-top: 20px;\n    margin-bottom: 8px;\n  }\n\n  .acc-menu-content::-webkit-scrollbar-thumb,\n  .acc-lang-panel .acc-lang-list::-webkit-scrollbar-thumb {\n    border: 3px solid transparent;\n    border-radius: 6px;\n    background: #7c8594;\n    background-clip: padding-box;\n  }\n}\n\n/* Text adjustments */\n.acc-text-adjust {\n  background: var(--acc-card-bg);\n  padding: 18px 20px;\n  margin-bottom: 20px;\n  border-radius: var(--acc-border-radius);\n  border: 1px solid rgba(0, 0, 0, 0.1);\n}\n\n.acc-text-adjust .acc-label {\n  display: flex;\n  justify-content: flex-start;\n}\n\n.acc-text-adjust > div {\n  display: flex;\n  justify-content: space-between;\n  margin-top: 20px;\n  align-items: center;\n  font-size: 16px;\n}\n\n.acc-text-adjust .acc-label div {\n  font-size: 16px !important;\n}\n\n.acc-text-adjust div[role=\"button\"] {\n  background: var(--acc-bg-color) !important;\n  border-radius: 50%;\n  width: 40px;\n  height: 40px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  border: 1px solid rgba(0, 0, 0, 0.1);\n  transition: border-color 0.2s ease;\n}\n\n.acc-text-adjust div[role=\"button\"]:hover {\n  border-color: var(--acc-primary-color);\n}\n\n.acc-text-adjust div[role=\"button\"]:focus {\n  outline: var(--acc-focus-outline-width) solid var(--acc-focus-ring-color);\n  outline-offset: var(--acc-focus-outline-offset);\n}\n\n/* Overlay */\n.acc-overlay {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  z-index: calc(var(--acc-widget-z-index, 100000) - 1);\n}\n\n/* Level dots of a cycling tile. They sit in the strip at the bottom of\n   the tile, out of the flow, so a tile with dots lays out its icon and\n   label exactly like a tile without. */\n.acc-progress-indicator {\n  position: absolute;\n  inset-inline: 0;\n  bottom: 10px;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  gap: 4px;\n  height: 6px;\n}\n\n.acc-progress-dot {\n  width: 6px;\n  height: 6px;\n  border-radius: 50%;\n  background-color: var(--acc-border-color);\n  transition: background-color 0.2s ease;\n}\n\n.acc-progress-dot.active {\n  background-color: var(--acc-primary-color);\n}\n\n@supports (color: color-mix(in srgb, red 50%, transparent)) {\n  .acc-menu {\n    --acc-hover-tint: color-mix(in srgb, var(--acc-hover-color) 40%, var(--acc-card-bg));\n    --acc-hover-tint-strong: color-mix(in srgb, var(--acc-hover-color) 54%, var(--acc-card-bg));\n  }\n\n  .acc-btn.acc-selected .acc-progress-dot:not(.active) {\n    background-color: color-mix(in srgb, var(--acc-primary-color) 25%, var(--acc-card-bg));\n  }\n}\n\n/* Responsive adjustments */\n@media only screen and (max-width: 560px) {\n  /* Span the viewport between equal gaps. Anchoring both edges (rather\n     than 100vw math) stays centered beside a classic scrollbar and lets\n     the safe-area margins shrink the panel. !important beats the inline\n     dock side set from JS. */\n  .acc-menu {\n    left: var(--acc-menu-inline-gap) !important;\n    right: var(--acc-menu-inline-gap) !important;\n    width: auto;\n  }\n}\n\n/* Phones: tighter spacing leaves more room to show options. */\n@media only screen and (max-width: 480px) {\n  .acc-menu {\n    --acc-content-inline-padding: 16px;\n    --acc-menu-header-height: min(var(--acc-header-height), 56px);\n  }\n\n  .acc-options-all {\n    gap: 16px;\n  }\n\n}\n\n/* Three tiles no longer fit below a ~380px panel (the viewport minus the\n   8px gaps); long labels in some languages need the width. */\n/* Below this width three tiles would be too narrow for the longer labels\n   to stay on one line, so the grid drops to two per row. */\n@media only screen and (max-width: 449px) {\n  /* A narrow panel: tighter, so long translations fit. */\n  .acc-action-reset {\n    gap: 6px;\n    padding: 6px 32px;\n  }\n\n  .acc-action-reset .acc-reset-count {\n    inset-inline-start: calc(100% + 5px);\n  }\n\n  .acc-action-reset .acc-label {\n    overflow-wrap: anywhere;\n  }\n\n  .acc-options {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n\n  /* One profile per row, so the names stay on one line. */\n  .acc-profiles-panel {\n    grid-template-columns: minmax(0, 1fr);\n  }\n}\n\n/* The very smallest phones: long translations of Reset stay on one line. */\n@media only screen and (max-width: 359px) {\n  .acc-action-reset .acc-label {\n    font-size: 13px !important;\n  }\n}\n\n/* The title wraps to two lines (longer translations too) rather than\n   truncating beside the header controls. */\n@media only screen and (max-width: 380px) {\n  .acc-menu-title {\n    font-size: 16px !important;\n  }\n\n  .acc-menu .acc-menu-title .acc-label {\n    display: -webkit-box;\n    -webkit-box-orient: vertical;\n    -webkit-line-clamp: 2;\n    white-space: normal;\n    line-height: 1.2 !important;\n  }\n}\n\n/* Touch input: grow the small controls toward a 44px target. */\n@media (pointer: coarse) {\n  .acc-menu-close,\n  .acc-menu-more {\n    width: 44px;\n    height: 44px;\n  }\n\n  .acc-footer {\n    padding-block: 4px;\n  }\n\n  .acc-footer-brand,\n  .acc-footer-statement {\n    padding: 10px 0;\n  }\n}\n\n/* Landscape phones: the header and footer took over half of a ~340px\n   tall panel, leaving a sliver for the options. This comes after the\n   touch rules so its thinner footer wins there. */\n@media only screen and (max-height: 500px) {\n  .acc-menu {\n    --acc-menu-header-height: min(var(--acc-header-height), 48px);\n  }\n\n  .acc-menu-content {\n    padding: 12px 0 16px;\n  }\n\n  .acc-action-reset {\n    min-height: 44px;\n  }\n\n  .acc-footer {\n    padding-block: 2px;\n  }\n}\n\n/* Ensure proper focus visibility for assistive technology */\n@media (prefers-reduced-motion: reduce) {\n  .acc-menu,\n  .acc-btn,\n  .acc-lang-select,\n  .acc-progress-dot,\n  .acc-menu-header div[role=\"button\"],\n  .acc-lang-toggle,\n  .acc-back-btn,\n  .acc-menu-close,\n  .acc-action-reset,\n  .acc-card-row,\n  .acc-card-row-chevron,\n  .acc-text-adjust div[role=\"button\"] {\n    transition: none;\n  }\n}\n";

    var widgetCSS = "  /* Base styles for the widget */\n  .acc-widget, .acc-menu {\n    -webkit-user-select: none;\n    -moz-user-select: none;\n    -ms-user-select: none;\n    user-select: none;\n    font-weight: 400;\n    -webkit-font-smoothing: antialiased;\n  }\n  \n  .acc-widget *, .acc-menu * { \n    box-sizing: border-box !important; \n  }\n  \n  /* Accessibility toggle button */\n  /* Hidden by the visitor for this visit. */\n  .acc-toggle-btn[hidden] {\n    display: none !important;\n  }\n\n  .acc-toggle-btn {\n    position: fixed;\n    z-index: var(--acc-widget-z-index, 100000);\n    left: 30px;\n    bottom: 30px;\n    border-radius: 50%;\n    align-items: center;\n    justify-content: center;\n    width: var(--acc-button-size, 48px);\n    height: var(--acc-button-size, 48px);\n    display: flex;\n    cursor: pointer;\n    outline: none !important;\n    border: none !important;\n    box-shadow: inset 0 0 0 4px var(--acc-primary-color, #0072e4), inset 0 0 0 6px white, 0 2px 5px rgba(0,0,0,0.2) !important;\n    background: var(--acc-primary-color, #0072e4) !important;\n    transition: transform 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;\n    overflow: visible;\n    /* Margins on a fixed box add to the edges it is anchored to, so the\n       configured offset stays clear of notches and the home indicator on\n       edge-to-edge pages (viewport-fit=cover); env() is 0 elsewhere. */\n    margin: env(safe-area-inset-top, 0px) env(safe-area-inset-right, 0px) env(safe-area-inset-bottom, 0px) env(safe-area-inset-left, 0px);\n    touch-action: manipulation;\n  }\n  \n  .acc-toggle-btn .acc-toggle-icon {\n    width: 69%;\n    height: 69%;\n    display: inline-flex;\n    align-items: center;\n    justify-content: center;\n  }\n\n  .acc-toggle-btn .acc-toggle-icon svg {\n    width: 100%;\n    height: 100%;\n    fill: white;\n    transition: none;\n  }\n  \n  /* Touch screens keep :hover after a tap, which left the button zoomed. */\n  @media (hover: hover) {\n    .acc-toggle-btn:hover {\n      transform: scale(1.12);\n    }\n  }\n\n  /* The menu panel replaces the button while open; closeMenu() restores\n     aria-expanded before moving focus back here, so the button is visible\n     and focusable again by the time it receives focus. */\n  .acc-toggle-btn[aria-expanded=\"true\"] {\n    opacity: 0;\n    visibility: hidden;\n    pointer-events: none;\n  }\n\n  .acc-violation-bubble {\n    position: absolute;\n    top: -8px;\n    right: -8px;\n    min-width: 24px;\n    height: 24px;\n    border-radius: 12px;\n    font-size: 11px;\n    font-weight: 700;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    padding: 0 4px;\n    pointer-events: none;\n    z-index: 1;\n    color: #fff;\n    border: none;\n    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);\n  }\n\n  .acc-violation-bubble[data-severity=\"critical\"] {\n    background: #d32f2f;\n    color: #fff;\n  }\n\n  .acc-violation-bubble[data-severity=\"serious\"] {\n    background: #f57c00;\n    color: #fff;\n  }\n\n  .acc-violation-bubble[data-severity=\"moderate\"] {\n    background: #fbc02d;\n    color: #333;\n  }\n\n  .acc-violation-bubble[hidden] {\n    display: none;\n  }\n\n  .acc-toggle-btn:focus {\n    outline: none !important;\n  }\n\n  .acc-toggle-btn:focus-visible {\n    outline: 3px solid var(--acc-primary-color, #0072e4) !important;\n    outline-offset: 2px;\n  }\n\n  @media (prefers-reduced-motion: reduce) {\n    .acc-toggle-btn {\n      transition: none;\n    }\n\n    .acc-toggle-btn .acc-toggle-icon svg {\n      transition: none;\n    }\n\n  }\n";

    var reportCSS = "/* The report and Page Structure dialogs, built from the menu's pieces: a\n   light grey sheet, white cards, soft pills and the same type sizes. No\n   primary colour here; these are for reading. They live in the page's\n   own document, not the widget's shadow root, so the theme variables are\n   read with fallbacks. */\n.acc-report-panel {\n  display: none;\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  z-index: calc(var(--acc-widget-z-index, 100000) + 10);\n  /* The menu's font, when it has been registered; otherwise the device's. */\n  font-family: \"AccessibleWeb Inter\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", sans-serif;\n  font-size: 15px;\n  line-height: 1.5;\n  letter-spacing: normal;\n  word-spacing: normal;\n  color: var(--acc-text-color, #222222);\n  --acc-report-muted: #5b6472;\n  --acc-report-sheet: var(--acc-bg-color, #f3f5f8);\n  --acc-report-card: var(--acc-card-bg, #ffffff);\n  /* A step darker than the dialog's grey, so a hovered white card stands\n     out from both. */\n  --acc-hover-tint: #e7eaee;\n}\n@supports (color: color-mix(in srgb, red 50%, transparent)) {\n  .acc-report-panel {\n    --acc-hover-tint: color-mix(in srgb, var(--acc-hover-color, #c4cad3) 40%, var(--acc-card-bg, #ffffff));\n  }\n}\n.acc-report-panel *,\n.acc-report-panel *::before,\n.acc-report-panel *::after {\n  box-sizing: border-box;\n}\n/* The dialog hangs from a fixed point near the top and grows downward.\n   Centred, it re-centred itself every time a card opened or the results\n   arrived, so everything on it jumped. */\n.acc-report-panel.acc-report-visible {\n  display: flex;\n  align-items: flex-start;\n  justify-content: center;\n}\n.acc-report-overlay {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: rgba(0, 0, 0, 0.6);\n}\n.acc-report-dialog {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n  width: 92%;\n  max-width: 760px;\n  margin-top: 7.5vh;\n  max-height: 85vh;\n  /* dvh tracks the visible area while mobile browser toolbars show. */\n  margin-top: 7.5dvh;\n  max-height: 85dvh;\n  border-radius: 28px;\n  background: var(--acc-report-sheet);\n  box-shadow: 0 18px 42px rgba(0, 0, 0, 0.2);\n}\n.acc-report-header {\n  flex-shrink: 0;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 12px;\n  padding: 16px 24px 12px 28px;\n  padding-inline: 28px 24px;\n  /* A line from edge to edge divides the title from what scrolls. */\n  border-bottom: 1px solid #dde1e7;\n}\n.acc-report-heading {\n  display: flex;\n  flex-direction: row;\n  flex-wrap: wrap;\n  align-items: baseline;\n  gap: 2px 10px;\n  min-width: 0;\n}\n.acc-report-title {\n  margin: 0;\n  font-family: inherit;\n  font-size: 17px;\n  font-weight: 600;\n  line-height: 1.3;\n  letter-spacing: normal;\n  color: var(--acc-text-color, #222222);\n}\n/* The credit sits beside the title, and drops under it when short of room. */\n.acc-report-powered {\n  font-size: 13px;\n  line-height: 1.3;\n  color: var(--acc-report-muted);\n}\n.acc-report-passed {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n}\n.acc-report-passed svg {\n  flex-shrink: 0;\n  width: 16px;\n  height: 16px;\n  fill: #2e7d32;\n}\n.acc-report-close {\n  flex-shrink: 0;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 36px;\n  height: 36px;\n  padding: 0;\n  border: none;\n  border-radius: 50%;\n  background: var(--acc-report-card);\n  box-shadow: 0 1px 2px rgba(31, 41, 51, 0.06);\n  cursor: pointer;\n  transition: background-color 0.15s ease;\n}\n@media (hover: hover) {\n  .acc-report-close:hover {\n    background: var(--acc-hover-tint);\n  }\n}\n.acc-report-close:focus-visible {\n  outline: 2px solid var(--acc-focus-ring-color, #0072e4);\n  outline-offset: 2px;\n}\n.acc-report-close svg {\n  width: 20px;\n  height: 20px;\n  fill: var(--acc-text-color, #222222);\n}\n.acc-report-content {\n  flex: 1 1 auto;\n  min-height: 0;\n  overflow-y: auto;\n  overscroll-behavior: contain;\n  padding: 12px 24px 24px;\n  scrollbar-width: thin;\n  scrollbar-color: #7c8594 transparent;\n  /* Room for an always-visible scrollbar is kept from the start, so the\n     cards do not shift sideways when one opens and the list gets long\n     enough to scroll. That room comes out of the end padding (measured\n     in openReportPanel), so the cards stay centred. */\n  scrollbar-gutter: stable;\n  padding-inline-end: max(4px, calc(24px - var(--acc-report-gutter, 0px)));\n}\n.acc-report-loading {\n  padding: 40px 16px;\n  text-align: center;\n  color: var(--acc-report-muted);\n}\n.acc-report-error {\n  padding: 24px 16px;\n  text-align: center;\n  color: #c62828;\n}\n.acc-report-summary {\n  display: grid;\n  grid-template-columns: repeat(4, minmax(0, 1fr));\n  gap: 8px;\n}\n.acc-report-stat {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 6px;\n  padding: 18px 8px 16px;\n  border-radius: 22px;\n  background: var(--acc-report-card);\n  box-shadow: 0 1px 2px rgba(31, 41, 51, 0.06);\n  text-align: center;\n}\n.acc-report-stat-value {\n  font-size: 28px;\n  font-weight: 600;\n  line-height: 1.1;\n}\n.acc-report-stat-label {\n  font-size: 13px;\n  line-height: 1.3;\n  color: var(--acc-report-muted);\n  overflow-wrap: anywhere;\n}\n/* Each of these is at least 4.5 to 1 against white. */\n.acc-report-stat.critical .acc-report-stat-value { color: #c62828; }\n.acc-report-stat.serious .acc-report-stat-value { color: #b45309; }\n.acc-report-stat.moderate .acc-report-stat-value { color: #8a6100; }\n.acc-report-stat.minor .acc-report-stat-value { color: #4d7c0f; }\n.acc-report-section {\n  margin-bottom: 24px;\n}\n.acc-report-section:last-child {\n  margin-bottom: 0;\n}\n.acc-report-section-title {\n  margin: 0 0 10px;\n  padding: 0 4px;\n  font-size: 15px;\n  font-weight: 600;\n  color: var(--acc-text-color, #222222);\n}\n.acc-report-note {\n  margin: 0;\n  padding: 0 4px;\n  font-size: 13px;\n  color: var(--acc-report-muted);\n}\n/* The note under a section's title sits close to it, above the cards. */\n.acc-report-section-title + .acc-report-note {\n  margin: -8px 0 10px;\n}\n.acc-report-violation {\n  margin-bottom: 8px;\n  overflow: hidden;\n  border-radius: 22px;\n  background: var(--acc-report-card);\n  box-shadow: 0 1px 2px rgba(31, 41, 51, 0.06);\n}\n.acc-report-violation:last-child {\n  margin-bottom: 0;\n}\n/* A real button, so a card opens with the keyboard. */\n.acc-report-violation-header {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  width: 100%;\n  min-height: 56px;\n  margin: 0;\n  padding: 10px 16px;\n  border: none;\n  border-radius: 22px;\n  background: transparent;\n  font: inherit;\n  color: inherit;\n  text-align: start;\n  cursor: pointer;\n  transition: background-color 0.15s ease;\n}\n@media (hover: hover) {\n  .acc-report-violation-header:hover {\n    background: var(--acc-hover-tint);\n  }\n}\n.acc-report-violation-header:focus-visible {\n  outline: 2px solid var(--acc-focus-ring-color, #0072e4);\n  outline-offset: -2px;\n}\n/* Arrow at the end of the row; it turns over when the card is open. */\n.acc-report-violation-header::after {\n  content: \"\";\n  flex-shrink: 0;\n  width: 8px;\n  height: 8px;\n  margin: 0 4px 3px;\n  border-right: 1.5px solid var(--acc-report-muted);\n  border-bottom: 1.5px solid var(--acc-report-muted);\n  transform: rotate(45deg);\n  transition: transform 0.2s ease;\n}\n.acc-report-violation.expanded .acc-report-violation-header::after {\n  margin: 3px 4px 0;\n  transform: rotate(-135deg);\n}\n/* Soft pills: a light tint with dark text of the same colour. */\n.acc-report-violation-impact {\n  flex-shrink: 0;\n  padding: 4px 10px;\n  border-radius: 999px;\n  font-size: 13px;\n  font-weight: 600;\n  line-height: 1.3;\n}\n.acc-report-violation-impact.critical { background: #fdecea; color: #a61b1b; }\n.acc-report-violation-impact.serious { background: #fff0e0; color: #8f3f00; }\n.acc-report-violation-impact.moderate { background: #fff4cf; color: #6f4e00; }\n.acc-report-violation-impact.minor { background: #edf5df; color: #3d6210; }\n.acc-report-violation-title {\n  flex: 1 1 auto;\n  min-width: 0;\n  font-size: 15px;\n  font-weight: 600;\n  line-height: 1.35;\n  color: var(--acc-text-color, #222222);\n}\n.acc-report-violation-count {\n  flex-shrink: 0;\n  padding: 3px 10px;\n  border-radius: 999px;\n  background: var(--acc-report-sheet);\n  font-size: 13px;\n  line-height: 1.3;\n  color: var(--acc-report-muted);\n  white-space: nowrap;\n}\n.acc-report-violation-details {\n  display: none;\n  padding: 4px 16px 16px;\n}\n.acc-report-violation.expanded .acc-report-violation-details {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-start;\n  gap: 12px;\n}\n.acc-report-violation-desc {\n  margin: 0;\n  font-size: 15px;\n  color: var(--acc-report-muted);\n}\n/* \"How to Fix\" opens the rule's page on another site. */\n.acc-report-violation-help {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  min-height: 36px;\n  padding: 0 14px;\n  border-radius: 18px;\n  background: var(--acc-report-sheet);\n  font-size: 13px;\n  font-weight: 600;\n  line-height: 1.3;\n  color: var(--acc-text-color, #222222);\n  text-decoration: none;\n  transition: background-color 0.15s ease;\n}\n.acc-report-violation-help svg {\n  flex-shrink: 0;\n  width: 16px;\n  height: 16px;\n  fill: currentColor;\n}\n@media (hover: hover) {\n  .acc-report-violation-help:hover {\n    background: #e0e4ea;\n  }\n}\n.acc-report-violation-help:focus-visible {\n  outline: 2px solid var(--acc-focus-ring-color, #0072e4);\n  outline-offset: 2px;\n}\n.acc-report-node {\n  align-self: stretch;\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n}\n/* The element's HTML, set like a code editor: a dark box with a label,\n   a copy button, and soft colours for tags, names and values. */\n.acc-report-code {\n  overflow: hidden;\n  border-radius: 16px;\n  background: #1b2028;\n}\n.acc-report-code-bar {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 12px;\n  height: 40px;\n  padding: 0 6px 0 16px;\n  padding-inline: 16px 6px;\n  border-bottom: 1px solid #2c333d;\n}\n.acc-report-code-lang {\n  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;\n  font-size: 12px;\n  line-height: 1;\n  color: #aab3c0;\n}\n.acc-report-copy {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 32px;\n  height: 32px;\n  padding: 0;\n  border: none;\n  border-radius: 10px;\n  background: transparent;\n  cursor: pointer;\n}\n.acc-report-copy svg {\n  width: 18px;\n  height: 18px;\n  fill: #d5dbe3;\n}\n.acc-report-copy.acc-report-copied svg {\n  fill: #b7e3a8;\n}\n@media (hover: hover) {\n  .acc-report-copy:hover {\n    background: rgba(255, 255, 255, 0.1);\n  }\n}\n.acc-report-copy:focus-visible {\n  outline: 2px solid #ffffff;\n  outline-offset: -2px;\n}\n.acc-report-node-html {\n  margin: 0;\n  padding: 14px 16px 16px;\n  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;\n  font-size: 13px;\n  line-height: 1.6;\n  color: #e6edf3;\n  white-space: pre-wrap;\n  word-break: break-all;\n  direction: ltr;\n  text-align: left;\n}\n.acc-code-punct { color: #8b95a3; }\n.acc-code-tag { color: #f0b37e; }\n.acc-code-attr { color: #c5d1de; }\n.acc-code-value { color: #b7e3a8; }\n.acc-report-node-fix {\n  margin: 0;\n  font-size: 13px;\n  color: var(--acc-text-color, #222222);\n  /* The check's own advice can come as several short lines. */\n  white-space: pre-line;\n}\n.acc-report-node-fix strong {\n  font-weight: 600;\n}\n.acc-report-success {\n  padding: 32px 16px;\n  text-align: center;\n}\n.acc-report-success h3 {\n  margin: 0;\n  font-family: inherit;\n  font-size: 17px;\n  font-weight: 600;\n  line-height: 1.3;\n  color: var(--acc-text-color, #222222);\n}\n.acc-report-success-icon {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 56px;\n  height: 56px;\n  margin: 0 auto 16px;\n  border-radius: 50%;\n  background: #2e7d32;\n}\n.acc-report-success-icon svg {\n  width: 28px;\n  height: 28px;\n  fill: #ffffff;\n}\n@media (max-width: 600px) {\n  .acc-report-dialog {\n    width: calc(100% - 16px);\n    margin-top: 5vh;\n    max-height: 90vh;\n    margin-top: 5dvh;\n    max-height: 90dvh;\n  }\n  .acc-report-header {\n    padding: 12px 12px 12px 20px;\n    padding-inline: 20px 12px;\n  }\n  .acc-report-content {\n    padding: 12px 16px 20px;\n    padding-inline-end: max(4px, calc(16px - var(--acc-report-gutter, 0px)));\n  }\n  .acc-report-summary {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n  /* The pill and the count share the first line; the title gets its own. */\n  .acc-report-violation-header {\n    flex-wrap: wrap;\n    row-gap: 8px;\n    padding: 12px 14px;\n  }\n  .acc-report-violation-title {\n    order: 3;\n    flex-basis: 100%;\n  }\n  .acc-report-violation-count {\n    margin-inline-start: auto;\n  }\n}\n/* Touch input: the close button grows to a 44px target. */\n@media (pointer: coarse) {\n  .acc-report-close {\n    width: 44px;\n    height: 44px;\n  }\n}\n";

    var readingGuideCSS = ".acc-rg {\n  position: fixed;\n  left: 0;\n  right: 0;\n  width: 100%;\n  pointer-events: none;\n  background-color: rgba(0, 0, 0, 0.4);\n  /* Below the widget's overlay (z - 1) and panel, so the guide dims the\n     page but never the open menu or the toggle button. */\n  z-index: calc(var(--acc-widget-z-index, 100000) - 2);\n}\n.acc-rg-top {\n  top: 0;\n  /* A line along each edge of the reading window shows the eye where it\n     starts and ends, also on a page too dark for the shade to show. The\n     white hairline beside it keeps the line visible on dark pages. */\n  box-sizing: border-box;\n  border-bottom: 3px solid var(--acc-primary-color, #0072e4);\n  box-shadow: 0 1px 0 rgba(255, 255, 255, 0.9);\n}\n.acc-rg-bottom {\n  bottom: 0;\n  box-sizing: border-box;\n  border-top: 3px solid var(--acc-primary-color, #0072e4);\n  box-shadow: 0 -1px 0 rgba(255, 255, 255, 0.9);\n}\n/* Softer overlay when high contrast is active */\nbody.acc-high-contrast-mode .acc-rg {\n  background-color: rgba(0, 0, 0, 0.25);\n}\n";

    var skipLinkCSS = ".acc-skip-link {\n  font-family: inherit;\n  position: fixed;\n  top: 16px;\n  left: 16px;\n  background: var(--acc-card-bg, #ffffff);\n  color: var(--acc-text-color, #222222);\n  border: 3px solid var(--acc-primary-color, #0072e4);\n  border-radius: var(--acc-button-border-radius, 0.4rem);\n  padding: 8px 16px;\n  z-index: calc(var(--acc-widget-z-index, 100000) + 2);\n  transform: translateY(-140%);\n  opacity: 0;\n  pointer-events: none;\n  transition: transform 0.2s ease, opacity 0.2s ease;\n  font-size: 16px;\n  line-height: 1.2;\n  font-weight: 600;\n  background-clip: padding-box;\n}\n.acc-skip-link:focus,\n.acc-skip-link:active {\n  transform: translateY(0);\n  opacity: 1;\n  pointer-events: auto;\n  outline: var(--acc-focus-outline-width, 3px) solid var(--acc-focus-ring-color, #0072e4);\n  outline-offset: var(--acc-focus-outline-offset, 2px);\n}\n";

    var annotationsCSS = ".acc-annotation-layer {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 0;\n  height: 0;\n  z-index: calc(var(--acc-widget-z-index, 100000) + 5);\n  pointer-events: none;\n}\n\n.acc-annotation-marker {\n  position: absolute;\n  width: 20px;\n  height: 20px;\n  border: none;\n  border-radius: 999px;\n  color: #fff;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35);\n  cursor: pointer;\n  pointer-events: auto;\n  transform: translate(-40%, -50%);\n}\n\n.acc-annotation-marker svg {\n  width: 12px;\n  height: 12px;\n  fill: currentColor;\n}\n\n.acc-annotation-marker[data-impact=\"critical\"] {\n  background: #b71c1c;\n}\n\n.acc-annotation-marker[data-impact=\"serious\"] {\n  background: #d84315;\n}\n\n.acc-annotation-marker[data-impact=\"moderate\"] {\n  background: #ef6c00;\n}\n\n.acc-annotation-marker[data-impact=\"minor\"] {\n  background: #1565c0;\n}\n\n.acc-annotation-popup {\n  position: absolute;\n  width: min(320px, 92vw);\n  background: #fff;\n  color: #1a1a1a;\n  border: 1px solid #d7d7d7;\n  border-radius: 10px;\n  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.24);\n  padding: 12px;\n  pointer-events: auto;\n}\n\n.acc-annotation-popup-header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 10px;\n}\n\n.acc-annotation-popup-title {\n  margin: 0;\n  font-size: 14px;\n  line-height: 1.3;\n}\n\n.acc-annotation-popup-close {\n  border: 0;\n  background: transparent;\n  padding: 2px;\n  width: 24px;\n  height: 24px;\n  color: #444;\n  cursor: pointer;\n}\n\n.acc-annotation-popup-close svg {\n  width: 20px;\n  height: 20px;\n  fill: currentColor;\n}\n\n.acc-annotation-popup p {\n  margin: 8px 0;\n  font-size: 13px;\n  line-height: 1.45;\n}\n\n.acc-annotation-popup a {\n  color: #0049a5;\n  font-weight: 600;\n  text-decoration: underline;\n}\n";

    var extrasCSS = "/* TTS click-to-read — these target light-DOM page content, so they must\n   live in <head>, not the widget shadow root */\nbody.acc-tts-click-mode :is(h1, h2, h3, h4, h5, h6, p, li, dt, dd, blockquote, figcaption, caption, th, td, div, section):not(.acc-container *):hover {\n  cursor: pointer;\n}\n\n.acc-tts-active-block {\n  outline: 2px solid var(--acc-primary-color, #0072e4) !important;\n  outline-offset: 3px !important;\n  border-radius: 4px;\n}\n\n/* Text magnifier — fixed banner showing enlarged copy of hovered text */\n.acc-text-magnifier {\n  position: fixed;\n  left: 50%;\n  bottom: calc(24px + env(safe-area-inset-bottom, 0px));\n  transform: translateX(-50%);\n  /* max-content first: a left: 50% box otherwise shrink-wraps to half the\n     viewport, which turned the banner into a tall, narrow column. */\n  width: max-content;\n  max-width: min(90vw, 880px);\n  background: #111827;\n  color: #ffffff;\n  font-family: system-ui, -apple-system, \"Segoe UI\", Roboto, Arial, sans-serif;\n  font-size: clamp(18px, 5.5vw, 28px);\n  line-height: 1.45;\n  /* Vertical spacing comes from transparent borders, not padding:\n     overflow clips at the padding box, so the first clamped-away line\n     would otherwise peek through the bottom padding. */\n  padding: 0 22px;\n  border-block: 14px solid transparent;\n  border-radius: 10px;\n  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);\n  z-index: 2147483646;\n  pointer-events: none;\n  display: none;\n  overflow: hidden;\n}\n\n/* Clamped so a long block can never cover a phone screen. */\n.acc-text-magnifier.acc-visible {\n  display: -webkit-box;\n  -webkit-box-orient: vertical;\n  -webkit-line-clamp: 6;\n}\n\n/* Docked at the top while the magnified text sits in the lower part of\n   the screen, so the banner never covers what is being read. */\n.acc-text-magnifier.acc-text-magnifier-top {\n  top: calc(16px + env(safe-area-inset-top, 0px));\n  bottom: auto;\n}\n\n/* Landscape phones: six large lines would cover most of the screen. */\n@media (max-height: 500px) {\n  .acc-text-magnifier {\n    font-size: 22px;\n  }\n\n  .acc-text-magnifier.acc-visible {\n    -webkit-line-clamp: 3;\n  }\n}\n\n/* Tooltips: the hidden name or description of the thing under the\n   pointer or the keyboard focus, in a large bubble beside it. */\n.acc-tooltip-bubble {\n  display: none;\n  position: fixed;\n  top: 0;\n  left: 0;\n  z-index: 2147483646;\n  box-sizing: border-box;\n  width: max-content;\n  max-width: min(360px, calc(100vw - 16px));\n  margin: 0;\n  padding: 8px 12px;\n  border-radius: 10px;\n  background: #111827;\n  color: #ffffff;\n  font-family: system-ui, -apple-system, \"Segoe UI\", Roboto, Arial, sans-serif;\n  font-size: 16px;\n  font-weight: 400;\n  line-height: 1.4;\n  letter-spacing: normal;\n  word-spacing: normal;\n  text-align: start;\n  overflow-wrap: anywhere;\n  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.3);\n  pointer-events: none;\n}\n\n.acc-tooltip-bubble.acc-visible {\n  display: block;\n}\n\n/* Page structure navigator: each list is a white card of rows inside\n   the shared report dialog. */\n.acc-structure-list {\n  list-style: none;\n  margin: 0;\n  padding: 6px;\n  border-radius: 22px;\n  background: var(--acc-card-bg, #ffffff);\n  box-shadow: 0 1px 2px rgba(31, 41, 51, 0.06);\n}\n\n.acc-structure-list li {\n  margin: 0;\n  padding: 0;\n}\n\n.acc-structure-item {\n  display: block;\n  width: 100%;\n  margin: 0;\n  text-align: start;\n  background: transparent;\n  border: none;\n  border-radius: 16px;\n  padding: 10px 12px;\n  font: inherit;\n  font-size: 15px;\n  line-height: 1.4;\n  color: var(--acc-text-color, #222222);\n  cursor: pointer;\n  overflow-wrap: anywhere;\n}\n\n@media (hover: hover) {\n  .acc-structure-item:hover {\n    background: var(--acc-hover-tint, #e7eaee);\n  }\n}\n\n@media (pointer: coarse) {\n  .acc-structure-item {\n    padding: 12px;\n  }\n}\n\n.acc-structure-item:focus-visible {\n  outline: 2px solid var(--acc-focus-ring-color, #0072e4);\n  outline-offset: -2px;\n}\n\n.acc-structure-empty {\n  color: #5b6472;\n  font-size: 15px;\n  margin: 0;\n  padding: 0 4px;\n}\n";

    const STATIC_STYLE_ID = 'acc-static-styles';
    // Widget UI styles live inside the shadow root so host-page CSS cannot
    // override them; page-level overlay styles (report modal, reading guide,
    // skip link, annotations) target light-DOM elements and stay in <head>.
    const WIDGET_UI_STYLES = [
      menuCSS,
      widgetCSS
    ].join('\n');
    const PAGE_OVERLAY_STYLES = [
      reportCSS,
      readingGuideCSS,
      skipLinkCSS,
      annotationsCSS,
      extrasCSS
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

      // Constructable stylesheets are exempt from CSP style-src, so strict-CSP
      // pages work without any configuration. The <style>-element fallback
      // (old browsers, @font-face) carries the nonce when one is configured.
      canUseAdoptedStyleSheets() {
        if (this._adoptedSheetsSupported === undefined) {
          this._adoptedSheetsSupported = typeof document !== 'undefined' &&
            'adoptedStyleSheets' in document &&
            typeof CSSStyleSheet === 'function' &&
            (() => {
              try {
                new CSSStyleSheet();
                return true;
              } catch {
                return false;
              }
            })();
        }
        return this._adoptedSheetsSupported;
      },

      injectStyle(id, css, { forceElement = false } = {}) {
        if (!css || typeof document === 'undefined') return;
        try {
          if (!forceElement && this.canUseAdoptedStyleSheets()) {
            let sheet = this.adoptedSheets.get(id);
            if (!sheet) {
              sheet = new CSSStyleSheet();
              this.adoptedSheets.set(id, sheet);
            }
            sheet.replaceSync(css);
            if (!document.adoptedStyleSheets.includes(sheet)) {
              document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
            }
            return;
          }
          let style = document.getElementById(id) || document.createElement('style');
          style.textContent = css;
          if (this.styleNonce) {
            style.nonce = this.styleNonce;
          }
          if (!style.id) {
            style.id = id;
            document.head.appendChild(style);
          }
        } catch (e) {
          console.warn('Error adding stylesheet:', e);
        }
      },

      removeStyle(id) {
        if (typeof document === 'undefined') return;
        try {
          const sheet = this.adoptedSheets?.get(id);
          if (sheet) {
            this.adoptedSheets.delete(id);
            document.adoptedStyleSheets = document.adoptedStyleSheets.filter(s => s !== sheet);
          }
          const style = document.getElementById(id);
          if (style && style.tagName === 'STYLE') {
            style.remove();
          }
        } catch (e) {
          console.warn('Error removing stylesheet:', e);
        }
      },

      hasStyle(id) {
        if (typeof document === 'undefined') return false;
        return !!(this.adoptedSheets?.has(id) || document.getElementById(id));
      },

      // Widget UI styles live inside the shadow root; use its adoptedStyleSheets
      // when available so strict-CSP pages need no nonce.
      applyWidgetUiStyles(shadowRoot) {
        const css = this.getWidgetUiStyles();
        if (this.canUseAdoptedStyleSheets() && shadowRoot && 'adoptedStyleSheets' in shadowRoot) {
          try {
            const sheet = new CSSStyleSheet();
            sheet.replaceSync(css);
            shadowRoot.adoptedStyleSheets = [...shadowRoot.adoptedStyleSheets, sheet];
            return;
          } catch (e) {
            console.warn('Falling back to <style> for widget UI styles:', e);
          }
        }
        const style = document.createElement('style');
        style.textContent = css;
        if (this.styleNonce) {
          style.nonce = this.styleNonce;
        }
        shadowRoot.appendChild(style);
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
          this.removeStyle(styleId);
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
        this.injectStyle(STATIC_STYLE_ID, PAGE_OVERLAY_STYLES);
        this.staticStylesRegistered = true;
      },

      getWidgetUiStyles() {
        return WIDGET_UI_STYLES;
      },

      // Query the widget's own UI. Before the shadow root exists (or if
      // attachShadow is unavailable) this falls back to the document.
      queryWidget(selector) {
        const root = this.widgetRoot || document;
        try {
          return root.querySelector(selector);
        } catch (e) {
          console.warn(`Failed to query widget selector: ${selector}`, e);
          return null;
        }
      },

      queryWidgetAll(selector) {
        const root = this.widgetRoot || document;
        try {
          return Array.from(root.querySelectorAll(selector));
        } catch (e) {
          console.warn(`Failed to query widget selector: ${selector}`, e);
          return [];
        }
      },

      // document.activeElement reports the shadow host once focus moves inside
      // the shadow root; resolve the real focused element.
      getActiveElement() {
        if (typeof document === 'undefined') return null;
        if (this.widgetRoot && this.widgetRoot.activeElement) {
          return this.widgetRoot.activeElement;
        }
        return document.activeElement;
      }

    };

    // Default remote sources for optional, on-demand assets (dev-mode audit
    // engine and the dyslexia font). The WordPress build replaces this module
    // with empty values (see rollup.config.js): the wordpress.org directory
    // forbids shipping code that references remote executables, even as
    // unreachable fallbacks, so that build requires axeCoreUrl/dyslexiaFontUrl
    // to be configured (the bundled plugin always sets both).
    const AXE_CORE_VERSION = '4.11.1';
    const AXE_CORE_SRC = `https://cdn.jsdelivr.net/npm/axe-core@${AXE_CORE_VERSION}/axe.min.js`;
    const AXE_CORE_INTEGRITY = 'sha384-wb3zgvLcZeMFSec08dk7g8K8yDFFAX2uNKVwOUuowwc/wIfE2t6XVUjTEgPrOJCS';
    const DYSLEXIA_FONT_SRC = 'url("https://accessibleweb.pages.dev/fonts/OpenDyslexic3-Regular.woff") format("woff"), url("https://accessibleweb.pages.dev/fonts/OpenDyslexic3-Regular.ttf") format("truetype")';
    // One @font-face source per Readable Font level. An empty src (WordPress
    // build) skips the @font-face and the family falls back through its
    // system font stack.
    const READABLE_FONT_FACES = {
      dyslexic: { family: 'OpenDyslexic3', src: DYSLEXIA_FONT_SRC },
      legible: { family: 'Atkinson Hyperlegible', src: 'url("https://accessibleweb.pages.dev/fonts/AtkinsonHyperlegible-Regular.woff2") format("woff2")' },
      lexend: { family: 'Lexend', src: 'url("https://accessibleweb.pages.dev/fonts/Lexend-Regular.woff2") format("woff2")' }
    };

    /** @typedef {import('../index.js').default} AccessibleWebWidget */


    const SYSTEM_PREFERS_REDUCED_MOTION = '(prefers-reduced-motion: reduce)';
    const SYSTEM_PREFERS_CONTRAST = '(prefers-contrast: more)';

    /** @type {{ [methodName: string]: (this: AccessibleWebWidget, ...args: any[]) => any }} */
    const coreFeatureMethods = {

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
            // open() creates the menu on demand and focuses the dialog, so this
            // works whether or not the floating button exists (hideButton).
            if (!this.isMenuOpen()) {
              this.open();
              return;
            }
            const targetMenu = this.activeMenuContainer || this.menuContainer;
            if (!targetMenu) return;
            const focusables = this.getFocusableElements(targetMenu);
            if (focusables.length) {
              focusables[0].focus();
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

      collectDirectTextParents(rootElement = document.body) {
          const directTextParents = new Set();
          if (typeof document === 'undefined' || typeof NodeFilter === 'undefined') {
            return directTextParents;
          }

          const root = rootElement instanceof Element ? rootElement : document.body;
          if (!root) return directTextParents;

          const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
            acceptNode: (node) => {
              if (!node || !node.textContent || !node.textContent.trim()) {
                return NodeFilter.FILTER_REJECT;
              }
              const parent = node.parentElement;
              if (!parent) return NodeFilter.FILTER_REJECT;
              if (this.shouldSkipScaling(parent)) return NodeFilter.FILTER_REJECT;
              if (parent.closest('script,style,noscript,textarea,pre,code,svg')) {
                return NodeFilter.FILTER_REJECT;
              }
              if (parent.matches(this.textScaleSelectors)) {
                return NodeFilter.FILTER_REJECT;
              }
              return NodeFilter.FILTER_ACCEPT;
            }
          });

          let currentNode = walker.nextNode();
          while (currentNode) {
            const parent = currentNode.parentElement;
            if (parent) {
              directTextParents.add(parent);
            }
            currentNode = walker.nextNode();
          }

          return directTextParents;
        },

      isScalableElement(element) {
          return (
            element instanceof Element &&
            !this.shouldSkipScaling(element) &&
            !element.classList.contains('material-icons') &&
            !element.classList.contains('fa')
          );
        },

      recordBaseSize(element) {
          const baseAttr = 'data-acc-baseSize';
          if (!this.isScalableElement(element) || element.hasAttribute(baseAttr)) {
            return;
          }
          const computedSize = parseFloat(window.getComputedStyle(element).fontSize);
          if (Number.isNaN(computedSize) || computedSize <= 0) {
            return;
          }
          // A size the page wrote on the element itself is put back when
          // Font Size goes off.
          const inlineSize = element.style.getPropertyValue('font-size');
          if (inlineSize) {
            if (!this.textScaleInlineSizes) this.textScaleInlineSizes = new WeakMap();
            this.textScaleInlineSizes.set(element, {
              value: inlineSize,
              priority: element.style.getPropertyPriority('font-size')
            });
          }
          element.setAttribute(baseAttr, String(computedSize));
        },

      // Records bases for elements that have none yet. One inserted under an
      // already-scaled element would inherit that scaled size and record it as
      // its base, scaling twice (#28), so the scaled ancestors are pinned back
      // to their recorded bases while measuring and restored afterwards. It
      // all runs in one task, so nothing paints in between.
      recordBaseSizes(elements) {
          const unrecorded = [];
          elements.forEach((element) => {
            if (this.isScalableElement(element) && !element.hasAttribute('data-acc-baseSize')) {
              unrecorded.push(element);
            }
          });
          if (!unrecorded.length) return;

          const visited = new Set();
          const scaledAncestors = [];
          unrecorded.forEach((element) => {
            for (let node = element.parentElement; node && !visited.has(node); node = node.parentElement) {
              visited.add(node);
              if (node.hasAttribute('data-acc-baseSize') && node.style.fontSize) {
                scaledAncestors.push({ node, scaledSize: node.style.fontSize });
              }
            }
          });

          scaledAncestors.forEach(({ node }) => {
            node.style.setProperty('font-size', `${node.getAttribute('data-acc-baseSize')}px`, 'important');
          });
          unrecorded.forEach((element) => this.recordBaseSize(element));
          scaledAncestors.forEach(({ node, scaledSize }) => {
            node.style.setProperty('font-size', scaledSize, 'important');
          });
        },

      applyScaleToElement(element, multiplier) {
          if (!this.isScalableElement(element)) {
            return;
          }
          this.recordBaseSize(element);
          const baseSize = parseFloat(element.getAttribute('data-acc-baseSize'));
          if (Number.isNaN(baseSize) || baseSize <= 0) {
            return;
          }
          // Important, so a page rule (or Simplify Layout) that is important
          // too cannot hold the text at its old size.
          element.style.setProperty('font-size', `${baseSize * multiplier}px`, 'important');
        },

      // Take Font Size off every element and give back the size each had.
      clearTextScale() {
          document.querySelectorAll('[data-acc-baseSize]').forEach((element) => {
            if (this.shouldSkipScaling(element)) return;
            const previous = this.textScaleInlineSizes && this.textScaleInlineSizes.get(element);
            // Removed first: writing a plain value over an important one
            // leaves some browsers treating it as important still.
            element.style.removeProperty('font-size');
            if (previous) {
              element.style.setProperty('font-size', previous.value, previous.priority);
              this.textScaleInlineSizes.delete(element);
            }
            element.removeAttribute('data-acc-baseSize');
          });
        },

      ensureTextScaleObserver() {
          if (this.textScaleObserver || !document.body) return;
          this.textScaleObserver = new MutationObserver((mutations) => {
            if (Math.abs(this.currentTextScaleMultiplier - 1) < 0.001) {
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
                this.collectDirectTextParents(node).forEach(el => pending.add(el));
              });
            });
            if (!pending.size) return;
            this.recordBaseSizes(pending);
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
            const numericMultiply = Number(multiply);
            const resolvedMultiply = Number.isFinite(numericMultiply) && numericMultiply > 0 ? numericMultiply : 1;
            const isDefaultScale = Math.abs(resolvedMultiply - 1) < 0.001;
            this.currentTextScaleMultiplier = resolvedMultiply;
            if (!isDefaultScale) {
              // Simplify Layout gives the text other sizes. Sizes measured
              // under the other layout are stale, so measure again.
              const layout = document.body.classList.contains('acc-simple-layout-enabled') ? 'simple' : 'page';
              if (this.textScaleLayout && this.textScaleLayout !== layout) this.clearTextScale();
              this.textScaleLayout = layout;
              this.ensureTextScaleObserver();
              const elements = document.querySelectorAll(this.textScaleSelectors);
              const directParents = this.collectDirectTextParents(document.body);
              const allTargets = new Set([...elements, ...directParents]);
              this.recordBaseSizes(allTargets);
              allTargets.forEach(el => this.applyScaleToElement(el, resolvedMultiply));
            } else {
              this.disconnectTextScaleObserver();
              this.textScaleLayout = null;
              this.clearTextScale();
            }
          } catch (e) {
            console.warn('Error scaling text:', e);
          }
        },

      // Snap a persisted text-scale multiplier to a Font Size level, or 1 when
      // off. Values saved by the old slider (any multiplier, or a percent above
      // 10) land on the nearest level; anything at or below 100% is off.
      resolveTextScale(value) {
          const numeric = Number(value);
          if (!Number.isFinite(numeric)) return 1;
          const multiplier = numeric > 10 ? numeric / 100 : numeric;
          if (multiplier <= 1) return 1;
          return (this.textScaleLevels || []).reduce((nearest, level) => (
            Math.abs(level - multiplier) < Math.abs(nearest - multiplier) ? level : nearest
          ), 1);
        },

      // Index of the active Font Size level, -1 when off.
      getTextScaleLevel(value) {
          return (this.textScaleLevels || []).indexOf(this.resolveTextScale(value));
        },

      enableBoldText(enable = false) {
          const contentSelector = [
            '*',
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
            ':not([data-icon])',
            // The widget's own dialogs keep their own type.
            ':not(.acc-report-panel)',
            ':not(.acc-report-panel *)'
          ].join('');
          const config = {
            id: "bold-text",
            selector: "body",
            childrenSelector: [contentSelector],
            styles: { 'font-weight': '700' },
            css: `
          input::placeholder, textarea::placeholder {
            font-weight: 700 !important;
          }
        `
          };
          this.applyToolStyle({ ...config, enable });
        },

      // Map a persisted level state to one of the feature's levels, or null
      // when off. Legacy configs stored true, which is the first level; any
      // other number lands on the nearest level.
      resolveSpacingLevel(levels, value) {
          if (!Array.isArray(levels) || !levels.length) return null;
          if (value === true) return levels[0];
          const numeric = Number(value);
          if (!value || !Number.isFinite(numeric) || numeric <= 0) return null;
          return levels.reduce((nearest, level) => (
            Math.abs(level - numeric) < Math.abs(nearest - numeric) ? level : nearest
          ), levels[0]);
        },

      // Index of the active level, -1 when off.
      getLetterSpacingLevel(value) {
          return (this.letterSpacingLevels || []).indexOf(this.resolveSpacingLevel(this.letterSpacingLevels, value));
        },

      getLineSpacingLevel(value) {
          return (this.lineSpacingLevels || []).indexOf(this.resolveSpacingLevel(this.lineSpacingLevels, value));
        },

      adjustLetterSpacing(value = false) {
          const level = this.resolveSpacingLevel(this.letterSpacingLevels, value);
          const X = ':not(.material-icons):not(.acc-container):not(.acc-container *)';
          const round = (number) => Math.round(number * 100) / 100;
          // ":root" makes these rules outrank Simplify Layout's own spacing,
          // whichever of the two was switched on first.
          const config = {
            id: "letter-spacing",
            css: level ? `
          html.acc-letter-spacing:root, html.acc-letter-spacing:root *${X} {
            letter-spacing: ${round(0.12 * level)}em !important;
            word-spacing: ${round(0.16 * level)}em !important;
          }
        ` : ''
          };
          this.applyToolStyle({ ...config, enable: !!level });
        },

      adjustLineSpacing(value = false) {
          const level = this.resolveSpacingLevel(this.lineSpacingLevels, value);
          const X = ':not(.material-icons):not(.acc-container):not(.acc-container *)';
          const headings = (this.targetSelectors.HEADERS || []).join(',');
          const round = (number) => Math.round(number * 1000) / 1000;
          const config = {
            id: "line-spacing",
            css: level ? `
          html.acc-line-spacing:root, html.acc-line-spacing:root *${X} {
            line-height: ${level} !important;
          }
          html.acc-line-spacing:root :where(${headings})${X},
          html.acc-line-spacing:root :where(${headings})${X} * {
            line-height: ${round(level * 0.75)} !important;
          }
        ` : ''
          };
          this.applyToolStyle({ ...config, enable: !!level });
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

      // Map a persisted readable-text state to a font choice. Legacy configs
      // stored a boolean (true = the old single dyslexia font).
      resolveReadableFontChoice(value) {
          const choices = this.readableFontChoices || [];
          if (value === true) return choices[0] || null;
          if (typeof value !== 'string') return null;
          return choices.find((choice) => choice.key === value) || null;
        },

      // Per-font self-hosting override: options.readableFontUrls = { dyslexic,
      // legible, lexend }, with dyslexiaFontUrl kept as the legacy alias for
      // the dyslexic entry. The WordPress build relies on this — its bundled
      // widget strips the default remote sources.
      getCustomReadableFontUrl(fontKey) {
          const urls = this.options?.readableFontUrls;
          let raw = (urls && typeof urls === 'object') ? urls[fontKey] : '';
          if (fontKey === 'dyslexic' && (typeof raw !== 'string' || !raw.trim())) {
            raw = this.options?.dyslexiaFontUrl;
          }
          if (typeof raw !== 'string') return '';
          const trimmed = raw.trim();
          return trimmed && !/["'()\\]/.test(trimmed) ? trimmed : '';
        },

      ensureReadableFontLoaded(fontKey = 'dyslexic') {
          if (!this.readableFontsLoaded) {
            this.readableFontsLoaded = new Set();
          }
          if (this.readableFontsLoaded.has(fontKey)) return;
          const styleId = `acc-font-${fontKey}`;
          if (this.hasStyle(styleId)) {
            this.readableFontsLoaded.add(fontKey);
            return;
          }
          const face = READABLE_FONT_FACES[fontKey];
          if (!face || !face.family) {
            this.readableFontsLoaded.add(fontKey);
            return;
          }
          let fontSrc = face.src || '';
          const customFontUrl = this.getCustomReadableFontUrl(fontKey);
          if (customFontUrl) fontSrc = `url("${customFontUrl}")`;
          if (!fontSrc) {
            // No font source available (WordPress build without a configured
            // URL): the choice falls back through its system font stack.
            this.readableFontsLoaded.add(fontKey);
            return;
          }
          // @font-face stays a real <style> element (nonce'd under CSP):
          // constructed-stylesheet @font-face support is still inconsistent.
          this.injectStyle(styleId, `
        @font-face {
          font-family: "${face.family}";
          src: ${fontSrc};
          font-display: swap;
        }
      `, { forceElement: true });
          this.readableFontsLoaded.add(fontKey);
        },

      // A promise that settles when the font file is in, or null when there
      // is nothing to wait for (already loaded, no font file, old browser).
      // A file that fails or takes over three seconds stops the wait, and
      // the font's system stand-ins show instead.
      whenReadableFontReady(fontKey) {
          const face = READABLE_FONT_FACES[fontKey];
          const fonts = typeof document !== 'undefined' ? document.fonts : null;
          if (!face || !face.family || !fonts || typeof fonts.load !== 'function') return null;
          if (!this.hasStyle(`acc-font-${fontKey}`)) return null;
          const font = `1em "${face.family}"`;
          try {
            if (typeof fonts.check === 'function' && fonts.check(font)) return null;
            return Promise.race([
              Promise.resolve(fonts.load(font)).catch(() => {}),
              new Promise((resolve) => setTimeout(resolve, 3000))
            ]);
          } catch {
            return null;
          }
        },

      enableReadableText(value = false) {
          const choice = this.resolveReadableFontChoice(value);
          const feature = this.multiLevelFeatures?.['readable-text'];
          if (feature) {
            feature.currentIndex = choice ? feature.values.indexOf(choice.key) : -1;
          }
          if (choice) {
            this.ensureReadableFontLoaded(choice.key);
          }
          const fontFamily = choice ? choice.family : '';
          const contentSelector = [
            '*',
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
            ':not([data-icon])',
            // The widget's own dialogs keep their own type.
            ':not(.acc-report-panel)',
            ':not(.acc-report-panel *)'
          ].join('');
          const config = {
            id: "readable-text",
            selector: "body",
            childrenSelector: [contentSelector],
            styles: {
              'font-family': fontFamily
            },
            css: `
          input::placeholder, textarea::placeholder {
            font-family: ${fontFamily || 'inherit'} !important;
          }
        `
          };
          // The page changes type once: it keeps what it shows until the font
          // file is in. Switching at once would show the font's system
          // stand-in first and the font a moment later, two jumps for one
          // click. A later choice, or Reset, cancels a switch still waiting.
          const request = (this.readableFontRequest || 0) + 1;
          this.readableFontRequest = request;
          const apply = () => this.applyToolStyle({ ...config, enable: !!choice });
          const ready = choice ? this.whenReadableFontReady(choice.key) : null;
          if (!ready) {
            apply();
            return;
          }
          ready.then(() => {
            if (this.readableFontRequest === request) apply();
          });
        },

      pauseMotion(enable = false) {
        const config = {
          id: "pause-motion",
          selector: "html",
          childrenSelector: ['*'],
          styles: { 'transition': 'none', 'animation-fill-mode': 'forwards', 'animation-iteration-count': '1', 'animation-duration': '.01s' }
        };
        this.applyToolStyle({ ...config, enable });
        // CSS only stops transitions and keyframe animations; videos and
        // animated GIFs need DOM work. The Seizure Safe profile bundles this
        // feature, so flashing media has to actually stop.
        this.setMediaMotionPaused(!!enable);
      },

      isMotionPauseActive() {
        return typeof document !== 'undefined' &&
          document.documentElement.classList.contains('acc-pause-motion');
      },

      pauseVideoElement(video) {
        if (!(video instanceof HTMLVideoElement)) return;
        if (video.closest('.acc-container')) return;
        try {
          if (!video.paused && !video.ended) {
            video.setAttribute('data-acc-motion-paused', 'true');
          }
          video.pause();
        } catch {
          // Ignore playback errors from detached or unsupported media.
        }
      },

      freezeGifImage(img) {
        if (!(img instanceof HTMLImageElement)) return;
        if (img.closest('.acc-container') || img.getAttribute('data-acc-gif-frozen')) return;
        const src = img.currentSrc || img.src || '';
        if (!/\.gif($|[?#])/i.test(src) && !/^data:image\/gif/i.test(src)) return;
        if (!img.complete || !img.naturalWidth) {
          if (img.getAttribute('data-acc-gif-pending')) return;
          img.setAttribute('data-acc-gif-pending', 'true');
          img.addEventListener('load', () => {
            img.removeAttribute('data-acc-gif-pending');
            if (this.isMotionPauseActive()) this.freezeGifImage(img);
          }, { once: true });
          return;
        }
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const context = canvas.getContext('2d');
          if (!context) return;
          // drawImage captures the GIF's current frame. Pixels are never read
          // back, so cross-origin GIFs work too (the canvas is merely tainted).
          context.drawImage(img, 0, 0);
          canvas.setAttribute('role', 'img');
          const alt = img.getAttribute('alt');
          if (alt) canvas.setAttribute('aria-label', alt);
          const rect = img.getBoundingClientRect();
          if (rect.width && rect.height) {
            canvas.style.width = `${rect.width}px`;
            canvas.style.height = `${rect.height}px`;
          } else {
            canvas.style.maxWidth = '100%';
          }
          img.setAttribute('data-acc-gif-frozen', 'true');
          img.insertAdjacentElement('afterend', canvas);
          this.frozenGifs.push({ img, canvas, inlineDisplay: img.style.display });
          img.style.display = 'none';
        } catch {
          // Leave the GIF animated rather than risk breaking the image.
        }
      },

      unfreezeGifImages() {
        (this.frozenGifs || []).forEach(({ img, canvas, inlineDisplay }) => {
          if (canvas) canvas.remove();
          if (img) {
            img.style.display = inlineDisplay || '';
            img.removeAttribute('data-acc-gif-frozen');
          }
        });
        this.frozenGifs = [];
      },

      applyMotionPauseToMedia(root) {
        if (!root || typeof root.querySelectorAll !== 'function') return;
        if (root instanceof Element) {
          if (root.matches?.('video')) this.pauseVideoElement(root);
          if (root.matches?.('img')) this.freezeGifImage(root);
        }
        root.querySelectorAll('video').forEach((video) => this.pauseVideoElement(video));
        root.querySelectorAll('img').forEach((img) => this.freezeGifImage(img));
      },

      setMediaMotionPaused(enable) {
        if (typeof document === 'undefined') return;
        if (enable) {
          this.applyMotionPauseToMedia(document);
          if (!this.motionPauseObserver && document.body && typeof MutationObserver === 'function') {
            this.motionPauseObserver = new MutationObserver((mutations) => {
              mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                  if (!(node instanceof Element)) return;
                  this.applyMotionPauseToMedia(node);
                });
              });
            });
            this.motionPauseObserver.observe(document.body, { childList: true, subtree: true });
          }
        } else {
          if (this.motionPauseObserver) {
            this.motionPauseObserver.disconnect();
            this.motionPauseObserver = null;
          }
          document.querySelectorAll('video[data-acc-motion-paused]').forEach((video) => {
            video.removeAttribute('data-acc-motion-paused');
            // Only autoplay media restarts on its own; anything the visitor
            // started stays paused so audio doesn't blast back unexpectedly.
            if (video.hasAttribute('autoplay')) {
              try {
                const playResult = video.play();
                playResult?.catch?.(() => {});
              } catch {
                // Ignore autoplay rejections.
              }
            }
          });
          this.unfreezeGifImages();
        }
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

        /* ── Text laid over a picture: fade the picture behind it rather
           than cover it (see markMediaOverlays) ── */
        body.acc-high-contrast-mode [data-acc-over-media]${X} {
          background-color: rgba(255, 255, 255, 0.85) !important;
        }

        body.acc-high-contrast-mode [data-acc-over-media] *${X} {
          background-color: transparent !important;
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
          const guideHeight = 120; // Height of the clear reading window

          // Always clean up existing listeners first to prevent duplicates
          this.detachReadingGuideListeners();

          if (enable) {
            if (!container) {
              container = document.createElement('div');
              container.setAttribute('class', 'acc-rg-container');
              container.setAttribute('aria-hidden', 'true');
              container.innerHTML = this.readingAidTemplate;
              document.body.prepend(container);
            }

            const rgTop = container.querySelector('.acc-rg-top');
            const rgBottom = container.querySelector('.acc-rg-bottom');

            const placeGuide = (clientY) => {
              // Clamped: a remembered position can fall outside a viewport
              // that shrank since (rotating a phone).
              const y = Math.min(Math.max(0, clientY), window.innerHeight);
              rgTop.style.height = `${Math.max(0, y - guideHeight / 2)}px`;
              // The bottom shade runs from the window's lower edge to the
              // viewport bottom, so it stays correct when mobile toolbars
              // resize the viewport.
              rgBottom.style.top = `${y + guideHeight / 2}px`;
              rgBottom.style.height = '';
              this.readingGuideY = y;
            };

            // Show the guide right away (mid-screen until the pointer moves):
            // touch screens have no hover that would ever reveal it.
            placeGuide(this.readingGuideY ?? window.innerHeight / 2);
            rgTop.style.display = 'block';
            rgBottom.style.display = 'block';
            this.readingAidVisible = true;

            // Taps and moves on the widget's own UI leave the guide where the
            // visitor put it on the page. While the menu is open a clear
            // overlay covers the page; over that the pointer is still on the
            // page, so only the menu, the button and the dialogs count.
            const isWidgetEvent = (event) => {
              const path = typeof event.composedPath === 'function' ? event.composedPath() : [event.target];
              return path.some((node) => node instanceof Element
                && node.matches('.acc-menu, .acc-toggle-btn, .acc-report-panel, .acc-annotation-popup'));
            };
            // Mouse and pen drag the window continuously, once per frame and
            // always to the latest position, so it never stops short of the
            // pointer. A touch places it where the finger lands, then the
            // page scrolls beneath it.
            let pendingY = null;
            let frame = 0;
            const onPointerMove = (event) => {
              if (event.pointerType === 'touch' || isWidgetEvent(event)) return;
              pendingY = event.clientY;
              if (frame) return;
              frame = requestAnimationFrame(() => {
                frame = 0;
                if (pendingY !== null && this.readingAidVisible) placeGuide(pendingY);
              });
            };
            const onPointerDown = (event) => {
              if (isWidgetEvent(event)) return;
              pendingY = null;
              placeGuide(event.clientY);
            };
            const cancel = () => {
              if (frame) cancelAnimationFrame(frame);
              frame = 0;
            };

            document.addEventListener('pointermove', onPointerMove, { passive: true });
            document.addEventListener('pointerdown', onPointerDown, { passive: true });
            this.readingGuideListeners = { onPointerMove, onPointerDown, cancel };
          } else {
            this.readingAidVisible = false;
            if (container) {
              container.remove();
            }
          }
        } catch (e) {
          console.warn('Error with reading aid:', e);
        }
      },

      detachReadingGuideListeners() {
        const listeners = this.readingGuideListeners;
        if (!listeners) return;
        document.removeEventListener('pointermove', listeners.onPointerMove);
        document.removeEventListener('pointerdown', listeners.onPointerDown);
        if (typeof listeners.cancel === 'function') listeners.cancel();
        this.readingGuideListeners = null;
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

      // Apply a system-derived default for a feature. An explicit user choice
      // always wins; returns true when the stored state actually changed.
      applySystemTogglePreference(key, shouldEnable) {
        this.loadConfig();
        if (this.hasExplicitStatePreference(key)) {
          return false;
        }

        const currentValue = !!this.retrieveState(key);
        if (currentValue === shouldEnable && this.isSystemControlledPreference(key)) {
          return false;
        }

        this.updateState({ [key]: shouldEnable }, { source: 'system' });
        return true;
      },

      applySystemMotionPreference(shouldEnable) {
        return this.applySystemTogglePreference('pause-motion', shouldEnable);
      },

      applySystemContrastPreference(shouldEnable) {
        return this.applySystemTogglePreference('high-contrast-mode', shouldEnable);
      },

      detectSystemPreferences() {
        if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;

        const reducedMotionQuery = this.ensureMediaQuery(SYSTEM_PREFERS_REDUCED_MOTION);
        const shouldPauseMotion = !!reducedMotionQuery?.matches;
        const motionChanged = this.applySystemMotionPreference(shouldPauseMotion);

        // prefers-contrast: more → high-contrast mode by default (user override
        // wins). prefers-color-scheme is intentionally NOT auto-applied: most
        // sites handle dark mode themselves and force-filtering them would make
        // things worse, not better.
        const contrastQuery = this.ensureMediaQuery(SYSTEM_PREFERS_CONTRAST);
        const shouldHighContrast = !!contrastQuery?.matches;
        const contrastChanged = this.applySystemContrastPreference(shouldHighContrast);

        if (motionChanged || contrastChanged) {
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
        const contrastQuery = this.ensureMediaQuery(SYSTEM_PREFERS_CONTRAST);

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
            this.syncMenuUI();
          }
        };

        const onContrastChange = (event) => {
          const changed = this.applySystemContrastPreference(!!event.matches);
          if (changed) {
            this.applyEnhancements();
            this.syncMenuUI();
          }
        };

        listen(reducedMotionQuery, onReducedMotionChange);
        listen(contrastQuery, onContrastChange);
      },

      // Hide Images keeps each picture's space, so the page does not jump, and
      // leaves alone the icons that controls are made of: an icon-only button
      // or link would otherwise turn into a blank, unlabeled-looking box.
      // Embedded frames stay too; one can be a payment form or a map.
      concealImages(enable = false) {
        const styleId = `acc-hide-images`;
        this.removeStyle(styleId);
        document.documentElement.classList.toggle(styleId, enable);
        if (enable) {
          const S = 'body > *:not(.acc-container)';
          const inButton = ':is(button, [role="button"], summary)';
          const inControl = ':is(a, button, label, summary, [role="button"], [role="link"], [role="tab"], [role="menuitem"])';
          const css = `
        ${S} img:not(${inButton} img),
        ${S} picture:not(${inButton} picture),
        ${S} svg:not(.acc-container svg):not(${inControl} svg),
        ${S} video,
        ${S} canvas,
        ${S} .video,
        ${S} .image {
          visibility: hidden !important;
        }
      `;
          this.injectStyle(styleId, css);
        }
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
          if (child.classList.contains('acc-rg-container')) return;
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
          this.concealImages(states && states['hide-images']);
          this.highlightLinks(states && states['highlight-links']);
          this.adjustLetterSpacing(states && states['letter-spacing']);
          this.adjustLineSpacing(states && states['line-spacing']);
          this.enableBoldText(states && states['bold-text']);
          this.enableReadableText(states && states['readable-text']);
          this.enableReadingAid(states && states['reading-aid']);
          this.pauseMotion(states && states['pause-motion']);
          this.enableLargePointer(states && states['large-pointer']);
          this.enableAnnotations(states && states['annotations']);
          this.enableTextToSpeech(states && states['text-to-speech']);
          this.enableSimpleLayout(states && states['simple-layout']);
          // After Simplify Layout, which changes the sizes Font Size starts from.
          this.scaleText(this.resolveTextScale(states && states['text-scale']));
          this.enableMuteSounds(states && states['mute-sounds']);
          this.enableTextMagnifier(states && states['text-magnifier']);
          this.enableTooltips(states && states['tooltips']);
          // Last, so Smart Contrast reads the colors the options above left.
          this.applyContrastMode(states);
        },

      resetEnhancements() {
          this.saveConfig({ states: {}, systemDefaults: {}, profileSnapshots: {} });
          this.activeColorFilterKey = null;
          this.unfilteredBodyBackground = null;
          // Drops a reading font still waiting for its file.
          this.readableFontRequest = (this.readableFontRequest || 0) + 1;
          Object.keys(this.multiLevelFeatures).forEach(key => {
            this.multiLevelFeatures[key].currentIndex = -1;
          });
          const selected = this.queryWidgetAll('.acc-selected');
          selected.forEach(el => {
            el.classList.remove("acc-selected");
            el.setAttribute('aria-pressed', 'false');
          });
          const indicators = this.queryWidgetAll('.acc-progress-indicator');
          indicators.forEach(indicator => {
            const dots = indicator.querySelectorAll('.acc-progress-dot');
            dots.forEach(dot => dot.classList.remove('active'));
          });
          const menu = this.queryWidget('.acc-menu');
          
          // Remove focus from active element to fix the persistent focus ring bug
          const focused = this.getActiveElement();
          if (focused && typeof focused.blur === 'function') {
            focused.blur();
          }
          const styleIds = [
            'acc-bold-text',
            'acc-letter-spacing',
            'acc-line-spacing',
            'acc-large-pointer',
            'acc-highlight-links',
            'acc-readable-text',
            'acc-pause-motion',
            'acc-hide-images',
            'acc-filter-style',
            'acc-dark-contrast',
            'acc-high-contrast-mode',
            'acc-simple-layout'
          ];
          styleIds.forEach(id => this.removeStyle(id));
          this.clearSimpleLayoutDomMutations();
          document.documentElement.classList.remove(
            'acc-filter',
            'acc-dark-contrast',
            'acc-smart-contrast',
            'acc-saturation',
            'acc-bold-text',
            'acc-letter-spacing',
            'acc-line-spacing',
            'acc-large-pointer',
            'acc-highlight-links',
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
          this.textScaleLayout = null;
          this.clearTextScale();
          this.refreshSmartContrast();
          this.enableReadingAid(false);
          this.disableAnnotations();
          this.stopSpeech();
          this.stopTtsClickMode();
          this.setMediaMotionPaused(false);
          this.enableMuteSounds(false);
          this.enableTextMagnifier(false);
          this.enableTooltips(false);
          this.clearSystemPreferenceListeners();
          this.detectSystemPreferences();
          this.setupMediaQueryListeners();
          // System defaults may have switched features back on just now.
          this.syncMenuUI(menu);
          this.updateViolationBubble(this.axeScanResults);
        },

    };

    /** @typedef {import('../index.js').default} AccessibleWebWidget */

    /** @type {{ [methodName: string]: (this: AccessibleWebWidget, ...args: any[]) => any }} */
    const ttsMethods = {

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
          pt: 'pt-BR',
          it: 'it-IT',
          fr: 'fr-FR',
          de: 'de-DE',
          es: 'es-ES',
          ru: 'ru-RU',
          pl: 'pl-PL',
          ro: 'ro-RO',
          nl: 'nl-NL',
          uk: 'uk-UA',
          ar: 'ar-SA',
          he: 'he-IL'
        };
        return languageMap[code] || code;
      },

      getNativeTtsRate() {
        const configured = Number(this.nativeTtsConfig?.rate);
        if (!Number.isFinite(configured)) return 1;
        return Math.min(2, Math.max(0.5, configured));
      },

      // Map a persisted text-to-speech state to a speed choice. Legacy configs
      // stored a boolean (true = the only speed there was, normal).
      resolveTtsSpeed(value) {
        const choices = this.ttsSpeedChoices || [];
        if (value === true) return choices[0] || null;
        if (typeof value !== 'string') return null;
        return choices.find((choice) => choice.key === value) || null;
      },

      // Index of the active speed level, -1 when Text to Speech is off.
      getTtsSpeedLevel(value) {
        const choice = this.resolveTtsSpeed(value);
        return choice ? this.ttsSpeedChoices.indexOf(choice) : -1;
      },

      // The site's ttsRate is the normal speed; slow and fast scale from it.
      getTtsSpeechRate() {
        const choice = this.resolveTtsSpeed(this.retrieveState('text-to-speech'));
        const rate = this.getNativeTtsRate() * (choice ? choice.rate : 1);
        return Math.min(2, Math.max(0.5, Math.round(rate * 100) / 100));
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
        utterance.rate = this.getTtsSpeechRate();
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
        utterance.rate = this.getTtsSpeechRate();
        utterance.pitch = this.getNativeTtsPitch();
        synth.speak(utterance);
      },

    };

    /** @typedef {import('../index.js').default} AccessibleWebWidget */


    const AXE_RUN_OPTIONS = {
      runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice']
    };

    /** @type {{ [methodName: string]: (this: AccessibleWebWidget, ...args: any[]) => any }} */
    const axeReportMethods = {

      getAxeCoreSource() {
        const rawUrl = typeof this.options?.axeCoreUrl === 'string' ? this.options.axeCoreUrl.trim() : '';
        if (rawUrl && !/["'\\\s]/.test(rawUrl)) {
          const rawIntegrity = typeof this.options?.axeCoreIntegrity === 'string' ? this.options.axeCoreIntegrity.trim() : '';
          return { src: rawUrl, integrity: rawIntegrity };
        }
        return { src: AXE_CORE_SRC, integrity: AXE_CORE_INTEGRITY };
      },

      loadAxeCore() {
        if (this.axeCoreLoaded && window.axe) {
          return Promise.resolve(window.axe);
        }
      
        if (this.axeCorePromise) {
          return this.axeCorePromise;
        }
        this.axeCorePromise = new Promise((resolve, reject) => {
          let script = document.querySelector('script[data-acc-axe-core="true"]');
          let settled = false;
          let timeoutId = null;
      
          const settleSuccess = () => {
            if (settled) return;
            settled = true;
            if (timeoutId) clearTimeout(timeoutId);
            if (!window.axe) {
              this.axeCoreLoaded = false;
              this.axeCorePromise = null;
              reject(new Error('axe-core loaded but window.axe is unavailable'));
              return;
            }
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
            this.axeCoreLoaded = false;
            this.axeCorePromise = null;
            reject(error);
          };
      
          if (window.axe) {
            settleSuccess();
            return;
          }
      
          const { src, integrity } = this.getAxeCoreSource();
          if (!src) {
            settleError(new Error('No axe-core source is configured; set the axeCoreUrl option.'));
            return;
          }
          let resolvedSrc = src;
          try {
            resolvedSrc = new URL(src, document.baseURI).href;
          } catch {
            // Keep the raw value; the browser will surface a load error if it is invalid.
          }

          if (script && script.src !== resolvedSrc) {
            script.remove();
            script = null;
          }

          if (!script) {
            script = document.createElement('script');
            script.src = src;
            script.async = true;
            if (integrity) {
              script.integrity = integrity;
              script.crossOrigin = 'anonymous';
            }
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
        const bubble = this.violationBubble || this.queryWidget('.acc-violation-bubble');
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
        // Hard guarantee that axe-core is never fetched or run outside dev
        // mode, regardless of which feature asks for a scan.
        if (!this.isDevMode()) {
          this.updateViolationBubble({ violations: [] });
          return { violations: [] };
        }

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

      async runAccessibilityReport() {
        // Create or get report panel
        let panel = this.reportPanel && document.body.contains(this.reportPanel)
          ? this.reportPanel
          : null;

        if (!panel) {
          panel = this.createReportPanel();
          document.body.appendChild(panel);
          this.reportPanel = panel;
        }
      
        this.openReportPanel(panel);
      
        const contentArea = this.findElement('.acc-report-content', panel);
      
        // Show loading state
        contentArea.innerHTML = `<div class="acc-report-loading">${this.translate('Analyzing page...')}</div>`;
      
        try {
          const results = await this.runBackgroundAxeScan({ force: true });

          this.displayReportResults(panel, results);
      
        } catch (error) {
          contentArea.innerHTML = `<div class="acc-report-error">Error: ${this.escapeHtml(error.message)}</div>`;
        }
      },

      getReportFocusableElements(panel) {
        if (!panel) return [];
        const dialog = this.findElement('.acc-report-dialog', panel);
        return this.getFocusableElements(dialog || panel);
      },

      openReportPanel(panel) {
        if (!panel) return;
      
        const currentlyFocused = this.getActiveElement();
        this.reportPreviousFocus = currentlyFocused && typeof currentlyFocused.focus === 'function'
          ? currentlyFocused
          : null;
      
        panel.classList.add('acc-report-visible');
        panel.setAttribute('aria-hidden', 'false');
        panel.setAttribute('dir', this.getUiDirection());

        // Where the system always shows scrollbars, the content gives up that
        // much end padding so the cards stay centred (see report.css).
        const scroller = this.findElement('.acc-report-content', panel);
        if (scroller) {
          const gutter = Math.max(0, scroller.offsetWidth - scroller.clientWidth);
          panel.style.setProperty('--acc-report-gutter', `${gutter}px`);
        }
      
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
            this.closeReportPanel(panel);
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
          const active = this.getActiveElement();
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
          this.focusQuietlyAfterPointer(focusables.length ? focusables[0] : focusTarget);
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
          <div class="acc-report-heading">
            <h2 id="acc-report-title" class="acc-report-title">${this.translate('Accessibility Report')}</h2>
            <span class="acc-report-powered">Powered by axe-core</span>
          </div>
          <button type="button" class="acc-report-close" aria-label="${this.translate('Close')}">${this.widgetIcons.close}</button>
        </div>
        <div class="acc-report-content"></div>
      </div>
    `;
      
        // Close handlers
        const closeBtn = panel.querySelector('.acc-report-close');
        const overlay = panel.querySelector('.acc-report-overlay');
      
        closeBtn.addEventListener('click', () => this.closeReportPanel(panel));
        overlay.addEventListener('click', () => this.closeReportPanel(panel));
      
        return panel;
      },

      // Colours an HTML snippet the way a code editor would: tags, attribute
      // names and values each get a class. Every piece is escaped on the way.
      highlightHtml(source) {
        const text = String(source || '');
        const wrap = (kind, value) => `<span class="acc-code-${kind}">${this.escapeHtml(value)}</span>`;
        const pattern = /(<\/?)([A-Za-z][\w:-]*)|([^\s"'<>=/]+)(=)("[^"]*"?|'[^']*'?)|(\/?>)/g;
        let html = '';
        let last = 0;
        let match;
        while ((match = pattern.exec(text))) {
          html += this.escapeHtml(text.slice(last, match.index));
          if (match[1]) {
            html += wrap('punct', match[1]) + wrap('tag', match[2]);
          } else if (match[3]) {
            html += wrap('attr', match[3]) + wrap('punct', match[4]) + wrap('value', match[5]);
          } else {
            html += wrap('punct', match[6]);
          }
          last = pattern.lastIndex;
        }
        return html + this.escapeHtml(text.slice(last));
      },

      // What the check says about one element. Violations carry a summary;
      // items that need review only carry each check's own message.
      getReportNodeMessage(node) {
        const summary = node && node.failureSummary;
        if (summary) {
          // Drop the lead-in line ("Fix any of the following:") when one
          // reason follows it, so the reason reads on its own.
          const lines = String(summary).split('\n').map(line => line.trim()).filter(Boolean);
          return lines.length === 2 && /:$/.test(lines[0]) ? lines[1] : lines.join('\n');
        }
        const checks = [].concat(node?.any || [], node?.all || [], node?.none || []);
        const withMessage = checks.find(check => check && check.message);
        return withMessage ? String(withMessage.message) : '';
      },

      // One result as a card: a row that opens to show what is wrong, where
      // to read more, and the elements it was found on.
      renderReportItem(item, id, { showImpact = true } = {}) {
        const safeHelpUrl = this.sanitizeUrl(item.helpUrl);
        const nodes = item.nodes || [];
        return `
      <div class="acc-report-violation">
        <button type="button" class="acc-report-violation-header" aria-expanded="false" aria-controls="${id}">
          ${showImpact && item.impact ? `<span class="acc-report-violation-impact ${this.escapeHtml(item.impact)}">${this.translate(this.capitalizeFirst(item.impact))}</span>` : ''}
          <span class="acc-report-violation-title">${this.escapeHtml(item.help)}</span>
          <span class="acc-report-violation-count">${nodes.length} ${this.translate('Element')}${nodes.length > 1 ? 's' : ''}</span>
        </button>
        <div class="acc-report-violation-details" id="${id}">
          <p class="acc-report-violation-desc">${this.escapeHtml(item.description)}</p>
          ${safeHelpUrl ? `<a class="acc-report-violation-help" href="${safeHelpUrl}" target="_blank" rel="noopener"><span>${this.translate('How to Fix')}</span>${this.widgetIcons.externalLink}</a>` : ''}
          ${nodes.slice(0, 5).map(node => {
            const message = this.getReportNodeMessage(node);
            return `
            <div class="acc-report-node">
              <div class="acc-report-code">
                <div class="acc-report-code-bar">
                  <span class="acc-report-code-lang">HTML</span>
                  <button type="button" class="acc-report-copy" aria-label="${this.translate('Copy')}">${this.widgetIcons.copy}</button>
                </div>
                <pre class="acc-report-node-html">${this.highlightHtml(node.html)}</pre>
              </div>
              ${message ? `<p class="acc-report-node-fix"><strong>${this.translate('Issue')}:</strong> ${this.escapeHtml(message)}</p>` : ''}
            </div>`;
          }).join('')}
          ${nodes.length > 5 ? `<p class="acc-report-note">... and ${nodes.length - 5} more elements</p>` : ''}
        </div>
      </div>
    `;
      },

      // Copies an element's HTML and shows a check for a moment.
      copyReportCode(button) {
        const code = button.closest('.acc-report-code')?.querySelector('.acc-report-node-html');
        const text = code ? code.textContent : '';
        const done = () => {
          button.innerHTML = this.widgetIcons.check;
          button.setAttribute('aria-label', this.translate('Copied'));
          button.classList.add('acc-report-copied');
          clearTimeout(button.accCopyTimer);
          button.accCopyTimer = setTimeout(() => {
            button.innerHTML = this.widgetIcons.copy;
            button.setAttribute('aria-label', this.translate('Copy'));
            button.classList.remove('acc-report-copied');
          }, 2000);
        };
        const fallback = () => {
          // Without clipboard access (an insecure page, or permission denied),
          // select the code so the usual copy shortcut works on it.
          const selection = window.getSelection && window.getSelection();
          if (!selection || !code) return;
          const range = document.createRange();
          range.selectNodeContents(code);
          selection.removeAllRanges();
          selection.addRange(range);
          try {
            if (document.execCommand && document.execCommand('copy')) done();
          } catch {
            // The code stays selected for the visitor to copy by hand.
          }
        };
        if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
          navigator.clipboard.writeText(text).then(done, fallback);
        } else {
          fallback();
        }
      },

      displayReportResults(panel, results) {
        const contentArea = this.findElement('.acc-report-content', panel);
      
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
      
        // How much passed is the heading over the four tiles. It is context,
        // not a problem to open, so it is not a tile itself.
        let html = `
      <div class="acc-report-section">
      <div class="acc-report-section-title acc-report-passed">${this.widgetIcons.check}<span>${passes.length} ${this.translate('Passed Tests')}</span></div>
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
      </div>
      </div>
    `;
      
        if (violations.length === 0) {
          html += `
        <div class="acc-report-success">
          <div class="acc-report-success-icon">${this.widgetIcons.check}</div>
          <h3>${this.translate('No Issues Found')}</h3>
        </div>
      `;
        } else {
          // Sort by severity
          const severityOrder = { critical: 0, serious: 1, moderate: 2, minor: 3 };
          violations.sort((a, b) => (severityOrder[a.impact] ?? 4) - (severityOrder[b.impact] ?? 4));
      
          html += `<div class="acc-report-section">
        <div class="acc-report-section-title">${this.translate('Violations Found')} (${violations.length})</div>
        ${violations.map((violation, index) => this.renderReportItem(violation, `acc-report-violation-${index}`)).join('')}
      </div>`;
        }
      
        if (incomplete.length > 0) {
          html += `
        <div class="acc-report-section">
          <div class="acc-report-section-title">${this.translate('Items Need Review')} (${incomplete.length})</div>
          <p class="acc-report-note">A person needs to check these.</p>
          ${incomplete.map((item, index) => this.renderReportItem(item, `acc-report-review-${index}`, { showImpact: false })).join('')}
        </div>
      `;
        }
      
        contentArea.innerHTML = html;
      
        // Each card opens and closes on its own.
        contentArea.querySelectorAll('.acc-report-violation-header').forEach(header => {
          header.addEventListener('click', () => {
            const expanded = header.parentElement.classList.toggle('expanded');
            header.setAttribute('aria-expanded', expanded ? 'true' : 'false');
          });
        });
        contentArea.querySelectorAll('.acc-report-copy').forEach(button => {
          button.addEventListener('click', () => this.copyReportCode(button));
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

      sanitizeUrl(url) {
        const value = String(url || '').trim();
        if (!/^https?:\/\//i.test(value)) return '';
        return value.replace(/"/g, '%22').replace(/'/g, '%27');
      },

      closeReportPanel(panel = this.reportPanel) {
        if (panel) {
          panel.classList.remove('acc-report-visible');
          panel.setAttribute('aria-hidden', 'true');
          // The structure panel's item buttons capture live page elements; drop
          // them on close so detached DOM (e.g. after SPA navigation) can be
          // garbage-collected. The panel is rebuilt from scratch on every open.
          if (panel === this.structurePanel) {
            const content = panel.querySelector('.acc-report-content');
            if (content) content.innerHTML = '';
          }
        }
      
        if (this.reportKeyListener) {
          document.removeEventListener('keydown', this.reportKeyListener, true);
          this.reportKeyListener = null;
        }
      
        const focusTarget = this.reportPreviousFocus;
        this.reportPreviousFocus = null;
        this.focusQuietlyAfterPointer(focusTarget);
      },

    };

    /** @typedef {import('../index.js').default} AccessibleWebWidget */

    const MAX_ANNOTATIONS = 50;

    /** @type {{ [methodName: string]: (this: AccessibleWebWidget, ...args: any[]) => any }} */
    const annotationMethods = {

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

        const safeHelpUrl = this.sanitizeUrl(annotation.helpUrl);
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
      ${safeHelpUrl ? `<p><a href="${safeHelpUrl}" target="_blank" rel="noopener">${this.translate('How to Fix')} →</a></p>` : ''}
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
        // Annotations are dev tooling. A persisted 'annotations' state must not
        // activate (or pull axe-core) on later visits outside dev mode;
        // the state is kept so the tool revives when dev mode returns.
        if (!enable || !this.isDevMode()) {
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

    };

    /** @typedef {import('../index.js').default} AccessibleWebWidget */

    /** @type {{ [methodName: string]: (this: AccessibleWebWidget, ...args: any[]) => any }} */
    const visualFilterMethods = {

      // The Contrast tile shows the active choice by name. Light Contrast is
      // stored under the old High Contrast key (see contrastModes).
      getContrastToggleDisplay(index) {
          const control = 'Contrast';
          if (index === 0) {
            return { key: 'smart-contrast', control, label: 'Smart Contrast', icon: this.widgetIcons.smartContrast };
          }
          if (index === 1) {
            return { key: 'dark-contrast', control, label: 'Dark Contrast', icon: this.widgetIcons.darkContrast };
          }
          if (index === 2) {
            return { key: 'light-contrast', control, label: 'Light Contrast', icon: this.widgetIcons.lightContrast };
          }
          return { key: null, control, label: control, icon: this.widgetIcons.contrast };
        },

      // The active Contrast choice as its state key, or null. Light wins over
      // Dark, and Dark over Smart, when a profile or an old save leaves more
      // than one on. A saved "light-contrast" is the faint filter the tile
      // once had; it now means Light Contrast.
      getContrastMode(states = this.loadConfig().states || {}) {
          if (!states) return null;
          if (states['high-contrast-mode'] || states['light-contrast']) return 'high-contrast-mode';
          if (states['dark-contrast']) return 'dark-contrast';
          if (states['smart-contrast']) return 'smart-contrast';
          return null;
        },

      setContrastUI(menu, mode = null) {
          if (!menu || !menu.querySelector) return;
          const feature = this.multiLevelFeatures?.['contrast-toggle'];
          if (!feature) return;
          const index = mode ? feature.values.indexOf(mode) : -1;
          feature.currentIndex = index;
          const button = menu.querySelector('.acc-btn[data-key="contrast-toggle"]');
          if (!button) return;
          this.updateContrastToggleButton(button, index);
          const isActive = index >= 0;
          button.classList.toggle('acc-selected', isActive);
          button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
          button.querySelectorAll('.acc-progress-dot').forEach((dot, dotIndex) => {
            dot.classList.toggle('active', dotIndex === index);
          });
        },

      // Text is often laid over a picture: a banner photo with a headline on
      // it. Mark the blocks that sit over a picture, so Dark and Light
      // Contrast can dim the picture behind them rather than cover it with a
      // solid box, and so Smart Contrast leaves them alone (it cannot see the
      // picture). A block counts when at least half of it lies over the
      // picture and it is not the picture's own container.
      markMediaOverlays() {
          this.clearMediaOverlays();
          const skip = '.acc-container, .acc-rg-container, #acc-widget-host';
          const pictures = [];
          document.querySelectorAll('img, video, canvas').forEach((media) => {
            if (media.closest(skip)) return;
            const box = media.getBoundingClientRect();
            if (box.width >= 120 && box.height >= 80) pictures.push({ media, box });
          });
          const shared = (a, b) => Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left))
            * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
          pictures.forEach(({ media, box: picture }) => {
            const pictureArea = picture.width * picture.height;
            let child = media;
            let parent = media.parentElement;
            for (let depth = 0; parent && parent !== document.documentElement && depth < 6; depth++) {
              Array.from(parent.children).forEach((sibling) => {
                if (sibling === child || sibling.hasAttribute('data-acc-over-media') || sibling.matches(skip)) return;
                if (!sibling.textContent || !sibling.textContent.trim()) return;
                const box = sibling.getBoundingClientRect();
                const area = box.width * box.height;
                if (!area || !shared(picture, box)) return;
                // A banner is often two or more pictures side by side; count
                // what the block shares with all of them.
                const covered = pictures.reduce((sum, other) => sum + shared(other.box, box), 0);
                if (covered >= area * 0.5) sibling.setAttribute('data-acc-over-media', '');
              });
              // Past an ancestor far larger than the picture, nothing more
              // is laid over it.
              const frame = parent.getBoundingClientRect();
              if (parent === document.body || frame.width * frame.height > pictureArea * 4) break;
              child = parent;
              parent = parent.parentElement;
            }
          });
        },

      clearMediaOverlays() {
          document.querySelectorAll('[data-acc-over-media]').forEach((element) => {
            element.removeAttribute('data-acc-over-media');
          });
        },

      // Many icons are drawn as a mask filled with a background color. Dark
      // Contrast turns every background black, which would erase them, so
      // mark them and let them take the text color instead. "self" is an
      // element that is itself the icon; "before" and "after" are icons drawn
      // in front of or behind an element's text.
      markMaskIcons() {
          this.clearMaskIcons();
          const skip = '.acc-container, .acc-rg-container, #acc-widget-host';
          const masked = (style) => {
            const mask = style.maskImage || style.webkitMaskImage || '';
            return !!mask && mask !== 'none';
          };
          const elements = document.body.getElementsByTagName('*');
          const limit = Math.min(elements.length, 6000);
          const found = [];
          for (let index = 0; index < limit; index++) {
            const element = elements[index];
            if (element.namespaceURI !== 'http://www.w3.org/1999/xhtml') continue;
            const parts = [];
            if (!element.firstElementChild && masked(window.getComputedStyle(element))) parts.push('self');
            if (masked(window.getComputedStyle(element, '::before'))) parts.push('before');
            if (masked(window.getComputedStyle(element, '::after'))) parts.push('after');
            if (parts.length && !element.closest(skip)) found.push([element, parts.join(' ')]);
          }
          found.forEach(([element, parts]) => element.setAttribute('data-acc-mask-icon', parts));
        },

      clearMaskIcons() {
          document.querySelectorAll('[data-acc-mask-icon]').forEach((element) => {
            element.removeAttribute('data-acc-mask-icon');
          });
        },

      // Put the active Contrast choice on the page. Light is the High
      // Contrast rules, Dark has its own, and Smart Contrast runs only when
      // neither is on, since both already set every color.
      applyContrastMode(states = this.loadConfig().states || {}) {
          const mode = this.getContrastMode(states);
          try {
            if (mode) {
              this.markMediaOverlays();
            } else {
              this.clearMediaOverlays();
            }
            if (mode === 'dark-contrast') {
              this.markMaskIcons();
            } else {
              this.clearMaskIcons();
            }
          } catch (e) {
            console.warn('Error preparing contrast:', e);
          }
          this.enableHighContrastMode(mode === 'high-contrast-mode');
          const isDark = mode === 'dark-contrast';
          if (isDark) {
            this.injectStyle('acc-dark-contrast', this.buildDarkContrastCss());
          } else {
            this.removeStyle('acc-dark-contrast');
          }
          document.documentElement.classList.toggle('acc-dark-contrast', isDark);
          // The body color has just changed; a color filter must match it.
          if (this.activeColorFilterKey || this.hasStyle('acc-filter-style')) this.applyVisualFilters();
          this.refreshSmartContrast({ rescan: true });
          // Pictures and styles that arrive with the rest of the page change
          // what lies over what; look once more when the page has loaded.
          if (mode && document.readyState !== 'complete' && !this.contrastLoadHandler) {
            this.contrastLoadHandler = () => {
              this.contrastLoadHandler = null;
              this.applyContrastMode();
            };
            window.addEventListener('load', this.contrastLoadHandler, { once: true });
          }
        },

      applyModeToggleButtonDisplay(button, display, modeAttribute) {
          if (!button) return;
          const iconNode = button.querySelector('svg');
          if (iconNode) {
            iconNode.outerHTML = display.icon;
          } else {
            button.insertAdjacentHTML('afterbegin', display.icon);
          }

          const labelNode = button.querySelector('.acc-label');
          if (labelNode) {
            labelNode.setAttribute('data-acc-text', display.label);
            labelNode.innerText = this.translate(display.label);
          }
          // The visible label shows only the active level ("Light Contrast");
          // the accessible name also names the control ("Contrast: Light
          // Contrast") and is rebuilt from these attributes by translateMenuUI()
          // on a language switch.
          button.setAttribute('data-acc-text', display.control);
          if (display.key) {
            button.setAttribute('data-acc-level-text', display.label);
          } else {
            button.removeAttribute('data-acc-level-text');
          }
          const accessibleName = this.getTranslatedText(button);
          button.setAttribute('title', accessibleName);
          button.setAttribute('aria-label', accessibleName);
          button.setAttribute(modeAttribute, display.key || 'off');
        },

      updateContrastToggleButton(button, index) {
          this.applyModeToggleButtonDisplay(button, this.getContrastToggleDisplay(index), 'data-contrast-mode');
        },

      getSaturationToggleDisplay(index) {
          const control = 'Saturation';
          if (index === 0) {
            return { key: 'low-saturation', control, label: 'Low Saturation', icon: this.widgetIcons.lowSaturation };
          }
          if (index === 1) {
            return { key: 'high-saturation', control, label: 'High Saturation', icon: this.widgetIcons.highSaturation };
          }
          if (index === 2) {
            return { key: 'monochrome', control, label: 'Monochrome', icon: this.widgetIcons.monochrome };
          }
          return { key: null, control, label: control, icon: this.widgetIcons.saturation };
        },

      updateSaturationToggleButton(button, index) {
          this.applyModeToggleButtonDisplay(button, this.getSaturationToggleDisplay(index), 'data-saturation-mode');
        },

      getReadableFontDisplay(index) {
          const fontKey = index >= 0 ? (this.readableFontTileKeys || [])[index] : null;
          const choice = fontKey ? (this.readableFontChoices || []).find((entry) => entry.key === fontKey) : null;
          const control = 'Readable Font';
          return {
            key: choice ? choice.key : null,
            control,
            label: choice ? choice.label : control,
            icon: this.widgetIcons.readableFont
          };
        },

      // The Dyslexia Font tile: on when that is the reading font in use. It
      // shares the readable-text state with the Readable Font tile, so
      // switching one font on switches the other tile's font off.
      toggleDyslexiaFont(menu, button) {
          const current = this.resolveReadableFontChoice(this.retrieveState('readable-text'));
          const enable = !(current && current.key === 'dyslexic');
          const value = enable ? 'dyslexic' : false;
          this.updateState({ 'readable-text': value });
          this.enableReadableText(value);
          this.setReadableFontUI(menu, value || null);
          if (button) this.announceFeatureState(button.getAttribute('aria-label'), enable);
        },

      setReadableFontUI(menu, activeKey = null) {
          if (!menu || !menu.querySelector) return;
          const feature = this.multiLevelFeatures?.['readable-text'];
          if (!feature) return;
          const index = activeKey ? feature.values.indexOf(activeKey) : -1;
          feature.currentIndex = index;
          const dyslexiaButton = menu.querySelector('.acc-btn[data-key="dyslexia-font"]');
          if (dyslexiaButton) {
            const isDyslexic = activeKey === 'dyslexic';
            dyslexiaButton.classList.toggle('acc-selected', isDyslexic);
            dyslexiaButton.setAttribute('aria-pressed', isDyslexic ? 'true' : 'false');
          }
          const button = menu.querySelector('.acc-btn[data-key="readable-text"]');
          if (!button) return;
          this.applyModeToggleButtonDisplay(button, this.getReadableFontDisplay(index), 'data-readable-font-mode');
          const isActive = index >= 0;
          button.classList.toggle('acc-selected', isActive);
          button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
          const indicator = button.querySelector('.acc-progress-indicator[data-feature="readable-text"]');
          if (indicator) {
            indicator.querySelectorAll('.acc-progress-dot').forEach((dot, dotIndex) => {
              dot.classList.toggle('active', dotIndex === index);
            });
          }
        },

      // Font Size, Line Height, Letter Spacing and Text to Speech step
      // through an amount. Their tiles keep the plain name at every step and
      // the dots show which step is on; people judge the amount on the page,
      // not from a number. The dots are only visible, so the name a screen
      // reader hears carries the step ("Font Size: 2").
      getLevelTileText(featureKey, index) {
          const feature = this.multiLevelFeatures?.[featureKey];
          return feature && index >= 0 && index < feature.levels ? String(index + 1) : '';
        },

      setLevelTileUI(menu, featureKey, index) {
          if (!menu || !menu.querySelector) return;
          const feature = this.multiLevelFeatures?.[featureKey];
          if (!feature) return;
          feature.currentIndex = index;
          const button = menu.querySelector(`.acc-btn[data-key="${featureKey}"]`);
          if (!button) return;
          const levelText = this.getLevelTileText(featureKey, index);
          if (levelText) {
            button.setAttribute('data-acc-level-text', levelText);
          } else {
            button.removeAttribute('data-acc-level-text');
          }
          const accessibleName = this.getTranslatedText(button);
          button.setAttribute('title', accessibleName);
          button.setAttribute('aria-label', accessibleName);
          const isActive = index >= 0;
          button.classList.toggle('acc-selected', isActive);
          button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
          button.querySelectorAll('.acc-progress-dot').forEach((dot, dotIndex) => {
            dot.classList.toggle('active', dotIndex === index);
          });
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
            case 'monochrome': {
              // filter: grayscale(100%) — luminance-weighted
              const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
              r = lum; g = lum; b = lum;
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

      // Dark Contrast: black page, white text, yellow links. The same shape
      // as Light Contrast (the High Contrast rules) with the colors turned
      // around.
      buildDarkContrastCss() {
          const X = ':not(.acc-container):not(.acc-container *):not(.acc-rg-container):not(.acc-rg-container *)';
          const shapes = 'path, circle, ellipse, rect, polygon, polyline, line';
          // Every rule starts from the class on <html>, which makes Dark
          // Contrast outrank Simplify Layout's colors whichever came first.
          const B = 'html.acc-dark-contrast body';
          return `
        html.acc-dark-contrast, ${B} {
          background: #000 !important;
          color: #fff !important;
        }

        ${B} *${X} {
          color: #fff !important;
          background-color: #000 !important;
          background-image: none !important;
          border-color: #fff !important;
          text-shadow: none !important;
          box-shadow: none !important;
        }

        /* Decorations drawn with ::before and ::after would stay light
           behind the white text. */
        ${B} *${X}::before,
        ${B} *${X}::after {
          color: #fff !important;
          background-color: transparent !important;
          background-image: none !important;
          border-color: #fff !important;
          box-shadow: none !important;
        }

        /* Icons drawn as a mask take the text color (see markMaskIcons). */
        ${B} [data-acc-mask-icon~="self"]${X},
        ${B} [data-acc-mask-icon~="before"]${X}::before,
        ${B} [data-acc-mask-icon~="after"]${X}::after {
          background-color: currentColor !important;
        }

        /* Text laid over a picture: dim the picture behind it instead of
           covering it (see markMediaOverlays). */
        ${B} [data-acc-over-media]${X} {
          background-color: rgba(0, 0, 0, 0.65) !important;
        }

        ${B} [data-acc-over-media] *${X} {
          background-color: transparent !important;
        }

        /* Links: yellow and underlined, with whatever they wrap. */
        ${B} a${X},
        ${B} a${X} * {
          color: #ff0 !important;
        }

        ${B} a${X} {
          text-decoration: underline !important;
        }

        /* Pictures keep their own colors. */
        ${B} :where(img, picture, video, canvas, iframe, svg)${X} {
          background-color: transparent !important;
        }

        /* Icons that draw in the default black take the text color. Icons
           that set their own fill or stroke are left alone. */
        ${B} svg${X} :where(${shapes}):not([fill]):not([stroke]):not([fill] *):not([stroke] *) {
          fill: currentColor !important;
        }

        /* A logo or icon in dark ink would vanish on black; a thin light
           edge keeps its shape readable. */
        ${B} svg${X},
        ${B} :where(header, nav, footer, [role="banner"], [role="navigation"], [role="contentinfo"]) img${X} {
          filter: drop-shadow(0 0 1px #fff) drop-shadow(0 0 1px #fff) !important;
        }

        /* Inputs and buttons keep a visible edge. */
        ${B} :where(input:not([type="checkbox"]):not([type="radio"]):not([type="range"]), textarea, select, button)${X} {
          border: 2px solid #fff !important;
        }

        ${B} :where(input[type="checkbox"], input[type="radio"], input[type="range"])${X} {
          accent-color: #ff0 !important;
        }

        ${B} ::placeholder {
          color: #ccc !important;
          opacity: 1 !important;
        }

        ${B} :focus-visible${X} {
          outline: 3px solid #ff0 !important;
          outline-offset: 2px !important;
        }

        ${B} :where(table, th, td)${X} {
          border: 1px solid #fff !important;
        }
      `;
        },

      applyVisualFilters() {
          const { states } = this.loadConfig();
          const activeKey = this.getActiveColorFilterKey(states);
          this.activeColorFilterKey = activeKey;
          // Take the last filter off first, so the body color read below is
          // the page's own and not one that was already filtered.
          this.removeStyle('acc-filter-style');
          this.unfilteredBodyBackground = null;

          const filter = activeKey ? this.visualFilters[activeKey] : null;
          if (!filter) return;
          const adjustedFilter = {
            ...filter,
            selector: filter.selector || 'body > *:not(.acc-container):not(.acc-rg-container):not(#acc-skip-link)'
          };
          let css = this.buildCSS(adjustedFilter);

          // Compute a filtered body background so the body itself matches
          // the visual filter applied to its children. ":root:root" lets it
          // win over the body colors of Dark Contrast and Simplify Layout.
          const filteredBg = this.computeFilteredBodyColor(activeKey);
          if (filteredBg) {
            // Smart Contrast measures against the page's own color.
            this.unfilteredBodyBackground = window.getComputedStyle(document.body).backgroundColor;
            css += `:root:root body{background-color:${filteredBg}!important;}`;
          }

          this.injectStyle('acc-filter-style', css);
        },

      cycleMultiLevelFeature(featureKey, button) {
          const feature = this.multiLevelFeatures[featureKey];
          if (!feature || !button) return;
          const menu = button.closest('.acc-menu');

          if (featureKey === 'readable-text') {
            const newIndex = feature.currentIndex + 1;
            const newFontKey = newIndex >= feature.levels ? null : feature.values[newIndex];
            this.updateState({ 'readable-text': newFontKey || false });
            this.enableReadableText(newFontKey || false);
            this.setReadableFontUI(menu, newFontKey);
            // setReadableFontUI re-labels the button with the control and the
            // active font ("Readable Font: Lexend"), so the announcement reads
            // "Readable Font: Lexend On" / "Readable Font Off".
            this.announceFeatureState(button.getAttribute('aria-label'), !!newFontKey);
            return;
          }

          // Font Size: 110%, 125%, 150%, then back to 100% (off).
          if (featureKey === 'text-scale') {
            const newIndex = this.getTextScaleLevel(this.retrieveState('text-scale')) + 1;
            const multiplier = newIndex < feature.levels ? feature.values[newIndex] : 1;
            this.updateState({ 'text-scale': multiplier });
            this.scaleText(multiplier);
            // Large text needs less contrast than small text, so what Smart
            // Contrast fixed at the old size may no longer be right.
            this.refreshSmartContrast({ rescan: true });
            this.setLevelTileUI(menu, featureKey, multiplier > 1 ? newIndex : -1);
            this.announceFeatureState(button.getAttribute('aria-label'), multiplier > 1);
            return;
          }

          // Line Height and Letter Spacing: three steps, then off.
          if (featureKey === 'line-spacing' || featureKey === 'letter-spacing') {
            const isLine = featureKey === 'line-spacing';
            const current = isLine
              ? this.getLineSpacingLevel(this.retrieveState(featureKey))
              : this.getLetterSpacingLevel(this.retrieveState(featureKey));
            const newIndex = current + 1;
            const value = newIndex < feature.levels ? feature.values[newIndex] : false;
            this.updateState({ [featureKey]: value });
            if (isLine) {
              this.adjustLineSpacing(value);
            } else {
              this.adjustLetterSpacing(value);
            }
            this.setLevelTileUI(menu, featureKey, value ? newIndex : -1);
            this.announceFeatureState(button.getAttribute('aria-label'), !!value);
            return;
          }

          // Text to Speech: normal, slow, fast, then off. Each tap re-speaks
          // the "Text to Speech On" cue at the new speed.
          if (featureKey === 'text-to-speech') {
            const newIndex = this.getTtsSpeedLevel(this.retrieveState('text-to-speech')) + 1;
            const speedKey = newIndex < feature.levels ? feature.values[newIndex] : false;
            this.userInitiatedToggleKey = featureKey;
            try {
              this.updateState({ 'text-to-speech': speedKey });
              this.enableTextToSpeech(speedKey);
            } finally {
              this.userInitiatedToggleKey = null;
            }
            this.setLevelTileUI(menu, featureKey, speedKey ? newIndex : -1);
            this.announceFeatureState(button.getAttribute('aria-label'), !!speedKey);
            return;
          }

          // Contrast: Smart, Dark, Light, then off. One choice at a time.
          if (featureKey === 'contrast-toggle') {
            const current = feature.values.indexOf(this.getContrastMode());
            const newIndex = current + 1;
            const newMode = newIndex < feature.levels ? feature.values[newIndex] : null;
            const payload = { 'light-contrast': false };
            feature.values.forEach((modeKey) => {
              payload[modeKey] = modeKey === newMode;
            });
            this.updateState(payload);
            this.applyContrastMode();
            this.setContrastUI(menu, newMode);
            // "Contrast: Dark Contrast On" / "Contrast Off".
            this.announceFeatureState(button.getAttribute('aria-label'), !!newMode);
            return;
          }

          // Beyond those, only Saturation renders as a cycling color filter.
          if (featureKey !== 'saturation-toggle') return;

          const newIndex = feature.currentIndex + 1;
          const newActiveKey = newIndex >= feature.levels ? null : feature.values[newIndex];
          this.updateColorFilterState(newActiveKey);
          this.setColorFilterUI(menu, newActiveKey);
          this.applyVisualFilters();
          // setColorFilterUI re-labels the button with the control and the
          // active mode ("Saturation: Low Saturation"), so the announcement
          // reads "Saturation: Low Saturation On" / "Saturation Off".
          this.announceFeatureState(button.getAttribute('aria-label'), !!newActiveKey);
        },

    };

    /** @typedef {import('../index.js').default} AccessibleWebWidget */

    const STRUCTURE_MAX_ITEMS = 100;

    /** @type {{ [methodName: string]: (this: AccessibleWebWidget, ...args: any[]) => any }} */
    const pageToolMethods = {

      // ── Accessibility profiles ─────────────────────────────────────────

      toggleAccessibilityProfile(profileKey, menu = this.queryWidget('.acc-menu')) {
        const profile = (this.accessibilityProfiles || []).find(p => p.key === profileKey);
        if (!profile) return;

        const enable = !this.retrieveState(profileKey);
        const has = (object, key) => Object.prototype.hasOwnProperty.call(object || {}, key);
        // Where a snapshot keeps the color filter that was on before.
        const FILTER_SLOT = 'color-filter';

        // Keys also bundled by another currently-active profile must survive
        // this profile turning off, so sibling profiles stay truthful.
        const otherProfiles = (this.accessibilityProfiles || [])
          .filter((other) => other.key !== profileKey && this.retrieveState(other.key));
        const keysHeldByOtherProfiles = new Set();
        otherProfiles.forEach((other) => {
          Object.keys(other.states).forEach((key) => keysHeldByOtherProfiles.add(key));
        });
        const savedSnapshots = this.widgetConfig.profileSnapshots || {};

        if (enable) {
          // Snapshot explicit user choices for the bundled keys so disabling
          // the profile can restore them. Keys without an explicit choice are
          // left out and return to "no preference" on disable, which keeps
          // system defaults (prefers-reduced-motion, prefers-contrast) working.
          const snapshot = {};
          const payload = { [profileKey]: true };
          let colorFilterKey = null;
          Object.entries(profile.states).forEach(([key, value]) => {
            if (this.isColorFilterKey(key)) {
              colorFilterKey = key;
              return;
            }
            if (keysHeldByOtherProfiles.has(key)) {
              // Another profile switched this on already. What the visitor
              // had before is in that profile's snapshot, not in the state
              // as it stands now.
              const holder = otherProfiles.find((other) => has(other.states, key) && has(savedSnapshots[other.key], key));
              if (holder) snapshot[key] = savedSnapshots[holder.key][key];
            } else if (this.hasExplicitStatePreference(key)) {
              snapshot[key] = this.retrieveState(key);
            }
            // A level the visitor already chose stays; a profile only
            // switches on what is off.
            if (value === true && this.retrieveState(key)) return;
            payload[key] = value;
          });
          const filterBefore = this.getActiveColorFilterKey(this.widgetConfig.states);
          if (colorFilterKey) {
            snapshot[FILTER_SLOT] = filterBefore || null;
          }
          this.saveConfig({
            profileSnapshots: { ...savedSnapshots, [profileKey]: snapshot }
          });
          this.updateState(payload);
          // Monochrome already has less color than Low Saturation; it stays.
          if (colorFilterKey && !(colorFilterKey === 'low-saturation' && filterBefore === 'monochrome')) {
            this.updateColorFilterState(colorFilterKey);
          }
        } else {
          const snapshots = { ...savedSnapshots };
          const snapshot = snapshots[profileKey] || {};
          delete snapshots[profileKey];

          const restorePayload = { [profileKey]: false };
          const clearKeys = [];
          let restoreColorFilter = false;
          Object.keys(profile.states).forEach((key) => {
            if (keysHeldByOtherProfiles.has(key)) return;
            if (this.isColorFilterKey(key)) {
              // Only while the filter this profile switched on is still the
              // one in use; a filter the visitor has picked since stays.
              if (this.retrieveState(key)) restoreColorFilter = true;
              return;
            }
            if (has(snapshot, key)) {
              restorePayload[key] = snapshot[key];
            } else {
              clearKeys.push(key);
            }
          });

          this.updateState(restorePayload);
          if (clearKeys.length) {
            this.clearStates(clearKeys);
          }
          this.saveConfig({ profileSnapshots: snapshots });
          if (restoreColorFilter) {
            // Back to the filter that was on before the profile, if any.
            this.updateColorFilterState(snapshot[FILTER_SLOT] || null);
          }
          // Cleared keys may be governed by OS media queries; re-establish
          // those defaults immediately instead of waiting for the next load.
          this.detectSystemPreferences();
        }

        this.applyEnhancements();
        this.applyVisualFilters();
        this.syncMenuUI(menu);
        this.announceFeatureState(this.translate(profile.label), enable);
      },

      // ── Mute sounds ────────────────────────────────────────────────────

      applyMuteToMediaElements(root) {
        if (!root || typeof root.querySelectorAll !== 'function') return;
        root.querySelectorAll('audio,video').forEach((media) => {
          if (media.muted) return;
          media.muted = true;
          media.setAttribute('data-acc-muted', 'true');
        });
      },

      enableMuteSounds(enable = false) {
        if (typeof document === 'undefined') return;
        if (enable) {
          this.applyMuteToMediaElements(document);
          if (!this.muteSoundsObserver && document.body && typeof MutationObserver === 'function') {
            this.muteSoundsObserver = new MutationObserver((mutations) => {
              mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                  if (!(node instanceof Element)) return;
                  if (node.matches && node.matches('audio,video') && !node.muted) {
                    node.muted = true;
                    node.setAttribute('data-acc-muted', 'true');
                  }
                  this.applyMuteToMediaElements(node);
                });
              });
            });
            this.muteSoundsObserver.observe(document.body, { childList: true, subtree: true });
          }
        } else {
          if (this.muteSoundsObserver) {
            this.muteSoundsObserver.disconnect();
            this.muteSoundsObserver = null;
          }
          document.querySelectorAll('[data-acc-muted]').forEach((media) => {
            media.muted = false;
            media.removeAttribute('data-acc-muted');
          });
        }
      },

      // ── Text magnifier ─────────────────────────────────────────────────

      enableTextMagnifier(enable = false) {
        if (typeof document === 'undefined') return;
        if (enable) {
          if (!this.magnifierElement || !document.body.contains(this.magnifierElement)) {
            const element = document.createElement('div');
            element.className = 'acc-text-magnifier acc-container';
            element.setAttribute('aria-hidden', 'true');
            document.body.appendChild(element);
            this.magnifierElement = element;
          }
          if (!this.magnifierMoveHandler) {
            // Mouse and pen magnify on hover. Touch has no hover, so a tap
            // magnifies instead, and that banner clears once the page scrolls
            // rather than lingering over the text.
            this.magnifierMoveHandler = this.throttle((event) => {
              if (event.pointerType === 'touch') return;
              this.updateTextMagnifier(event);
            }, 50);
            this.magnifierDownHandler = (event) => {
              if (event.pointerType === 'touch') this.updateTextMagnifier(event);
            };
            this.magnifierScrollHandler = () => {
              if (this.magnifierLastPointerType === 'touch') this.hideTextMagnifier();
            };
          }
          document.addEventListener('pointermove', this.magnifierMoveHandler, { passive: true });
          document.addEventListener('pointerdown', this.magnifierDownHandler, { passive: true });
          window.addEventListener('scroll', this.magnifierScrollHandler, { passive: true });
        } else {
          if (this.magnifierMoveHandler) {
            document.removeEventListener('pointermove', this.magnifierMoveHandler);
            document.removeEventListener('pointerdown', this.magnifierDownHandler);
            window.removeEventListener('scroll', this.magnifierScrollHandler);
            this.magnifierMoveHandler = null;
            this.magnifierDownHandler = null;
            this.magnifierScrollHandler = null;
          }
          if (this.magnifierElement) {
            this.magnifierElement.remove();
            this.magnifierElement = null;
          }
          this.magnifierLastBlock = null;
        }
      },

      updateTextMagnifier(event) {
        const magnifier = this.magnifierElement;
        if (!magnifier) return;
        this.magnifierLastPointerType = event.pointerType || 'mouse';
        const target = event.target instanceof Element ? event.target : null;
        let block = null;
        if (target && !target.closest('.acc-container') && !target.closest('.acc-rg-container')) {
          block = target.closest('h1,h2,h3,h4,h5,h6,p,li,dt,dd,a,button,label,blockquote,figcaption,caption,th,td,span,summary');
        }
        // Reading innerText forces a layout pass; skip it (and the DOM write)
        // while the pointer stays inside the same block.
        if (block === this.magnifierLastBlock) return;
        this.magnifierLastBlock = block;
        const text = block
          ? this.normalizeReadableText(block.innerText || block.textContent || '').slice(0, 220)
          : '';
        if (text) {
          magnifier.textContent = text;
          // Dock the banner on the other half of the screen from the pointer
          // so it never covers the text being magnified.
          magnifier.classList.toggle('acc-text-magnifier-top', event.clientY > window.innerHeight * 0.55);
          magnifier.classList.add('acc-visible');
        } else {
          magnifier.classList.remove('acc-visible');
          magnifier.textContent = '';
        }
      },

      hideTextMagnifier() {
        if (!this.magnifierElement) return;
        this.magnifierElement.classList.remove('acc-visible');
        this.magnifierElement.textContent = '';
        // Forget the block so tapping it again shows the banner again.
        this.magnifierLastBlock = null;
      },

      // ── Tooltips ───────────────────────────────────────────────────────
      // Many controls are an icon with a name only assistive technology can
      // read, and pictures carry a description nobody sees. Tooltips shows
      // that hidden text in a large bubble, on hover and on keyboard focus.

      // The hidden description of `target`, or of the control it sits in.
      // Null when there is none, or when it only repeats the visible text.
      findTooltipSource(target) {
        if (!(target instanceof Element)) return null;
        if (target.closest('.acc-container, .acc-rg-container, #acc-widget-host, #acc-skip-link')) return null;
        const controlSelector = 'a[href], button, input, select, textarea, summary, label, [role="button"], [role="link"], [role="tab"], [role="menuitem"], [role="checkbox"], [role="switch"], [tabindex]';
        const control = target.closest(controlSelector);
        const drawing = target.closest('svg');
        const candidates = [];
        for (let node = target; node && node.nodeType === 1 && node !== document.body; node = node.parentElement) {
          candidates.push(node);
          if (node === control || (!control && (node === drawing || !drawing))) break;
        }
        for (const node of candidates) {
          const tag = node.tagName.toLowerCase();
          let text = '';
          if (tag === 'img' || tag === 'area' || (tag === 'input' && node.getAttribute('type') === 'image')) {
            text = node.getAttribute('alt') || '';
          }
          if (!text && tag === 'svg') {
            const title = Array.from(node.children).find((child) => child.tagName.toLowerCase() === 'title');
            text = title ? title.textContent : '';
          }
          text = text || this.getAccessibleLabel(node) || node.getAttribute('title')
            || (node === this.tooltipAnchor ? this.tooltipHeldTitle : '') || '';
          text = this.normalizeReadableText(text).slice(0, 300);
          if (!text) continue;
          const visible = this.normalizeReadableText(node.innerText || node.textContent || '');
          if (visible && visible.toLowerCase() === text.toLowerCase()) return null;
          return { element: node, text };
        }
        return null;
      },

      showTooltip(target) {
        const source = this.findTooltipSource(target);
        if (!source) {
          this.hideTooltip();
          return;
        }
        const bubble = this.tooltipElement;
        if (!bubble) return;
        if (source.element !== this.tooltipAnchor) {
          this.hideTooltip();
          this.tooltipAnchor = source.element;
          // Hold back the element's own title so the browser does not draw a
          // second, small tooltip over ours.
          if (source.element.hasAttribute('title')) {
            this.tooltipHeldTitle = source.element.getAttribute('title');
            source.element.removeAttribute('title');
          }
        }
        bubble.textContent = source.text;
        bubble.classList.add('acc-visible');
        this.positionTooltip();
      },

      // Under the element, or above it when there is no room, and always
      // inside the screen. Once the element has scrolled out of view the
      // bubble goes with it.
      positionTooltip() {
        const bubble = this.tooltipElement;
        const element = this.tooltipAnchor;
        if (!bubble || !element) return;
        const gap = 8;
        const anchor = element.getBoundingClientRect();
        if (!element.isConnected || anchor.bottom < 0 || anchor.top > window.innerHeight
          || anchor.right < 0 || anchor.left > window.innerWidth) {
          this.hideTooltip();
          return;
        }
        const size = bubble.getBoundingClientRect();
        const maxLeft = Math.max(gap, window.innerWidth - size.width - gap);
        const left = Math.min(maxLeft, Math.max(gap, anchor.left + anchor.width / 2 - size.width / 2));
        let top = anchor.bottom + gap;
        if (top + size.height > window.innerHeight - gap) top = anchor.top - size.height - gap;
        bubble.style.left = `${Math.round(left)}px`;
        bubble.style.top = `${Math.round(Math.max(gap, top))}px`;
      },

      hideTooltip() {
        if (this.tooltipAnchor && this.tooltipHeldTitle !== null) {
          this.tooltipAnchor.setAttribute('title', this.tooltipHeldTitle);
        }
        this.tooltipAnchor = null;
        this.tooltipHeldTitle = null;
        if (this.tooltipElement) {
          this.tooltipElement.classList.remove('acc-visible');
          this.tooltipElement.textContent = '';
        }
      },

      enableTooltips(enable = false) {
        if (typeof document === 'undefined' || !document.body) return;
        if (enable) {
          if (!this.tooltipElement || !document.body.contains(this.tooltipElement)) {
            const bubble = document.createElement('div');
            bubble.className = 'acc-tooltip-bubble acc-container';
            // The text is already the element's accessible name; a screen
            // reader should not hear it twice.
            bubble.setAttribute('aria-hidden', 'true');
            document.body.appendChild(bubble);
            this.tooltipElement = bubble;
          }
          if (this.tooltipHandlers) return;
          const leaves = (event) => {
            const next = event.relatedTarget;
            if (this.tooltipAnchor && next instanceof Node && this.tooltipAnchor.contains(next)) return;
            this.hideTooltip();
          };
          this.tooltipHandlers = {
            over: (event) => this.showTooltip(event.target),
            out: leaves,
            focusin: (event) => this.showTooltip(event.target),
            focusout: leaves,
            // Focusing a control can scroll it into view; the bubble follows
            // rather than vanishing the moment it appears.
            scroll: () => this.positionTooltip(),
            keydown: (event) => {
              if (event.key === 'Escape') this.hideTooltip();
            }
          };
          document.addEventListener('mouseover', this.tooltipHandlers.over, { passive: true });
          document.addEventListener('mouseout', this.tooltipHandlers.out, { passive: true });
          document.addEventListener('focusin', this.tooltipHandlers.focusin);
          document.addEventListener('focusout', this.tooltipHandlers.focusout);
          document.addEventListener('keydown', this.tooltipHandlers.keydown);
          window.addEventListener('scroll', this.tooltipHandlers.scroll, { passive: true, capture: true });
        } else {
          this.hideTooltip();
          if (this.tooltipHandlers) {
            document.removeEventListener('mouseover', this.tooltipHandlers.over);
            document.removeEventListener('mouseout', this.tooltipHandlers.out);
            document.removeEventListener('focusin', this.tooltipHandlers.focusin);
            document.removeEventListener('focusout', this.tooltipHandlers.focusout);
            document.removeEventListener('keydown', this.tooltipHandlers.keydown);
            window.removeEventListener('scroll', this.tooltipHandlers.scroll, { capture: true });
            this.tooltipHandlers = null;
          }
          if (this.tooltipElement) {
            this.tooltipElement.remove();
            this.tooltipElement = null;
          }
        }
      },

      // ── Page structure navigator ───────────────────────────────────────

      isStructureCandidate(element) {
        if (!(element instanceof Element)) return false;
        if (element.closest('.acc-container')) return false;
        if (element.closest('[aria-hidden="true"]')) return false;
        return this.isElementVisibleForTts(element);
      },

      getAccessibleLabel(element) {
        const ariaLabel = element.getAttribute('aria-label');
        if (ariaLabel && ariaLabel.trim()) return ariaLabel.trim();
        const labelledBy = element.getAttribute('aria-labelledby');
        if (labelledBy) {
          const labels = labelledBy.split(/\s+/)
            .map(id => document.getElementById(id))
            .filter(Boolean)
            .map(node => this.normalizeReadableText(node.textContent))
            .filter(Boolean);
          if (labels.length) return labels.join(' ');
        }
        return '';
      },

      collectPageHeadings() {
        return Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6'))
          .filter(el => this.isStructureCandidate(el))
          .map(el => ({
            element: el,
            level: Number(el.tagName.charAt(1)),
            label: this.normalizeReadableText(el.innerText || el.textContent || '').slice(0, 120)
          }))
          .filter(item => item.label)
          .slice(0, STRUCTURE_MAX_ITEMS);
      },

      // A landmark's kind in plain words (a translation key), from its role
      // or its tag. A header or footer inside an article or a section belongs
      // to that part of the page, not to the page, so it is not a landmark.
      getLandmarkKind(element) {
        const role = (element.getAttribute('role') || '').trim().toLowerCase();
        const tag = element.tagName.toLowerCase();
        const byRole = {
          main: 'Main content',
          navigation: 'Navigation',
          banner: 'Header',
          contentinfo: 'Footer',
          complementary: 'Sidebar',
          search: 'Search',
          form: 'Form',
          region: 'Section'
        };
        if (byRole[role]) return byRole[role];
        if (role) return '';
        if ((tag === 'header' || tag === 'footer') && element.parentElement
          && element.parentElement.closest('article, aside, main, nav, section')) {
          return '';
        }
        const byTag = {
          main: 'Main content',
          nav: 'Navigation',
          header: 'Header',
          footer: 'Footer',
          aside: 'Sidebar',
          search: 'Search',
          form: 'Form',
          section: 'Section'
        };
        return byTag[tag] || '';
      },

      collectPageLandmarks() {
        const selector = 'main,nav,header,footer,aside,search,form,section[aria-label],section[aria-labelledby],[role="main"],[role="navigation"],[role="banner"],[role="contentinfo"],[role="complementary"],[role="search"],[role="form"],[role="region"]';
        const seen = new Set();
        const landmarks = [];
        document.querySelectorAll(selector).forEach((el) => {
          if (seen.has(el) || !this.isStructureCandidate(el)) return;
          seen.add(el);
          const kind = this.getLandmarkKind(el);
          if (!kind) return;
          // "Navigation", or "Navigation: Main menu" when the page names it.
          const name = this.getAccessibleLabel(el);
          const label = this.translate(kind);
          landmarks.push({
            element: el,
            label: name ? `${label}: ${name}`.slice(0, 120) : label
          });
        });
        return landmarks.slice(0, STRUCTURE_MAX_ITEMS);
      },

      collectPageLinks() {
        const seen = new Set();
        const links = [];
        document.querySelectorAll('a[href]').forEach((el) => {
          if (!this.isStructureCandidate(el)) return;
          const label = this.normalizeReadableText(el.innerText || el.textContent || '').slice(0, 120)
            || this.getAccessibleLabel(el).slice(0, 120);
          if (!label) return;
          const dedupeKey = `${label}::${el.getAttribute('href')}`;
          if (seen.has(dedupeKey)) return;
          seen.add(dedupeKey);
          links.push({ element: el, label });
        });
        return links.slice(0, STRUCTURE_MAX_ITEMS);
      },

      focusStructureTarget(element) {
        if (!(element instanceof Element)) return;
        element.scrollIntoView({ block: 'center' });
        if (!element.hasAttribute('tabindex')) {
          element.setAttribute('tabindex', '-1');
          element.setAttribute('data-acc-temp-tabindex', 'true');
          element.addEventListener('blur', () => {
            if (element.hasAttribute('data-acc-temp-tabindex')) {
              element.removeAttribute('tabindex');
              element.removeAttribute('data-acc-temp-tabindex');
            }
          }, { once: true });
        }
        element.focus({ preventScroll: true });
      },

      buildStructureSection(titleKey, items, options = {}) {
        const section = document.createElement('div');
        section.className = 'acc-report-section';

        const title = document.createElement('div');
        title.className = 'acc-report-section-title';
        title.textContent = `${this.translate(titleKey)} (${items.length})`;
        section.appendChild(title);

        if (!items.length) {
          const empty = document.createElement('p');
          empty.className = 'acc-structure-empty';
          empty.textContent = this.translate('No items found');
          section.appendChild(empty);
          return section;
        }

        const list = document.createElement('ul');
        list.className = 'acc-structure-list';
        items.forEach((item) => {
          const entry = document.createElement('li');
          const button = document.createElement('button');
          button.type = 'button';
          button.className = 'acc-structure-item';
          if (options.indentByLevel && item.level) {
            button.style.paddingLeft = `${12 + (item.level - 1) * 16}px`;
            button.dataset.level = String(item.level);
          }
          button.textContent = options.indentByLevel && item.level
            ? `H${item.level} · ${item.label}`
            : item.label;
          button.addEventListener('click', (event) => {
            this.closeReportPanel(this.structurePanel);
            // With a mouse or a finger the menu stays where it is and the
            // page moves behind it. From the keyboard (a click with no
            // pointer behind it) the menu steps aside: it holds the Tab key
            // while open, so reading on from the chosen place would not work.
            if (event.detail === 0 && this.activeMenuContainer) {
              this.closeMenu(this.activeMenuContainer);
            }
            this.focusStructureTarget(item.element);
          });
          entry.appendChild(button);
          list.appendChild(entry);
        });
        section.appendChild(list);
        return section;
      },

      openPageStructurePanel() {
        if (typeof document === 'undefined') return;
        let panel = this.structurePanel && document.body.contains(this.structurePanel)
          ? this.structurePanel
          : null;
        if (!panel) {
          panel = document.createElement('div');
          panel.className = 'acc-report-panel acc-structure-panel acc-container';
          panel.setAttribute('role', 'dialog');
          panel.setAttribute('aria-modal', 'true');
          panel.setAttribute('aria-hidden', 'true');
          panel.setAttribute('aria-labelledby', 'acc-structure-title');
          document.body.appendChild(panel);
          this.structurePanel = panel;
        }

        // Rebuild on every open — the page may have changed.
        panel.innerHTML = `
      <div class="acc-report-overlay"></div>
      <div class="acc-report-dialog">
        <div class="acc-report-header">
          <h2 id="acc-structure-title" class="acc-report-title">${this.translate('Page Structure')}</h2>
          <button type="button" class="acc-report-close" aria-label="${this.translate('Close')}">${this.widgetIcons.close}</button>
        </div>
        <div class="acc-report-content"></div>
      </div>
    `;

        panel.querySelector('.acc-report-close').addEventListener('click', () => this.closeReportPanel(panel));
        panel.querySelector('.acc-report-overlay').addEventListener('click', () => this.closeReportPanel(panel));

        const content = panel.querySelector('.acc-report-content');
        content.appendChild(this.buildStructureSection('Headings', this.collectPageHeadings(), { indentByLevel: true }));
        content.appendChild(this.buildStructureSection('Landmarks', this.collectPageLandmarks()));
        content.appendChild(this.buildStructureSection('Links', this.collectPageLinks()));

        this.openReportPanel(panel);
      },

    };

    /** @typedef {import('../index.js').default} AccessibleWebWidget */

    // Smart Contrast: find text that is hard to read against its own
    // background and recolor only that text, just far enough to pass. The
    // rest of the page keeps its design.
    //
    // "Hard to read" is the WCAG AA measure: a contrast ratio under 4.5, or
    // under 3 for large text (24px and up, or 18.66px and up when bold).
    // Over a gradient the text must pass against its lightest and its darkest
    // color. Text over a picture is left alone: its background is unknown.

    const NORMAL_TEXT_RATIO = 4.5;
    const LARGE_TEXT_RATIO = 3;
    // What the scan aims for when it runs as a net under Dark Contrast and
    // Light Contrast, which promise strong contrast (the WCAG AAA measure).
    const NET_TEXT_RATIO = 7;
    // Past this many text elements the page is scanned no further, so a huge
    // page cannot freeze the browser.
    const MAX_ELEMENTS = 6000;
    // Text marked as lying over a picture is skipped too: the picture is its
    // real background, and that cannot be measured.
    const SKIP_SELECTOR = '.acc-container, .acc-rg-container, #acc-widget-host, #acc-skip-link, script, style, noscript, template, svg, [aria-hidden="true"], [data-acc-over-media]';
    // Text this close to its background color would be invisible, which no
    // page intends. Something else is behind it (a picture placed under the
    // text), so it is left alone.
    const INVISIBLE_RATIO = 1.25;
    const FIELD_SELECTOR = 'input:not([type="hidden"]):not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="color"]):not([type="file"]):not([type="image"]), textarea, select';

    /** @type {{ [methodName: string]: (this: AccessibleWebWidget, ...args: any[]) => any }} */
    const smartContrastMethods = {

      // "rgb(1, 2, 3)" or "rgba(1, 2, 3, 0.5)" as numbers; null for anything
      // else (a color written in another color space is left alone).
      parseCssColor(value) {
        const match = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/.exec(String(value || '').trim());
        if (!match) return null;
        let alpha = 1;
        if (match[4] !== undefined) {
          alpha = match[4].endsWith('%') ? parseFloat(match[4]) / 100 : parseFloat(match[4]);
        }
        return { r: +match[1], g: +match[2], b: +match[3], a: Math.min(1, Math.max(0, alpha)) };
      },

      // WCAG relative luminance, 0 (black) to 1 (white).
      colorLuminance(color) {
        const channel = (value) => {
          const unit = value / 255;
          return unit <= 0.03928 ? unit / 12.92 : Math.pow((unit + 0.055) / 1.055, 2.4);
        };
        return 0.2126 * channel(color.r) + 0.7152 * channel(color.g) + 0.0722 * channel(color.b);
      },

      // WCAG contrast ratio, 1 (same color) to 21 (black on white).
      colorContrast(first, second) {
        const a = this.colorLuminance(first);
        const b = this.colorLuminance(second);
        return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
      },

      // A see-through color laid over a solid one.
      blendColors(top, bottom) {
        const alpha = top.a === undefined ? 1 : top.a;
        return {
          r: top.r * alpha + bottom.r * (1 - alpha),
          g: top.g * alpha + bottom.g * (1 - alpha),
          b: top.b * alpha + bottom.b * (1 - alpha),
          a: 1
        };
      },

      // The nearest color to `text` that reaches `target` against
      // `background`: the text is moved toward black or white, whichever the
      // background calls for, and no further than needed.
      findReadableColor(text, background, target) {
        const mix = (end, amount) => ({
          r: text.r + (end.r - text.r) * amount,
          g: text.g + (end.g - text.g) * amount,
          b: text.b + (end.b - text.b) * amount,
          a: 1
        });
        // Whole numbers, rounded toward the end color so rounding cannot
        // undo the last bit of contrast.
        const settle = (color, end) => {
          const round = end.r === 0 ? Math.floor : Math.ceil;
          return { r: round(color.r), g: round(color.g), b: round(color.b), a: 1 };
        };
        const toward = (end) => {
          if (this.colorContrast(end, background) < target) return null;
          let low = 0;
          let high = 1;
          for (let step = 0; step < 12; step++) {
            const middle = (low + high) / 2;
            if (this.colorContrast(mix(end, middle), background) >= target) {
              high = middle;
            } else {
              low = middle;
            }
          }
          for (let amount = high; amount < 1; amount += 0.01) {
            const candidate = settle(mix(end, amount), end);
            if (this.colorContrast(candidate, background) >= target) return candidate;
          }
          return end;
        };
        const black = { r: 0, g: 0, b: 0, a: 1 };
        const white = { r: 255, g: 255, b: 255, a: 1 };
        // Above this luminance black contrasts more than white does.
        const ends = this.colorLuminance(background) > 0.179 ? [black, white] : [white, black];
        return toward(ends[0]) || toward(ends[1]) || ends[0];
      },

      // The colors a background-image value is made of: none for "none", the
      // color stops for a gradient, and null for a picture, or a color written
      // some other way, since what it shows cannot be known.
      parseGradientColors(value) {
        const text = String(value || '').trim();
        if (!text || text === 'none') return [];
        if (!/gradient\(/i.test(text) || /url\(|image-set\(|element\(|cross-fade\(/i.test(text)) return null;
        const stops = text.match(/rgba?\([^)]*\)/g) || [];
        const rest = text.replace(/rgba?\([^)]*\)/g, '');
        if (!stops.length || /(?:color|color-mix|oklch|oklab|lab|lch|hsl|hsla|hwb)\(/i.test(rest)) return null;
        const colors = stops.map((stop) => this.parseCssColor(stop));
        return colors.every(Boolean) ? colors : null;
      },

      // The lightest and the darkest of some colors. Text that reads against
      // both reads against everything in between.
      colorExtremes(colors) {
        let lightest = colors[0];
        let darkest = colors[0];
        colors.forEach((color) => {
          if (this.colorLuminance(color) > this.colorLuminance(lightest)) lightest = color;
          if (this.colorLuminance(color) < this.colorLuminance(darkest)) darkest = color;
        });
        return lightest === darkest ? [lightest] : [lightest, darkest];
      },

      // The solid colors behind an element: its own background and those of
      // its ancestors, laid over each other, on a white page. One color for a
      // plain background; the lightest and darkest for a gradient. Null when
      // a picture is in the way.
      getBackgroundColors(element) {
        const layers = [];
        for (let node = element; node && node.nodeType === 1; node = node.parentElement) {
          const style = window.getComputedStyle(node);
          // A background clipped to the text paints the letters themselves.
          if (style.backgroundClip === 'text' || style.webkitBackgroundClip === 'text') {
            if (node === element) return null;
            continue;
          }
          const gradient = this.parseGradientColors(style.backgroundImage);
          // Under Invert Colors or Saturation the body carries a filtered
          // color; the text is filtered with it, so measure the page's own.
          const ownColor = node === document.body && this.activeColorFilterKey && this.unfilteredBodyBackground
            ? this.unfilteredBodyBackground
            : style.backgroundColor;
          const color = this.parseCssColor(ownColor);
          if (!gradient || !color) return null;
          if (gradient.length) layers.push(gradient);
          if (color.a > 0) layers.push([color]);
          if (color.a >= 1 || (gradient.length && gradient.every((stop) => stop.a >= 1))) break;
        }
        let results = [{ r: 255, g: 255, b: 255, a: 1 }];
        for (let index = layers.length - 1; index >= 0; index--) {
          const blended = [];
          layers[index].forEach((top) => {
            results.forEach((bottom) => blended.push(this.blendColors(top, bottom)));
          });
          results = this.colorExtremes(blended);
        }
        return results;
      },

      // The lowest contrast `text` has against any of `backgrounds`.
      lowestContrast(text, backgrounds) {
        return Math.min(...backgrounds.map((background) => this.colorContrast(this.blendColors(text, background), background)));
      },

      // A readable color against every one of `backgrounds`. One background
      // has an exact answer. For several, the text is stepped toward black
      // and toward white and the smallest step that passes them all wins.
      // Null when nothing passes and nothing reads clearly better than the
      // text does already.
      findReadableColorAcross(text, backgrounds, target) {
        if (backgrounds.length === 1) {
          return this.findReadableColor(this.blendColors(text, backgrounds[0]), backgrounds[0], target);
        }
        const start = this.blendColors(text, backgrounds[0]);
        const ends = [{ r: 0, g: 0, b: 0, a: 1 }, { r: 255, g: 255, b: 255, a: 1 }];
        let best = null;
        let bestContrast = this.lowestContrast(text, backgrounds);
        for (let step = 1; step <= 64; step++) {
          for (const end of ends) {
            const amount = step / 64;
            const candidate = {
              r: Math.round(start.r + (end.r - start.r) * amount),
              g: Math.round(start.g + (end.g - start.g) * amount),
              b: Math.round(start.b + (end.b - start.b) * amount),
              a: 1
            };
            const contrast = this.lowestContrast(candidate, backgrounds);
            if (contrast >= target) return candidate;
            if (contrast > bestContrast + 0.5) {
              best = candidate;
              bestContrast = contrast;
            }
          }
        }
        return best;
      },

      // The elements under `root` that show text of their own.
      collectSmartContrastElements(root) {
        const found = new Set();
        if (!root || root.nodeType !== 1 || root.closest(SKIP_SELECTOR)) return found;
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        let node = walker.nextNode();
        while (node && found.size < MAX_ELEMENTS) {
          const parent = node.parentElement;
          if (parent && node.nodeValue.trim() && !found.has(parent) && !parent.closest(SKIP_SELECTOR)) {
            found.add(parent);
          }
          node = walker.nextNode();
        }
        const fields = root.matches(FIELD_SELECTOR) ? [root] : [];
        root.querySelectorAll(FIELD_SELECTOR).forEach((field) => fields.push(field));
        fields.forEach((field) => {
          if (found.size < MAX_ELEMENTS && !field.closest(SKIP_SELECTOR)) found.add(field);
        });
        return found;
      },

      // Work out every fix first, then write them, so the browser lays the
      // page out once rather than once per element.
      applySmartContrast(root = document.body) {
        if (!this.smartContrastFixed) this.smartContrastFixed = new Map();
        // Under Dark and Light Contrast and Simplify Layout nothing is left
        // behind the text but the colors those set, so text that vanished
        // is fixed too.
        const net = this.smartContrastActive === 'net';
        const simple = !!document.body && document.body.classList.contains('acc-simple-layout-enabled');
        const floor = net || simple ? 0 : INVISIBLE_RATIO;
        const fixes = [];
        // A color that is still fading from one value to another would be
        // read part-way (a page that animates its colors, just after Dark
        // Contrast went on). Hold every transition still while measuring.
        this.injectStyle('acc-contrast-measure', '*, *::before, *::after { transition: none !important; }');
        try {
          this.collectSmartContrastElements(root).forEach((element) => {
            if (this.smartContrastFixed.has(element)) return;
            const style = window.getComputedStyle(element);
            const text = this.parseCssColor(style.color);
            if (!text || text.a === 0) return;
            const backgrounds = this.getBackgroundColors(element);
            if (!backgrounds) return;
            const size = parseFloat(style.fontSize) || 16;
            const bold = (parseInt(style.fontWeight, 10) || 400) >= 700;
            let target = size >= 24 || (bold && size >= 18.66) ? LARGE_TEXT_RATIO : NORMAL_TEXT_RATIO;
            // The net works for modes that promise strong contrast.
            if (net) target = NET_TEXT_RATIO;
            const contrast = this.lowestContrast(text, backgrounds);
            if (contrast >= target || contrast < floor) return;
            const color = this.findReadableColorAcross(text, backgrounds, target);
            if (color) fixes.push({ element, color });
          });
        } finally {
          this.removeStyle('acc-contrast-measure');
        }
        fixes.forEach(({ element, color }) => {
          this.smartContrastFixed.set(element, {
            value: element.style.getPropertyValue('color'),
            priority: element.style.getPropertyPriority('color')
          });
          element.style.setProperty('color', `rgb(${color.r}, ${color.g}, ${color.b})`, 'important');
          element.setAttribute('data-acc-smart-contrast', '');
        });
        return fixes.length;
      },

      // Put back each element's own inline color, or none.
      clearSmartContrast() {
        if (!this.smartContrastFixed) return;
        this.smartContrastFixed.forEach((previous, element) => {
          // Removed first: writing a plain value over an important one leaves
          // some browsers treating it as important still.
          element.style.removeProperty('color');
          if (previous.value) {
            element.style.setProperty('color', previous.value, previous.priority);
          }
          element.removeAttribute('data-acc-smart-contrast');
        });
        this.smartContrastFixed = new Map();
      },

      stopSmartContrastWatch() {
        if (this.smartContrastObserver) {
          this.smartContrastObserver.disconnect();
          this.smartContrastObserver = null;
        }
        if (this.smartContrastTimer) {
          clearTimeout(this.smartContrastTimer);
          this.smartContrastTimer = null;
        }
      },

      // Content added later (a menu that opens, results that load) is checked
      // shortly after it arrives.
      startSmartContrastWatch() {
        if (this.smartContrastObserver || typeof MutationObserver === 'undefined' || !document.body) return;
        const pending = new Set();
        this.smartContrastObserver = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
              const element = node.nodeType === 1 ? node : node.parentElement;
              if (element && !element.closest(SKIP_SELECTOR)) pending.add(element);
            });
          });
          if (!pending.size || this.smartContrastTimer) return;
          this.smartContrastTimer = setTimeout(() => {
            this.smartContrastTimer = null;
            const roots = [...pending].filter((element) => element.isConnected);
            pending.clear();
            roots.forEach((element) => this.applySmartContrast(element));
          }, 250);
        });
        this.smartContrastObserver.observe(document.body, { childList: true, subtree: true });
      },

      // How the scan should run, if at all. "smart" is Smart Contrast itself.
      // Dark Contrast, Light Contrast and Simplify Layout set colors with
      // rules, but a color the page wrote on an element as important beats
      // any rule; under those the same scan runs as a "net" that catches what
      // the rules could not.
      getSmartContrastRun() {
        if (document.documentElement.classList.contains('acc-dark-contrast')) return 'net';
        if (document.body && document.body.classList.contains('acc-high-contrast-mode')) return 'net';
        if (this.retrieveState('smart-contrast')) return 'smart';
        // Simplify Layout sets its own text colors the same way. There the
        // scan only mends what fails the usual measure.
        if (document.body && document.body.classList.contains('acc-simple-layout-enabled')) return 'simple';
        return null;
      },

      // Called whenever a setting changes. It rescans only when Smart
      // Contrast itself starts or stops, or when `rescan` asks for it because
      // the page's colors have just changed.
      refreshSmartContrast({ rescan = false } = {}) {
        try {
          const run = this.getSmartContrastRun();
          document.documentElement.classList.toggle('acc-smart-contrast', run === 'smart');
          if (run === (this.smartContrastActive || null) && !(rescan && run)) return;
          this.clearSmartContrast();
          this.smartContrastActive = run;
          if (run) {
            this.applySmartContrast();
            this.startSmartContrastWatch();
          } else {
            this.stopSmartContrastWatch();
          }
        } catch (e) {
          console.warn('Error applying smart contrast:', e);
        }
      }

    };

    /** @typedef {import('./index.js').default} AccessibleWebWidget */

    /** @type {{ [methodName: string]: (this: AccessibleWebWidget, ...args: any[]) => any }} */
    const featureMethods = {
      ...coreFeatureMethods,
      ...ttsMethods,
      ...axeReportMethods,
      ...annotationMethods,
      ...visualFilterMethods,
      ...pageToolMethods,
      ...smartContrastMethods
    };

    // The menu's own font: Inter (SIL OFL 1.1), as a variable font split by
    // script. Each part declares the characters it covers, so a browser
    // downloads only the parts a language needs, and only once the menu is
    // opened. The files ship beside the widget script in dist/fonts/.
    const MENU_FONT_FAMILY = 'AccessibleWeb Inter';

    const MENU_FONT_SUBSETS = [
      { file: 'inter-cyrillic-ext.woff2', range: 'U+0460-052F,U+1C80-1C8A,U+20B4,U+2DE0-2DFF,U+A640-A69F,U+FE2E-FE2F' },
      { file: 'inter-cyrillic.woff2', range: 'U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116' },
      { file: 'inter-greek-ext.woff2', range: 'U+1F00-1FFF' },
      { file: 'inter-greek.woff2', range: 'U+0370-0377,U+037A-037F,U+0384-038A,U+038C,U+038E-03A1,U+03A3-03FF' },
      { file: 'inter-vietnamese.woff2', range: 'U+0102-0103,U+0110-0111,U+0128-0129,U+0168-0169,U+01A0-01A1,U+01AF-01B0,U+0300-0301,U+0303-0304,U+0308-0309,U+0323,U+0329,U+1EA0-1EF9,U+20AB' },
      { file: 'inter-latin-ext.woff2', range: 'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF' },
      { file: 'inter-latin.woff2', range: 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD' }
    ];

    // Where the widget's own file was loaded from; the fonts sit in a fonts/
    // folder beside it, so they come from the same place as the script and no
    // other server is contacted. This has to be read while the script is
    // first running, which is why it is worked out here and not on demand.
    const WIDGET_SCRIPT_URL = (() => {
      try {
        return (_documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === 'SCRIPT' && _documentCurrentScript.src || new URL('accessible-web-widget.js', document.baseURI).href) || '';
      } catch {
        return '';
      }
    })();

    // The folder holding the font files, as an absolute URL ending in "/".
    // An owner's menuFontUrl wins; otherwise it is fonts/ beside the script.
    function resolveMenuFontBase(customUrl, scriptUrl = WIDGET_SCRIPT_URL, pageUrl = (typeof document !== 'undefined' ? document.baseURI : '')) {
      const custom = typeof customUrl === 'string' ? customUrl.trim() : '';
      const isSafe = (value) => value && !/["'()\\\s]/.test(value);
      try {
        if (custom) {
          if (!isSafe(custom)) return '';
          const base = new URL(custom.endsWith('/') ? custom : `${custom}/`, pageUrl || undefined).href;
          return isSafe(base) ? base : '';
        }
        if (!scriptUrl || !/^https?:/i.test(scriptUrl)) return '';
        const base = new URL('fonts/', scriptUrl).href;
        return isSafe(base) ? base : '';
      } catch {
        return '';
      }
    }

    /** @typedef {import('./index.js').default} AccessibleWebWidget */

    /** @type {{ [methodName: string]: (this: AccessibleWebWidget, ...args: any[]) => any }} */
    const uiMethods = {

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
            if (!key || this.isColorFilterKey(key) || this.multiLevelFeatures[key] || key === 'dyslexia-font') return;
            const option = [...(this.accessTools || []), ...(this.contentOptions || [])].find(o => o.key === key);
            if (option?.isAction) return;
            const isActive = !!states[key];
            btn.classList.toggle('acc-selected', isActive);
            btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
          });
          const activeColorFilter = this.getActiveColorFilterKey(states);
          this.setColorFilterUI(menu, activeColorFilter);
          this.setContrastUI(menu, this.getContrastMode(states));
          const readableChoice = this.resolveReadableFontChoice(states['readable-text']);
          this.setReadableFontUI(menu, readableChoice ? readableChoice.key : null);
          this.setLevelTileUI(menu, 'text-scale', this.getTextScaleLevel(states['text-scale']));
          this.setLevelTileUI(menu, 'text-to-speech', this.getTtsSpeedLevel(states['text-to-speech']));
          this.setLevelTileUI(menu, 'line-spacing', this.getLineSpacingLevel(states['line-spacing']));
          this.setLevelTileUI(menu, 'letter-spacing', this.getLetterSpacingLevel(states['letter-spacing']));
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
          const resetButton = menu.querySelector('.acc-action-reset');
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

      // Where the system always shows scrollbars, the panel's scrollbar takes
      // room on one side. The options give up that much padding on that side
      // so they stay centred, with the scrollbar in the margin.
      syncScrollbarGutter(menu) {
          const content = menu?.querySelector('.acc-menu-content');
          if (!content) return;
          const measure = () => {
            const gutter = Math.max(0, content.offsetWidth - content.clientWidth);
            menu.style.setProperty('--acc-scrollbar-gutter', `${gutter}px`);
            // An always-visible scrollbar gets the widget's own shape, kept
            // clear of the sheet's rounded corner.
            if (gutter > 0) menu.classList.add('acc-classic-scrollbar');
          };
          measure();
          if (!this.scrollbarGutterObserver && typeof ResizeObserver === 'function') {
            this.scrollbarGutterObserver = new ResizeObserver(measure);
            this.scrollbarGutterObserver.observe(content);
          }
        },

      // The menu's font (Inter) is registered the first time the menu opens.
      // Registering costs nothing: the browser fetches a part of the font only
      // when text on screen needs it. If the files cannot be found or loaded,
      // the menu keeps the device's own font.
      ensureMenuFontLoaded(menu) {
          if (!menu || this.menuFontRequested) return;
          this.menuFontRequested = true;
          if (this.options?.menuFont === 'system') return;
          if (typeof FontFace !== 'function' || !document.fonts || typeof document.fonts.add !== 'function') return;
          const base = resolveMenuFontBase(this.options?.menuFontUrl);
          if (!base) return;
          try {
            MENU_FONT_SUBSETS.forEach(({ file, range }) => {
              document.fonts.add(new FontFace(MENU_FONT_FAMILY, `url("${base}${file}") format("woff2")`, {
                weight: '100 900',
                style: 'normal',
                display: 'swap',
                unicodeRange: range
              }));
            });
            menu.classList.add('acc-menu-inter');
          } catch {
            // An older browser that rejects a descriptor: keep the device font.
          }
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
            this.ensureMenuFontLoaded(menu);
            this.syncScrollbarGutter(menu);
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
            // A dialog open over the menu owns the keyboard until it closes.
            if (document.querySelector('.acc-report-panel.acc-report-visible')) return;
            if (event.key === 'Escape' || event.key === 'Esc') {
              event.preventDefault();
              // Escape peels back one layer: an open language list closes
              // first (its row restores focus), then the menu itself.
              const morePanel = this.findElement('.acc-more-panel', this.activeMenuContainer);
              if (morePanel && !morePanel.hidden) {
                this.toggleMorePanel(this.activeMenuContainer, false);
                return;
              }
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
              { label: 'Text', keys: ['text-scale', 'line-spacing', 'letter-spacing', 'bold-text', 'dyslexia-font', 'readable-text'] },
              { label: 'Color & Contrast', keys: ['contrast-toggle', 'saturation-toggle', 'invert-colors'] },
              { label: 'Reading Aids', keys: ['highlight-links', 'reading-aid', 'simple-layout', 'text-magnifier', 'tooltips', 'page-structure'] },
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
            <div class="acc-menu-header-actions">
              ${this.isLauncherRemovedByOwner() ? '' : `<button type="button" class="acc-menu-more" title="Tools" aria-label="Tools" aria-haspopup="true" aria-expanded="false" aria-controls="acc-more-panel">
                ${this.widgetIcons.more}
              </button>`}
              <button type="button" class="acc-menu-close" title="Close" aria-label="Close">
                ${this.widgetIcons.close}
              </button>
            </div>
          </div>
          ${this.isLauncherRemovedByOwner() ? '' : `<div id="acc-more-panel" class="acc-more-panel" role="group" aria-label="Tools" hidden>
            <div class="acc-more-list">
              <button type="button" class="acc-more-item acc-more-move" aria-pressed="false">
                ${this.widgetIcons.moveWidget}
                <span class="acc-label">Move widget</span>
              </button>
              <button type="button" class="acc-more-item acc-more-hide" aria-pressed="false">
                ${this.widgetIcons.hideWidget}
                <span class="acc-label">Hide widget</span>
              </button>
            </div>
            <div id="acc-hide-panel" class="acc-hide-panel" hidden>
                <div class="acc-hide-title">
                  ${this.widgetIcons.hideWidget}
                  <span class="acc-label">Hide widget</span>
                </div>
                <div class="acc-hide-choices" role="radiogroup" aria-label="Hide widget" aria-describedby="acc-hide-note">
                  ${[['visit', 'This visit'], ['day', 'One day'], ['week', 'One week'], ['always', 'Always']].map(([value, label], index) => `<button type="button" class="acc-hide-choice" role="radio" aria-checked="${index === 0}" tabindex="${index === 0 ? 0 : -1}" data-hide-for="${value}">
                    <span class="acc-hide-radio" aria-hidden="true"></span>
                    <span class="acc-label">${label}</span>
                  </button>`).join('')}
                </div>
                <p id="acc-hide-note" class="acc-hide-note acc-label">To bring it back sooner, clear this site's data in your browser.</p>
                <p class="acc-hide-warning acc-label" hidden>The widget stays hidden until you clear this site's data in your browser.</p>
                <div class="acc-hide-buttons">
                  <button type="button" class="acc-hide-cancel"><span class="acc-label">Close</span></button>
                  <button type="button" class="acc-hide-confirm"><span class="acc-label">Hide</span></button>
                </div>
              </div>
          </div>`}
          <div class="acc-menu-sheet">
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
                      const languageRegion = this.getLanguageCountryLabel(language.code);
                      return `<button type="button" class="acc-lang-item${language.code === activeLanguageCode ? ' selected' : ''}" data-lang="${language.code}" aria-label="${languageLabel}">
                        <span class="acc-lang-item-main">
                          <span class="acc-lang-flag" aria-hidden="true">${languageFlag}</span>
                          <span class="acc-lang-item-label">${this.getLanguageName(language)} <span class="acc-lang-item-region">${languageRegion}</span></span>
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
              <div class="acc-actions">
                <button type="button" class="acc-action-reset">
                  ${this.widgetIcons.reset}
                  <span class="acc-reset-text">
                    <span class="acc-label">Reset settings</span>
                    <span class="acc-reset-count" hidden></span>
                  </span>
                </button>
              </div>
              <div class="acc-options">${tilesMarkup}</div>
            </div>
          </div>
          </div>
          ${this.options.hideAttribution === true ? '' : `<div class="acc-footer">
            <a class="acc-footer-brand" href="https://accessibleweb.pages.dev/" target="_blank" rel="noopener noreferrer">AccessibleWeb</a>
            <a class="acc-footer-statement" href="https://accessibleweb.pages.dev/statement" target="_blank" rel="noopener noreferrer"><span class="acc-label">Accessibility Statement</span></a>
          </div>`}
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
            this.menuDockOverride = dockOverride;
            this.dockMenu(menu, this.getLauncherPosition(position));

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
      
            // The "how long" choices behave as one radio group: arrows move.
            menu.addEventListener('keydown', (e) => {
              const choice = e.target.closest ? e.target.closest('.acc-hide-choice') : null;
              if (!choice) return;
              const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
              if (!step) return;
              e.preventDefault();
              const choices = Array.from(menu.querySelectorAll('.acc-hide-choice'));
              const next = choices[(choices.indexOf(choice) + step + choices.length) % choices.length];
              this.selectHideChoice(menu, next);
              next.focus();
            });

            // click event handler:
            menu.addEventListener('click', (e) => {
              // A click anywhere outside the open "more" drop-down closes it.
              const morePanel = menu.querySelector('.acc-more-panel');
              if (morePanel && !morePanel.hidden && !e.target.closest('.acc-more-panel, .acc-menu-more')) {
                this.toggleMorePanel(menu, false, { restoreFocus: false });
              }
              const target = e.target.closest('[role="button"], button, .acc-overlay');
              if (!target) return;
              if (target.classList.contains('acc-menu-more')) {
                this.toggleMorePanel(menu, target.getAttribute('aria-expanded') !== 'true');
                return;
              }
              if (target.classList.contains('acc-overlay')) {
                this.closeMenu(menuContainer);
                return;
              }
              if (target.classList.contains('acc-more-move')) {
                this.moveLauncher();
                return;
              }
              if (target.classList.contains('acc-more-hide')) {
                // Already hidden (the menu was opened another way): bring the
                // button back. Otherwise ask for how long.
                if (this.isLauncherHiddenByVisitor()) {
                  this.showButton();
                } else {
                  this.toggleHidePanel(menu, true);
                }
                return;
              }
              if (target.classList.contains('acc-hide-choice')) {
                this.selectHideChoice(menu, target);
                return;
              }
              if (target.classList.contains('acc-hide-cancel')) {
                this.toggleHidePanel(menu, false);
                return;
              }
              if (target.classList.contains('acc-hide-confirm')) {
                const choice = menu.querySelector('.acc-hide-choice[aria-checked="true"]');
                const duration = choice ? choice.dataset.hideFor : 'visit';
                // "Always" takes a second click, after saying how to undo it.
                const warning = menu.querySelector('.acc-hide-warning');
                if (duration === 'always' && warning && warning.hidden) {
                  warning.hidden = false;
                  menu.querySelector('.acc-hide-choices').hidden = true;
                  this.announce(warning.textContent);
                  return;
                }
                this.toggleMorePanel(menu, false, { restoreFocus: false });
                this.hideLauncher(duration);
                return;
              }
              if (target.classList.contains('acc-action-reset')) {
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
                // The report closes the menu first and parks focus on the
                // toggle, which the panel captures as its restore target.
                if (key === 'accessibility-report') {
                  this.closeMenu(menuContainer);
                  this.runAccessibilityReport();
                }
                // Page Structure opens over the menu, which stays open
                // behind it; closing the dialog comes back to this tile.
                else if (key === 'page-structure') {
                  this.openPageStructurePanel();
                }
                // One-tap profiles bundle several feature states.
                else if (key && key.startsWith('profile-')) {
                  this.toggleAccessibilityProfile(key, menu);
                }
                // Dyslexia Font shares its saved state with Readable Font.
                else if (key === 'dyslexia-font') {
                  this.toggleDyslexiaFont(menu, btn);
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
          this.syncLauncherControls();

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
            this.toggleMorePanel(menu, false, { restoreFocus: false });
            this.syncLauncherControls();
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

      // The site owner replaced the floating button with their own trigger
      // (hideButton), so there is nothing for a visitor to hide.
      isLauncherRemovedByOwner() {
          const value = this.options?.hideButton;
          return value === true || String(value).trim().toLowerCase() === 'true';
        },

      // A visitor can hide the floating button for this visit (remembered for
      // the browser session), or for a day, a week or always (remembered with
      // the other saved choices).
      isLauncherHiddenByVisitor() {
          try {
            if (window.sessionStorage.getItem('acc-launcher-hidden') === '1') return true;
          } catch {
            // Session storage can be blocked; fall through to the saved date.
          }
          const until = Number(this.widgetConfig?.launcherHiddenUntil) || 0;
          return until > Date.now();
        },

      setLauncherHiddenByVisitor(hidden, duration = 'visit') {
          // "Always" is stored as a date a hundred years away.
          const days = { day: 1, week: 7, always: 36500 }[duration];
          try {
            if (hidden && !days) {
              window.sessionStorage.setItem('acc-launcher-hidden', '1');
            } else {
              window.sessionStorage.removeItem('acc-launcher-hidden');
            }
          } catch {
            // Storage can be blocked; the button is then hidden for this page only.
          }
          const until = hidden && days ? Date.now() + days * 24 * 60 * 60 * 1000 : 0;
          if (until || this.widgetConfig?.launcherHiddenUntil) {
            this.saveConfig({ launcherHiddenUntil: until });
          }
          if (this.widgetToggleButton) {
            this.widgetToggleButton.hidden = hidden;
          }
          this.syncLauncherControls();
        },

      // duration: 'visit' | 'day' | 'week' | 'always'
      hideLauncher(duration = 'visit') {
          this.close();
          this.setLauncherHiddenByVisitor(true, duration);
          // close() hands focus back to the button that has just gone.
          const active = this.widgetRoot?.activeElement || document.activeElement;
          if (active && typeof active.blur === 'function') active.blur();
        },

      // Brings the floating button back: from the menu's own Hide button when
      // it is already hidden, or from a host page's "show accessibility
      // options" control.
      showButton() {
          this.setLauncherHiddenByVisitor(false);
        },

      // The header's "more" button opens a small drop-down holding Move widget
      // and Hide widget.
      toggleMorePanel(menu, open, { restoreFocus = true } = {}) {
          const panel = menu?.querySelector('.acc-more-panel');
          const button = menu?.querySelector('.acc-menu-more');
          if (!panel || !button) return;
          // Always reopen on the two items, not on the "how long" step.
          this.toggleHidePanel(menu, false, { restoreFocus: false });
          panel.hidden = !open;
          button.setAttribute('aria-expanded', String(open));
          if (open) {
            const first = panel.querySelector('.acc-more-item');
            if (first) first.focus();
          } else if (restoreFocus) {
            button.focus();
          }
        },

      // The step between clicking Hide widget and hiding: inside the
      // drop-down it takes the place of the two items and asks for how long.
      toggleHidePanel(menu, open, { restoreFocus = true } = {}) {
          const panel = menu?.querySelector('.acc-hide-panel');
          const actions = menu?.querySelector('.acc-more-list');
          if (!panel || !actions) return;
          panel.hidden = !open;
          actions.hidden = open;
          // Always start from the choices, not from the "Always" warning.
          const warning = panel.querySelector('.acc-hide-warning');
          const choices = panel.querySelector('.acc-hide-choices');
          if (warning) warning.hidden = true;
          if (choices) choices.hidden = false;
          if (open) {
            const checked = panel.querySelector('.acc-hide-choice[aria-checked="true"]');
            if (checked) checked.focus();
          } else if (restoreFocus) {
            const hide = actions.querySelector('.acc-more-hide');
            if (hide) hide.focus();
          }
        },

      selectHideChoice(menu, choice) {
          menu.querySelectorAll('.acc-hide-choice').forEach((item) => {
            const on = item === choice;
            item.setAttribute('aria-checked', String(on));
            item.setAttribute('tabindex', on ? '0' : '-1');
          });
        },

      // Where the floating button sits: the site's own setting, with the
      // visitor's chosen side (left or right) on top of it.
      getLauncherPosition(basePosition) {
          const base = String(basePosition || this.options?.position || 'bottom-right');
          const side = this.widgetConfig?.launcherSide;
          if (side !== 'left' && side !== 'right') return base;
          return `${base.startsWith('top') ? 'top' : 'bottom'}-${side}`;
        },

      placeLauncher() {
          const btn = this.widgetToggleButton;
          if (!btn) return;
          const position = this.getLauncherPosition();
          const [offsetX = 20, offsetY = 25] = this.launcherOffset || [20, 20];
          const onRight = position.endsWith('right');
          const onTop = position.startsWith('top');
          Object.assign(btn.style, {
            left: onRight ? 'auto' : `${offsetX}px`,
            right: onRight ? `${offsetX}px` : 'auto',
            top: onTop ? `${offsetY}px` : 'auto',
            bottom: onTop ? 'auto' : `${offsetY}px`
          });
        },

      dockMenu(menu, position) {
          if (!menu) return;
          const onRight = this.menuDockOverride
            ? this.menuDockOverride === 'right'
            : String(position).endsWith('right');
          menu.style.right = onRight ? 'var(--acc-menu-inline-gap, 12px)' : 'auto';
          menu.style.left = onRight ? 'auto' : 'var(--acc-menu-inline-gap, 12px)';
        },

      // Flips the floating button, and the menu with it, to the other side of
      // the screen. The choice is remembered on this device.
      moveLauncher() {
          const side = this.getLauncherPosition().endsWith('right') ? 'left' : 'right';
          this.saveConfig({ launcherSide: side });
          this.placeLauncher();
          const menu = this.menuContainer?.querySelector('.acc-menu');
          this.dockMenu(menu, this.getLauncherPosition());
          this.syncLauncherControls();
        },

      // Keeps the Move row and the Hide button in step with the saved state.
      syncLauncherControls() {
          const root = this.menuContainer || this.widgetContainerEl;
          if (!root) return;
          const position = this.getLauncherPosition();
          const move = root.querySelector('.acc-more-move');
          if (move) {
            const basePosition = String(this.options?.position || 'bottom-right');
            move.setAttribute('aria-pressed', String(position.endsWith('right') !== basePosition.endsWith('right')));
          }
          const hide = root.querySelector('.acc-more-hide');
          if (hide) {
            hide.setAttribute('aria-pressed', String(this.isLauncherHiddenByVisitor()));
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

              const { offset = [20, 20], size } = options;
              this.launcherOffset = this.normalizeOffset(offset) || [20, 20];
              this.placeLauncher();

              if (size !== undefined && size !== null && String(size).trim() !== '') {
                const buttonSize = this.normalizeButtonSize(size);
                btn.style.setProperty('--acc-button-size', buttonSize);
              }

              btn.addEventListener("click", () => this.toggle());
              if (this.isLauncherHiddenByVisitor()) {
                btn.hidden = true;
              }
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

    /*!
     * AccessibleWeb Widget
     * (version is injected into dist builds from package.json at build time)
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
          },
          'monochrome': {
            styles: { 'filter': 'grayscale(100%)' },
            selector: PAGE_CONTENT_SELECTOR
          }
        };

        this.translations = TRANSLATIONS;
        this.supportedLanguages = SUPPORTED_LANGUAGES.map((language) => ({ ...language }));

        this.accessTools = [
          // Hidden on touch-only devices, where there is no cursor to enlarge.
          { label: 'Big Cursor', key: 'large-pointer', icon: this.widgetIcons.largePointer, requiresFinePointer: true },
          { label: 'Stop Animations', key: 'pause-motion', icon: this.widgetIcons.pauseMotion },
          { label: 'Reading Guide', key: 'reading-aid', icon: this.widgetIcons.readingAid },
          {
            label: 'Text to Speech',
            key: 'text-to-speech',
            icon: this.widgetIcons.textToSpeech,
            // Speed levels are defined with ttsSpeedChoices below.
            multiLevel: true,
            requiresSpeechSynthesis: true
          },
          { label: 'Simplify Layout', key: 'simple-layout', icon: this.widgetIcons.simplifyLayout },
          { label: 'Mute Sounds', key: 'mute-sounds', icon: this.widgetIcons.muteSounds },
          { label: 'Text Magnifier', key: 'text-magnifier', icon: this.widgetIcons.textMagnifier },
          // Shown on hover and on keyboard focus; touch-only devices have neither.
          { label: 'Tooltips', key: 'tooltips', icon: this.widgetIcons.tooltips, requiresFinePointer: true },
          {
            label: 'Page Structure',
            key: 'page-structure',
            icon: this.widgetIcons.pageStructure,
            isAction: true
          },
          // Dev tools: shown only when isDevMode() is true (see displayMenu).
          { label: 'Annotations', key: 'annotations', icon: this.widgetIcons.annotations, devOnly: true },
          {
            label: 'Accessibility Report',
            key: 'accessibility-report',
            icon: this.widgetIcons.accessibilityReport,
            isAction: true,
            devOnly: true
          }
        ];

        // One-tap presets bundling existing features. Each profile persists its
        // own state key plus the bundled feature states.
        this.accessibilityProfiles = [
          {
            label: 'Seizure Safe',
            key: 'profile-seizure-safe',
            icon: this.widgetIcons.pauseMotion,
            states: { 'pause-motion': true, 'low-saturation': true }
          },
          {
            label: 'Vision Impaired',
            key: 'profile-vision',
            icon: this.widgetIcons.highContrast,
            states: { 'text-scale': 1.5, 'high-contrast-mode': true, 'large-pointer': true }
          },
          {
            label: 'ADHD Friendly',
            key: 'profile-adhd',
            icon: this.widgetIcons.readingAid,
            states: { 'reading-aid': true, 'pause-motion': true }
          },
          {
            label: 'Dyslexia Friendly',
            key: 'profile-dyslexia',
            icon: this.widgetIcons.dyslexiaFont,
            states: { 'readable-text': 'dyslexic', 'line-spacing': true, 'letter-spacing': true }
          }
        ];

        // axe-core state
        this.axeCoreLoaded = false;
        this.axeCorePromise = null;
        this.axeScanResults = null;
        this.axeScanPromise = null;
        this.violationBubble = null;

        // Accessibility report modal state
        this.reportPanel = null;
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

        // Font Size levels, as the multiplier persisted in the text-scale state
        // (1 = off). Stored values from the old slider snap to the nearest one.
        this.textScaleLevels = [1.1, 1.25, 1.5];
        // Text to Speech speeds, persisted by key in the text-to-speech state
        // (legacy true = normal). Each scales the site's ttsRate.
        this.ttsSpeedChoices = [
          { key: 'normal', rate: 1 },
          { key: 'slow', rate: 0.8 },
          { key: 'fast', rate: 1.3 }
        ];
        // Line Height levels, as the line-height persisted in the line-spacing
        // state (legacy true = the first level). Headings get three quarters
        // of it, so large type does not fly apart.
        this.lineSpacingLevels = [2, 2.5, 3];
        // Letter Spacing levels, persisted as 1 to 3 in the letter-spacing
        // state (legacy true = 1). Each step adds 0.12em between letters and
        // 0.16em between words, the WCAG 1.4.12 text spacing amounts.
        this.letterSpacingLevels = [1, 2, 3];
        // The Contrast tile's choices, in click order, each stored under its
        // own state key. Smart recolors only text that is hard to read; Dark
        // is a black page; Light is a white page with black text, kept under
        // the key of the old High Contrast tile, which it replaces.
        this.contrastModes = ['smart-contrast', 'dark-contrast', 'high-contrast-mode'];
        this.saturationFilterValues = ['low-saturation', 'high-saturation', 'monochrome'];

        // The reading fonts; the persisted readable-text state holds the
        // active key ('dyslexic' | 'legible' | 'lexend'; legacy true maps to
        // 'dyslexic'). Labels are translation keys except the Lexend brand
        // name. One font is on at a time, from two tiles: Dyslexia Font has a
        // tile of its own, so nobody has to look for it, and the Readable
        // Font tile steps through the others.
        this.readableFontChoices = [
          { key: 'dyslexic', label: 'Dyslexia Font', family: '"OpenDyslexic3", "Comic Sans MS", Arial, Helvetica, sans-serif' },
          { key: 'legible', label: 'Legible Font', family: '"Atkinson Hyperlegible", Verdana, Arial, Helvetica, sans-serif' },
          { key: 'lexend', label: 'Lexend', family: '"Lexend", "Segoe UI", Roboto, Arial, sans-serif' }
        ];
        this.readableFontTileKeys = ['legible', 'lexend'];

        this.contentOptions = [
          { label: 'Font Weight', key: 'bold-text', icon: this.widgetIcons.boldText },
          {
            label: 'Line Height',
            key: 'line-spacing',
            icon: this.widgetIcons.lineSpacing,
            multiLevel: true,
            levels: this.lineSpacingLevels.length
          },
          {
            label: 'Letter Spacing',
            key: 'letter-spacing',
            icon: this.widgetIcons.letterSpacing,
            multiLevel: true,
            levels: this.letterSpacingLevels.length
          },
          { label: 'Hide Images', key: 'hide-images', icon: this.widgetIcons.hideImages },
          // No saved state of its own: on means readable-text is 'dyslexic'.
          { label: 'Dyslexia Font', key: 'dyslexia-font', icon: this.widgetIcons.dyslexiaFont },
          {
            label: 'Readable Font',
            key: 'readable-text',
            icon: this.widgetIcons.readableFont,
            multiLevel: true,
            levels: this.readableFontTileKeys.length
          },
          { label: 'Highlight Links', key: 'highlight-links', icon: this.widgetIcons.highlightLinks },
          {
            label: 'Font Size',
            key: 'text-scale',
            icon: this.widgetIcons.adjustFontSize,
            multiLevel: true,
            levels: this.textScaleLevels.length
          }
        ];

        this.multiLevelFeatures = {
          'contrast-toggle': {
            levels: this.contrastModes.length,
            currentIndex: -1,
            values: this.contrastModes
          },
          'saturation-toggle': {
            levels: this.saturationFilterValues.length,
            currentIndex: -1,
            values: this.saturationFilterValues
          },
          'readable-text': {
            levels: this.readableFontTileKeys.length,
            currentIndex: -1,
            values: this.readableFontTileKeys
          },
          'text-scale': {
            levels: this.textScaleLevels.length,
            currentIndex: -1,
            values: this.textScaleLevels
          },
          'line-spacing': {
            levels: this.lineSpacingLevels.length,
            currentIndex: -1,
            values: this.lineSpacingLevels
          },
          'letter-spacing': {
            levels: this.letterSpacingLevels.length,
            currentIndex: -1,
            values: this.letterSpacingLevels
          },
          'text-to-speech': {
            levels: this.ttsSpeedChoices.length,
            currentIndex: -1,
            values: this.ttsSpeedChoices.map((choice) => choice.key)
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
            levels: this.contrastModes.length
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
        // Which layout the Font Size starting sizes were measured under, and
        // the sizes the page itself wrote on elements, to put back later.
        this.textScaleLayout = null;
        this.textScaleInlineSizes = null;
        // The body's own color while a color filter overrides it.
        this.unfilteredBodyBackground = null;

        // Global settings and state
        this.widgetConfig = {};
        this.cookieKey = 'accweb';
        this.readingAidVisible = false;
        this.readingGuideY = null;
        this.readingGuideListeners = null;
        this.readableFontsLoaded = new Set();
        // Counts reading-font switches, so one still waiting for its font
        // file gives way to a later choice.
        this.readableFontRequest = 0;

        // Shadow DOM host for the widget UI
        this.shadowHost = null;
        this.widgetRoot = null;

        // Screen-reader live region
        this.liveRegion = null;
        this.liveRegionTimer = null;

        // Smart Contrast state: each recolored element with its own inline
        // color from before, so it can be put back.
        this.smartContrastFixed = new Map();
        this.smartContrastActive = null;
        this.smartContrastObserver = null;
        this.smartContrastTimer = null;
        this.contrastLoadHandler = null;

        // Mute sounds state
        this.muteSoundsObserver = null;

        // Stop Animations media state (paused videos / frozen GIFs)
        this.motionPauseObserver = null;
        this.frozenGifs = [];

        // Text magnifier state
        this.magnifierElement = null;
        this.magnifierMoveHandler = null;
        this.magnifierDownHandler = null;
        this.magnifierScrollHandler = null;
        this.magnifierLastPointerType = null;

        // Tooltips state: the bubble, the element it describes, and that
        // element's own title, held back while the bubble shows.
        this.tooltipElement = null;
        this.tooltipAnchor = null;
        this.tooltipHeldTitle = null;
        this.tooltipHandlers = null;

        // Page structure panel state
        this.structurePanel = null;

        // Menu state tracking for focus management
        this.activeMenuContainer = null;
        this.activeMenuToggle = null;
        this.menuKeyListener = null;
        this.previousFocus = null;
        // Last input was a pointer (tap/click) rather than the keyboard.
        this.lastInputWasPointer = false;
        this.widgetToggleButton = null;
        this.skipLinkElement = null;
        this.menuContainer = null;
        this.widgetContainerEl = null;
        this.launchOptions = null;

        // Style registration state
        this.staticStylesRegistered = false;
        // id → CSSStyleSheet for the constructable-stylesheet injection path
        this.adoptedSheets = new Map();
        this.styleNonce = '';

        this.dataOptions = this.getDataAttributeOptions();

        // `lang` is intentionally not defaulted here: startAccessibleWebWidget()
        // resolves it as saved user pick → embed config → <html lang> → browser.
        this.options = {
          position: 'bottom-right',
          ...this.dataOptions,
          ...options
        };

        this.applyThemeOverrides(this.options);

        // CSP nonce for the <style>-element fallback path (options.nonce,
        // data-acc-nonce, or auto-captured from document.currentScript).
        this.styleNonce = typeof this.options.nonce === 'string' ? this.options.nonce.trim() : '';

        // Raw values; getNativeTtsRate()/getNativeTtsPitch() clamp on read.
        this.nativeTtsConfig = {
          preferredVoiceName: (
            typeof options.ttsNativeVoiceName === 'string' &&
            options.ttsNativeVoiceName.trim()
          ) ? options.ttsNativeVoiceName.trim() : '',
          preferredVoiceLang: (
            typeof options.ttsNativeVoiceLang === 'string' &&
            options.ttsNativeVoiceLang.trim()
          ) ? options.ttsNativeVoiceLang.trim() : '',
          rate: options.ttsRate,
          pitch: options.ttsPitch
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
          'zIndex',
          'menuPosition'
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
      // A second copy of the script re-evaluates this module and replaces the
      // global; carry the already-started instance over so the public API
      // (AccessibleWebWidget.instance.open()) keeps pointing at the live widget.
      const previousGlobal = window.AccessibleWebWidget;
      window.AccessibleWebWidget = AccessibleWebWidget;
      if (previousGlobal?.instance) {
        AccessibleWebWidget.instance = previousGlobal.instance;
      }
    }

    if (typeof document !== 'undefined') {
      const configuredOptions = (
        typeof window !== 'undefined' &&
        window.AccessibleWebWidgetOptions &&
        typeof window.AccessibleWebWidgetOptions === 'object'
      ) ? window.AccessibleWebWidgetOptions : {};

      // document.currentScript is only valid during initial script evaluation,
      // so the CSP nonce has to be captured here, not at DOMContentLoaded.
      const scriptNonce = (
        document.currentScript &&
        typeof document.currentScript.nonce === 'string'
      ) ? document.currentScript.nonce : '';
      const globalAutoInitOptions = (scriptNonce && configuredOptions.nonce === undefined)
        ? { ...configuredOptions, nonce: scriptNonce }
        : configuredOptions;

      /** @type {AccessibleWebWidgetInstance} */
      const widgetInstance = new AccessibleWebWidget(globalAutoInitOptions);
      // Programmatic access for host pages: AccessibleWebWidget.instance.open()
      // / .close() / .toggle() (pairs with the hideButton option). Never clobber
      // an instance that a first copy of the script already started — this one's
      // startAccessibleWebWidget() will see the existing host and no-op.
      if (!AccessibleWebWidget.instance) {
        AccessibleWebWidget.instance = widgetInstance;
      }
      if (document.readyState === 'complete' || document.readyState === 'interactive') {
        widgetInstance.startAccessibleWebWidget();
      } else {
        document.addEventListener('DOMContentLoaded', () => widgetInstance.startAccessibleWebWidget());
      }
    }

    return AccessibleWebWidget;

})();
