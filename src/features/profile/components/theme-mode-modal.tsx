import { AppModal, AppText } from '@/components';
import { theme } from '@/constants/theme';
import { useThemeMode, type ThemeMode } from '@/contexts/theme-mode';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

type ThemeModeOption = {
  id: ThemeMode;
  label: string;
};

type ThemeModeModalProps = {
  visible: boolean;
  value: ThemeMode;
  onClose: () => void;
  onChange: (value: ThemeMode) => void;
};

const themeModeOptions: ThemeModeOption[] = [
  { id: 'system', label: '시스템 설정' },
  { id: 'light', label: '라이트' },
  { id: 'dark', label: '다크' },
];

export const getThemeModeLabel = (themeMode: ThemeMode) => {
  return (
    themeModeOptions.find((option) => option.id === themeMode)?.label ??
    '시스템 설정'
  );
};

export const ThemeModeModal = ({
  visible,
  value,
  onClose,
  onChange,
}: ThemeModeModalProps) => {
  const { appTheme } = useThemeMode();

  const handleSelectThemeMode = (themeMode: ThemeMode) => {
    onChange(themeMode);
    onClose();
  };

  return (
    <AppModal visible={visible} onClose={onClose}>
      <View style={styles.header}>
        <AppText variant="subtitle" weight="bold">
          화면 설정
        </AppText>
        <Pressable
          accessibilityRole="button"
          onPress={onClose}
          style={styles.closeButton}
        >
          <Ionicons color={appTheme.colors.textMuted} name="close" size={20} />
        </Pressable>
      </View>

      <View style={styles.optionList}>
        {themeModeOptions.map((option) => {
          const isSelected = option.id === value;

          return (
            <Pressable
              key={option.id}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              onPress={() => handleSelectThemeMode(option.id)}
              style={[
                styles.option,
                { borderColor: appTheme.colors.border },
                isSelected && {
                  backgroundColor: appTheme.colors.primarySoft,
                  borderColor: appTheme.colors.primary,
                },
              ]}
            >
              <AppText
                tone={isSelected ? 'primary' : 'subtle'}
                variant="bodySmall"
                weight="semibold"
              >
                {option.label}
              </AppText>

              {isSelected ? (
                <Ionicons
                  color={appTheme.colors.primaryStrong}
                  name="checkmark"
                  size={18}
                />
              ) : null}
            </Pressable>
          );
        })}
      </View>
    </AppModal>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  closeButton: {
    alignItems: 'center',
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  optionList: {
    gap: theme.spacing.xs,
  },
  option: {
    alignItems: 'center',
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 48,
    paddingHorizontal: theme.spacing.md,
  },
});
