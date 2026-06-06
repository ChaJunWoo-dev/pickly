import { AppText, Card, EmptyState, Screen } from '@/components';
import { theme } from '@/constants/theme';
import { ensureGuestSession } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { getPollCategory } from '@/features/polls/constants/config/poll-categories';
import { ProfileSubpageHeader } from '../components/profile-subpage-header';
import { getPollTimeLeft, isPollExpired } from '@/features/polls/utils/poll-deadline';
import {
  mapPollFeedRowToCardData,
  type PollFeedRow,
} from '@/features/polls/utils/poll-mappers';

const participationTabs = [
  { id: 'all', label: '전체' },
  { id: 'active', label: '진행중' },
  { id: 'closed', label: '마감' },
] as const;

type ParticipationTabId = (typeof participationTabs)[number]['id'];
type ParticipationStatus = '진행중' | '마감';

type ParticipationVoteRow = {
  id: string;
  option_id: string;
  created_at: string;
  polls: PollFeedRow | PollFeedRow[] | null;
};

type ParticipatedPoll = {
  id: string;
  category: string;
  question: string;
  selectedOption: string;
  leadingOption: string;
  leadingPercent: number;
  participants: number;
  reward: string;
  status: ParticipationStatus;
  time: string;
};

const getPollRow = (polls: ParticipationVoteRow['polls']) => {
  return Array.isArray(polls) ? polls[0] : polls;
};

const mapVoteRowToParticipatedPoll = (
  vote: ParticipationVoteRow,
  userId: string
): ParticipatedPoll | null => {
  const pollRow = getPollRow(vote.polls);

  if (!pollRow) {
    return null;
  }

  const poll = mapPollFeedRowToCardData(pollRow, userId);
  const selectedOption =
    poll.options.find((option) => option.id === vote.option_id)?.label ??
    '선택지 없음';
  const leadingOption = [...poll.options].sort(
    (a, b) => b.percent - a.percent
  )[0];
  const isClosed = poll.isClosed || isPollExpired(poll.expiresAt);

  return {
    id: poll.id,
    category: getPollCategory(poll.categoryId).label,
    question: poll.question,
    selectedOption,
    leadingOption: leadingOption?.label ?? '집계 전',
    leadingPercent: leadingOption?.percent ?? 0,
    participants: poll.participantCount,
    reward: `+${poll.rewardPoints}P`,
    status: isClosed ? '마감' : '진행중',
    time: isClosed ? '마감' : `${getPollTimeLeft(poll.expiresAt).timeLeft} 남음`,
  };
};

