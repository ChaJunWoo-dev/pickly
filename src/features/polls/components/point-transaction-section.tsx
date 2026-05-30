import { AppText, Card } from '@/components';
import { theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

const transactions = [
  { id: 'vote', title: '투표 참여 보상', amount: '+1P', time: '오늘 09:41' },
  { id: 'bonus', title: '인기 투표 보너스', amount: '+2P', time: '오늘 09:30' },
  { id: 'shop', title: '닉네임 컬러 구매', amount: '-500P', time: '어제 18:22' },
];

export const PointTransactionSection = () => {
  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <AppText variant="bodySmall" weight="bold">
          포인트 내역
        </AppText>
        <View style={styles.viewAll}>
          <AppText tone="muted" variant="caption" weight="semibold">
            전체보기
          </AppText>
          <Ionicons
            color={theme.colors.textMuted}
            name="chevron-forward"
            size={14}
          />
        </View>
      </View>

      <View>
        {transactions.map((item, index) => {
          const isPositive = item.amount.startsWith('+');

          return (
            <View
              key={item.id}
              style={[styles.row, index > 0 && styles.rowBorder]}
            >
              <AppText style={styles.title} variant="bodySmall" weight="semibold">
                {item.title}
              </AppText>
              <AppText
                tone={isPositive ? 'success' : 'danger'}
                variant="bodySmall"
                weight="bold"
              >
                {item.amount}
              </AppText>
              <AppText tone="muted" variant="caption">
                {item.time}
              </AppText>
            </View>
          );
        })}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    gap: theme.spacing.md,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  viewAll: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.xxs,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.md,
    minHeight: 44,
  },
  rowBorder: {
    borderTopColor: theme.colors.border,
    borderTopWidth: 1,
  },
  title: {
    flex: 1,
  },
});
