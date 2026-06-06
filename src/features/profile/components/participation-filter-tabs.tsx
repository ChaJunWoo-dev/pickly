import { AppText } from '@/components';
import { theme } from '@/constants/theme';
import { Pressable, StyleSheet, View } from 'react-native';
import {
  participationTabs,
  type ParticipationTabId,
} from '../utils/participation-history';

type ParticipationFilterTabsProps = {
  value: ParticipationTabId;
  onChange: (tabId: ParticipationTabId) => void;
};

export const ParticipationFilterTabs = ({
  value,
  onChange,
}: ParticipationFilterTabsProps) => {
  return (
    <View style={styles.tabList}>
      {participationTabs.map((tab) => {
        const isSelected = tab.id === value;

        return (
          <Pressable
            key={tab.id}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            onPress={() => onChange(tab.id)}
            style={[styles.tabButton, isSelected && styles.selectedTabButton]}
          >
            <AppText
              tone={isSelected ? 'primary' : 'muted'}
              variant="caption"
              weight="semibold"
            >
              {tab.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabList: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    flexDirection: 'row',
    padding: theme.spacing.xxs,
  },
  tabButton: {
    alignItems: 'center',
    borderRadius: theme.radius.full,
    flex: 1,
    justifyContent: 'center',
    minHeight: 34,
  },
  selectedTabButton: {
    backgroundColor: theme.colors.primarySoft,
  },
});
