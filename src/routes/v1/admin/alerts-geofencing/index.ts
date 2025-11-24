"use strict";

import { Router } from "express";
import alertRouter from "./alert";
import geofenceRouter from "./geofence";

const router = Router();

router.use("/alerts", alertRouter);
router.use("/geofences", geofenceRouter);

export default router;

