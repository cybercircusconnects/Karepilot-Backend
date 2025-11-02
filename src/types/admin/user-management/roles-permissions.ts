import { AdminRole, IPermission } from '../../../models/admin/user-management/roles-permissions';
import { IRolePermissions } from '../../../models/admin/user-management/roles-permissions';

export interface CreateRolePermissionsData {
  role: AdminRole;
  permissions?: IPermission;
  isActive?: boolean;
}

export interface UpdateRolePermissionsData {
  permissions?: IPermission;
  isActive?: boolean;
}

export interface RolePermissionsListResult {
  id: string;
  role: AdminRole;
  permissions: IPermission;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

