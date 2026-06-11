import { AppIconButton, AppText, Screen } from '@/components';
import { theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { getPointTransactions } from '../api/point-transactions';
import {
  getMyWeeklyRanking,
  getWeeklyRankings,
  type UserRanking,
} from '../api/ranking';
import { PointTransactionSection } from '../components/point-transaction-section';
import { RankingList } from '../components/ranking-list';
import { RewardShopSection } from '../components/reward-shop-section';
import { RewardSummaryCard } from '../components/reward-summary-card';
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
  const [rankings, setRankings] = useState<UserRanking[]>([]);
  const [myRanking, setMyRanking] = useState<UserRanking | null>(null);
  const [pointSummary, setPointSummary] =
    useState<PointSummary>(initialPointSummary);
  const [pointTransactions, setPointTransactions] = useState<
    PointTransaction[]
  >([]);
  const recentPointTransactions = pointTransactions.slice(0, 3);

  const handlePurchaseSuccess = (transaction: PointTransaction) => {
    setPointTransactions((prevTransactions) => [
      transaction,
      ...prevTransactions,
    ]);
    setPointSummary((prevSummary) => ({
      currentPoints: prevSummary.currentPoints + transaction.amount,
      monthlyEarnedPoints:
        transaction.amount > 0
          ? prevSummary.monthlyEarnedPoints + transaction.amount
          : prevSummary.monthlyEarnedPoints,
      monthlySpentPoints:
        transaction.amount < 0
          ? prevSummary.monthlySpentPoints + Math.abs(transaction.amount)
          : prevSummary.monthlySpentPoints,
    }));
  };

  useEffect(() => {
    const loadRewardScreenData = async () => {
      try {
        const [transactions, ranking, myRanking] = await Promise.all([
          getPointTransactions(),
          getWeeklyRankings(),
          getMyWeeklyRanking(),
        ]);

        setPointSummary(getPointSummary(transactions));
        setPointTransactions(transactions);
        setRankings(ranking);
        setMyRanking(myRanking);
      } catch {
        setPointSummary(initialPointSummary);
        setPointTransactions([]);
        setRankings([]);
        setMyRanking(null);
      }
    };

    void loadRewardScreenData();
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
      <RankingList myRanking={myRanking} rankings={rankings} />
      <RewardShopSection
        currentPoints={pointSummary.currentPoints}
        onPurchaseSuccess={handlePurchaseSuccess}
      />
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
