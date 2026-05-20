import { theme } from '@/constants/theme';
import { Text, type TextProps, type TextStyle } from 'react-native';

export type AppTextVariant =
  | 'title'
  | 'subtitle'
  | 'body'
  | 'bodySmall'
  | 'caption'
  | 'label';

export type AppTextTone =
  | 'primary'
  | 'muted'
  | 'subtle'
  | 'inverse'
  | 'accent'
  | 'success'
  | 'warning'
  | 'reward'
  | 'danger';

export type AppTextWeight = 'regular' | 'medium' | 'semibold' | 'bold';

type AppTextProps = TextProps & {
  variant?: AppTextVariant;
  tone?: AppTextTone;
  weight?: AppTextWeight;
  align?: TextStyle['textAlign'];
};

const variantStyles: Record<AppTextVariant, TextStyle> = {
  title: {
    fontSize: theme.fontSize.xxl,
    lineHeight: theme.lineHeight.xxl,
  },
  subtitle: {
    fontSize: theme.fontSize.xl,
    lineHeight: theme.lineHeight.xl,
  },
  body: {
    fontSize: theme.fontSize.lg,
    lineHeight: theme.lineHeight.lg,
  },
  bodySmall: {
    fontSize: theme.fontSize.md,
    lineHeight: theme.lineHeight.md,
  },
  caption: {
    fontSize: theme.fontSize.sm,
    lineHeight: theme.lineHeight.sm,
  },
  label: {
    fontSize: theme.fontSize.md,
    lineHeight: theme.lineHeight.md,
  },
};

const toneColors: Record<AppTextTone, string> = {
  primary: theme.colors.text,
  muted: theme.colors.textMuted,
  subtle: theme.colors.textSubtle,
  inverse: theme.colors.inverseText,
  accent: theme.colors.secondary,
  success: theme.colors.success,
  warning: theme.colors.warning,
  reward: theme.colors.reward,
  danger: theme.colors.danger,
};

const fontWeights: Record<AppTextWeight, TextStyle['fontWeight']> = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

export const AppText = ({
  variant = 'body',
  tone = 'primary',
  weight = 'regular',
  align,
  style,
  children,
  ...props
}: AppTextProps) => (
  <Text
    {...props}
    style={[
      {
        color: toneColors[tone],
        fontWeight: fontWeights[weight],
        textAlign: align,
      },
      variantStyles[variant],
      style,
    ]}
  >
    {children}
  </Text>
);
