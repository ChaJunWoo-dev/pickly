import {
  hasErrorCode,
  POSTGRES_UNIQUE_VIOLATION_CODE,
} from '@/lib/database-errors';
import { useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { getBoostablePolls } from '../api/boostable-polls';
import {
  NICKNAME_CHANGE_PRICE,
  purchaseNicknameChange,
} from '../api/purchase-nickname-change';
import { purchaseRandomBadge } from '../api/purchase-random-badge';
import { purchaseVoteBooster } from '../api/purchase-vote-booster';
import { getRewardBadges } from '../api/reward-badge';
import type { BoostablePoll } from '../utils/boostable-polls';
import type { PointTransaction } from '../utils/point-transactions';
import type { RewardBadge } from '../utils/reward-badge';
import type { RewardItem } from '../utils/reward-items';

const BADGE_REVEAL_DURATION = 2000;

type RewardPurchaseResult = {
  badge?: RewardBadge;
  transaction: PointTransaction;
};

type UseRewardShopParams = {
  currentPoints: number;
  rewardItems: RewardItem[];
  onPurchaseSuccess?: (purchase: RewardPurchaseResult) => void;
};

export const useRewardShop = ({
  currentPoints,
  rewardItems,
  onPurchaseSuccess,
}: UseRewardShopParams) => {
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

  const handlePressReward = async (reward: RewardItem) => {
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

  return {
    badges,
    boostablePolls,
    closeBadgeModal,
    closeBoosterModal,
    closeNicknameModal,
    handlePressReward,
    handlePurchaseBadge,
    handlePurchaseBooster,
    handleSubmitNickname,
    isBadgeModalVisible,
    isBoosterModalVisible,
    isLoadingBadges,
    isLoadingBoostablePolls,
    isNicknameModalVisible,
    isPurchasingBadge,
    isPurchasingBooster,
    isPurchasingNickname,
    randomBadgeItem,
    revealedBadge,
    selectedBoosterPollId,
    setSelectedBoosterPollId,
    toastMessage,
    voteBoosterItem,
  };
};
