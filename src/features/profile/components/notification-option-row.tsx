import { AppText } from '@/components';
import { theme } from '@/constants/theme';
import { useThemeMode } from '@/contexts/theme-mode';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

type NotificationOptionRowProps = {
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  isDisabled: boolean;
  isEnabled: boolean;
  showBorder: boolean;
  title: string;
  onPress: () => void;
};

export const NotificationOptionRow = ({
  description,
  icon,
  isDisabled,
  isEnabled,
  showBorder,
  title,
  onPress,
}: NotificationOptionRowProps) => {
  const { appTheme } = useThemeMode();

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{
        checked: isEnabled,
        disabled: isDisabled,
      }}
      disabled={isDisabled}
      onPress={onPress}
      style={[
        styles.row,
        isDisabled && styles.rowDisabled,
        showBorder && {
          borderTopColor: appTheme.colors.border,
          borderTopWidth: 1,
        },
      ]}
    >
      <View
        style={[
          styles.icon,
          { backgroundColor: appTheme.colors.surfaceMuted },
        ]}
      >
        <Ionicons color={appTheme.colors.textMuted} name={icon} size={19} />
      </View>

      <View style={styles.copy}>
        <AppText variant="bodySmall" weight="bold">
          {title}
        </AppText>
        <AppText tone="muted" variant="caption">
          {description}
        </AppText>
      </View>

      <View
        style={[
          styles.toggle,
          {
            backgroundColor: isEnabled
              ? appTheme.colors.primaryStrong
              : appTheme.colors.border,
          },
        ]}
      >
        <View
          style={[
            styles.toggleThumb,
            {
              backgroundColor: appTheme.colors.surface,
              transform: [{ translateX: isEnabled ? 18 : 0 }],
            },
          ]}
        />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.md,
    minHeight: 72,
    paddingVertical: theme.spacing.sm,
  },
  rowDisabled: {
    opacity: 0.45,
  },
  icon: {
    alignItems: 'center',
    borderRadius: theme.radius.full,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  copy: {
    flex: 1,
    gap: theme.spacing.xxs,
  },
  toggle: {
    borderRadius: theme.radius.full,
    height: 28,
    justifyContent: 'center',
    paddingHorizontal: 3,
    width: 52,
  },
  toggleThumb: {
    borderRadius: theme.radius.full,
    height: 22,
    width: 22,
  },
});
