import { AppText, Screen } from '@/components';
import { theme } from '@/constants/theme';
import { ensureGuestSession } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { FeedTabs, type FeedTab } from '../components/feed-tabs';
import { PollCard, type PollCardData } from '../components/poll-card';
import {
  mapPollFeedRowToCardData,
  type PollFeedRow,
} from '../utils/poll-mappers';

const activeFeedTab: FeedTab = 'popular';

export const HomeFeedScreen = () => {
  const router = useRouter();
  const [polls, setPolls] = useState<PollCardData[]>([]);
  const [isLoadingPolls, setIsLoadingPolls] = useState(true);

  useEffect(() => {
    const loadPolls = async () => {
      setIsLoadingPolls(true);

      try {
        await ensureGuestSession();

        const { data, error } = await supabase
          .from('polls')
          .select(
            `
              id,
              title,
              category,
              reward_points,
              expires_at,
              poll_options (
                id,
                label,
                image_url,
                sort_order
              ),
              poll_votes (
                id,
                option_id
              )
            `
          )
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        setPolls(((data ?? []) as PollFeedRow[]).map(mapPollFeedRowToCardData));
      } catch (error) {
        console.error('load polls failed', error);
      } finally {
        setIsLoadingPolls(false);
      }
    };

    loadPolls();
  }, []);

  const handleOpenPoll = (pollId: string) => {
    router.push({
      pathname: '/poll/[id]',
      params: { id: pollId },
    });
  };

  const handleVote = (pollId: string, optionId: string) => {
    console.log('vote poll', pollId, optionId);
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
