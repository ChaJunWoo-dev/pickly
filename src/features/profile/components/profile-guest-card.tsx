import { AppText, Avatar, Card } from '@/components';
import { theme } from '@/constants/theme';
import { useThemeMode } from '@/contexts/theme-mode';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

export const ProfileGuestCard = () => {
  const { appTheme } = useThemeMode();

  return (
    <Card style={styles.card}>
      <View style={styles.profileRow}>
        <Avatar badgeIcon="ribbon" name="게스트" size={58} />

        <View style={styles.profileCopy}>
          <AppText variant="subtitle" weight="bold">
            게스트
          </AppText>
          <AppText tone="muted" variant="bodySmall">
            로그인하면 포인트와 참여 기록을 안전하게 보관할 수 있어요.
          </AppText>
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        style={[
          styles.appleButton,
          { backgroundColor: appTheme.colors.text },
        ]}
      >
        <Ionicons
          color={appTheme.colors.inverseText}
          name="logo-apple"
          size={20}
        />
        <AppText tone="inverse" variant="bodySmall" weight="bold">
          Apple로 계속하기
        </AppText>
      </Pressable>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    gap: theme.spacing.lg,
  },
  profileRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  profileCopy: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  appleButton: {
    alignItems: 'center',
    borderRadius: theme.radius.sm,
    flexDirection: 'row',
    gap: theme.spacing.sm,
    justifyContent: 'center',
    minHeight: 50,
  },
});
