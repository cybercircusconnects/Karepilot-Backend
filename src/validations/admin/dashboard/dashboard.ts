import Joi from "joi";

export const dashboardQuerySchema = Joi.object({
  organizationId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid organization ID format",
      "any.required": "Organization ID is required",
    }),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
});

export const organizationIdParamSchema = Joi.object({
  id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid organization ID format",
      "any.required": "Organization ID is required",
    }),
});

