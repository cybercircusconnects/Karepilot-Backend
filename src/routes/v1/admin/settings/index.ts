import { Router } from "express";
import generalSettingsRouter from "./generalSettings";
import notificationSettingsRouter from "./notificationSettings";
import securitySettingsRouter from "./securitySettings";

const settingsRouter = Router();

settingsRouter.use("/general", generalSettingsRouter);
settingsRouter.use("/notifications", notificationSettingsRouter);
settingsRouter.use("/security", securitySettingsRouter);

export default settingsRouter;

