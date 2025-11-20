import { Request, Response } from "express";
import {
  getAnnotationsByFloorPlan as getAnnotationsByFloorPlanService,
  getAnnotationById as getAnnotationByIdService,
  createAnnotation as createAnnotationService,
  updateAnnotation as updateAnnotationService,
  deleteAnnotation as deleteAnnotationService,
} from "../../../services/admin/map-management/mapEditorAnnotation";
import { MapEditorAnnotationQuery } from "../../../types/admin/map-management/mapEditorAnnotation";

export const getAnnotationsByFloorPlan = async (req: Request, res: Response): Promise<void> => {
  try {
    const query: MapEditorAnnotationQuery = {
      floorPlanId: req.query.floorPlanId as string,
      isActive: req.query.isActive === "true",
    };

    const annotations = await getAnnotationsByFloorPlanService(query);

    res.status(200).json({
      success: true,
      message: "Annotations retrieved successfully",
      data: annotations,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve annotations",
    });
  }
};

export const getAnnotationById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;

    if (!id) {
      res.status(400).json({
        success: false,
        message: "Annotation ID is required",
      });
      return;
    }

    const annotation = await getAnnotationByIdService(id);

    if (!annotation) {
      res.status(404).json({
        success: false,
        message: "Annotation not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Annotation retrieved successfully",
      data: annotation,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve annotation",
    });
  }
};

export const createAnnotation = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;

    const annotation = await createAnnotationService(req.body, userId);

    res.status(201).json({
      success: true,
      message: "Annotation created successfully",
      data: annotation,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create annotation",
    });
  }
};

export const updateAnnotation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id;
    if (!userId || !id) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const annotation = await updateAnnotationService(id, req.body, userId);

    if (!annotation) {
      res.status(404).json({
        success: false,
        message: "Annotation not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Annotation updated successfully",
      data: annotation,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update annotation",
    });
  }
};

export const deleteAnnotation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id;
    if (!userId || !id) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const annotation = await deleteAnnotationService(id, userId);

    if (!annotation) {
      res.status(404).json({
        success: false,
        message: "Annotation not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Annotation deleted successfully",
      data: annotation,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete annotation",
    });
  }
};
