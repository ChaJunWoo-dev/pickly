import { getPollCategory } from '@/features/polls/constants/config/poll-categories';
import {
  getPollTimeLeft,
  isPollExpired,
} from '@/features/polls/utils/poll-deadline';
import {
  mapPollFeedRowToCardData,
  type PollFeedRow,
} from '@/features/polls/utils/poll-mappers';

export const participationTabs = [
  { id: 'all', label: '전체' },
  { id: 'active', label: '진행중' },
  { id: 'closed', label: '마감' },
] as const;

export type ParticipationTabId = (typeof participationTabs)[number]['id'];
export type ParticipationStatus = '진행중' | '마감';

export type ParticipationVoteRow = {
  id: string;
  option_id: string;
  created_at: string;
  polls: PollFeedRow | PollFeedRow[] | null;
};

export type ParticipatedPoll = {
  id: string;
  category: string;
  question: string;
  selectedOption: string;
  leadingOption: string;
  leadingPercent: number;
  participants: number;
  reward: string;
  status: ParticipationStatus;
  time: string;
  expiresAt: string;
};

const getPollRow = (polls: ParticipationVoteRow['polls']) => {
  return Array.isArray(polls) ? polls[0] : polls;
};

export const mapVoteRowToParticipatedPoll = (
  vote: ParticipationVoteRow,
  userId: string
): ParticipatedPoll | null => {
  const pollRow = getPollRow(vote.polls);

  if (!pollRow) {
    return null;
  }

  const poll = mapPollFeedRowToCardData(pollRow, userId);
  const selectedOption =
    poll.options.find((option) => option.id === vote.option_id)?.label ??
    '선택지 없음';
  const leadingOption = [...poll.options].sort(
    (a, b) => b.percent - a.percent
  )[0];
  const isClosed = poll.isClosed || isPollExpired(poll.expiresAt);

  return {
    id: poll.id,
    category: getPollCategory(poll.categoryId).label,
    question: poll.question,
    selectedOption,
    leadingOption: leadingOption?.label ?? '집계 전',
    leadingPercent: leadingOption?.percent ?? 0,
    participants: poll.participantCount,
    reward: `+${poll.rewardPoints}P`,
    status: isClosed ? '마감' : '진행중',
    time: isClosed ? '마감' : `${getPollTimeLeft(poll.expiresAt).timeLeft} 남음`,
    expiresAt: poll.expiresAt,
  };
};

const getDeadlineTime = (poll: ParticipatedPoll) => {
  return new Date(poll.expiresAt).getTime();
};

const sortParticipatedPolls = (polls: ParticipatedPoll[]) => {
  return [...polls].sort((a, b) => {
    if (a.status !== b.status) {
      return a.status === '진행중' ? -1 : 1;
    }

    if (a.status === '마감') {
      return getDeadlineTime(b) - getDeadlineTime(a);
    }

    return getDeadlineTime(a) - getDeadlineTime(b);
  });
};

export const getVisibleParticipatedPolls = (
  polls: ParticipatedPoll[],
  tabId: ParticipationTabId
) => {
  if (tabId === 'all') {
    return sortParticipatedPolls(polls);
  }

  const visiblePolls = polls.filter((poll) => {
    return tabId === 'active' ? poll.status === '진행중' : poll.status === '마감';
  });

  return sortParticipatedPolls(visiblePolls);
};

export const getTotalParticipationReward = (polls: ParticipatedPoll[]) => {
  return polls.reduce((sum, poll) => {
    return sum + Number(poll.reward.replace(/[+P]/g, ''));
  }, 0);
};
