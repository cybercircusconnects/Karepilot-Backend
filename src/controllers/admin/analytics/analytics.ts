"use strict";

import { Request, Response } from "express";
import { analyticsService } from "../../../services/admin/analytics";

export const getAnalyticsOverview = async (req: Request, res: Response): Promise<void> => {
  try {
    const query: any = {};
    if (req.query.organizationId) query.organizationId = req.query.organizationId as string;
    if (req.query.startDate) query.startDate = req.query.startDate as string;
    if (req.query.endDate) query.endDate = req.query.endDate as string;
    if (req.query.dateRange) query.dateRange = req.query.dateRange as string;

    const data = await analyticsService.getAnalyticsOverview(query);

    res.status(200).json({
      success: true,
      message: "Analytics overview retrieved successfully",
      data,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to retrieve analytics overview",
    });
  }
};

export const getUserEngagement = async (req: Request, res: Response): Promise<void> => {
  try {
    const query: any = {};
    if (req.query.organizationId) query.organizationId = req.query.organizationId as string;
    if (req.query.startDate) query.startDate = req.query.startDate as string;
    if (req.query.endDate) query.endDate = req.query.endDate as string;
    if (req.query.dateRange) query.dateRange = req.query.dateRange as string;

    const data = await analyticsService.getUserEngagement(query);

    res.status(200).json({
      success: true,
      message: "User engagement analytics retrieved successfully",
      data,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to retrieve user engagement analytics",
    });
  }
};

export const getPerformance = async (req: Request, res: Response): Promise<void> => {
  try {
    const query: any = {};
    if (req.query.organizationId) query.organizationId = req.query.organizationId as string;
    if (req.query.startDate) query.startDate = req.query.startDate as string;
    if (req.query.endDate) query.endDate = req.query.endDate as string;
    if (req.query.dateRange) query.dateRange = req.query.dateRange as string;

    const data = await analyticsService.getPerformance(query);

    res.status(200).json({
      success: true,
      message: "Performance analytics retrieved successfully",
      data,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to retrieve performance analytics",
    });
  }
};

export const getVenueAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const query: any = {};
    if (req.query.organizationId) query.organizationId = req.query.organizationId as string;
    if (req.params.id) query.organizationId = req.params.id as string;
    if (req.query.startDate) query.startDate = req.query.startDate as string;
    if (req.query.endDate) query.endDate = req.query.endDate as string;
    if (req.query.dateRange) query.dateRange = req.query.dateRange as string;

    const data = await analyticsService.getVenueAnalytics(query);

    res.status(200).json({
      success: true,
      message: "Venue analytics retrieved successfully",
      data,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to retrieve venue analytics",
    });
  }
};

