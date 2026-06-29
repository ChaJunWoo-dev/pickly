import { AppText, Avatar, Card } from '@/components';
import { theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

const comments = [
  {
    id: 'comment-1',
    author: '태그몬디',
    text: '오늘은 역시 편한 쪽으로 가고 싶어요.',
    likes: 12,
  },
  {
    id: 'comment-2',
    author: '채니사랑',
    text: '실용적인 선택이 최고죠.',
    likes: 8,
  },
  {
    id: 'comment-3',
    author: '이하은',
    text: '고민이 좀 되는데 저는 첫 번째요.',
    likes: 6,
  },
];

export const PollCommentPreviewCard = () => {
  return (
    <Card style={styles.commentsCard}>
      <View style={styles.resultHeader}>
        <AppText variant="bodySmall" weight="bold">
          참여자 한마디
        </AppText>
        <View style={styles.viewAll}>
          <AppText tone="muted" variant="caption" weight="semibold">
            전체보기
          </AppText>
          <Ionicons
            color={theme.colors.textMuted}
            name="chevron-forward"
            size={14}
          />
        </View>
      </View>

      <View style={styles.comments}>
        {comments.map((comment) => (
          <View key={comment.id} style={styles.commentItem}>
            <Avatar name={comment.author} size="sm" />
            <View style={styles.commentBody}>
              <AppText variant="caption" weight="bold">
                {comment.author}
              </AppText>
              <AppText tone="muted" variant="caption">
                {comment.text}
              </AppText>
            </View>
            <View style={styles.likeCount}>
              <Ionicons
                color={theme.colors.textSubtle}
                name="heart-outline"
                size={14}
              />
              <AppText tone="subtle" variant="caption">
                {comment.likes}
              </AppText>
            </View>
          </View>
        ))}
      </View>
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
  likeCount: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.xxs,
  },
  viewAll: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.xxs,
  },
});
