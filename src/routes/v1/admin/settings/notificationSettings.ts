import { Router } from "express";
import { authenticateAdmin } from "../../../../middlewares/auth";
import { validate } from "../../../../utils";
import {
  getNotificationSettings,
  updateNotificationSettings,
} from "../../../../controllers/admin/settings/notificationSettings";
import { adminNotificationSettingsSchema } from "../../../../validations/admin/settings/notificationSettings";

const notificationSettingsRouter = Router();

notificationSettingsRouter.use(authenticateAdmin);

notificationSettingsRouter.get("/", getNotificationSettings);

notificationSettingsRouter.put(
  "/",
  validate(adminNotificationSettingsSchema),
  updateNotificationSettings
);

export default notificationSettingsRouter;

