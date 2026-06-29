import { theme } from '@/constants/theme';
import { useThemeMode } from '@/contexts/theme-mode';
import { AppText } from './app-text';
import { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import type { ReactNode } from 'react';

type AppInputVariant = 'outline' | 'filled';
type AppInputSize = 'md' | 'lg';

type AppInputProps = TextInputProps & {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: AppInputVariant;
  size?: AppInputSize;
  fullWidth?: boolean;
  leftElement?: ReactNode;
  rightElement?: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
};

export const AppInput = ({
  label,
  error,
  helperText,
  variant = 'outline',
  size = 'md',
  fullWidth = true,
  leftElement,
  rightElement,
  containerStyle,
  inputStyle,
  editable = true,
  style,
  placeholderTextColor,
  onBlur,
  onFocus,
  multiline,
  ...props
}: AppInputProps) => {
  const { appTheme } = useThemeMode();
  const [focused, setFocused] = useState(false);
  const hasError = Boolean(error);
  const variantStyles: Record<AppInputVariant, ViewStyle> = {
    outline: {
      backgroundColor: appTheme.colors.surface,
      borderColor: appTheme.colors.border,
    },
    filled: {
      backgroundColor: appTheme.colors.surfaceMuted,
      borderColor: appTheme.colors.surfaceMuted,
    },
  };

  const handleFocus: NonNullable<TextInputProps['onFocus']> = (event) => {
    setFocused(true);
    onFocus?.(event);
  };

  const handleBlur: NonNullable<TextInputProps['onBlur']> = (event) => {
    setFocused(false);
    onBlur?.(event);
  };

  return (
    <View style={[fullWidth && styles.fullWidth, containerStyle]}>
      {label ? (
        <AppText style={styles.label} variant="label" weight="semibold">
          {label}
        </AppText>
      ) : null}

      <View
        style={[
          styles.inputFrame,
          variantStyles[variant],
          sizeStyles[size],
          multiline && styles.multilineFrame,
          !editable && styles.disabledFrame,
          focused && !hasError && { borderColor: appTheme.colors.primaryStrong },
          hasError && { borderColor: appTheme.colors.danger },
        ]}
      >
        {leftElement ? <View style={styles.sideElement}>{leftElement}</View> : null}

        <TextInput
          {...props}
          editable={editable}
          multiline={multiline}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholderTextColor={placeholderTextColor ?? appTheme.colors.textSubtle}
          style={[
            styles.input,
            { color: appTheme.colors.text },
            multiline && styles.multilineInput,
            !editable && { color: appTheme.colors.textMuted },
            inputStyle,
            style,
          ]}
        />

        {rightElement ? (
          <View style={styles.sideElement}>{rightElement}</View>
        ) : null}
      </View>

      {error ? (
        <AppText style={styles.message} tone="danger" variant="caption">
          {error}
        </AppText>
      ) : helperText ? (
        <AppText style={styles.message} tone="muted" variant="caption">
          {helperText}
        </AppText>
      ) : null}
    </View>
  );
};

const sizeStyles: Record<AppInputSize, ViewStyle> = {
  md: {
    minHeight: 48,
  },
  lg: {
    minHeight: 56,
  },
};

const styles = StyleSheet.create({
  fullWidth: {
    width: '100%',
  },
  label: {
    marginBottom: theme.spacing.xs,
  },
  inputFrame: {
    alignItems: 'center',
    borderRadius: theme.radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.md,
  },
  input: {
    flex: 1,
    fontSize: theme.fontSize.md,
    lineHeight: theme.lineHeight.md,
    paddingVertical: theme.spacing.md,
  },
  sideElement: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: theme.spacing.xs,
  },
  multilineFrame: {
    alignItems: 'flex-start',
    minHeight: 96,
    paddingTop: theme.spacing.sm,
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  disabledFrame: {
    opacity: 0.55,
  },
  message: {
    marginTop: theme.spacing.xs,
  },
});
