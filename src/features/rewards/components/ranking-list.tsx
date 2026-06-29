import { AppText } from '@/components';
import { theme } from '@/constants/theme';
import { useThemeMode } from '@/contexts/theme-mode';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, View } from 'react-native';
import type { UserRanking } from '../utils/ranking';
import { RankingRow } from './ranking-row';

type RankingListProps = {
  myRanking: UserRanking | null;
  rankings: UserRanking[];
};

export const RankingList = ({ myRanking, rankings }: RankingListProps) => {
  const { appTheme } = useThemeMode();
  const visibleRankings = rankings.slice(0, 10);
  const isMyRankingInList = myRanking
    ? visibleRankings.some((ranking) => ranking.userId === myRanking.userId)
    : false;

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <View style={styles.headerTitle}>
          <View
            style={[
              styles.headerIcon,
              { backgroundColor: appTheme.colors.primarySoft },
            ]}
          >
            <Ionicons
              color={appTheme.colors.primaryStrong}
              name="trophy"
              size={15}
            />
          </View>
          <AppText variant="bodySmall" weight="bold">
            주간 랭킹
          </AppText>
        </View>

        <View
          style={[
            styles.headerPill,
            { backgroundColor: appTheme.colors.successSoft },
          ]}
        >
          <AppText tone="success" variant="caption" weight="semibold">
            TOP 10
          </AppText>
        </View>
      </View>

      <View
        style={[styles.divider, { backgroundColor: appTheme.colors.border }]}
      />

      <View style={styles.list}>
        <ScrollView
          contentContainerStyle={styles.rankingRows}
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}
          style={styles.rankingScroll}
        >
          {visibleRankings.map((ranking) => {
            const isMine = myRanking?.userId === ranking.userId;

            return (
              <RankingRow
                key={ranking.userId}
                ranking={ranking}
                variant={isMine ? 'mine' : 'default'}
              />
            );
          })}
        </ScrollView>

        {myRanking && !isMyRankingInList ? (
          <RankingRow ranking={myRanking} variant="mine" />
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    gap: theme.spacing.lg,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerTitle: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  headerIcon: {
    alignItems: 'center',
    borderRadius: theme.radius.full,
    height: 26,
    justifyContent: 'center',
    width: 26,
  },
  headerPill: {
    borderRadius: theme.radius.full,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xxs,
  },
  divider: {
    height: 1,
  },
  list: {
    gap: theme.spacing.md,
  },
  rankingScroll: {
    maxHeight: 256,
  },
  rankingRows: {
    gap: theme.spacing.md,
  },
});
