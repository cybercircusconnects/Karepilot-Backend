import Joi from "joi";

const coordinatesSchema = Joi.object({
  x: Joi.number().required(),
  y: Joi.number().required(),
});

export const createMapEditorAnnotationSchema = Joi.object({
  floorPlanId: Joi.string().required(),
  name: Joi.string().required().trim(),
  description: Joi.string().optional().trim().allow(""),
  type: Joi.string().required().trim(),
  coordinates: coordinatesSchema.required(),
  color: Joi.string().optional(),
});

export const updateMapEditorAnnotationSchema = Joi.object({
  name: Joi.string().optional().trim(),
  description: Joi.string().optional().trim().allow(""),
  type: Joi.string().optional().trim(),
  coordinates: coordinatesSchema.optional(),
  color: Joi.string().optional(),
  isActive: Joi.boolean().optional(),
});

