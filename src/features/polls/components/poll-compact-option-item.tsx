import { AppText } from '@/components';
import { theme } from '@/constants/theme';
import { useThemeMode } from '@/contexts/theme-mode';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import type { PollOptionPreview } from './poll-card';

type PollCompactOptionItemProps = {
  disabled: boolean;
  option: PollOptionPreview;
  pollId: string;
  selectedOptionId?: string;
  showResults: boolean;
  onVote?: (pollId: string, optionId: string) => void;
};

export const PollCompactOptionItem = ({
  disabled,
  option,
  pollId,
  selectedOptionId,
  showResults,
  onVote,
}: PollCompactOptionItemProps) => {
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
        { backgroundColor: appTheme.colors.surfaceMuted },
        disabled && !showResults && styles.optionDisabled,
        pressed && styles.optionPressed,
      ]}
    >
      {option.imageUrl ? (
        <Image
          resizeMode="cover"
          source={{ uri: option.imageUrl }}
          style={styles.thumbnail}
        />
      ) : null}
      <View style={styles.body}>
        {showResults ? (
          <View
            style={[
              styles.fill,
              {
                backgroundColor: appTheme.colors.primarySoft,
                width: `${option.percent}%`,
              },
            ]}
          />
        ) : null}
        <View style={styles.content}>
          <View style={styles.label}>
            {!showResults ? (
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
  );
};

const styles = StyleSheet.create({
  option: {
    alignItems: 'center',
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
  body: {
    flex: 1,
    minHeight: 46,
    overflow: 'hidden',
  },
  content: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 46,
    paddingHorizontal: theme.spacing.md,
  },
  fill: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    top: 0,
  },
  label: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  radio: {
    borderRadius: theme.radius.full,
    borderWidth: 2,
    height: 18,
    width: 18,
  },
  thumbnail: {
    borderRadius: theme.radius.xs,
    height: 44,
    marginLeft: theme.spacing.xs,
    width: 44,
  },
});
