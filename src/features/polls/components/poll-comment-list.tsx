import { AppText, Avatar, Card, EmptyInfoRow } from '@/components';
import { theme } from '@/constants/theme';
import { useThemeMode } from '@/contexts/theme-mode';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { formatCommentCreatedAt } from '../utils/comment-time';
import type { PollComment } from '../utils/poll-comments';

type PollCommentListProps = {
  comments: PollComment[];
};

export const PollCommentList = ({ comments }: PollCommentListProps) => {
  const { appTheme } = useThemeMode();
  const isEmpty = comments.length === 0;

  return (
    <Card style={styles.card}>
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
        <View style={styles.list}>
          {comments.map((item, index) => (
            <View
              key={item.id}
              style={[
                styles.row,
                index > 0 && { borderTopColor: appTheme.colors.border },
                index > 0 && styles.rowBorder,
              ]}
            >
              <Avatar
                badgeIcon={item.author.badgeIcon ?? undefined}
                name={item.author.nickname}
                size="sm"
                source={
                  item.author.avatarUrl
                    ? { uri: item.author.avatarUrl }
                    : undefined
                }
              />

              <View style={styles.body}>
                <View style={styles.meta}>
                  <AppText variant="caption" weight="bold">
                    {item.author.nickname}
                  </AppText>
                  <AppText tone="subtle" variant="caption">
                    {formatCommentCreatedAt(item.createdAt)}
                  </AppText>
                </View>

                <AppText tone="muted" variant="bodySmall">
                  {item.body}
                </AppText>
              </View>
            </View>
          ))}
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    gap: theme.spacing.md,
  },
  list: {
    gap: 0,
  },
  row: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
  },
  rowBorder: {
    borderTopWidth: 1,
  },
  body: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  meta: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
});
