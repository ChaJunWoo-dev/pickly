import { AppText, Card } from '@/components';
import { theme } from '@/constants/theme';
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
  const isClosed = poll.status === '마감';

  return (
    <Pressable accessibilityRole="button" onPress={onPress}>
      <Card style={styles.pollCard}>
        <View style={styles.pollHeader}>
          <View style={styles.categoryPill}>
            <AppText tone="accent" variant="caption" weight="bold">
              {poll.category}
            </AppText>
          </View>

          <View
            style={[styles.statusPill, isClosed && styles.closedStatusPill]}
          >
            <Ionicons
              color={
                isClosed ? theme.colors.textMuted : theme.colors.primaryStrong
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

          <View style={styles.rewardPill}>
            <AppText tone="reward" variant="caption" weight="bold">
              {poll.reward}
            </AppText>
          </View>
        </View>

        <View style={styles.resultBlock}>
          <View style={styles.resultHeader}>
            <AppText tone="muted" variant="caption" weight="semibold">
              현재 1위
            </AppText>
            <AppText variant="caption" weight="bold">
              {poll.leadingPercent}%
            </AppText>
          </View>

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${poll.leadingPercent}%` },
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
    backgroundColor: theme.colors.secondarySoft,
    borderRadius: theme.radius.full,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  statusPill: {
    alignItems: 'center',
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radius.full,
    flexDirection: 'row',
    gap: theme.spacing.xxs,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  closedStatusPill: {
    backgroundColor: theme.colors.surfaceMuted,
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
    backgroundColor: theme.colors.rewardSoft,
    borderRadius: theme.radius.full,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  resultBlock: {
    backgroundColor: theme.colors.surfaceMuted,
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
    backgroundColor: theme.colors.border,
    borderRadius: theme.radius.full,
    height: 6,
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: theme.colors.primaryStrong,
    borderRadius: theme.radius.full,
    height: '100%',
  },
  resultFooter: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
