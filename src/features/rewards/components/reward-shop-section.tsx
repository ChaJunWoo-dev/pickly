import { AppText, Card } from '@/components';
import { theme } from '@/constants/theme';
import { useThemeMode } from '@/contexts/theme-mode';
import {
  hasErrorCode,
  POSTGRES_UNIQUE_VIOLATION_CODE,
} from '@/lib/database-errors';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { getBoostablePolls } from '../api/boostable-polls';
import {
  NICKNAME_CHANGE_PRICE,
  purchaseNicknameChange,
} from '../api/purchase-nickname-change';
import { purchaseRandomBadge } from '../api/purchase-random-badge';
import { purchaseVoteBooster } from '../api/purchase-vote-booster';
import { getRewardBadges } from '../api/reward-badge';
import type { PointTransaction } from '../utils/point-transactions';
import type { RewardBadge } from '../utils/reward-badge';
import type { BoostablePoll } from '../utils/boostable-polls';
import type { RewardItem } from '../utils/reward-items';
import { NicknameModal } from './nickname-modal';
import { RewardBadgeModal } from './reward-badge-modal';
import { VoteBoosterModal } from './vote-booster-modal';

const BADGE_REVEAL_DURATION = 2000;

type RewardShopSectionProps = {
  rewardItems: RewardItem[];
  currentPoints: number;
  onPurchaseSuccess?: (purchase: {
    badge?: RewardBadge;
    transaction: PointTransaction;
  }) => void;
};

