import { theme } from '@/constants/theme';
import { useThemeMode } from '@/contexts/theme-mode';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  type ViewProps,
} from 'react-native';
import { AppText } from './app-text';

type LoadingStateProps = ViewProps & {
  title: string;
};

export const LoadingState = ({
  title,
  style,
  ...props
}: LoadingStateProps) => {
  const { appTheme } = useThemeMode();

  return (
    <View {...props} style={[styles.container, style]}>
      <ActivityIndicator color={appTheme.colors.primaryStrong} size="small" />
      <AppText align="center" tone="muted" variant="bodySmall">
        {title}
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: theme.spacing.md,
    justifyContent: 'center',
    padding: theme.spacing.xxl,
  },
});
