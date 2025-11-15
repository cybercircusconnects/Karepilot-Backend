"use strict";

import { Request, Response } from "express";
import { mapFloorPlanService } from "../../../services/admin/map-management";
import { MapFloorPlanStatus } from "../../../types/admin/map-management";

export const getFloorPlans = async (req: Request, res: Response): Promise<void> => {
  try {
    const normalizedQuery: any = { ...req.query };

    if (normalizedQuery.building && !normalizedQuery.buildingId) {
      normalizedQuery.buildingId = normalizedQuery.building;
      delete normalizedQuery.building;
    }

    if (normalizedQuery.status) {
      const statusValue = normalizedQuery.status as string;
      if (typeof statusValue === "string" && statusValue.length > 0) {
        normalizedQuery.status =
          statusValue.charAt(0).toUpperCase() + statusValue.slice(1).toLowerCase();
      }
    }

    if (normalizedQuery.page) {
      normalizedQuery.page = parseInt(normalizedQuery.page as string, 10) || 1;
    }
    if (normalizedQuery.limit) {
      normalizedQuery.limit = parseInt(normalizedQuery.limit as string, 10) || 12;
    }

    const result = await mapFloorPlanService.getFloorPlans(normalizedQuery);

    res.status(200).json({
      success: true,
      message: "Floor plans retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message ?? "Failed to retrieve floor plans",
    });
  }
};

export const getFloorPlanById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({
        success: false,
        message: "Floor plan ID is required",
      });
      return;
    }
    const floorPlan = await mapFloorPlanService.getFloorPlanById(id);

    res.status(200).json({
      success: true,
      message: "Floor plan retrieved successfully",
      data: {
        floorPlan,
      },
    });
  } catch (error: any) {
    const statusCode = error.message === "Floor plan not found" ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message ?? "Failed to retrieve floor plan",
    });
  }
};

export const createFloorPlan = async (req: Request, res: Response): Promise<void> => {
  try {
    const adminId = (req.user as any)?._id?.toString();
    if (!adminId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized. Admin user not found.",
      });
      return;
    }

    const floorPlan = await mapFloorPlanService.createFloorPlan(req.body, adminId);

    res.status(201).json({
      success: true,
      message: "Floor plan created successfully",
      data: {
        floorPlan,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message ?? "Failed to create floor plan",
    });
  }
};

export const updateFloorPlan = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({
        success: false,
        message: "Floor plan ID is required",
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

    const floorPlan = await mapFloorPlanService.updateFloorPlan(id, req.body, adminId);

    res.status(200).json({
      success: true,
      message: "Floor plan updated successfully",
      data: {
        floorPlan,
      },
    });
  } catch (error: any) {
    const statusCode = error.message === "Floor plan not found" ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message ?? "Failed to update floor plan",
    });
  }
};

export const archiveFloorPlan = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({
        success: false,
        message: "Floor plan ID is required",
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

    const floorPlan = await mapFloorPlanService.deleteFloorPlan(id, adminId);

    res.status(200).json({
      success: true,
      message: "Floor plan archived successfully",
      data: {
        floorPlan,
      },
    });
  } catch (error: any) {
    const statusCode = error.message === "Floor plan not found" ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message ?? "Failed to archive floor plan",
    });
  }
};

export const deleteFloorPlanPermanently = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({
        success: false,
        message: "Floor plan ID is required",
      });
      return;
    }

    await mapFloorPlanService.deleteFloorPlanPermanently(id);

    res.status(200).json({
      success: true,
      message: "Floor plan deleted permanently",
    });
  } catch (error: any) {
    const statusCode = error.message === "Floor plan not found" ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message ?? "Failed to delete floor plan",
    });
  }
};

export const updateFloorPlanStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({
        success: false,
        message: "Floor plan ID is required",
      });
      return;
    }
    const { status } = req.body;

    const adminId = (req.user as any)?._id?.toString();
    if (!adminId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized. Admin user not found.",
      });
      return;
    }

    if (!Object.values(MapFloorPlanStatus).includes(status)) {
      res.status(400).json({
        success: false,
        message: "Invalid floor plan status",
      });
      return;
    }

    const floorPlan = await mapFloorPlanService.updateFloorPlan(id, { status }, adminId);

    res.status(200).json({
      success: true,
      message: "Floor plan status updated successfully",
      data: {
        floorPlan,
      },
    });
  } catch (error: any) {
    const statusCode = error.message === "Floor plan not found" ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message ?? "Failed to update floor plan status",
    });
  }
};

