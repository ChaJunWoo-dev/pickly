import { ensureGuestSession } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export type PollComment = {
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

const mapPollComment = (comment: PollCommentRow): PollComment => ({
  id: comment.id,
  pollId: comment.poll_id,
  userId: comment.user_id,
  body: comment.body,
  createdAt: comment.created_at,
});

export const getPollCommentPreview = async (pollId: string) => {
  const { data, error } = await supabase
    .from('comments')
    .select('id, poll_id, user_id, body, created_at')
    .eq('poll_id', pollId)
    .limit(3)
    .order('created_at');

  if (error) throw error;

  return ((data ?? []) as PollCommentRow[]).map(mapPollComment);
};

export const getPollComments = async (
  pollId: string,
  range = { from: 0, to: 10 }
) => {
  const { data, error } = await supabase
    .from('comments')
    .select('id,poll_id,user_id,body,created_at')
    .eq('poll_id', pollId)
    .order('created_at')
    .range(range.from, range.to);

  if (error) throw error;

  return ((data ?? []) as PollCommentRow[]).map(mapPollComment);
};

export const creatPollComments = async (pollId: string, body: string) => {
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

  return mapPollComment(data as PollCommentRow);
};
