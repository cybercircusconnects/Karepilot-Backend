import Joi from 'joi';
import { AdminRole } from '../../../models/admin/user-management';

const permissionSchema = Joi.object({
  viewUsers: Joi.boolean().optional(),
  createUsers: Joi.boolean().optional(),
  editUsers: Joi.boolean().optional(),
  deleteUsers: Joi.boolean().optional(),
  viewRoles: Joi.boolean().optional(),
  createRoles: Joi.boolean().optional(),
  editRoles: Joi.boolean().optional(),
  deleteRoles: Joi.boolean().optional(),
  viewDepartments: Joi.boolean().optional(),
  createDepartments: Joi.boolean().optional(),
  editDepartments: Joi.boolean().optional(),
  deleteDepartments: Joi.boolean().optional(),
  viewAll: Joi.boolean().optional(),
  editAll: Joi.boolean().optional(),
  manageAlerts: Joi.boolean().optional(),
  viewSecurity: Joi.boolean().optional(),
  accessLogs: Joi.boolean().optional(),
  viewBasic: Joi.boolean().optional(),
  editDepartment: Joi.boolean().optional(),
  viewDepartment: Joi.boolean().optional(),
  manageInventory: Joi.boolean().optional(),
});

const roleSchema = Joi.string()
  .valid(...Object.values(AdminRole))
  .required()
  .messages({
    'any.only': 'Invalid role specified. Must be one of: Admin, Manager, Technician, Staff, Security, Viewer',
    'any.required': 'Role is required'
  });

export const createRolePermissionsSchema = Joi.object({
  role: roleSchema,
  permissions: permissionSchema.optional(),
  isActive: Joi.boolean().optional().default(true)
});

export const updateRolePermissionsSchema = Joi.object({
  permissions: permissionSchema.optional(),
  isActive: Joi.boolean().optional()
});

export const rolePermissionsIdParamSchema = Joi.object({
  id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
    'string.pattern.base': 'Invalid role permissions ID format'
  })
});

