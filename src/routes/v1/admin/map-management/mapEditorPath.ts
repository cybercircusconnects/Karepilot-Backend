"use strict";

import { Router } from "express";
import {
  createPath,
  deletePath,
  getPathById,
  getPathsByFloorPlan,
  updatePath,
} from "../../../../controllers/admin/map-management/mapEditorPath";

const router = Router();

router.get("/", getPathsByFloorPlan);

router.get("/:id", getPathById);

router.post("/", createPath);

router.put("/:id", updatePath);

router.delete("/:id", deletePath);

export default router;

