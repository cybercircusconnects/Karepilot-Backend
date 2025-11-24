"use strict";

import { Request, Response } from "express";
import { geofenceService } from "../../../services/admin/alerts-geofencing";
import {
  CreateGeofenceRequest,
  UpdateGeofenceRequest,
  GeofenceQuery,
  ToggleGeofenceRequest,
} from "../../../types/admin/alerts-geofencing/geofence";

export const createGeofence = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const data: CreateGeofenceRequest = req.body;
    const result = await geofenceService.createGeofence(data, userId);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to create geofence",
    });
  }
};

export const getGeofences = async (req: Request, res: Response): Promise<void> => {
  try {
    const query: GeofenceQuery = {
      organizationId: req.query.organizationId as string,
      buildingId: req.query.buildingId as string,
      floorId: req.query.floorId as string,
      type: req.query.type as any,
      search: req.query.search as string,
      isActive:
        req.query.isActive === "true" ? true : req.query.isActive === "false" ? false : undefined,
      page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
    };

    const result = await geofenceService.getGeofences(query);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to retrieve geofences",
    });
  }
};

export const getGeofenceById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new Error("Geofence ID is required");
    }
    const result = await geofenceService.getGeofenceById(id);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message || "Geofence not found",
    });
  }
};

export const updateGeofence = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new Error("Geofence ID is required");
    }
    const userId = (req as any).user?.id;
    const data: UpdateGeofenceRequest = req.body;
    const result = await geofenceService.updateGeofence(id, data, userId);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to update geofence",
    });
  }
};

export const deleteGeofence = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new Error("Geofence ID is required");
    }
    const result = await geofenceService.deleteGeofence(id);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to delete geofence",
    });
  }
};

export const toggleGeofence = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new Error("Geofence ID is required");
    }
    const { isActive }: ToggleGeofenceRequest = req.body;
    const result = await geofenceService.toggleGeofence(id, isActive);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to toggle geofence",
    });
  }
};

export const getGeofenceStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const { organizationId } = req.params;
    if (!organizationId) {
      throw new Error("Organization ID is required");
    }
    const result = await geofenceService.getGeofenceStats(organizationId);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to retrieve geofence stats",
    });
  }
};
