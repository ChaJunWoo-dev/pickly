import type { PollCardData } from '../components/poll-card';
import { mapPollFeedRowToCardData, type PollFeedRow } from './poll-mappers';

export type SavedPollRow = {
  id: string;
  created_at: string;
  polls: PollFeedRow | PollFeedRow[] | null;
};

const getPollRow = (polls: SavedPollRow['polls']) => {
  return Array.isArray(polls) ? polls[0] : polls;
};

export const mapSavedPollRowsToCardData = (
  saves: SavedPollRow[],
  userId: string
): PollCardData[] => {
  return saves
    .map((save) => {
      const poll = getPollRow(save.polls);

      if (!poll) {
        return null;
      }

      return mapPollFeedRowToCardData(poll, userId);
    })
    .filter((poll): poll is PollCardData => Boolean(poll));
};
