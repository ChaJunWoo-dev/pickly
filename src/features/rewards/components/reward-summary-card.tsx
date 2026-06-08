import { AppButton, AppText, Card } from '@/components';
import { theme } from '@/constants/theme';
import { StyleSheet, View } from 'react-native';

export const RewardSummaryCard = () => {
  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={styles.pointInfo}>
          <View style={styles.pointIcon}>
            <AppText style={styles.pointIconText} weight="bold">
              P
            </AppText>
          </View>

          <View>
            <AppText tone="muted" variant="caption" weight="semibold">
              내 포인트
            </AppText>
            <AppText style={styles.points} weight="bold">
              1,240P
            </AppText>
          </View>
        </View>

        <AppButton size="sm" variant="outline">
          충전하기
        </AppButton>
      </View>

      <View style={styles.divider} />

      <View style={styles.stats}>
        <View style={styles.statItem}>
          <AppText tone="muted" variant="caption" weight="semibold">
            이번 달 획득
          </AppText>
          <AppText tone="success" variant="bodySmall" weight="bold">
            +320P
          </AppText>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statItem}>
          <AppText tone="muted" variant="caption" weight="semibold">
            이번 달 사용
          </AppText>
          <AppText tone="danger" variant="bodySmall" weight="bold">
            -80P
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
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.full,
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
  pointIconText: {
    color: theme.colors.text,
    fontSize: 30,
    lineHeight: 34,
  },
  points: {
    color: theme.colors.text,
    fontSize: 32,
    lineHeight: 38,
  },
  divider: {
    backgroundColor: theme.colors.border,
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
    backgroundColor: theme.colors.border,
    height: 24,
    width: 1,
  },
});
