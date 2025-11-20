"use strict";

import { Router } from "express";
import {
  createLabel,
  deleteLabel,
  getLabelById,
  getLabelsByFloorPlan,
  updateLabel,
} from "../../../../controllers/admin/map-management/mapEditorLabel";

const router = Router();

router.get("/", getLabelsByFloorPlan);

router.get("/:id", getLabelById);

router.post("/", createLabel);

router.put("/:id", updateLabel);

router.delete("/:id", deleteLabel);

export default router;

