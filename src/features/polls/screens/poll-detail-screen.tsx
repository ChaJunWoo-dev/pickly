import { AppText, Card, EmptyState, LoadingState, Screen } from '@/components';
import { theme } from '@/constants/theme';
import { useThemeMode } from '@/contexts/theme-mode';
import { Ionicons } from '@expo/vector-icons';
import {
  hasErrorCode,
  POSTGRES_UNIQUE_VIOLATION_CODE,
} from '@/lib/database-errors';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { getPollDetail } from '../api/get-poll-detail';
import { getPollCommentPreview } from '../api/poll-comments';
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
import type { PollComment } from '../utils/poll-comments';
import { isPollExpired } from '../utils/poll-deadline';

export const PollDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const { appTheme } = useThemeMode();
  const [isActionSheetVisible, setIsActionSheetVisible] = useState(false);
  const [poll, setPoll] = useState<PollCardData | null>(null);
  const [isLoadingPoll, setIsLoadingPoll] = useState(true);
  const [isVoting, setIsVoting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSavingPoll, setIsSavingPoll] = useState(false);
  const [commentPreview, setCommentPreview] = useState<PollComment[]>([]);

  const loadPoll = useCallback(async () => {
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
  }, [id]);

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

  const handlePressViewAllComments = () => {
    if (!poll) {
      return;
    }

    if (!poll.hasVoted) {
      Alert.alert('댓글 작성 안내', '먼저 투표에 참여해주세요');
      return;
    }

    router.push({
      pathname: '/poll/[id]/comments',
      params: { id: poll.id },
    });
  };

  useEffect(() => {
    if (!id) return;

    void loadPoll();
  }, [id, loadPoll]);

  if (isLoadingPoll) {
    return (
      <Screen contentContainerStyle={styles.feedbackScreen}>
        <Card style={styles.feedbackCard}>
          <LoadingState title="투표를 불러오는 중이에요" />
        </Card>
      </Screen>
    );
  }

  if (!poll) {
    return (
      <Screen contentContainerStyle={styles.feedbackScreen}>
        <Card style={styles.feedbackCard}>
          <EmptyState
            description="삭제되었거나 접근할 수 없는 투표예요"
            icon={
              <Ionicons
                color={appTheme.colors.textSubtle}
                name="alert-circle-outline"
                size={34}
              />
            }
            title="투표를 찾을 수 없어요"
          />
        </Card>
      </Screen>
    );
  }

  const selectedOptionId = poll.selectedOptionId ?? null;
  const isPollClosed = poll.isClosed || isPollExpired(poll.expiresAt);
  const isBoosted = poll.boostedUntil
    ? new Date(poll.boostedUntil).getTime() > Date.now()
    : false;

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
        <View style={styles.metaLeft}>
          <PollCategoryPill categoryId={poll.categoryId} />
          {isBoosted ? (
            <View
              style={[
                styles.boostBadge,
                { backgroundColor: appTheme.colors.rewardSoft },
              ]}
            >
              <Ionicons
                color={appTheme.colors.reward}
                name="flash"
                size={13}
              />
              <AppText tone="reward" variant="caption" weight="bold">
                부스터 적용중
              </AppText>
            </View>
          ) : null}
        </View>
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

      <PollCommentPreviewCard
        comments={commentPreview}
        onPressAllView={handlePressViewAllComments}
        onWriteComment={handlePressViewAllComments}
      />

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
  metaLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    flexShrink: 1,
    gap: theme.spacing.xs,
  },
  boostBadge: {
    alignItems: 'center',
    borderRadius: theme.radius.full,
    flexDirection: 'row',
    gap: theme.spacing.xxs,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xxs,
  },
  titleBlock: {
    gap: theme.spacing.xs,
  },
  participants: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  feedbackScreen: {
    justifyContent: 'center',
  },
  feedbackCard: {
    paddingVertical: theme.spacing.xl,
  },
});
