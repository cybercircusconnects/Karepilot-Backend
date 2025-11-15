
"use strict";

import { Router } from "express";
import {
  getMapManagementSettings,
  updateMapManagementSettings,
} from "../../../../controllers/admin/map-management";
import { mapSettingsQuerySchema, updateMapSettingsSchema } from "../../../../validations/admin/map-management";
import { validate } from "../../../../utils";

const router = Router();

router.get("/", validate(mapSettingsQuerySchema, "query"), getMapManagementSettings);

router.put("/", validate(updateMapSettingsSchema), updateMapManagementSettings);

export default router;

