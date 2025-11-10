"use strict";

import Joi from "joi";
import { PointOfInterestStatus } from "../../../types/admin/points-of-interest";

const objectIdSchema = Joi.string().pattern(/^[0-9a-fA-F]{24}$/);

const contactInformationSchema = Joi.object({
  phone: Joi.string().max(50).allow("", null),
  email: Joi.string().email().allow("", null),
  operatingHours: Joi.string().max(100).allow("", null),
}).optional();

const accessibilitySchema = Joi.object({
  wheelchairAccessible: Joi.boolean(),
  hearingLoop: Joi.boolean(),
  visualAidSupport: Joi.boolean(),
}).optional();

const mapCoordinatesSchema = Joi.object({
  x: Joi.number().optional(),
  y: Joi.number().optional(),
  latitude: Joi.number().min(-90).max(90).optional(),
  longitude: Joi.number().min(-180).max(180).optional(),
}).optional();

const tagsArraySchema = Joi.array().items(Joi.string().trim().max(100)).max(50);

export const createPointOfInterestSchema = Joi.object({
  organizationId: objectIdSchema.required().messages({
    "string.pattern.base": "Organization ID must be a valid MongoDB ObjectId",
    "any.required": "Organization is required",
  }),
  name: Joi.string().min(2).max(150).trim().required(),
  category: Joi.string().min(2).max(120).trim().required(),
  categoryType: Joi.string().max(120).trim().optional(),
  building: Joi.string().min(1).max(120).trim().required(),
  floor: Joi.string().min(1).max(120).trim().required(),
  roomNumber: Joi.string().max(120).trim().allow("", null),
  description: Joi.string().max(1000).trim().allow("", null),
  tags: tagsArraySchema.optional(),
  amenities: tagsArraySchema.optional(),
  contact: contactInformationSchema,
  accessibility: accessibilitySchema,
  status: Joi.string()
    .valid(...Object.values(PointOfInterestStatus))
    .optional(),
  mapCoordinates: mapCoordinatesSchema,
  isActive: Joi.boolean().optional(),
});

export const updatePointOfInterestSchema = Joi.object({
  organizationId: objectIdSchema.optional(),
  name: Joi.string().min(2).max(150).trim().optional(),
  category: Joi.string().min(2).max(120).trim().optional(),
  categoryType: Joi.string().max(120).trim().allow("", null).optional(),
  building: Joi.string().min(1).max(120).trim().optional(),
  floor: Joi.string().min(1).max(120).trim().optional(),
  roomNumber: Joi.string().max(120).trim().allow("", null).optional(),
  description: Joi.string().max(1000).trim().allow("", null).optional(),
  tags: tagsArraySchema.optional(),
  amenities: tagsArraySchema.optional(),
  contact: contactInformationSchema,
  accessibility: accessibilitySchema,
  status: Joi.string()
    .valid(...Object.values(PointOfInterestStatus))
    .optional(),
  mapCoordinates: mapCoordinatesSchema,
  isActive: Joi.boolean().optional(),
}).min(1);

export const pointOfInterestQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).optional().default(1),
  limit: Joi.number().integer().min(1).max(100).optional().default(10),
  search: Joi.string().trim().optional(),
  category: Joi.string().trim().optional(),
  status: Joi.string()
    .valid(...Object.values(PointOfInterestStatus))
    .optional(),
  building: Joi.string().trim().optional(),
  floor: Joi.string().trim().optional(),
  organizationId: objectIdSchema.optional(),
  isActive: Joi.boolean().optional(),
});

export const pointOfInterestIdParamSchema = Joi.object({
  id: objectIdSchema.required().messages({
    "string.pattern.base": "Point of interest ID must be a valid MongoDB ObjectId",
    "any.required": "Point of interest ID is required",
  }),
});

