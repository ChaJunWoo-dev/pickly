import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { ensureGuestSession } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import {
  mapPushTokenRow,
  type PushToken,
  type PushTokenRow,
} from '../utils/push-tokens';

const getExpoProjectId = () => {
  return (
    Constants.easConfig?.projectId ??
    Constants.expoConfig?.extra?.eas?.projectId
  );
};

export const registerPushToken = async (): Promise<PushToken | null> => {
  const user = await ensureGuestSession();
  const projectId = getExpoProjectId();

  if (!user) {
    return null;
  }

  if (!projectId) {
    throw new Error('Expo project id is missing.');
  }

  const expoPushToken = await Notifications.getExpoPushTokenAsync({
    projectId,
  });

  const { data, error } = await supabase
    .from('push_tokens')
    .upsert(
      {
        expo_push_token: expoPushToken.data,
        platform: Platform.OS,
        updated_at: new Date().toISOString(),
        user_id: user.id,
      },
      { onConflict: 'user_id,expo_push_token' }
    )
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return mapPushTokenRow(data as PushTokenRow);
};
