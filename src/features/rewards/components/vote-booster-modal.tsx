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
import { Pressable, StyleSheet, View } from 'react-native';
import type { BoostablePoll } from '../utils/boostable-polls';

type VoteBoosterModalProps = {
  isLoading?: boolean;
  isPurchasing?: boolean;
  polls: BoostablePoll[];
  price: number;
  selectedPollId: string | null;
  visible: boolean;
  onClose: () => void;
  onPurchase: () => void;
  onSelectPoll: (pollId: string) => void;
};

const formatCreatedDate = (createdAt: string) => {
  const date = new Date(createdAt);

  return `${date.getMonth() + 1}.${date.getDate()}`;
};

export const VoteBoosterModal = ({
  isLoading = false,
  isPurchasing = false,
  polls,
  price,
  selectedPollId,
  visible,
  onClose,
  onPurchase,
  onSelectPoll,
}: VoteBoosterModalProps) => {
  const { appTheme } = useThemeMode();
  const hasPolls = polls.length > 0;

  return (
    <AppModal visible={visible} onClose={onClose}>
      <View style={styles.body}>
        <View style={styles.header}>
          <AppText variant="bodySmall" weight="bold">
            부스터를 적용할 투표
          </AppText>
          <AppText tone="muted" variant="caption">
            6시간 동안 홈 피드 상단에 우선 노출돼요
          </AppText>
        </View>

        {isLoading ? (
          <LoadingState
            style={styles.feedback}
            title="내 투표를 불러오는 중이에요"
          />
        ) : hasPolls ? (
          <View style={styles.pollList}>
            {polls.map((poll) => {
              const isSelected = selectedPollId === poll.id;
              const isBoosted = poll.boostedUntil
                ? new Date(poll.boostedUntil).getTime() > Date.now()
                : false;

              return (
                <Pressable
                  key={poll.id}
                  accessibilityRole="button"
                  accessibilityState={{
                    disabled: isBoosted,
                    selected: isSelected,
                  }}
                  disabled={isBoosted}
                  onPress={() => onSelectPoll(poll.id)}
                  style={({ pressed }) => [
                    styles.pollItem,
                    {
                      backgroundColor: isSelected
                        ? appTheme.colors.primarySoft
                        : appTheme.colors.surface,
                      borderColor: isSelected
                        ? appTheme.colors.primaryStrong
                        : appTheme.colors.border,
                    },
                    isBoosted && styles.pollItemDisabled,
                    pressed && styles.pollItemPressed,
                  ]}
                >
                  <View style={styles.pollCopy}>
                    <AppText
                      variant="bodySmall"
                      weight={isSelected ? 'bold' : 'semibold'}
                    >
                      {poll.title}
                    </AppText>
                    <View style={styles.pollMetaRow}>
                      <AppText tone="muted" variant="caption">
                        {formatCreatedDate(poll.createdAt)} 생성
                      </AppText>
                      <View
                        style={[
                          styles.statusDot,
                          {
                            backgroundColor: isBoosted
                              ? appTheme.colors.primaryStrong
                              : appTheme.colors.textSubtle,
                          },
                        ]}
                      />
                      <AppText
                        tone={isBoosted ? 'success' : 'muted'}
                        variant="caption"
                        weight="semibold"
                      >
                        {isBoosted ? '이미 적용 중' : '적용 가능'}
                      </AppText>
                    </View>
                  </View>

                  <Ionicons
                    color={
                      isSelected
                        ? appTheme.colors.primaryStrong
                        : appTheme.colors.textSubtle
                    }
                    name={isSelected ? 'checkmark-circle' : 'ellipse-outline'}
                    size={22}
                  />
                </Pressable>
              );
            })}
          </View>
        ) : (
          <EmptyInfoRow
            description="진행 중인 내 투표가 있어야 사용할 수 있어요"
            icon={
              <Ionicons
                color={appTheme.colors.textSubtle}
                name="flash-outline"
                size={18}
              />
            }
            iconBackgroundColor={appTheme.colors.surfaceMuted}
            title="적용할 투표가 없어요"
          />
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
          disabled={!selectedPollId || isPurchasing}
          loading={isPurchasing}
          size="md"
          style={styles.actionButton}
          onPress={onPurchase}
        >
          {`${price.toLocaleString()}P로 적용`}
        </AppButton>
      </View>
    </AppModal>
  );
};

const styles = StyleSheet.create({
  body: {
    gap: theme.spacing.md,
  },
  header: {
    gap: theme.spacing.xxs,
  },
  pollList: {
    gap: theme.spacing.sm,
  },
  pollItem: {
    alignItems: 'center',
    borderRadius: theme.radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: theme.spacing.md,
    minHeight: 72,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  pollItemDisabled: {
    opacity: 0.58,
  },
  pollItemPressed: {
    opacity: 0.72,
  },
  pollCopy: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  pollMetaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  statusDot: {
    borderRadius: theme.radius.full,
    height: 4,
    width: 4,
  },
  feedback: {
    paddingVertical: theme.spacing.lg,
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
