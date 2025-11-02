import { Router } from "express";
import { authenticateAdmin } from "../../../../middlewares/auth";
import { validate } from "../../../../utils";
import {
  getGeneralSettings,
  updateProfileSettings,
  updateUserPreferences,
} from "../../../../controllers/admin/settings/generalSettings";
import {
  adminProfileUpdateSchema,
  adminPreferencesUpdateSchema,
} from "../../../../validations/admin/settings/generalSettings";

const generalSettingsRouter = Router();

generalSettingsRouter.use(authenticateAdmin);

generalSettingsRouter.get("/", getGeneralSettings);

generalSettingsRouter.put(
  "/profile",
  validate(adminProfileUpdateSchema),
  updateProfileSettings
);

generalSettingsRouter.put(
  "/preferences",
  validate(adminPreferencesUpdateSchema),
  updateUserPreferences
);

export default generalSettingsRouter;

