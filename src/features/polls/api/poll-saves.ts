import { ensureGuestSession } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

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
