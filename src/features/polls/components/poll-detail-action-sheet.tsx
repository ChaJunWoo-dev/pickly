import { AppText } from '@/components';
import { theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

type PollDetailActionSheetProps = {
  visible: boolean;
  onClose: () => void;
};

const actions = [
  {
    id: 'share',
    icon: 'share-outline',
    title: '공유하기',
    tone: 'primary',
  },
  {
    id: 'block',
    icon: 'ban-outline',
    title: '차단하기',
    tone: 'primary',
  },
  {
    id: 'report',
    icon: 'flag-outline',
    title: '신고하기',
    tone: 'danger',
  },
] as const;

export const PollDetailActionSheet = ({
  visible,
  onClose,
}: PollDetailActionSheetProps) => {
  return (
    <Modal
      animationType="fade"
      onRequestClose={onClose}
      transparent
      visible={visible}
    >
      <Pressable
        accessibilityRole="button"
        onPress={onClose}
        style={styles.overlay}
      >
        <Pressable style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.actions}>
            {actions.map((action, index) => {
              const isDanger = action.tone === 'danger';
              const color = isDanger
                ? theme.colors.danger
                : theme.colors.text;

              return (
                <Pressable
                  key={action.id}
                  accessibilityRole="button"
                  style={[styles.actionRow, index > 0 && styles.actionBorder]}
                >
                  <Ionicons
                    color={color}
                    name={action.icon}
                    size={20}
                  />
                  <AppText
                    style={{ color }}
                    variant="bodySmall"
                    weight="semibold"
                  >
                    {action.title}
                  </AppText>
                </Pressable>
              );
            })}
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={onClose}
            style={styles.cancelButton}
          >
            <AppText tone="muted" variant="bodySmall" weight="bold">
              취소
            </AppText>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: theme.colors.overlay,
    flex: 1,
    justifyContent: 'flex-end',
    padding: theme.spacing.lg,
  },
  sheet: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    gap: theme.spacing.md,
    padding: theme.spacing.md,
  },
  handle: {
    alignSelf: 'center',
    backgroundColor: theme.colors.borderStrong,
    borderRadius: theme.radius.full,
    height: 4,
    width: 42,
  },
  actions: {
    overflow: 'hidden',
  },
  actionRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.md,
    minHeight: 52,
    paddingHorizontal: theme.spacing.sm,
  },
  actionBorder: {
    borderTopColor: theme.colors.border,
    borderTopWidth: 1,
  },
  cancelButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radius.sm,
    justifyContent: 'center',
    minHeight: 48,
  },
});
