import { supabase } from '@/lib/supabase';
import { mapRewardItemRow, RewardItemRow } from '../utils/reward-items';

export const getRewardItems = async () => {
  const { data, error } = await supabase
    .from('reward_items')
    .select(`*`)
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) throw error;

  return ((data ?? []) as RewardItemRow[]).map(mapRewardItemRow);
};
