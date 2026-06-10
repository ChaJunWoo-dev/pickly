import { AppText, Card } from '@/components';
import { theme } from '@/constants/theme';
import { useThemeMode } from '@/contexts/theme-mode';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import {
  formatPointTransactionCreatedAt,
  type PointTransaction,
} from '../utils/point-transactions';

type PointTransactionSectionProps = {
  onPressViewAll?: () => void;
  showViewAll?: boolean;
  transactions: PointTransaction[];
};

export const PointTransactionSection = ({
  onPressViewAll,
  showViewAll = true,
  transactions,
}: PointTransactionSectionProps) => {
  const { appTheme } = useThemeMode();

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <AppText variant="bodySmall" weight="bold">
          포인트 내역
        </AppText>
        {showViewAll ? (
          <Pressable
            accessibilityRole="button"
            hitSlop={8}
            onPress={onPressViewAll}
            style={styles.viewAll}
          >
            <AppText tone="muted" variant="caption" weight="semibold">
              전체보기
            </AppText>
            <Ionicons
              color={appTheme.colors.textMuted}
              name="chevron-forward"
              size={14}
            />
          </Pressable>
        ) : null}
      </View>

      <View>
        {transactions.map((transaction, index) => {
          const isPositive = transaction.amount > 0;

          return (
            <View
              key={transaction.id}
              style={[
                styles.row,
                index > 0 && {
                  borderTopColor: appTheme.colors.border,
                  borderTopWidth: 1,
                },
              ]}
            >
              <AppText
                style={styles.title}
                variant="bodySmall"
                weight="semibold"
              >
                {transaction.description}
              </AppText>
              <AppText
                tone={isPositive ? 'success' : 'danger'}
                variant="bodySmall"
                weight="bold"
              >
                {isPositive ? '+' : ''}
                {transaction.amount.toLocaleString()}P
              </AppText>
              <AppText tone="muted" variant="caption">
                {formatPointTransactionCreatedAt(transaction.createdAt)}
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
  title: {
    flex: 1,
  },
});
