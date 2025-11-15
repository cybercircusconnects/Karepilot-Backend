"use strict";

import { Request, Response } from "express";
import { mapManagementSettingsService } from "../../../services/admin/map-management";

export const getMapManagementSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const organizationId = req.query.organizationId as string;
    if (!organizationId) {
      res.status(400).json({
        success: false,
        message: "Organization ID is required",
      });
      return;
    }

    const settings = await mapManagementSettingsService.getSettings(organizationId);

    res.status(200).json({
      success: true,
      message: "Map management settings retrieved successfully",
      data: {
        settings,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message ?? "Failed to retrieve map management settings",
    });
  }
};

export const updateMapManagementSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const adminId = (req.user as any)?._id?.toString();
    if (!adminId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized. Admin user not found.",
      });
      return;
    }

    const settings = await mapManagementSettingsService.updateSettings(req.body, adminId);

    res.status(200).json({
      success: true,
      message: "Map management settings updated successfully",
      data: {
        settings,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message ?? "Failed to update map management settings",
    });
  }
};

