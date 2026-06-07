import { AppText } from '@/components';
import { theme } from '@/constants/theme';
import { useThemeMode } from '@/contexts/theme-mode';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

type ProfileSubpageHeaderProps = {
  title: string;
};

export const ProfileSubpageHeader = ({ title }: ProfileSubpageHeaderProps) => {
  const router = useRouter();
  const { appTheme } = useThemeMode();

  return (
    <View style={styles.header}>
      <Pressable
        accessibilityRole="button"
        hitSlop={8}
        onPress={() => router.back()}
        style={styles.iconButton}
      >
        <Ionicons color={appTheme.colors.text} name="chevron-back" size={22} />
      </Pressable>

      <AppText style={styles.title} variant="subtitle" weight="bold">
        {title}
      </AppText>

      <View style={styles.iconButton} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'relative',
  },
  iconButton: {
    alignItems: 'center',
    height: 36,
    justifyContent: 'center',
    width: 36,
    zIndex: 1,
  },
  title: {
    left: 0,
    position: 'absolute',
    right: 0,
    textAlign: 'center',
  },
});
