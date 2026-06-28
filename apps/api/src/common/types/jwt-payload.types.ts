import type { StaffRole } from '@caffeapp/shared';

export interface JwtPayload {
  sub: string;
  staffId: string;
  email: string;
  role: StaffRole;
  branchId: string | null;
  type: 'access' | 'refresh';
}
