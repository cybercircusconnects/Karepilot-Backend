"use strict";

import { Request, Response } from "express";
import { pointOfInterestService } from "../../../services/admin/points-of-interest";
import { PointOfInterestStatus } from "../../../types/admin/points-of-interest";

const serializePointOfInterest = (poi: any) => {
  const createdBy =
    poi?.createdBy && typeof poi.createdBy === "object"
      ? {
          id: poi.createdBy._id ?? poi.createdBy.id ?? null,
          firstName: poi.createdBy.firstName ?? "",
          lastName: poi.createdBy.lastName ?? "",
          email: poi.createdBy.email ?? "",
        }
      : null;

  const updatedBy =
    poi?.updatedBy && typeof poi.updatedBy === "object"
      ? {
          id: poi.updatedBy._id ?? poi.updatedBy.id ?? null,
          firstName: poi.updatedBy.firstName ?? "",
          lastName: poi.updatedBy.lastName ?? "",
          email: poi.updatedBy.email ?? "",
        }
      : null;

  return {
    id: poi._id,
    organization: poi.organization
      ? {
          id: poi.organization._id ?? poi.organization,
          name: poi.organization.name ?? "",
          organizationType: poi.organization.organizationType ?? null,
        }
      : null,
    name: poi.name,
    category: poi.category,
    categoryType: poi.categoryType ?? null,
    building: poi.building,
    floor: poi.floor,
    roomNumber: poi.roomNumber ?? null,
    description: poi.description ?? "",
    tags: Array.isArray(poi.tags) ? poi.tags : [],
    amenities: Array.isArray(poi.amenities) ? poi.amenities : [],
    contact: poi.contact ?? null,
    accessibility: poi.accessibility ?? {
      wheelchairAccessible: false,
      hearingLoop: false,
      visualAidSupport: false,
    },
    status: poi.status ?? PointOfInterestStatus.ACTIVE,
    mapCoordinates: poi.mapCoordinates ?? null,
    isActive: poi.isActive ?? true,
    createdAt: poi.createdAt,
    updatedAt: poi.updatedAt,
    createdBy,
    updatedBy,
  };
};

export const getAllPointsOfInterest = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await pointOfInterestService.getAllPointsOfInterest(req.query);

    res.status(200).json({
      success: true,
      message: "Points of interest retrieved successfully",
      data: {
        pointsOfInterest: result.pointsOfInterest.map(serializePointOfInterest),
        pagination: result.pagination,
        stats: result.stats,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message ?? "Failed to retrieve points of interest",
    });
  }
};

export const getPointOfInterestById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({
        success: false,
        message: "Point of interest ID is required",
      });
      return;
    }
    const pointOfInterest = await pointOfInterestService.getPointOfInterestById(id);

    if (!pointOfInterest) {
      res.status(404).json({
        success: false,
        message: "Point of interest not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Point of interest retrieved successfully",
      data: {
        pointOfInterest: serializePointOfInterest(pointOfInterest),
      },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message ?? "Failed to retrieve point of interest",
    });
  }
};

export const createPointOfInterest = async (req: Request, res: Response): Promise<void> => {
  try {
    const adminId = (req.user as any)?._id?.toString();
    if (!adminId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized. Admin user not found.",
      });
      return;
    }

    const pointOfInterest = await pointOfInterestService.createPointOfInterest(req.body, adminId);

    res.status(201).json({
      success: true,
      message: "Point of interest created successfully",
      data: {
        pointOfInterest: serializePointOfInterest(pointOfInterest),
      },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message ?? "Failed to create point of interest",
    });
  }
};

export const updatePointOfInterest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({
        success: false,
        message: "Point of interest ID is required",
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

    const pointOfInterest = await pointOfInterestService.updatePointOfInterest(id, req.body, adminId);

    res.status(200).json({
      success: true,
      message: "Point of interest updated successfully",
      data: {
        pointOfInterest: serializePointOfInterest(pointOfInterest),
      },
    });
  } catch (error: any) {
    const statusCode = error.message === "Point of interest not found" ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message ?? "Failed to update point of interest",
    });
  }
};

export const deactivatePointOfInterest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({
        success: false,
        message: "Point of interest ID is required",
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

    const pointOfInterest = await pointOfInterestService.deactivatePointOfInterest(id, adminId);

    res.status(200).json({
      success: true,
      message: "Point of interest marked as inactive successfully",
      data: {
        pointOfInterest: serializePointOfInterest(pointOfInterest),
      },
    });
  } catch (error: any) {
    const statusCode = error.message === "Point of interest not found" ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message ?? "Failed to deactivate point of interest",
    });
  }
};

export const deletePointOfInterestPermanently = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({
        success: false,
        message: "Point of interest ID is required",
      });
      return;
    }

    const pointOfInterest = await pointOfInterestService.deletePointOfInterestPermanently(id);

    res.status(200).json({
      success: true,
      message: "Point of interest deleted permanently",
      data: {
        pointOfInterest: serializePointOfInterest(pointOfInterest),
      },
    });
  } catch (error: any) {
    const statusCode = error.message === "Point of interest not found" ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message ?? "Failed to delete point of interest permanently",
    });
  }
};

