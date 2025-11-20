"use strict";

import { Request, Response } from "express";
import { mapEditorLabelService } from "../../../services/admin/map-management";
import {
  createMapEditorLabelSchema,
  updateMapEditorLabelSchema,
} from "../../../validations/admin/map-management/mapEditorLabel";

export const getLabelsByFloorPlan = async (req: Request, res: Response): Promise<void> => {
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
      isActive:
        req.query.isActive === "true"
          ? true
          : req.query.isActive === "false"
            ? false
            : undefined,
      search: req.query.search as string | undefined,
    };

    const labels = await mapEditorLabelService.getLabelsByFloorPlan(query);

    res.status(200).json({
      success: true,
      message: "Labels retrieved successfully",
      data: {
        labels,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message ?? "Failed to retrieve labels",
    });
  }
};

export const getLabelById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({
        success: false,
        message: "Label ID is required",
      });
      return;
    }

    const label = await mapEditorLabelService.getLabelById(id);

    if (!label) {
      res.status(404).json({
        success: false,
        message: "Label not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Label retrieved successfully",
      data: {
        label,
      },
    });
  } catch (error: any) {
    const statusCode = error.message === "Label not found" ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message ?? "Failed to retrieve label",
    });
  }
};

export const createLabel = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error } = createMapEditorLabelSchema.validate(req.body);
    if (error) {
      res.status(400).json({
        success: false,
        message: error.details[0]?.message ?? "Failed to create label",
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

    const label = await mapEditorLabelService.createLabel(req.body, adminId);

    res.status(201).json({
      success: true,
      message: "Label created successfully",
      data: {
        label,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message ?? "Failed to create label",
    });
  }
};

export const updateLabel = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({
        success: false,
        message: "Label ID is required",
      });
      return;
    }

    const { error } = updateMapEditorLabelSchema.validate(req.body);
    if (error) {
      res.status(400).json({
        success: false,
        message: error.details[0]?.message ?? "Failed to update label",
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

    const label = await mapEditorLabelService.updateLabel(id, req.body, adminId);

    res.status(200).json({
      success: true,
      message: "Label updated successfully",
      data: {
        label,
      },
    });
  } catch (error: any) {
    const statusCode = error.message === "Label not found" ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message ?? "Failed to update label",
    });
  }
};

export const deleteLabel = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({
        success: false,
        message: "Label ID is required",
      });
      return;
    }

    await mapEditorLabelService.deleteLabel(id);

    res.status(200).json({
      success: true,
      message: "Label deleted successfully",
    });
  } catch (error: any) {
    const statusCode = error.message === "Label not found" ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message ?? "Failed to delete label",
    });
  }
};

