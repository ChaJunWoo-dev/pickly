import { AppText, Card } from '@/components';
import { theme } from '@/constants/theme';
import { useThemeMode } from '@/contexts/theme-mode';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { NicknameModal } from './nickname-modal';

const rewards = [
  {
    id: 'nickname',
    title: '닉네임 변경',
    price: 1000,
    icon: 'text',
    description: '랭킹과 댓글에 표시되는 이름을 바꿔요',
  },
  {
    id: 'badge',
    title: '랜덤 배지',
    price: 300,
    icon: 'shield-checkmark',
    description: '아바타 옆에 표시될 배지를 무작위로 받아요',
  },
  {
    id: 'booster',
    title: '투표 부스터',
    price: 800,
    icon: 'flash',
    description: '투표 관련 활동 시 포인트를 추가로 받아요',
  },
];

type RewardShopSectionProps = {
  currentPoints: number;
};

export const RewardShopSection = ({ currentPoints }: RewardShopSectionProps) => {
  const { appTheme } = useThemeMode();
  const [isNicknameModalVisible, setIsNicknameModalVisible] = useState(false);
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

  const handleSubmitNickname = () => {
    closeNicknameModal();
  };

  const handlePressReward = (reward: (typeof rewards)[number]) => {
    if (currentPoints < reward.price) {
      showToast('포인트가 부족해요');
      return;
    }

    const rewardId = reward.id;

    if (rewardId === 'nickname') {
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
          {rewards.map((item) => {
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
                      : item.id === 'badge'
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
            style={[
              styles.toast,
              { backgroundColor: appTheme.colors.text },
            ]}
          >
            <AppText tone="inverse" variant="caption" weight="semibold">
              {toastMessage}
            </AppText>
          </View>
        )}
      </Card>

      <NicknameModal
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
