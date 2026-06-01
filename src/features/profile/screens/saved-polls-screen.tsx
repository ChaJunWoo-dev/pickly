import { AppText, Card, Screen } from '@/components';
import { featuredPolls } from '@/features/polls/data/mock-polls';
import { getPollTimeLeft } from '@/features/polls/utils/poll-deadline';
import { theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import { ProfileSubpageHeader } from '../components/profile-subpage-header';

export const SavedPollsScreen = () => {
  return (
    <Screen
      scroll
      contentContainerStyle={styles.content}
      scrollViewProps={{ bounces: false }}
    >
      <ProfileSubpageHeader title="저장한 투표" />

      <View style={styles.summary}>
        <AppText variant="bodySmall" weight="semibold">
          저장한 투표 {featuredPolls.length}개
        </AppText>
        <AppText tone="muted" variant="caption">
          관심 있는 투표를 다시 확인할 수 있어요.
        </AppText>
      </View>

      <View style={styles.list}>
        {featuredPolls.map((poll) => (
          <Pressable key={poll.id} accessibilityRole="button">
            <Card style={styles.pollCard}>
              <View style={styles.pollHeader}>
                <AppText variant="bodySmall" weight="bold">
                  {poll.question}
                </AppText>
                <Ionicons
                  color={theme.colors.primaryStrong}
                  name="bookmark"
                  size={18}
                />
              </View>
              <View style={styles.pollMeta}>
                <AppText tone="muted" variant="caption" weight="semibold">
                  {poll.participantCount.toLocaleString()}명 참여
                </AppText>
                <AppText tone="muted" variant="caption" weight="semibold">
                  {getPollTimeLeft(poll.expiresAt).timeLeft} 남음
                </AppText>
              </View>
            </Card>
          </Pressable>
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
  summary: {
    gap: theme.spacing.xs,
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
    gap: theme.spacing.md,
    justifyContent: 'space-between',
  },
  pollMeta: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
