import Joi from "joi";

const coordinatesSchema = Joi.object({
  x: Joi.number().required().messages({
    "any.required": "X coordinate is required",
    "number.base": "X coordinate must be a number",
  }),
  y: Joi.number().required().messages({
    "any.required": "Y coordinate is required",
    "number.base": "Y coordinate must be a number",
  }),
});

export const createMapEditorLabelSchema = Joi.object({
  floorPlanId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "any.required": "Floor plan ID is required",
      "string.pattern.base": "Invalid floor plan ID format",
    }),
  text: Joi.string()
    .min(1)
    .max(200)
    .trim()
    .required()
    .messages({
      "any.required": "Label text is required",
      "string.min": "Label text must be at least 1 character long",
      "string.max": "Label text cannot exceed 200 characters",
    }),
  coordinates: coordinatesSchema.required().messages({
    "any.required": "Coordinates are required",
  }),
  fontSize: Joi.string()
    .max(20)
    .trim()
    .allow("", null)
    .optional()
    .messages({
      "string.max": "Font size cannot exceed 20 characters",
    }),
  fontWeight: Joi.string()
    .max(20)
    .trim()
    .allow("", null)
    .optional()
    .messages({
      "string.max": "Font weight cannot exceed 20 characters",
    }),
  color: Joi.string()
    .max(20)
    .trim()
    .allow("", null)
    .optional()
    .messages({
      "string.max": "Color cannot exceed 20 characters",
    }),
});

export const updateMapEditorLabelSchema = Joi.object({
  text: Joi.string()
    .min(1)
    .max(200)
    .trim()
    .optional()
    .messages({
      "string.min": "Label text must be at least 1 character long",
      "string.max": "Label text cannot exceed 200 characters",
    }),
  coordinates: coordinatesSchema.optional(),
  fontSize: Joi.string()
    .max(20)
    .trim()
    .allow("", null)
    .optional()
    .messages({
      "string.max": "Font size cannot exceed 20 characters",
    }),
  fontWeight: Joi.string()
    .max(20)
    .trim()
    .allow("", null)
    .optional()
    .messages({
      "string.max": "Font weight cannot exceed 20 characters",
    }),
  color: Joi.string()
    .max(20)
    .trim()
    .allow("", null)
    .optional()
    .messages({
      "string.max": "Color cannot exceed 20 characters",
    }),
  isActive: Joi.boolean().optional(),
});

