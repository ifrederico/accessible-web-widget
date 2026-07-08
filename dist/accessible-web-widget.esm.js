/*!
 * AccessibleWeb Widget v1.5.3
 * https://github.com/ifrederico/accessible-web-widget
 *
 * Copyright (c) 2025 ifrederico
 * Released under the MIT License
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.
 * See DISCLAIMER.md for important legal information.
 * This widget does not guarantee accessibility compliance.
 */
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
      headerHeight: '64px',
      borderRadius: '8px',
      buttonBorderRadius: '0.4rem',
      menuPosition: '', // optional 'left' | 'right'; empty follows the button position
      zIndex: 100000,
      
      // WCAG-specific
      focusBorderWidth: '3px',
      focusOutlineOffset: '2px'
    };

const WIDGET_ICONS = {
      accessibility: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M423.5-743.5Q400-767 400-800t23.5-56.5Q447-880 480-880t56.5 23.5Q560-833 560-800t-23.5 56.5Q513-720 480-720t-56.5-23.5ZM360-80v-520q-60-5-122-15t-118-25l20-80q78 21 166 30.5t174 9.5q86 0 174-9.5T820-720l20 80q-56 15-118 25t-122 15v520h-80v-240h-80v240h-80Z"/></svg>',
      accessibilityVariants: {
            default: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M423.5-743.5Q400-767 400-800t23.5-56.5Q447-880 480-880t56.5 23.5Q560-833 560-800t-23.5 56.5Q513-720 480-720t-56.5-23.5ZM360-80v-520q-60-5-122-15t-118-25l20-80q78 21 166 30.5t174 9.5q86 0 174-9.5T820-720l20 80q-56 15-118 25t-122 15v520h-80v-240h-80v240h-80Z"/></svg>',
            'icon-2': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M423.5-743.5Q400-767 400-800t23.5-56.5Q447-880 480-880t56.5 23.5Q560-833 560-800t-23.5 56.5Q513-720 480-720t-56.5-23.5ZM360-80v-520H120v-80h720v80H600v520h-80v-240h-80v240h-80Z"/></svg>',
            'icon-3': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M423.5-743.5Q400-767 400-800t23.5-56.5Q447-880 480-880t56.5 23.5Q560-833 560-800t-23.5 56.5Q513-720 480-720t-56.5-23.5ZM680-80v-200H480q-33 0-56.5-23.5T400-360v-240q0-33 23.5-56.5T480-680q24 0 41.5 10.5T559-636q55 66 99.5 90.5T760-520v80q-53 0-107-23t-93-55v138h120q33 0 56.5 23.5T760-300v220h-80Zm-280 0q-83 0-141.5-58.5T200-280q0-72 45.5-127T360-476v82q-35 14-57.5 44.5T280-280q0 50 35 85t85 35q39 0 69.5-22.5T514-240h82q-14 69-69 114.5T400-80Z"/></svg>',
            'icon-4': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M320-80q-83 0-141.5-58.5T120-280q0-83 58.5-141.5T320-480v80q-50 0-85 35t-35 85q0 50 35 85t85 35q50 0 85-35t35-85h80q0 83-58.5 141.5T320-80Zm360-40v-200H440q-44 0-68-37.5t-6-78.5l74-164h-91l-24 62-77-22 28-72q9-23 29.5-35.5T350-680h208q45 0 68.5 36.5T632-566l-66 146h114q33 0 56.5 23.5T760-340v220h-80Zm-96.5-603.5Q560-747 560-780t23.5-56.5Q607-860 640-860t56.5 23.5Q720-813 720-780t-23.5 56.5Q673-700 640-700t-56.5-23.5Z"/></svg>'
      },
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
      adjustFontSize: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M2 4v3h5v12h3V7h5V4H2m19 5h-9v3h3v7h3v-7h3V9Z"/></svg>',
      hideImages: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="m840-234-80-80v-446H314l-80-80h526q33 0 56.5 23.5T840-760v526ZM792-56l-64-64H200q-33 0-56.5-23.5T120-200v-528l-64-64 56-56 736 736-56 56ZM240-280l120-160 90 120 33-44-283-283v447h447l-80-80H240Zm297-257ZM424-424Z"/></svg>',
      accessibilityReport: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h168q13-36 43.5-58t68.5-22q38 0 68.5 22t43.5 58h168q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm80-80h280v-80H280v80Zm0-160h400v-80H280v80Zm0-160h400v-80H280v80Zm221.5-198.5Q510-807 510-820t-8.5-21.5Q493-850 480-850t-21.5 8.5Q450-833 450-820t8.5 21.5Q467-790 480-790t21.5-8.5ZM200-200v-560 560Z"/></svg>',
      annotations: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v268q-19-9-39-15.5t-41-9.5v-243H200v560h242q3 22 9.5 42t15.5 38H200Zm0-120v40-560 243-3 280Zm80-40h163q3-21 9.5-41t14.5-39H280v80Zm0-160h244q32-30 71.5-50t84.5-27v-3H280v80Zm0-160h400v-80H280v80ZM720-40q-83 0-141.5-58.5T520-240q0-83 58.5-141.5T720-440q83 0 141.5 58.5T920-240q0 83-58.5 141.5T720-40Zm-20-80h40v-100h100v-40H740v-100h-40v100H600v40h100v100Z"/></svg>',
      textToSpeech: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M560-131v-82q90-26 145-100t55-168q0-94-55-168T560-749v-82q124 28 202 125.5T840-481q0 127-78 224.5T560-131ZM120-360v-240h160l200-200v640L280-360H120Zm440 40v-322q47 22 73.5 66t26.5 96q0 51-26.5 94.5T560-320ZM400-606l-86 86H200v80h114l86 86v-252ZM300-480Z"/></svg>',
      highContrast: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93v640Z"/></svg>',
      simplifyLayout: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M760-360v-80H200v80h560Zm0-160v-80H200v80h560Zm0-160v-80H200v80h560ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm560-80v-80H200v80h560Z"/></svg>',
      muteSounds: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M792-56 671-177q-25 16-53 27.5T560-131v-82q14-5 27.5-10t25.5-12L480-368v208L280-360H120v-240h128L56-792l56-56 736 736-56 56Zm-8-232-58-58q17-31 25.5-65t8.5-70q0-94-55-168T560-749v-82q124 28 202 125.5T840-481q0 53-14.5 102T784-288ZM650-422l-90-90v-130q47 22 73.5 66t26.5 96q0 15-2.5 29.5T650-422ZM480-592 376-696l104-104v208Zm-80 238v-94l-72-72H200v80h114l86 86Zm-36-130Z"/></svg>',
      textMagnifier: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Zm-40-60v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80Z"/></svg>',
      pageStructure: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M120-240v-80h480v80H120Zm0-200v-80h480v80H120Zm0-200v-80h480v80H120Zm600 400v-80h120v80H720Zm0-200v-80h120v80H720Zm0-200v-80h120v80H720Z"/></svg>'
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
        "Reset settings": "Redefinir configurações",
        "Reset All Settings": "Redefinir todas as configurações",
        "Close": "Fechar",
        "Content Adjustments": "Ajustes de Conteúdo",
        "Adjust Font Size": "Ajustar Tamanho da Fonte",
        "Highlight Title": "Destacar Títulos",
        "Highlight Links": "Destacar Links",
        "Readable Font": "Fonte Legível",
        "Color Adjustments": "Ajustes de Cor",
        "Invert Colors": "Inverter Cores",
        "Light Contrast": "Contraste Claro",
        "Dark Contrast": "Contraste Escuro",
        "High Contrast": "Alto Contraste",
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
        "Annotations": "Annotations",
        "Text to Speech": "Text to Speech",
        "Text to Speech On": "Texto a Voz Activado",
        "Text to Speech Off": "Texto a Voz Desactivado",
        "Simplify Layout": "Simplify Layout",
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
        "Play": "Play",
        "Pause": "Pause",
        "Stop": "Stop",
        "Loading voice...": "Cargando voz...",
        "Reading...": "Reading...",
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
        "Reset settings": "إعادة تعيين الإعدادات",
        "Reset All Settings": "إعادة تعيين جميع الإعدادات",
        "Close": "إغلاق",
        "Content Adjustments": "تعديلات المحتوى",
        "Adjust Font Size": "تعديل حجم الخط",
        "Highlight Title": "تمييز العناوين",
        "Highlight Links": "تمييز الروابط",
        "Readable Font": "خط سهل القراءة",
        "Color Adjustments": "تعديلات الألوان",
        "Invert Colors": "عكس الألوان",
        "Light Contrast": "تباين فاتح",
        "Dark Contrast": "تباين داكن",
        "High Contrast": "تباين عالٍ",
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
        "Reset settings": "איפוס הגדרות",
        "Reset All Settings": "איפוס כל ההגדרות",
        "Close": "סגירה",
        "Content Adjustments": "התאמות תוכן",
        "Adjust Font Size": "התאמת גודל גופן",
        "Highlight Title": "הדגשת כותרות",
        "Highlight Links": "הדגשת קישורים",
        "Readable Font": "גופן קריא",
        "Color Adjustments": "התאמות צבע",
        "Invert Colors": "היפוך צבעים",
        "Light Contrast": "ניגודיות בהירה",
        "Dark Contrast": "ניגודיות כהה",
        "High Contrast": "ניגודיות גבוהה",
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
        "Reset settings": "Återställ inställningar",
        "Reset All Settings": "Återställ alla inställningar",
        "Close": "Stäng",
        "Content Adjustments": "Innehållsjusteringar",
        "Adjust Font Size": "Justera textstorlek",
        "Highlight Title": "Markera rubriker",
        "Highlight Links": "Markera länkar",
        "Readable Font": "Läsbart typsnitt",
        "Color Adjustments": "Färgjusteringar",
        "Invert Colors": "Invertera färger",
        "Light Contrast": "Ljus kontrast",
        "Dark Contrast": "Mörk kontrast",
        "High Contrast": "Hög kontrast",
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
        "Reset settings": "Nulstil indstillinger",
        "Reset All Settings": "Nulstil alle indstillinger",
        "Close": "Luk",
        "Content Adjustments": "Indholdsjusteringer",
        "Adjust Font Size": "Juster skriftstørrelse",
        "Highlight Title": "Fremhæv overskrifter",
        "Highlight Links": "Fremhæv links",
        "Readable Font": "Letlæselig skrifttype",
        "Color Adjustments": "Farvejusteringer",
        "Invert Colors": "Invertér farver",
        "Light Contrast": "Lys kontrast",
        "Dark Contrast": "Mørk kontrast",
        "High Contrast": "Høj kontrast",
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
        "Reset settings": "Restableix la configuració",
        "Reset All Settings": "Restableix tota la configuració",
        "Close": "Tanca",
        "Content Adjustments": "Ajustos de contingut",
        "Adjust Font Size": "Ajusta la mida del text",
        "Highlight Title": "Ressalta els títols",
        "Highlight Links": "Ressalta els enllaços",
        "Readable Font": "Tipografia llegible",
        "Color Adjustments": "Ajustos de color",
        "Invert Colors": "Inverteix els colors",
        "Light Contrast": "Contrast clar",
        "Dark Contrast": "Contrast fosc",
        "High Contrast": "Contrast alt",
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
        "Reset settings": "Ponastavi nastavitve",
        "Reset All Settings": "Ponastavi vse nastavitve",
        "Close": "Zapri",
        "Content Adjustments": "Prilagoditve vsebine",
        "Adjust Font Size": "Prilagodi velikost pisave",
        "Highlight Title": "Označi naslove",
        "Highlight Links": "Označi povezave",
        "Readable Font": "Berljiva pisava",
        "Color Adjustments": "Prilagoditve barv",
        "Invert Colors": "Obrni barve",
        "Light Contrast": "Svetli kontrast",
        "Dark Contrast": "Temni kontrast",
        "High Contrast": "Visok kontrast",
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
        "Reset settings": "Atiestatīt iestatījumus",
        "Reset All Settings": "Atiestatīt visus iestatījumus",
        "Close": "Aizvērt",
        "Content Adjustments": "Satura pielāgojumi",
        "Adjust Font Size": "Pielāgot fonta lielumu",
        "Highlight Title": "Izcelt virsrakstus",
        "Highlight Links": "Izcelt saites",
        "Readable Font": "Lasāms fonts",
        "Color Adjustments": "Krāsu pielāgojumi",
        "Invert Colors": "Invertēt krāsas",
        "Light Contrast": "Gaišs kontrasts",
        "Dark Contrast": "Tumšs kontrasts",
        "High Contrast": "Augsts kontrasts",
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
        "Reset settings": "Επαναφορά ρυθμίσεων",
        "Reset All Settings": "Επαναφορά όλων των ρυθμίσεων",
        "Close": "Κλείσιμο",
        "Content Adjustments": "Προσαρμογές περιεχομένου",
        "Adjust Font Size": "Προσαρμογή μεγέθους γραμματοσειράς",
        "Highlight Title": "Επισήμανση τίτλων",
        "Highlight Links": "Επισήμανση συνδέσμων",
        "Readable Font": "Ευανάγνωστη γραμματοσειρά",
        "Color Adjustments": "Προσαρμογές χρωμάτων",
        "Invert Colors": "Αντιστροφή χρωμάτων",
        "Light Contrast": "Φωτεινή αντίθεση",
        "Dark Contrast": "Σκοτεινή αντίθεση",
        "High Contrast": "Υψηλή αντίθεση",
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
        "Reset settings": "პარამეტრების აღდგენა",
        "Reset All Settings": "ყველა პარამეტრის აღდგენა",
        "Close": "დახურვა",
        "Content Adjustments": "შინაარსის მორგება",
        "Adjust Font Size": "შრიფტის ზომის მორგება",
        "Highlight Title": "სათაურების გამოკვეთა",
        "Highlight Links": "ბმულების გამოკვეთა",
        "Readable Font": "ადვილად წასაკითხი შრიფტი",
        "Color Adjustments": "ფერების მორგება",
        "Invert Colors": "ფერების ინვერსია",
        "Light Contrast": "ღია კონტრასტი",
        "Dark Contrast": "მუქი კონტრასტი",
        "High Contrast": "მაღალი კონტრასტი",
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
        "Reset settings": "ቅንብሮችን ዳግም አስጀምር",
        "Reset All Settings": "ሁሉንም ቅንብሮች ዳግም አስጀምር",
        "Close": "ዝጋ",
        "Content Adjustments": "የይዘት ማስተካከያዎች",
        "Adjust Font Size": "የቅርጸ-ቁምፊ መጠን አስተካክል",
        "Highlight Title": "ርዕስን አድምቅ",
        "Highlight Links": "አገናኞችን አድምቅ",
        "Readable Font": "ተነባቢ ቅርጸ-ቁምፊ",
        "Color Adjustments": "የቀለም ማስተካከያዎች",
        "Invert Colors": "ቀለማትን ገልብጥ",
        "Light Contrast": "ብሩህ ንፅፅር",
        "Dark Contrast": "ጨለማ ንፅፅር",
        "High Contrast": "ከፍተኛ ንፅፅር",
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
        "Reset settings": "Нулиране на настройките",
        "Reset All Settings": "Нулиране на всички настройки",
        "Close": "Затвори",
        "Content Adjustments": "Настройки на съдържанието",
        "Adjust Font Size": "Промяна на размера на шрифта",
        "Highlight Title": "Открояване на заглавия",
        "Highlight Links": "Открояване на връзки",
        "Readable Font": "Четлив шрифт",
        "Color Adjustments": "Настройки на цветовете",
        "Invert Colors": "Инвертиране на цветовете",
        "Light Contrast": "Светъл контраст",
        "Dark Contrast": "Тъмен контраст",
        "High Contrast": "Висок контраст",
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
        "Reset settings": "সেটিংস রিসেট করুন",
        "Reset All Settings": "সব সেটিংস রিসেট করুন",
        "Close": "বন্ধ করুন",
        "Content Adjustments": "কনটেন্ট সমন্বয়",
        "Adjust Font Size": "ফন্টের আকার সমন্বয় করুন",
        "Highlight Title": "শিরোনাম হাইলাইট করুন",
        "Highlight Links": "লিঙ্ক হাইলাইট করুন",
        "Readable Font": "পাঠযোগ্য ফন্ট",
        "Color Adjustments": "রঙের সমন্বয়",
        "Invert Colors": "রং উল্টান",
        "Light Contrast": "হালকা কনট্রাস্ট",
        "Dark Contrast": "গাঢ় কনট্রাস্ট",
        "High Contrast": "উচ্চ কনট্রাস্ট",
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
        "Reset settings": "Obnovit nastavení",
        "Reset All Settings": "Obnovit všechna nastavení",
        "Close": "Zavřít",
        "Content Adjustments": "Úpravy obsahu",
        "Adjust Font Size": "Upravit velikost písma",
        "Highlight Title": "Zvýraznit nadpisy",
        "Highlight Links": "Zvýraznit odkazy",
        "Readable Font": "Čitelné písmo",
        "Color Adjustments": "Úpravy barev",
        "Invert Colors": "Invertovat barvy",
        "Light Contrast": "Světlý kontrast",
        "Dark Contrast": "Tmavý kontrast",
        "High Contrast": "Vysoký kontrast",
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
        "Reset settings": "بازنشانی تنظیمات",
        "Reset All Settings": "بازنشانی همهٔ تنظیمات",
        "Close": "بستن",
        "Content Adjustments": "تنظیمات محتوا",
        "Adjust Font Size": "تنظیم اندازهٔ قلم",
        "Highlight Title": "برجسته‌سازی عنوان‌ها",
        "Highlight Links": "برجسته‌سازی پیوندها",
        "Readable Font": "قلم خوانا",
        "Color Adjustments": "تنظیمات رنگ",
        "Invert Colors": "معکوس کردن رنگ‌ها",
        "Light Contrast": "کنتراست روشن",
        "Dark Contrast": "کنتراست تیره",
        "High Contrast": "کنتراست بالا",
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
        "Reset settings": "Palauta asetukset",
        "Reset All Settings": "Palauta kaikki asetukset",
        "Close": "Sulje",
        "Content Adjustments": "Sisällön säädöt",
        "Adjust Font Size": "Säädä fonttikokoa",
        "Highlight Title": "Korosta otsikot",
        "Highlight Links": "Korosta linkit",
        "Readable Font": "Luettava fontti",
        "Color Adjustments": "Värisäädöt",
        "Invert Colors": "Käänteiset värit",
        "Light Contrast": "Vaalea kontrasti",
        "Dark Contrast": "Tumma kontrasti",
        "High Contrast": "Korkea kontrasti",
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
        "Reset settings": "I-reset ang mga setting",
        "Reset All Settings": "I-reset ang Lahat ng Setting",
        "Close": "Isara",
        "Content Adjustments": "Mga Pagsasaayos sa Nilalaman",
        "Adjust Font Size": "Isaayos ang Laki ng Font",
        "Highlight Title": "I-highlight ang Pamagat",
        "Highlight Links": "I-highlight ang Mga Link",
        "Readable Font": "Nababasang Font",
        "Color Adjustments": "Mga Pagsasaayos sa Kulay",
        "Invert Colors": "I-invert ang Mga Kulay",
        "Light Contrast": "Maliwanag na Contrast",
        "Dark Contrast": "Madilim na Contrast",
        "High Contrast": "Mataas na Contrast",
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
        "Reset settings": "सेटिंग्स रीसेट करें",
        "Reset All Settings": "सभी सेटिंग्स रीसेट करें",
        "Close": "बंद करें",
        "Content Adjustments": "सामग्री समायोजन",
        "Adjust Font Size": "फ़ॉन्ट आकार समायोजित करें",
        "Highlight Title": "शीर्षक हाइलाइट करें",
        "Highlight Links": "लिंक हाइलाइट करें",
        "Readable Font": "पठनीय फ़ॉन्ट",
        "Color Adjustments": "रंग समायोजन",
        "Invert Colors": "रंग उलटें",
        "Light Contrast": "हल्का कंट्रास्ट",
        "Dark Contrast": "गहरा कंट्रास्ट",
        "High Contrast": "उच्च कंट्रास्ट",
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
        "Reset settings": "Vrati postavke na zadano",
        "Reset All Settings": "Vrati sve postavke na zadano",
        "Close": "Zatvori",
        "Content Adjustments": "Prilagodbe sadržaja",
        "Adjust Font Size": "Prilagodi veličinu fonta",
        "Highlight Title": "Istakni naslove",
        "Highlight Links": "Istakni poveznice",
        "Readable Font": "Čitljiv font",
        "Color Adjustments": "Prilagodbe boja",
        "Invert Colors": "Invertiraj boje",
        "Light Contrast": "Svijetli kontrast",
        "Dark Contrast": "Tamni kontrast",
        "High Contrast": "Visoki kontrast",
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
        "Reset settings": "Beállítások visszaállítása",
        "Reset All Settings": "Összes beállítás visszaállítása",
        "Close": "Bezárás",
        "Content Adjustments": "Tartalmi beállítások",
        "Adjust Font Size": "Betűméret módosítása",
        "Highlight Title": "Címek kiemelése",
        "Highlight Links": "Hivatkozások kiemelése",
        "Readable Font": "Olvasható betűtípus",
        "Color Adjustments": "Színbeállítások",
        "Invert Colors": "Színek invertálása",
        "Light Contrast": "Világos kontraszt",
        "Dark Contrast": "Sötét kontraszt",
        "High Contrast": "Magas kontraszt",
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
        "Reset settings": "Atur ulang pengaturan",
        "Reset All Settings": "Atur Ulang Semua Pengaturan",
        "Close": "Tutup",
        "Content Adjustments": "Penyesuaian Konten",
        "Adjust Font Size": "Sesuaikan Ukuran Font",
        "Highlight Title": "Sorot Judul",
        "Highlight Links": "Sorot Tautan",
        "Readable Font": "Font Mudah Dibaca",
        "Color Adjustments": "Penyesuaian Warna",
        "Invert Colors": "Balikkan Warna",
        "Light Contrast": "Kontras Terang",
        "Dark Contrast": "Kontras Gelap",
        "High Contrast": "Kontras Tinggi",
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
        "Reset settings": "設定をリセット",
        "Reset All Settings": "すべての設定をリセット",
        "Close": "閉じる",
        "Content Adjustments": "コンテンツの調整",
        "Adjust Font Size": "文字サイズの調整",
        "Highlight Title": "タイトルを強調表示",
        "Highlight Links": "リンクを強調表示",
        "Readable Font": "読みやすいフォント",
        "Color Adjustments": "色の調整",
        "Invert Colors": "色を反転",
        "Light Contrast": "ライトコントラスト",
        "Dark Contrast": "ダークコントラスト",
        "High Contrast": "ハイコントラスト",
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
        "Reset settings": "ಸೆಟ್ಟಿಂಗ್‌ಗಳನ್ನು ಮರುಹೊಂದಿಸಿ",
        "Reset All Settings": "ಎಲ್ಲಾ ಸೆಟ್ಟಿಂಗ್‌ಗಳನ್ನು ಮರುಹೊಂದಿಸಿ",
        "Close": "ಮುಚ್ಚಿ",
        "Content Adjustments": "ವಿಷಯ ಹೊಂದಾಣಿಕೆಗಳು",
        "Adjust Font Size": "ಫಾಂಟ್ ಗಾತ್ರ ಹೊಂದಿಸಿ",
        "Highlight Title": "ಶೀರ್ಷಿಕೆ ಹೈಲೈಟ್ ಮಾಡಿ",
        "Highlight Links": "ಲಿಂಕ್‌ಗಳನ್ನು ಹೈಲೈಟ್ ಮಾಡಿ",
        "Readable Font": "ಓದಬಹುದಾದ ಫಾಂಟ್",
        "Color Adjustments": "ಬಣ್ಣ ಹೊಂದಾಣಿಕೆಗಳು",
        "Invert Colors": "ಬಣ್ಣಗಳನ್ನು ವಿಲೋಮಗೊಳಿಸಿ",
        "Light Contrast": "ತಿಳಿ ಕಾಂಟ್ರಾಸ್ಟ್",
        "Dark Contrast": "ಗಾಢ ಕಾಂಟ್ರಾಸ್ಟ್",
        "High Contrast": "ಅಧಿಕ ಕಾಂಟ್ರಾಸ್ಟ್",
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
        "Reset settings": "설정 초기화",
        "Reset All Settings": "모든 설정 초기화",
        "Close": "닫기",
        "Content Adjustments": "콘텐츠 조정",
        "Adjust Font Size": "글자 크기 조정",
        "Highlight Title": "제목 강조",
        "Highlight Links": "링크 강조",
        "Readable Font": "읽기 쉬운 글꼴",
        "Color Adjustments": "색상 조정",
        "Invert Colors": "색상 반전",
        "Light Contrast": "밝은 대비",
        "Dark Contrast": "어두운 대비",
        "High Contrast": "고대비",
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
        "Reset settings": "Mîhengan vegerîne",
        "Reset All Settings": "Hemû Mîhengan Vegerîne",
        "Close": "Bigire",
        "Content Adjustments": "Eyarên Naverokê",
        "Adjust Font Size": "Mezinahiya Fontê Eyar Bike",
        "Highlight Title": "Sernavan Diyar Bike",
        "Highlight Links": "Girêdanan Diyar Bike",
        "Readable Font": "Fonta Xwendinbar",
        "Color Adjustments": "Eyarên Rengan",
        "Invert Colors": "Rengan Berevajî Bike",
        "Light Contrast": "Kontrasta Ronî",
        "Dark Contrast": "Kontrasta Tarî",
        "High Contrast": "Kontrasta Bilind",
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
        "Reset settings": "Astellungen zerécksetzen",
        "Reset All Settings": "All Astellungen zerécksetzen",
        "Close": "Zoumaachen",
        "Content Adjustments": "Inhaltsupassungen",
        "Adjust Font Size": "Schrëftgréisst upassen",
        "Highlight Title": "Titel ervirhiewen",
        "Highlight Links": "Linken ervirhiewen",
        "Readable Font": "Liesbar Schrëft",
        "Color Adjustments": "Faarfupassungen",
        "Invert Colors": "Faarwen invertéieren",
        "Light Contrast": "Helle Kontrast",
        "Dark Contrast": "Donkele Kontrast",
        "High Contrast": "Héije Kontrast",
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
        "Reset settings": "ക്രമീകരണങ്ങൾ പുനഃസജ്ജമാക്കുക",
        "Reset All Settings": "എല്ലാ ക്രമീകരണങ്ങളും പുനഃസജ്ജമാക്കുക",
        "Close": "അടയ്ക്കുക",
        "Content Adjustments": "ഉള്ളടക്ക ക്രമീകരണങ്ങൾ",
        "Adjust Font Size": "ഫോണ്ട് വലുപ്പം ക്രമീകരിക്കുക",
        "Highlight Title": "തലക്കെട്ടുകൾ ഹൈലൈറ്റ് ചെയ്യുക",
        "Highlight Links": "ലിങ്കുകൾ ഹൈലൈറ്റ് ചെയ്യുക",
        "Readable Font": "വായനായോഗ്യ ഫോണ്ട്",
        "Color Adjustments": "നിറ ക്രമീകരണങ്ങൾ",
        "Invert Colors": "നിറങ്ങൾ വിപരീതമാക്കുക",
        "Light Contrast": "ഇളം കോൺട്രാസ്റ്റ്",
        "Dark Contrast": "ഇരുണ്ട കോൺട്രാസ്റ്റ്",
        "High Contrast": "ഉയർന്ന കോൺട്രാസ്റ്റ്",
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
        "Reset settings": "Тохиргоог сэргээх",
        "Reset All Settings": "Бүх тохиргоог сэргээх",
        "Close": "Хаах",
        "Content Adjustments": "Агуулгын тохируулга",
        "Adjust Font Size": "Үсгийн хэмжээг тохируулах",
        "Highlight Title": "Гарчгийг тодруулах",
        "Highlight Links": "Холбоосыг тодруулах",
        "Readable Font": "Уншигдахуйц фонт",
        "Color Adjustments": "Өнгөний тохируулга",
        "Invert Colors": "Өнгийг урвуулах",
        "Light Contrast": "Цайвар контраст",
        "Dark Contrast": "Бараан контраст",
        "High Contrast": "Өндөр контраст",
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
        "Reset settings": "Tetapkan semula tetapan",
        "Reset All Settings": "Tetapkan Semula Semua Tetapan",
        "Close": "Tutup",
        "Content Adjustments": "Pelarasan Kandungan",
        "Adjust Font Size": "Laraskan Saiz Fon",
        "Highlight Title": "Serlahkan Tajuk",
        "Highlight Links": "Serlahkan Pautan",
        "Readable Font": "Fon Mudah Dibaca",
        "Color Adjustments": "Pelarasan Warna",
        "Invert Colors": "Songsangkan Warna",
        "Light Contrast": "Kontras Terang",
        "Dark Contrast": "Kontras Gelap",
        "High Contrast": "Kontras Tinggi",
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
        "Reset settings": "ဆက်တင်များ ပြန်လည်သတ်မှတ်ရန်",
        "Reset All Settings": "ဆက်တင်အားလုံး ပြန်လည်သတ်မှတ်ရန်",
        "Close": "ပိတ်ရန်",
        "Content Adjustments": "အကြောင်းအရာ ချိန်ညှိမှုများ",
        "Adjust Font Size": "ဖောင့်အရွယ်အစား ချိန်ညှိရန်",
        "Highlight Title": "ခေါင်းစဉ် မီးမောင်းထိုးရန်",
        "Highlight Links": "လင့်ခ်များ မီးမောင်းထိုးရန်",
        "Readable Font": "ဖတ်ရလွယ်သော ဖောင့်",
        "Color Adjustments": "အရောင် ချိန်ညှိမှုများ",
        "Invert Colors": "အရောင် ပြောင်းပြန်လုပ်ရန်",
        "Light Contrast": "ကွန်ထရက်စ်အလင်း",
        "Dark Contrast": "ကွန်ထရက်စ်အမှောင်",
        "High Contrast": "ကွန်ထရက်စ်မြင့်",
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
        "Reset settings": "Tilbakestill innstillinger",
        "Reset All Settings": "Tilbakestill alle innstillinger",
        "Close": "Lukk",
        "Content Adjustments": "Innholdsjusteringer",
        "Adjust Font Size": "Juster skriftstørrelse",
        "Highlight Title": "Uthev titler",
        "Highlight Links": "Uthev lenker",
        "Readable Font": "Lesbar skrift",
        "Color Adjustments": "Fargejusteringer",
        "Invert Colors": "Inverter farger",
        "Light Contrast": "Lys kontrast",
        "Dark Contrast": "Mørk kontrast",
        "High Contrast": "Høy kontrast",
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
        "Reset settings": "ਸੈਟਿੰਗਾਂ ਰੀਸੈੱਟ ਕਰੋ",
        "Reset All Settings": "ਸਾਰੀਆਂ ਸੈਟਿੰਗਾਂ ਰੀਸੈੱਟ ਕਰੋ",
        "Close": "ਬੰਦ ਕਰੋ",
        "Content Adjustments": "ਸਮੱਗਰੀ ਵਿਵਸਥਾਵਾਂ",
        "Adjust Font Size": "ਫੌਂਟ ਦਾ ਆਕਾਰ ਵਿਵਸਥਿਤ ਕਰੋ",
        "Highlight Title": "ਸਿਰਲੇਖ ਹਾਈਲਾਈਟ ਕਰੋ",
        "Highlight Links": "ਲਿੰਕ ਹਾਈਲਾਈਟ ਕਰੋ",
        "Readable Font": "ਪੜ੍ਹਨਯੋਗ ਫੌਂਟ",
        "Color Adjustments": "ਰੰਗ ਵਿਵਸਥਾਵਾਂ",
        "Invert Colors": "ਰੰਗ ਉਲਟਾਓ",
        "Light Contrast": "ਹਲਕਾ ਕੰਟਰਾਸਟ",
        "Dark Contrast": "ਗੂੜ੍ਹਾ ਕੰਟਰਾਸਟ",
        "High Contrast": "ਉੱਚ ਕੰਟਰਾਸਟ",
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
        "Reset settings": "සැකසුම් යළි සකසන්න",
        "Reset All Settings": "සියලු සැකසුම් යළි සකසන්න",
        "Close": "වසන්න",
        "Content Adjustments": "අන්තර්ගත ගැලපීම්",
        "Adjust Font Size": "අකුරු ප්‍රමාණය සකසන්න",
        "Highlight Title": "මාතෘකා ඉස්මතු කරන්න",
        "Highlight Links": "සබැඳි ඉස්මතු කරන්න",
        "Readable Font": "කියවීමට පහසු අකුරු",
        "Color Adjustments": "වර්ණ ගැලපීම්",
        "Invert Colors": "වර්ණ ප්‍රතිලෝම කරන්න",
        "Light Contrast": "ලා ප්‍රභේදනය",
        "Dark Contrast": "අඳුරු ප්‍රභේදනය",
        "High Contrast": "ඉහළ ප්‍රභේදනය",
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
        "Reset settings": "Obnoviť nastavenia",
        "Reset All Settings": "Obnoviť všetky nastavenia",
        "Close": "Zavrieť",
        "Content Adjustments": "Úpravy obsahu",
        "Adjust Font Size": "Upraviť veľkosť písma",
        "Highlight Title": "Zvýrazniť nadpisy",
        "Highlight Links": "Zvýrazniť odkazy",
        "Readable Font": "Čitateľné písmo",
        "Color Adjustments": "Úpravy farieb",
        "Invert Colors": "Invertovať farby",
        "Light Contrast": "Svetlý kontrast",
        "Dark Contrast": "Tmavý kontrast",
        "High Contrast": "Vysoký kontrast",
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
        "Reset settings": "Ресетуј подешавања",
        "Reset All Settings": "Ресетуј сва подешавања",
        "Close": "Затвори",
        "Content Adjustments": "Прилагођавање садржаја",
        "Adjust Font Size": "Прилагоди величину фонта",
        "Highlight Title": "Истакни наслове",
        "Highlight Links": "Истакни везе",
        "Readable Font": "Читљив фонт",
        "Color Adjustments": "Прилагођавање боја",
        "Invert Colors": "Инвертуј боје",
        "Light Contrast": "Светли контраст",
        "Dark Contrast": "Тамни контраст",
        "High Contrast": "Високи контраст",
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
        "Reset settings": "Weka upya mipangilio",
        "Reset All Settings": "Weka Upya Mipangilio Yote",
        "Close": "Funga",
        "Content Adjustments": "Marekebisho ya Maudhui",
        "Adjust Font Size": "Rekebisha Ukubwa wa Fonti",
        "Highlight Title": "Angazia Vichwa",
        "Highlight Links": "Angazia Viungo",
        "Readable Font": "Fonti Inayosomeka",
        "Color Adjustments": "Marekebisho ya Rangi",
        "Invert Colors": "Geuza Rangi Kinyume",
        "Light Contrast": "Utofautishaji Angavu",
        "Dark Contrast": "Utofautishaji wa Giza",
        "High Contrast": "Utofautishaji wa Juu",
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
        "Reset settings": "அமைப்புகளை மீட்டமை",
        "Reset All Settings": "எல்லா அமைப்புகளையும் மீட்டமை",
        "Close": "மூடு",
        "Content Adjustments": "உள்ளடக்கச் சீரமைப்புகள்",
        "Adjust Font Size": "எழுத்துரு அளவைச் சரிசெய்",
        "Highlight Title": "தலைப்பை முன்னிலைப்படுத்து",
        "Highlight Links": "இணைப்புகளை முன்னிலைப்படுத்து",
        "Readable Font": "படிக்க எளிதான எழுத்துரு",
        "Color Adjustments": "வண்ணச் சீரமைப்புகள்",
        "Invert Colors": "வண்ணங்களை நேர்மாறாக்கு",
        "Light Contrast": "வெளிர் மாறுபாடு",
        "Dark Contrast": "இருண்ட மாறுபாடு",
        "High Contrast": "அதிக மாறுபாடு",
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
        "Reset settings": "సెట్టింగ్‌లను రీసెట్ చేయండి",
        "Reset All Settings": "అన్ని సెట్టింగ్‌లను రీసెట్ చేయండి",
        "Close": "మూసివేయండి",
        "Content Adjustments": "కంటెంట్ సర్దుబాట్లు",
        "Adjust Font Size": "ఫాంట్ పరిమాణాన్ని సర్దుబాటు చేయండి",
        "Highlight Title": "శీర్షికలను హైలైట్ చేయండి",
        "Highlight Links": "లింక్‌లను హైలైట్ చేయండి",
        "Readable Font": "చదవగలిగే ఫాంట్",
        "Color Adjustments": "రంగు సర్దుబాట్లు",
        "Invert Colors": "రంగులను విలోమం చేయండి",
        "Light Contrast": "లేత కాంట్రాస్ట్",
        "Dark Contrast": "ముదురు కాంట్రాస్ట్",
        "High Contrast": "అధిక కాంట్రాస్ట్",
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
        "Reset settings": "รีเซ็ตการตั้งค่า",
        "Reset All Settings": "รีเซ็ตการตั้งค่าทั้งหมด",
        "Close": "ปิด",
        "Content Adjustments": "การปรับเนื้อหา",
        "Adjust Font Size": "ปรับขนาดตัวอักษร",
        "Highlight Title": "เน้นหัวข้อ",
        "Highlight Links": "เน้นลิงก์",
        "Readable Font": "ฟอนต์อ่านง่าย",
        "Color Adjustments": "การปรับสี",
        "Invert Colors": "กลับสี",
        "Light Contrast": "ความคมชัดสว่าง",
        "Dark Contrast": "ความคมชัดมืด",
        "High Contrast": "ความคมชัดสูง",
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
        "Reset settings": "Ayarları sıfırla",
        "Reset All Settings": "Tüm Ayarları Sıfırla",
        "Close": "Kapat",
        "Content Adjustments": "İçerik Ayarları",
        "Adjust Font Size": "Yazı Boyutunu Ayarla",
        "Highlight Title": "Başlıkları Vurgula",
        "Highlight Links": "Bağlantıları Vurgula",
        "Readable Font": "Okunabilir Yazı Tipi",
        "Color Adjustments": "Renk Ayarları",
        "Invert Colors": "Renkleri Ters Çevir",
        "Light Contrast": "Açık Kontrast",
        "Dark Contrast": "Koyu Kontrast",
        "High Contrast": "Yüksek Kontrast",
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
        "Reset settings": "ترتیبات بحال کریں",
        "Reset All Settings": "تمام ترتیبات بحال کریں",
        "Close": "بند کریں",
        "Content Adjustments": "مواد کی تبدیلیاں",
        "Adjust Font Size": "فونٹ سائز تبدیل کریں",
        "Highlight Title": "عنوان نمایاں کریں",
        "Highlight Links": "روابط نمایاں کریں",
        "Readable Font": "پڑھنے میں آسان فونٹ",
        "Color Adjustments": "رنگوں کی تبدیلیاں",
        "Invert Colors": "رنگ الٹ دیں",
        "Light Contrast": "روشن کنٹراسٹ",
        "Dark Contrast": "گہرا کنٹراسٹ",
        "High Contrast": "زیادہ کنٹراسٹ",
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
        "Reset settings": "Đặt lại cài đặt",
        "Reset All Settings": "Đặt lại tất cả các cài đặt",
        "Close": "Đóng",
        "Content Adjustments": "Điều chỉnh nội dung",
        "Adjust Font Size": "Điều chỉnh cỡ chữ",
        "Highlight Title": "Làm nổi bật tiêu đề",
        "Highlight Links": "Làm nổi bật liên kết",
        "Readable Font": "Phông chữ dễ đọc",
        "Color Adjustments": "Điều chỉnh màu sắc",
        "Invert Colors": "Đảo ngược màu",
        "Light Contrast": "Tương phản sáng",
        "Dark Contrast": "Tương phản tối",
        "High Contrast": "Tương phản cao",
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
        "Reset settings": "重置设置",
        "Reset All Settings": "重置所有设置",
        "Close": "关闭",
        "Content Adjustments": "内容调整",
        "Adjust Font Size": "调整字号",
        "Highlight Title": "高亮标题",
        "Highlight Links": "高亮链接",
        "Readable Font": "易读字体",
        "Color Adjustments": "颜色调整",
        "Invert Colors": "反转颜色",
        "Light Contrast": "浅色对比度",
        "Dark Contrast": "深色对比度",
        "High Contrast": "高对比度",
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
        "Reset settings": "重設設定",
        "Reset All Settings": "重設所有設定",
        "Close": "關閉",
        "Content Adjustments": "內容調整",
        "Adjust Font Size": "調整文字大小",
        "Highlight Title": "突顯標題",
        "Highlight Links": "突顯連結",
        "Readable Font": "易讀字型",
        "Color Adjustments": "色彩調整",
        "Invert Colors": "反轉色彩",
        "Light Contrast": "淺色對比",
        "Dark Contrast": "深色對比",
        "High Contrast": "高對比",
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
  
      const attributes = ['lang', 'position', 'offset', 'size', 'icon', 'nonce', 'hide-button'];
  
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
          case 'nonce': {
            const nonce = String(value).trim();
            if (nonce) options.nonce = nonce;
            break;
          }
          case 'hide-button': {
            options.hideButton = String(value).trim().toLowerCase() !== 'false';
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
      document.querySelectorAll('script[data-acc-lang],script[data-acc-position],script[data-acc-offset],script[data-acc-size],script[data-acc-icon],script[data-acc-nonce],script[data-acc-hide-button]').forEach(script => {
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

var menuCSS = "/* Base styles */\n.acc-menu {\n  position: fixed;\n  left: var(--acc-menu-inline-gap, 12px);\n  top: var(--acc-menu-block-gap, 12px);\n  bottom: var(--acc-menu-block-gap, 12px);\n  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);\n  opacity: 1;\n  transition: 0.3s;\n  z-index: var(--acc-widget-z-index, 100000);\n  overflow: hidden;\n  /* The primary color shows through the content margins, framing the body\n     like a gate: header across the top, posts down both sides. */\n  background: var(--acc-primary-color);\n  width: min(516px, calc(100vw - (var(--acc-menu-inline-gap, 12px) * 2)));\n  display: flex;\n  flex-direction: column;\n  line-height: 1.5;\n  font-size: 16px;\n  height: auto;\n  letter-spacing: 0.015em;\n  color: var(--acc-text-color);\n  --acc-content-inline-padding: 14px;\n  --acc-menu-inline-gap: clamp(16px, 2.5vw, 28px);\n  --acc-menu-block-gap: var(--acc-menu-inline-gap);\n  border-radius: 16px;\n  box-shadow: 0 18px 42px rgba(0, 0, 0, 0.2);\n}\n\n/* The dialog receives programmatic focus on open (tabindex=\"-1\", never\n   Tab-reachable); a focus ring around the whole panel would be noise. */\n.acc-menu:focus {\n  outline: none;\n}\n\n/* Ensure all elements inherit proper colors for accessibility */\n.acc-menu * {\n  color: var(--acc-text-color);\n  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;\n  padding: 0;\n  margin: 0;\n  line-height: 1.5 !important;\n  letter-spacing: normal !important;\n}\n\n/* Header section */\n.acc-menu-header {\n  flex-shrink: 0;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 0 var(--acc-content-inline-padding);\n  height: var(--acc-header-height);\n  font-weight: 700 !important;\n  background-color: var(--acc-primary-color) !important;\n}\n\n.acc-menu-title {\n  display: flex;\n  align-items: center;\n  min-width: 0;\n  font-size: 17px !important;\n  color: var(--acc-text-color-inverted) !important;\n  font-weight: 700;\n}\n\n.acc-menu-title .acc-label {\n  color: var(--acc-text-color-inverted) !important;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.acc-menu-close {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 36px;\n  height: 36px;\n  padding: 0;\n  border: none;\n  border-radius: 50%;\n  background: transparent;\n  cursor: pointer;\n  transition: background-color 0.2s ease;\n}\n\n.acc-menu-close:hover {\n  background-color: rgba(255, 255, 255, 0.18);\n}\n\n.acc-menu-close:focus {\n  outline: 2px solid var(--acc-text-color-inverted);\n  outline-offset: 1px;\n}\n\n.acc-menu-header .acc-menu-close svg {\n  fill: var(--acc-text-color-inverted) !important;\n  width: 20px !important;\n  height: 20px !important;\n  min-width: 20px !important;\n  min-height: 20px !important;\n  max-width: 20px !important;\n  max-height: 20px !important;\n}\n\n.acc-header-back {\n  display: flex;\n  align-items: center;\n}\n\n.acc-back-btn {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  background: transparent;\n  border: none;\n  padding: 8px;\n  cursor: pointer;\n  font-size: 16px;\n  font-weight: 600;\n  color: var(--acc-text-color-inverted) !important;\n  transition: background-color 0.2s ease;\n  border-radius: 4px;\n  visibility: hidden;\n}\n\n.acc-back-btn > span {\n  color: var(--acc-text-color-inverted) !important;\n}\n\n.acc-back-btn.visible {\n  visibility: visible;\n}\n\n.acc-back-btn:hover {\n  background-color: rgba(255, 255, 255, 0.18);\n}\n\n.acc-back-btn:focus {\n  outline: 2px solid var(--acc-text-color-inverted);\n  outline-offset: 1px;\n}\n\n.acc-back-btn svg {\n  fill: var(--acc-text-color-inverted) !important;\n  width: 24px !important;\n  height: 24px !important;\n}\n\n.acc-menu-header svg {\n  fill: var(--acc-text-color-inverted) !important;\n  width: 28px !important;\n  height: 28px !important;\n  min-width: 28px !important;\n  min-height: 28px !important;\n  max-width: 28px !important;\n  max-height: 28px !important;\n}\n\n.acc-menu-header > div {\n  display: flex;\n  align-items: center;\n}\n\n/* Interactive elements */\n.acc-menu-header div[role=\"button\"] {\n  cursor: pointer;\n  padding: 8px;\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 36px;\n  height: 36px;\n  transition: background-color 0.2s ease;\n}\n\n.acc-menu-header div[role=\"button\"]:hover {\n  background-color: rgba(255, 255, 255, 0.18);\n}\n\n.acc-menu-header div[role=\"button\"]:focus {\n  outline: 2px solid var(--acc-text-color-inverted);\n  outline-offset: 1px;\n}\n\n.acc-menu-header .acc-header-actions {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  flex-shrink: 0;\n}\n\n.acc-language-container {\n  margin: 0 var(--acc-content-inline-padding) 24px;\n}\n\n.acc-lang-details {\n  border: 1px solid rgba(0, 0, 0, 0.1);\n  border-radius: var(--acc-button-border-radius);\n  background: var(--acc-card-bg);\n}\n\n.acc-lang-summary {\n  list-style: none;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 12px;\n  padding: 12px 14px;\n  cursor: pointer;\n  border-radius: var(--acc-button-border-radius);\n}\n\n.acc-lang-summary::-webkit-details-marker {\n  display: none;\n}\n\n.acc-lang-summary::marker {\n  content: '';\n}\n\n.acc-lang-summary-main {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  min-width: 0;\n}\n\n.acc-lang-current-label {\n  font-size: 16px !important;\n  font-weight: 600 !important;\n}\n\n.acc-lang-summary:hover {\n  background-color: rgba(25, 118, 210, 0.06);\n}\n\n.acc-lang-summary:focus {\n  outline: var(--acc-focus-outline-width) solid var(--acc-focus-ring-color);\n  outline-offset: var(--acc-focus-outline-offset);\n}\n\n.acc-lang-summary-arrow {\n  width: 10px;\n  height: 10px;\n  border-right: 2px solid var(--acc-text-color);\n  border-bottom: 2px solid var(--acc-text-color);\n  transform: rotate(-45deg);\n  transition: transform 0.2s ease;\n}\n\n.acc-lang-details[open] .acc-lang-summary-arrow {\n  transform: rotate(45deg);\n}\n\n.acc-lang-details[open] .acc-lang-summary {\n  border-bottom: 1px solid var(--acc-border-color);\n  border-bottom-left-radius: 0;\n  border-bottom-right-radius: 0;\n}\n\n.acc-lang-details-panel {\n  padding: 12px 0 8px;\n}\n\n.acc-lang-details-panel .acc-section-title {\n  font-size: 16px !important;\n  padding: 0 16px 10px;\n}\n\n.acc-lang-flag {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  min-width: 22px;\n  font-size: 18px !important;\n  line-height: 1;\n}\n\n.acc-lang-search-wrapper {\n  padding: 0 16px 8px;\n}\n\n.acc-lang-search {\n  width: 100%;\n  padding: 10px 16px;\n  border: 1.5px solid var(--acc-border-color);\n  border-radius: var(--acc-button-border-radius);\n  font-size: 16px;\n  background-color: var(--acc-card-bg);\n  transition: border-color 0.2s ease;\n}\n\n.acc-lang-search:focus {\n  outline: var(--acc-focus-outline-width) solid var(--acc-focus-ring-color);\n  outline-offset: var(--acc-focus-outline-offset);\n  border-color: var(--acc-primary-color) !important;\n}\n\n.acc-lang-list {\n  padding: 6px 8px 12px;\n  max-height: 280px;\n  overflow-y: auto;\n}\n\n.acc-lang-item {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 8px;\n  width: 100%;\n  text-align: left;\n  padding: 11px 10px;\n  margin-bottom: 4px;\n  background-color: transparent;\n  border: none;\n  border-radius: var(--acc-button-border-radius);\n  cursor: pointer;\n  font-size: 16px;\n  color: var(--acc-text-color);\n  transition: background-color 0.12s ease;\n}\n\n.acc-lang-item:hover {\n  background-color: rgba(25, 118, 210, 0.06);\n}\n\n.acc-lang-item:focus {\n  outline: var(--acc-focus-outline-width) solid var(--acc-focus-ring-color);\n  outline-offset: var(--acc-focus-outline-offset);\n}\n\n.acc-lang-item.selected {\n  background-color: rgba(25, 118, 210, 0.08);\n  font-weight: 600;\n}\n\n.acc-lang-item-main {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  min-width: 0;\n}\n\n.acc-lang-item-label {\n  font-size: 16px !important;\n  line-height: 1.4 !important;\n}\n\n.acc-icon-check {\n  display: inline-block;\n  width: 18px;\n  height: 18px;\n  background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='%23886f60' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12'%3E%3C/polyline%3E%3C/svg%3E\");\n  background-repeat: no-repeat;\n  background-position: center;\n  opacity: 0;\n  transition: opacity 0.15s ease;\n}\n\n.acc-lang-item.selected .acc-icon-check {\n  opacity: 1;\n}\n\n.acc-menu .acc-lang-select {\n  width: 100% !important;\n  padding: 0 16px !important;\n  font-size: 16px !important;\n  font-family: inherit !important;\n  font-weight: 600 !important;\n  border-radius: var(--acc-button-border-radius) !important;\n  background: var(--acc-card-bg) !important;\n  border: 1.5px solid var(--acc-border-color) !important;\n  min-height: 48px !important;\n  max-height: 48px !important;\n  height: 48px !important;\n  color: var(--acc-text-color) !important;\n  -webkit-appearance: none !important;\n  -moz-appearance: none !important;\n  appearance: none !important;\n  background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0%20-960%20960%20960' width='24px' fill='%231f1f1f'%3E%3Cpath d='M480-344%20240-584l56-56%20184 184%20184-184%2056 56-240 240Z'/%3E%3C/svg%3E\") !important;\n  background-repeat: no-repeat !important;\n  background-position: right 12px center !important;\n  background-size: 20px !important;\n  padding-right: 44px !important;\n}\n\n/* Hide default arrows in Firefox and IE */\n.acc-menu .acc-lang-select::-ms-expand {\n  display: none !important;\n}\n\n.acc-menu .acc-lang-select:focus {\n  outline: var(--acc-focus-outline-width) solid var(--acc-focus-ring-color);\n  outline-offset: var(--acc-focus-outline-offset);\n  border-color: var(--acc-primary-color) !important;\n}\n\n/* Option grid layout */\n.acc-options-all {\n  display: flex;\n  flex-direction: column;\n  gap: 16px;\n  padding: 0 var(--acc-content-inline-padding) 12px;\n}\n\n.acc-option-category {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n}\n\n.acc-option-category-interaction {\n  padding-bottom: 12px;\n}\n\n.acc-option-category .acc-section-title {\n  font-size: 14px !important;\n  font-weight: 700 !important;\n  letter-spacing: 0.01em !important;\n  text-transform: none;\n  color: #6b7280 !important;\n  padding: 0 2px;\n}\n\n.acc-options {\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  gap: 12px;\n  margin: 0;\n}\n\n.acc-options-text {\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n}\n\n.acc-options-text-inline {\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n}\n\n.acc-btn.acc-text-inline {\n  min-height: 54px;\n  aspect-ratio: auto;\n  flex-direction: row;\n  align-items: center;\n  justify-content: flex-start;\n  text-align: left;\n  gap: 10px;\n  padding: 12px 14px;\n}\n\n.acc-btn.acc-text-inline .acc-label {\n  font-size: 14px !important;\n  flex: 1 1 auto;\n  min-width: 0;\n}\n\n.acc-btn.acc-text-inline .acc-progress-indicator {\n  margin-top: 0;\n  margin-left: auto;\n  justify-content: flex-end;\n  min-width: 24px;\n}\n\n@media only screen and (max-width: 430px) {\n  .acc-options-text-inline {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n\n  .acc-btn.acc-text-inline {\n    min-height: auto;\n    aspect-ratio: 11 / 8;\n    flex-direction: column;\n    align-items: center;\n    justify-content: center;\n    text-align: center;\n    gap: 6px;\n    padding: 10px;\n  }\n\n  .acc-btn.acc-text-inline .acc-label {\n    font-size: 13px !important;\n    flex: 0 1 auto;\n  }\n\n  .acc-btn.acc-text-inline .acc-progress-indicator {\n    margin-top: 8px;\n    margin-left: 0;\n    justify-content: center;\n  }\n}\n\n.acc-tts-toggle-container {\n  margin: 0;\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n}\n\n.acc-text-scale-control {\n  width: 100%;\n  background: var(--acc-card-bg) !important;\n  border: 1px solid rgba(0, 0, 0, 0.1) !important;\n  border-radius: var(--acc-border-radius);\n  padding: 12px 14px;\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n}\n\n.acc-text-scale-meta {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n}\n\n.acc-text-scale-icon {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  flex-shrink: 0;\n}\n\n.acc-text-scale-icon svg {\n  width: 22px !important;\n  height: 22px !important;\n  min-width: 22px !important;\n  min-height: 22px !important;\n  max-width: 22px !important;\n  max-height: 22px !important;\n  fill: var(--acc-text-color);\n}\n\n.acc-text-scale-meta .acc-label {\n  font-size: 15px !important;\n  font-weight: 600 !important;\n}\n\n.acc-text-scale-percent {\n  margin-left: auto;\n  font-size: 15px !important;\n  font-weight: 700 !important;\n  color: var(--acc-primary-color) !important;\n}\n\n.acc-text-scale-range {\n  width: 100%;\n  appearance: none;\n  -webkit-appearance: none;\n  background: transparent;\n  height: 20px;\n  cursor: pointer;\n  margin: 0;\n}\n\n.acc-text-scale-range:focus {\n  outline: none;\n}\n\n.acc-text-scale-range::-webkit-slider-runnable-track {\n  width: 100%;\n  height: 4px;\n  border-radius: 999px;\n  background: linear-gradient(\n    to right,\n    var(--acc-primary-color) 0%,\n    var(--acc-primary-color) var(--acc-text-scale-progress, 0%),\n    #d8d8d8 var(--acc-text-scale-progress, 0%),\n    #d8d8d8 100%\n  );\n}\n\n.acc-text-scale-range::-webkit-slider-thumb {\n  appearance: none;\n  -webkit-appearance: none;\n  width: 18px;\n  height: 18px;\n  border-radius: 50%;\n  background: #fff;\n  border: 2px solid var(--acc-primary-color);\n  margin-top: -7px;\n  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);\n}\n\n.acc-text-scale-range::-moz-range-track {\n  width: 100%;\n  height: 4px;\n  border-radius: 999px;\n  background: #d8d8d8;\n}\n\n.acc-text-scale-range::-moz-range-progress {\n  height: 4px;\n  border-radius: 999px;\n  background: var(--acc-primary-color);\n}\n\n.acc-text-scale-range::-moz-range-thumb {\n  width: 18px;\n  height: 18px;\n  border-radius: 50%;\n  background: #fff;\n  border: 2px solid var(--acc-primary-color);\n  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);\n}\n\n.acc-btn.acc-tts-toggle {\n  width: 100%;\n  min-height: 54px;\n  aspect-ratio: auto;\n  flex-direction: row;\n  align-items: center;\n  justify-content: flex-start;\n  gap: 10px;\n  text-align: left;\n  padding: 12px 76px 12px 14px;\n}\n\n.acc-btn.acc-tts-toggle .acc-label {\n  font-size: 15px !important;\n}\n\n.acc-btn.acc-tts-toggle svg {\n  width: 22px !important;\n  height: 22px !important;\n  min-width: 22px !important;\n  min-height: 22px !important;\n  max-width: 22px !important;\n  max-height: 22px !important;\n}\n\n.acc-btn.acc-tts-toggle::before {\n  content: \"\";\n  position: absolute;\n  right: 14px;\n  top: 50%;\n  width: 44px;\n  height: 24px;\n  border-radius: 999px;\n  transform: translateY(-50%);\n  background: #dbd7d2;\n  border: 1px solid rgba(0, 0, 0, 0.08);\n}\n\n.acc-btn.acc-tts-toggle::after {\n  content: \"\";\n  position: absolute;\n  right: 38px;\n  top: 50%;\n  width: 18px;\n  height: 18px;\n  border-radius: 50%;\n  transform: translateY(-50%);\n  background: #fff;\n  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.18);\n}\n\n.acc-btn.acc-tts-toggle.acc-selected::before {\n  background: var(--acc-primary-color);\n  border-color: var(--acc-primary-color);\n}\n\n.acc-btn.acc-tts-toggle.acc-selected::after {\n  right: 16px;\n}\n\n/* Button styling */\n.acc-btn {\n  aspect-ratio: 11 / 8;\n  border-radius: var(--acc-border-radius);\n  padding: 10px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-direction: column;\n  text-align: center;\n  font-size: 15px !important;\n  background: var(--acc-card-bg) !important;\n  border: 1px solid rgba(0, 0, 0, 0.1) !important;\n  transition: background-color 0.2s ease;\n  cursor: pointer;\n  word-break: break-word;\n  gap: 6px;\n  position: relative;\n}\n\n.acc-btn:hover {\n  border-color: var(--acc-hover-color) !important;\n  border-width: 1px !important;\n  box-shadow: inset 0 0 0 1px var(--acc-hover-color);\n}\n\n.acc-btn:focus {\n  outline: var(--acc-focus-outline-width) solid var(--acc-focus-ring-color);\n  outline-offset: var(--acc-focus-outline-offset);\n  border-color: var(--acc-primary-color) !important;\n}\n\n.acc-btn .acc-label, .acc-text-adjust .acc-label div {\n  font-size: 13px !important;\n  font-weight: 600 !important;\n}\n\n/* SVG icons */\n.acc-text-adjust svg {\n  width: 20px !important;\n  height: 20px !important;\n  min-width: 20px !important;\n  min-height: 20px !important;\n  max-width: 20px !important;\n  max-height: 20px !important;\n}\n\n.acc-btn svg {\n  width: 24px !important;\n  height: 24px !important;\n  min-width: 24px !important;\n  min-height: 24px !important;\n  max-width: 24px !important;\n  max-height: 24px !important;\n  fill: var(--acc-text-color);\n}\n\n/* Selected state */\n.acc-btn.acc-selected {\n  background-color: var(--acc-primary-color) !important;\n  border-color: var(--acc-primary-color) !important;\n}\n\n.acc-btn.acc-selected .acc-progress-dot {\n  background-color: rgba(255, 255, 255, 0.5);\n}\n\n.acc-btn.acc-selected .acc-progress-dot.active {\n  background-color: var(--acc-text-color-inverted) !important;\n}\n\n.acc-btn.acc-selected svg,\n.acc-btn.acc-selected span,\n.acc-btn.acc-selected .acc-label {\n  fill: var(--acc-text-color-inverted) !important;\n  color: var(--acc-text-color-inverted) !important;\n}\n\n.acc-btn.acc-tts-toggle.acc-selected {\n  background-color: var(--acc-card-bg) !important;\n  border-color: rgba(0, 0, 0, 0.1) !important;\n}\n\n.acc-btn.acc-tts-toggle.acc-selected svg,\n.acc-btn.acc-tts-toggle.acc-selected span,\n.acc-btn.acc-tts-toggle.acc-selected .acc-label {\n  fill: var(--acc-text-color) !important;\n  color: var(--acc-text-color) !important;\n}\n\n/* Footer section */\n.acc-footer {\n  flex-shrink: 0;\n  background: var(--acc-card-bg);\n  padding: 12px 16px;\n  display: flex;\n  flex-direction: column;\n  align-items: stretch;\n  gap: 10px;\n  border-top: 1px solid var(--acc-border-color);\n  overflow: visible;\n}\n\n.acc-footer-reset {\n  display: flex;\n  width: 100%;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n  padding: 12px 16px;\n  border: none;\n  border-radius: var(--acc-button-border-radius);\n  background-color: var(--acc-primary-color) !important;\n  cursor: pointer;\n  transition: background-color 0.2s ease;\n  white-space: nowrap;\n}\n\n.acc-footer-reset svg {\n  width: 24px !important;\n  height: 24px !important;\n  fill: var(--acc-text-color-inverted) !important;\n}\n\n.acc-footer-reset .acc-label {\n  font-size: 16px !important;\n  font-weight: 600 !important;\n  color: var(--acc-text-color-inverted) !important;\n  line-height: 1.2 !important;\n}\n\n.acc-footer-reset:hover {\n  background-color: var(--acc-primary-color-dark) !important;\n}\n\n.acc-footer-reset:focus {\n  outline: var(--acc-focus-outline-width) solid var(--acc-focus-ring-color);\n  outline-offset: var(--acc-focus-outline-offset);\n}\n\n.acc-footer-brand {\n  display: block;\n  text-align: center;\n  font-size: 12px !important;\n  line-height: 1.2 !important;\n  font-weight: 400 !important;\n  color: var(--acc-text-color) !important;\n  opacity: 0.65;\n  text-decoration: none;\n  padding: 2px 0;\n}\n\n.acc-footer-brand:hover {\n  opacity: 1;\n  text-decoration: underline;\n}\n\n.acc-footer-brand:focus {\n  opacity: 1;\n  outline: var(--acc-focus-outline-width) solid var(--acc-focus-ring-color);\n  outline-offset: var(--acc-focus-outline-offset);\n}\n\n.acc-header-lang-toggle {\n  display: inline-flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 8px;\n  padding: 7px 10px 7px 12px;\n  border: 1px solid rgba(255, 255, 255, 0.45);\n  border-radius: var(--acc-button-border-radius);\n  background: transparent;\n  cursor: pointer;\n  transition: border-color 0.2s ease, background-color 0.2s ease;\n}\n\n.acc-header-lang-toggle:hover {\n  background-color: rgba(255, 255, 255, 0.18);\n}\n\n.acc-header-lang-toggle:focus {\n  outline: 2px solid var(--acc-text-color-inverted);\n  outline-offset: 1px;\n}\n\n.acc-header-lang-current {\n  display: inline-block;\n  min-width: 2ch;\n  text-align: left;\n  font-size: 14px !important;\n  font-weight: 600 !important;\n  line-height: 1 !important;\n  color: var(--acc-text-color-inverted) !important;\n}\n\n.acc-header-lang-arrow {\n  width: 8px;\n  height: 8px;\n  border-right: 1.5px solid var(--acc-text-color-inverted);\n  border-bottom: 1.5px solid var(--acc-text-color-inverted);\n  transform: rotate(45deg) translateY(-1px);\n  transition: transform 0.2s ease;\n}\n\n.acc-header-lang-toggle[aria-expanded=\"true\"] .acc-header-lang-arrow {\n  transform: rotate(-135deg) translateY(-1px);\n}\n\n.acc-lang-modal {\n  position: absolute;\n  inset-inline-end: 12px;\n  top: calc(var(--acc-header-height) + 8px);\n  width: min(320px, calc(100% - 32px));\n  border: 1px solid var(--acc-border-color);\n  border-radius: 14px;\n  background: var(--acc-card-bg);\n  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.2);\n  z-index: 120;\n  padding: 10px 0 8px;\n}\n\n.acc-lang-modal[hidden] {\n  display: none;\n}\n\n.acc-lang-modal-header {\n  padding: 0 14px 8px;\n}\n\n.acc-lang-modal .acc-section-title {\n  font-size: 14px !important;\n  font-weight: 700 !important;\n  color: #6b7280 !important;\n}\n\n.acc-lang-modal .acc-lang-search-wrapper {\n  padding: 0 12px 8px;\n}\n\n.acc-lang-modal .acc-lang-list {\n  padding: 6px 8px 8px;\n  max-height: 240px;\n}\n\n/* Content area */\n.acc-menu-content {\n  flex: 1 1 auto;\n  min-height: 0;\n  overflow: auto;\n  padding: 28px 0 36px;\n  border-top-left-radius: 18px;\n  border-top-right-radius: 18px;\n  background: var(--acc-bg-color);\n}\n\n/* Text adjustments */\n.acc-text-adjust {\n  background: var(--acc-card-bg);\n  padding: 18px 20px;\n  margin-bottom: 20px;\n  border-radius: var(--acc-border-radius);\n  border: 1px solid rgba(0, 0, 0, 0.1);\n}\n\n.acc-text-adjust .acc-label {\n  display: flex;\n  justify-content: flex-start;\n}\n\n.acc-text-adjust > div {\n  display: flex;\n  justify-content: space-between;\n  margin-top: 20px;\n  align-items: center;\n  font-size: 16px;\n}\n\n.acc-text-adjust .acc-label div {\n  font-size: 16px !important;\n}\n\n.acc-text-adjust div[role=\"button\"] {\n  background: var(--acc-bg-color) !important;\n  border-radius: 50%;\n  width: 40px;\n  height: 40px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  border: 1px solid rgba(0, 0, 0, 0.1);\n  transition: border-color 0.2s ease;\n}\n\n.acc-text-adjust div[role=\"button\"]:hover {\n  border-color: var(--acc-primary-color);\n}\n\n.acc-text-adjust div[role=\"button\"]:focus {\n  outline: var(--acc-focus-outline-width) solid var(--acc-focus-ring-color);\n  outline-offset: var(--acc-focus-outline-offset);\n}\n\n/* Overlay */\n.acc-overlay {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  z-index: calc(var(--acc-widget-z-index, 100000) - 1);\n}\n\n/* Progress indicator */\n.acc-progress-indicator {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  gap: 4px;\n  margin-top: 8px;\n  height: 8px;\n}\n\n.acc-progress-dot {\n  width: 6px;\n  height: 6px;\n  border-radius: 50%;\n  background-color: var(--acc-border-color);\n  transition: background-color 0.2s ease;\n}\n\n.acc-progress-dot.active {\n  background-color: var(--acc-primary-color);\n}\n\n/* Selected state updates indicator colors */\n.acc-btn.acc-selected .acc-progress-dot.active {\n  background-color: var(--acc-bg-color);\n}\n\n/* Responsive adjustments */\n@media only screen and (max-width: 560px) {\n  .acc-menu {\n    width: calc(100vw - (var(--acc-menu-inline-gap, 8px) * 2));\n  }\n}\n\n@media only screen and (max-width: 420px) {\n  .acc-options {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n    gap: 12px;\n  }\n  .acc-btn {\n    padding: 8px;\n  }\n}\n\n/* Ensure proper focus visibility for assistive technology */\n@media (prefers-reduced-motion: reduce) {\n  .acc-menu,\n  .acc-btn,\n  .acc-lang-select,\n  .acc-progress-dot,\n  .acc-menu-header div[role=\"button\"],\n  .acc-lang-toggle,\n  .acc-back-btn,\n  .acc-menu-close,\n  .acc-footer-reset,\n  .acc-header-lang-toggle,\n  .acc-header-lang-arrow,\n  .acc-text-adjust div[role=\"button\"] {\n    transition: none;\n  }\n}\n";

var widgetCSS = "  /* Base styles for the widget */\n  .acc-widget, .acc-menu {\n    -webkit-user-select: none;\n    -moz-user-select: none;\n    -ms-user-select: none;\n    user-select: none;\n    font-weight: 400;\n    -webkit-font-smoothing: antialiased;\n  }\n  \n  .acc-widget *, .acc-menu * { \n    box-sizing: border-box !important; \n  }\n  \n  /* Accessibility toggle button */\n  .acc-toggle-btn {\n    position: fixed;\n    z-index: var(--acc-widget-z-index, 100000);\n    left: 30px;\n    bottom: 30px;\n    border-radius: 50%;\n    align-items: center;\n    justify-content: center;\n    width: var(--acc-button-size, 48px);\n    height: var(--acc-button-size, 48px);\n    display: flex;\n    cursor: pointer;\n    outline: none !important;\n    border: none !important;\n    box-shadow: inset 0 0 0 4px var(--acc-primary-color, #1976d2), inset 0 0 0 6px white, 0 2px 5px rgba(0,0,0,0.2) !important;\n    background: var(--acc-primary-color, #1976d2) !important;\n    transition: transform 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;\n    overflow: visible;\n  }\n  \n  .acc-toggle-btn .acc-toggle-icon {\n    width: 60%;\n    height: 60%;\n    display: inline-flex;\n    align-items: center;\n    justify-content: center;\n  }\n\n  .acc-toggle-btn .acc-toggle-icon svg {\n    width: 100%;\n    height: 100%;\n    fill: white;\n    transition: none;\n  }\n  \n  .acc-toggle-btn:hover {\n    transform: scale(1.12);\n  }\n\n  /* The menu panel replaces the button while open; closeMenu() restores\n     aria-expanded before moving focus back here, so the button is visible\n     and focusable again by the time it receives focus. */\n  .acc-toggle-btn[aria-expanded=\"true\"] {\n    opacity: 0;\n    visibility: hidden;\n    pointer-events: none;\n  }\n\n  .acc-violation-bubble {\n    position: absolute;\n    top: -8px;\n    right: -8px;\n    min-width: 24px;\n    height: 24px;\n    border-radius: 12px;\n    font-size: 11px;\n    font-weight: 700;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    padding: 0 4px;\n    pointer-events: none;\n    z-index: 1;\n    color: #fff;\n    border: none;\n    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);\n  }\n\n  .acc-violation-bubble[data-severity=\"critical\"] {\n    background: #d32f2f;\n    color: #fff;\n  }\n\n  .acc-violation-bubble[data-severity=\"serious\"] {\n    background: #f57c00;\n    color: #fff;\n  }\n\n  .acc-violation-bubble[data-severity=\"moderate\"] {\n    background: #fbc02d;\n    color: #333;\n  }\n\n  .acc-violation-bubble[hidden] {\n    display: none;\n  }\n\n  .acc-toggle-btn:focus {\n    outline: none !important;\n  }\n\n  .acc-toggle-btn:focus-visible {\n    outline: 3px solid var(--acc-primary-color, #1976d2) !important;\n    outline-offset: 2px;\n  }\n\n  @media (prefers-reduced-motion: reduce) {\n    .acc-toggle-btn {\n      transition: none;\n    }\n\n    .acc-toggle-btn .acc-toggle-icon svg {\n      transition: none;\n    }\n\n  }\n";

var reportCSS = ".acc-report-panel {\n  display: none;\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  z-index: calc(var(--acc-widget-z-index, 100000) + 10);\n  font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif;\n}\n.acc-report-panel.acc-report-visible {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.acc-report-overlay {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: rgba(0, 0, 0, 0.6);\n}\n.acc-report-dialog {\n  position: relative;\n  background: #fff;\n  border-radius: 12px;\n  width: 90%;\n  max-width: 800px;\n  max-height: 85vh;\n  display: flex;\n  flex-direction: column;\n  box-shadow: 0 20px 60px rgba(0,0,0,0.3);\n}\n.acc-report-header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 16px 20px;\n  border-bottom: 1px solid #e0e0e0;\n}\n.acc-report-title {\n  margin: 0;\n  font-size: 18px;\n  font-weight: 600;\n  color: #1a1a1a;\n}\n.acc-report-close {\n  background: none;\n  border: none;\n  padding: 8px;\n  cursor: pointer;\n  border-radius: 6px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.acc-report-close:hover {\n  background: #f0f0f0;\n}\n.acc-report-close svg {\n  width: 20px;\n  height: 20px;\n  fill: #666;\n}\n.acc-report-status {\n  padding: 8px 20px;\n  font-size: 14px;\n  color: #666;\n  background: #f8f9fa;\n}\n.acc-report-content {\n  flex: 1;\n  overflow-y: auto;\n  padding: 16px 20px;\n}\n.acc-report-loading {\n  text-align: center;\n  padding: 40px;\n  color: #666;\n}\n.acc-report-error {\n  color: #d32f2f;\n  padding: 20px;\n  text-align: center;\n}\n.acc-report-summary {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));\n  gap: 12px;\n  margin-bottom: 20px;\n}\n.acc-report-stat {\n  background: #f8f9fa;\n  border-radius: 8px;\n  padding: 16px;\n  text-align: center;\n}\n.acc-report-stat-value {\n  font-size: 28px;\n  font-weight: 700;\n  display: block;\n}\n.acc-report-stat-label {\n  font-size: 12px;\n  color: #666;\n  text-transform: uppercase;\n  margin-top: 4px;\n}\n.acc-report-stat.critical .acc-report-stat-value { color: #d32f2f; }\n.acc-report-stat.serious .acc-report-stat-value { color: #f57c00; }\n.acc-report-stat.moderate .acc-report-stat-value { color: #fbc02d; }\n.acc-report-stat.minor .acc-report-stat-value { color: #7cb342; }\n.acc-report-stat.passed .acc-report-stat-value { color: #43a047; }\n.acc-report-section {\n  margin-bottom: 20px;\n}\n.acc-report-section-title {\n  font-size: 14px;\n  font-weight: 600;\n  color: #333;\n  margin-bottom: 12px;\n  padding-bottom: 8px;\n  border-bottom: 2px solid #e0e0e0;\n}\n.acc-report-violation {\n  background: #fff;\n  border: 1px solid #e0e0e0;\n  border-radius: 8px;\n  margin-bottom: 12px;\n  overflow: hidden;\n}\n.acc-report-violation-header {\n  padding: 12px 16px;\n  background: #f8f9fa;\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  gap: 12px;\n}\n.acc-report-violation-header:hover {\n  background: #f0f0f0;\n}\n.acc-report-violation-impact {\n  font-size: 11px;\n  font-weight: 600;\n  text-transform: uppercase;\n  padding: 4px 8px;\n  border-radius: 4px;\n  color: #fff;\n}\n.acc-report-violation-impact.critical { background: #d32f2f; }\n.acc-report-violation-impact.serious { background: #f57c00; }\n.acc-report-violation-impact.moderate { background: #fbc02d; color: #333; }\n.acc-report-violation-impact.minor { background: #7cb342; }\n.acc-report-violation-title {\n  flex: 1;\n  font-weight: 500;\n  color: #333;\n}\n.acc-report-violation-count {\n  font-size: 12px;\n  color: #666;\n  background: #e0e0e0;\n  padding: 2px 8px;\n  border-radius: 12px;\n}\n.acc-report-violation-details {\n  display: none;\n  padding: 16px;\n  border-top: 1px solid #e0e0e0;\n}\n.acc-report-violation.expanded .acc-report-violation-details {\n  display: block;\n}\n.acc-report-violation-desc {\n  color: #666;\n  font-size: 14px;\n  margin-bottom: 12px;\n}\n.acc-report-violation-help {\n  font-size: 13px;\n  margin-bottom: 12px;\n}\n.acc-report-violation-help a {\n  color: #1976d2;\n}\n.acc-report-node {\n  background: #f8f9fa;\n  border-radius: 6px;\n  padding: 12px;\n  margin-top: 8px;\n}\n.acc-report-node-html {\n  font-family: monospace;\n  font-size: 12px;\n  background: #263238;\n  color: #80cbc4;\n  padding: 8px 12px;\n  border-radius: 4px;\n  overflow-x: auto;\n  white-space: pre-wrap;\n  word-break: break-all;\n}\n.acc-report-node-fix {\n  margin-top: 8px;\n  font-size: 13px;\n  color: #333;\n}\n.acc-report-node-fix strong {\n  color: #1976d2;\n}\n.acc-report-success {\n  text-align: center;\n  padding: 40px;\n}\n.acc-report-success-icon {\n  width: 64px;\n  height: 64px;\n  background: #43a047;\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  margin: 0 auto 16px;\n}\n.acc-report-success-icon svg {\n  width: 32px;\n  height: 32px;\n  fill: #fff;\n}\n.acc-report-footer {\n  padding: 12px 20px;\n  border-top: 1px solid #e0e0e0;\n  text-align: center;\n}\n.acc-report-powered {\n  font-size: 12px;\n}\n@media (max-width: 600px) {\n  .acc-report-dialog {\n    width: 95%;\n    max-height: 90vh;\n  }\n  .acc-report-summary {\n    grid-template-columns: repeat(2, 1fr);\n  }\n}\n";

var readingGuideCSS = ".acc-rg {\n  position: fixed;\n  left: 0;\n  right: 0;\n  width: 100%;\n  pointer-events: none;\n  background-color: rgba(0, 0, 0, 0.4);\n  z-index: calc(var(--acc-widget-z-index, 100000) + 1);\n}\n.acc-rg-top {\n  top: 0;\n}\n.acc-rg-bottom {\n  bottom: 0;\n}\n/* Softer overlay when high contrast is active */\nbody.acc-high-contrast-mode .acc-rg {\n  background-color: rgba(0, 0, 0, 0.25);\n}\n";

var skipLinkCSS = ".acc-skip-link {\n  font-family: inherit;\n  position: fixed;\n  top: 16px;\n  left: 16px;\n  background: var(--acc-card-bg, #ffffff);\n  color: var(--acc-text-color, #222222);\n  border: 3px solid var(--acc-primary-color, #1976d2);\n  border-radius: var(--acc-button-border-radius, 0.4rem);\n  padding: 8px 16px;\n  z-index: calc(var(--acc-widget-z-index, 100000) + 2);\n  transform: translateY(-140%);\n  opacity: 0;\n  pointer-events: none;\n  transition: transform 0.2s ease, opacity 0.2s ease;\n  font-size: 16px;\n  line-height: 1.2;\n  font-weight: 600;\n  background-clip: padding-box;\n}\n.acc-skip-link:focus,\n.acc-skip-link:active {\n  transform: translateY(0);\n  opacity: 1;\n  pointer-events: auto;\n  outline: var(--acc-focus-outline-width, 3px) solid var(--acc-focus-ring-color, #1976d2);\n  outline-offset: var(--acc-focus-outline-offset, 2px);\n}\n";

var annotationsCSS = ".acc-annotation-layer {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 0;\n  height: 0;\n  z-index: calc(var(--acc-widget-z-index, 100000) + 5);\n  pointer-events: none;\n}\n\n.acc-annotation-marker {\n  position: absolute;\n  width: 20px;\n  height: 20px;\n  border: none;\n  border-radius: 999px;\n  color: #fff;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35);\n  cursor: pointer;\n  pointer-events: auto;\n  transform: translate(-40%, -50%);\n}\n\n.acc-annotation-marker svg {\n  width: 12px;\n  height: 12px;\n  fill: currentColor;\n}\n\n.acc-annotation-marker[data-impact=\"critical\"] {\n  background: #b71c1c;\n}\n\n.acc-annotation-marker[data-impact=\"serious\"] {\n  background: #d84315;\n}\n\n.acc-annotation-marker[data-impact=\"moderate\"] {\n  background: #ef6c00;\n}\n\n.acc-annotation-marker[data-impact=\"minor\"] {\n  background: #1565c0;\n}\n\n.acc-annotation-popup {\n  position: absolute;\n  width: min(320px, 92vw);\n  background: #fff;\n  color: #1a1a1a;\n  border: 1px solid #d7d7d7;\n  border-radius: 10px;\n  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.24);\n  padding: 12px;\n  pointer-events: auto;\n}\n\n.acc-annotation-popup-header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 10px;\n}\n\n.acc-annotation-popup-title {\n  margin: 0;\n  font-size: 14px;\n  line-height: 1.3;\n}\n\n.acc-annotation-popup-close {\n  border: 0;\n  background: transparent;\n  padding: 2px;\n  width: 24px;\n  height: 24px;\n  color: #444;\n  cursor: pointer;\n}\n\n.acc-annotation-popup-close svg {\n  width: 20px;\n  height: 20px;\n  fill: currentColor;\n}\n\n.acc-annotation-popup p {\n  margin: 8px 0;\n  font-size: 13px;\n  line-height: 1.45;\n}\n\n.acc-annotation-popup a {\n  color: #0d47a1;\n  font-weight: 600;\n  text-decoration: underline;\n}\n";

var extrasCSS = "/* TTS click-to-read — these target light-DOM page content, so they must\n   live in <head>, not the widget shadow root */\nbody.acc-tts-click-mode :is(h1, h2, h3, h4, h5, h6, p, li, dt, dd, blockquote, figcaption, caption, th, td, div, section):not(.acc-container *):hover {\n  cursor: pointer;\n}\n\n.acc-tts-active-block {\n  outline: 2px solid var(--acc-primary-color, #1976d2) !important;\n  outline-offset: 3px !important;\n  border-radius: 4px;\n}\n\n/* Text magnifier — fixed banner showing enlarged copy of hovered text */\n.acc-text-magnifier {\n  position: fixed;\n  left: 50%;\n  bottom: 24px;\n  transform: translateX(-50%);\n  max-width: min(90vw, 880px);\n  background: #111827;\n  color: #ffffff;\n  font-family: system-ui, -apple-system, \"Segoe UI\", Roboto, Arial, sans-serif;\n  font-size: 28px;\n  line-height: 1.45;\n  padding: 14px 22px;\n  border-radius: 10px;\n  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);\n  z-index: 2147483646;\n  pointer-events: none;\n  display: none;\n}\n\n.acc-text-magnifier.acc-visible {\n  display: block;\n}\n\n/* Page structure navigator — list styling inside the shared report dialog */\n.acc-structure-list {\n  list-style: none;\n  margin: 0 0 16px;\n  padding: 0;\n}\n\n.acc-structure-list li {\n  margin: 0;\n  padding: 0;\n}\n\n.acc-structure-item {\n  display: block;\n  width: 100%;\n  text-align: start;\n  background: transparent;\n  border: none;\n  border-radius: 6px;\n  padding: 8px 12px;\n  font-size: 14px;\n  line-height: 1.4;\n  color: var(--acc-text-color, #1f2937);\n  cursor: pointer;\n}\n\n.acc-structure-item:hover {\n  background: var(--acc-hover-color, #f3f4f6);\n}\n\n.acc-structure-item:focus-visible {\n  outline: 2px solid var(--acc-focus-ring-color, #1976d2);\n  outline-offset: -2px;\n}\n\n.acc-structure-empty {\n  color: #6b7280;\n  font-size: 14px;\n  margin: 0 0 16px;\n  padding: 0 12px;\n}\n";

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
          this.ensureTextScaleObserver();
          const elements = document.querySelectorAll(this.textScaleSelectors);
          elements.forEach(el => this.applyScaleToElement(el, resolvedMultiply));
          this.collectDirectTextParents(document.body).forEach(el => this.applyScaleToElement(el, resolvedMultiply));
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
      const clampedPercent = this.getTextScalePercent(percent);
      const multiplier = Number((clampedPercent / 100).toFixed(2));

      this.scaleText(multiplier);

      if (shouldPersist) {
        this.updateState({ 'text-scale': multiplier });
      }

      return multiplier;
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
        ':not([data-icon])'
      ].join('');
      const config = {
        id: "bold-text",
        selector: "body",
        childrenSelector: [contentSelector],
        styles: { 'font-weight': '700' },
        css: `
          .acc-container, .acc-container *, .acc-menu, .acc-menu * {
            font-weight: inherit !important;
          }
          input::placeholder, textarea::placeholder {
            font-weight: 700 !important;
          }
        `
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
        ':not([data-icon])'
      ].join('');
      const config = {
        id: "readable-text",
        selector: "body",
        childrenSelector: [contentSelector],
        styles: {
          'font-family': fontFamily
        },
        css: `
          .acc-container, .acc-container *, .acc-menu, .acc-menu * {
            font-family: inherit !important;
          }
          input::placeholder, textarea::placeholder {
            font-family: ${fontFamily || 'inherit'} !important;
          }
        `
      };
      this.applyToolStyle({ ...config, enable: !!choice });
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

  concealImages(enable = false) {
    const styleId = `acc-hide-images`;
    this.removeStyle(styleId);
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
        this.syncTextScaleControlUI(this.queryWidget('.acc-menu'), appliedScale);
      } else {
        this.scaleText(1);
        this.syncTextScaleControlUI(this.queryWidget('.acc-menu'), 1);
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
      this.enableMuteSounds(states && states['mute-sounds']);
      this.enableTextMagnifier(states && states['text-magnifier']);
    },

  resetEnhancements() {
      this.saveConfig({ states: {}, systemDefaults: {}, profileSnapshots: {} });
      this.activeColorFilterKey = null;
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
      if (menu) {
        this.setColorFilterUI(menu, null);
        this.setReadableFontUI(menu, null);
        this.syncTextScaleControlUI(menu, 1);
      }
      
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
        'acc-highlight-title',
        'acc-readable-text',
        'acc-pause-motion',
        'acc-hide-images',
        'acc-filter-style',
        'acc-simple-layout'
      ];
      styleIds.forEach(id => this.removeStyle(id));
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
      this.setMediaMotionPaused(false);
      this.enableMuteSounds(false);
      this.enableTextMagnifier(false);
      this.clearSystemPreferenceListeners();
      this.detectSystemPreferences();
      this.setupMediaQueryListeners();
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
  
    const currentlyFocused = this.getActiveElement();
    this.reportPreviousFocus = currentlyFocused && typeof currentlyFocused.focus === 'function'
      ? currentlyFocused
      : null;
  
    panel.classList.add('acc-report-visible');
    panel.setAttribute('aria-hidden', 'false');
    panel.setAttribute('dir', this.getUiDirection());
  
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
  
    closeBtn.addEventListener('click', () => this.closeReportPanel(panel));
    overlay.addEventListener('click', () => this.closeReportPanel(panel));
  
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
        const safeHelpUrl = this.sanitizeUrl(violation.helpUrl);
        html += `
          <div class="acc-report-violation" data-index="${index}">
            <div class="acc-report-violation-header">
              <span class="acc-report-violation-impact ${violation.impact}">${this.translate(this.capitalizeFirst(violation.impact))}</span>
              <span class="acc-report-violation-title">${this.escapeHtml(violation.help)}</span>
              <span class="acc-report-violation-count">${violation.nodes.length} ${this.translate('Element')}${violation.nodes.length > 1 ? 's' : ''}</span>
            </div>
            <div class="acc-report-violation-details">
              <p class="acc-report-violation-desc">${this.escapeHtml(violation.description)}</p>
              ${safeHelpUrl ? `<p class="acc-report-violation-help">
                <a href="${safeHelpUrl}" target="_blank" rel="noopener">${this.translate('How to Fix')} →</a>
              </p>` : ''}
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
    if (focusTarget && typeof focusTarget.focus === 'function') {
      focusTarget.focus();
    }
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
    // activate (or pull axe-core) on later visits outside ?acc-dev=true;
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

  getContrastToggleDisplay(index) {
      if (index === 0) {
        return { key: 'light-contrast', label: 'Light', icon: this.widgetIcons.lightContrast };
      }
      if (index === 1) {
        return { key: 'dark-contrast', label: 'Dark', icon: this.widgetIcons.darkContrast };
      }
      return { key: null, label: 'Contrast', icon: this.widgetIcons.contrast };
    },

  applyModeToggleButtonDisplay(button, display, modeAttribute) {
      if (!button) return;
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
      button.setAttribute(modeAttribute, display.key || 'off');
    },

  updateContrastToggleButton(button, index) {
      this.applyModeToggleButtonDisplay(button, this.getContrastToggleDisplay(index), 'data-contrast-mode');
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
      this.applyModeToggleButtonDisplay(button, this.getSaturationToggleDisplay(index), 'data-saturation-mode');
    },

  getReadableFontDisplay(index) {
      const choices = this.readableFontChoices || [];
      const choice = index >= 0 ? choices[index] : null;
      return {
        key: choice ? choice.key : null,
        label: choice ? choice.label : 'Readable Font',
        icon: this.widgetIcons.dyslexiaFont
      };
    },

  setReadableFontUI(menu, activeKey = null) {
      if (!menu || !menu.querySelector) return;
      const feature = this.multiLevelFeatures?.['readable-text'];
      if (!feature) return;
      const index = activeKey ? feature.values.indexOf(activeKey) : -1;
      feature.currentIndex = index;
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
        this.removeStyle('acc-filter-style');
        return;
      }
      const filter = this.visualFilters[activeKey];
      if (!filter) {
        this.removeStyle('acc-filter-style');
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

  cycleMultiLevelFeature(featureKey, button) {
      const feature = this.multiLevelFeatures[featureKey];
      if (!feature || !button) return;

      if (featureKey === 'readable-text') {
        const newIndex = feature.currentIndex + 1;
        const newFontKey = newIndex >= feature.levels ? null : feature.values[newIndex];
        this.updateState({ 'readable-text': newFontKey || false });
        this.enableReadableText(newFontKey || false);
        this.setReadableFontUI(button.closest('.acc-menu'), newFontKey);
        // setReadableFontUI re-labels the button with the active font.
        this.announceFeatureState(button.getAttribute('aria-label'), !!newFontKey);
        return;
      }

      // Beyond those, only the color filter toggles render as cycling
      // buttons; text scale is controlled by the slider in the Text section.
      if (featureKey !== 'contrast-toggle' && featureKey !== 'saturation-toggle') return;

      const newIndex = feature.currentIndex + 1;
      const newActiveKey = newIndex >= feature.levels ? null : feature.values[newIndex];
      this.updateColorFilterState(newActiveKey);
      this.setColorFilterUI(button.closest('.acc-menu'), newActiveKey);
      this.applyVisualFilters();
      // setColorFilterUI re-labels the button with the active mode.
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

    // Keys also bundled by another currently-active profile must survive
    // this profile turning off, so sibling profiles stay truthful.
    const keysHeldByOtherProfiles = new Set();
    (this.accessibilityProfiles || []).forEach((other) => {
      if (other.key === profileKey || !this.retrieveState(other.key)) return;
      Object.keys(other.states).forEach((key) => keysHeldByOtherProfiles.add(key));
    });

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
        if (this.hasExplicitStatePreference(key)) {
          snapshot[key] = this.retrieveState(key);
        }
        payload[key] = value;
      });
      this.saveConfig({
        profileSnapshots: { ...(this.widgetConfig.profileSnapshots || {}), [profileKey]: snapshot }
      });
      this.updateState(payload);
      if (colorFilterKey) {
        this.updateColorFilterState(colorFilterKey);
      }
    } else {
      const snapshots = { ...(this.widgetConfig.profileSnapshots || {}) };
      const snapshot = snapshots[profileKey] || {};
      delete snapshots[profileKey];

      const restorePayload = { [profileKey]: false };
      const clearKeys = [];
      let clearColorFilter = false;
      Object.keys(profile.states).forEach((key) => {
        if (keysHeldByOtherProfiles.has(key)) return;
        if (this.isColorFilterKey(key)) {
          // Clear only the filter this profile activated; a filter the
          // user switched to manually stays untouched.
          if (this.retrieveState(key)) clearColorFilter = true;
          return;
        }
        if (Object.prototype.hasOwnProperty.call(snapshot, key)) {
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
      if (clearColorFilter) {
        this.updateColorFilterState(null);
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
        this.magnifierMoveHandler = this.throttle((event) => this.updateTextMagnifier(event), 50);
      }
      document.addEventListener('mousemove', this.magnifierMoveHandler, { passive: true });
    } else {
      if (this.magnifierMoveHandler) {
        document.removeEventListener('mousemove', this.magnifierMoveHandler);
        this.magnifierMoveHandler = null;
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
      magnifier.classList.add('acc-visible');
    } else {
      magnifier.classList.remove('acc-visible');
      magnifier.textContent = '';
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

  collectPageLandmarks() {
    const selector = 'main,nav,header,footer,aside,form,section[aria-label],section[aria-labelledby],[role="main"],[role="navigation"],[role="banner"],[role="contentinfo"],[role="complementary"],[role="search"],[role="form"],[role="region"]';
    const seen = new Set();
    const landmarks = [];
    document.querySelectorAll(selector).forEach((el) => {
      if (seen.has(el) || !this.isStructureCandidate(el)) return;
      seen.add(el);
      const role = el.getAttribute('role') || el.tagName.toLowerCase();
      const name = this.getAccessibleLabel(el);
      landmarks.push({
        element: el,
        label: name ? `${role} — ${name}`.slice(0, 120) : role
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
      button.addEventListener('click', () => {
        this.closeReportPanel(this.structurePanel);
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

/** @typedef {import('./index.js').default} AccessibleWebWidget */

/** @type {{ [methodName: string]: (this: AccessibleWebWidget, ...args: any[]) => any }} */
const featureMethods = {
  ...coreFeatureMethods,
  ...ttsMethods,
  ...axeReportMethods,
  ...annotationMethods,
  ...visualFilterMethods,
  ...pageToolMethods
};

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
        if (!key || this.isColorFilterKey(key) || this.multiLevelFeatures[key]) return;
        const option = [...(this.accessTools || []), ...(this.contentOptions || [])].find(o => o.key === key);
        if (option?.isAction) return;
        const isActive = !!states[key];
        btn.classList.toggle('acc-selected', isActive);
        btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      });
      const activeColorFilter = this.getActiveColorFilterKey(states);
      this.setColorFilterUI(menu, activeColorFilter);
      const readableChoice = this.resolveReadableFontChoice(states['readable-text']);
      this.setReadableFontUI(menu, readableChoice ? readableChoice.key : null);
      this.syncTextScaleControlUI(menu, states['text-scale'] || 1);
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

      const langModal = this.findElement('#acc-lang-modal', targetContainer);
      if (langModal) {
        langModal.setAttribute('hidden', '');
      }

      const langToggle = this.findElement('.acc-header-lang-toggle', targetContainer);
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
      const direction = this.getUiDirection();
      const menuElement = menu.classList && menu.classList.contains('acc-menu')
        ? menu
        : menu.querySelector && menu.querySelector('.acc-menu');
      if (menuElement) {
        menuElement.setAttribute('dir', direction);
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
      this.updateSkipLinkLabel();
    },

  displayMenu({ container, lang, position = 'bottom-right' }) {
      try {
        this.applyThemeVariables();
        this.registerStaticStyles();

        const activeLanguageCode = String(lang || 'en').split(/[_-]/)[0].toLowerCase();

        const menuTemplate = `
        <div class="acc-menu" role="dialog" aria-labelledby="accessibility-title">
          <div class="acc-menu-header">
            <div id="accessibility-title" class="acc-menu-title">
              <span class="acc-label">Accessibility Options</span>
            </div>
            <div class="acc-header-actions">
              <button type="button" class="acc-header-lang-toggle" title="Language" aria-label="Language" aria-expanded="false" aria-controls="acc-lang-modal">
                <span id="acc-current-language" class="acc-header-lang-current">${String(activeLanguageCode || 'en').toUpperCase()}</span>
                <span class="acc-header-lang-arrow" aria-hidden="true"> </span>
              </button>
              <button type="button" class="acc-menu-close" title="Close" aria-label="Close">
                ${this.widgetIcons.close}
              </button>
            </div>
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
          <div id="acc-menu-content" class="acc-menu-content">
            <div class="acc-options-all"> </div>
          </div>
          <div class="acc-footer">
            <button type="button" class="acc-footer-reset" title="Reset settings" aria-label="Reset settings">
              ${this.widgetIcons.reset}
              <span class="acc-label">Reset settings</span>
            </button>
            ${this.options.hideAttribution === true ? '' : '<a class="acc-footer-brand" href="https://accessibleweb.pages.dev/" target="_blank" rel="noopener noreferrer">AccessibleWeb Widget</a>'}
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
        // The menu opens as a full-height side panel (top/bottom gaps come
        // from the base CSS) docked to whichever edge hosts the button.
        // theme.menuPosition ('left' | 'right'), when set, overrides that.
        const dockOverride = this.widgetTheme.menuPosition === 'left' || this.widgetTheme.menuPosition === 'right'
          ? this.widgetTheme.menuPosition
          : null;
        const isRightAligned = dockOverride
          ? dockOverride === 'right'
          : position === 'bottom-right' || position === 'top-right';
        if (isRightAligned) {
          menu.style.right = 'var(--acc-menu-inline-gap, 12px)';
          menu.style.left = 'auto';
        } else {
          menu.style.left = 'var(--acc-menu-inline-gap, 12px)';
          menu.style.right = 'auto';
        }

        const config = this.loadConfig();

        const textKeys = new Set(['text-scale', 'bold-text', 'line-spacing', 'letter-spacing', 'readable-text']);
        const colorKeys = new Set(['contrast-toggle', 'invert-colors', 'saturation-toggle', 'high-contrast-mode']);
        const readingAidsKeys = new Set(['reading-aid', 'highlight-links', 'highlight-title', 'simple-layout', 'text-magnifier', 'page-structure']);

        const sourceOptions = [
          ...this.contentOptions.map(option => ({ ...option })),
          ...this.colorOptions.map(option => ({ ...option, optionClass: 'acc-filter' })),
          ...this.accessTools.map(option => ({ ...option, optionClass: 'acc-tools' }))
        ];

        const groupedOptions = {
          profiles: (this.accessibilityProfiles || []).map(profile => ({ ...profile })),
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
          { key: 'profiles', label: 'Profiles', containerClass: 'acc-tts-toggle-container', optionClass: 'acc-tts-toggle' },
          { key: 'speech', label: 'Speech', containerClass: 'acc-tts-toggle-container', optionClass: 'acc-tts-toggle' },
          { key: 'text', label: 'Text', containerClass: 'acc-options acc-options-text' },
          { key: 'color', label: 'Color & Contrast', containerClass: 'acc-options' },
          { key: 'reading', label: 'Reading Aids', containerClass: 'acc-options' },
          { key: 'interaction', label: 'Interaction', containerClass: 'acc-options' }
        ];

        const sortOptionsByOrder = (sectionOptions, order) => {
          sectionOptions.sort((a, b) => {
            const indexA = order.indexOf(a.key);
            const indexB = order.indexOf(b.key);
            const rankA = indexA === -1 ? Number.MAX_SAFE_INTEGER : indexA;
            const rankB = indexB === -1 ? Number.MAX_SAFE_INTEGER : indexB;
            return rankA - rankB;
          });
        };

        const renderThinRowSection = (section, sectionOptions, { order, rows = [], specialContent = '' }) => {
          sortOptionsByOrder(sectionOptions, order);
          const rowsHtml = rows.map(rowKeys => {
            const rowOptions = sectionOptions.filter(option => rowKeys.has(option.key));
            return rowOptions.length
              ? `<div class="acc-options acc-options-text-inline">${this.renderOptions(rowOptions, 'acc-text-inline')}</div>`
              : '';
          }).join('');
          const remainingOptions = sectionOptions.filter(option => (
            !rows.some(rowKeys => rowKeys.has(option.key))
          ));
          const remainingHtml = remainingOptions.length
            ? `<div class="${section.containerClass}">${this.renderOptions(remainingOptions, section.optionClass || '')}</div>`
            : '';

          if (!specialContent && !rowsHtml && !remainingHtml) return '';

          return `
            <section class="acc-option-category acc-option-category-${section.key}">
              <div class="acc-section-title acc-label">${section.label}</div>
              ${specialContent}
              ${rowsHtml}
              ${remainingHtml}
            </section>
          `;
        };

        const sectionMarkup = sectionConfig.map(section => {
          let sectionOptions = groupedOptions[section.key];
          let specialContent = '';

          // Profiles render two-up like the Text/Color/Reading sections;
          // a profile added without a row assignment falls through to a
          // full-width row via section.containerClass.
          if (section.key === 'profiles') {
            return renderThinRowSection(section, sectionOptions, {
              order: ['profile-seizure-safe', 'profile-vision', 'profile-adhd', 'profile-dyslexia'],
              rows: [
                new Set(['profile-seizure-safe', 'profile-vision']),
                new Set(['profile-adhd', 'profile-dyslexia'])
              ]
            });
          }

          if (section.key === 'text') {
            const textScaleOption = sectionOptions.find(option => option.key === 'text-scale');
            sectionOptions = sectionOptions.filter(option => option.key !== 'text-scale');
            return renderThinRowSection(section, sectionOptions, {
              order: ['line-spacing', 'letter-spacing', 'bold-text', 'readable-text'],
              rows: [
                new Set(['line-spacing', 'letter-spacing']),
                new Set(['bold-text', 'readable-text'])
              ],
              specialContent: textScaleOption
                ? this.renderTextScaleControl(config.states?.['text-scale'] || 1)
                : ''
            });
          }

          if (section.key === 'color') {
            return renderThinRowSection(section, sectionOptions, {
              order: ['contrast-toggle', 'saturation-toggle', 'invert-colors', 'high-contrast-mode'],
              rows: [
                new Set(['contrast-toggle', 'saturation-toggle']),
                new Set(['invert-colors', 'high-contrast-mode'])
              ]
            });
          }

          if (section.key === 'reading') {
            return renderThinRowSection(section, sectionOptions, {
              order: ['highlight-links', 'highlight-title', 'reading-aid', 'simple-layout', 'text-magnifier', 'page-structure'],
              rows: [
                new Set(['highlight-links', 'highlight-title']),
                new Set(['reading-aid', 'simple-layout']),
                new Set(['text-magnifier', 'page-structure'])
              ]
            });
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
        const langToggle = this.findElement(".acc-header-lang-toggle", menu);
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
            
            // Save language preference and update UI. langUserSelected marks
            // this as an explicit visitor choice that outranks the embed
            // config and <html lang> on future visits.
            this.saveConfig({ lang: langCode, langUserSelected: true });
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
            this.announce(`${this.translate('Font Size')} ${this.getTextScalePercent(multiplier)}%`);
          });
          this.syncTextScaleControlUI(menu, config.states?.['text-scale'] || 1);
        }
  
        // click event handler:
        menu.addEventListener('click', (e) => {
          if (langModal && !langModal.hasAttribute('hidden')) {
            const clickedInsideLanguageModal = Boolean(e.target.closest('.acc-lang-modal'));
            const clickedLanguageToggle = Boolean(e.target.closest('.acc-header-lang-toggle'));
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
            this.announce(this.translate('Settings reset'));
            return;
          }
          const btn = target.classList.contains('acc-btn') ? target : null;
          if (btn) {
            const key = btn.dataset.key;
            // Handle action buttons (open a panel; no persistent state).
            // Close the menu first: the panel is its own modal surface, and
            // leaving the menu open would leave two competing document-level
            // focus traps active at once. Closing also parks focus on the
            // toggle, which the panel captures as its restore target.
            if (key === 'accessibility-report') {
              this.closeMenu(menuContainer);
              this.runAccessibilityReport();
            }
            else if (key === 'page-structure') {
              this.closeMenu(menuContainer);
              this.openPageStructurePanel();
            }
            // One-tap profiles bundle several feature states.
            else if (key && key.startsWith('profile-')) {
              this.toggleAccessibilityProfile(key, menu);
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

          btn.addEventListener("click", () => this.toggle());
        }

        document.body.appendChild(host);
        this.translateMenuUI(widget);
        this.ensureSkipLink();
        // axe-core and the violation bubble are dev tooling: only fetch the
        // engine and scan the page in dev mode (?acc-dev=true), so regular
        // visitors never download or run the audit.
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
        }
        
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
      { label: 'Simplify Layout', key: 'simple-layout', icon: this.widgetIcons.simplifyLayout },
      { label: 'Mute Sounds', key: 'mute-sounds', icon: this.widgetIcons.muteSounds },
      { label: 'Text Magnifier', key: 'text-magnifier', icon: this.widgetIcons.textMagnifier },
      {
        label: 'Page Structure',
        key: 'page-structure',
        icon: this.widgetIcons.pageStructure,
        isAction: true
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
        states: { 'text-scale': 1.4, 'high-contrast-mode': true, 'large-pointer': true }
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

    // Font size slider bounds
    this.textScaleMinPercent = 80;
    this.textScaleMaxPercent = 150;
    this.textScaleStepPercent = 5;
    this.contrastFilterValues = ['light-contrast', 'dark-contrast'];
    this.saturationFilterValues = ['low-saturation', 'high-saturation'];

    // Readable Font levels; the persisted readable-text state holds the
    // active key ('dyslexic' | 'legible' | 'lexend'; legacy true maps to
    // 'dyslexic'). Labels are translation keys except the Lexend brand name.
    this.readableFontChoices = [
      { key: 'dyslexic', label: 'Dyslexia Font', family: '"OpenDyslexic3", "Comic Sans MS", Arial, Helvetica, sans-serif' },
      { key: 'legible', label: 'Legible Font', family: '"Atkinson Hyperlegible", Verdana, Arial, Helvetica, sans-serif' },
      { key: 'lexend', label: 'Lexend', family: '"Lexend", "Segoe UI", Roboto, Arial, sans-serif' }
    ];

    this.contentOptions = [
      { label: 'Font Weight', key: 'bold-text', icon: this.widgetIcons.boldText },
      { label: 'Line Height', key: 'line-spacing', icon: this.widgetIcons.lineSpacing },
      { label: 'Letter Spacing', key: 'letter-spacing', icon: this.widgetIcons.letterSpacing },
      { label: 'Hide Images', key: 'hide-images', icon: this.widgetIcons.hideImages },
      {
        label: 'Readable Font',
        key: 'readable-text',
        icon: this.widgetIcons.dyslexiaFont,
        multiLevel: true,
        levels: this.readableFontChoices.length
      },
      { label: 'Highlight Links', key: 'highlight-links', icon: this.widgetIcons.highlightLinks },
      { label: 'Highlight Title', key: 'highlight-title', icon: this.widgetIcons.highlightTitle },
      { label: 'Font Size', key: 'text-scale', icon: this.widgetIcons.adjustFontSize }
    ];

    this.multiLevelFeatures = {
      'contrast-toggle': {
        levels: this.contrastFilterValues.length,
        currentIndex: -1,
        values: this.contrastFilterValues
      },
      'saturation-toggle': {
        levels: this.saturationFilterValues.length,
        currentIndex: -1,
        values: this.saturationFilterValues
      },
      'readable-text': {
        levels: this.readableFontChoices.length,
        currentIndex: -1,
        values: this.readableFontChoices.map((choice) => choice.key)
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
    this.readableFontsLoaded = new Set();

    // Shadow DOM host for the widget UI
    this.shadowHost = null;
    this.widgetRoot = null;

    // Screen-reader live region
    this.liveRegion = null;
    this.liveRegionTimer = null;

    // Mute sounds state
    this.muteSoundsObserver = null;

    // Stop Animations media state (paused videos / frozen GIFs)
    this.motionPauseObserver = null;
    this.frozenGifs = [];

    // Text magnifier state
    this.magnifierElement = null;
    this.magnifierMoveHandler = null;

    // Page structure panel state
    this.structurePanel = null;

    // Menu state tracking for focus management
    this.activeMenuContainer = null;
    this.activeMenuToggle = null;
    this.menuKeyListener = null;
    this.previousFocus = null;
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

export { AccessibleWebWidget as default };
