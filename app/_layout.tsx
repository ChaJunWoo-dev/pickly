import { ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { ThemeModeProvider, useThemeMode } from '@/contexts/theme-mode';

export const unstable_settings = {
  anchor: '(tabs)',
};

const RootStack = () => {
  const { colorScheme, navigationTheme } = useThemeMode();

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
