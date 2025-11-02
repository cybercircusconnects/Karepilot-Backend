import { AdminRole } from '../../../models/admin/user-management';
import { IAdminUser } from '../../../models/admin/user-management/users';

export interface CreateUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: AdminRole;
  department?: string;
  phoneNumber?: string;
  badgeNumber?: string;
  shift?: string;
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  role?: AdminRole;
  department?: string | null;
  phoneNumber?: string;
  badgeNumber?: string;
  shift?: string;
  profileImage?: string;
  isActive?: boolean;
}

export interface UserQuery {
  page?: number;
  limit?: number;
  role?: AdminRole;
  department?: string;
  search?: string;
  isActive?: boolean;
}

export interface UsersListResult {
  users: IAdminUser[];
  pagination: {
    current: number;
    pages: number;
    total: number;
    limit: number;
  };
}

