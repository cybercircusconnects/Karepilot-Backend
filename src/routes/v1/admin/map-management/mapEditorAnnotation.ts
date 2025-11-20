import { Router } from "express";
import {
  getAnnotationsByFloorPlan,
  getAnnotationById,
  createAnnotation,
  updateAnnotation,
  deleteAnnotation,
} from "../../../../controllers/admin/map-management/mapEditorAnnotation";

const router = Router();

router.get("/", getAnnotationsByFloorPlan);

router.get("/:id", getAnnotationById);

router.post("/", createAnnotation);

router.put("/:id", updateAnnotation);

router.delete("/:id", deleteAnnotation);

export default router;

