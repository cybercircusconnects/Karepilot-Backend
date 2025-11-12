import { Router } from "express";
import buildingsRouter from "./buildings";
import floorsRouter from "./floors";
import settingsRouter from "./settings";

const router = Router();

router.use("/buildings", buildingsRouter);
router.use("/floors", floorsRouter);
router.use("/settings", settingsRouter);

export default router;


