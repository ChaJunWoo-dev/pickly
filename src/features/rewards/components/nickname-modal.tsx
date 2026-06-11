import { AppButton, AppInput, AppModal, AppText } from '@/components';
import { theme } from '@/constants/theme';
import { useThemeMode } from '@/contexts/theme-mode';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { NICKNAME_CHANGE_PRICE } from '../api/purchase-nickname-change';

const NICKNAME_MAX_LENGTH = 12;

type NicknameModalProps = {
  visible: boolean;
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (nickname: string) => void;
};

export const NicknameModal = ({
  visible,
  isSubmitting = false,
  onClose,
  onSubmit,
}: NicknameModalProps) => {
  const { appTheme } = useThemeMode();
  const [nickname, setNickname] = useState('');
  const trimmedNickname = nickname.trim();

  useEffect(() => {
    if (!visible) {
      setNickname('');
    }
  }, [visible]);

  const handleClose = () => {
    setNickname('');
    onClose();
  };

  const handleSubmit = () => {
    if (!trimmedNickname || isSubmitting) return;

    onSubmit(trimmedNickname);
  };

  return (
    <AppModal visible={visible} onClose={handleClose}>
      <View style={styles.modalHeader}>
        <View style={styles.modalTitle}>
          <AppText variant="subtitle" weight="bold">
            닉네임 변경
          </AppText>
          <AppText tone="muted" variant="caption">
            랭킹과 댓글에 표시되는 이름을 바꿔요
          </AppText>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={handleClose}
          style={styles.closeButton}
        >
          <Ionicons color={appTheme.colors.textMuted} name="close" size={20} />
        </Pressable>
      </View>

      <View style={styles.modalBody}>
        <AppInput
          maxLength={NICKNAME_MAX_LENGTH}
          onChangeText={setNickname}
          placeholder="새 닉네임"
          value={nickname}
        />
        <AppText
          align="right"
          tone={nickname.length >= NICKNAME_MAX_LENGTH ? 'danger' : 'muted'}
          variant="caption"
          weight="semibold"
        >
          {nickname.length}/{NICKNAME_MAX_LENGTH}
        </AppText>
      </View>

      <View style={styles.modalActions}>
        <AppButton
          size="md"
          style={styles.modalActionButton}
          variant="ghost"
          onPress={handleClose}
        >
          취소
        </AppButton>
        <AppButton
          disabled={!trimmedNickname}
          loading={isSubmitting}
          size="md"
          style={styles.modalActionButton}
          onPress={handleSubmit}
        >
          {NICKNAME_CHANGE_PRICE.toLocaleString()}P로 변경
        </AppButton>
      </View>
    </AppModal>
  );
};

const styles = StyleSheet.create({
  modalHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: theme.spacing.md,
    justifyContent: 'space-between',
  },
  modalTitle: {
    flex: 1,
    gap: theme.spacing.xxs,
  },
  closeButton: {
    alignItems: 'center',
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  modalBody: {
    gap: theme.spacing.xs,
  },
  modalActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  modalActionButton: {
    flex: 1,
  },
});
