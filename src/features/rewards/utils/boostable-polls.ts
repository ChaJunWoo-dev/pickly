export type BoostablePollRow = {
  id: string;
  title: string;
  created_at: string;
  expires_at: string;
  boosted_until: string | null;
};

export type BoostablePoll = {
  id: string;
  title: string;
  createdAt: string;
  expiresAt: string;
  boostedUntil: string | null;
};

export const mapBoostablePollRow = (
  row: BoostablePollRow
): BoostablePoll => {
  return {
    id: row.id,
    title: row.title,
    createdAt: row.created_at,
    expiresAt: row.expires_at,
    boostedUntil: row.boosted_until,
  };
};
