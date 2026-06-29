import { theme } from '@/constants/theme';
import {
  Pressable,
  StyleSheet,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import type { ReactNode } from 'react';

type AppIconButtonVariant = 'plain' | 'surface' | 'primary' | 'danger';
type AppIconButtonSize = 'sm' | 'md' | 'lg';

type AppIconButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  icon: ReactNode;
  variant?: AppIconButtonVariant;
  size?: AppIconButtonSize;
  style?: StyleProp<ViewStyle>;
};

const sizeStyles: Record<AppIconButtonSize, ViewStyle> = {
  sm: {
    height: 32,
    width: 32,
  },
  md: {
    height: 40,
    width: 40,
  },
  lg: {
    height: 48,
    width: 48,
  },
};

const variantStyles: Record<AppIconButtonVariant, ViewStyle> = {
  plain: {
    backgroundColor: 'transparent',
  },
  surface: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
  },
  primary: {
    backgroundColor: theme.colors.primaryStrong,
  },
  danger: {
    backgroundColor: theme.colors.dangerSoft,
  },
};

export const AppIconButton = ({
  icon,
  variant = 'plain',
  size = 'md',
  disabled,
  style,
  ...props
}: AppIconButtonProps) => (
  <Pressable
    {...props}
    accessibilityRole="button"
    disabled={disabled}
    hitSlop={props.hitSlop ?? theme.spacing.sm}
    style={({ pressed }) => [
      styles.base,
      sizeStyles[size],
      variantStyles[variant],
      disabled && styles.disabled,
      pressed && !disabled && styles.pressed,
      style,
    ]}
  >
    {icon}
  </Pressable>
);

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    borderRadius: theme.radius.full,
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.45,
  },
  pressed: {
    opacity: 0.78,
  },
});
