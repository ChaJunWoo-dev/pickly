import { EmptyState, Screen } from '@/components';

export default function ProfileTabScreen() {
  return (
    <Screen centered>
      <EmptyState description="내 투표, 참여 기록, 설정 등" title="내정보" />
    </Screen>
  );
}
