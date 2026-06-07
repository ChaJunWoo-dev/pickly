import { theme } from '@/constants/theme';
import { useThemeMode } from '@/contexts/theme-mode';
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

export const AppIconButton = ({
  icon,
  variant = 'plain',
  size = 'md',
  disabled,
  style,
  ...props
}: AppIconButtonProps) => {
  const { appTheme } = useThemeMode();
  const variantStyles: Record<AppIconButtonVariant, ViewStyle> = {
    plain: {
      backgroundColor: 'transparent',
    },
    surface: {
      backgroundColor: appTheme.colors.surface,
      borderColor: appTheme.colors.border,
      borderWidth: 1,
    },
    primary: {
      backgroundColor: appTheme.colors.primaryStrong,
    },
    danger: {
      backgroundColor: appTheme.colors.dangerSoft,
    },
  };

  return (
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
};

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