export const RewardShopSection = ({
  rewardItems,
  currentPoints,
  onPurchaseSuccess,
}: RewardShopSectionProps) => {
  const { appTheme } = useThemeMode();
  const [isNicknameModalVisible, setIsNicknameModalVisible] = useState(false);
  const [isPurchasingNickname, setIsPurchasingNickname] = useState(false);
  const [badges, setBadges] = useState<RewardBadge[]>([]);
  const [isBadgeModalVisible, setIsBadgeModalVisible] = useState(false);
  const [isLoadingBadges, setIsLoadingBadges] = useState(false);
  const [isPurchasingBadge, setIsPurchasingBadge] = useState(false);
  const [revealedBadge, setRevealedBadge] = useState<RewardBadge | null>(null);
  const [boostablePolls, setBoostablePolls] = useState<BoostablePoll[]>([]);
  const [isBoosterModalVisible, setIsBoosterModalVisible] = useState(false);
  const [isLoadingBoostablePolls, setIsLoadingBoostablePolls] =
    useState(false);
  const [isPurchasingBooster, setIsPurchasingBooster] = useState(false);
  const [selectedBoosterPollId, setSelectedBoosterPollId] = useState<
    string | null
  >(null);
  const [toastMessage, setToastMessage] = useState('');
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const randomBadgeItem = rewardItems.find(
    (item) => item.type === 'random_badge'
  );
  const voteBoosterItem = rewardItems.find(
    (item) => item.type === 'vote_booster'
  );

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const showToast = (message: string) => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }

    setToastMessage(message);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage('');
    }, 1800);
  };

  const closeNicknameModal = () => {
    setIsNicknameModalVisible(false);
  };

  const closeBadgeModal = () => {
    setIsBadgeModalVisible(false);
    setIsPurchasingBadge(false);
    setRevealedBadge(null);
  };

  const closeBoosterModal = () => {
    setIsBoosterModalVisible(false);
    setIsPurchasingBooster(false);
    setSelectedBoosterPollId(null);
  };

  const handlePurchaseBooster = async () => {
    if (!selectedBoosterPollId || isPurchasingBooster) return;

    if (currentPoints < (voteBoosterItem?.price ?? 0)) {
      showToast('포인트가 부족해요');
      return;
    }

    setIsPurchasingBooster(true);

    try {
      const transaction = await purchaseVoteBooster(selectedBoosterPollId);
      onPurchaseSuccess?.({ transaction });
      setBoostablePolls((prevPolls) =>
        prevPolls.map((poll) =>
          poll.id === selectedBoosterPollId
            ? {
                ...poll,
                boostedUntil: new Date(
                  Date.now() + 6 * 60 * 60 * 1000
                ).toISOString(),
              }
            : poll
        )
      );
      closeBoosterModal();
      showToast('투표 부스터가 적용됐어요');
    } catch {
      Alert.alert('부스터 구매 실패', '투표 부스터를 적용하지 못했어요');
    } finally {
      setIsPurchasingBooster(false);
    }
  };

  const handlePurchaseBadge = async () => {
    if (isPurchasingBadge || badges.length === 0) return;

    if (currentPoints < (randomBadgeItem?.price ?? 0)) {
      showToast('포인트가 부족해요');
      return;
    }

    setRevealedBadge(null);
    setIsPurchasingBadge(true);

    try {
      const [result] = await Promise.all([
        purchaseRandomBadge(),
        new Promise((resolve) => {
          setTimeout(resolve, BADGE_REVEAL_DURATION);
        }),
      ]);

      onPurchaseSuccess?.({
        badge: result.badge,
        transaction: result.transaction,
      });
      setRevealedBadge(result.badge);
    } catch {
      Alert.alert('배지 구매 실패', '랜덤 배지를 구매하지 못했어요');
    } finally {
      setIsPurchasingBadge(false);
    }
  };

  const handleSubmitNickname = async (nickname: string) => {
    if (isPurchasingNickname) return;

    if (currentPoints < NICKNAME_CHANGE_PRICE) {
      showToast('포인트가 부족해요');
      return;
    }

    setIsPurchasingNickname(true);

    try {
      const transaction = await purchaseNicknameChange(nickname);
      onPurchaseSuccess?.({ transaction });
      closeNicknameModal();
      showToast('닉네임이 변경됐어요');
    } catch (error) {
      if (hasErrorCode(error, POSTGRES_UNIQUE_VIOLATION_CODE)) {
        Alert.alert('닉네임 변경 실패', '이미 사용 중인 닉네임이에요');
        return;
      }

      Alert.alert('닉네임 변경 실패', '닉네임을 변경하지 못했어요');
    } finally {
      setIsPurchasingNickname(false);
    }
  };

  const handlePressReward = async (reward: RewardItem[][number]) => {
    if (currentPoints < reward.price) {
      showToast('포인트가 부족해요');
      return;
    }

    if (reward.type === 'nickname_change') {
      setIsNicknameModalVisible(true);
    }

    if (reward.type === 'random_badge') {
      setIsBadgeModalVisible(true);

      if (badges.length > 0) {
        return;
      }

      setIsLoadingBadges(true);

      try {
        const nextBadges = await getRewardBadges();
        setBadges(nextBadges);
      } catch {
        setBadges([]);
      } finally {
        setIsLoadingBadges(false);
      }
    }

    if (reward.type === 'vote_booster') {
      setIsBoosterModalVisible(true);

      if (boostablePolls.length > 0) {
        return;
      }

      setIsLoadingBoostablePolls(true);

      try {
        const nextPolls = await getBoostablePolls();
        setBoostablePolls(nextPolls);
      } catch {
        setBoostablePolls([]);
      } finally {
        setIsLoadingBoostablePolls(false);
      }
    }
  };

  return (
    <>
      <Card style={styles.card}>
        <View style={styles.header}>
          <AppText variant="bodySmall" weight="bold">
            리워드 상점
          </AppText>
        </View>

        <View style={styles.items}>
          {rewardItems.map((item) => {
            const isUnavailable = currentPoints < item.price;

            return (
              <Pressable
                key={item.id}
                accessibilityRole="button"
                onPress={() => handlePressReward(item)}
                style={({ pressed }) => [
                  styles.item,
                  {
                    backgroundColor: isUnavailable
                      ? appTheme.colors.surfaceMuted
                      : appTheme.colors.surface,
                    borderColor: appTheme.colors.border,
                  },
                  isUnavailable && styles.itemUnavailable,
                  pressed && styles.itemPressed,
                ]}
              >
                <Ionicons
                  color={
                    isUnavailable
                      ? appTheme.colors.textSubtle
                      : item.type === 'random_badge'
                        ? appTheme.colors.secondary
                        : appTheme.colors.reward
                  }
                  name={item.icon as keyof typeof Ionicons.glyphMap}
                  size={42}
                />
                <AppText
                  align="center"
                  tone={isUnavailable ? 'subtle' : 'primary'}
                  variant="caption"
                  weight="bold"
                >
                  {item.title}
                </AppText>
                <AppText
                  align="center"
                  tone={isUnavailable ? 'subtle' : 'primary'}
                  variant="bodySmall"
                  weight="bold"
                >
                  {item.price.toLocaleString()}P
                </AppText>
              </Pressable>
            );
          })}
        </View>

        {!!toastMessage && (
          <View
            style={[styles.toast, { backgroundColor: appTheme.colors.text }]}
          >
            <AppText tone="inverse" variant="caption" weight="semibold">
              {toastMessage}
            </AppText>
          </View>
        )}
      </Card>

      <NicknameModal
        isSubmitting={isPurchasingNickname}
        visible={isNicknameModalVisible}
        onClose={closeNicknameModal}
        onSubmit={handleSubmitNickname}
      />
      <RewardBadgeModal
        badges={badges}
        isLoading={isLoadingBadges}
        isPurchasing={isPurchasingBadge}
        price={randomBadgeItem?.price ?? 0}
        revealedBadge={revealedBadge}
        visible={isBadgeModalVisible}
        onClose={closeBadgeModal}
        onPurchase={handlePurchaseBadge}
      />
      <VoteBoosterModal
        isLoading={isLoadingBoostablePolls}
        isPurchasing={isPurchasingBooster}
        polls={boostablePolls}
        price={voteBoosterItem?.price ?? 0}
        selectedPollId={selectedBoosterPollId}
        visible={isBoosterModalVisible}
        onClose={closeBoosterModal}
        onPurchase={handlePurchaseBooster}
        onSelectPoll={setSelectedBoosterPollId}
      />
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    gap: theme.spacing.lg,
    position: 'relative',
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  items: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  item: {
    alignItems: 'center',
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    flex: 1,
    gap: theme.spacing.sm,
    minHeight: 132,
    justifyContent: 'center',
    padding: theme.spacing.sm,
  },
  itemUnavailable: {
    opacity: 0.58,
  },
  itemPressed: {
    opacity: 0.7,
  },
  toast: {
    alignSelf: 'center',
    borderRadius: theme.radius.full,
    bottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    position: 'absolute',
    zIndex: 1,
  },
});
