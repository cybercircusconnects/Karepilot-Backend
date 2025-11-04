import { AdminRole, UserStatus } from '../../../models/admin/user-management';
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
  currentLocation?: string;
  status?: UserStatus;
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
  currentLocation?: string;
  profileImage?: string;
  isActive?: boolean;
  status?: UserStatus;
}

export interface UserQuery {
  page?: number;
  limit?: number;
  role?: AdminRole;
  department?: string;
  search?: string;
  isActive?: boolean;
  status?: UserStatus;
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

