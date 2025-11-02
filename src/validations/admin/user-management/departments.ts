import Joi from 'joi';

export const createDepartmentSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(100)
    .trim()
    .required()
    .messages({
      'string.min': 'Department name must be at least 2 characters long',
      'string.max': 'Department name cannot exceed 100 characters',
      'any.required': 'Department name is required'
    }),
  description: Joi.string()
    .max(500)
    .trim()
    .optional()
    .allow('')
    .messages({
      'string.max': 'Description cannot exceed 500 characters'
    }),
  isActive: Joi.boolean().optional().default(true)
});

export const updateDepartmentSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(100)
    .trim()
    .optional()
    .messages({
      'string.min': 'Department name must be at least 2 characters long',
      'string.max': 'Department name cannot exceed 100 characters'
    }),
  description: Joi.string()
    .max(500)
    .trim()
    .optional()
    .allow('')
    .messages({
      'string.max': 'Description cannot exceed 500 characters'
    }),
  isActive: Joi.boolean().optional()
});

export const departmentQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).optional().default(1),
  limit: Joi.number().integer().min(1).max(100).optional().default(10),
  search: Joi.string().trim().optional(),
  isActive: Joi.boolean().optional()
});

export const departmentIdParamSchema = Joi.object({
  id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
    'string.pattern.base': 'Invalid department ID format'
  })
});

