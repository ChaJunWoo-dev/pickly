import { ensureGuestSession } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { RankingRow, UserRanking, mapRankingRow } from '../utils/ranking';

const RANKING_SELECT = `
  user_id,
  nickname,
  avatar_url,
  badge_icon,
  points,
  ranking
`;

export const getWeeklyRankings = async (): Promise<UserRanking[]> => {
  const { data, error } = await supabase
    .from('weekly_user_point_rankings')
    .select(RANKING_SELECT)
    .order('ranking', { ascending: true });

  if (error) {
    throw error;
  }

  return ((data ?? []) as RankingRow[]).map(mapRankingRow);
};

export const getMyWeeklyRanking = async (): Promise<UserRanking | null> => {
  const user = await ensureGuestSession();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from('weekly_user_point_rankings')
    .select(RANKING_SELECT)
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return mapRankingRow(data as RankingRow);
};
