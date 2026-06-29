import { theme } from '@/constants/theme';
import { AppText } from './app-text';
import { Image, StyleSheet, View, type ImageSourcePropType } from 'react-native';

type AvatarSize = 'sm' | 'md' | 'lg' | number;

type AvatarProps = {
  source?: ImageSourcePropType;
  name?: string;
  size?: AvatarSize;
};

const sizeByVariant: Record<Exclude<AvatarSize, number>, number> = {
  sm: 32,
  md: 40,
  lg: 56,
};

export const Avatar = ({ source, name, size = 'md' }: AvatarProps) => {
  const avatarSize = typeof size === 'number' ? size : sizeByVariant[size];
  const initial = name?.trim().charAt(0).toUpperCase() ?? '?';

  return (
    <View
      style={[
        styles.container,
        {
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
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: theme.colors.primarySoft,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    height: '100%',
    width: '100%',
  },
});
