import { supabase } from '@/lib/supabase';
import { ensureGuestSession } from '../../../lib/auth';

export type UserRanking = {
  userId: string;
  points: number;
  ranking: number;
};

export type RankingRow = {
  user_id: string;
  points: number;
  ranking: number;
};

const mapRankingRow = (row: RankingRow): UserRanking => {
  return {
    userId: row.user_id,
    points: row.points,
    ranking: row.ranking,
  };
};

export const getAllTimeRankings = async (): Promise<UserRanking[]> => {
  const { data, error } = await supabase
    .from('user_point_rankings')
    .select(
      `
      user_id,
      points,
      ranking
    `
    )
    .order('ranking', { ascending: true });

  if (error) {
    throw error;
  }

  return ((data ?? []) as RankingRow[]).map(mapRankingRow);
};

export const getWeeklyRankings = async (): Promise<UserRanking[]> => {
  const { data, error } = await supabase
    .from('weekly_user_point_rankings')
    .select(
      `user_id,
      points,
      ranking`
    )
    .order('ranking', { ascending: false });

  if (error) {
    throw error;
  }

  return ((data ?? []) as RankingRow[]).map(mapRankingRow);
};

export const getMyRanking = async (): Promise<UserRanking | null> => {
  const user = await ensureGuestSession();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from('user_point_rankings')
    .select(
      `user_id,
      points,
      ranking`
    )
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
