"use strict";

import { Router } from "express";
import {
  createPointOfInterest,
  deletePointOfInterestPermanently,
  getAllPointsOfInterest,
  getPointOfInterestById,
  updatePointOfInterest,
  deactivatePointOfInterest,
} from "../../../../controllers/admin/points-of-interest";
import {
  createPointOfInterestSchema,
  pointOfInterestIdParamSchema,
  pointOfInterestQuerySchema,
  updatePointOfInterestSchema,
} from "../../../../validations/admin/points-of-interest";
import { validate } from "../../../../utils";

const pointOfInterestRouter = Router();

pointOfInterestRouter.get("/", validate(pointOfInterestQuerySchema, "query"), getAllPointsOfInterest);

pointOfInterestRouter.get(
  "/:id",
  validate(pointOfInterestIdParamSchema, "params"),
  getPointOfInterestById,
);

pointOfInterestRouter.post("/", validate(createPointOfInterestSchema), createPointOfInterest);

pointOfInterestRouter.put(
  "/:id",
  validate(pointOfInterestIdParamSchema, "params"),
  validate(updatePointOfInterestSchema),
  updatePointOfInterest,
);

pointOfInterestRouter.patch(
  "/:id/deactivate",
  validate(pointOfInterestIdParamSchema, "params"),
  deactivatePointOfInterest,
);

pointOfInterestRouter.delete(
  "/:id",
  validate(pointOfInterestIdParamSchema, "params"),
  deletePointOfInterestPermanently,
);

export default pointOfInterestRouter;

