import { AppText } from '@/components';
import { theme } from '@/constants/theme';
import { useThemeMode } from '@/contexts/theme-mode';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet } from 'react-native';
import type { RewardItem } from '../utils/reward-items';

type RewardShopItemProps = {
  item: RewardItem;
  isUnavailable: boolean;
  onPress: (item: RewardItem) => void;
};

export const RewardShopItem = ({
  item,
  isUnavailable,
  onPress,
}: RewardShopItemProps) => {
  const { appTheme } = useThemeMode();
  const iconColor = isUnavailable
    ? appTheme.colors.textSubtle
    : item.type === 'random_badge'
      ? appTheme.colors.secondary
      : appTheme.colors.reward;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onPress(item)}
      style={({ pressed }) => [
        styles.item,
        {
          backgroundColor: isUnavailable
            ? appTheme.colors.surfaceMuted
            : appTheme.colors.surface,
          borderColor: appTheme.colors.border,
        },
        isUnavailable && styles.itemUnavailable,
        pressed && styles.itemPressed,
      ]}
    >
      <Ionicons
        color={iconColor}
        name={item.icon as keyof typeof Ionicons.glyphMap}
        size={42}
      />
      <AppText
        align="center"
        tone={isUnavailable ? 'subtle' : 'primary'}
        variant="caption"
        weight="bold"
      >
        {item.title}
      </AppText>
      <AppText
        align="center"
        tone={isUnavailable ? 'subtle' : 'primary'}
        variant="bodySmall"
        weight="bold"
      >
        {item.price.toLocaleString()}P
      </AppText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  item: {
    alignItems: 'center',
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    flex: 1,
    gap: theme.spacing.sm,
    minHeight: 132,
    justifyContent: 'center',
    padding: theme.spacing.sm,
  },
  itemUnavailable: {
    opacity: 0.58,
  },
  itemPressed: {
    opacity: 0.7,
  },
});
