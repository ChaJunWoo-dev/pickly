import { theme } from '@/constants/theme';
import { useThemeMode } from '@/contexts/theme-mode';
import type { ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

type AppModalProps = {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
};

export const AppModal = ({ visible, onClose, children }: AppModalProps) => {
  const { appTheme } = useThemeMode();

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View
        style={[
          styles.backdrop,
          { backgroundColor: appTheme.colors.overlay },
        ]}
      >
        <Pressable
          accessibilityRole="button"
          onPress={onClose}
          style={StyleSheet.absoluteFill}
        />

        <View
          style={[
            styles.card,
            {
              backgroundColor: appTheme.colors.surface,
              borderColor: appTheme.colors.border,
            },
          ]}
        >
          {children}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  card: {
    borderRadius: theme.radius.md,
    borderWidth: 1,
    gap: theme.spacing.md,
    maxWidth: 360,
    padding: theme.spacing.lg,
    width: '100%',
  },
});
