import Joi from "joi";
import { GeofenceType } from "../../../models/admin/alerts-geofencing/geofence";

const objectIdPattern = /^[0-9a-fA-F]{24}$/;

const notificationSettingsSchema = Joi.object({
  email: Joi.boolean().optional(),
  sms: Joi.boolean().optional(),
  push: Joi.boolean().optional(),
  sound: Joi.boolean().optional(),
});

const coordinatesSchema = Joi.object({
  x: Joi.number().allow(null).optional(),
  y: Joi.number().allow(null).optional(),
  latitude: Joi.number().allow(null).optional(),
  longitude: Joi.number().allow(null).optional(),
  radius: Joi.number().allow(null).optional(),
});

export const createGeofenceSchema = Joi.object({
  organizationId: Joi.string()
    .pattern(objectIdPattern)
    .required()
    .messages({
      "string.pattern.base": "Invalid organization ID format",
      "any.required": "Organization ID is required",
    }),
  buildingId: Joi.string()
    .pattern(objectIdPattern)
    .allow(null, "")
    .optional()
    .messages({
      "string.pattern.base": "Invalid building ID format",
    }),
  floorId: Joi.string()
    .pattern(objectIdPattern)
    .allow(null, "")
    .optional()
    .messages({
      "string.pattern.base": "Invalid floor plan ID format",
    }),
  name: Joi.string()
    .min(2)
    .max(200)
    .trim()
    .required()
    .messages({
      "string.min": "Geofence name must be at least 2 characters long",
      "string.max": "Geofence name cannot exceed 200 characters",
      "any.required": "Geofence name is required",
    }),
  description: Joi.string()
    .max(1000)
    .trim()
    .allow(null, "")
    .optional()
    .messages({
      "string.max": "Description cannot exceed 1000 characters",
    }),
  type: Joi.string()
    .valid(...Object.values(GeofenceType))
    .required()
    .messages({
      "any.only": `Geofence type must be one of: ${Object.values(GeofenceType).join(", ")}`,
      "any.required": "Geofence type is required",
    }),
  coordinates: coordinatesSchema.optional(),
  alertOnEntry: Joi.boolean().optional(),
  alertOnExit: Joi.boolean().optional(),
  notificationSettings: notificationSettingsSchema.optional(),
});

export const updateGeofenceSchema = Joi.object({
  buildingId: Joi.string()
    .pattern(objectIdPattern)
    .allow(null, "")
    .optional()
    .messages({
      "string.pattern.base": "Invalid building ID format",
    }),
  floorId: Joi.string()
    .pattern(objectIdPattern)
    .allow(null, "")
    .optional()
    .messages({
      "string.pattern.base": "Invalid floor plan ID format",
    }),
  name: Joi.string()
    .min(2)
    .max(200)
    .trim()
    .optional()
    .messages({
      "string.min": "Geofence name must be at least 2 characters long",
      "string.max": "Geofence name cannot exceed 200 characters",
    }),
  description: Joi.string()
    .max(1000)
    .trim()
    .allow(null, "")
    .optional()
    .messages({
      "string.max": "Description cannot exceed 1000 characters",
    }),
  type: Joi.string()
    .valid(...Object.values(GeofenceType))
    .optional()
    .messages({
      "any.only": `Geofence type must be one of: ${Object.values(GeofenceType).join(", ")}`,
    }),
  coordinates: coordinatesSchema.optional(),
  alertOnEntry: Joi.boolean().optional(),
  alertOnExit: Joi.boolean().optional(),
  notificationSettings: notificationSettingsSchema.optional(),
  isActive: Joi.boolean().optional(),
});

export const geofenceQuerySchema = Joi.object({
  organizationId: Joi.string()
    .pattern(objectIdPattern)
    .required()
    .messages({
      "string.pattern.base": "Invalid organization ID format",
      "any.required": "Organization ID is required",
    }),
  buildingId: Joi.string()
    .pattern(objectIdPattern)
    .optional()
    .messages({
      "string.pattern.base": "Invalid building ID format",
    }),
  floorId: Joi.string()
    .pattern(objectIdPattern)
    .optional()
    .messages({
      "string.pattern.base": "Invalid floor plan ID format",
    }),
  type: Joi.string()
    .valid(...Object.values(GeofenceType))
    .optional()
    .messages({
      "any.only": `Geofence type must be one of: ${Object.values(GeofenceType).join(", ")}`,
    }),
  search: Joi.string().trim().optional(),
  isActive: Joi.boolean().optional(),
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
});

export const toggleGeofenceSchema = Joi.object({
  isActive: Joi.boolean().required().messages({
    "any.required": "isActive is required",
  }),
});

