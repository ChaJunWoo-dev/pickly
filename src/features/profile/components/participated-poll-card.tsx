import { AppText, Card } from '@/components';
import { theme } from '@/constants/theme';
import { useThemeMode } from '@/contexts/theme-mode';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import type { ParticipatedPoll } from '../utils/participation-history';

type ParticipatedPollCardProps = {
  poll: ParticipatedPoll;
  onPress: () => void;
};

export const ParticipatedPollCard = ({
  poll,
  onPress,
}: ParticipatedPollCardProps) => {
  const { appTheme } = useThemeMode();
  const isClosed = poll.status === '마감';

  return (
    <Pressable accessibilityRole="button" onPress={onPress}>
      <Card style={styles.pollCard}>
        <View style={styles.pollHeader}>
          <View
            style={[
              styles.categoryPill,
              { backgroundColor: appTheme.colors.secondarySoft },
            ]}
          >
            <AppText tone="accent" variant="caption" weight="bold">
              {poll.category}
            </AppText>
          </View>

          <View
            style={[
              styles.statusPill,
              {
                backgroundColor: isClosed
                  ? appTheme.colors.surfaceMuted
                  : appTheme.colors.primarySoft,
              },
            ]}
          >
            <Ionicons
              color={
                isClosed
                  ? appTheme.colors.textMuted
                  : appTheme.colors.primaryStrong
              }
              name={isClosed ? 'lock-closed-outline' : 'time-outline'}
              size={13}
            />
            <AppText
              tone={isClosed ? 'muted' : 'success'}
              variant="caption"
              weight="semibold"
            >
              {poll.time}
            </AppText>
          </View>
        </View>

        <AppText variant="body" weight="bold">
          {poll.question}
        </AppText>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <AppText tone="muted" variant="caption" weight="semibold">
              내 선택
            </AppText>
            <AppText variant="caption" weight="bold">
              {poll.selectedOption}
            </AppText>
          </View>

          <View
            style={[
              styles.rewardPill,
              { backgroundColor: appTheme.colors.rewardSoft },
            ]}
          >
            <AppText tone="reward" variant="caption" weight="bold">
              {poll.reward}
            </AppText>
          </View>
        </View>

        <View
          style={[
            styles.resultBlock,
            { backgroundColor: appTheme.colors.surfaceMuted },
          ]}
        >
          <View style={styles.resultHeader}>
            <AppText tone="muted" variant="caption" weight="semibold">
              현재 1위
            </AppText>
            <AppText variant="caption" weight="bold">
              {poll.leadingPercent}%
            </AppText>
          </View>

          <View
            style={[
              styles.progressTrack,
              { backgroundColor: appTheme.colors.border },
            ]}
          >
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: appTheme.colors.primaryStrong,
                  width: `${poll.leadingPercent}%`,
                },
              ]}
            />
          </View>

          <View style={styles.resultFooter}>
            <AppText variant="caption" weight="semibold">
              {poll.leadingOption}
            </AppText>
            <AppText tone="muted" variant="caption">
              {poll.participants.toLocaleString()}명 참여
            </AppText>
          </View>
        </View>
      </Card>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pollCard: {
    gap: theme.spacing.md,
  },
  pollHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryPill: {
    borderRadius: theme.radius.full,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  statusPill: {
    alignItems: 'center',
    borderRadius: theme.radius.full,
    flexDirection: 'row',
    gap: theme.spacing.xxs,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.md,
    justifyContent: 'space-between',
  },
  metaItem: {
    flex: 1,
    gap: theme.spacing.xxs,
  },
  rewardPill: {
    borderRadius: theme.radius.full,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  resultBlock: {
    borderRadius: theme.radius.sm,
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
  },
  resultHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressTrack: {
    borderRadius: theme.radius.full,
    height: 6,
    overflow: 'hidden',
  },
  progressFill: {
    borderRadius: theme.radius.full,
    height: '100%',
  },
  resultFooter: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
