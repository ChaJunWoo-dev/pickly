import { theme } from '@/constants/theme';
import type { ReactNode } from 'react';
import {
  StyleSheet,
  View,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from 'react-native';
import { AppText } from './app-text';

type EmptyInfoRowProps = ViewProps & {
  icon: ReactNode;
  title: string;
  description?: string;
  iconBackgroundColor?: string;
  iconContainerStyle?: StyleProp<ViewStyle>;
};

export const EmptyInfoRow = ({
  icon,
  title,
  description,
  iconBackgroundColor,
  iconContainerStyle,
  style,
  ...props
}: EmptyInfoRowProps) => {
  return (
    <View {...props} style={[styles.container, style]}>
      <View
        style={[
          styles.icon,
          iconBackgroundColor && { backgroundColor: iconBackgroundColor },
          iconContainerStyle,
        ]}
      >
        {icon}
      </View>

      <View style={styles.copy}>
        <AppText variant="caption" weight="bold">
          {title}
        </AppText>

        {description ? (
          <AppText tone="muted" variant="caption">
            {description}
          </AppText>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
  },
  icon: {
    alignItems: 'center',
    borderRadius: theme.radius.full,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  copy: {
    flex: 1,
    gap: theme.spacing.xxs,
  },
});
