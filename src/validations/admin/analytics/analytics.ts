import Joi from "joi";

export const analyticsQuerySchema = Joi.object({
  organizationId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .messages({
      "string.pattern.base": "Invalid organization ID format",
    }),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  dateRange: Joi.string()
    .valid("Last 7 days", "Last 30 days", "Last 90 days", "Last 180 days", "Last 365 days", "Last year", "Last Ever")
    .optional()
    .messages({
      "any.only": "Date range must be one of: Last 7 days, Last 30 days, Last 90 days, Last 180 days, Last 365 days, Last year, Last Ever",
    }),
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

