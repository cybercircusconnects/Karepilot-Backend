import { IAdminUser, AdminRole, Permission } from '../../models/admin';

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

export interface UpdateAdminUserData {
  profileImage: string;
  name?: string;
  email?: string;
  role?: AdminRole;
  department?: string;
  phoneNumber?: string;
  badgeNumber?: string;
  shift?: string;
  isActive?: boolean;
}

export interface AdminUserQuery {
  page?: number | undefined;
  limit?: number | undefined;
  role?: AdminRole | undefined;
  department?: string | undefined;
  search?: string | undefined;
}

export interface AdminUserResult {
  user: IAdminUser;
  token: string;
}

export interface AdminUsersListResult {
  users: IAdminUser[];
  pagination: {
    current: number;
    pages: number;
    total: number;
    limit: number;
  };
}

export interface AdminRolesAndPermissions {
  roles: string[];
  permissions: string[];
}

export interface AdminUserResponse {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  permissions: Permission[];
  department?: string;
  phoneNumber?: string;
  badgeNumber?: string;
  shift?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}
