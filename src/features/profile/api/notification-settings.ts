import { ensureGuestSession } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import {
  mapNotificationSettingsRow,
  mapNotificationSettingsToUpdateRow,
  type NotificationSettings,
  type NotificationSettingsRow,
} from '../utils/notification-settings';

export const getOrCreateNotificationSettings =
  async (): Promise<NotificationSettings> => {
    const { data, error } = await supabase.rpc(
      'get_or_create_notification_settings'
    );

    if (error) {
      throw error;
    }

    return mapNotificationSettingsRow(data as NotificationSettingsRow);
  };

export const updateNotificationSettings = async (
  updates: Partial<NotificationSettings>
): Promise<NotificationSettings> => {
  const user = await ensureGuestSession();

  if (!user) {
    throw new Error('Guest session is missing.');
  }

  const { data, error } = await supabase
    .from('notification_settings')
    .update({
      ...mapNotificationSettingsToUpdateRow(updates),
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', user.id)
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return mapNotificationSettingsRow(data as NotificationSettingsRow);
};
