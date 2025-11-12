import Joi from "joi";

const objectId = Joi.string().pattern(/^[0-9a-fA-F]{24}$/);

const addressSchema = Joi.object({
  line1: Joi.string().max(200).optional(),
  line2: Joi.string().max(200).optional(),
  city: Joi.string().max(120).optional(),
  state: Joi.string().max(120).optional(),
  postalCode: Joi.string().max(20).optional(),
  country: Joi.string().max(120).optional(),
}).optional();

const geoLocationSchema = Joi.object({
  latitude: Joi.number().min(-90).max(90).optional(),
  longitude: Joi.number().min(-180).max(180).optional(),
}).optional();

export const createBuildingSchema = Joi.object({
  organization: objectId.required(),
  name: Joi.string().min(2).max(180).required(),
  code: Joi.string().uppercase().max(20).optional(),
  description: Joi.string().max(1000).optional(),
  tags: Joi.array().items(Joi.string().trim().min(1)).default([]),
  address: addressSchema,
  geoLocation: geoLocationSchema,
  defaultFloor: objectId.optional().allow(null),
  metadata: Joi.object().optional(),
  isActive: Joi.boolean().optional(),
});

export const updateBuildingSchema = Joi.object({
  name: Joi.string().min(2).max(180).optional(),
  code: Joi.string().uppercase().max(20).optional(),
  description: Joi.string().max(1000).optional(),
  tags: Joi.array().items(Joi.string().trim().min(1)).optional(),
  address: addressSchema.allow(null),
  geoLocation: geoLocationSchema.allow(null),
  defaultFloor: objectId.allow(null).optional(),
  metadata: Joi.object().optional().allow(null),
  isActive: Joi.boolean().optional(),
}).min(1);

export const buildingIdParamSchema = Joi.object({
  id: objectId.required(),
});

export const buildingQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
  organization: objectId.optional(),
  search: Joi.string().trim().optional(),
  isActive: Joi.boolean().optional(),
  tag: Joi.string().trim().optional(),
});


