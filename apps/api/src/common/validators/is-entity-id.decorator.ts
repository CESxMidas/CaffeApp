import { Matches } from 'class-validator';

/** RFC UUID shape; accepts demo seed ids that are not strict v4. */
export const ENTITY_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function IsEntityId() {
  return Matches(ENTITY_ID_PATTERN, { message: '$property must be a UUID' });
}
