import { Request, Response } from "express";
import httpStatus from "http-status";
import { mapManagerFloorService } from "../../../services/admin/map-manager";

const parseBooleanQuery = (value: any): boolean | undefined => {
  if (typeof value === "string") {
    if (value.toLowerCase() === "true") return true;
    if (value.toLowerCase() === "false") return false;
  }
  return undefined;
};

export const getFloors = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await mapManagerFloorService.getFloors({
      page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
      organization: req.query.organization as string,
      building: req.query.building as string,
      search: req.query.search as string,
      isActive: parseBooleanQuery(req.query.isActive),
    });

    res.status(httpStatus.OK).json({
      success: true,
      message: "Floors retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: error.message || "Failed to retrieve floors",
    });
  }
};

export const getFloorById = async (req: Request, res: Response): Promise<void> => {
  try {
    const floorId = req.params.id;
    if (!floorId) {
      res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: "Floor ID is required",
      });
      return;
    }
    const floor = await mapManagerFloorService.getFloorById(floorId);

    res.status(httpStatus.OK).json({
      success: true,
      message: "Floor retrieved successfully",
      data: { floor },
    });
  } catch (error: any) {
    res.status(httpStatus.NOT_FOUND).json({
      success: false,
      message: error.message || "Floor not found",
    });
  }
};

export const createFloor = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id?.toString();
    const floor = await mapManagerFloorService.createFloor(req.body, userId);

    res.status(httpStatus.CREATED).json({
      success: true,
      message: "Floor created successfully",
      data: { floor },
    });
  } catch (error: any) {
    res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: error.message || "Failed to create floor",
    });
  }
};

export const updateFloor = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id?.toString();
    const floorId = req.params.id;
    if (!floorId) {
      res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: "Floor ID is required",
      });
      return;
    }
    const floor = await mapManagerFloorService.updateFloor(floorId, req.body, userId);

    res.status(httpStatus.OK).json({
      success: true,
      message: "Floor updated successfully",
      data: { floor },
    });
  } catch (error: any) {
    res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: error.message || "Failed to update floor",
    });
  }
};

export const deleteFloor = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id?.toString();
    const floorId = req.params.id;
    if (!floorId) {
      res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: "Floor ID is required",
      });
      return;
    }
    await mapManagerFloorService.deleteFloor(floorId, userId);

    res.status(httpStatus.OK).json({
      success: true,
      message: "Floor deactivated successfully",
    });
  } catch (error: any) {
    res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: error.message || "Failed to deactivate floor",
    });
  }
};


