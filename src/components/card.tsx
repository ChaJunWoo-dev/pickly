import { theme } from '@/constants/theme';
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
}: CardProps) => (
  <View
    {...props}
    style={[
      styles.base,
      padded && styles.padded,
      elevated && theme.shadow.card,
      style,
    ]}
  >
    {children}
  </View>
);

const styles = StyleSheet.create({
  base: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.layout.cardRadius,
    borderWidth: 1,
  },
  padded: {
    padding: theme.spacing.lg,
  },
});
