export const POLL_WITH_OPTIONS_AND_VOTES_SELECT = `
  id,
  title,
  category,
  reward_points,
  created_at,
  expires_at,
  boosted_until,
  is_closed,
  poll_options (
    id,
    label,
    image_url,
    sort_order
  ),
  poll_votes (
    id,
    option_id,
    user_id
  )
`;
