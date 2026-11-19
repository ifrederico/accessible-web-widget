export const WIDGET_THEME = {
      // Core colors
      primaryColor: '#0072e4',        // Blue, oklch(0.56 0.199 253); 4.6:1 with white (WCAG AA)
      primaryColorLight: '#4da1fe',   // Lighter blue, oklch(0.70 0.16 253)
      primaryColorDark: '#0049a5',    // Darker blue, oklch(0.42 0.17 253)
      backgroundColor: '#f5f7fa',
      textColor: '#222222',
      textColorInverted: '#ffffff',
      
      // UI elements
      buttonSize: '48px',
      cardBackground: '#ffffff',
      borderColor: '#d1d5db',
      focusRingColor: '#0072e4',      // Match primary
      
      // Interactive states
      hoverColor: '#4da1fe',          // Use light blue for hover
      activeColor: '#0049a5',         // Use dark blue for active
      
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
