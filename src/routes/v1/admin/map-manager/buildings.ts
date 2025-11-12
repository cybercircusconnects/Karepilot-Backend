import { Router } from "express";
import {
  createBuilding,
  deleteBuilding,
  getBuildingById,
  getBuildings,
  getBuildingStats,
  updateBuilding,
} from "../../../../controllers/admin/map-manager";
import { validate } from "../../../../utils";
import {
  buildingIdParamSchema,
  buildingQuerySchema,
  createBuildingSchema,
  updateBuildingSchema,
} from "../../../../validations/admin/map-manager";

const router = Router();

router
  .route("/")
  .get(validate(buildingQuerySchema, "query"), getBuildings)
  .post(validate(createBuildingSchema), createBuilding);

router.get("/stats", validate(buildingQuerySchema, "query"), getBuildingStats);

router
  .route("/:id")
  .get(validate(buildingIdParamSchema, "params"), getBuildingById)
  .put(validate(buildingIdParamSchema, "params"), validate(updateBuildingSchema), updateBuilding)
  .delete(validate(buildingIdParamSchema, "params"), deleteBuilding);

export default router;
