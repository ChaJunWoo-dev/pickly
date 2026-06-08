import { supabase } from '@/lib/supabase';

export type PollComment = {
  id: string;
  pollId: string;
  userId: string;
  body: string;
  createdAt: string;
};

type PollCommentRow = {
  id: string;
  poll_id: string;
  user_id: string;
  body: string;
  created_at: string;
};

const mapPollComment = (comment: PollCommentRow): PollComment => ({
  id: comment.id,
  pollId: comment.poll_id,
  userId: comment.user_id,
  body: comment.body,
  createdAt: comment.created_at,
});

export const getPollComments = async (pollId: string) => {
  const { data, error } = await supabase
    .from('comments')
    .select('id, poll_id, user_id, body, created_at')
    .eq('poll_id', pollId)
    .limit(3);

  if (error) throw error;

  return ((data ?? []) as PollCommentRow[]).map(mapPollComment);
};
