import { Router } from "express";
import { authenticateAdmin } from "../../../middlewares/auth";
import authRouter from "./auth";
import userManagementRouter from "./user-management";
import adminSettingsRouter from "./settings";

const adminRouter = Router();

adminRouter.use("/auth", authRouter);

adminRouter.use(authenticateAdmin);

adminRouter.use("/user-management", userManagementRouter);

adminRouter.use("/settings", adminSettingsRouter);

export default adminRouter;
