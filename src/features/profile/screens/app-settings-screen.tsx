import { AppText, Card, Screen } from '@/components';
import { theme } from '@/constants/theme';
import { useThemeMode } from '@/contexts/theme-mode';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ProfileSubpageHeader } from '../components/profile-subpage-header';
import {
  getThemeModeLabel,
  ThemeModeModal,
} from '../components/theme-mode-modal';

const settings = [
  {
    id: 'notifications',
    icon: 'notifications-outline',
    title: '투표 알림',
    description: '마감과 결과 알림',
  },
  {
    id: 'appearance',
    icon: 'color-palette-outline',
    title: '화면 설정',
    description: '시스템 설정',
  },
  {
    id: 'privacy',
    icon: 'lock-closed-outline',
    title: '개인정보',
    description: '게스트 기록과 로그인 정보',
  },
] as const;

export const AppSettingsScreen = () => {
  const router = useRouter();
  const { appTheme, setThemeMode, themeMode } = useThemeMode();
  const [isThemeModalVisible, setIsThemeModalVisible] = useState(false);

  return (
    <Screen
      scroll
      contentContainerStyle={styles.content}
      scrollViewProps={{ bounces: false }}
    >
      <ProfileSubpageHeader title="앱 설정" />

      <Card style={styles.card}>
        {settings.map((item, index) => (
          <Pressable
            key={item.id}
            accessibilityRole="button"
            onPress={() => {
              if (item.id === 'notifications') {
                router.push('/profile/notifications');
              }

              if (item.id === 'appearance') {
                setIsThemeModalVisible(true);
              }
            }}
            style={[
              styles.row,
              index > 0 && {
                borderTopColor: appTheme.colors.border,
                borderTopWidth: 1,
              },
            ]}
          >
            <View
              style={[
                styles.icon,
                { backgroundColor: appTheme.colors.surfaceMuted },
              ]}
            >
              <Ionicons
                color={appTheme.colors.textMuted}
                name={item.icon}
                size={19}
              />
            </View>

            <View style={styles.copy}>
              <AppText variant="bodySmall" weight="bold">
                {item.title}
              </AppText>
              <AppText tone="muted" variant="caption">
                {item.id === 'appearance'
                  ? getThemeModeLabel(themeMode)
                  : item.description}
              </AppText>
            </View>

            <Ionicons
              color={appTheme.colors.textSubtle}
              name="chevron-forward"
              size={16}
            />
          </Pressable>
        ))}
      </Card>

      <View style={styles.version}>
        <AppText tone="subtle" variant="caption">
          Pickly 1.0.0
        </AppText>
      </View>

      <ThemeModeModal
        visible={isThemeModalVisible}
        value={themeMode}
        onClose={() => setIsThemeModalVisible(false)}
        onChange={(nextThemeMode) => {
          void setThemeMode(nextThemeMode);
        }}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  content: {
    gap: theme.spacing.xl,
    paddingBottom: theme.spacing.xxxl,
  },
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
  icon: {
    alignItems: 'center',
    borderRadius: theme.radius.full,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  copy: {
    flex: 1,
    gap: theme.spacing.xxs,
  },
  version: {
    alignItems: 'center',
  },
});
