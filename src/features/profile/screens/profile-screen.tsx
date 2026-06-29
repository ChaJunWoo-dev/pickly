import { AppIconButton, AppText, Screen } from '@/components';
import { theme } from '@/constants/theme';
import { getCurrentPointSummary } from '@/features/rewards/api/point-summary';
import { showErrorToast } from '@/lib/toast';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { getCurrentProfile } from '../api/get-current-profile';
import { ProfileActivitySummary } from '../components/profile-activity-summary';
import { ProfileGuestCard } from '../components/profile-guest-card';
import { ProfileMenuSection } from '../components/profile-menu-section';
import type { CurrentProfile } from '../utils/current-profile';

export const ProfileScreen = () => {
  const [profile, setProfile] = useState<CurrentProfile | null>(null);
  const [currentPoints, setCurrentPoints] = useState(0);

  useFocusEffect(
    useCallback(() => {
      const loadProfile = async () => {
        try {
          const [nextProfile, pointSummary] = await Promise.all([
            getCurrentProfile(),
            getCurrentPointSummary(),
          ]);
          setProfile(nextProfile);
          setCurrentPoints(pointSummary.currentPoints);
        } catch {
          showErrorToast('내 정보를 불러오지 못했어요');
          setProfile(null);
          setCurrentPoints(0);
        }
      };

      void loadProfile();
    }, [])
  );

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

      <ProfileGuestCard profile={profile} />
      <ProfileActivitySummary currentPoints={currentPoints} />
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
