import {
  AppButton,
  AppModal,
} from '@/components';
import { theme } from '@/constants/theme';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import type { RewardBadge } from '../utils/reward-badge';
import { RewardBadgeGrid } from './reward-badge-grid';
import { RewardBadgeRevealResult } from './reward-badge-reveal-result';

const BADGE_REVEAL_DURATION = 2000;
const BADGE_ROLLING_MIN_DELAY = 45;
const BADGE_ROLLING_MAX_DELAY = 240;

type RewardBadgeModalProps = {
  badges: RewardBadge[];
  isLoading?: boolean;
  isPurchasing?: boolean;
  price: number;
  revealedBadge?: RewardBadge | null;
  visible: boolean;
  onClose: () => void;
  onPurchase: () => void;
};

export const RewardBadgeModal = ({
  badges,
  isLoading = false,
  isPurchasing = false,
  price,
  revealedBadge,
  visible,
  onClose,
  onPurchase,
}: RewardBadgeModalProps) => {
  const [rollingBadgeIndex, setRollingBadgeIndex] = useState(0);
  const rollingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasBadges = badges.length > 0;
  const isRevealed = Boolean(revealedBadge);
  const rollingBadge = hasBadges ? badges[rollingBadgeIndex % badges.length] : null;

  useEffect(() => {
    if (rollingTimerRef.current) {
      clearTimeout(rollingTimerRef.current);
    }

    if (!isPurchasing || badges.length === 0) {
      return;
    }

    const startedAt = Date.now();

    const roll = () => {
      const elapsed = Date.now() - startedAt;
      const progress = Math.min(elapsed / BADGE_REVEAL_DURATION, 1);
      const nextDelay =
        BADGE_ROLLING_MIN_DELAY +
        (BADGE_ROLLING_MAX_DELAY - BADGE_ROLLING_MIN_DELAY) *
          progress *
          progress;

      setRollingBadgeIndex((prevIndex) => (prevIndex + 1) % badges.length);

      if (progress < 1) {
        rollingTimerRef.current = setTimeout(roll, nextDelay);
      }
    };

    rollingTimerRef.current = setTimeout(roll, BADGE_ROLLING_MIN_DELAY);

    return () => {
      if (rollingTimerRef.current) {
        clearTimeout(rollingTimerRef.current);
      }
    };
  }, [badges.length, isPurchasing]);

  return (
    <AppModal visible={visible} onClose={onClose}>
      <View style={styles.body}>
        {isPurchasing ? (
          <RewardBadgeRevealResult badge={rollingBadge} isRolling />
        ) : isRevealed && revealedBadge ? (
          <RewardBadgeRevealResult badge={revealedBadge} isRolling={false} />
        ) : (
          <RewardBadgeGrid badges={badges} isLoading={isLoading} />
        )}
      </View>

      <View style={styles.actions}>
        <AppButton
          size="md"
          style={styles.actionButton}
          variant="ghost"
          onPress={onClose}
        >
          취소
        </AppButton>
        <AppButton
          disabled={!hasBadges && !isRevealed}
          loading={isPurchasing}
          size="md"
          style={styles.actionButton}
          onPress={isRevealed ? onClose : onPurchase}
        >
          {isRevealed ? '확인' : `${price.toLocaleString()}P로 구매`}
        </AppButton>
      </View>
    </AppModal>
  );
};

const styles = StyleSheet.create({
  body: {
    gap: theme.spacing.md,
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    paddingTop: theme.spacing.xs,
  },
  actionButton: {
    flex: 1,
  },
});
