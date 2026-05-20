import { theme } from '@/constants/theme';
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

const variantStyles: Record<AppButtonVariant, ViewStyle> = {
  primary: {
    backgroundColor: theme.colors.primaryStrong,
  },
  secondary: {
    backgroundColor: theme.colors.secondarySoft,
  },
  outline: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.borderStrong,
    borderWidth: 1,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  danger: {
    backgroundColor: theme.colors.danger,
  },
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

const indicatorColorByVariant: Record<AppButtonVariant, string> = {
  primary: theme.colors.inverseText,
  secondary: theme.colors.text,
  outline: theme.colors.text,
  ghost: theme.colors.text,
  danger: theme.colors.inverseText,
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
  const isDisabled = disabled || loading;

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
