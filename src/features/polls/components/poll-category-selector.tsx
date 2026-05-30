import { AppText, Card } from '@/components';
import { theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import { pollCategories } from '../data/poll-categories';

export const PollCategorySelector = () => {
  return (
    <View style={styles.field}>
      <AppText variant="body" weight="semibold">
        카테고리
      </AppText>
      <Card style={styles.categoryCard}>
        {Object.values(pollCategories).map((category) => (
          <Pressable key={category.id} style={styles.categoryItem}>
            <View>
              <Ionicons color={category.color} name={category.icon} size={24} />
            </View>

            <AppText
              align="center"
              tone="muted"
              variant="bodySmall"
              weight="semibold"
            >
              {category.label}
            </AppText>
          </Pressable>
        ))}
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  field: {
    gap: theme.spacing.md,
  },
  categoryCard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  categoryItem: {
    alignItems: 'center',
    borderColor: theme.colors.borderStrong,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    gap: theme.spacing.xs,
    height: 70,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xs,
    width: 70,
  },
});
