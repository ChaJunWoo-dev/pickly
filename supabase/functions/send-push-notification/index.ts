import '@supabase/functions-js/edge-runtime.d.ts';
import { withSupabase } from '@supabase/server';

type PushRequestBody = {
  recipientUserId: string;
  title?: string;
  body?: string;
  data?: Record<string, unknown>;
};

type PushTokenRow = {
  expo_push_token: string;
};

const EXPO_PUSH_API_URL = 'https://exp.host/--/api/v2/push/send';

export default {
  fetch: withSupabase({ auth: ['publishable', 'secret'] }, async (req, ctx) => {
    const isCommentNotificationEnabled = async (userId: string) => {
      const { data, error } = await ctx.supabaseAdmin
        .from('notification_settings')
        .select('comment_enabled')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;

      return data?.comment_enabled ?? true;
    };

    const getPushTokens = async (userId: string) => {
      const { data, error } = await ctx.supabaseAdmin
        .from('push_tokens')
        .select('expo_push_token')
        .eq('user_id', userId);

      if (error) throw error;

      return ((data ?? []) as PushTokenRow[]).map(
        (token) => token.expo_push_token
      );
    };

    const { recipientUserId, title, body, data }: PushRequestBody =
      await req.json();

    if (!recipientUserId || !title || !body) {
      return Response.json(
        { error: 'recipientUserId, title, body are required' },
        { status: 400 }
      );
    }

    const commentEnabled = await isCommentNotificationEnabled(recipientUserId);

    if (!commentEnabled) {
      return Response.json({
        success: true,
        sent: 0,
        skipped: 'comment_notification_disabled',
      });
    }

    const pushTokens = await getPushTokens(recipientUserId);

    if (pushTokens.length === 0) {
      return Response.json({
        success: true,
        sent: 0,
        skipped: 'no_push_tokens',
      });
    }

    const messages = pushTokens.map((pushToken) => ({
      to: pushToken,
      sound: 'default',
      title,
      body,
      data: data ?? {},
    }));

    const expoResponse = await fetch(EXPO_PUSH_API_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messages),
    });

    const result = await expoResponse.json();

    if (!expoResponse.ok) {
      return Response.json(
        {
          error: 'Expo Push API send failed',
          result,
        },
        { status: expoResponse.status }
      );
    }

    return Response.json({
      success: true,
      sent: messages.length,
      result,
    });
  }),
};
