import { AppText } from '@/components';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import {
  getPollCategory,
  type PollCategoryId,
} from '../constants/config/poll-categories';
import { theme } from '@/constants/theme';

type PollCategoryPillProps = {
  categoryId: PollCategoryId;
};

export const PollCategoryPill = ({ categoryId }: PollCategoryPillProps) => {
  const category = getPollCategory(categoryId);

  return (
    <View style={styles.category}>
      <View
        style={[
          styles.categoryIcon,
          { backgroundColor: category.backgroundColor },
        ]}
      >
        <Ionicons color={category.color} name={category.icon} size={16} />
      </View>

      <AppText variant="label" weight="semibold">
        {category.label}
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  category: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  categoryIcon: {
    alignItems: 'center',
    borderRadius: theme.radius.full,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
});
