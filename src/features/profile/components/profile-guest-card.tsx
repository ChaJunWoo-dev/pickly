import { AppText, Card } from '@/components';
import { theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

export const ProfileGuestCard = () => {
  return (
    <Card style={styles.card}>
      <View style={styles.profileRow}>
        <View style={styles.avatar}>
          <Ionicons
            color={theme.colors.primaryStrong}
            name="person-outline"
            size={28}
          />
        </View>

        <View style={styles.profileCopy}>
          <AppText variant="subtitle" weight="bold">
            게스트
          </AppText>
          <AppText tone="muted" variant="bodySmall">
            로그인하면 포인트와 참여 기록을 안전하게 보관할 수 있어요.
          </AppText>
        </View>
      </View>

      <Pressable accessibilityRole="button" style={styles.appleButton}>
        <Ionicons color={theme.colors.inverseText} name="logo-apple" size={20} />
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
  avatar: {
    alignItems: 'center',
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radius.full,
    height: 58,
    justifyContent: 'center',
    width: 58,
  },
  profileCopy: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  appleButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.text,
    borderRadius: theme.radius.sm,
    flexDirection: 'row',
    gap: theme.spacing.sm,
    justifyContent: 'center',
    minHeight: 50,
  },
});
