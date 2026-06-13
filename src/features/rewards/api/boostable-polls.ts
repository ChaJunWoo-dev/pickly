import { ensureGuestSession } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import {
  mapBoostablePollRow,
  type BoostablePoll,
  type BoostablePollRow,
} from '../utils/boostable-polls';

export const getBoostablePolls = async (): Promise<BoostablePoll[]> => {
  const user = await ensureGuestSession();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from('polls')
    .select('id,title,created_at,expires_at,boosted_until')
    .eq('user_id', user.id)
    .eq('is_closed', false)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: true });

  if (error) {
    throw error;
  }

  return ((data ?? []) as BoostablePollRow[]).map(mapBoostablePollRow);
};
