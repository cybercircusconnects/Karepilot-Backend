import { Request, Response } from "express";
import httpStatus from "http-status";
import { mapManagerSettingsService } from "../../../services/admin/map-manager";

export const getMapManagerSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const organizationId = req.params.organizationId || (req.query.organization as string);

    if (!organizationId) {
      res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: "Organization id is required",
      });
      return;
    }

    const settings = await mapManagerSettingsService.getSettings(organizationId);

    res.status(httpStatus.OK).json({
      success: true,
      message: "Map manager settings retrieved successfully",
      data: { settings },
    });
  } catch (error: any) {
    res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: error.message || "Failed to retrieve map manager settings",
    });
  }
};

export const updateMapManagerSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id?.toString();
    const settings = await mapManagerSettingsService.updateSettings(req.body, userId);

    res.status(httpStatus.OK).json({
      success: true,
      message: "Map manager settings updated successfully",
      data: { settings },
    });
  } catch (error: any) {
    res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: error.message || "Failed to update map manager settings",
    });
  }
};


