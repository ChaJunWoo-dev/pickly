import { AppText, Avatar } from '@/components';
import { theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

const rankings = [
  { rank: 1, name: '피클 마스터', points: '2,340P', medal: 'gold' },
  { rank: 2, name: '투표 천재', points: '1,980P', medal: 'silver' },
  { rank: 3, name: '익명 고수', points: '1,760P', medal: 'bronze' },
  { rank: 4, name: '참여왕', points: '1,540P' },
];

export const RankingList = () => {
  return (
    <View style={styles.section}>
      <View style={styles.tabs}>
        <View style={[styles.tab, styles.tabActive]}>
          <AppText variant="bodySmall" weight="bold">
            주간 랭킹
          </AppText>
        </View>
        <View style={styles.tab}>
          <AppText tone="muted" variant="bodySmall" weight="bold">
            전체 랭킹
          </AppText>
        </View>
      </View>

      <View style={styles.list}>
        {rankings.map((item) => (
          <View key={item.rank} style={styles.row}>
            <RankMark medal={item.medal} rank={item.rank} />
            <Avatar name={item.name} size="sm" />
            <AppText style={styles.name} variant="bodySmall" weight="semibold">
              {item.name}
            </AppText>
            <AppText variant="bodySmall" weight="bold">
              {item.points}
            </AppText>
          </View>
        ))}

        <View style={[styles.row, styles.myRow]}>
          <AppText tone="success" variant="bodySmall" weight="bold">
            12
          </AppText>
          <Avatar name="나의 순위" size="sm" />
          <AppText
            style={styles.name}
            tone="success"
            variant="bodySmall"
            weight="bold"
          >
            나의 순위
          </AppText>
          <AppText tone="success" variant="bodySmall" weight="bold">
            1,240P
          </AppText>
        </View>
      </View>
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
  tabs: {
    borderBottomColor: theme.colors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
  },
  tab: {
    alignItems: 'center',
    flex: 1,
    paddingBottom: theme.spacing.md,
  },
  tabActive: {
    borderBottomColor: theme.colors.primaryStrong,
    borderBottomWidth: 2,
  },
  list: {
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
