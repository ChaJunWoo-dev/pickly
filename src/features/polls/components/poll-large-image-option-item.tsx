import { AppText } from '@/components';
import { theme } from '@/constants/theme';
import { useThemeMode } from '@/contexts/theme-mode';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import type { PollOptionPreview } from './poll-card';

type PollLargeImageOptionItemProps = {
  disabled: boolean;
  option: PollOptionPreview;
  pollId: string;
  selectedOptionId?: string;
  showResults: boolean;
  onVote?: (pollId: string, optionId: string) => void;
};

export const PollLargeImageOptionItem = ({
  disabled,
  option,
  pollId,
  selectedOptionId,
  showResults,
  onVote,
}: PollLargeImageOptionItemProps) => {
  const { appTheme } = useThemeMode();
  const isSelected = option.id === selectedOptionId;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={() => onVote?.(pollId, option.id)}
      style={({ pressed }) => [
        styles.option,
        {
          backgroundColor: appTheme.colors.surface,
          borderColor: appTheme.colors.border,
        },
        disabled && !showResults && styles.optionDisabled,
        pressed && styles.optionPressed,
      ]}
    >
      <View
        style={[
          styles.radio,
          { borderColor: appTheme.colors.borderStrong },
          isSelected && {
            backgroundColor: appTheme.colors.primary,
            borderColor: appTheme.colors.primary,
          },
        ]}
      />
      {option.imageUrl ? (
        <Image
          resizeMode="contain"
          source={{ uri: option.imageUrl }}
          style={styles.image}
        />
      ) : null}
      <AppText align="center" variant="bodySmall" weight="bold">
        {option.label}
      </AppText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  option: {
    alignItems: 'center',
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    flex: 1,
    gap: theme.spacing.xs,
    minHeight: 120,
    padding: theme.spacing.sm,
  },
  optionPressed: {
    opacity: 0.78,
  },
  optionDisabled: {
    opacity: 0.55,
  },
  image: {
    height: 70,
    width: '100%',
  },
  radio: {
    borderRadius: theme.radius.full,
    borderWidth: 2,
    height: 18,
    left: theme.spacing.sm,
    position: 'absolute',
    top: theme.spacing.sm,
    width: 18,
  },
});
