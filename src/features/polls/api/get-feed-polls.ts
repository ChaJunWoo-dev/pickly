import { ensureGuestSession } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import type { PollCardData } from '../components/poll-card';
import type { FeedTab } from '../types/feed';
import {
  mapPollFeedRowToCardData,
  type PollFeedRow,
} from '../utils/poll-mappers';
import { POLL_WITH_OPTIONS_AND_VOTES_SELECT } from './poll-select-query';

export const getFeedPolls = async (
  activeFeedTab: FeedTab
): Promise<PollCardData[]> => {
  const user = await ensureGuestSession();

  const { data, error } = await supabase
    .from('polls')
    .select(POLL_WITH_OPTIONS_AND_VOTES_SELECT)
    .eq('is_closed', false)
    .gt('expires_at', new Date().toISOString())
    .order(activeFeedTab === 'closingSoon' ? 'expires_at' : 'created_at', {
      ascending: activeFeedTab === 'closingSoon',
    });

  if (error) {
    throw error;
  }

  const pollRows = (data ?? []) as PollFeedRow[];
  const sortedPollRows =
    activeFeedTab === 'popular'
      ? [...pollRows].sort((a, b) => b.poll_votes.length - a.poll_votes.length)
      : pollRows;

  return sortedPollRows.map((poll) =>
    mapPollFeedRowToCardData(poll, user?.id)
  );
};
