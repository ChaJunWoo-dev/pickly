import { Card, EmptyState, LoadingState, Screen } from '@/components';
import { theme } from '@/constants/theme';
import { useThemeMode } from '@/contexts/theme-mode';
import { getCurrentPointSummary } from '@/features/rewards/api/point-summary';
import {
  hasErrorCode,
  POSTGRES_UNIQUE_VIOLATION_CODE,
} from '@/lib/database-errors';
import { showErrorToast } from '@/lib/toast';
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { getFeedPolls } from '../api/get-feed-polls';
import { submitPollVote } from '../api/submit-poll-vote';
import { FeedTabs } from '../components/feed-tabs';
import { HomeFeedHeader } from '../components/home-feed-header';
import { PollCard, type PollCardData } from '../components/poll-card';
import type { FeedTab } from '../types/feed';
import { isPollExpired } from '../utils/poll-deadline';

export const HomeFeedScreen = () => {
  const router = useRouter();
  const isFocused = useIsFocused();
  const { appTheme } = useThemeMode();
  const [polls, setPolls] = useState<PollCardData[]>([]);
  const [isLoadingPolls, setIsLoadingPolls] = useState(true);
  const [votingPollId, setVotingPollId] = useState<string | null>(null);
  const [activeFeedTab, setActiveFeedTab] = useState<FeedTab>('popular');
  const [currentPoints, setCurrentPoints] = useState(0);

  const loadPolls = useCallback(async () => {
    setIsLoadingPolls(true);

    try {
      const nextPolls = await getFeedPolls(activeFeedTab);

      setPolls(nextPolls);
    } catch {
      showErrorToast('투표를 불러오지 못했어요');
      setPolls([]);
    } finally {
      setIsLoadingPolls(false);
    }
  }, [activeFeedTab]);

  const loadCurrentPoints = useCallback(async () => {
    try {
      const pointSummary = await getCurrentPointSummary();
      setCurrentPoints(pointSummary.currentPoints);
    } catch {
      showErrorToast('포인트를 불러오지 못했어요');
      setCurrentPoints(0);
    }
  }, []);

  useEffect(() => {
    if (!isFocused) return;

    void loadPolls();
    void loadCurrentPoints();
  }, [isFocused, loadCurrentPoints, loadPolls]);

  const handleOpenPoll = (pollId: string) => {
    router.push({
      pathname: '/poll/[id]',
      params: { id: pollId },
    });
  };

  const handleVote = async (pollId: string, optionId: string) => {
    const poll = polls.find((item) => item.id === pollId);

    if (
      !poll ||
      poll.hasVoted ||
      poll.isClosed ||
      isPollExpired(poll.expiresAt) ||
      votingPollId
    ) {
      return;
    }

    setVotingPollId(pollId);

    try {
      await submitPollVote(pollId, optionId);

      await Promise.all([loadPolls(), loadCurrentPoints()]);
    } catch (error) {
      if (hasErrorCode(error, POSTGRES_UNIQUE_VIOLATION_CODE)) {
        Alert.alert(
          '이미 참여한 투표예요',
          '한 번 참여한 투표는 변경할 수 없어요'
        );
        return;
      }

      showErrorToast('투표를 저장하지 못했어요');
    } finally {
      setVotingPollId(null);
    }
  };

  return (
    <Screen
      scroll
      contentContainerStyle={styles.content}
      scrollViewProps={{ bounces: false }}
    >
      <HomeFeedHeader currentPoints={currentPoints} />

      <FeedTabs value={activeFeedTab} onChange={setActiveFeedTab} />

      <View style={styles.feed}>
        {isLoadingPolls ? (
          <Card style={styles.feedbackCard}>
            <LoadingState title="투표를 불러오는 중이에요" />
          </Card>
        ) : null}

        {!isLoadingPolls && polls.length === 0 ? (
          <Card style={styles.feedbackCard}>
            <EmptyState
              description="새 투표가 생기면 여기에 보여드릴게요"
              icon={
                <Ionicons
                  color={appTheme.colors.textSubtle}
                  name="file-tray-outline"
                  size={34}
                />
              }
              title="아직 만들어진 투표가 없어요"
            />
          </Card>
        ) : null}

        {!isLoadingPolls
          ? polls.map((poll) => (
              <PollCard
                key={poll.id}
                onOpen={handleOpenPoll}
                onVote={handleVote}
                poll={poll}
              />
            ))
          : null}
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  content: {
    gap: theme.spacing.xl,
    paddingBottom: theme.spacing.xxxl,
  },
  feed: {
    gap: theme.spacing.lg,
  },
  feedbackCard: {
    paddingVertical: theme.spacing.xl,
  },
});
