import { AppText, Avatar, Card, EmptyInfoRow } from '@/components';
import { theme } from '@/constants/theme';
import { useThemeMode } from '@/contexts/theme-mode';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import type { PollComment } from '../api/poll-comments';

type PollCommentPreviewCardProps = {
  comments: PollComment[];
  onWriteComment?: () => void;
  onPressAllView?: () => void;
};

export const PollCommentPreviewCard = ({
  comments,
  onWriteComment,
  onPressAllView,
}: PollCommentPreviewCardProps) => {
  const { appTheme } = useThemeMode();
  const isEmpty = comments.length === 0;

  return (
    <Card style={styles.commentsCard}>
      <View style={styles.resultHeader}>
        <AppText variant="bodySmall" weight="bold">
          참여자 한마디
        </AppText>

        <Pressable
          accessibilityRole="button"
          onPress={onWriteComment}
          style={styles.viewAll}
        >
          <Ionicons
            color={appTheme.colors.textMuted}
            name="create-outline"
            size={15}
          />
          <AppText tone="muted" variant="caption" weight="semibold">
            작성
          </AppText>
        </Pressable>
      </View>

      <Pressable onPress={onPressAllView}>
        {isEmpty ? (
          <EmptyInfoRow
            description="첫 댓글을 남겨보세요"
            icon={
              <Ionicons
                color={appTheme.colors.textSubtle}
                name="chatbubble-ellipses-outline"
                size={18}
              />
            }
            iconBackgroundColor={appTheme.colors.surfaceMuted}
            title="아직 한마디가 없어요"
          />
        ) : (
          <View style={styles.comments}>
            {comments.map((comment) => (
              <View key={comment.id} style={styles.commentItem}>
                <Avatar badgeIcon="ribbon" name="익명" size="sm" />
                <View style={styles.commentBody}>
                  <AppText variant="caption" weight="bold">
                    익명
                  </AppText>
                  <AppText tone="muted" variant="caption">
                    {comment.body}
                  </AppText>
                </View>
            </View>
          ))}
        </View>
        )}
      </Pressable>
    </Card>
  );
};

const styles = StyleSheet.create({
  resultHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  commentsCard: {
    gap: theme.spacing.md,
  },
  comments: {
    gap: theme.spacing.md,
  },
  commentItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  commentBody: {
    flex: 1,
    gap: theme.spacing.xxs,
  },
  viewAll: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.xxs,
  },
});
