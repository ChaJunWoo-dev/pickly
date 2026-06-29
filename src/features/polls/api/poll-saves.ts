import { ensureGuestSession } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import type { PollCardData } from '../components/poll-card';
import {
  mapPollFeedRowToCardData,
  type PollFeedRow,
} from '../utils/poll-mappers';

export const getIsPollSaved = async (pollId: string) => {
  const user = await ensureGuestSession();

  if (!user) {
    return false;
  }

  const { data, error } = await supabase
    .from('poll_saves')
    .select('id')
    .eq('poll_id', pollId)
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return Boolean(data);
};

export const savePoll = async (pollId: string) => {
  const user = await ensureGuestSession();

  if (!user) {
    throw new Error('Guest session is missing.');
  }

  const { error } = await supabase.from('poll_saves').insert({
    user_id: user.id,
    poll_id: pollId,
  });

  if (error) {
    throw error;
  }
};

export const unsavePoll = async (pollId: string) => {
  const user = await ensureGuestSession();

  if (!user) {
    throw new Error('Guest session is missing.');
  }

  const { error } = await supabase
    .from('poll_saves')
    .delete()
    .eq('user_id', user.id)
    .eq('poll_id', pollId);

  if (error) {
    throw error;
  }
};

export const togglePollSave = async (pollId: string, isSaved: boolean) => {
  if (isSaved) {
    await unsavePoll(pollId);
    return false;
  }

  await savePoll(pollId);
  return true;
};

type SavedPollRow = {
  id: string;
  created_at: string;
  polls: PollFeedRow | PollFeedRow[] | null;
};

const getPollRow = (polls: SavedPollRow['polls']) => {
  return Array.isArray(polls) ? polls[0] : polls;
};

export const getSavedPolls = async (): Promise<PollCardData[]> => {
  const user = await ensureGuestSession();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from('poll_saves')
    .select(
      `
      id,
      created_at,
      polls (
        id,
        title,
        category,
        reward_points,
        created_at,
        expires_at,
        is_closed,
        poll_options (
          id,
          label,
          image_url,
          sort_order
        ),
        poll_votes (
          id,
          option_id,
          user_id
        )
      )
    `
    )
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return ((data ?? []) as SavedPollRow[])
    .map((save) => {
      const poll = getPollRow(save.polls);

      if (!poll) {
        return null;
      }

      return mapPollFeedRowToCardData(poll, user.id);
    })
    .filter((poll): poll is PollCardData => Boolean(poll));
};
