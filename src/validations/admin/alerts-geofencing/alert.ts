import Joi from "joi";
import { AlertType, AlertSeverity, AlertStatus } from "../../../models/admin/alerts-geofencing/alert";

const objectIdPattern = /^[0-9a-fA-F]{24}$/;

export const createAlertSchema = Joi.object({
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
  departmentId: Joi.string()
    .pattern(objectIdPattern)
    .allow(null, "")
    .optional()
    .messages({
      "string.pattern.base": "Invalid department ID format",
    }),
  assetId: Joi.string()
    .pattern(objectIdPattern)
    .allow(null, "")
    .optional()
    .messages({
      "string.pattern.base": "Invalid asset ID format",
    }),
  name: Joi.string()
    .min(2)
    .max(200)
    .trim()
    .required()
    .messages({
      "string.min": "Alert name must be at least 2 characters long",
      "string.max": "Alert name cannot exceed 200 characters",
      "any.required": "Alert name is required",
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
    .valid(...Object.values(AlertType))
    .required()
    .messages({
      "any.only": `Alert type must be one of: ${Object.values(AlertType).join(", ")}`,
      "any.required": "Alert type is required",
    }),
  severity: Joi.string()
    .valid(...Object.values(AlertSeverity))
    .required()
    .messages({
      "any.only": `Alert severity must be one of: ${Object.values(AlertSeverity).join(", ")}`,
      "any.required": "Alert severity is required",
    }),
  location: Joi.string()
    .max(200)
    .trim()
    .allow(null, "")
    .optional()
    .messages({
      "string.max": "Location cannot exceed 200 characters",
    }),
  room: Joi.string()
    .max(100)
    .trim()
    .allow(null, "")
    .optional()
    .messages({
      "string.max": "Room cannot exceed 100 characters",
    }),
  timestamp: Joi.date().optional(),
});

export const updateAlertSchema = Joi.object({
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
  departmentId: Joi.string()
    .pattern(objectIdPattern)
    .allow(null, "")
    .optional()
    .messages({
      "string.pattern.base": "Invalid department ID format",
    }),
  assetId: Joi.string()
    .pattern(objectIdPattern)
    .allow(null, "")
    .optional()
    .messages({
      "string.pattern.base": "Invalid asset ID format",
    }),
  name: Joi.string()
    .min(2)
    .max(200)
    .trim()
    .optional()
    .messages({
      "string.min": "Alert name must be at least 2 characters long",
      "string.max": "Alert name cannot exceed 200 characters",
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
    .valid(...Object.values(AlertType))
    .optional()
    .messages({
      "any.only": `Alert type must be one of: ${Object.values(AlertType).join(", ")}`,
    }),
  severity: Joi.string()
    .valid(...Object.values(AlertSeverity))
    .optional()
    .messages({
      "any.only": `Alert severity must be one of: ${Object.values(AlertSeverity).join(", ")}`,
    }),
  status: Joi.string()
    .valid(...Object.values(AlertStatus))
    .optional()
    .messages({
      "any.only": `Alert status must be one of: ${Object.values(AlertStatus).join(", ")}`,
    }),
  location: Joi.string()
    .max(200)
    .trim()
    .allow(null, "")
    .optional()
    .messages({
      "string.max": "Location cannot exceed 200 characters",
    }),
  room: Joi.string()
    .max(100)
    .trim()
    .allow(null, "")
    .optional()
    .messages({
      "string.max": "Room cannot exceed 100 characters",
    }),
  timestamp: Joi.date().optional(),
});

export const alertQuerySchema = Joi.object({
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
  departmentId: Joi.string()
    .pattern(objectIdPattern)
    .optional()
    .messages({
      "string.pattern.base": "Invalid department ID format",
    }),
  assetId: Joi.string()
    .pattern(objectIdPattern)
    .optional()
    .messages({
      "string.pattern.base": "Invalid asset ID format",
    }),
  type: Joi.string()
    .valid(...Object.values(AlertType))
    .optional()
    .messages({
      "any.only": `Alert type must be one of: ${Object.values(AlertType).join(", ")}`,
    }),
  severity: Joi.string()
    .valid(...Object.values(AlertSeverity))
    .optional()
    .messages({
      "any.only": `Alert severity must be one of: ${Object.values(AlertSeverity).join(", ")}`,
    }),
  status: Joi.string()
    .valid(...Object.values(AlertStatus))
    .optional()
    .messages({
      "any.only": `Alert status must be one of: ${Object.values(AlertStatus).join(", ")}`,
    }),
  search: Joi.string().trim().optional(),
  isActive: Joi.boolean().optional(),
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
});

