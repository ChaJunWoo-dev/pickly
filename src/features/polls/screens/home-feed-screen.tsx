import { AppText, Screen } from '@/components';
import { theme } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { supabase } from '../../../../lib/supabase';
import { FeedTabs, type FeedTab } from '../components/feed-tabs';
import { PollCard } from '../components/poll-card';
import { featuredPolls } from '../data/mock-polls';

const activeFeedTab: FeedTab = 'popular';

export const HomeFeedScreen = () => {
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      const { data, error } = await supabase.auth.signInAnonymously();

      console.log('guest login', data.user?.id, error);
    };

    init();
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
        {featuredPolls.map((poll) => (
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
