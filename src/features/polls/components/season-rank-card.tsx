import { AppText, Card } from '@/components';
import { theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

export const SeasonRankCard = () => {
  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <AppText variant="bodySmall" weight="bold">
          시즌 랭킹
        </AppText>
        <View style={styles.seasonPill}>
          <AppText tone="muted" variant="caption" weight="semibold">
            6월 시즌
          </AppText>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.rankBlock}>
          <AppText tone="muted" variant="caption" weight="semibold">
            내 순위
          </AppText>
          <AppText style={styles.rank} weight="bold">
            12위
          </AppText>
          <AppText tone="success" variant="bodySmall" weight="bold">
            상위 5%
          </AppText>
        </View>

        <View style={styles.verticalDivider} />

        <View style={styles.progressBlock}>
          <View style={styles.medal}>
            <Ionicons
              color={theme.colors.warning}
              name="ribbon"
              size={34}
            />
          </View>

          <View style={styles.progressInfo}>
            <AppText tone="muted" variant="caption" weight="semibold">
              다음 등급까지
            </AppText>
            <AppText variant="bodySmall" weight="bold">
              160P 남음
            </AppText>
          </View>

          <View style={styles.track}>
            <View style={styles.fill} />
          </View>
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
  seasonPill: {
    borderColor: theme.colors.borderStrong,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  content: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.lg,
  },
  rankBlock: {
    gap: theme.spacing.xs,
    minWidth: 88,
  },
  rank: {
    color: theme.colors.text,
    fontSize: 32,
    lineHeight: 38,
  },
  verticalDivider: {
    backgroundColor: theme.colors.border,
    height: 72,
    width: 1,
  },
  progressBlock: {
    flex: 1,
    gap: theme.spacing.sm,
  },
  medal: {
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radius.full,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  progressInfo: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  track: {
    backgroundColor: theme.colors.border,
    borderRadius: theme.radius.full,
    height: 8,
    overflow: 'hidden',
  },
  fill: {
    backgroundColor: theme.colors.primaryStrong,
    borderRadius: theme.radius.full,
    height: '100%',
    width: '58%',
  },
});
