import { ensureGuestSession } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import {
  mapVoteRowToParticipatedPoll,
  type ParticipatedPoll,
  type ParticipationVoteRow,
} from '../utils/participation-history';

export const getParticipationHistory = async (): Promise<ParticipatedPoll[]> => {
  const user = await ensureGuestSession();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from('poll_votes')
    .select(
      `
      id,
      option_id,
      created_at,
      polls (
        id,
        title,
        category,
        reward_points,
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
    .order('expires_at', {
      referencedTable: 'polls',
      ascending: true,
    });

  if (error) {
    throw error;
  }

  return ((data ?? []) as ParticipationVoteRow[])
    .map((vote) => mapVoteRowToParticipatedPoll(vote, user.id))
    .filter((poll): poll is ParticipatedPoll => Boolean(poll));
};
