"use strict";

import { Request, Response } from "express";
import { mapEditorPathService } from "../../../services/admin/map-management";
import {
  createMapEditorPathSchema,
  updateMapEditorPathSchema,
} from "../../../validations/admin/map-management/mapEditorPath";

export const getPathsByFloorPlan = async (req: Request, res: Response): Promise<void> => {
  try {
    const { floorPlanId } = req.query;

    if (!floorPlanId || typeof floorPlanId !== "string") {
      res.status(400).json({
        success: false,
        message: "Floor plan ID is required",
      });
      return;
    }

    const query = {
      floorPlanId,
      isActive: req.query.isActive === "true" ? true : req.query.isActive === "false" ? false : undefined,
      search: req.query.search as string | undefined,
    };

    const paths = await mapEditorPathService.getPathsByFloorPlan(query);

    res.status(200).json({
      success: true,
      message: "Paths retrieved successfully",
      data: {
        paths,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message ?? "Failed to retrieve paths",
    });
  }
};

export const getPathById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({
        success: false,
        message: "Path ID is required",
      });
      return;
    }

    const path = await mapEditorPathService.getPathById(id);

    if (!path) {
      res.status(404).json({
        success: false,
        message: "Path not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Path retrieved successfully",
      data: {
        path,
      },
    });
  } catch (error: any) {
    const statusCode = error.message === "Path not found" ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message ?? "Failed to retrieve path",
    });
  }
};

export const createPath = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error } = createMapEditorPathSchema.validate(req.body);
    if (error) {
      res.status(400).json({
        success: false,
        message: error.details[0]?.message ?? "Failed to create path",
      });
      return;
    }

    const adminId = (req.user as any)?._id?.toString();
    if (!adminId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized. Admin user not found.",
      });
      return;
    }

    const path = await mapEditorPathService.createPath(req.body, adminId);

    res.status(201).json({
      success: true,
      message: "Path created successfully",
      data: {
        path,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message ?? "Failed to create path",
    });
  }
};

export const updatePath = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({
        success: false,
        message: "Path ID is required",
      });
      return;
    }

    const { error } = updateMapEditorPathSchema.validate(req.body);
    if (error) {
      res.status(400).json({
        success: false,
        message: error.details[0]?.message ?? "Failed to update path",
      });
      return;
    }

    const adminId = (req.user as any)?._id?.toString();
    if (!adminId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized. Admin user not found.",
      });
      return;
    }

    const path = await mapEditorPathService.updatePath(id, req.body, adminId);

    res.status(200).json({
      success: true,
      message: "Path updated successfully",
      data: {
        path,
      },
    });
  } catch (error: any) {
    const statusCode = error.message === "Path not found" ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message ?? "Failed to update path",
    });
  }
};

export const deletePath = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({
        success: false,
        message: "Path ID is required",
      });
      return;
    }

    await mapEditorPathService.deletePath(id);

    res.status(200).json({
      success: true,
      message: "Path deleted successfully",
    });
  } catch (error: any) {
    const statusCode = error.message === "Path not found" ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message ?? "Failed to delete path",
    });
  }
};

