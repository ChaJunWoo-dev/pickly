import {
  hasErrorCode,
  POSTGRES_UNIQUE_VIOLATION_CODE,
} from '@/lib/database-errors';
import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { getPollDetail } from '../api/get-poll-detail';
import { getPollCommentPreview } from '../api/poll-comments';
import { getIsPollSaved, togglePollSave } from '../api/poll-saves';
import { submitPollVote } from '../api/submit-poll-vote';
import type { PollCardData } from '../components/poll-card';
import type { PollComment } from '../utils/poll-comments';
import { isPollExpired } from '../utils/poll-deadline';

type UsePollDetailParams = {
  pollId?: string;
};

export const usePollDetail = ({ pollId }: UsePollDetailParams) => {
  const [poll, setPoll] = useState<PollCardData | null>(null);
  const [isLoadingPoll, setIsLoadingPoll] = useState(true);
  const [isVoting, setIsVoting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSavingPoll, setIsSavingPoll] = useState(false);
  const [commentPreview, setCommentPreview] = useState<PollComment[]>([]);

  const loadPoll = useCallback(async () => {
    if (!pollId) return;

    setIsLoadingPoll(true);
    setIsSavingPoll(true);

    try {
      const [nextPoll, nextIsSaved, nextComments] = await Promise.all([
        getPollDetail(pollId),
        getIsPollSaved(pollId),
        getPollCommentPreview(pollId),
      ]);

      setPoll(nextPoll);
      setIsSaved(nextIsSaved);
      setCommentPreview(nextComments);
    } catch {
      setPoll(null);
      setIsSaved(false);
      setCommentPreview([]);
    } finally {
      setIsLoadingPoll(false);
      setIsSavingPoll(false);
    }
  }, [pollId]);

  useEffect(() => {
    if (!pollId) return;

    void loadPoll();
  }, [loadPoll, pollId]);

  const handleToggleSave = async () => {
    if (isSavingPoll || !poll) return;

    setIsSavingPoll(true);

    try {
      const nextIsSaved = await togglePollSave(poll.id, isSaved);
      setIsSaved(nextIsSaved);
    } catch {
      Alert.alert('저장 실패', '저장 상태를 변경하지 못했어요');
    } finally {
      setIsSavingPoll(false);
    }
  };

  const handleVote = async (optionId: string) => {
    if (!poll || poll.isClosed || isPollExpired(poll.expiresAt) || isVoting) {
      return;
    }

    setIsVoting(true);

    try {
      await submitPollVote(poll.id, optionId);
      await loadPoll();
    } catch (error) {
      if (hasErrorCode(error, POSTGRES_UNIQUE_VIOLATION_CODE)) {
        Alert.alert(
          '이미 참여한 투표예요',
          '한 번 참여한 투표는 변경할 수 없어요'
        );
        return;
      }

      Alert.alert('투표 실패', '투표를 저장하지 못했어요');
    } finally {
      setIsVoting(false);
    }
  };

  return {
    commentPreview,
    handleToggleSave,
    handleVote,
    isLoadingPoll,
    isSaved,
    isSavingPoll,
    isVoting,
    poll,
  };
};
