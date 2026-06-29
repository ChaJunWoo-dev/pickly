export type PushTokenRow = {
  id: string;
  user_id: string;
  expo_push_token: string;
  platform: string;
  created_at: string;
  updated_at: string | null;
};

export type PushToken = {
  id: string;
  userId: string;
  expoPushToken: string;
  platform: string;
  createdAt: string;
  updatedAt: string | null;
};

export const mapPushTokenRow = (row: PushTokenRow): PushToken => {
  return {
    createdAt: row.created_at,
    expoPushToken: row.expo_push_token,
    id: row.id,
    platform: row.platform,
    updatedAt: row.updated_at,
    userId: row.user_id,
  };
};
