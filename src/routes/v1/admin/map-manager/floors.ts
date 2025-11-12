import { Router } from "express";
import {
  createFloor,
  deleteFloor,
  getFloorById,
  getFloors,
  updateFloor,
} from "../../../../controllers/admin/map-manager";
import { validate } from "../../../../utils";
import {
  createFloorSchema,
  floorIdParamSchema,
  floorQuerySchema,
  updateFloorSchema,
} from "../../../../validations/admin/map-manager";

const router = Router();

router
  .route("/")
  .get(validate(floorQuerySchema, "query"), getFloors)
  .post(validate(createFloorSchema), createFloor);

router
  .route("/:id")
  .get(validate(floorIdParamSchema, "params"), getFloorById)
  .put(
    validate(floorIdParamSchema, "params"),
    validate(updateFloorSchema),
    updateFloor,
  )
  .delete(validate(floorIdParamSchema, "params"), deleteFloor);

export default router;


