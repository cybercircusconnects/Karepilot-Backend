"use strict";

import { Request, Response } from "express";
import { alertService } from "../../../services/admin/alerts-geofencing";
import {
  CreateAlertRequest,
  UpdateAlertRequest,
  AlertQuery,
} from "../../../types/admin/alerts-geofencing/alert";

export const createAlert = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const data: CreateAlertRequest = req.body;
    const result = await alertService.createAlert(data, userId);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to create alert",
    });
  }
};

export const getAlerts = async (req: Request, res: Response): Promise<void> => {
  try {
    const query: AlertQuery = {
      organizationId: req.query.organizationId as string,
      buildingId: req.query.buildingId as string,
      floorId: req.query.floorId as string,
      departmentId: req.query.departmentId as string,
      assetId: req.query.assetId as string,
      type: req.query.type as any,
      severity: req.query.severity as any,
      status: req.query.status as any,
      search: req.query.search as string,
      isActive: req.query.isActive === "true" ? true : req.query.isActive === "false" ? false : undefined,
      page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
    };

    const result = await alertService.getAlerts(query);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to retrieve alerts",
    });
  }
};

export const getAlertById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new Error("Alert ID is required");
    }
    const result = await alertService.getAlertById(id);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message || "Alert not found",
    });
  }
};

export const updateAlert = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new Error("Alert ID is required");
    }
    const userId = (req as any).user?.id;
    const data: UpdateAlertRequest = req.body;
    const result = await alertService.updateAlert(id, data, userId);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to update alert",
    });
  }
};

export const deleteAlert = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new Error("Alert ID is required");
    }
    const result = await alertService.deleteAlert(id);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to delete alert",
    });
  }
};

export const acknowledgeAlert = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new Error("Alert ID is required");
    }
    const userId = (req as any).user?.id;
    const result = await alertService.acknowledgeAlert(id, userId);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to acknowledge alert",
    });
  }
};

export const resolveAlert = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new Error("Alert ID is required");
    }
    const userId = (req as any).user?.id;
    const result = await alertService.resolveAlert(id, userId);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to resolve alert",
    });
  }
};

export const getAlertStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const { organizationId } = req.params;
    if (!organizationId) {
      throw new Error("Organization ID is required");
    }
    const result = await alertService.getAlertStats(organizationId);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to retrieve alert stats",
    });
  }
};

