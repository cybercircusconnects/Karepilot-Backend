import Joi from "joi";

const objectIdRule = Joi.string().pattern(/^[0-9a-fA-F]{24}$/);

export const updateMapSettingsSchema = Joi.object({
  organizationId: objectIdRule.required().messages({
    "string.pattern.base": "Invalid organization ID format",
    "any.required": "Organization ID is required",
  }),
  autoPublishUpdates: Joi.boolean().optional(),
  highResolutionThumbnails: Joi.boolean().optional(),
  enableVersionControl: Joi.boolean().optional(),
});

export const mapSettingsQuerySchema = Joi.object({
  organizationId: objectIdRule.required().messages({
    "string.pattern.base": "Invalid organization ID format",
    "any.required": "Organization ID is required",
  }),
});

