"use strict";

import { Request, Response } from "express";
import { mapBuildingService } from "../../../services/admin/map-management";

export const getBuildings = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await mapBuildingService.getBuildings(req.query as any);

    res.status(200).json({
      success: true,
      message: "Buildings retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message ?? "Failed to retrieve buildings",
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
    const building = await mapBuildingService.getBuildingById(id);

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
      message: error.message ?? "Failed to retrieve building",
    });
  }
};

export const createBuilding = async (req: Request, res: Response): Promise<void> => {
  try {
    const adminId = (req.user as any)?._id?.toString();
    if (!adminId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized. Admin user not found.",
      });
      return;
    }

    const building = await mapBuildingService.createBuilding(req.body, adminId);

    res.status(201).json({
      success: true,
      message: "Building created successfully",
      data: {
        building,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message ?? "Failed to create building",
    });
  }
};

export const updateBuilding = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({
        success: false,
        message: "Building ID is required",
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

    const building = await mapBuildingService.updateBuilding(id, req.body, adminId);

    res.status(200).json({
      success: true,
      message: "Building updated successfully",
      data: {
        building,
      },
    });
  } catch (error: any) {
    const statusCode = error.message === "Building not found" ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message ?? "Failed to update building",
    });
  }
};

export const archiveBuilding = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({
        success: false,
        message: "Building ID is required",
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

    const building = await mapBuildingService.archiveBuilding(id, adminId);

    res.status(200).json({
      success: true,
      message: "Building archived successfully",
      data: {
        building,
      },
    });
  } catch (error: any) {
    const statusCode = error.message === "Building not found" ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message ?? "Failed to archive building",
    });
  }
};

export const deleteBuildingPermanently = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({
        success: false,
        message: "Building ID is required",
      });
      return;
    }
    await mapBuildingService.deleteBuildingPermanently(id);

    res.status(200).json({
      success: true,
      message: "Building deleted permanently",
    });
  } catch (error: any) {
    let statusCode = 400;
    if (error.message === "Building not found") {
      statusCode = 404;
    } else if (error.message === "Cannot delete building with associated floor plans") {
      statusCode = 409;
    }
    res.status(statusCode).json({
      success: false,
      message: error.message ?? "Failed to delete building",
    });
  }
};

