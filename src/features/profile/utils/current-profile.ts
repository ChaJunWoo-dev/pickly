import type { Ionicons } from '@expo/vector-icons';

type BadgeIcon = keyof typeof Ionicons.glyphMap;

export type ProfileRow = {
  avatar_url: string | null;
  badge_id: string | null;
  id: string;
  nickname: string | null;
};

export type ProfileRewardBadgeRow = {
  icon: BadgeIcon;
  id: string;
};

export type CurrentProfile = {
  avatarUrl: string | null;
  badgeIcon: BadgeIcon | null;
  id: string;
  nickname: string;
};

export const mapCurrentProfileRow = (
  profile: ProfileRow,
  badgeIcon: BadgeIcon | null
): CurrentProfile => {
  return {
    avatarUrl: profile.avatar_url,
    badgeIcon,
    id: profile.id,
    nickname: profile.nickname ?? '익명',
  };
};
