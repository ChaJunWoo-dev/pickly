import { AppText, Card, Screen } from '@/components';
import { theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { ProfileSubpageHeader } from '../components/profile-subpage-header';

const historyItems = [
  {
    id: 'history-1',
    title: '오늘 하나만 산다면?',
    choice: '운동화',
    result: '58%',
    reward: '+1P',
    time: '오늘 09:41',
  },
  {
    id: 'history-2',
    title: '이번 주말엔 어떤 시간이 더 좋아?',
    choice: '집에서 푹 쉬기',
    result: '53%',
    reward: '+1P',
    time: '어제 21:15',
  },
  {
    id: 'history-3',
    title: '주말에 뭐 볼까?',
    choice: '드라마 정주행',
    result: '55%',
    reward: '+2P',
    time: '어제 18:22',
  },
];

export const ParticipationHistoryScreen = () => {
  return (
    <Screen
      scroll
      contentContainerStyle={styles.content}
      scrollViewProps={{ bounces: false }}
    >
      <ProfileSubpageHeader title="참여 기록" />

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
            이번 달 18개 투표에 참여했어요
          </AppText>
          <AppText tone="muted" variant="caption">
            참여 기록은 로그인 후 기기 변경에도 유지돼요.
          </AppText>
        </View>
      </Card>

      <View style={styles.list}>
        {historyItems.map((item) => (
          <Card key={item.id} style={styles.historyCard}>
            <View style={styles.historyHeader}>
              <AppText style={styles.historyTitle} variant="bodySmall" weight="bold">
                {item.title}
              </AppText>
              <AppText tone="muted" variant="caption">
                {item.time}
              </AppText>
            </View>

            <View style={styles.historyMeta}>
              <AppText tone="muted" variant="caption" weight="semibold">
                내 선택
              </AppText>
              <AppText variant="caption" weight="bold">
                {item.choice}
              </AppText>
            </View>

            <View style={styles.historyMeta}>
              <AppText tone="muted" variant="caption" weight="semibold">
                결과 비율
              </AppText>
              <AppText variant="caption" weight="bold">
                {item.result}
              </AppText>
            </View>

            <View style={styles.historyMeta}>
              <AppText tone="muted" variant="caption" weight="semibold">
                받은 포인트
              </AppText>
              <AppText tone="success" variant="caption" weight="bold">
                {item.reward}
              </AppText>
            </View>
          </Card>
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
  list: {
    gap: theme.spacing.md,
  },
  historyCard: {
    gap: theme.spacing.md,
  },
  historyHeader: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    justifyContent: 'space-between',
  },
  historyTitle: {
    flex: 1,
  },
  historyMeta: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
