import { AppIconButton, AppText, Screen } from '@/components';
import { theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { ProfileActivitySummary } from '../components/profile-activity-summary';
import { ProfileGuestCard } from '../components/profile-guest-card';
import { ProfileMenuSection } from '../components/profile-menu-section';

export const ProfileScreen = () => {
  return (
    <Screen
      scroll
      contentContainerStyle={styles.content}
      scrollViewProps={{ bounces: false }}
    >
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        <AppText variant="subtitle" weight="bold">
          내정보
        </AppText>
        <AppIconButton
          icon={
            <Ionicons
              color={theme.colors.textMuted}
              name="help-circle-outline"
              size={24}
            />
          }
          size="sm"
          variant="plain"
        />
      </View>

      <ProfileGuestCard />
      <ProfileActivitySummary />
      <ProfileMenuSection />

      <View style={styles.notice}>
        <Ionicons
          color={theme.colors.textMuted}
          name="shield-checkmark-outline"
          size={18}
        />
        <AppText tone="muted" variant="caption">
          Apple 로그인은 포인트와 기록 저장을 위해서만 사용돼요.
        </AppText>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  content: {
    gap: theme.spacing.xl,
    paddingBottom: theme.spacing.xxxl,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerSpacer: {
    height: 32,
    width: 32,
  },
  notice: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
  },
});
