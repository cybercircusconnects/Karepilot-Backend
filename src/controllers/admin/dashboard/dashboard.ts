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

    const query: { organizationId: string; startDate?: Date; endDate?: Date } = {
      organizationId: id,
    };

    if (req.query.startDate) {
      query.startDate = new Date(req.query.startDate as string);
    }

    if (req.query.endDate) {
      query.endDate = new Date(req.query.endDate as string);
    }

    const data = await dashboardService.getDashboardData(query);

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

