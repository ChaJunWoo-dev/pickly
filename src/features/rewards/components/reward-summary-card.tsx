import { AppText, Card } from '@/components';
import { theme } from '@/constants/theme';
import { useThemeMode } from '@/contexts/theme-mode';
import { StyleSheet, View } from 'react-native';
import { PointSummary } from '../utils/point-transactions';

type RewardSummaryCardProps = {
  summary: PointSummary;
};

export const RewardSummaryCard = ({ summary }: RewardSummaryCardProps) => {
  const { appTheme } = useThemeMode();

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={styles.pointInfo}>
          <View
            style={[
              styles.pointIcon,
              { backgroundColor: appTheme.colors.primary },
            ]}
          >
            <AppText
              style={[
                styles.pointIconText,
                { color: appTheme.colors.inverseText },
              ]}
              weight="bold"
            >
              P
            </AppText>
          </View>

          <View>
            <AppText tone="muted" variant="caption" weight="semibold">
              내 포인트
            </AppText>
            <AppText
              style={[styles.points, { color: appTheme.colors.text }]}
              weight="bold"
            >
              {summary.currentPoints.toLocaleString()} P
            </AppText>
          </View>
        </View>
      </View>

      <View
        style={[styles.divider, { backgroundColor: appTheme.colors.border }]}
      />

      <View style={styles.stats}>
        <View style={styles.statItem}>
          <AppText tone="muted" variant="caption" weight="semibold">
            이번 달 획득
          </AppText>
          <AppText tone="success" variant="bodySmall" weight="bold">
            {summary.monthlyEarnedPoints.toLocaleString()}P
          </AppText>
        </View>

        <View
          style={[
            styles.statDivider,
            { backgroundColor: appTheme.colors.border },
          ]}
        />

        <View style={styles.statItem}>
          <AppText tone="muted" variant="caption" weight="semibold">
            이번 달 사용
          </AppText>
          <AppText tone="danger" variant="bodySmall" weight="bold">
            {summary.monthlySpentPoints.toLocaleString()}P
          </AppText>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    gap: theme.spacing.lg,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pointInfo: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  pointIcon: {
    alignItems: 'center',
    borderRadius: theme.radius.full,
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
  pointIconText: {
    fontSize: 30,
    lineHeight: 34,
  },
  points: {
    fontSize: 32,
    lineHeight: 38,
  },
  divider: {
    height: 1,
  },
  stats: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
    gap: theme.spacing.xs,
  },
  statDivider: {
    height: 24,
    width: 1,
  },
});
