import { Request, Response } from "express";
import httpStatus from "http-status";
import { mapManagerBuildingService } from "../../../services/admin/map-manager";

export const getBuildings = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await mapManagerBuildingService.getBuildings({
      page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
      organization: req.query.organization as string,
      search: req.query.search as string,
      isActive:
        typeof req.query.isActive === "string" ? req.query.isActive === "true" : undefined,
      tag: req.query.tag as string,
    });

    res.status(httpStatus.OK).json({
      success: true,
      message: "Buildings retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Failed to retrieve buildings",
    });
  }
};

export const getBuildingById = async (req: Request, res: Response): Promise<void> => {
  try {
    const buildingId = req.params.id;
    if (!buildingId) {
      res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: "Building ID is required",
      });
      return;
    }

    const building = await mapManagerBuildingService.getBuildingById(buildingId);

    res.status(httpStatus.OK).json({
      success: true,
      message: "Building retrieved successfully",
      data: { building },
    });
  } catch (error: any) {
    res.status(httpStatus.NOT_FOUND).json({
      success: false,
      message: error.message || "Building not found",
    });
  }
};

export const createBuilding = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id?.toString();
    const building = await mapManagerBuildingService.createBuilding(req.body, userId);

    res.status(httpStatus.CREATED).json({
      success: true,
      message: "Building created successfully",
      data: { building },
    });
  } catch (error: any) {
    res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: error.message || "Failed to create building",
    });
  }
};

export const updateBuilding = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id?.toString();
    const buildingId = req.params.id;
    if (!buildingId) {
      res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: "Building ID is required",
      });
      return;
    }
    const building = await mapManagerBuildingService.updateBuilding(buildingId, req.body, userId);

    res.status(httpStatus.OK).json({
      success: true,
      message: "Building updated successfully",
      data: { building },
    });
  } catch (error: any) {
    res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: error.message || "Failed to update building",
    });
  }
};

export const deleteBuilding = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id?.toString();
    const buildingId = req.params.id;
    if (!buildingId) {
      res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: "Building ID is required",
      });
      return;
    }
    await mapManagerBuildingService.deleteBuilding(buildingId, userId);

    res.status(httpStatus.OK).json({
      success: true,
      message: "Building deactivated successfully",
    });
  } catch (error: any) {
    res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: error.message || "Failed to deactivate building",
    });
  }
};

export const getBuildingStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const stats = await mapManagerBuildingService.getBuildingStats({
      organization: req.query.organization as string,
      isActive:
        typeof req.query.isActive === "string" ? req.query.isActive === "true" : undefined,
      tag: req.query.tag as string,
    });

    res.status(httpStatus.OK).json({
      success: true,
      message: "Building stats retrieved successfully",
      data: stats,
    });
  } catch (error: any) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Failed to retrieve building stats",
    });
  }
};


