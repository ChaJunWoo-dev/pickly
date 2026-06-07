import { AppText, Screen } from '@/components';
import { theme } from '@/constants/theme';
import { POSTGRES_UNIQUE_VIOLATION_CODE } from '@/lib/database-errors';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { getPollDetail } from '../api/get-poll-detail';
import { getIsPollSaved, togglePollSave } from '../api/poll-saves';
import { submitPollVote } from '../api/submit-poll-vote';
import type { PollCardData } from '../components/poll-card';
import { PollCategoryPill } from '../components/poll-category-pill';
import { PollCommentPreviewCard } from '../components/poll-comment-preview-card';
import { PollDetailActionSheet } from '../components/poll-detail-action-sheet';
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

  const loadPoll = async () => {
    if (!id) return;

    setIsLoadingPoll(true);
    setIsSavingPoll(true);

    try {
      const [nextPoll, nextIsSaved] = await Promise.all([
        getPollDetail(id),
        getIsPollSaved(id),
      ]);

      setPoll(nextPoll);
      setIsSaved(nextIsSaved);
    } catch (error) {
      setPoll(null);
      setIsSaved(false);
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
    } catch (error) {
      console.error(error);
      Alert.alert('저장 실패', '변경에 실패했어요');
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
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === POSTGRES_UNIQUE_VIOLATION_CODE
      ) {
        Alert.alert(
          '이미 참여한 투표예요',
          '한 번 참여한 투표는 변경할 수 없어요.'
        );
        return;
      }

      Alert.alert('투표 실패', '투표를 저장하지 못했어요.');
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
        <AppText>투표를 불러오는 중이에요.</AppText>
      </Screen>
    );
  }

  if (!poll) {
    return (
      <Screen>
        <AppText>투표를 찾을 수 없어요.</AppText>
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
      <View style={styles.topBar}>
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
              return;
            }

            router.replace('/(tabs)');
          }}
          style={styles.iconButton}
        >
          <Ionicons color={theme.colors.text} name="chevron-back" size={22} />
        </Pressable>

        <View style={styles.topActions}>
          <Pressable
            accessibilityRole="button"
            disabled={isSavingPoll}
            style={[styles.iconButton, isSavingPoll && styles.iconButtonMuted]}
            onPress={handleToggleSave}
          >
            <Ionicons
              color={isSaved ? theme.colors.primary : theme.colors.text}
              name={isSaved ? 'bookmark' : 'bookmark-outline'}
              size={20}
            />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => setIsActionSheetVisible(true)}
            style={styles.iconButton}
          >
            <Ionicons
              color={theme.colors.text}
              name="ellipsis-horizontal"
              size={20}
            />
          </Pressable>
        </View>
      </View>

      <View style={styles.metaRow}>
        <PollCategoryPill categoryId={poll.categoryId} />
        <PollTimer expiresAt={poll.expiresAt} />
      </View>

      <View style={styles.titleBlock}>
        <AppText style={styles.question} variant="title" weight="bold">
          {poll.question}
        </AppText>
      </View>

      <View style={styles.participants}>
        <AppText tone="muted" variant="caption" weight="semibold">
          지금 {poll.participantCount.toLocaleString()}명 참여중
        </AppText>
      </View>

      <View style={styles.voteOptions}>
        {poll.options.slice(0, 2).map((option) => {
          const isSelected = option.id === selectedOptionId;

          return (
            <Pressable
              key={option.id}
              accessibilityRole="button"
              accessibilityState={{ disabled: isPollClosed || isVoting }}
              disabled={isPollClosed || isVoting}
              onPress={() => handleVote(option.id)}
              style={[
                styles.voteOption,
                isSelected && styles.voteOptionActive,
                (isPollClosed || isVoting) && styles.voteOptionDisabled,
              ]}
            >
              <View
                style={[
                  styles.checkCircle,
                  isSelected && styles.checkCircleActive,
                ]}
              >
                {isSelected ? (
                  <Ionicons
                    color={theme.colors.inverseText}
                    name="checkmark"
                    size={14}
                  />
                ) : null}
              </View>
              <AppText variant="bodySmall" weight="semibold">
                {option.label}
              </AppText>
            </Pressable>
          );
        })}
      </View>

      <PollResultCard
        options={poll.options}
        participantCount={poll.participantCount}
      />

      <PollCommentPreviewCard />

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
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topActions: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  iconButton: {
    alignItems: 'center',
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  iconButtonMuted: {
    opacity: 0.55,
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titleBlock: {
    gap: theme.spacing.xs,
  },
  question: {
    color: theme.colors.text,
  },
  participants: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  voteOptions: {
    gap: theme.spacing.sm,
  },
  voteOption: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    flexDirection: 'row',
    gap: theme.spacing.sm,
    minHeight: 52,
    paddingHorizontal: theme.spacing.lg,
  },
  voteOptionActive: {
    backgroundColor: theme.colors.primarySoft,
    borderColor: theme.colors.primaryStrong,
  },
  voteOptionDisabled: {
    opacity: 0.55,
  },
  checkCircle: {
    alignItems: 'center',
    borderColor: theme.colors.borderStrong,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    height: 22,
    justifyContent: 'center',
    width: 22,
  },
  checkCircleActive: {
    backgroundColor: theme.colors.primaryStrong,
    borderColor: theme.colors.primaryStrong,
  },
});
