import { AppText, Card } from '@/components';
import { theme } from '@/constants/theme';
import { useThemeMode } from '@/contexts/theme-mode';
import { StyleSheet, View } from 'react-native';
import { useRewardShop } from '../hooks/use-reward-shop';
import type { PointTransaction } from '../utils/point-transactions';
import type { RewardBadge } from '../utils/reward-badge';
import type { RewardItem } from '../utils/reward-items';
import { NicknameModal } from './nickname-modal';
import { RewardBadgeModal } from './reward-badge-modal';
import { RewardShopItem } from './reward-shop-item';
import { VoteBoosterModal } from './vote-booster-modal';

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
  const {
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
  } = useRewardShop({
    currentPoints,
    rewardItems,
    onPurchaseSuccess,
  });

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
              <RewardShopItem
                key={item.id}
                isUnavailable={isUnavailable}
                item={item}
                onPress={handlePressReward}
              />
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
