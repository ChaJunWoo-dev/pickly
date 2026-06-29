import { AppText } from '@/components';
import { theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import type { PollOptionPreview } from './poll-card';

type PollDetailOptionListProps = {
  disabled: boolean;
  isVoting: boolean;
  onVote: (optionId: string) => void;
  options: PollOptionPreview[];
  selectedOptionId: string | null;
};

export const PollDetailOptionList = ({
  disabled,
  isVoting,
  onVote,
  options,
  selectedOptionId,
}: PollDetailOptionListProps) => {
  return (
    <View style={styles.voteOptions}>
      {options.slice(0, 2).map((option) => {
        const isSelected = option.id === selectedOptionId;

        return (
          <Pressable
            key={option.id}
            accessibilityRole="button"
            accessibilityState={{ disabled: disabled || isVoting }}
            disabled={disabled || isVoting}
            onPress={() => onVote(option.id)}
            style={[
              styles.voteOption,
              isSelected && styles.voteOptionActive,
              (disabled || isVoting) && styles.voteOptionDisabled,
            ]}
          >
            <View
              style={[
                styles.checkCircle,
                isSelected && styles.checkCircleActive,
              ]}
            >
              {isSelected ? (
                <Ionicons
                  color={theme.colors.inverseText}
                  name="checkmark"
                  size={14}
                />
              ) : null}
            </View>

            <AppText variant="bodySmall" weight="semibold">
              {option.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  voteOptions: {
    gap: theme.spacing.sm,
  },
  voteOption: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    flexDirection: 'row',
    gap: theme.spacing.sm,
    minHeight: 52,
    paddingHorizontal: theme.spacing.lg,
  },
  voteOptionActive: {
    backgroundColor: theme.colors.primarySoft,
    borderColor: theme.colors.primaryStrong,
  },
  voteOptionDisabled: {
    opacity: 0.55,
  },
  checkCircle: {
    alignItems: 'center',
    borderColor: theme.colors.borderStrong,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    height: 22,
    justifyContent: 'center',
    width: 22,
  },
  checkCircleActive: {
    backgroundColor: theme.colors.primaryStrong,
    borderColor: theme.colors.primaryStrong,
  },
});
