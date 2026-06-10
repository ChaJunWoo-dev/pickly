import { AppIconButton, AppText, Screen } from '@/components';
import { theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { getPointTransactions } from '../api/point-transactions';
import { PointTransactionSection } from '../components/point-transaction-section';
import { RankingList } from '../components/ranking-list';
import { RewardShopSection } from '../components/reward-shop-section';
import { RewardSummaryCard } from '../components/reward-summary-card';
import { SeasonRankCard } from '../components/season-rank-card';
import {
  getPointSummary,
  type PointSummary,
  type PointTransaction,
} from '../utils/point-transactions';

const initialPointSummary: PointSummary = {
  currentPoints: 0,
  monthlyEarnedPoints: 0,
  monthlySpentPoints: 0,
};

export const RewardRankingScreen = () => {
  const [pointSummary, setPointSummary] =
    useState<PointSummary>(initialPointSummary);
  const [pointTransactions, setPointTransactions] = useState<
    PointTransaction[]
  >([]);
  const recentPointTransactions = pointTransactions.slice(0, 3);

  useEffect(() => {
    const loadPointTransactions = async () => {
      try {
        const transactions = await getPointTransactions();
        setPointSummary(getPointSummary(transactions));
        setPointTransactions(transactions);
      } catch {
        setPointSummary(initialPointSummary);
        setPointTransactions([]);
      }
    };

    loadPointTransactions();
  }, []);

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

      <RewardSummaryCard summary={pointSummary} />
      <SeasonRankCard />
      <RankingList />
      <RewardShopSection />
      <PointTransactionSection
        transactions={recentPointTransactions}
        onPressViewAll={() => router.push('/rewards/transactions')}
      />
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
