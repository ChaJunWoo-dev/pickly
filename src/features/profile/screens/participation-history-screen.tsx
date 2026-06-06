import { AppText, Card, EmptyState, Screen } from '@/components';
import { theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ProfileSubpageHeader } from '../components/profile-subpage-header';

const participationTabs = [
  { id: 'all', label: '전체' },
  { id: 'active', label: '진행중' },
  { id: 'closed', label: '마감' },
] as const;

const participatedPolls = [
  {
    id: 'lunch-menu',
    category: '음식',
    question: '오늘 점심은 뭐 먹을까?',
    selectedOption: '돈카츠 정식',
    leadingOption: '돈카츠 정식',
    leadingPercent: 58,
    participants: 1248,
    reward: '+1P',
    status: '진행중',
    time: '2시간 남음',
  },
  {
    id: 'weekend-plan',
    category: '라이프',
    question: '이번 주말엔 어떤 시간이 더 좋아?',
    selectedOption: '집에서 푹 쉬기',
    leadingOption: '집에서 푹 쉬기',
    leadingPercent: 53,
    participants: 903,
    reward: '+1P',
    status: '진행중',
    time: '5시간 남음',
  },
];

export const ParticipationHistoryScreen = () => {
  const [selectedTabId, setSelectedTabId] =
    useState<(typeof participationTabs)[number]['id']>('all');
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

      {visiblePolls.length === 0 ? (
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
      ) : (
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
      )}
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
