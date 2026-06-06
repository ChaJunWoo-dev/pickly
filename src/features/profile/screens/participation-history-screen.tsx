import { AppText, Card, EmptyState, Screen } from '@/components';
import { theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { getParticipationHistory } from '../api/get-participation-history';
import { ParticipatedPollCard } from '../components/participated-poll-card';
import { ParticipationFilterTabs } from '../components/participation-filter-tabs';
import { ParticipationSummaryCard } from '../components/participation-summary-card';
import { ProfileSubpageHeader } from '../components/profile-subpage-header';
import {
  getTotalParticipationReward,
  getVisibleParticipatedPolls,
  participationTabs,
  type ParticipatedPoll,
  type ParticipationTabId,
} from '../utils/participation-history';

export const ParticipationHistoryScreen = () => {
  const [selectedTabId, setSelectedTabId] = useState<ParticipationTabId>('all');
  const [participatedPolls, setParticipatedPolls] = useState<
    ParticipatedPoll[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const visiblePolls = getVisibleParticipatedPolls(
    participatedPolls,
    selectedTabId
  );
  const selectedTab = participationTabs.find((tab) => tab.id === selectedTabId);
  const totalReward = getTotalParticipationReward(participatedPolls);

  useEffect(() => {
    const loadParticipationHistory = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const nextParticipatedPolls = await getParticipationHistory();

        setParticipatedPolls(nextParticipatedPolls);
      } catch (error) {
        console.error('load participation history failed', error);
        setErrorMessage('참여한 투표를 불러오지 못했어요.');
      } finally {
        setIsLoading(false);
      }
    };

    void loadParticipationHistory();
  }, []);

  return (
    <Screen
      scroll
      contentContainerStyle={styles.content}
      scrollViewProps={{ bounces: false }}
    >
      <ProfileSubpageHeader title="참여한 투표" />

      <ParticipationSummaryCard
        pollCount={participatedPolls.length}
        totalReward={totalReward}
      />

      <ParticipationFilterTabs
        value={selectedTabId}
        onChange={setSelectedTabId}
      />

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
            description={`${
              selectedTab?.label ?? '선택한'
            } 참여 투표가 생기면 여기에 모아둘게요.`}
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
          {visiblePolls.map((poll) => (
            <ParticipatedPollCard
              key={poll.id}
              poll={poll}
              onPress={() => router.push(`/poll/${poll.id}`)}
            />
          ))}
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
  emptyCard: {
    paddingVertical: theme.spacing.xl,
  },
  list: {
    gap: theme.spacing.md,
  },
});
