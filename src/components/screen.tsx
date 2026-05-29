import { theme } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ScrollView,
  StyleSheet,
  View,
  type ScrollViewProps,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from 'react-native';

type ScreenProps = ViewProps & {
  scroll?: boolean;
  padded?: boolean;
  centered?: boolean;
  contentContainerStyle?: StyleProp<ViewStyle>;
  scrollViewProps?: Omit<ScrollViewProps, 'contentContainerStyle'>;
};

export const Screen = ({
  scroll = false,
  padded = true,
  centered = false,
  style,
  contentContainerStyle,
  scrollViewProps,
  children,
  ...props
}: ScreenProps) => {
  const contentStyle = [
    scroll ? styles.scrollContent : styles.content,
    padded && styles.padded,
    centered && styles.centered,
    contentContainerStyle,
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      {scroll ? (
        <ScrollView
          {...scrollViewProps}
          contentContainerStyle={contentStyle}
          keyboardShouldPersistTaps={
            scrollViewProps?.keyboardShouldPersistTaps ?? 'handled'
          }
          showsVerticalScrollIndicator={
            scrollViewProps?.showsVerticalScrollIndicator ?? false
          }
          style={[styles.scrollView, style]}
        >
          {children}
        </ScrollView>
      ) : (
        <View {...props} style={[contentStyle, style]}>
          {children}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    backgroundColor: theme.colors.background,
    flexGrow: 1,
  },
  padded: {
    paddingHorizontal: theme.layout.screenPadding,
    paddingVertical: theme.spacing.lg,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
