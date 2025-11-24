import { Router } from "express";
import { authenticateAdmin } from "../../../middlewares/auth";
import authRouter from "./auth";
import userManagementRouter from "./user-management";
import adminSettingsRouter from "./settings";
import organizationRouter from "./organization";
import pointsOfInterestRouter from "./points-of-interest";
import mapManagementRouter from "./map-management";
import assetTrackingRouter from "./asset-tracking";
import alertsGeofencingRouter from "./alerts-geofencing";
import dashboardRouter from "./dashboard/dashboard";

const adminRouter = Router();

adminRouter.use("/auth", authRouter);

adminRouter.use(authenticateAdmin);

adminRouter.use("/user-management", userManagementRouter);

adminRouter.use("/settings", adminSettingsRouter);

adminRouter.use("/organization", organizationRouter);

adminRouter.use("/points-of-interest", pointsOfInterestRouter);

adminRouter.use("/map-management", mapManagementRouter);

adminRouter.use("/asset-tracking", assetTrackingRouter);

adminRouter.use("/alerts-geofencing", alertsGeofencingRouter);

adminRouter.use("/dashboard", dashboardRouter);

export default adminRouter;
