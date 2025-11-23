import { Router } from "express";
import assetRouter from "./asset";

const router = Router();

router.use("/assets", assetRouter);

export default router;

