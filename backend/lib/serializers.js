export function toPublicComment(comment) {
  const { user_id, ...safe } = comment;
  return safe;
}