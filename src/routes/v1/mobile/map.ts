"use strict";

import { Router } from "express";
import {
  getBuildings,
  getBuildingById,
  getFloorPlans,
  getFloorPlanById,
  getNavigationPaths,
} from "../../../controllers/mobile/map";
import { authenticateMobile } from "../../../middlewares/auth";

const router = Router();

router.use(authenticateMobile);

router.get("/buildings", getBuildings);

router.get("/buildings/:id", getBuildingById);

router.get("/floor-plans", getFloorPlans);

router.get("/floor-plans/:id", getFloorPlanById);

router.get("/navigation/paths", getNavigationPaths);

export default router;

