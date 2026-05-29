import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { theme } from '@/constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primaryStrong,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
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
        name="explore"
        options={{
          title: '더보기',
          tabBarIcon: ({ color, size }) => (
            <Ionicons color={color} name="grid-outline" size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
