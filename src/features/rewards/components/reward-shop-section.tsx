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
import {
  NICKNAME_CHANGE_PRICE,
  purchaseNicknameChange,
} from '../api/purchase-nickname-change';
import type { PointTransaction } from '../utils/point-transactions';
import { RewardItem } from '../utils/reward-items';
import { NicknameModal } from './nickname-modal';

type RewardShopSectionProps = {
  rewardItems: RewardItem[];
  currentPoints: number;
  onPurchaseSuccess?: (transaction: PointTransaction) => void;
};

export const RewardShopSection = ({
  rewardItems,
  currentPoints,
  onPurchaseSuccess,
}: RewardShopSectionProps) => {
  const { appTheme } = useThemeMode();
  const [isNicknameModalVisible, setIsNicknameModalVisible] = useState(false);
  const [isPurchasingNickname, setIsPurchasingNickname] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const handleSubmitNickname = async (nickname: string) => {
    if (isPurchasingNickname) return;

    if (currentPoints < NICKNAME_CHANGE_PRICE) {
      showToast('포인트가 부족해요');
      return;
    }

    setIsPurchasingNickname(true);

    try {
      const transaction = await purchaseNicknameChange(nickname);
      onPurchaseSuccess?.(transaction);
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

  const handlePressReward = (reward: RewardItem[][number]) => {
    if (currentPoints < reward.price) {
      showToast('포인트가 부족해요');
      return;
    }

    if (reward.type === 'nickname_change') {
      setIsNicknameModalVisible(true);
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
