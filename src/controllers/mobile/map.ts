"use strict";

import { Request, Response } from "express";
import { mobileMapService } from "../../services";

export const getBuildings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { organizationId } = req.query;
    const result = await mobileMapService.getBuildings(
      organizationId ? String(organizationId) : undefined
    );

    res.status(200).json({
      success: true,
      message: "Buildings retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to retrieve buildings",
    });
  }
};

export const getBuildingById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({
        success: false,
        message: "Building ID is required",
      });
      return;
    }
    const building = await mobileMapService.getBuildingById(id);

    res.status(200).json({
      success: true,
      message: "Building retrieved successfully",
      data: {
        building,
      },
    });
  } catch (error: any) {
    const statusCode = error.message === "Building not found" ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to retrieve building",
    });
  }
};

export const getFloorPlans = async (req: Request, res: Response): Promise<void> => {
  try {
    const { buildingId } = req.query;
    if (!buildingId || String(buildingId).trim().length === 0) {
      res.status(400).json({
        success: false,
        message: "Building ID is required",
      });
      return;
    }
    const result = await mobileMapService.getFloorPlans(String(buildingId));

    res.status(200).json({
      success: true,
      message: "Floor plans retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to retrieve floor plans",
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
    const floorPlan = await mobileMapService.getFloorPlanById(id);

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
      message: error.message || "Failed to retrieve floor plan",
    });
  }
};

export const getNavigationPaths = async (req: Request, res: Response): Promise<void> => {
  try {
    const { floorPlanId } = req.query;
    if (!floorPlanId || String(floorPlanId).trim().length === 0) {
      res.status(400).json({
        success: false,
        message: "Floor plan ID is required",
      });
      return;
    }
    const paths = await mobileMapService.getNavigationPaths(String(floorPlanId));

    res.status(200).json({
      success: true,
      message: "Navigation paths retrieved successfully",
      data: {
        paths,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to retrieve navigation paths",
    });
  }
};

