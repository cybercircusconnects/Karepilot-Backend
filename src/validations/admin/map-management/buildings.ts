import Joi from "joi";
import { MapBuildingStatus } from "../../../types/admin/map-management";

const objectIdRule = Joi.string().pattern(/^[0-9a-fA-F]{24}$/);

export const createBuildingSchema = Joi.object({
  organizationId: objectIdRule.required().messages({
    "string.pattern.base": "Invalid organization ID format",
    "any.required": "Organization ID is required",
  }),
  name: Joi.string().trim().min(2).max(120).required().messages({
    "string.min": "Building name must be at least 2 characters long",
    "string.max": "Building name cannot exceed 120 characters",
    "any.required": "Building name is required",
  }),
  code: Joi.string().trim().max(50).optional().allow(null, "").messages({
    "string.max": "Building code cannot exceed 50 characters",
  }),
  description: Joi.string().trim().max(500).optional().allow(null, "").messages({
    "string.max": "Description cannot exceed 500 characters",
  }),
  tags: Joi.array()
    .items(Joi.string().trim().max(40))
    .optional()
    .messages({
      "array.base": "Tags must be an array of strings",
      "string.max": "Tag cannot exceed 40 characters",
    }),
  status: Joi.string()
    .valid(...Object.values(MapBuildingStatus))
    .optional()
    .messages({
      "any.only": `Status must be one of: ${Object.values(MapBuildingStatus).join(", ")}`,
    }),
  venueTemplateId: objectIdRule.optional().allow(null, "").messages({
    "string.pattern.base": "Invalid venue template ID format",
  }),
  isActive: Joi.boolean().optional().messages({
    "boolean.base": "isActive must be a boolean",
  }),
});

export const updateBuildingSchema = Joi.object({
  name: Joi.string().trim().min(2).max(120).optional().messages({
    "string.min": "Building name must be at least 2 characters long",
    "string.max": "Building name cannot exceed 120 characters",
  }),
  code: Joi.string().trim().max(50).optional().allow(null, "").messages({
    "string.max": "Building code cannot exceed 50 characters",
  }),
  description: Joi.string().trim().max(500).optional().allow(null, "").messages({
    "string.max": "Description cannot exceed 500 characters",
  }),
  tags: Joi.array()
    .items(Joi.string().trim().max(40))
    .optional()
    .messages({
      "array.base": "Tags must be an array of strings",
      "string.max": "Tag cannot exceed 40 characters",
    }),
  status: Joi.string()
    .valid(...Object.values(MapBuildingStatus))
    .optional()
    .messages({
      "any.only": `Status must be one of: ${Object.values(MapBuildingStatus).join(", ")}`,
    }),
  venueTemplateId: objectIdRule.optional().allow(null, "").messages({
    "string.pattern.base": "Invalid venue template ID format",
  }),
  isActive: Joi.boolean().optional().messages({
    "boolean.base": "isActive must be a boolean",
  }),
});

export const buildingQuerySchema = Joi.object({
  organizationId: objectIdRule.optional(),
  status: Joi.alternatives()
    .try(
      Joi.string()
        .valid(...Object.values(MapBuildingStatus))
        .messages({
          "any.only": `Status must be one of: ${Object.values(MapBuildingStatus).join(", ")}`,
        }),
      Joi.array()
        .items(
          Joi.string()
            .valid(...Object.values(MapBuildingStatus))
            .messages({
              "any.only": `Status must be one of: ${Object.values(MapBuildingStatus).join(", ")}`,
            }),
        )
        .messages({
          "array.base": "Status must be a string or array of strings",
        }),
    )
    .optional(),
  search: Joi.string().trim().optional(),
  tags: Joi.alternatives()
    .try(
      Joi.string().trim(),
      Joi.array().items(Joi.string().trim().max(40)).messages({
        "array.base": "Tags must be an array of strings",
        "string.max": "Tag cannot exceed 40 characters",
      }),
    )
    .optional(),
  isActive: Joi.boolean().optional().messages({
    "boolean.base": "isActive must be a boolean",
  }),
  page: Joi.number().integer().min(1).optional().default(1),
  limit: Joi.number().integer().min(1).max(100).optional().default(12),
});

export const buildingIdParamSchema = Joi.object({
  id: objectIdRule.required().messages({
    "string.pattern.base": "Invalid building ID format",
    "any.required": "Building ID is required",
  }),
});

