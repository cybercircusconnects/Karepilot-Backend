import RolePermissions, {
  AdminRole,
  DEFAULT_ROLE_PERMISSIONS,
} from "../../../models/admin/user-management/roles-permissions";
import {
  CreateRolePermissionsData,
  UpdateRolePermissionsData,
  RolePermissionsQuery,
} from "../../../types/admin/user-management/roles-permissions";

export class RolesPermissionsService {
  async getAllRolesPermissions(query: RolePermissionsQuery = {}) {
    const dbQuery: any = {};

    if (query.role) {
      dbQuery.role = query.role;
    } else if (query.search) {
      dbQuery.role = { $regex: query.search, $options: "i" };
    }

    if (query.isActive !== undefined) {
      dbQuery.isActive = query.isActive;
    } else {
      dbQuery.isActive = true;
    }

    const rolesPermissions = await RolePermissions.find(dbQuery).sort({ createdAt: -1 });

    return rolesPermissions.map((rp) => ({
      id: rp._id,
      role: rp.role,
      permissions: rp.permissions,
      isActive: rp.isActive,
      createdAt: rp.createdAt,
      updatedAt: rp.updatedAt,
    }));
  }

  async getRolePermissionsById(id: string) {
    const rolePermissions = await RolePermissions.findById(id);
    if (!rolePermissions || !rolePermissions.isActive) {
      throw new Error("Role permissions not found");
    }
    return rolePermissions;
  }

  async createRolePermissions(data: CreateRolePermissionsData) {
    const existingRole = await RolePermissions.findOne({ role: data.role });
    if (existingRole) {
      throw new Error("Role permissions already exist for this role");
    }

    const rolePermissions = new RolePermissions({
      role: data.role,
      permissions: data.permissions || DEFAULT_ROLE_PERMISSIONS[data.role as AdminRole] || {},
      isActive: data.isActive !== undefined ? data.isActive : true,
    });

    await rolePermissions.save();

    return rolePermissions;
  }

  async updateRolePermissions(id: string, data: UpdateRolePermissionsData) {
    const rolePermissions = await RolePermissions.findById(id);
    if (!rolePermissions) {
      throw new Error("Role permissions not found");
    }

    const updatedRolePermissions = await RolePermissions.findByIdAndUpdate(
      id,
      {
        permissions: data.permissions,
        isActive: data.isActive !== undefined ? data.isActive : rolePermissions.isActive,
      },
      { new: true, runValidators: true },
    );

    return updatedRolePermissions!;
  }

  async deleteRolePermissions(id: string) {
    const rolePermissions = await RolePermissions.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true },
    );

    if (!rolePermissions) {
      throw new Error("Role permissions not found");
    }

    return rolePermissions;
  }
}

export default new RolesPermissionsService();
