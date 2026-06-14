import { ensureGuestSession } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import {
  mapPollCommentRow,
  type BadgeIcon,
  type CommentAuthorProfileRow,
  type CommentNotificationSettingRow,
  type CommentRewardBadgeRow,
  type PollCommentAuthor,
  type PollCommentRow,
  type PollOwnerRow,
} from '../utils/poll-comments';

const getCommentAuthors = async (userIds: string[]) => {
  const uniqueUserIds = [...new Set(userIds)];

  if (uniqueUserIds.length === 0) {
    return new Map<string, PollCommentAuthor>();
  }

  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('id,nickname,avatar_url,badge_id')
    .in('id', uniqueUserIds);

  if (profileError) {
    throw profileError;
  }

  const profileRows = (profiles ?? []) as CommentAuthorProfileRow[];
  const badgeIds = [
    ...new Set(
      profileRows
        .map((profile) => profile.badge_id)
        .filter((badgeId): badgeId is string => Boolean(badgeId))
    ),
  ];
  const badgeIconById = new Map<string, BadgeIcon>();

  if (badgeIds.length > 0) {
    const { data: badges, error: badgeError } = await supabase
      .from('reward_badges')
      .select('id,icon')
      .in('id', badgeIds);

    if (badgeError) {
      throw badgeError;
    }

    ((badges ?? []) as CommentRewardBadgeRow[]).forEach((badge) => {
      badgeIconById.set(badge.id, badge.icon);
    });
  }

  return new Map(
    profileRows.map((profile) => [
      profile.id,
      {
        avatarUrl: profile.avatar_url,
        badgeIcon: profile.badge_id
          ? (badgeIconById.get(profile.badge_id) ?? null)
          : null,
        nickname: profile.nickname ?? '익명',
      },
    ])
  );
};

const mapPollComments = async (comments: PollCommentRow[]) => {
  const authorByUserId = await getCommentAuthors(
    comments.map((comment) => comment.user_id)
  );

  return comments.map((comment) =>
    mapPollCommentRow(comment, authorByUserId.get(comment.user_id))
  );
};

export const getPollCommentPreview = async (pollId: string) => {
  const { data, error } = await supabase
    .from('comments')
    .select('id, poll_id, user_id, body, created_at')
    .eq('poll_id', pollId)
    .limit(3)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return mapPollComments((data ?? []) as PollCommentRow[]);
};

export const getPollComments = async (
  pollId: string,
  range = { from: 0, to: 10 }
) => {
  const { data, error } = await supabase
    .from('comments')
    .select('id,poll_id,user_id,body,created_at')
    .eq('poll_id', pollId)
    .order('created_at', { ascending: false })
    .range(range.from, range.to);

  if (error) throw error;

  return mapPollComments((data ?? []) as PollCommentRow[]);
};

export const getPollOwnerId = async (pollId: string) => {
  const { data, error } = await supabase
    .from('polls')
    .select('user_id')
    .eq('id', pollId)
    .single();

  if (error) throw error;

  return (data as PollOwnerRow).user_id;
};

export const getUserCommentNotificationEnabled = async (userId: string) => {
  const { data, error } = await supabase
    .from('notification_settings')
    .select('comment_enabled')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;

  return ((data as CommentNotificationSettingRow | null)?.comment_enabled ??
    true);
};

export const createPollComment = async (pollId: string, body: string) => {
  const trimmedBody = body.trim();

  if (!trimmedBody) return null;

  const user = await ensureGuestSession();

  if (!user) return null;

  const { data, error } = await supabase
    .from('comments')
    .insert({
      poll_id: pollId,
      body: trimmedBody,
    })
    .select('id,poll_id,user_id,body,created_at')
    .single();

  if (error) throw error;

  const [comment] = await mapPollComments([data as PollCommentRow]);

  return comment;
};

type SendPollCommentNotificationParams = {
  recipientUserId: string;
  pollId: string;
};

export const sendCommentPushNotification = async ({
  recipientUserId,
  pollId,
}: SendPollCommentNotificationParams) => {
  const { error } = await supabase.functions.invoke('send-push-notification', {
    body: {
      recipientUserId,
      title: '새 댓글이 달렸어요',
      body: '내 투표에 새로운 댓글이 도착했어요',
      data: {
        type: 'poll_comment',
        pollId,
      },
    },
  });

  if (error) throw error;
};
