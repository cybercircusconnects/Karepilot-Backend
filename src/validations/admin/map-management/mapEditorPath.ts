import Joi from "joi";

const pointSchema = Joi.object({
  x: Joi.number().required().messages({
    "any.required": "X coordinate is required",
    "number.base": "X coordinate must be a number",
  }),
  y: Joi.number().required().messages({
    "any.required": "Y coordinate is required",
    "number.base": "Y coordinate must be a number",
  }),
});

export const createMapEditorPathSchema = Joi.object({
  floorPlanId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "any.required": "Floor plan ID is required",
      "string.pattern.base": "Invalid floor plan ID format",
    }),
  name: Joi.string()
    .max(150)
    .trim()
    .allow("", null)
    .optional()
    .messages({
      "string.max": "Path name cannot exceed 150 characters",
    }),
  points: Joi.array()
    .items(pointSchema)
    .min(2)
    .required()
    .messages({
      "any.required": "Path points are required",
      "array.min": "Path must have at least 2 points",
    }),
  color: Joi.string()
    .max(20)
    .trim()
    .allow("", null)
    .optional()
    .messages({
      "string.max": "Color cannot exceed 20 characters",
    }),
  strokeWidth: Joi.number()
    .min(1)
    .max(20)
    .optional()
    .messages({
      "number.min": "Stroke width must be at least 1",
      "number.max": "Stroke width cannot exceed 20",
    }),
});

export const updateMapEditorPathSchema = Joi.object({
  name: Joi.string()
    .max(150)
    .trim()
    .allow("", null)
    .optional()
    .messages({
      "string.max": "Path name cannot exceed 150 characters",
    }),
  points: Joi.array()
    .items(pointSchema)
    .min(2)
    .optional()
    .messages({
      "array.min": "Path must have at least 2 points",
    }),
  color: Joi.string()
    .max(20)
    .trim()
    .allow("", null)
    .optional()
    .messages({
      "string.max": "Color cannot exceed 20 characters",
    }),
  strokeWidth: Joi.number()
    .min(1)
    .max(20)
    .optional()
    .messages({
      "number.min": "Stroke width must be at least 1",
      "number.max": "Stroke width cannot exceed 20",
    }),
  isActive: Joi.boolean().optional(),
});

