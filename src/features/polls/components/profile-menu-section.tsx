import { AppText, Card } from '@/components';
import { theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

const menuItems = [
  {
    id: 'saved',
    icon: 'bookmark-outline',
    title: '저장한 투표',
    description: '나중에 다시 볼 투표',
    href: '/profile/saved',
  },
  {
    id: 'history',
    icon: 'time-outline',
    title: '참여 기록',
    description: '내가 참여한 투표와 결과',
    href: '/profile/history',
  },
  {
    id: 'settings',
    icon: 'settings-outline',
    title: '앱 설정',
    description: '알림과 화면 설정',
    href: '/profile/settings',
  },
] as const;

export const ProfileMenuSection = () => {
  const router = useRouter();

  return (
    <Card style={styles.card}>
      {menuItems.map((item, index) => (
        <Pressable
          key={item.id}
          accessibilityRole="button"
          onPress={() => router.push(item.href)}
          style={[styles.row, index > 0 && styles.rowBorder]}
        >
          <View style={styles.icon}>
            <Ionicons color={theme.colors.textMuted} name={item.icon} size={19} />
          </View>

          <View style={styles.copy}>
            <AppText variant="bodySmall" weight="bold">
              {item.title}
            </AppText>
            <AppText tone="muted" variant="caption">
              {item.description}
            </AppText>
          </View>

          <Ionicons
            color={theme.colors.textSubtle}
            name="chevron-forward"
            size={16}
          />
        </Pressable>
      ))}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    paddingVertical: theme.spacing.xs,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.md,
    minHeight: 64,
    paddingVertical: theme.spacing.sm,
  },
  rowBorder: {
    borderTopColor: theme.colors.border,
    borderTopWidth: 1,
  },
  icon: {
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radius.full,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  copy: {
    flex: 1,
    gap: theme.spacing.xxs,
  },
});
