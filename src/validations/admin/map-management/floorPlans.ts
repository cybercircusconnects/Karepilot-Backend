import Joi from "joi";
import { MapFloorPlanStatus } from "../../../types/admin/map-management";

const objectIdRule = Joi.string().pattern(/^[0-9a-fA-F]{24}$/);

const mediaSchema = Joi.object({
  fileUrl: Joi.string().uri().optional().allow(null, "").messages({
    "string.uri": "File URL must be a valid URI from the upload service",
  }),
  fileKey: Joi.string().trim().optional().allow(null, "").messages({
    "string.base": "File key must be a string (publicId from upload service)",
  }),
  thumbnailUrl: Joi.string().uri().optional().allow(null, "").messages({
    "string.uri": "Thumbnail URL must be a valid URI from the upload service",
  }),
  thumbnailKey: Joi.string().trim().optional().allow(null, "").messages({
    "string.base": "Thumbnail key must be a string (publicId from upload service)",
  }),
}).optional();

const metadataSchema = Joi.object({
  scale: Joi.string().trim().max(50).optional().allow(null, ""),
  description: Joi.string().trim().max(2000).optional().allow(null, ""),
  tags: Joi.array().items(Joi.string().trim().max(40)).optional(),
  highlights: Joi.array().items(Joi.string().trim().max(80)).optional(),
}).optional();

export const createFloorPlanSchema = Joi.object({
  organizationId: objectIdRule.required().messages({
    "string.pattern.base": "Invalid organization ID format",
    "any.required": "Organization ID is required",
  }),
  buildingId: objectIdRule.required().messages({
    "string.pattern.base": "Invalid building ID format",
    "any.required": "Building ID is required",
  }),
  title: Joi.string().trim().min(2).max(150).required().messages({
    "string.min": "Floor plan title must be at least 2 characters long",
    "string.max": "Floor plan title cannot exceed 150 characters",
    "any.required": "Floor plan title is required",
  }),
  floorLabel: Joi.string().trim().max(80).required().messages({
    "string.max": "Floor label cannot exceed 80 characters",
    "any.required": "Floor label is required",
  }),
  floorNumber: Joi.number().integer().min(-10).max(200).optional().allow(null),
  status: Joi.string()
    .valid(...Object.values(MapFloorPlanStatus))
    .optional()
    .messages({
      "any.only": `Status must be one of: ${Object.values(MapFloorPlanStatus).join(", ")}`,
    }),
  media: mediaSchema,
  metadata: metadataSchema,
  isTemplate: Joi.boolean().optional(),
  versionNotes: Joi.string().trim().max(1000).optional().allow(null, ""),
});

export const updateFloorPlanSchema = Joi.object({
  buildingId: objectIdRule.optional().messages({
    "string.pattern.base": "Invalid building ID format",
  }),
  title: Joi.string().trim().min(2).max(150).optional().messages({
    "string.min": "Floor plan title must be at least 2 characters long",
    "string.max": "Floor plan title cannot exceed 150 characters",
  }),
  floorLabel: Joi.string().trim().max(80).optional().messages({
    "string.max": "Floor label cannot exceed 80 characters",
  }),
  floorNumber: Joi.number().integer().min(-10).max(200).optional().allow(null),
  status: Joi.string()
    .valid(...Object.values(MapFloorPlanStatus))
    .optional()
    .messages({
      "any.only": `Status must be one of: ${Object.values(MapFloorPlanStatus).join(", ")}`,
    }),
  media: mediaSchema,
  metadata: metadataSchema,
  isTemplate: Joi.boolean().optional(),
  versionNotes: Joi.string().trim().max(1000).optional().allow(null, ""),
  incrementVersion: Joi.boolean().optional(),
});

export const floorPlanStatusSchema = Joi.object({
  status: Joi.string()
    .valid(...Object.values(MapFloorPlanStatus))
    .required()
    .messages({
      "any.only": `Status must be one of: ${Object.values(MapFloorPlanStatus).join(", ")}`,
      "any.required": "Status is required",
    }),
});

export const floorPlanQuerySchema = Joi.object({
  organizationId: objectIdRule.optional(),
  buildingId: objectIdRule.optional(),
  building: objectIdRule.optional(), 
  status: Joi.alternatives()
    .try(
      Joi.string()
        .valid(...Object.values(MapFloorPlanStatus))
        .messages({
          "any.only": `Status must be one of: ${Object.values(MapFloorPlanStatus).join(", ")}`,
        }),
      Joi.string()
        .valid("draft", "published", "disabled", "archived")
        .messages({
          "any.only": `Status must be one of: draft, published, disabled, archived`,
        }),
      Joi.array()
        .items(
          Joi.string()
            .valid(...Object.values(MapFloorPlanStatus))
            .messages({
              "any.only": `Status must be one of: ${Object.values(MapFloorPlanStatus).join(", ")}`,
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
  floorLabel: Joi.string().trim().optional(),
  page: Joi.number().integer().min(1).optional().default(1),
  limit: Joi.number().integer().min(1).max(100).optional().default(12),
});

export const floorPlanIdParamSchema = Joi.object({
  id: objectIdRule.required().messages({
    "string.pattern.base": "Invalid floor plan ID format",
    "any.required": "Floor plan ID is required",
  }),
});

