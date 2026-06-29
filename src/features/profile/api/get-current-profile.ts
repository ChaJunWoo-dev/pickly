import { ensureGuestSession } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { createDefaultProfile } from './create-default-profile';
import {
  mapCurrentProfileRow,
  type CurrentProfile,
  type ProfileRewardBadgeRow,
  type ProfileRow,
} from '../utils/current-profile';

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
  let badgeIcon: CurrentProfile['badgeIcon'] = null;

  if (profile.badge_id) {
    const { data: badge, error: badgeError } = await supabase
      .from('reward_badges')
      .select('id,icon')
      .eq('id', profile.badge_id)
      .maybeSingle();

    if (badgeError) {
      throw badgeError;
    }

    badgeIcon = (badge as ProfileRewardBadgeRow | null)?.icon ?? null;
  }

  return mapCurrentProfileRow(profile, badgeIcon);
};
