"use strict";

import { Router } from "express";
import {
  archiveBuilding,
  createBuilding,
  deleteBuildingPermanently,
  getBuildingById,
  getBuildings,
  updateBuilding,
} from "../../../../controllers/admin/map-management";
import {
  buildingIdParamSchema,
  buildingQuerySchema,
  createBuildingSchema,
  updateBuildingSchema,
} from "../../../../validations/admin/map-management";
import { validate } from "../../../../utils";

const router = Router();

router.get("/", validate(buildingQuerySchema, "query"), getBuildings);

router.get("/:id", validate(buildingIdParamSchema, "params"), getBuildingById);

router.post("/", validate(createBuildingSchema), createBuilding);

router.put(
  "/:id",
  validate(buildingIdParamSchema, "params"),
  validate(updateBuildingSchema),
  updateBuilding,
);

router.patch("/:id/archive", validate(buildingIdParamSchema, "params"), archiveBuilding);

router.delete("/:id/permanent", validate(buildingIdParamSchema, "params"), deleteBuildingPermanently);

export default router;

