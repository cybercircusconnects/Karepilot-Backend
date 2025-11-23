"use strict";

import { Router } from "express";
import {
  getAssets,
  getAssetById,
  createAsset,
  updateAsset,
  deleteAsset,
  getAssetStats,
  updateAssetLocation,
  updateAssetBattery,
} from "../../../../controllers/admin/asset-tracking/asset";
import {
  assetQuerySchema,
  assetIdParamSchema,
  createAssetSchema,
  updateAssetSchema,
  updateAssetLocationSchema,
  updateAssetBatterySchema,
} from "../../../../validations/admin/asset-tracking/asset";
import { validate } from "../../../../utils";

const router = Router();

router.get("/", validate(assetQuerySchema, "query"), getAssets);

router.get("/stats", validate(assetQuerySchema, "query"), getAssetStats);

router.get("/:id", validate(assetIdParamSchema, "params"), getAssetById);

router.post("/", validate(createAssetSchema), createAsset);

router.put(
  "/:id",
  validate(assetIdParamSchema, "params"),
  validate(updateAssetSchema),
  updateAsset,
);

router.patch(
  "/:id/location",
  validate(assetIdParamSchema, "params"),
  validate(updateAssetLocationSchema),
  updateAssetLocation,
);

router.patch(
  "/:id/battery",
  validate(assetIdParamSchema, "params"),
  validate(updateAssetBatterySchema),
  updateAssetBattery,
);

router.delete("/:id", validate(assetIdParamSchema, "params"), deleteAsset);

export default router;

