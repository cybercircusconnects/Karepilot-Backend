"use strict";

import { Router } from "express";
import {
  archiveFloorPlan,
  createFloorPlan,
  deleteFloorPlanPermanently,
  getFloorPlanById,
  getFloorPlans,
  updateFloorPlan,
  updateFloorPlanStatus,
} from "../../../../controllers/admin/map-management";
import {
  createFloorPlanSchema,
  floorPlanIdParamSchema,
  floorPlanQuerySchema,
  floorPlanStatusSchema,
  updateFloorPlanSchema,
} from "../../../../validations/admin/map-management";
import { validate } from "../../../../utils";

const router = Router();

router.get("/", validate(floorPlanQuerySchema, "query"), getFloorPlans);

router.get("/:id", validate(floorPlanIdParamSchema, "params"), getFloorPlanById);

router.post("/", validate(createFloorPlanSchema), createFloorPlan);

router.put(
  "/:id",
  validate(floorPlanIdParamSchema, "params"),
  validate(updateFloorPlanSchema),
  updateFloorPlan,
);

router.patch(
  "/:id/status",
  validate(floorPlanIdParamSchema, "params"),
  validate(floorPlanStatusSchema),
  updateFloorPlanStatus,
);

router.delete("/:id", validate(floorPlanIdParamSchema, "params"), archiveFloorPlan);

router.delete("/:id/permanent", validate(floorPlanIdParamSchema, "params"), deleteFloorPlanPermanently);

export default router;

