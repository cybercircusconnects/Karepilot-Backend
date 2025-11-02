import mongoose, { Document, Schema } from "mongoose";

export enum AdminRole {
  ADMIN = "Admin",
  MANAGER = "Manager",
  TECHNICIAN = "Technician",
  STAFF = "Staff",
  SECURITY = "Security",
  VIEWER = "Viewer",
}

export interface IPermission {
  viewUsers?: boolean;
  createUsers?: boolean;
  editUsers?: boolean;
  deleteUsers?: boolean;
  viewRoles?: boolean;
  createRoles?: boolean;
  editRoles?: boolean;
  deleteRoles?: boolean;
  viewDepartments?: boolean;
  createDepartments?: boolean;
  editDepartments?: boolean;
  deleteDepartments?: boolean;
  viewAll?: boolean;
  editAll?: boolean;
  manageAlerts?: boolean;
  viewSecurity?: boolean;
  accessLogs?: boolean;
  viewBasic?: boolean;
  editDepartment?: boolean;
  viewDepartment?: boolean;
  manageInventory?: boolean;
}

export interface IRolePermissions extends Document {
  role: AdminRole;
  permissions: IPermission;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const permissionSchema = new Schema<IPermission>(
  {
    viewUsers: { type: Boolean, default: false },
    createUsers: { type: Boolean, default: false },
    editUsers: { type: Boolean, default: false },
    deleteUsers: { type: Boolean, default: false },
    viewRoles: { type: Boolean, default: false },
    createRoles: { type: Boolean, default: false },
    editRoles: { type: Boolean, default: false },
    deleteRoles: { type: Boolean, default: false },
    viewDepartments: { type: Boolean, default: false },
    createDepartments: { type: Boolean, default: false },
    editDepartments: { type: Boolean, default: false },
    deleteDepartments: { type: Boolean, default: false },
    viewAll: { type: Boolean, default: false },
    editAll: { type: Boolean, default: false },
    manageAlerts: { type: Boolean, default: false },
    viewSecurity: { type: Boolean, default: false },
    accessLogs: { type: Boolean, default: false },
    viewBasic: { type: Boolean, default: false },
    editDepartment: { type: Boolean, default: false },
    viewDepartment: { type: Boolean, default: false },
    manageInventory: { type: Boolean, default: false },
  },
  { _id: false }
);

const rolePermissionsSchema = new Schema<IRolePermissions>(
  {
    role: {
      type: String,
      enum: Object.values(AdminRole),
      required: true,
      unique: true,
    },
    permissions: {
      type: permissionSchema,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

 export const DEFAULT_ROLE_PERMISSIONS: Record<AdminRole, IPermission> = {
  [AdminRole.ADMIN]: {
    viewUsers: true,
    createUsers: true,
    editUsers: true,
    deleteUsers: true,
    viewRoles: true,
    createRoles: true,
    editRoles: true,
    deleteRoles: true,
    viewDepartments: true,
    createDepartments: true,
    editDepartments: true,
    deleteDepartments: true,
    viewAll: true,
    editAll: true,
    manageAlerts: true,
    viewSecurity: true,
    accessLogs: true,
    viewBasic: true,
    editDepartment: true,
    viewDepartment: true,
    manageInventory: true,
  },
  [AdminRole.MANAGER]: {
    viewUsers: true,
    createUsers: false,
    editUsers: true,
    deleteUsers: false,
    viewRoles: false,
    createRoles: false,
    editRoles: false,
    deleteRoles: false,
    viewDepartments: true,
    createDepartments: false,
    editDepartments: false,
    deleteDepartments: false,
    viewAll: false,
    editAll: false,
    manageAlerts: true,
    viewSecurity: true,
    accessLogs: true,
    viewBasic: true,
    editDepartment: false,
    viewDepartment: true,
    manageInventory: false,
  },
  [AdminRole.TECHNICIAN]: {
    viewUsers: true,
    createUsers: false,
    editUsers: true,
    deleteUsers: false,
    viewRoles: false,
    createRoles: false,
    editRoles: false,
    deleteRoles: false,
    viewDepartments: false,
    createDepartments: false,
    editDepartments: false,
    deleteDepartments: false,
    viewAll: true,
    editAll: false,
    manageAlerts: true,
    viewSecurity: true,
    accessLogs: true,
    viewBasic: true,
    editDepartment: false,
    viewDepartment: false,
    manageInventory: false,
  },
  [AdminRole.STAFF]: {
    viewUsers: false,
    createUsers: false,
    editUsers: false,
    deleteUsers: false,
    viewRoles: false,
    createRoles: false,
    editRoles: false,
    deleteRoles: false,
    viewDepartments: false,
    createDepartments: false,
    editDepartments: false,
    deleteDepartments: false,
    viewAll: false,
    editAll: false,
    manageAlerts: false,
    viewSecurity: false,
    accessLogs: false,
    viewBasic: true,
    editDepartment: false,
    viewDepartment: false,
    manageInventory: false,
  },
  [AdminRole.SECURITY]: {
    viewUsers: false,
    createUsers: false,
    editUsers: false,
    deleteUsers: false,
    viewRoles: false,
    createRoles: false,
    editRoles: false,
    deleteRoles: false,
    viewDepartments: false,
    createDepartments: false,
    editDepartments: false,
    deleteDepartments: false,
    viewAll: false,
    editAll: false,
    manageAlerts: true,
    viewSecurity: true,
    accessLogs: true,
    viewBasic: true,
    editDepartment: false,
    viewDepartment: false,
    manageInventory: false,
  },
  [AdminRole.VIEWER]: {
    viewUsers: false,
    createUsers: false,
    editUsers: false,
    deleteUsers: false,
    viewRoles: false,
    createRoles: false,
    editRoles: false,
    deleteRoles: false,
    viewDepartments: false,
    createDepartments: false,
    editDepartments: false,
    deleteDepartments: false,
    viewAll: false,
    editAll: false,
    manageAlerts: false,
    viewSecurity: false,
    accessLogs: false,
    viewBasic: true,
    editDepartment: false,
    viewDepartment: false,
    manageInventory: false,
  },
};

const RolePermissions = mongoose.model<IRolePermissions>("RolePermissions", rolePermissionsSchema);

export default RolePermissions;

