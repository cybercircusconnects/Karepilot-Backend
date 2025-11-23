"use strict";

import { Request, Response } from "express";
import { assetService } from "../../../services/admin/asset-tracking";

export const getAssets = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await assetService.getAssets(req.query as any);

    res.status(200).json({
      success: true,
      message: "Assets retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message ?? "Failed to retrieve assets",
    });
  }
};

export const getAssetById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({
        success: false,
        message: "Asset ID is required",
      });
      return;
    }
    const asset = await assetService.getAssetById(id);

    res.status(200).json({
      success: true,
      message: "Asset retrieved successfully",
      data: {
        asset,
      },
    });
  } catch (error: any) {
    const statusCode = error.message === "Asset not found" ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message ?? "Failed to retrieve asset",
    });
  }
};

export const createAsset = async (req: Request, res: Response): Promise<void> => {
  try {
    const adminId = (req.user as any)?._id?.toString();
    if (!adminId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized. Admin user not found.",
      });
      return;
    }

    const asset = await assetService.createAsset(req.body, adminId);

    res.status(201).json({
      success: true,
      message: "Asset created successfully",
      data: {
        asset,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message ?? "Failed to create asset",
    });
  }
};

export const updateAsset = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({
        success: false,
        message: "Asset ID is required",
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

    const asset = await assetService.updateAsset(id, req.body, adminId);

    res.status(200).json({
      success: true,
      message: "Asset updated successfully",
      data: {
        asset,
      },
    });
  } catch (error: any) {
    const statusCode = error.message === "Asset not found" ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message ?? "Failed to update asset",
    });
  }
};

export const deleteAsset = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({
        success: false,
        message: "Asset ID is required",
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

    const asset = await assetService.deleteAsset(id, adminId);

    res.status(200).json({
      success: true,
      message: "Asset deleted successfully",
      data: {
        asset,
      },
    });
  } catch (error: any) {
    const statusCode = error.message === "Asset not found" ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message ?? "Failed to delete asset",
    });
  }
};

export const getAssetStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const { organizationId } = req.query;
    const stats = await assetService.getAssetStats(organizationId as string);

    res.status(200).json({
      success: true,
      message: "Asset statistics retrieved successfully",
      data: {
        stats,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message ?? "Failed to retrieve asset statistics",
    });
  }
};

export const updateAssetLocation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({
        success: false,
        message: "Asset ID is required",
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

    const asset = await assetService.updateAssetLocation(id, req.body, adminId);

    res.status(200).json({
      success: true,
      message: "Asset location updated successfully",
      data: {
        asset,
      },
    });
  } catch (error: any) {
    const statusCode = error.message === "Asset not found" ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message ?? "Failed to update asset location",
    });
  }
};

export const updateAssetBattery = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({
        success: false,
        message: "Asset ID is required",
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

    const { batteryLevel } = req.body;
    if (batteryLevel === undefined || batteryLevel === null) {
      res.status(400).json({
        success: false,
        message: "Battery level is required",
      });
      return;
    }

    const asset = await assetService.updateAssetBattery(id, batteryLevel, adminId);

    res.status(200).json({
      success: true,
      message: "Asset battery updated successfully",
      data: {
        asset,
      },
    });
  } catch (error: any) {
    const statusCode = error.message === "Asset not found" ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message ?? "Failed to update asset battery",
    });
  }
};

