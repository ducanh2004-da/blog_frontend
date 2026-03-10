/**
 * Design System Theme Tokens
 * Centralized color, spacing, typography, and component style configuration
 */

export const themeTokens = {
  // ============ COLORS ============
  colors: {
    // Primary brand colors
    primary: {
      50: '#eef2ff',
      100: '#e0e7ff',
      500: '#6366f1',
      600: '#4f46e5',
      700: '#4338ca',
      900: '#312e81',
    },

    // Neutral/Gray scale
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },

    // Semantic colors
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',

    // Backgrounds
    background: '#ffffff',
    backgroundSecondary: '#f9fafb',
    surface: '#ffffff',

    // Borders
    border: '#e5e7eb',
    borderLight: '#f3f4f6',
  },

  // ============ SPACING ============
  spacing: {
    // Padding/Margin units
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '2.5rem',  // 40px
    '3xl': '3rem',    // 48px

    // Common patterns
    gutter: '1.5rem',  // Standard padding between sections
    cardPadding: '1.5rem',
    sidebarWidth: 'calc(280px)',
    mainContentMaxWidth: '900px',
  },

  // ============ TYPOGRAPHY ============
  typography: {
    fontFamily: {
      main: '"Inter Tight", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      mono: '"Fira Code", monospace',
    },
    fontSize: {
      xs: '0.75rem',      // 12px
      sm: '0.875rem',     // 14px
      base: '1rem',       // 16px
      lg: '1.125rem',     // 18px
      xl: '1.25rem',      // 20px
      '2xl': '1.5rem',    // 24px
      '3xl': '1.875rem',  // 30px
      '4xl': '2.25rem',   // 36px
    },
    fontWeight: {
      thin: 100,
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },
  },

  // ============ BORDER RADIUS ============
  borderRadius: {
    none: '0',
    sm: '0.375rem',     // 6px
    base: '0.5rem',     // 8px
    md: '0.75rem',      // 12px
    lg: '1rem',         // 16px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    full: '9999px',
  },

  // ============ SHADOWS ============
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  },

  // ============ TRANSITIONS ============
  transitions: {
    fast: '150ms ease-in-out',
    base: '250ms ease-in-out',
    slow: '350ms ease-in-out',
  },

  // ============ Z-INDEX ============
  zIndex: {
    hide: -1,
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    backdrop: 1040,
    offcanvas: 1050,
    modal: 1060,
  },

  // ============ BREAKPOINTS ============
  breakpoints: {
    // Mobile first approach
    xs: '0px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
};

/**
 * Component-specific style helpers
 */
export const componentStyles = {
  // Card styling variants
  card: {
    default: 'rounded-[1.5rem] bg-white shadow-sm hover:shadow-md transition-shadow',
    elevated: 'rounded-[1.5rem] bg-white shadow-md hover:shadow-lg transition-shadow',
    bordered: 'rounded-[1.5rem] bg-white border border-[#e5e7eb]',
  },

  // Button style variants
  button: {
    primary:
      'rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors',
    secondary:
      'rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors',
    tertiary:
      'rounded-lg bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors',
    ghost:
      'text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors',
  },

  // Input styling
  input:
    'w-full rounded-lg border border-gray-300 px-4 py-2 text-base placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-colors',

  // Badge styling
  badge: {
    primary: 'inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700',
    gray: 'inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700',
    success: 'inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700',
  },

  // Text truncation
  truncate: 'truncate',
  lineClamp2: 'line-clamp-2',
  lineClamp3: 'line-clamp-3',
};

/**
 * Responsive utilities
 */
export const responsive = {
  container: 'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8',
  layoutGrid: 'grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12',
  sidebarLayout: 'lg:col-span-3 order-2 lg:order-1',
  mainLayout: 'lg:col-span-6 order-1 lg:order-2',
  rightSidebarLayout: 'hidden lg:block lg:col-span-3 order-3',
};

/**
 * Accessibility helpers
 */
export const a11y = {
  focusRing: 'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
  srOnly: 'sr-only',
  skipLink: 'absolute -top-40 left-0 z-50 bg-indigo-600 px-4 py-2 text-white focus:top-0',
};

export default themeTokens;
