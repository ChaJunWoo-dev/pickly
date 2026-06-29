import { theme } from '@/constants/theme';
import { StyleSheet, View } from 'react-native';
import { PollCompactOptionItem } from './poll-compact-option-item';
import type { PollOptionPreview } from './poll-card';
import { PollLargeImageOptionItem } from './poll-large-image-option-item';

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
      style={[styles.options, useLargeImageOptions && styles.imageOptionGrid]}
    >
      {options.map((option) => (
        useLargeImageOptions ? (
          <PollLargeImageOptionItem
            key={option.id}
            disabled={disabled}
            option={option}
            pollId={pollId}
            selectedOptionId={selectedOptionId}
            showResults={showResults}
            onVote={onVote}
          />
        ) : (
          <PollCompactOptionItem
            key={option.id}
            disabled={disabled}
            option={option}
            pollId={pollId}
            selectedOptionId={selectedOptionId}
            showResults={showResults}
            onVote={onVote}
          />
        )
      ))}
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
});
