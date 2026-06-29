import { ThemeProvider } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { ThemeModeProvider, useThemeMode } from '@/contexts/theme-mode';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const unstable_settings = {
  anchor: '(tabs)',
};

const getPollIdFromNotificationData = (
  data: Notifications.NotificationContent['data']
) => {
  const pollId = data?.pollId;

  return typeof pollId === 'string' ? pollId : null;
};

const RootStack = () => {
  const router = useRouter();
  const { colorScheme, navigationTheme } = useThemeMode();

  useEffect(() => {
    const navigateToNotificationTarget = (
      response: Notifications.NotificationResponse | null
    ) => {
      if (!response) return;

      const pollId = getPollIdFromNotificationData(
        response.notification.request.content.data
      );

      if (!pollId) return;

      router.push({
        pathname: '/poll/[id]',
        params: { id: pollId },
      });
    };

    navigateToNotificationTarget(Notifications.getLastNotificationResponse());

    const subscription = Notifications.addNotificationResponseReceivedListener(
      navigateToNotificationTarget
    );

    return () => {
      subscription.remove();
    };
  }, [router]);

  return (
    <ThemeProvider value={navigationTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="poll/[id]" options={{ headerShown: false }} />
        <Stack.Screen
          name="poll/[id]/comments"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="profile/saved" options={{ headerShown: false }} />
        <Stack.Screen name="profile/history" options={{ headerShown: false }} />
        <Stack.Screen
          name="profile/settings"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="profile/notifications"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="rewards/transactions"
          options={{ headerShown: false }}
        />
      </Stack>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
};

export default function RootLayout() {
  return (
    <ThemeModeProvider>
      <RootStack />
    </ThemeModeProvider>
  );
}
