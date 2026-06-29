import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  DarkTheme,
  DefaultTheme,
  type Theme as NavigationTheme,
} from '@react-navigation/native';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useColorScheme } from 'react-native';
import { darkTheme, theme, type AppTheme } from '@/constants/theme';
import { logger } from '@/lib/logger';

const THEME_MODE_STORAGE_KEY = 'themeMode';

export type ThemeMode = 'system' | 'light' | 'dark';

type ThemeModeContextValue = {
  appTheme: AppTheme;
  colorScheme: 'light' | 'dark';
  navigationTheme: NavigationTheme;
  themeMode: ThemeMode;
  setThemeMode: (themeMode: ThemeMode) => Promise<void>;
};

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);

const isThemeMode = (value: string | null): value is ThemeMode => {
  return value === 'system' || value === 'light' || value === 'dark';
};

export const ThemeModeProvider = ({ children }: { children: ReactNode }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');

  useEffect(() => {
    const loadThemeMode = async () => {
      try {
        const savedThemeMode = await AsyncStorage.getItem(
          THEME_MODE_STORAGE_KEY
        );

        if (isThemeMode(savedThemeMode)) {
          setThemeModeState(savedThemeMode);
        }
      } catch (error) {
        logger.warn('Failed to load theme mode.', { error });
        setThemeModeState('system');
      }
    };

    void loadThemeMode();
  }, []);

  const colorScheme =
    themeMode === 'system' ? systemColorScheme ?? 'light' : themeMode;
  const appTheme = colorScheme === 'dark' ? darkTheme : theme;

  const navigationTheme = useMemo<NavigationTheme>(() => {
    const baseTheme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;

    return {
      ...baseTheme,
      colors: {
        ...baseTheme.colors,
        background: appTheme.colors.background,
        border: appTheme.colors.border,
        card: appTheme.colors.surface,
        notification: appTheme.colors.reward,
        primary: appTheme.colors.primaryStrong,
        text: appTheme.colors.text,
      },
    };
  }, [appTheme, colorScheme]);

  const setThemeMode = useCallback(async (nextThemeMode: ThemeMode) => {
    setThemeModeState(nextThemeMode);
    await AsyncStorage.setItem(THEME_MODE_STORAGE_KEY, nextThemeMode);
  }, []);

  const value = useMemo(
    () => ({
      appTheme,
      colorScheme,
      navigationTheme,
      themeMode,
      setThemeMode,
    }),
    [appTheme, colorScheme, navigationTheme, setThemeMode, themeMode]
  );

  return (
    <ThemeModeContext.Provider value={value}>
      {children}
    </ThemeModeContext.Provider>
  );
};

export const useThemeMode = () => {
  const value = useContext(ThemeModeContext);

  if (!value) {
    throw new Error('useThemeMode must be used inside ThemeModeProvider.');
  }

  return value;
};
