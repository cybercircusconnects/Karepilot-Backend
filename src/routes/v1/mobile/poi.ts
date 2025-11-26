"use strict";

import { Router } from "express";
import {
  getPointsOfInterest,
  getPointOfInterestById,
  searchPointsOfInterest,
} from "../../../controllers/mobile/poi";
import { authenticateMobile } from "../../../middlewares/auth";

const router = Router();

router.use(authenticateMobile);

router.get("/", getPointsOfInterest);

router.get("/search", searchPointsOfInterest);

router.get("/:id", getPointOfInterestById);

export default router;

