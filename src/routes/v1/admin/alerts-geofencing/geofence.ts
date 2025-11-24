"use strict";

import { Router } from "express";
import {
  createGeofence,
  getGeofences,
  getGeofenceById,
  updateGeofence,
  deleteGeofence,
  toggleGeofence,
  getGeofenceStats,
} from "../../../../controllers/admin/alerts-geofencing/geofence";
import {
  createGeofenceSchema,
  updateGeofenceSchema,
  geofenceQuerySchema,
  toggleGeofenceSchema,
} from "../../../../validations/admin/alerts-geofencing/geofence";
import { validate } from "../../../../utils";
import { authenticateAdmin } from "../../../../middlewares/auth";

const router = Router();

router.use(authenticateAdmin);

router.get("/", validate(geofenceQuerySchema, "query"), getGeofences);

router.get("/stats/:organizationId", getGeofenceStats);

router.get("/:id", getGeofenceById);

router.post("/", validate(createGeofenceSchema), createGeofence);

router.put("/:id", validate(updateGeofenceSchema), updateGeofence);

router.patch("/:id/toggle", validate(toggleGeofenceSchema), toggleGeofence);

router.delete("/:id", deleteGeofence);

export default router;

