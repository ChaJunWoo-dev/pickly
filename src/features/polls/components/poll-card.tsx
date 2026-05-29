import { AppText, Card } from '@/components';
import { theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import {
  getPollCategory,
  type PollCategoryId,
} from '../data/poll-categories';
import { PollOptionList } from './poll-option-list';

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
  onVote?: (pollId: string, optionId: string) => void;
};

export const PollCard = ({ poll, onVote }: PollCardProps) => {
  const category = getPollCategory(poll.categoryId);
  const isClosingSoon = poll.timeLeftSeconds <= 24 * 60 * 60;
  const timerColor = isClosingSoon
    ? theme.colors.danger
    : theme.colors.textMuted;

  return (
    <Card elevated style={styles.card}>
      <View style={styles.header}>
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

        <View style={styles.timer}>
          <Ionicons color={timerColor} name="time-outline" size={14} />
          <AppText
            style={{ color: timerColor }}
            variant="caption"
            weight="semibold"
          >
            {poll.timeLeft} 남음
          </AppText>
        </View>
      </View>

      <View style={styles.titleBlock}>
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
      </View>

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
  rewardPill: {
    backgroundColor: theme.colors.rewardSoft,
    borderRadius: theme.radius.full,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  titleBlock: {
    gap: theme.spacing.sm,
  },
  question: {
    color: theme.colors.text,
  },
  questionMeta: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.xxs,
  },
});
