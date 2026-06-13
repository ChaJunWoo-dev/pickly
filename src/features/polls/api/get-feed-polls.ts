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
  const now = Date.now();

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
  const sortedPollRows = [...pollRows].sort((a, b) => {
    const isABoosted = a.boosted_until
      ? new Date(a.boosted_until).getTime() > now
      : false;
    const isBBoosted = b.boosted_until
      ? new Date(b.boosted_until).getTime() > now
      : false;

    if (isABoosted !== isBBoosted) {
      return isABoosted ? -1 : 1;
    }

    if (activeFeedTab === 'popular') {
      return b.poll_votes.length - a.poll_votes.length;
    }

    if (activeFeedTab === 'closingSoon') {
      return (
        new Date(a.expires_at).getTime() - new Date(b.expires_at).getTime()
      );
    }

    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return sortedPollRows.map((poll) =>
    mapPollFeedRowToCardData(poll, user?.id)
  );
};
