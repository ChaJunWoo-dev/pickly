import { AppText } from '@/components';
import { theme } from '@/constants/theme';
import { useThemeMode } from '@/contexts/theme-mode';
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
  const { appTheme } = useThemeMode();

  return (
    <View
      style={[
        styles.tabList,
        {
          backgroundColor: appTheme.colors.surface,
          borderColor: appTheme.colors.border,
        },
      ]}
    >
      {participationTabs.map((tab) => {
        const isSelected = tab.id === value;

        return (
          <Pressable
            key={tab.id}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            onPress={() => onChange(tab.id)}
            style={[
              styles.tabButton,
              isSelected && {
                backgroundColor: appTheme.colors.primarySoft,
                borderColor: appTheme.colors.primary,
              },
            ]}
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
    borderRadius: theme.radius.full,
    borderWidth: 1,
    flexDirection: 'row',
    padding: theme.spacing.xxs,
  },
  tabButton: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: theme.radius.full,
    flex: 1,
    justifyContent: 'center',
    minHeight: 34,
  },
});
