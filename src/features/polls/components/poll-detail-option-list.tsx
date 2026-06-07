import { AppText } from '@/components';
import { theme } from '@/constants/theme';
import { useThemeMode } from '@/contexts/theme-mode';
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
  const { appTheme } = useThemeMode();

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
              {
                backgroundColor: appTheme.colors.surface,
                borderColor: appTheme.colors.border,
              },
              isSelected && {
                backgroundColor: appTheme.colors.primarySoft,
                borderColor: appTheme.colors.primaryStrong,
              },
              (disabled || isVoting) && styles.voteOptionDisabled,
            ]}
          >
            <View
              style={[
                styles.checkCircle,
                { borderColor: appTheme.colors.borderStrong },
                isSelected && {
                  backgroundColor: appTheme.colors.primaryStrong,
                  borderColor: appTheme.colors.primaryStrong,
                },
              ]}
            >
              {isSelected ? (
                <Ionicons
                  color={appTheme.colors.inverseText}
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
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    flexDirection: 'row',
    gap: theme.spacing.sm,
    minHeight: 52,
    paddingHorizontal: theme.spacing.lg,
  },
  voteOptionDisabled: {
    opacity: 0.55,
  },
  checkCircle: {
    alignItems: 'center',
    borderRadius: theme.radius.full,
    borderWidth: 1,
    height: 22,
    justifyContent: 'center',
    width: 22,
  },
});
