import { theme } from '@/constants/theme';
import { AppButton } from './app-button';
import { AppText } from './app-text';
import { StyleSheet, View, type ViewProps } from 'react-native';
import type { ReactNode } from 'react';

type EmptyStateProps = ViewProps & {
  title: string;
  description?: string;
  icon?: ReactNode;
  actionLabel?: string;
  onActionPress?: () => void;
};

export const EmptyState = ({
  title,
  description,
  icon,
  actionLabel,
  onActionPress,
  style,
  ...props
}: EmptyStateProps) => (
  <View {...props} style={[styles.container, style]}>
    {icon ? <View style={styles.icon}>{icon}</View> : null}

    <AppText align="center" variant="subtitle" weight="bold">
      {title}
    </AppText>

    {description ? (
      <AppText align="center" style={styles.description} tone="muted">
        {description}
      </AppText>
    ) : null}

    {actionLabel && onActionPress ? (
      <AppButton style={styles.action} onPress={onActionPress}>
        {actionLabel}
      </AppButton>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xxl,
  },
  icon: {
    marginBottom: theme.spacing.lg,
  },
  description: {
    marginTop: theme.spacing.xs,
  },
  action: {
    marginTop: theme.spacing.xl,
  },
});
