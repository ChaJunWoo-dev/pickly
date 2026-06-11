import { AppText, Avatar } from '@/components';
import { theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, View } from 'react-native';
import type { UserRanking } from '../api/ranking';

type RankingListProps = {
  myRanking: UserRanking | null;
  rankings: UserRanking[];
};

export const RankingList = ({ myRanking, rankings }: RankingListProps) => {
  const visibleRankings = rankings.slice(0, 10);
  const isMyRankingInList = myRanking
    ? visibleRankings.some((ranking) => ranking.userId === myRanking.userId)
    : false;

  const getRankMedal = (ranking: number) => {
    if (ranking === 1) return 'gold';
    if (ranking === 2) return 'silver';
    if (ranking === 3) return 'bronze';
  };

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <AppText variant="bodySmall" weight="bold">
          주간 랭킹
        </AppText>
      </View>

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
                medal={getRankMedal(ranking.ranking)}
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

type RankMedal = 'gold' | 'silver' | 'bronze';

type RankingRowProps = {
  medal?: RankMedal;
  ranking: UserRanking;
  variant?: 'default' | 'mine';
};

const RankingRow = ({
  medal,
  ranking,
  variant = 'default',
}: RankingRowProps) => {
  const isMine = variant === 'mine';

  return (
    <View style={[styles.row, isMine && styles.myRow]}>
      <RankMark medal={medal} rank={ranking.ranking} />
      <Avatar
        name={ranking.nickname}
        size="sm"
        source={ranking.avatarUrl ? { uri: ranking.avatarUrl } : undefined}
      />
      <AppText
        style={styles.name}
        tone={isMine ? 'success' : 'primary'}
        variant="bodySmall"
        weight={isMine ? 'bold' : 'semibold'}
      >
        {isMine ? '나의 순위' : ranking.nickname}
      </AppText>
      <AppText
        tone={isMine ? 'success' : 'primary'}
        variant="bodySmall"
        weight="bold"
      >
        {ranking.points.toLocaleString()}P
      </AppText>
    </View>
  );
};

const RankMark = ({ rank, medal }: { rank: number; medal?: string }) => {
  if (medal) {
    const color =
      medal === 'gold'
        ? theme.colors.warning
        : medal === 'silver'
          ? theme.colors.textSubtle
          : theme.colors.reward;

    return (
      <View style={styles.rankIcon}>
        <Ionicons color={color} name="medal" size={25} />
        <AppText style={styles.rankOnMedal} weight="bold">
          {rank}
        </AppText>
      </View>
    );
  }

  return (
    <AppText style={styles.rankNumber} tone="muted" variant="bodySmall">
      {rank}
    </AppText>
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
  list: {
    gap: theme.spacing.md,
  },
  rankingScroll: {
    maxHeight: 256,
  },
  rankingRows: {
    gap: theme.spacing.md,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.sm,
    minHeight: 44,
  },
  myRow: {
    backgroundColor: theme.colors.primarySoft,
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  rankIcon: {
    alignItems: 'center',
    height: 30,
    justifyContent: 'center',
    width: 30,
  },
  rankOnMedal: {
    color: theme.colors.inverseText,
    fontSize: 10,
    lineHeight: 12,
    position: 'absolute',
  },
  rankNumber: {
    textAlign: 'center',
    width: 30,
  },
  name: {
    flex: 1,
  },
});
