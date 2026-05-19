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

export const theme = {
  colors,
  spacing,
  radius,
  fontSize,
  fontWeight,
  lineHeight,
  shadow,
  layout,
} as const;

export type AppTheme = typeof theme;
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
