import { supabase } from '@/lib/supabase';
import { mapRewardBadgeRow } from '../utils/reward-badge';

export const getRewardBadges = async () => {
  const { data, error } = await supabase
    .from('reward_badges')
    .select('id,label,icon,created_at')
    .order('created_at', { ascending: true });

  if (error) throw error;

  return (data ?? []).map(mapRewardBadgeRow);
};
