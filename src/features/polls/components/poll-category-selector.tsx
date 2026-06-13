import { AppText, Card } from '@/components';
import { theme } from '@/constants/theme';
import { useThemeMode } from '@/contexts/theme-mode';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import {
  pollCategories,
  type PollCategoryId,
} from '../constants/config/poll-categories';

type PollCategorySelectorProps = {
  selectedCategoryId: PollCategoryId;
  onSelectCategory: (categoryId: PollCategoryId) => void;
};

export const PollCategorySelector = ({
  selectedCategoryId,
  onSelectCategory,
}: PollCategorySelectorProps) => {
  const { appTheme } = useThemeMode();
  const [isExpanded, setIsExpanded] = useState(false);
  const visibleCategories = isExpanded
    ? Object.values(pollCategories)
    : Object.values(pollCategories).slice(0, 4);

  return (
    <View style={styles.field}>
      <AppText variant="body" weight="semibold">
        카테고리
      </AppText>
      <Card style={styles.categoryCard}>
        {Object.values(visibleCategories).map((category) => {
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
                isSelected && {
                  backgroundColor: appTheme.colors.primary,
                  borderColor: appTheme.colors.primaryStrong,
                },
              ]}
            >
              <View
                style={[
                  styles.categoryIcon,
                  {
                    backgroundColor: isSelected
                      ? appTheme.colors.surface
                      : category.backgroundColor,
                  },
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
                style={isSelected && { color: appTheme.colors.inverseText }}
                variant="bodySmall"
                weight={isSelected ? 'bold' : 'semibold'}
              >
                {category.label}
              </AppText>
            </Pressable>
          );
        })}

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={isExpanded ? '카테고리 접기' : '카테고리 펼치기'}
          onPress={() => setIsExpanded((prev) => !prev)}
          style={styles.expandButton}
        >
          <Ionicons
            color={theme.colors.textMuted}
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={20}
          />
        </Pressable>
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
    borderWidth: 1.5,
  },
  categoryIcon: {
    alignItems: 'center',
    borderRadius: theme.radius.full,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  expandButton: {
    alignItems: 'center',
    justifyContent: 'center',
    left: 5,
  },
});
