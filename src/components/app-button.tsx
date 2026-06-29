import { theme } from '@/constants/theme';
import { useThemeMode } from '@/contexts/theme-mode';
import { AppText } from './app-text';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  type GestureResponderEvent,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

type AppButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger';
type AppButtonSize = 'sm' | 'md' | 'lg';

type AppButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  children: string;
  variant?: AppButtonVariant;
  size?: AppButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
};

const sizeStyles: Record<AppButtonSize, ViewStyle> = {
  sm: {
    minHeight: 36,
    paddingHorizontal: theme.spacing.md,
  },
  md: {
    minHeight: 44,
    paddingHorizontal: theme.spacing.lg,
  },
  lg: {
    minHeight: 52,
    paddingHorizontal: theme.spacing.xl,
  },
};

const textToneByVariant: Record<
  AppButtonVariant,
  'inverse' | 'primary' | 'danger'
> = {
  primary: 'inverse',
  secondary: 'primary',
  outline: 'primary',
  ghost: 'primary',
  danger: 'inverse',
};

export const AppButton = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  onPress,
  style,
  ...props
}: AppButtonProps) => {
  const { appTheme } = useThemeMode();
  const isDisabled = disabled || loading;
  const variantStyles: Record<AppButtonVariant, ViewStyle> = {
    primary: {
      backgroundColor: appTheme.colors.primaryStrong,
    },
    secondary: {
      backgroundColor: appTheme.colors.secondarySoft,
    },
    outline: {
      backgroundColor: appTheme.colors.surface,
      borderColor: appTheme.colors.borderStrong,
      borderWidth: 1,
    },
    ghost: {
      backgroundColor: 'transparent',
    },
    danger: {
      backgroundColor: appTheme.colors.danger,
    },
  };
  const indicatorColorByVariant: Record<AppButtonVariant, string> = {
    primary: appTheme.colors.inverseText,
    secondary: appTheme.colors.text,
    outline: appTheme.colors.text,
    ghost: appTheme.colors.text,
    danger: appTheme.colors.inverseText,
  };

  const handlePress = (event: GestureResponderEvent) => {
    if (isDisabled) {
      return;
    }

    onPress?.(event);
  };

  return (
    <Pressable
      {...props}
      accessibilityRole="button"
      disabled={isDisabled}
      onPress={handlePress}
      style={({ pressed }) => [
        styles.base,
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={indicatorColorByVariant[variant]}
          size="small"
        />
      ) : (
        <AppText
          align="center"
          tone={textToneByVariant[variant]}
          variant="label"
          weight="semibold"
        >
          {children}
        </AppText>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    borderRadius: theme.radius.md,
    flexDirection: 'row',
    gap: theme.spacing.xs,
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.45,
  },
  pressed: {
    opacity: 0.82,
  },
});
