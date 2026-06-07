import { theme } from '@/constants/theme';
import { useThemeMode } from '@/contexts/theme-mode';
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
  const { appTheme } = useThemeMode();
  const contentStyle = [
    scroll ? styles.scrollContent : styles.content,
    { backgroundColor: appTheme.colors.background },
    padded && styles.padded,
    centered && styles.centered,
    contentContainerStyle,
  ];

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: appTheme.colors.background }]}
    >
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
          style={[
            styles.scrollView,
            { backgroundColor: appTheme.colors.background },
            style,
          ]}
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
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
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
