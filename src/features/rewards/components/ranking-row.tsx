import { AppText, Avatar } from '@/components';
import { theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import type { UserRanking } from '../utils/ranking';

type RankingRowProps = {
  ranking: UserRanking;
  variant?: 'default' | 'mine';
};

type RankMedal = 'gold' | 'silver' | 'bronze';

const getRankMedal = (ranking: number): RankMedal | undefined => {
  if (ranking === 1) return 'gold';
  if (ranking === 2) return 'silver';
  if (ranking === 3) return 'bronze';
};

const RankMark = ({ rank }: { rank: number }) => {
  const medal = getRankMedal(rank);

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

export const RankingRow = ({
  ranking,
  variant = 'default',
}: RankingRowProps) => {
  const isMine = variant === 'mine';

  return (
    <View style={[styles.row, isMine && styles.myRow]}>
      <RankMark rank={ranking.ranking} />
      <Avatar
        badgeIcon={ranking.badgeIcon ?? undefined}
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

const styles = StyleSheet.create({
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
