import { Router } from "express";
import {
  getMapManagerSettings,
  updateMapManagerSettings,
} from "../../../../controllers/admin/map-manager";
import { validate } from "../../../../utils";
import {
  settingsParamSchema,
  updateSettingsSchema,
} from "../../../../validations/admin/map-manager";

const router = Router();

router.get(
  "/:organizationId",
  validate(settingsParamSchema, "params"),
  getMapManagerSettings,
);

router.put("/", validate(updateSettingsSchema), updateMapManagerSettings);

export default router;


