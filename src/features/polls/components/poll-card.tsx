import { AppText, Card } from '@/components';
import { theme } from '@/constants/theme';
import { Pressable, StyleSheet, View } from 'react-native';
import type { PollCategoryId } from '../data/poll-categories';
import { PollCategoryPill } from './poll-category-pill';
import { PollOptionList } from './poll-option-list';
import { PollTimer } from './poll-timer';

export type PollOptionPreview = {
  id: string;
  label: string;
  percent: number;
  imageUrl?: string;
};

export type PollCardData = {
  id: string;
  categoryId: PollCategoryId;
  question: string;
  options: PollOptionPreview[];
  rewardPoints: number;
  participantCount: number;
  timeLeft: string;
  timeLeftSeconds: number;
  hasVoted?: boolean;
};

type PollCardProps = {
  poll: PollCardData;
  onOpen?: (pollId: string) => void;
  onVote?: (pollId: string, optionId: string) => void;
};

export const PollCard = ({ poll, onOpen, onVote }: PollCardProps) => {
  return (
    <Card elevated style={styles.card}>
      <View style={styles.header}>
        <PollCategoryPill categoryId={poll.categoryId} />
        <PollTimer
          timeLeft={poll.timeLeft}
          timeLeftSeconds={poll.timeLeftSeconds}
        />
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={() => onOpen?.(poll.id)}
        style={({ pressed }) => [
          styles.titleBlock,
          pressed && styles.titleBlockPressed,
        ]}
      >
        <AppText style={styles.question} variant="subtitle" weight="bold">
          {poll.question}
        </AppText>

        <View style={styles.questionMeta}>
          <AppText tone="muted" variant="caption" weight="semibold">
            {poll.participantCount.toLocaleString()}명 참여
          </AppText>

          <View style={styles.rewardPill}>
            <AppText tone="reward" variant="caption" weight="bold">
              +{poll.rewardPoints}P
            </AppText>
          </View>
        </View>
      </Pressable>

      <PollOptionList
        onVote={onVote}
        options={poll.options}
        pollId={poll.id}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    gap: theme.spacing.lg,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rewardPill: {
    backgroundColor: theme.colors.rewardSoft,
    borderRadius: theme.radius.full,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  titleBlock: {
    gap: theme.spacing.sm,
  },
  titleBlockPressed: {
    opacity: 0.78,
  },
  question: {
    color: theme.colors.text,
  },
  questionMeta: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
