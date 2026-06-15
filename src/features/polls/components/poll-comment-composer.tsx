import { AppButton, AppInput, AppText, Card } from '@/components';
import { theme } from '@/constants/theme';
import { StyleSheet, View } from 'react-native';

type PollCommentComposerProps = {
  canSubmit: boolean;
  commentBody: string;
  maxLength: number;
  onChangeCommentBody: (body: string) => void;
  onSubmit: () => void;
};

export const PollCommentComposer = ({
  canSubmit,
  commentBody,
  maxLength,
  onChangeCommentBody,
  onSubmit,
}: PollCommentComposerProps) => {
  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <AppText variant="bodySmall" weight="bold">
          댓글 작성
        </AppText>

        <AppText
          tone={commentBody.length >= maxLength ? 'danger' : 'muted'}
          variant="caption"
          weight="semibold"
        >
          {commentBody.length}/{maxLength}
        </AppText>
      </View>

      <AppInput
        maxLength={maxLength}
        multiline
        onChangeText={onChangeCommentBody}
        placeholder="예) 저는 첫 번째 선택지가 더 끌려요"
        style={styles.input}
        value={commentBody}
      />

      <View style={styles.footer}>
        <AppText tone="subtle" variant="caption">
          댓글은 작성 후 다른 참여자에게 공개돼요
        </AppText>

        <AppButton disabled={!canSubmit} size="sm" onPress={onSubmit}>
          등록
        </AppButton>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    gap: theme.spacing.md,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    minHeight: 104,
    textAlignVertical: 'top',
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.md,
    justifyContent: 'space-between',
  },
});
