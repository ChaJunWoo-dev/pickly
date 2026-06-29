import { AppIconButton, AppText, Screen } from '@/components';
import { theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { PointTransactionSection } from '../components/point-transaction-section';
import { RankingList } from '../components/ranking-list';
import { RewardShopSection } from '../components/reward-shop-section';
import { RewardSummaryCard } from '../components/reward-summary-card';
import { SeasonRankCard } from '../components/season-rank-card';
import { StyleSheet, View } from 'react-native';

export const RewardRankingScreen = () => {
  return (
    <Screen
      scroll
      contentContainerStyle={styles.content}
      scrollViewProps={{ bounces: false }}
    >
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        <AppText variant="subtitle" weight="bold">
          리워드 & 랭킹
        </AppText>
        <AppIconButton
          icon={
            <Ionicons
              color={theme.colors.textMuted}
              name="help-circle-outline"
              size={24}
            />
          }
          size="sm"
          variant="plain"
        />
      </View>

      <RewardSummaryCard />
      <SeasonRankCard />
      <RankingList />
      <RewardShopSection />
      <PointTransactionSection />
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
  headerSpacer: {
    height: 32,
    width: 32,
  },
});
