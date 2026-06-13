import { ensureGuestSession } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import type { Ionicons } from '@expo/vector-icons';

type BadgeIcon = keyof typeof Ionicons.glyphMap;

type PollCommentAuthor = {
  avatarUrl: string | null;
  badgeIcon: BadgeIcon | null;
  nickname: string;
};

export type PollComment = {
  author: PollCommentAuthor;
  id: string;
  pollId: string;
  userId: string;
  body: string;
  createdAt: string;
};

export type PollCommentRow = {
  id: string;
  poll_id: string;
  user_id: string;
  body: string;
  created_at: string;
};

type ProfileRow = {
  avatar_url: string | null;
  badge_id: string | null;
  id: string;
  nickname: string | null;
};

type RewardBadgeRow = {
  icon: BadgeIcon;
  id: string;
};

const emptyAuthor: PollCommentAuthor = {
  avatarUrl: null,
  badgeIcon: null,
  nickname: '익명',
};

const mapPollComment = (
  comment: PollCommentRow,
  author = emptyAuthor
): PollComment => ({
  author,
  id: comment.id,
  pollId: comment.poll_id,
  userId: comment.user_id,
  body: comment.body,
  createdAt: comment.created_at,
});

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

  const profileRows = (profiles ?? []) as ProfileRow[];
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

    ((badges ?? []) as RewardBadgeRow[]).forEach((badge) => {
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
    mapPollComment(comment, authorByUserId.get(comment.user_id))
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
