import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { theme } from '@/constants/theme';
import { useThemeMode } from '@/contexts/theme-mode';

export default function TabLayout() {
  const { appTheme } = useThemeMode();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: appTheme.colors.primary,
        tabBarInactiveTintColor: appTheme.colors.textMuted,
        tabBarStyle: {
          backgroundColor: appTheme.colors.surface,
          borderTopColor: appTheme.colors.border,
          height: theme.layout.bottomTabHeight,
          paddingBottom: theme.spacing.sm,
          paddingTop: theme.spacing.xs,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '홈',
          tabBarIcon: ({ color, size }) => (
            <Ionicons color={color} name="home-outline" size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: '만들기',
          tabBarIcon: ({ color, size }) => (
            <Ionicons color={color} name="add-circle-outline" size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="rewards"
        options={{
          title: '리워드',
          tabBarIcon: ({ color, size }) => (
            <Ionicons color={color} name="gift-outline" size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '내정보',
          tabBarIcon: ({ color, size }) => (
            <Ionicons color={color} name="person-circle-outline" size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
