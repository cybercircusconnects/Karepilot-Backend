import Joi from 'joi';
import { AssetType, AssetStatus } from '../../../models/admin/asset-tracking/asset';

export const createAssetSchema = Joi.object({
  organization: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid organization ID format',
      'any.required': 'Organization is required'
    }),
  name: Joi.string()
    .min(2)
    .max(150)
    .trim()
    .required()
    .messages({
      'string.min': 'Asset name must be at least 2 characters long',
      'string.max': 'Asset name cannot exceed 150 characters',
      'any.required': 'Asset name is required'
    }),
  type: Joi.string()
    .valid(...Object.values(AssetType))
    .required()
    .messages({
      'any.only': `Asset type must be one of: ${Object.values(AssetType).join(', ')}`,
      'any.required': 'Asset type is required'
    }),
  status: Joi.string()
    .valid(...Object.values(AssetStatus))
    .optional()
    .messages({
      'any.only': `Asset status must be one of: ${Object.values(AssetStatus).join(', ')}`
    }),
  building: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .allow(null, '')
    .optional()
    .messages({
      'string.pattern.base': 'Invalid building ID format'
    }),
  floor: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .allow(null, '')
    .optional()
    .messages({
      'string.pattern.base': 'Invalid floor plan ID format'
    }),
  location: Joi.string()
    .max(200)
    .trim()
    .allow(null, '')
    .optional()
    .messages({
      'string.max': 'Location cannot exceed 200 characters'
    }),
  department: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .allow(null, '')
    .optional()
    .messages({
      'string.pattern.base': 'Invalid department ID format'
    }),
  batteryLevel: Joi.number()
    .min(0)
    .max(100)
    .allow(null)
    .optional()
    .messages({
      'number.min': 'Battery level cannot be less than 0',
      'number.max': 'Battery level cannot exceed 100'
    }),
  lastSeen: Joi.date()
    .allow(null)
    .optional(),
  mapCoordinates: Joi.object({
    x: Joi.number().allow(null).optional(),
    y: Joi.number().allow(null).optional(),
    latitude: Joi.number().allow(null).optional(),
    longitude: Joi.number().allow(null).optional(),
  }).optional(),
  description: Joi.string()
    .max(500)
    .trim()
    .allow(null, '')
    .optional()
    .messages({
      'string.max': 'Description cannot exceed 500 characters'
    }),
  tags: Joi.array()
    .items(Joi.string().trim())
    .optional(),
  isActive: Joi.boolean().optional()
});

export const updateAssetSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(150)
    .trim()
    .optional()
    .messages({
      'string.min': 'Asset name must be at least 2 characters long',
      'string.max': 'Asset name cannot exceed 150 characters'
    }),
  type: Joi.string()
    .valid(...Object.values(AssetType))
    .optional()
    .messages({
      'any.only': `Asset type must be one of: ${Object.values(AssetType).join(', ')}`
    }),
  status: Joi.string()
    .valid(...Object.values(AssetStatus))
    .optional()
    .messages({
      'any.only': `Asset status must be one of: ${Object.values(AssetStatus).join(', ')}`
    }),
  building: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .allow(null, '')
    .optional()
    .messages({
      'string.pattern.base': 'Invalid building ID format'
    }),
  floor: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .allow(null, '')
    .optional()
    .messages({
      'string.pattern.base': 'Invalid floor plan ID format'
    }),
  location: Joi.string()
    .max(200)
    .trim()
    .allow(null, '')
    .optional()
    .messages({
      'string.max': 'Location cannot exceed 200 characters'
    }),
  department: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .allow(null, '')
    .optional()
    .messages({
      'string.pattern.base': 'Invalid department ID format'
    }),
  batteryLevel: Joi.number()
    .min(0)
    .max(100)
    .allow(null)
    .optional()
    .messages({
      'number.min': 'Battery level cannot be less than 0',
      'number.max': 'Battery level cannot exceed 100'
    }),
  lastSeen: Joi.date()
    .allow(null)
    .optional(),
  mapCoordinates: Joi.object({
    x: Joi.number().allow(null).optional(),
    y: Joi.number().allow(null).optional(),
    latitude: Joi.number().allow(null).optional(),
    longitude: Joi.number().allow(null).optional(),
  }).optional(),
  description: Joi.string()
    .max(500)
    .trim()
    .allow(null, '')
    .optional()
    .messages({
      'string.max': 'Description cannot exceed 500 characters'
    }),
  tags: Joi.array()
    .items(Joi.string().trim())
    .optional(),
  isActive: Joi.boolean().optional()
});

export const assetQuerySchema = Joi.object({
  organizationId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .messages({
      'string.pattern.base': 'Invalid organization ID format'
    }),
  buildingId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .messages({
      'string.pattern.base': 'Invalid building ID format'
    }),
  floorId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .messages({
      'string.pattern.base': 'Invalid floor plan ID format'
    }),
  departmentId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .messages({
      'string.pattern.base': 'Invalid department ID format'
    }),
  type: Joi.alternatives().try(
    Joi.string().valid(...Object.values(AssetType)),
    Joi.array().items(Joi.string().valid(...Object.values(AssetType)))
  ).optional(),
  status: Joi.alternatives().try(
    Joi.string().valid(...Object.values(AssetStatus)),
    Joi.array().items(Joi.string().valid(...Object.values(AssetStatus)))
  ).optional(),
  search: Joi.string().trim().optional(),
  isActive: Joi.boolean().optional(),
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional()
});

export const assetIdParamSchema = Joi.object({
  id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid asset ID format',
      'any.required': 'Asset ID is required'
    })
});

export const updateAssetLocationSchema = Joi.object({
  building: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .allow(null, '')
    .optional()
    .messages({
      'string.pattern.base': 'Invalid building ID format'
    }),
  floor: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .allow(null, '')
    .optional()
    .messages({
      'string.pattern.base': 'Invalid floor plan ID format'
    }),
  location: Joi.string()
    .max(200)
    .trim()
    .allow(null, '')
    .optional()
    .messages({
      'string.max': 'Location cannot exceed 200 characters'
    }),
  mapCoordinates: Joi.object({
    x: Joi.number().allow(null).optional(),
    y: Joi.number().allow(null).optional(),
    latitude: Joi.number().allow(null).optional(),
    longitude: Joi.number().allow(null).optional(),
  }).optional(),
  lastSeen: Joi.date().optional()
});

export const updateAssetBatterySchema = Joi.object({
  batteryLevel: Joi.number()
    .min(0)
    .max(100)
    .required()
    .messages({
      'number.min': 'Battery level cannot be less than 0',
      'number.max': 'Battery level cannot exceed 100',
      'any.required': 'Battery level is required'
    })
});

