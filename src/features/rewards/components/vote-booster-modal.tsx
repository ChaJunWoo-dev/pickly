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
import { StyleSheet, View } from 'react-native';
import type { BoostablePoll } from '../utils/boostable-polls';
import { VoteBoosterPollItem } from './vote-booster-poll-item';

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

              return (
                <VoteBoosterPollItem
                  key={poll.id}
                  isSelected={isSelected}
                  poll={poll}
                  onSelect={onSelectPoll}
                />
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
