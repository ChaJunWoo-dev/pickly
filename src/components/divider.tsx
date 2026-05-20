import { theme } from '@/constants/theme';
import { StyleSheet, View, type ViewProps } from 'react-native';

type DividerProps = ViewProps & {
  inset?: boolean;
};

export const Divider = ({ inset = false, style, ...props }: DividerProps) => (
  <View {...props} style={[styles.base, inset && styles.inset, style]} />
);

const styles = StyleSheet.create({
  base: {
    backgroundColor: theme.colors.border,
    height: StyleSheet.hairlineWidth,
    width: '100%',
  },
  inset: {
    marginLeft: theme.spacing.lg,
  },
});
