import * as Notifications from 'expo-notifications';
export type NotificationSettingsRow = {
  user_id: string;
  created_poll_closed_enabled: boolean;
  voted_poll_result_enabled: boolean;
  comment_enabled: boolean;
  created_at: string;
  updated_at: string | null;
};

export type NotificationSettings = {
  createdPollClosedEnabled: boolean;
  votedPollResultEnabled: boolean;
  commentEnabled: boolean;
};

export const mapNotificationSettingsRow = (
  row: NotificationSettingsRow
): NotificationSettings => {
  return {
    commentEnabled: row.comment_enabled,
    createdPollClosedEnabled: row.created_poll_closed_enabled,
    votedPollResultEnabled: row.voted_poll_result_enabled,
  };
};

export const mapNotificationSettingsToUpdateRow = (
  settings: Partial<NotificationSettings>
) => {
  return {
    ...(settings.createdPollClosedEnabled !== undefined && {
      created_poll_closed_enabled: settings.createdPollClosedEnabled,
    }),
    ...(settings.votedPollResultEnabled !== undefined && {
      voted_poll_result_enabled: settings.votedPollResultEnabled,
    }),
    ...(settings.commentEnabled !== undefined && {
      comment_enabled: settings.commentEnabled,
    }),
  };
};

export type NotificationPermissionStatus =
  | 'granted'
  | 'denied'
  | 'undetermined';

export type NotificationPermission = {
  canAskAgain: boolean;
  status: NotificationPermissionStatus;
};

export const mapNotificationPermission = (
  permission: Notifications.NotificationPermissionsStatus
): NotificationPermission => {
  return {
    canAskAgain: permission.canAskAgain,
    status: permission.status as NotificationPermissionStatus,
  };
};
