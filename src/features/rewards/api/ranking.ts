import { ensureGuestSession } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';

type BadgeIcon = keyof typeof Ionicons.glyphMap;

export type RankingRow = {
  user_id: string;
  nickname: string | null;
  avatar_url: string | null;
  badge_icon: BadgeIcon | null;
  points: number;
  ranking: number;
};

export type UserRanking = {
  userId: string;
  nickname: string;
  avatarUrl: string | null;
  badgeIcon: BadgeIcon | null;
  points: number;
  ranking: number;
};

const mapRankingRow = (row: RankingRow): UserRanking => {
  return {
    userId: row.user_id,
    nickname: row.nickname ?? '익명',
    avatarUrl: row.avatar_url,
    badgeIcon: row.badge_icon,
    points: row.points,
    ranking: row.ranking,
  };
};

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
