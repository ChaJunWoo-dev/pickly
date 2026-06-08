import { AppText, Screen } from '@/components';
import { theme } from '@/constants/theme';
import {
  hasErrorCode,
  POSTGRES_UNIQUE_VIOLATION_CODE,
} from '@/lib/database-errors';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { getPollDetail } from '../api/get-poll-detail';
import { getPollCommentPreview, PollComment } from '../api/poll-comments';
import { getIsPollSaved, togglePollSave } from '../api/poll-saves';
import { submitPollVote } from '../api/submit-poll-vote';
import type { PollCardData } from '../components/poll-card';
import { PollCategoryPill } from '../components/poll-category-pill';
import { PollCommentPreviewCard } from '../components/poll-comment-preview-card';
import { PollDetailActionSheet } from '../components/poll-detail-action-sheet';
import { PollDetailOptionList } from '../components/poll-detail-option-list';
import { PollDetailTopBar } from '../components/poll-detail-top-bar';
import { PollResultCard } from '../components/poll-result-card';
import { PollTimer } from '../components/poll-timer';
import { isPollExpired } from '../utils/poll-deadline';

export const PollDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const [isActionSheetVisible, setIsActionSheetVisible] = useState(false);
  const [poll, setPoll] = useState<PollCardData | null>(null);
  const [isLoadingPoll, setIsLoadingPoll] = useState(true);
  const [isVoting, setIsVoting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSavingPoll, setIsSavingPoll] = useState(false);
  const [commentPreview, setCommentPreview] = useState<PollComment[]>([]);

  const loadPoll = async () => {
    if (!id) return;

    setIsLoadingPoll(true);
    setIsSavingPoll(true);

    try {
      const [nextPoll, nextIsSaved, nextComments] = await Promise.all([
        getPollDetail(id),
        getIsPollSaved(id),
        getPollCommentPreview(id),
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
  };

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

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/(tabs)');
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

  useEffect(() => {
    if (!id) return;

    void loadPoll();
  }, [id]);

  if (isLoadingPoll) {
    return (
      <Screen>
        <AppText>투표를 불러오는 중이에요</AppText>
      </Screen>
    );
  }

  if (!poll) {
    return (
      <Screen>
        <AppText>투표를 찾을 수 없어요</AppText>
      </Screen>
    );
  }

  const selectedOptionId = poll.selectedOptionId ?? null;
  const isPollClosed = poll.isClosed || isPollExpired(poll.expiresAt);

  return (
    <Screen
      scroll
      contentContainerStyle={styles.content}
      scrollViewProps={{ bounces: false }}
    >
      <PollDetailTopBar
        isSaved={isSaved}
        isSavingPoll={isSavingPoll}
        onBack={handleBack}
        onOpenActions={() => setIsActionSheetVisible(true)}
        onToggleSave={handleToggleSave}
      />

      <View style={styles.metaRow}>
        <PollCategoryPill categoryId={poll.categoryId} />
        <PollTimer expiresAt={poll.expiresAt} />
      </View>

      <View style={styles.titleBlock}>
        <AppText variant="title" weight="bold">
          {poll.question}
        </AppText>
      </View>

      <View style={styles.participants}>
        <AppText tone="muted" variant="caption" weight="semibold">
          지금 {poll.participantCount.toLocaleString()}명 참여중
        </AppText>
      </View>

      <PollDetailOptionList
        disabled={isPollClosed}
        isVoting={isVoting}
        onVote={handleVote}
        options={poll.options}
        selectedOptionId={selectedOptionId}
      />

      <PollResultCard
        options={poll.options}
        participantCount={poll.participantCount}
      />

      <PollCommentPreviewCard comments={commentPreview} />

      <PollDetailActionSheet
        onClose={() => setIsActionSheetVisible(false)}
        visible={isActionSheetVisible}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  content: {
    gap: theme.spacing.lg,
    paddingBottom: theme.spacing.xxxl,
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titleBlock: {
    gap: theme.spacing.xs,
  },
  participants: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
});
