import { AppText, Card, EmptyState, LoadingState, Screen } from '@/components';
import { theme } from '@/constants/theme';
import { useThemeMode } from '@/contexts/theme-mode';
import { getSavedPolls } from '@/features/polls/api/poll-saves';
import {
  PollCard,
  type PollCardData,
} from '@/features/polls/components/poll-card';
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ProfileSubpageHeader } from '../components/profile-subpage-header';

const SavedPollsLoading = () => {
  return (
    <Card style={styles.emptyCard}>
      <LoadingState title="저장한 투표를 불러오는 중이에요" />
    </Card>
  );
};

export const SavedPollsScreen = () => {
  const isFocused = useIsFocused();
  const { appTheme } = useThemeMode();
  const [savedPolls, setSavedPolls] = useState<PollCardData[]>([]);
  const [isLoadingSavedPolls, setIsLoadingSavedPolls] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadSavedPolls = useCallback(async () => {
    setIsLoadingSavedPolls(true);
    setErrorMessage(null);

    try {
      const nextSavedPolls = await getSavedPolls();

      setSavedPolls(nextSavedPolls);
    } catch {
      setErrorMessage('저장한 투표를 불러오지 못했어요');
    } finally {
      setIsLoadingSavedPolls(false);
    }
  }, []);

  useEffect(() => {
    if (!isFocused) return;

    void loadSavedPolls();
  }, [isFocused, loadSavedPolls]);

  const handleOpenPoll = (pollId: string) => {
    router.push({
      pathname: '/poll/[id]',
      params: { id: pollId },
    });
  };

  return (
    <Screen
      scroll
      contentContainerStyle={styles.content}
      scrollViewProps={{ bounces: false }}
    >
      <ProfileSubpageHeader title="저장한 투표" />

      <View style={styles.summary}>
        <AppText variant="bodySmall" weight="semibold">
          저장한 투표 {savedPolls.length}개
        </AppText>
        <AppText tone="muted" variant="caption">
          관심 있는 투표를 다시 확인할 수 있어요
        </AppText>
      </View>

      {isLoadingSavedPolls ? <SavedPollsLoading /> : null}

      {!isLoadingSavedPolls && errorMessage ? (
        <Card style={styles.emptyCard}>
          <EmptyState
            description="잠시 후 다시 시도해 주세요"
            icon={
              <Ionicons
                color={appTheme.colors.textSubtle}
                name="alert-circle-outline"
                size={34}
              />
            }
            title={errorMessage}
          />
        </Card>
      ) : null}

      {!isLoadingSavedPolls && !errorMessage && savedPolls.length === 0 ? (
        <Card style={styles.emptyCard}>
          <EmptyState
            description="관심 있는 투표의 북마크를 누르면 여기에 모아둘게요"
            icon={
              <Ionicons
                color={appTheme.colors.textSubtle}
                name="bookmark-outline"
                size={34}
              />
            }
            title="아직 저장한 투표가 없어요"
          />
        </Card>
      ) : null}

      {!isLoadingSavedPolls && !errorMessage && savedPolls.length > 0 ? (
        <View style={styles.list}>
          {savedPolls.map((poll) => (
            <PollCard key={poll.id} onOpen={handleOpenPoll} poll={poll} />
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
  summary: {
    gap: theme.spacing.xs,
  },
  emptyCard: {
    paddingVertical: theme.spacing.xl,
  },
  list: {
    gap: theme.spacing.lg,
  },
});
