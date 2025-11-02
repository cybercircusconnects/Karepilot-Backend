import Joi from 'joi';
import { AdminRole } from '../../../models/admin/user-management';

const emailSchema = Joi.string()
  .email({ tlds: { allow: false } })
  .required()
  .messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  });

const passwordSchema = Joi.string()
  .min(6)
  .required()
  .messages({
    'string.min': 'Password must be at least 6 characters long',
    'any.required': 'Password is required'
  });

const roleSchema = Joi.string()
  .valid(...Object.values(AdminRole))
  .optional()
  .messages({
    'any.only': 'Invalid role specified. Must be one of: Admin, Manager, Technician, Staff, Security, Viewer'
  });

export const adminUserRegistrationSchema = Joi.object({
  firstName: Joi.string()
    .min(2)
    .max(50)
    .trim()
    .optional()
    .messages({
      'string.min': 'First name must be at least 2 characters long',
      'string.max': 'First name cannot exceed 50 characters'
    }),
  lastName: Joi.string()
    .min(2)
    .max(50)
    .trim()
    .optional()
    .messages({
      'string.min': 'Last name must be at least 2 characters long',
      'string.max': 'Last name cannot exceed 50 characters'
    }),
  name: Joi.string()
    .min(2)
    .max(50)
    .trim()
    .optional()
    .messages({
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name cannot exceed 50 characters'
    }),
  email: emailSchema,
  password: passwordSchema,
  role: roleSchema.default(AdminRole.VIEWER),
  department: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .allow(null)
    .custom((value, helpers) => {
      const role = helpers.state.ancestors[0]?.role;
      if (role === AdminRole.ADMIN && value) {
        return helpers.error('any.custom', {
          message: 'Admin role cannot be assigned to a department',
        });
      }
      return value;
    })
    .messages({
      'string.pattern.base': 'Invalid department ID format',
      'any.custom': 'Admin role cannot be assigned to a department',
    }),
  phoneNumber: Joi.string().trim().optional(),
  badgeNumber: Joi.string().trim().optional(),
  shift: Joi.string().trim().optional()
}).or('name', 'firstName');

