export type PollDeadlineId = '1h' | '6h' | '12h' | '24h';

const hoursByDeadline: Record<PollDeadlineId, number> = {
  '1h': 1,
  '6h': 6,
  '12h': 12,
  '24h': 24,
};

export const getPollExpiresAt = (deadlineId: PollDeadlineId) => {
  const expiresAt = new Date();

  expiresAt.setHours(expiresAt.getHours() + hoursByDeadline[deadlineId]);

  return expiresAt.toISOString();
};
