import {
  AppButton,
  AppModal,
  AppText,
  EmptyInfoRow,
  LoadingState,
} from '@/components';
import { theme } from '@/constants/theme';
import { useThemeMode } from '@/contexts/theme-mode';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import type { RewardBadge } from '../utils/reward-badge';

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
  const { appTheme } = useThemeMode();
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
          <View style={styles.revealResult}>
            <View
              style={[
                styles.revealIcon,
                { backgroundColor: appTheme.colors.secondarySoft },
              ]}
            >
              <Ionicons
                color={appTheme.colors.secondary}
                name={rollingBadge?.icon ?? 'sparkles'}
                size={46}
              />
            </View>
            <View style={styles.revealCopy}>
              <AppText align="center" variant="bodySmall" weight="bold">
                배지를 고르는 중이에요
              </AppText>
              <AppText align="center" tone="muted" variant="caption">
                {rollingBadge?.label ?? '어떤 배지가 나올까요?'}
              </AppText>
            </View>
          </View>
        ) : isRevealed && revealedBadge ? (
          <View style={styles.revealResult}>
            <AppText align="center" variant="bodySmall" weight="bold">
              새 배지를 획득했어요
            </AppText>
            <View
              style={[
                styles.revealedBadgeIcon,
                { backgroundColor: appTheme.colors.secondarySoft },
              ]}
            >
              <Ionicons
                color={appTheme.colors.secondary}
                name={revealedBadge.icon}
                size={50}
              />
            </View>
            <AppText align="center" variant="subtitle" weight="bold">
              {revealedBadge.label}
            </AppText>
          </View>
        ) : (
          <View style={styles.badgeSection}>
            <AppText variant="bodySmall" weight="bold">
              획득 가능한 배지
            </AppText>

            {isLoading ? (
              <LoadingState
                style={styles.feedback}
                title="배지 목록을 불러오는 중이에요"
              />
            ) : hasBadges ? (
              <View style={styles.badgeGrid}>
                {badges.map((badge) => (
                  <View
                    key={badge.id}
                    style={[
                      styles.badgeItem,
                      {
                        backgroundColor: appTheme.colors.surfaceMuted,
                        borderColor: appTheme.colors.border,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.badgeIcon,
                        { backgroundColor: appTheme.colors.secondarySoft },
                      ]}
                    >
                      <Ionicons
                        color={appTheme.colors.secondary}
                        name={badge.icon}
                        size={24}
                      />
                    </View>
                    <AppText align="center" variant="bodySmall" weight="bold">
                      {badge.label}
                    </AppText>
                  </View>
                ))}
              </View>
            ) : (
              <EmptyInfoRow
                description="잠시 후 다시 시도해주세요"
                icon={
                  <Ionicons
                    color={appTheme.colors.textSubtle}
                    name="ribbon-outline"
                    size={18}
                  />
                }
                iconBackgroundColor={appTheme.colors.surfaceMuted}
                title="등록된 배지가 없어요"
              />
            )}
          </View>
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
  badgeSection: {
    gap: theme.spacing.md,
  },
  badgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  badgeItem: {
    alignItems: 'center',
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    gap: theme.spacing.sm,
    minHeight: 98,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: theme.spacing.md,
    width: '30.5%',
  },
  badgeIcon: {
    alignItems: 'center',
    borderRadius: theme.radius.full,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  feedback: {
    paddingVertical: theme.spacing.lg,
  },
  revealResult: {
    alignItems: 'center',
    gap: theme.spacing.md,
    minHeight: 180,
    justifyContent: 'center',
    paddingVertical: theme.spacing.lg,
  },
  revealIcon: {
    alignItems: 'center',
    borderRadius: theme.radius.full,
    height: 88,
    justifyContent: 'center',
    width: 88,
  },
  revealCopy: {
    gap: theme.spacing.xxs,
  },
  revealedBadgeIcon: {
    alignItems: 'center',
    borderRadius: theme.radius.full,
    height: 96,
    justifyContent: 'center',
    width: 96,
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
