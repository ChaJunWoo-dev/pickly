import { AppText } from '@/components';
import { theme } from '@/constants/theme';
import { useThemeMode } from '@/contexts/theme-mode';
import { StyleSheet, View } from 'react-native';

type HomeFeedHeaderProps = {
  currentPoints: number;
};

export const HomeFeedHeader = ({ currentPoints }: HomeFeedHeaderProps) => {
  const { appTheme } = useThemeMode();

  return (
    <View style={styles.header}>
      <View>
        <AppText style={styles.brandTitle} weight="bold">
          Pickly
        </AppText>
      </View>

      <View
        style={[
          styles.pointsPill,
          {
            backgroundColor: appTheme.colors.surface,
            borderColor: appTheme.colors.border,
          },
        ]}
      >
        <View
          style={[
            styles.pointIcon,
            { backgroundColor: appTheme.colors.primary },
          ]}
        >
          <AppText
            style={[styles.pointIconText, { color: appTheme.colors.text }]}
          >
            P
          </AppText>
        </View>
        <AppText
          style={[styles.pointsText, { color: appTheme.colors.text }]}
          weight="bold"
        >
          {currentPoints.toLocaleString()}P
        </AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  brandTitle: {
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 36,
  },
  pointsPill: {
    alignItems: 'center',
    borderRadius: theme.radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: theme.spacing.xs,
    minHeight: 36,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  pointIcon: {
    alignItems: 'center',
    borderRadius: theme.radius.full,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  pointIconText: {
    fontSize: 15,
    fontWeight: '800',
    includeFontPadding: false,
    lineHeight: 17,
    textAlign: 'center',
  },
  pointsText: {
    fontSize: 15,
    lineHeight: 20,
  },
});
