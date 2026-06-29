import { supabase } from './supabase';

export const ensureGuestSession = async () => {
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();

  if (sessionError) {
    return null;
  }

  if (sessionData.session?.user) return sessionData.session.user;

  const { data, error } = await supabase.auth.signInAnonymously();

  if (error) {
    return null;
  }

  return data.user;
};
