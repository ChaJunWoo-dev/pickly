import { theme } from '@/constants/theme';
import { useThemeMode } from '@/contexts/theme-mode';
import { StyleSheet, View, type ViewProps } from 'react-native';

type CardProps = ViewProps & {
  padded?: boolean;
  elevated?: boolean;
};

export const Card = ({
  padded = true,
  elevated = false,
  style,
  children,
  ...props
}: CardProps) => {
  const { appTheme } = useThemeMode();

  return (
    <View
      {...props}
      style={[
        styles.base,
        {
          backgroundColor: appTheme.colors.surface,
          borderColor: appTheme.colors.border,
        },
        padded && styles.padded,
        elevated && appTheme.shadow.card,
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: theme.layout.cardRadius,
    borderWidth: 1,
  },
  padded: {
    padding: theme.spacing.lg,
  },
});
