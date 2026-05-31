import { AppText, Card } from '@/components';
import { theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import {
  pollCategories,
  type PollCategoryId,
} from '../constants/config/poll-categories';

type PollCategorySelectorProps = {
  selectedCategoryId: PollCategoryId | null;
  onSelectCategory: (categoryId: PollCategoryId) => void;
};

export const PollCategorySelector = ({
  selectedCategoryId,
  onSelectCategory,
}: PollCategorySelectorProps) => {
  return (
    <View style={styles.field}>
      <AppText variant="body" weight="semibold">
        카테고리
      </AppText>
      <Card style={styles.categoryCard}>
        {Object.values(pollCategories).map((category) => {
          const isSelected = selectedCategoryId === category.id;

          return (
            <Pressable
              key={category.id}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              onPress={() => onSelectCategory(category.id)}
              style={[
                styles.categoryItem,
                isSelected && styles.selectedCategoryItem,
              ]}
            >
              <View
                style={[
                  styles.categoryIcon,
                  { backgroundColor: category.backgroundColor },
                ]}
              >
                <Ionicons
                  color={category.color}
                  name={category.icon}
                  size={22}
                />
              </View>

              <AppText
                align="center"
                variant="bodySmall"
                weight={isSelected ? 'bold' : 'semibold'}
              >
                {category.label}
              </AppText>
            </Pressable>
          );
        })}
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
    position: 'relative',
    width: 70,
  },
  selectedCategoryItem: {
    backgroundColor: theme.colors.primarySoft,
    borderColor: theme.colors.primaryStrong,
    borderWidth: 1.5,
  },
  categoryIcon: {
    alignItems: 'center',
    borderRadius: theme.radius.full,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
});
