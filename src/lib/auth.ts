import { createDefaultProfile } from '@/features/profile/api/create-default-profile';
import { supabase } from './supabase';

export const ensureGuestSession = async () => {
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();

  if (sessionError) {
    return null;
  }

  if (sessionData.session?.user) return sessionData.session.user;

  const { data, error } = await supabase.auth.signInAnonymously();

  if (error || !data.user) {
    return null;
  }

  await createDefaultProfile(data.user.id);

  return data.user;
};
