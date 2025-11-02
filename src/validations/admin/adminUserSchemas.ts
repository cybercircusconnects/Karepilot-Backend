import Joi from 'joi';
import { AdminRole } from '../../models/admin';

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

const nameSchema = Joi.string()
  .min(2)
  .max(50)
  .trim()
  .required()
  .messages({
    'string.min': 'Name must be at least 2 characters long',
    'string.max': 'Name cannot exceed 50 characters',
    'any.required': 'Name is required'
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
  name: nameSchema.optional(),
  email: emailSchema,
  password: passwordSchema,
  role: roleSchema.default(AdminRole.VIEWER),
  department: Joi.string().trim().optional(),
  phoneNumber: Joi.string().trim().optional(),
  badgeNumber: Joi.string().trim().optional(),
  shift: Joi.string().trim().optional()
}).or('name', 'firstName');

export const adminUserLoginSchema = Joi.object({
  email: emailSchema,
  password: Joi.string().required().messages({
    'any.required': 'Password is required'
  }),
  rememberMe: Joi.boolean().optional().default(false)
});

export const adminUserUpdateSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .trim()
    .optional()
    .messages({
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name cannot exceed 50 characters'
    }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .optional()
    .messages({
      'string.email': 'Please provide a valid email address'
    }),
  role: roleSchema,
  department: Joi.string().trim().optional(),
  phoneNumber: Joi.string().trim().optional(),
  badgeNumber: Joi.string().trim().optional(),
  shift: Joi.string().trim().optional(),
  isActive: Joi.boolean().optional()
});

export const adminUserQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).optional().default(1),
  limit: Joi.number().integer().min(1).max(100).optional().default(10),
  role: roleSchema,
  department: Joi.string().trim().optional(),
  search: Joi.string().trim().optional(),
  isActive: Joi.boolean().optional()
});

export const adminUserIdParamSchema = Joi.object({
  id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
    'string.pattern.base': 'Invalid admin user ID format'
  })
});


