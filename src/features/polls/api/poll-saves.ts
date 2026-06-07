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
