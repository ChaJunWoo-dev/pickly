import { ensureGuestSession } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import type { PollCardData } from '../components/poll-card';
import {
  mapPollFeedRowToCardData,
  type PollFeedRow,
} from '../utils/poll-mappers';
import { POLL_WITH_OPTIONS_AND_VOTES_SELECT } from './poll-select-query';

export const getPollDetail = async (
  pollId: string
): Promise<PollCardData> => {
  const user = await ensureGuestSession();

  const { data, error } = await supabase
    .from('polls')
    .select(POLL_WITH_OPTIONS_AND_VOTES_SELECT)
    .eq('id', pollId)
    .single();

  if (error) {
    throw error;
  }

  return mapPollFeedRowToCardData(data as PollFeedRow, user?.id);
};
