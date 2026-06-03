import { AppText } from '@/components';
import { theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

export type FeedTab = 'popular' | 'latest' | 'closingSoon';

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
  return (
    <View style={styles.container}>
      {feedTabs.map((tab, index) => {
        const isActive = value === tab.value;
        const isPreviousActive = feedTabs[index - 1]?.value === value;
        const showDivider = index > 0 && !isActive && !isPreviousActive;

        return (
          <View key={tab.value} style={styles.tabSlot}>
            {showDivider ? <View style={styles.divider} /> : null}

            <Pressable
              accessibilityRole="button"
              onPress={() => onChange?.(tab.value)}
              style={[styles.tab, isActive && styles.tabActive]}
            >
              {isActive ? (
                <Ionicons color={theme.colors.text} name={tab.icon} size={15} />
              ) : null}

              <AppText
                style={[styles.tabText, isActive && styles.tabTextActive]}
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
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
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
    backgroundColor: theme.colors.primarySoft,
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
  },
  tabText: {
    color: theme.colors.text,
    fontSize: 14,
    lineHeight: 20,
  },
  tabTextActive: {
    color: theme.colors.text,
  },
  divider: {
    height: 18,
    width: 1,
    backgroundColor: theme.colors.border,
    marginHorizontal: theme.spacing.xs,
  },
});
