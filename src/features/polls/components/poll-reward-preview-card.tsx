import { AppText, Card } from '@/components';
import { theme } from '@/constants/theme';
import { StyleSheet, View } from 'react-native';

export const PollRewardPreviewCard = () => {
  const participationReward = 1;
  const popularPollBonus = 2;
  const totalReward = participationReward + popularPollBonus;

  return (
    <View style={styles.field}>
      <Card style={styles.rewardCard}>
        <View style={styles.rewardHeader}>
          <AppText variant="bodySmall" weight="bold">
            예상 보상
          </AppText>

          <View style={styles.rewardBadge}>
            <AppText tone="reward" variant="bodySmall" weight="bold">
              +{totalReward}P
            </AppText>
          </View>
        </View>

        <View style={styles.rewardRows}>
          <View style={styles.rewardRow}>
            <AppText tone="muted" variant="bodySmall" weight="semibold">
              참여 시 보상
            </AppText>
            <AppText variant="bodySmall" weight="bold">
              +{participationReward}P
            </AppText>
          </View>

          <View style={styles.rewardRow}>
            <AppText tone="muted" variant="bodySmall" weight="semibold">
              인기 투표 보너스
            </AppText>
            <AppText variant="bodySmall" weight="bold">
              +{popularPollBonus}P
            </AppText>
          </View>
        </View>

        <View style={styles.rewardDivider} />

        <View style={styles.rewardRow}>
          <AppText tone="muted" variant="bodySmall" weight="semibold">
            최대 획득 가능
          </AppText>
          <AppText tone="success" variant="subtitle" weight="bold">
            +{totalReward}P
          </AppText>
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  field: {
    gap: theme.spacing.md,
  },
  rewardCard: {
    gap: theme.spacing.lg,
  },
  rewardHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rewardBadge: {
    backgroundColor: theme.colors.rewardSoft,
    borderRadius: theme.radius.full,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  rewardRows: {
    gap: theme.spacing.md,
  },
  rewardRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rewardDivider: {
    backgroundColor: theme.colors.border,
    height: 1,
  },
});
