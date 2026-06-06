import { AppText, Card } from '@/components';
import { theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

type ParticipationSummaryCardProps = {
  pollCount: number;
  totalReward: number;
};

export const ParticipationSummaryCard = ({
  pollCount,
  totalReward,
}: ParticipationSummaryCardProps) => {
  return (
    <Card style={styles.summaryCard}>
      <View style={styles.summaryIcon}>
        <Ionicons
          color={theme.colors.primaryStrong}
          name="checkmark-done-outline"
          size={24}
        />
      </View>

      <View style={styles.summaryCopy}>
        <AppText variant="bodySmall" weight="bold">
          이번 달 {pollCount}개 투표에 참여했어요
        </AppText>
        <AppText tone="muted" variant="caption">
          받은 보상은 총 +{totalReward}P예요.
        </AppText>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  summaryCard: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  summaryIcon: {
    alignItems: 'center',
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radius.full,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  summaryCopy: {
    flex: 1,
    gap: theme.spacing.xs,
  },
});
