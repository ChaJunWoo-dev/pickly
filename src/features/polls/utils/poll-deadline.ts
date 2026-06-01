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

export const getPollTimeLeft = (expiresAt: string | null) => {
  if (!expiresAt) {
    return {
      timeLeft: '마감 없음',
      timeLeftSeconds: Number.MAX_SAFE_INTEGER,
    };
  }

  const timeLeftSeconds = Math.max(
    0,
    Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000)
  );
  const hours = Math.floor(timeLeftSeconds / 3600);
  const minutes = Math.floor((timeLeftSeconds % 3600) / 60);
  const seconds = timeLeftSeconds % 60;

  return {
    timeLeft: [hours, minutes, seconds]
      .map((value) => String(value).padStart(2, '0'))
      .join(':'),
    timeLeftSeconds,
  };
};
