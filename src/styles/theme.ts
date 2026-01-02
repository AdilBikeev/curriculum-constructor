export const theme = {
  colors: {
    primary: '#6366f1',
    primaryLight: '#818cf8',
    primaryDark: '#4f46e5',
    secondary: '#64748b',
    secondaryLight: '#94a3b8',
    secondaryDark: '#475569',
    success: '#10b981',
    successLight: '#34d399',
    danger: '#ef4444',
    dangerLight: '#f87171',
    warning: '#f59e0b',
    warningLight: '#fbbf24',
    info: '#3b82f6',
    infoLight: '#60a5fa',
    light: '#f8fafc',
    lightGray: '#f1f5f9',
    gray: '#e2e8f0',
    dark: '#1e293b',
    darkGray: '#334155',
    white: '#ffffff',
    black: '#0f172a',
    // Градиенты
    gradientPrimary: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    gradientSecondary: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
    gradientSuccess: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  },
  fonts: {
    primary: "'Inter', 'Segoe UI', 'Roboto', -apple-system, BlinkMacSystemFont, sans-serif",
    secondary: "'Georgia', 'Times New Roman', serif",
  },
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1440px',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
    xxxl: '4rem',
  },
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  },
  transitions: {
    fast: '0.15s ease-in-out',
    normal: '0.2s ease-in-out',
    slow: '0.3s ease-in-out',
  },
} as const;

export type Theme = typeof theme;


