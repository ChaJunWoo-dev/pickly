import { ensureGuestSession } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import type { Ionicons } from '@expo/vector-icons';
import { createDefaultProfile } from './create-default-profile';

type BadgeIcon = keyof typeof Ionicons.glyphMap;

type ProfileRow = {
  avatar_url: string | null;
  badge_id: string | null;
  id: string;
  nickname: string | null;
};

type RewardBadgeRow = {
  icon: BadgeIcon;
  id: string;
};

export type CurrentProfile = {
  avatarUrl: string | null;
  badgeIcon: BadgeIcon | null;
  id: string;
  nickname: string;
};

export const getCurrentProfile = async (): Promise<CurrentProfile | null> => {
  const user = await ensureGuestSession();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('id,nickname,avatar_url,badge_id')
    .eq('id', user.id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  let profile = data as ProfileRow | null;

  if (!profile) {
    const isCreated = await createDefaultProfile(user.id);

    if (!isCreated) {
      return null;
    }

    const { data: createdProfile, error: createdProfileError } = await supabase
      .from('profiles')
      .select('id,nickname,avatar_url,badge_id')
      .eq('id', user.id)
      .maybeSingle();

    if (createdProfileError) {
      throw createdProfileError;
    }

    profile = createdProfile as ProfileRow | null;
  }

  if (!profile) {
    return null;
  }
  let badgeIcon: BadgeIcon | null = null;

  if (profile.badge_id) {
    const { data: badge, error: badgeError } = await supabase
      .from('reward_badges')
      .select('id,icon')
      .eq('id', profile.badge_id)
      .maybeSingle();

    if (badgeError) {
      throw badgeError;
    }

    badgeIcon = ((badge as RewardBadgeRow | null)?.icon ?? null) as
      | BadgeIcon
      | null;
  }

  return {
    avatarUrl: profile.avatar_url,
    badgeIcon,
    id: profile.id,
    nickname: profile.nickname ?? '익명',
  };
};