export const ParticipationHistoryScreen = () => {
  const [selectedTabId, setSelectedTabId] = useState<ParticipationTabId>('all');
  const [participatedPolls, setParticipatedPolls] = useState<
    ParticipatedPoll[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const visiblePolls =
    selectedTabId === 'all'
      ? participatedPolls
      : participatedPolls.filter((poll) => {
          return selectedTabId === 'active'
            ? poll.status === '진행중'
            : poll.status === '마감';
        });
  const selectedTab = participationTabs.find((tab) => tab.id === selectedTabId);
  const totalReward = participatedPolls.reduce((sum, poll) => {
    return sum + Number(poll.reward.replace(/[+P]/g, ''));
  }, 0);

  useEffect(() => {
    const getParticipationHistory = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const user = await ensureGuestSession();

        if (!user) {
          setParticipatedPolls([]);
          return;
        }

        const { data, error } = await supabase
          .from('poll_votes')
          .select(
            `
            id,
            option_id,
            created_at,
            polls (
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
            )
          `
          )
          .eq('user_id', user.id)
          .order('expires_at', {
            referencedTable: 'polls',
            ascending: true,
          });

        if (error) {
          throw error;
        }

        const nextParticipatedPolls = ((data ?? []) as ParticipationVoteRow[])
          .map((vote) => mapVoteRowToParticipatedPoll(vote, user.id))
          .filter((poll): poll is ParticipatedPoll => Boolean(poll));

        setParticipatedPolls(nextParticipatedPolls);
      } catch (error) {
        console.error('load participation history failed', error);
        setErrorMessage('참여한 투표를 불러오지 못했어요.');
      } finally {
        setIsLoading(false);
      }
    };

    void getParticipationHistory();
  }, []);

  return (
    <Screen
      scroll
      contentContainerStyle={styles.content}
      scrollViewProps={{ bounces: false }}
    >
      <ProfileSubpageHeader title="참여한 투표" />

      <Card style={styles.summaryCard}>
        <View style={styles.summaryIcon}>
          <Ionicons
            color={theme.colors.primaryStrong}
            name="checkmark-done-outline"
            size={24}
          />
        </View>

        <View style={styles.summaryCopy}>
          <AppText variant="bodySmall" weight="bold">
            이번 달 {participatedPolls.length}개 투표에 참여했어요
          </AppText>
          <AppText tone="muted" variant="caption">
            받은 보상은 총 +{totalReward}P예요.
          </AppText>
        </View>
      </Card>

      <View style={styles.tabList}>
        {participationTabs.map((tab) => {
          const isSelected = tab.id === selectedTabId;

          return (
            <Pressable
              key={tab.id}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              onPress={() => setSelectedTabId(tab.id)}
              style={[styles.tabButton, isSelected && styles.selectedTabButton]}
            >
              <AppText
                tone={isSelected ? 'primary' : 'muted'}
                variant="caption"
                weight="semibold"
              >
                {tab.label}
              </AppText>
            </Pressable>
          );
        })}
      </View>

      {isLoading ? (
        <AppText tone="muted" variant="bodySmall">
          참여한 투표를 불러오는 중이에요.
        </AppText>
      ) : null}

      {!isLoading && errorMessage ? (
        <Card style={styles.emptyCard}>
          <EmptyState
            description="잠시 후 다시 시도해 주세요."
            icon={
              <Ionicons
                color={theme.colors.textSubtle}
                name="alert-circle-outline"
                size={34}
              />
            }
            title={errorMessage}
          />
        </Card>
      ) : null}

      {!isLoading && !errorMessage && visiblePolls.length === 0 ? (
        <Card style={styles.emptyCard}>
          <EmptyState
            description={`${selectedTab?.label ?? '선택한'} 참여 투표가 생기면 여기에 모아둘게요.`}
            icon={
              <Ionicons
                color={theme.colors.textSubtle}
                name="file-tray-outline"
                size={34}
              />
            }
            title={`아직 ${selectedTab?.label ?? '선택한'} 참여 투표가 없어요`}
          />
        </Card>
      ) : null}

      {!isLoading && !errorMessage && visiblePolls.length > 0 ? (
        <View style={styles.list}>
          {visiblePolls.map((poll) => {
            const isClosed = poll.status === '마감';

            return (
              <Pressable key={poll.id} accessibilityRole="button">
                <Card style={styles.pollCard}>
                  <View style={styles.pollHeader}>
                    <View style={styles.categoryPill}>
                      <AppText tone="accent" variant="caption" weight="bold">
                        {poll.category}
                      </AppText>
                    </View>

                    <View
                      style={[
                        styles.statusPill,
                        isClosed && styles.closedStatusPill,
                      ]}
                    >
                      <Ionicons
                        color={
                          isClosed
                            ? theme.colors.textMuted
                            : theme.colors.primaryStrong
                        }
                        name={isClosed ? 'lock-closed-outline' : 'time-outline'}
                        size={13}
                      />
                      <AppText
                        tone={isClosed ? 'muted' : 'success'}
                        variant="caption"
                        weight="semibold"
                      >
                        {poll.time}
                      </AppText>
                    </View>
                  </View>

                  <AppText variant="body" weight="bold">
                    {poll.question}
                  </AppText>

                  <View style={styles.metaRow}>
                    <View style={styles.metaItem}>
                      <AppText tone="muted" variant="caption" weight="semibold">
                        내 선택
                      </AppText>
                      <AppText variant="caption" weight="bold">
                        {poll.selectedOption}
                      </AppText>
                    </View>

                    <View style={styles.rewardPill}>
                      <AppText tone="reward" variant="caption" weight="bold">
                        {poll.reward}
                      </AppText>
                    </View>
                  </View>

                  <View style={styles.resultBlock}>
                    <View style={styles.resultHeader}>
                      <AppText tone="muted" variant="caption" weight="semibold">
                        현재 1위
                      </AppText>
                      <AppText variant="caption" weight="bold">
                        {poll.leadingPercent}%
                      </AppText>
                    </View>

                    <View style={styles.progressTrack}>
                      <View
                        style={[
                          styles.progressFill,
                          { width: `${poll.leadingPercent}%` },
                        ]}
                      />
                    </View>

                    <View style={styles.resultFooter}>
                      <AppText variant="caption" weight="semibold">
                        {poll.leadingOption}
                      </AppText>
                      <AppText tone="muted" variant="caption">
                        {poll.participants.toLocaleString()}명 참여
                      </AppText>
                    </View>
                  </View>
                </Card>
              </Pressable>
            );
          })}
        </View>
      ) : null}
    </Screen>
  );
};

const styles = StyleSheet.create({
  content: {
    gap: theme.spacing.xl,
    paddingBottom: theme.spacing.xxxl,
  },
  summaryCard: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  summaryIcon: {
    alignItems: 'center',
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radius.full,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  summaryCopy: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  tabList: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    flexDirection: 'row',
    padding: theme.spacing.xxs,
  },
  tabButton: {
    alignItems: 'center',
    borderRadius: theme.radius.full,
    flex: 1,
    justifyContent: 'center',
    minHeight: 34,
  },
  selectedTabButton: {
    backgroundColor: theme.colors.primarySoft,
  },
  emptyCard: {
    paddingVertical: theme.spacing.xl,
  },
  list: {
    gap: theme.spacing.md,
  },
  pollCard: {
    gap: theme.spacing.md,
  },
  pollHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryPill: {
    backgroundColor: theme.colors.secondarySoft,
    borderRadius: theme.radius.full,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  statusPill: {
    alignItems: 'center',
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radius.full,
    flexDirection: 'row',
    gap: theme.spacing.xxs,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  closedStatusPill: {
    backgroundColor: theme.colors.surfaceMuted,
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.md,
    justifyContent: 'space-between',
  },
  metaItem: {
    flex: 1,
    gap: theme.spacing.xxs,
  },
  rewardPill: {
    backgroundColor: theme.colors.rewardSoft,
    borderRadius: theme.radius.full,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  resultBlock: {
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radius.sm,
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
  },
  resultHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressTrack: {
    backgroundColor: theme.colors.border,
    borderRadius: theme.radius.full,
    height: 6,
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: theme.colors.primaryStrong,
    borderRadius: theme.radius.full,
    height: '100%',
  },
  resultFooter: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
