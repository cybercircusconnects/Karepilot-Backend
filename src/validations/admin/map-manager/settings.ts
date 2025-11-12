import Joi from "joi";
import { MapLayerType } from "../../../models/admin/map-manager";

const objectId = Joi.string().pattern(/^[0-9a-fA-F]{24}$/);

export const settingsParamSchema = Joi.object({
  organizationId: objectId.required(),
});

export const updateSettingsSchema = Joi.object({
  organization: objectId.required(),
  autoPublishUpdates: Joi.boolean().optional(),
  highResThumbnails: Joi.boolean().optional(),
  enableVersionControl: Joi.boolean().optional(),
  defaultGridSize: Joi.number().min(1).max(500).optional(),
  defaultGridUnit: Joi.string().valid("px", "ft", "m").optional(),
  defaultSnapToGrid: Joi.boolean().optional(),
  defaultShowGrid: Joi.boolean().optional(),
  defaultZoom: Joi.number().min(10).max(400).optional(),
  defaultMapScale: Joi.string().max(50).allow(null).optional(),
  allowedFileTypes: Joi.array().items(Joi.string().trim().min(1)).optional(),
  maxUploadSizeMb: Joi.number().min(1).max(500).optional(),
  defaultLayerVisibility: Joi.object()
    .pattern(
      Joi.string().valid(...Object.values(MapLayerType)),
      Joi.boolean(),
    )
    .optional(),
  notificationPreferences: Joi.object({
    publishSuccess: Joi.boolean().optional(),
    publishFailure: Joi.boolean().optional(),
    approvalRequired: Joi.boolean().optional(),
  }).optional(),
  retentionPolicy: Joi.object({
    keepDraftVersions: Joi.number().min(0).optional(),
    keepPublishedSnapshots: Joi.number().min(0).optional(),
  }).optional(),
}).min(1);


