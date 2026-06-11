import { useThemeMode } from '@/contexts/theme-mode';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from './app-text';
import { Image, StyleSheet, View, type ImageSourcePropType } from 'react-native';

type AvatarSize = 'sm' | 'md' | 'lg' | number;
type AvatarBadgeIcon = keyof typeof Ionicons.glyphMap;

type AvatarProps = {
  badgeIcon?: AvatarBadgeIcon;
  source?: ImageSourcePropType;
  name?: string;
  size?: AvatarSize;
};

const sizeByVariant: Record<Exclude<AvatarSize, number>, number> = {
  sm: 32,
  md: 40,
  lg: 56,
};

export const Avatar = ({
  badgeIcon,
  source,
  name,
  size = 'md',
}: AvatarProps) => {
  const { appTheme } = useThemeMode();
  const avatarSize = typeof size === 'number' ? size : sizeByVariant[size];
  const badgeSize = Math.max(14, Math.round(avatarSize * 0.42));
  const initial = name?.trim().charAt(0).toUpperCase() ?? '?';

  return (
    <View style={{ height: avatarSize, width: avatarSize }}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: appTheme.colors.primarySoft,
            borderRadius: avatarSize / 2,
            height: avatarSize,
            width: avatarSize,
          },
        ]}
      >
        {source ? (
          <Image source={source} style={styles.image} />
        ) : (
          <AppText tone="muted" variant="label" weight="bold">
            {initial}
          </AppText>
        )}
      </View>

      {badgeIcon ? (
        <View
          style={[
            styles.badge,
            {
              backgroundColor: appTheme.colors.secondary,
              borderColor: appTheme.colors.surface,
              borderRadius: badgeSize / 2,
              height: badgeSize,
              width: badgeSize,
            },
          ]}
        >
          <Ionicons
            color={appTheme.colors.inverseText}
            name={badgeIcon}
            size={Math.round(badgeSize * 0.68)}
          />
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  badge: {
    alignItems: 'center',
    borderWidth: 1,
    bottom: -1,
    justifyContent: 'center',
    position: 'absolute',
    right: -1,
  },
  image: {
    height: '100%',
    width: '100%',
  },
});
