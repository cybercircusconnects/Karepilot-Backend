"use strict";

import { Router } from "express";
import buildingsRouter from "./buildings";
import floorPlansRouter from "./floorPlans";
import settingsRouter from "./settings";

const mapManagementRouter = Router();

mapManagementRouter.use("/buildings", buildingsRouter);

mapManagementRouter.use("/floor-plans", floorPlansRouter);

mapManagementRouter.use("/settings", settingsRouter);

export default mapManagementRouter;
