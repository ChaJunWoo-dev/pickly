const MINUTE_IN_MS = 60 * 1000;
const HOUR_IN_MS = 60 * MINUTE_IN_MS;
const DAY_IN_MS = 24 * HOUR_IN_MS;

export const formatCommentCreatedAt = (createdAt: string) => {
  const createdTime = new Date(createdAt).getTime();

  if (Number.isNaN(createdTime)) {
    return '';
  }

  const diff = Date.now() - createdTime;

  if (diff < MINUTE_IN_MS) {
    return '방금 전';
  }

  if (diff < HOUR_IN_MS) {
    return `${Math.floor(diff / MINUTE_IN_MS)}분 전`;
  }

  if (diff < DAY_IN_MS) {
    return `${Math.floor(diff / HOUR_IN_MS)}시간 전`;
  }

  if (diff < 7 * DAY_IN_MS) {
    return `${Math.floor(diff / DAY_IN_MS)}일 전`;
  }

  return new Intl.DateTimeFormat('ko-KR', {
    month: 'numeric',
    day: 'numeric',
  }).format(createdTime);
};
