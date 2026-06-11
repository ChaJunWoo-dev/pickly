import { AppText, Card } from '@/components';
import { theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

const rewards = [
  { id: 'nickname', title: '닉네임 변경권', price: '500P', icon: 'text' },
  { id: 'badge', title: '전용 배지', price: '800P', icon: 'shield-checkmark' },
  { id: 'booster', title: '투표 부스터', price: '1,200P', icon: 'flash' },
];

export const RewardShopSection = () => {
  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <AppText variant="bodySmall" weight="bold">
          리워드 상점
        </AppText>
      </View>

      <View style={styles.items}>
        {rewards.map((item) => (
          <View key={item.id} style={styles.item}>
            <Ionicons
              color={
                item.id === 'badge'
                  ? theme.colors.secondary
                  : theme.colors.reward
              }
              name={item.icon as keyof typeof Ionicons.glyphMap}
              size={42}
            />
            <AppText align="center" variant="caption" weight="bold">
              {item.title}
            </AppText>
            <AppText align="center" variant="bodySmall" weight="bold">
              {item.price}
            </AppText>
          </View>
        ))}
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
  viewAll: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.xxs,
  },
  items: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  item: {
    alignItems: 'center',
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    flex: 1,
    gap: theme.spacing.sm,
    minHeight: 132,
    justifyContent: 'center',
    padding: theme.spacing.sm,
  },
});
