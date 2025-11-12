import Joi from "joi";

const objectId = Joi.string().pattern(/^[0-9a-fA-F]{24}$/);

export const createFloorSchema = Joi.object({
  organization: objectId.required(),
  building: objectId.required(),
  name: Joi.string().min(1).max(120).required(),
  code: Joi.string().uppercase().max(20).optional(),
  level: Joi.number().required(),
  sequence: Joi.number().integer().min(0).required(),
  description: Joi.string().max(500).optional(),
  isBasement: Joi.boolean().optional(),
  isDefault: Joi.boolean().optional(),
  tags: Joi.array().items(Joi.string().trim().min(1)).default([]),
  attributes: Joi.object().optional(),
  isActive: Joi.boolean().optional(),
});

export const updateFloorSchema = Joi.object({
  name: Joi.string().min(1).max(120).optional(),
  code: Joi.string().uppercase().max(20).optional(),
  level: Joi.number().optional(),
  sequence: Joi.number().integer().min(0).optional(),
  description: Joi.string().max(500).optional(),
  isBasement: Joi.boolean().optional(),
  isDefault: Joi.boolean().optional(),
  tags: Joi.array().items(Joi.string().trim().min(1)).optional(),
  attributes: Joi.object().optional().allow(null),
  isActive: Joi.boolean().optional(),
}).min(1);

export const floorIdParamSchema = Joi.object({
  id: objectId.required(),
});

export const buildingFloorParamSchema = Joi.object({
  buildingId: objectId.required(),
});

export const floorQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
  organization: objectId.optional(),
  building: objectId.optional(),
  search: Joi.string().trim().optional(),
  isActive: Joi.boolean().optional(),
  includeInactiveBuilding: Joi.boolean().optional(),
});


