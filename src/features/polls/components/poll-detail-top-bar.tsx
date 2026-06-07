import { theme } from '@/constants/theme';
import { useThemeMode } from '@/contexts/theme-mode';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

type PollDetailTopBarProps = {
  isSaved: boolean;
  isSavingPoll: boolean;
  onBack: () => void;
  onOpenActions: () => void;
  onToggleSave: () => void;
};

export const PollDetailTopBar = ({
  isSaved,
  isSavingPoll,
  onBack,
  onOpenActions,
  onToggleSave,
}: PollDetailTopBarProps) => {
  const { appTheme } = useThemeMode();

  return (
    <View style={styles.topBar}>
      <Pressable
        accessibilityRole="button"
        onPress={onBack}
        style={styles.iconButton}
      >
        <Ionicons color={appTheme.colors.text} name="chevron-back" size={22} />
      </Pressable>

      <View style={styles.topActions}>
        <Pressable
          accessibilityRole="button"
          disabled={isSavingPoll}
          onPress={onToggleSave}
          style={[styles.iconButton, isSavingPoll && styles.iconButtonMuted]}
        >
          <Ionicons
            color={isSaved ? appTheme.colors.primary : appTheme.colors.text}
            name={isSaved ? 'bookmark' : 'bookmark-outline'}
            size={20}
          />
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={onOpenActions}
          style={styles.iconButton}
        >
          <Ionicons
            color={appTheme.colors.text}
            name="ellipsis-horizontal"
            size={20}
          />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topActions: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  iconButton: {
    alignItems: 'center',
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  iconButtonMuted: {
    opacity: 0.55,
  },
});
