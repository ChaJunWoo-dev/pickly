import '@supabase/functions-js/edge-runtime.d.ts';
import { withSupabase } from '@supabase/server';

const EXPO_PUSH_API_URL = 'https://exp.host/--/api/v2/push/send';
const NOTIFICATION_TYPE = 'created_poll_closed';
const POLL_BATCH_LIMIT = 100;

type PollRow = {
  id: string;
  title: string;
  user_id: string;
};

type NotificationSettingsRow = {
  user_id: string;
  created_poll_closed_enabled: boolean;
};

type PushTokenRow = {
  user_id: string;
  expo_push_token: string;
};

type PollNotificationRecipient = {
  poll: PollRow;
  userId: string;
};

type PollNotificationRecipientGroup = {
  polls: PollRow[];
  userId: string;
};

const truncatePollTitle = (title: string) => {
  return title.length > 26 ? `${title.slice(0, 26)}...` : title;
};

const mapPollsToRecipients = (polls: PollRow[]) => {
  return polls.map((poll) => ({
    poll,
    userId: poll.user_id,
  }));
};

const groupRecipientsByUserId = (recipients: PollNotificationRecipient[]) => {
  const recipientGroupsByUserId = new Map<
    string,
    PollNotificationRecipientGroup
  >();

  recipients.forEach((recipient) => {
    const group = recipientGroupsByUserId.get(recipient.userId) ?? {
      polls: [],
      userId: recipient.userId,
    };

    recipientGroupsByUserId.set(recipient.userId, {
      ...group,
      polls: [...group.polls, recipient.poll],
    });
  });

  return [...recipientGroupsByUserId.values()];
};

const getCreatedPollClosedNotificationBody = (
  recipientGroup: PollNotificationRecipientGroup
) => {
  if (recipientGroup.polls.length === 1) {
    return `"${truncatePollTitle(
      recipientGroup.polls[0].title
    )}" 결과를 확인해보세요`;
  }

  return `내가 만든 투표 ${recipientGroup.polls.length}개가 마감됐어요`;
};

export default {
  fetch: withSupabase({ auth: ['secret'] }, async (_req, ctx) => {
    const { data: polls, error: pollError } = await ctx.supabaseAdmin.rpc(
      'get_unsent_created_poll_closed_polls',
      { p_limit: POLL_BATCH_LIMIT }
    );

    if (pollError) throw pollError;

    const unsentPolls = (polls ?? []) as PollRow[];
    const recipientGroups = groupRecipientsByUserId(
      mapPollsToRecipients(unsentPolls)
    );
    const userIds = recipientGroups.map((recipientGroup) => recipientGroup.userId);

    if (userIds.length === 0) {
      return Response.json({
        success: true,
        deliveredRecipientCount: 0,
        unsentPollCount: 0,
        sentPushMessageCount: 0,
      });
    }

    const { data: settings, error: settingsError } = await ctx.supabaseAdmin
      .from('notification_settings')
      .select('user_id,created_poll_closed_enabled')
      .in('user_id', userIds);

    if (settingsError) throw settingsError;

    const settingsByUserId = new Map(
      ((settings ?? []) as NotificationSettingsRow[]).map((setting) => [
        setting.user_id,
        setting,
      ])
    );

    const enabledRecipientGroups = recipientGroups.filter((recipientGroup) => {
      return (
        settingsByUserId.get(recipientGroup.userId)
          ?.created_poll_closed_enabled ??
        true
      );
    });
    const enabledUserIds = [
      ...new Set(
        enabledRecipientGroups.map((recipientGroup) => recipientGroup.userId)
      ),
    ];

    if (enabledUserIds.length === 0) {
      return Response.json({
        success: true,
        deliveredRecipientCount: 0,
        unsentPollCount: unsentPolls.length,
        sentPushMessageCount: 0,
      });
    }

    const { data: pushTokens, error: pushTokenError } = await ctx.supabaseAdmin
      .from('push_tokens')
      .select('user_id,expo_push_token')
      .in('user_id', enabledUserIds);

    if (pushTokenError) throw pushTokenError;

    const pushTokensByUserId = new Map<string, string[]>();

    ((pushTokens ?? []) as PushTokenRow[]).forEach((pushToken) => {
      const currentTokens = pushTokensByUserId.get(pushToken.user_id) ?? [];

      pushTokensByUserId.set(pushToken.user_id, [
        ...currentTokens,
        pushToken.expo_push_token,
      ]);
    });

    const deliveredRecipientGroups: PollNotificationRecipientGroup[] = [];
    const messages = enabledRecipientGroups.flatMap((recipientGroup) => {
      const tokens = pushTokensByUserId.get(recipientGroup.userId) ?? [];

      if (tokens.length === 0) return [];

      deliveredRecipientGroups.push(recipientGroup);

      return tokens.map((token) => ({
        to: token,
        sound: 'default',
        title: '내 투표가 마감되었어요',
        body: getCreatedPollClosedNotificationBody(recipientGroup),
        data: {
          pollId: recipientGroup.polls[0].id,
          pollIds: recipientGroup.polls.map((poll) => poll.id),
          type: NOTIFICATION_TYPE,
        },
      }));
    });

    if (messages.length > 0) {
      const expoResponse = await fetch(EXPO_PUSH_API_URL, {
        body: JSON.stringify(messages),
        headers: {
          Accept: 'application/json',
          'Accept-Encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        method: 'POST',
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
    }

    if (deliveredRecipientGroups.length > 0) {
      const { error: saveDeliveryError } = await ctx.supabaseAdmin
        .from('poll_notification_deliveries')
        .upsert(
          deliveredRecipientGroups.flatMap((recipientGroup) =>
            recipientGroup.polls.map((poll) => ({
              poll_id: poll.id,
              sent_at: new Date().toISOString(),
              type: NOTIFICATION_TYPE,
              user_id: recipientGroup.userId,
            }))
          ),
          { onConflict: 'poll_id,user_id,type' }
        );

      if (saveDeliveryError) throw saveDeliveryError;
    }

    const deliveredRecipientCount = deliveredRecipientGroups.reduce(
      (count, recipientGroup) => count + recipientGroup.polls.length,
      0
    );

    return Response.json({
      success: true,
      deliveredRecipientCount,
      sentPushMessageCount: messages.length,
      unsentPollCount: unsentPolls.length,
    });
  }),
};
