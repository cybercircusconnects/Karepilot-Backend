"use strict";

import { Types } from "mongoose";
import PointOfInterest from "../../models/admin/points-of-interest/pointOfInterest";
import { PointOfInterestStatus } from "../../types/admin/points-of-interest";

interface POIQuery {
  organizationId?: string | undefined;
  buildingId?: string | undefined;
  floorId?: string | undefined;
  category?: string | undefined;
  search?: string | undefined;
  page?: number;
  limit?: number;
}

interface POISearchQuery {
  search: string;
  organizationId?: string | undefined;
  buildingId?: string | undefined;
  floorId?: string | undefined;
  category?: string | undefined;
  limit?: number;
}

export class MobilePOIService {
  private buildQuery(query: POIQuery) {
    const dbQuery: Record<string, unknown> = {
      isActive: true,
      status: PointOfInterestStatus.ACTIVE,
    };

    if (query.organizationId && Types.ObjectId.isValid(query.organizationId)) {
      dbQuery.organization = new Types.ObjectId(query.organizationId);
    }

    if (query.buildingId) {
      dbQuery.building = { $regex: new RegExp(query.buildingId, "i") };
    }

    if (query.floorId) {
      dbQuery.floor = { $regex: new RegExp(query.floorId, "i") };
    }

    if (query.category) {
      dbQuery.category = { $regex: new RegExp(query.category, "i") };
    }

    if (query.search) {
      const searchRegex = new RegExp(query.search, "i");
      dbQuery.$or = [
        { name: { $regex: searchRegex } },
        { category: { $regex: searchRegex } },
        { categoryType: { $regex: searchRegex } },
        { building: { $regex: searchRegex } },
        { floor: { $regex: searchRegex } },
        { roomNumber: { $regex: searchRegex } },
        { description: { $regex: searchRegex } },
        { tags: { $elemMatch: { $regex: searchRegex } } },
        { amenities: { $elemMatch: { $regex: searchRegex } } },
      ];
    }

    return dbQuery;
  }

  async getPointsOfInterest(query: POIQuery) {
    const page = query.page && query.page > 0 ? query.page : 1;
    const limit = query.limit && query.limit > 0 ? Math.min(query.limit, 100) : 50;
    const skip = (page - 1) * limit;

    const dbQuery = this.buildQuery(query);

    const [pois, total] = await Promise.all([
      PointOfInterest.find(dbQuery)
        .populate("organization", "name organizationType")
        .select("-createdBy -updatedBy")
        .sort({ name: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      PointOfInterest.countDocuments(dbQuery),
    ]);

    return {
      pois: pois.map((poi: any) => this.serializePOI(poi)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getPointOfInterestById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid point of interest ID");
    }

    const poi = await PointOfInterest.findOne({
      _id: new Types.ObjectId(id),
      isActive: true,
      status: PointOfInterestStatus.ACTIVE,
    })
      .populate("organization", "name organizationType")
      .select("-createdBy -updatedBy")
      .lean();

    if (!poi) {
      throw new Error("Point of interest not found");
    }

    return this.serializePOI(poi);
  }

  async searchPointsOfInterest(query: POISearchQuery) {
    const limit = query.limit && query.limit > 0 ? Math.min(query.limit, 50) : 20;

    const dbQuery = this.buildQuery({
      ...query,
      page: 1,
      limit,
    });

    const pois = await PointOfInterest.find(dbQuery)
      .populate("organization", "name organizationType")
      .select("-createdBy -updatedBy")
      .sort({ name: 1 })
      .limit(limit)
      .lean();

    return {
      pois: pois.map((poi: any) => this.serializePOI(poi)),
      count: pois.length,
    };
  }

  private serializePOI(poi: any) {
    return {
      id: poi._id,
      organization: poi.organization
        ? {
            id: poi.organization._id || poi.organization,
            name: poi.organization.name || "",
            organizationType: poi.organization.organizationType || null,
          }
        : null,
      name: poi.name,
      category: poi.category,
      categoryType: poi.categoryType || null,
      building: poi.building || null,
      floor: poi.floor || null,
      roomNumber: poi.roomNumber || null,
      description: poi.description || "",
      tags: Array.isArray(poi.tags) ? poi.tags : [],
      amenities: Array.isArray(poi.amenities) ? poi.amenities : [],
      contact: poi.contact || null,
      accessibility: poi.accessibility || {
        wheelchairAccessible: false,
        hearingLoop: false,
        visualAidSupport: false,
      },
      status: poi.status || PointOfInterestStatus.ACTIVE,
      mapCoordinates: poi.mapCoordinates || null,
      isActive: poi.isActive ?? true,
      createdAt: poi.createdAt,
      updatedAt: poi.updatedAt,
    };
  }
}

export default new MobilePOIService();

