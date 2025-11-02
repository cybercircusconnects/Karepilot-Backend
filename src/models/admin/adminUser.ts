import mongoose, { Document, Schema } from "mongoose";
import * as bcrypt from "bcryptjs";

export enum Permission {
  VIEW_ALL = "View All",
  EDIT_ALL = "Edit All",
  MANAGE_ALERTS = "Manage Alerts",
  VIEW_SECURITY = "View Security",
  ACCESS_LOGS = "Access Logs",
  VIEW_BASIC = "View Basic",
  EDIT_DEPARTMENT = "Edit Department",
  VIEW_DEPARTMENT = "View Department",
  EDIT_USERS = "Edit Users",
  MANAGE_INVENTORY = "Manage Inventory",
  DELETE_USERS = "Delete Users",
}

export enum AdminRole {
  ADMIN = "Admin",
  MANAGER = "Manager",
  TECHNICIAN = "Technician",
  STAFF = "Staff",
  SECURITY = "Security",
  VIEWER = "Viewer",
}

export const ROLE_PERMISSIONS: Record<AdminRole, Permission[]> = {
  [AdminRole.ADMIN]: [
    Permission.VIEW_ALL,
    Permission.EDIT_ALL,
    Permission.MANAGE_ALERTS,
    Permission.VIEW_SECURITY,
    Permission.ACCESS_LOGS,
    Permission.VIEW_BASIC,
    Permission.EDIT_DEPARTMENT,
    Permission.VIEW_DEPARTMENT,
    Permission.EDIT_USERS,
    Permission.MANAGE_INVENTORY,
    Permission.DELETE_USERS,
  ],
  [AdminRole.MANAGER]: [
    Permission.MANAGE_ALERTS,
    Permission.VIEW_SECURITY,
    Permission.ACCESS_LOGS,
    Permission.VIEW_BASIC,
    Permission.VIEW_DEPARTMENT,
    Permission.EDIT_USERS,
  ],
  [AdminRole.TECHNICIAN]: [
    Permission.VIEW_ALL,
    Permission.MANAGE_ALERTS,
    Permission.VIEW_SECURITY,
    Permission.ACCESS_LOGS,
    Permission.VIEW_BASIC,
    Permission.EDIT_USERS,
  ],
  [AdminRole.STAFF]: [Permission.VIEW_BASIC],
  [AdminRole.SECURITY]: [
    Permission.MANAGE_ALERTS,
    Permission.VIEW_SECURITY,
    Permission.ACCESS_LOGS,
    Permission.VIEW_BASIC,
  ],
  [AdminRole.VIEWER]: [Permission.VIEW_BASIC],
};

export interface IAdminUser extends Document {
  name: string;
  email: string;
  password: string;
  role: AdminRole;
  permissions: Permission[];
  department?: string;
  phoneNumber?: string;
  badgeNumber?: string;
  shift?: string;
  profileImage?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;

  comparePassword(candidatePassword: string): Promise<boolean>;
  hasPermission(permission: Permission): boolean;
  hasAnyPermission(permissions: Permission[]): boolean;
  hasAllPermissions(permissions: Permission[]): boolean;
}

const adminUserSchema = new Schema<IAdminUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please provide a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    role: {
      type: String,
      enum: Object.values(AdminRole),
      default: AdminRole.VIEWER,
      required: true,
    },
    permissions: [
      {
        type: String,
        enum: Object.values(Permission),
      },
    ],
    department: {
      type: String,
      trim: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    badgeNumber: {
      type: String,
      trim: true,
    },
    shift: {
      type: String,
      trim: true,
    },
    profileImage: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        const { password, ...userWithoutPassword } = ret;
        return userWithoutPassword;
      },
    },
  },
);

adminUserSchema.index({ role: 1 });
adminUserSchema.index({ isActive: 1 });
adminUserSchema.index({ department: 1 });

adminUserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);

    this.permissions = ROLE_PERMISSIONS[this.role as AdminRole] || [];

    next();
  } catch (error: any) {
    next(error);
  }
});

adminUserSchema.pre(["updateOne", "findOneAndUpdate"], async function (next) {
  const update = this.getUpdate() as any;

  if (update?.password) {
    try {
      const salt = await bcrypt.genSalt(12);
      update.password = await bcrypt.hash(update.password, salt);
    } catch (error: any) {
      next(error);
    }
  }

  if (update?.role) {
    update.permissions = ROLE_PERMISSIONS[update.role as AdminRole] || [];
  }

  next();
});

adminUserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

adminUserSchema.methods.hasPermission = function (permission: Permission): boolean {
  return this.permissions.includes(permission);
};

adminUserSchema.methods.hasAnyPermission = function (permissions: Permission[]): boolean {
  return permissions.some((permission) => this.permissions.includes(permission));
};

adminUserSchema.methods.hasAllPermissions = function (permissions: Permission[]): boolean {
  return permissions.every((permission) => this.permissions.includes(permission));
};

adminUserSchema.statics.findByRole = function (role: AdminRole) {
  return this.find({ role, isActive: true });
};

adminUserSchema.statics.findByPermission = function (permission: Permission) {
  return this.find({ permissions: permission, isActive: true });
};

const AdminUser = mongoose.model<IAdminUser>("AdminUser", adminUserSchema);

export default AdminUser;
