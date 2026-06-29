import { AppText, Screen } from '@/components';
import { theme } from '@/constants/theme';
import { useThemeMode } from '@/contexts/theme-mode';
import {
  hasErrorCode,
  POSTGRES_UNIQUE_VIOLATION_CODE,
} from '@/lib/database-errors';
import { useIsFocused } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { getFeedPolls } from '../api/get-feed-polls';
import { submitPollVote } from '../api/submit-poll-vote';
import { FeedTabs } from '../components/feed-tabs';
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

  const loadPolls = useCallback(async () => {
    setIsLoadingPolls(true);

    try {
      const nextPolls = await getFeedPolls(activeFeedTab);

      setPolls(nextPolls);
    } catch {
      setPolls([]);
    } finally {
      setIsLoadingPolls(false);
    }
  }, [activeFeedTab]);

  useEffect(() => {
    if (!isFocused) return;

    void loadPolls();
  }, [isFocused, loadPolls]);

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

      await loadPolls();
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
      setVotingPollId(null);
    }
  };

  return (
    <Screen
      scroll
      contentContainerStyle={styles.content}
      scrollViewProps={{ bounces: false }}
    >
      <View style={styles.header}>
        <View>
          <AppText style={styles.brandTitle} weight="bold">
            Pickly
          </AppText>
        </View>

        <View
          style={[
            styles.headerPointsPill,
            {
              backgroundColor: appTheme.colors.surface,
              borderColor: appTheme.colors.border,
            },
          ]}
        >
          <View
            style={[
              styles.headerPointIcon,
              { backgroundColor: appTheme.colors.primary },
            ]}
          >
            <AppText
              style={[
                styles.headerPointIconText,
                { color: appTheme.colors.text },
              ]}
            >
              P
            </AppText>
          </View>
          <AppText
            style={[styles.headerPointsText, { color: appTheme.colors.text }]}
            weight="bold"
          >
            1,280P
          </AppText>
        </View>
      </View>

      <FeedTabs value={activeFeedTab} onChange={setActiveFeedTab} />

      <View style={styles.feed}>
        {isLoadingPolls ? (
          <AppText tone="muted" variant="bodySmall">
            투표를 불러오는 중이에요
          </AppText>
        ) : null}

        {!isLoadingPolls && polls.length === 0 ? (
          <AppText tone="muted" variant="bodySmall">
            아직 만들어진 투표가 없어요
          </AppText>
        ) : null}

        {polls.map((poll) => (
          <PollCard
            key={poll.id}
            onOpen={handleOpenPoll}
            onVote={handleVote}
            poll={poll}
          />
        ))}
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  content: {
    gap: theme.spacing.xl,
    paddingBottom: theme.spacing.xxxl,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  brandTitle: {
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 36,
  },
  headerPointsPill: {
    alignItems: 'center',
    borderRadius: theme.radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: theme.spacing.xs,
    minHeight: 36,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  headerPointIcon: {
    alignItems: 'center',
    borderRadius: theme.radius.full,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  headerPointIconText: {
    fontSize: 15,
    fontWeight: '800',
    includeFontPadding: false,
    lineHeight: 17,
    textAlign: 'center',
  },
  headerPointsText: {
    fontSize: 15,
    lineHeight: 20,
  },
  feed: {
    gap: theme.spacing.lg,
  },
});
