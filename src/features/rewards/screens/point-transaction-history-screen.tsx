import { Card, EmptyState, LoadingState, Screen } from '@/components';
import { theme } from '@/constants/theme';
import { useThemeMode } from '@/contexts/theme-mode';
import { ProfileSubpageHeader } from '@/features/profile/components/profile-subpage-header';
import { showErrorToast } from '@/lib/toast';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { getPointTransactions } from '../api/point-transactions';
import { PointTransactionSection } from '../components/point-transaction-section';
import type { PointTransaction } from '../utils/point-transactions';

export const PointTransactionHistoryScreen = () => {
  const { appTheme } = useThemeMode();
  const [transactions, setTransactions] = useState<PointTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadTransactions = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const nextTransactions = await getPointTransactions();

        setTransactions(nextTransactions);
      } catch {
        showErrorToast('포인트 내역을 불러오지 못했어요');
        setErrorMessage('포인트 내역을 불러오지 못했어요');
        setTransactions([]);
      } finally {
        setIsLoading(false);
      }
    };

    void loadTransactions();
  }, []);

  return (
    <Screen
      scroll
      contentContainerStyle={styles.content}
      scrollViewProps={{ bounces: false }}
    >
      <ProfileSubpageHeader title="포인트 내역" />

      {isLoading ? (
        <Card style={styles.emptyCard}>
          <LoadingState title="포인트 내역을 불러오는 중이에요" />
        </Card>
      ) : null}

      {!isLoading && errorMessage ? (
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

      {!isLoading && !errorMessage && transactions.length === 0 ? (
        <Card style={styles.emptyCard}>
          <EmptyState
            description="포인트가 쌓이면 여기에 모아둘게요"
            icon={
              <Ionicons
                color={appTheme.colors.textSubtle}
                name="receipt-outline"
                size={34}
              />
            }
            title="아직 포인트 내역이 없어요"
          />
        </Card>
      ) : null}

      {!isLoading && !errorMessage && transactions.length > 0 ? (
        <PointTransactionSection
          showViewAll={false}
          transactions={transactions}
        />
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
});
