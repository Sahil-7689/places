export const theme = {
  colors: {
    primary: '#0050cb',
    primaryContainer: '#0066ff',
    onPrimary: '#ffffff',
    onPrimaryContainer: '#f8f7ff',
    primaryFixed: '#dae1ff',
    primaryFixedDim: '#b3c5ff',
    onPrimaryFixed: '#001849',
    onPrimaryFixedVariant: '#003fa4',

    secondary: '#505f76',
    secondaryContainer: '#d0e1fb',
    onSecondary: '#ffffff',
    onSecondaryContainer: '#54647a',
    secondaryFixed: '#d3e4fe',
    secondaryFixedDim: '#b7c8e1',

    tertiary: '#005f89',
    tertiaryContainer: '#0079ad',
    onTertiary: '#ffffff',
    onTertiaryContainer: '#f3f8ff',
    tertiaryFixed: '#c9e6ff',
    tertiaryFixedDim: '#89ceff',

    surface: '#f7f9fb',
    surfaceDim: '#d8dadc',
    surfaceBright: '#f7f9fb',
    surfaceContainerLowest: '#ffffff',
    surfaceContainerLow: '#f2f4f6',
    surfaceContainer: '#eceef0',
    surfaceContainerHigh: '#e6e8ea',
    surfaceContainerHighest: '#e0e3e5',

    onSurface: '#191c1e',
    onSurfaceVariant: '#424656',
    inverseSurface: '#2d3133',
    inverseOnSurface: '#eff1f3',

    outline: '#727687',
    outlineVariant: '#c2c6d8',

    error: '#ba1a1a',
    errorContainer: '#ffdad6',
    onError: '#ffffff',
    onErrorContainer: '#93000a',

    background: '#f7f9fb',
    onBackground: '#191c1e',
    star: '#e69a00',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    marginMobile: 20,
    marginDesktop: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
  typography: {
    displayLg: {
      fontSize: 36,
      lineHeight: 44,
      fontWeight: '700' as const,
      letterSpacing: -0.5,
    },
    headlineLg: {
      fontSize: 28,
      lineHeight: 36,
      fontWeight: '700' as const,
      letterSpacing: -0.3,
    },
    headlineLgMobile: {
      fontSize: 24,
      lineHeight: 32,
      fontWeight: '700' as const,
    },
    headlineMd: {
      fontSize: 20,
      lineHeight: 28,
      fontWeight: '600' as const,
    },
    bodyLg: {
      fontSize: 18,
      lineHeight: 28,
      fontWeight: '400' as const,
    },
    bodyMd: {
      fontSize: 15,
      lineHeight: 22,
      fontWeight: '400' as const,
    },
    labelMd: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '600' as const,
      letterSpacing: 0.2,
    },
    labelSm: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '500' as const,
    },
  },
  shadows: {
    elevation0: {},
    elevation1: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.06,
      shadowRadius: 10,
      elevation: 3,
    },
    elevation2: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.1,
      shadowRadius: 16,
      elevation: 6,
    },
  },
};

export type Theme = typeof theme;
