import { AppText, Screen } from '@/components';
import { theme } from '@/constants/theme';
import { ensureGuestSession } from '@/lib/auth';
import { POSTGRES_UNIQUE_VIOLATION_CODE } from '@/lib/database-errors';
import { supabase } from '@/lib/supabase';
import { useIsFocused } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { FeedTabs, type FeedTab } from '../components/feed-tabs';
import { PollCard, type PollCardData } from '../components/poll-card';
import {
  mapPollFeedRowToCardData,
  type PollFeedRow,
} from '../utils/poll-mappers';
import { isPollExpired } from '../utils/poll-deadline';

const activeFeedTab: FeedTab = 'popular';

export const HomeFeedScreen = () => {
  const router = useRouter();
  const isFocused = useIsFocused();
  const [polls, setPolls] = useState<PollCardData[]>([]);
  const [isLoadingPolls, setIsLoadingPolls] = useState(true);
  const [votingPollId, setVotingPollId] = useState<string | null>(null);

  const loadPolls = useCallback(async () => {
    setIsLoadingPolls(true);

    try {
      const user = await ensureGuestSession();

      const { data, error } = await supabase
        .from('polls')
        .select(
          `
        id,
        title,
        category,
        reward_points,
        expires_at,
        is_closed,
        poll_options (
          id,
          label,
          image_url,
          sort_order
        ),
        poll_votes (
          id,
          option_id,
          user_id
        )
      `
        )
        .order('created_at', { ascending: false });

      if (error) throw error;

      setPolls(
        ((data ?? []) as PollFeedRow[]).map((poll) =>
          mapPollFeedRowToCardData(poll, user?.id)
        )
      );
    } catch (error) {
      console.error('load polls failed', error);
    } finally {
      setIsLoadingPolls(false);
    }
  }, []);

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
      const user = await ensureGuestSession();

      if (!user) {
        throw new Error('Guest session is missing.');
      }

      const { error } = await supabase.rpc('submit_poll_vote', {
        p_poll_id: pollId,
        p_option_id: optionId,
      });

      if (error) throw error;

      await loadPolls();
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

        <View style={styles.headerPointsPill}>
          <View style={styles.headerPointIcon}>
            <AppText style={styles.headerPointIconText}>P</AppText>
          </View>
          <AppText style={styles.headerPointsText} weight="bold">
            1,280P
          </AppText>
        </View>
      </View>

      <FeedTabs value={activeFeedTab} />

      <View style={styles.feed}>
        {isLoadingPolls ? (
          <AppText tone="muted" variant="bodySmall">
            투표를 불러오는 중이에요.
          </AppText>
        ) : null}

        {!isLoadingPolls && polls.length === 0 ? (
          <AppText tone="muted" variant="bodySmall">
            아직 만들어진 투표가 없어요.
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
    color: theme.colors.text,
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 36,
  },
  headerPointsPill: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
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
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.full,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  headerPointIconText: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: '800',
    includeFontPadding: false,
    lineHeight: 17,
    textAlign: 'center',
  },
  headerPointsText: {
    color: theme.colors.text,
    fontSize: 15,
    lineHeight: 20,
  },
  pointsPill: {
    backgroundColor: theme.colors.rewardSoft,
    borderRadius: theme.radius.full,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  summaryCard: {
    backgroundColor: theme.colors.primarySoft,
    borderColor: theme.colors.primary,
    gap: theme.spacing.lg,
  },
  summaryCopy: {
    gap: theme.spacing.xs,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  feed: {
    gap: theme.spacing.lg,
  },
});
