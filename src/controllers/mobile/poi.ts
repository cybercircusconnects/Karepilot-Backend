"use strict";

import { Request, Response } from "express";
import { mobilePOIService } from "../../services";

export const getPointsOfInterest = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      organizationId,
      buildingId,
      floorId,
      category,
      search,
      page,
      limit,
    } = req.query;

    const queryParams: any = {};

    if (organizationId) {
      queryParams.organizationId = String(organizationId).trim();
    }
    if (buildingId) {
      queryParams.buildingId = String(buildingId).trim();
    }
    if (floorId) {
      queryParams.floorId = String(floorId).trim();
    }
    if (category) {
      queryParams.category = String(category).trim();
    }
    if (search) {
      queryParams.search = String(search).trim();
    }
    if (page) {
      const pageNum = parseInt(String(page), 10);
      if (!isNaN(pageNum) && pageNum > 0) {
        queryParams.page = pageNum;
      }
    }
    if (limit) {
      const limitNum = parseInt(String(limit), 10);
      if (!isNaN(limitNum) && limitNum > 0) {
        queryParams.limit = limitNum;
      }
    }

    const result = await mobilePOIService.getPointsOfInterest(queryParams);

    res.status(200).json({
      success: true,
      message: "Points of interest retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to retrieve points of interest",
    });
  }
};

export const getPointOfInterestById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({
        success: false,
        message: "Point of interest ID is required",
      });
      return;
    }
    const poi = await mobilePOIService.getPointOfInterestById(id);

    res.status(200).json({
      success: true,
      message: "Point of interest retrieved successfully",
      data: {
        poi,
      },
    });
  } catch (error: any) {
    const statusCode = error.message === "Point of interest not found" ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to retrieve point of interest",
    });
  }
};

export const searchPointsOfInterest = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      search,
      organizationId,
      buildingId,
      floorId,
      category,
      limit,
    } = req.query;

    const searchQuery = search ? String(search).trim() : "";
    if (!searchQuery || searchQuery.length === 0) {
      res.status(400).json({
        success: false,
        message: "Search query is required",
      });
      return;
    }

    const queryParams: any = {
      search: searchQuery,
    };

    if (organizationId) {
      queryParams.organizationId = String(organizationId).trim();
    }
    if (buildingId) {
      queryParams.buildingId = String(buildingId).trim();
    }
    if (floorId) {
      queryParams.floorId = String(floorId).trim();
    }
    if (category) {
      queryParams.category = String(category).trim();
    }
    if (limit) {
      const limitNum = parseInt(String(limit), 10);
      if (!isNaN(limitNum) && limitNum > 0) {
        queryParams.limit = limitNum;
      }
    }

    const result = await mobilePOIService.searchPointsOfInterest(queryParams);

    res.status(200).json({
      success: true,
      message: "Search completed successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to search points of interest",
    });
  }
};

