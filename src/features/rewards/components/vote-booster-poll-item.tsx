import { AppText } from '@/components';
import { theme } from '@/constants/theme';
import { useThemeMode } from '@/contexts/theme-mode';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import type { BoostablePoll } from '../utils/boostable-polls';

type VoteBoosterPollItemProps = {
  isSelected: boolean;
  poll: BoostablePoll;
  onSelect: (pollId: string) => void;
};

const formatCreatedDate = (createdAt: string) => {
  const date = new Date(createdAt);

  return `${date.getMonth() + 1}.${date.getDate()}`;
};

export const VoteBoosterPollItem = ({
  isSelected,
  poll,
  onSelect,
}: VoteBoosterPollItemProps) => {
  const { appTheme } = useThemeMode();
  const isBoosted = poll.boostedUntil
    ? new Date(poll.boostedUntil).getTime() > Date.now()
    : false;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{
        disabled: isBoosted,
        selected: isSelected,
      }}
      disabled={isBoosted}
      onPress={() => onSelect(poll.id)}
      style={({ pressed }) => [
        styles.item,
        {
          backgroundColor: isSelected
            ? appTheme.colors.primarySoft
            : appTheme.colors.surface,
          borderColor: isSelected
            ? appTheme.colors.primaryStrong
            : appTheme.colors.border,
        },
        isBoosted && styles.itemDisabled,
        pressed && styles.itemPressed,
      ]}
    >
      <View style={styles.copy}>
        <AppText
          variant="bodySmall"
          weight={isSelected ? 'bold' : 'semibold'}
        >
          {poll.title}
        </AppText>
        <View style={styles.metaRow}>
          <AppText tone="muted" variant="caption">
            {formatCreatedDate(poll.createdAt)} 생성
          </AppText>
          <View
            style={[
              styles.statusDot,
              {
                backgroundColor: isBoosted
                  ? appTheme.colors.primaryStrong
                  : appTheme.colors.textSubtle,
              },
            ]}
          />
          <AppText
            tone={isBoosted ? 'success' : 'muted'}
            variant="caption"
            weight="semibold"
          >
            {isBoosted ? '이미 적용 중' : '적용 가능'}
          </AppText>
        </View>
      </View>

      <Ionicons
        color={
          isSelected ? appTheme.colors.primaryStrong : appTheme.colors.textSubtle
        }
        name={isSelected ? 'checkmark-circle' : 'ellipse-outline'}
        size={22}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  item: {
    alignItems: 'center',
    borderRadius: theme.radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: theme.spacing.md,
    minHeight: 72,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  itemDisabled: {
    opacity: 0.58,
  },
  itemPressed: {
    opacity: 0.72,
  },
  copy: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  statusDot: {
    borderRadius: theme.radius.full,
    height: 4,
    width: 4,
  },
});
