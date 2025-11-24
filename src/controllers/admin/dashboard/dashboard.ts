"use strict";

import { Request, Response } from "express";
import { dashboardService } from "../../../services/admin/dashboard";

export const getDashboardData = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        success: false,
        message: "Organization ID is required",
      });
      return;
    }

    const data = await dashboardService.getDashboardData({
      organizationId: id,
      startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
      endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
    });

    res.status(200).json({
      success: true,
      message: "Dashboard data retrieved successfully",
      data,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message ?? "Failed to retrieve dashboard data",
    });
  }
};

