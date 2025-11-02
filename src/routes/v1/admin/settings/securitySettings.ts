import { Router } from "express";
import { authenticateAdmin } from "../../../../middlewares/auth";
import { validate } from "../../../../utils";
import {
  getSecuritySettings,
  updateSecuritySettings,
  changePassword,
} from "../../../../controllers/admin/settings/securitySettings";
import {
  adminSecuritySettingsSchema,
  adminPasswordChangeSchema,
} from "../../../../validations/admin/settings/securitySettings";

const securitySettingsRouter = Router();

securitySettingsRouter.use(authenticateAdmin);

securitySettingsRouter.get("/", getSecuritySettings);

securitySettingsRouter.put(
  "/",
  validate(adminSecuritySettingsSchema),
  updateSecuritySettings
);

securitySettingsRouter.put(
  "/password",
  validate(adminPasswordChangeSchema),
  changePassword
);

export default securitySettingsRouter;

