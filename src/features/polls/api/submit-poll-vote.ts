import { ensureGuestSession } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export const submitPollVote = async (pollId: string, optionId: string) => {
  const user = await ensureGuestSession();

  if (!user) {
    throw new Error('Guest session is missing.');
  }

  const { error } = await supabase.rpc('submit_poll_vote', {
    p_poll_id: pollId,
    p_option_id: optionId,
  });

  if (error) {
    throw error;
  }
};
