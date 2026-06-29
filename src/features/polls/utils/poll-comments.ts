import type { Ionicons } from '@expo/vector-icons';

export type BadgeIcon = keyof typeof Ionicons.glyphMap;

export type PollCommentAuthor = {
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

export type CommentAuthorProfileRow = {
  avatar_url: string | null;
  badge_id: string | null;
  id: string;
  nickname: string | null;
};

export type CommentRewardBadgeRow = {
  icon: BadgeIcon;
  id: string;
};

export type PollOwnerRow = {
  user_id: string;
};

export type CommentNotificationSettingRow = {
  comment_enabled: boolean;
};

const emptyAuthor: PollCommentAuthor = {
  avatarUrl: null,
  badgeIcon: null,
  nickname: '익명',
};

export const mapPollCommentRow = (
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
