import { AppText } from '@/components';
import { theme } from '@/constants/theme';
import { useThemeMode } from '@/contexts/theme-mode';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import type { FeedTab } from '../types/feed';

type FeedTabItem = {
  label: string;
  value: FeedTab;
  icon: keyof typeof Ionicons.glyphMap;
};

type FeedTabsProps = {
  value: FeedTab;
  onChange?: (value: FeedTab) => void;
};

const feedTabs: FeedTabItem[] = [
  { label: '인기순', value: 'popular', icon: 'flame' },
  { label: '최신순', value: 'latest', icon: 'time-outline' },
  { label: '마감순', value: 'closingSoon', icon: 'hourglass-outline' },
];

export const FeedTabs = ({ value, onChange }: FeedTabsProps) => {
  const { appTheme } = useThemeMode();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: appTheme.colors.surface,
          borderColor: appTheme.colors.border,
        },
      ]}
    >
      {feedTabs.map((tab, index) => {
        const isActive = value === tab.value;
        const isPreviousActive = feedTabs[index - 1]?.value === value;
        const showDivider = index > 0 && !isActive && !isPreviousActive;

        return (
          <View key={tab.value} style={styles.tabSlot}>
            {showDivider ? (
              <View
                style={[
                  styles.divider,
                  { backgroundColor: appTheme.colors.border },
                ]}
              />
            ) : null}

            <Pressable
              accessibilityRole="button"
              onPress={() => onChange?.(tab.value)}
              style={[
                styles.tab,
                isActive && styles.tabActive,
                isActive && {
                  backgroundColor: appTheme.colors.primarySoft,
                  borderColor: appTheme.colors.primary,
                },
              ]}
            >
              {isActive ? (
                <Ionicons
                  color={appTheme.colors.text}
                  name={tab.icon}
                  size={15}
                />
              ) : null}

              <AppText
                style={[styles.tabText, { color: appTheme.colors.text }]}
                weight="bold"
              >
                {tab.label}
              </AppText>
            </Pressable>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 48,
    padding: theme.spacing.xs,
  },
  tabSlot: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
  },
  tab: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    minHeight: 38,
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  tabActive: {
    borderRadius: theme.radius.sm,
    borderWidth: 1,
  },
  tabText: {
    fontSize: 14,
    lineHeight: 20,
  },
  divider: {
    height: 18,
    width: 1,
    marginHorizontal: theme.spacing.xs,
  },
});
