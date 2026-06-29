import { theme } from '@/constants/theme';
import { useThemeMode } from '@/contexts/theme-mode';
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
}: AppTextProps) => {
  const { appTheme } = useThemeMode();
  const toneColors: Record<AppTextTone, string> = {
    primary: appTheme.colors.text,
    muted: appTheme.colors.textMuted,
    subtle: appTheme.colors.textSubtle,
    inverse: appTheme.colors.inverseText,
    accent: appTheme.colors.secondary,
    success: appTheme.colors.success,
    warning: appTheme.colors.warning,
    reward: appTheme.colors.reward,
    danger: appTheme.colors.danger,
  };

  return (
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
};
