import { Platform } from 'react-native';

export const colors = {
  background: '#FAFAF7',
  surface: '#FFFFFF',
  surfaceMuted: '#F3F5F1',

  text: '#1F2933',
  textMuted: '#68707A',
  textSubtle: '#9AA1A9',
  inverseText: '#FFFFFF',

  border: '#E4E7E1',
  borderStrong: '#CCD3C8',

  primary: '#9BE15D',
  primaryStrong: '#63B82F',
  primarySoft: '#EAFADC',

  secondary: '#2F80ED',
  secondarySoft: '#E7F0FF',

  reward: '#FF6B57',
  rewardSoft: '#FFE9E5',

  warning: '#F5A524',
  warningSoft: '#FFF4D8',

  danger: '#E5484D',
  dangerSoft: '#FFE5E7',

  success: '#2DBE73',
  successSoft: '#E3F8ED',

  overlay: 'rgba(31, 41, 51, 0.36)',
} as const;

export const darkColors = {
  background: '#101417',
  surface: '#171D20',
  surfaceMuted: '#222A2E',

  text: '#F4F7F2',
  textMuted: '#B7C0B2',
  textSubtle: '#7E8980',
  inverseText: '#101417',

  border: '#2C3631',
  borderStrong: '#435047',

  primary: '#9BE15D',
  primaryStrong: '#8AD94F',
  primarySoft: '#20351A',

  secondary: '#72A7FF',
  secondarySoft: '#142946',

  reward: '#FF826F',
  rewardSoft: '#3F211D',

  warning: '#F6BE4F',
  warningSoft: '#3B2E12',

  danger: '#FF6B70',
  dangerSoft: '#3A1E21',

  success: '#43D987',
  successSoft: '#183626',

  overlay: 'rgba(0, 0, 0, 0.58)',
} as const;

export const spacing = {
  xxs: 4,
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  full: 999,
} as const;

export const fontSize = {
  xs: 11,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 20,
  xxl: 24,
  display: 30,
} as const;

export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  heavy: '800',
} as const;

export const lineHeight = {
  xs: 15,
  sm: 17,
  md: 20,
  lg: 23,
  xl: 28,
  xxl: 32,
  display: 38,
} as const;

export const shadow = {
  card: {
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 2,
  },
  floating: {
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.14,
    shadowRadius: 22,
    elevation: 5,
  },
} as const;

export const layout = {
  screenPadding: spacing.lg,
  cardRadius: radius.sm,
  maxContentWidth: 430,
  bottomTabHeight: 64,
} as const;

type AppShadow = {
  card: {
    shadowColor: string;
    shadowOffset: { width: number; height: number };
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;
  };
  floating: {
    shadowColor: string;
    shadowOffset: { width: number; height: number };
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;
  };
};

export type AppTheme = {
  colors: Record<keyof typeof colors, string>;
  spacing: typeof spacing;
  radius: typeof radius;
  fontSize: typeof fontSize;
  fontWeight: typeof fontWeight;
  lineHeight: typeof lineHeight;
  shadow: AppShadow;
  layout: typeof layout;
};

export const theme: AppTheme = {
  colors,
  spacing,
  radius,
  fontSize,
  fontWeight,
  lineHeight,
  shadow,
  layout,
};

export const darkTheme: AppTheme = {
  ...theme,
  colors: darkColors,
  shadow: {
    card: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.22,
      shadowRadius: 14,
      elevation: 2,
    },
    floating: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.34,
      shadowRadius: 22,
      elevation: 5,
    },
  },
};
export type AppColor = keyof typeof colors;

const tintColorLight = colors.primaryStrong;
const tintColorDark = colors.primary;

export const Colors = {
  light: {
    text: colors.text,
    background: colors.background,
    tint: tintColorLight,
    icon: colors.textMuted,
    tabIconDefault: colors.textMuted,
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: colors.inverseText,
    background: '#101417',
    tint: tintColorDark,
    icon: '#B7C0B2',
    tabIconDefault: '#B7C0B2',
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
