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

export const mapRankingRow = (row: RankingRow): UserRanking => {
  return {
    userId: row.user_id,
    nickname: row.nickname ?? '익명',
    avatarUrl: row.avatar_url,
    badgeIcon: row.badge_icon,
    points: row.points,
    ranking: row.ranking,
  };
};
