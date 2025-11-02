import { AdminRole } from '../../../models/admin/user-management';

export interface CreateAdminUserData {
  firstName?: string;
  lastName?: string;
  name?: string;
  email: string;
  password: string;
  role?: AdminRole;
  department?: string;
  phoneNumber?: string;
  badgeNumber?: string;
  shift?: string;
}

export interface AdminUserResult {
  user: any;
  token: string;
}

