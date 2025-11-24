"use strict";

import { Router } from "express";
import {
  createAlert,
  getAlerts,
  getAlertById,
  updateAlert,
  deleteAlert,
  acknowledgeAlert,
  resolveAlert,
  getAlertStats,
} from "../../../../controllers/admin/alerts-geofencing/alert";
import {
  createAlertSchema,
  updateAlertSchema,
  alertQuerySchema,
} from "../../../../validations/admin/alerts-geofencing/alert";
import { validate } from "../../../../utils";
import { authenticateAdmin } from "../../../../middlewares/auth";

const router = Router();

router.use(authenticateAdmin);

router.get("/", validate(alertQuerySchema, "query"), getAlerts);

router.get("/stats/:organizationId", getAlertStats);

router.get("/:id", getAlertById);

router.post("/", validate(createAlertSchema), createAlert);

router.put("/:id", validate(updateAlertSchema), updateAlert);

router.patch("/:id/acknowledge", acknowledgeAlert);

router.patch("/:id/resolve", resolveAlert);

router.delete("/:id", deleteAlert);

export default router;

