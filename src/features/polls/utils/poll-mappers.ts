import type { PollCardData } from '../components/poll-card';
import type { PollCategoryId } from '../constants/config/poll-categories';

type PollOptionRow = {
  id: string;
  label: string;
  image_url: string | null;
  sort_order: number;
};

type PollVoteRow = {
  id: string;
  option_id: string;
};

export type PollFeedRow = {
  id: string;
  title: string;
  category: PollCategoryId;
  reward_points: number;
  expires_at: string;
  poll_options: PollOptionRow[];
  poll_votes: PollVoteRow[];
};

export const mapPollFeedRowToCardData = (poll: PollFeedRow): PollCardData => {
  const participantCount = poll.poll_votes.length;

  return {
    id: poll.id,
    categoryId: poll.category,
    question: poll.title,
    rewardPoints: poll.reward_points,
    participantCount,
    expiresAt: poll.expires_at,
    options: [...poll.poll_options]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((option) => {
        const voteCount = poll.poll_votes.filter(
          (vote) => vote.option_id === option.id
        ).length;

        return {
          id: option.id,
          label: option.label,
          imageUrl: option.image_url ?? undefined,
          percent:
            participantCount === 0
              ? 0
              : Math.round((voteCount / participantCount) * 100),
        };
      }),
  };
};
