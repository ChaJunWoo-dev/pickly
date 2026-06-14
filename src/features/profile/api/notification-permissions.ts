import * as Notifications from 'expo-notifications';
import {
  mapNotificationPermission,
  type NotificationPermission,
} from '../utils/notification-settings';

export const getNotificationPermission =
  async (): Promise<NotificationPermission> => {
    const permission = await Notifications.getPermissionsAsync();

    return mapNotificationPermission(permission);
  };

export const requestNotificationPermission =
  async (): Promise<NotificationPermission> => {
    const permission = await Notifications.requestPermissionsAsync();

    return mapNotificationPermission(permission);
  };
