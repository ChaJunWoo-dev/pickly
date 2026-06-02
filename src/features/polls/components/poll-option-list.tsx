import { AppText } from '@/components';
import { theme } from '@/constants/theme';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import type { PollOptionPreview } from './poll-card';

type PollOptionListProps = {
  pollId: string;
  options: PollOptionPreview[];
  disabled?: boolean;
  selectedOptionId?: string;
  showResults?: boolean;
  onVote?: (pollId: string, optionId: string) => void;
};

export const PollOptionList = ({
  disabled = false,
  pollId,
  options,
  selectedOptionId,
  showResults = false,
  onVote,
}: PollOptionListProps) => {
  const hasImageOptions = options.some((option) => option.imageUrl);
  const useLargeImageOptions = hasImageOptions && options.length === 2;

  return (
    <View
      style={[
        styles.options,
        useLargeImageOptions && styles.imageOptionGrid,
      ]}
    >
      {options.map((option) =>
        useLargeImageOptions ? (
          <Pressable
            key={option.id}
            accessibilityRole="button"
            accessibilityState={{ disabled }}
            disabled={disabled}
            onPress={() => onVote?.(pollId, option.id)}
            style={({ pressed }) => [
              styles.imageOption,
              disabled && styles.optionDisabled,
              pressed && styles.optionPressed,
            ]}
          >
            <View
              style={[
                styles.radio,
                option.id === selectedOptionId && styles.radioSelected,
              ]}
            />
            {option.imageUrl ? (
              <Image
                resizeMode="contain"
                source={{ uri: option.imageUrl }}
                style={styles.imageOptionImage}
              />
            ) : null}
            <AppText align="center" variant="bodySmall" weight="bold">
              {option.label}
            </AppText>
          </Pressable>
        ) : (
          <Pressable
            key={option.id}
            accessibilityRole="button"
            accessibilityState={{ disabled }}
            disabled={disabled}
            onPress={() => onVote?.(pollId, option.id)}
            style={({ pressed }) => [
              styles.option,
              disabled && styles.optionDisabled,
              pressed && styles.optionPressed,
            ]}
          >
            {option.imageUrl ? (
              <Image
                resizeMode="cover"
                source={{ uri: option.imageUrl }}
                style={styles.optionThumbnail}
              />
            ) : null}
            <View style={styles.optionBody}>
              {showResults ? (
                <View
                  style={[styles.optionFill, { width: `${option.percent}%` }]}
                />
              ) : null}
              <View style={styles.optionContent}>
                <View style={styles.optionLabel}>
                  {!showResults ? (
                    <View
                      style={[
                        styles.inlineRadio,
                        option.id === selectedOptionId &&
                          styles.radioSelected,
                      ]}
                    />
                  ) : null}
                  <AppText variant="bodySmall" weight="semibold">
                    {option.label}
                  </AppText>
                </View>
                {showResults ? (
                  <AppText tone="muted" variant="caption" weight="semibold">
                    {option.percent}%
                  </AppText>
                ) : null}
              </View>
            </View>
          </Pressable>
        ),
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  options: {
    gap: theme.spacing.sm,
  },
  imageOptionGrid: {
    flexDirection: 'row',
  },
  option: {
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radius.sm,
    flexDirection: 'row',
    gap: theme.spacing.sm,
    minHeight: 46,
    overflow: 'hidden',
  },
  optionPressed: {
    opacity: 0.78,
  },
  optionDisabled: {
    opacity: 0.55,
  },
  optionFill: {
    backgroundColor: theme.colors.primarySoft,
    bottom: 0,
    left: 0,
    position: 'absolute',
    top: 0,
  },
  optionBody: {
    flex: 1,
    minHeight: 46,
    overflow: 'hidden',
  },
  optionContent: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 46,
    paddingHorizontal: theme.spacing.md,
  },
  optionLabel: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  optionThumbnail: {
    borderRadius: theme.radius.xs,
    height: 44,
    marginLeft: theme.spacing.xs,
    width: 44,
  },
  imageOption: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    flex: 1,
    gap: theme.spacing.xs,
    minHeight: 120,
    padding: theme.spacing.sm,
  },
  imageOptionImage: {
    height: 70,
    width: '100%',
  },
  radio: {
    borderColor: theme.colors.borderStrong,
    borderRadius: theme.radius.full,
    borderWidth: 2,
    height: 18,
    left: theme.spacing.sm,
    position: 'absolute',
    top: theme.spacing.sm,
    width: 18,
  },
  inlineRadio: {
    borderColor: theme.colors.borderStrong,
    borderRadius: theme.radius.full,
    borderWidth: 2,
    height: 18,
    width: 18,
  },
  radioSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
});
