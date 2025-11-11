"use strict";

import PointOfInterest from "../../../models/admin/points-of-interest/pointOfInterest";
import Organization from "../../../models/admin/organization/organization";
import {
  CreatePointOfInterestData,
  PointOfInterestQuery,
  PointOfInterestStatus,
  UpdatePointOfInterestData,
} from "../../../types/admin/points-of-interest";

export class PointOfInterestService {
  private buildPointOfInterestQuery(query: PointOfInterestQuery) {
    const dbQuery: Record<string, unknown> = {};

    if (query.organizationId) {
      dbQuery.organization = query.organizationId;
    }

    if (query.category) {
      dbQuery.category = { $regex: new RegExp(query.category, "i") };
    }

    if (query.status && Array.isArray(query.status) && query.status.length > 0) {
      const statuses = query.status.filter(Boolean);
      if (statuses.length > 0) {
        dbQuery.status = { $in: statuses };
      }
    } else if (typeof query.status === "string" && query.status.trim()) {
      dbQuery.status = query.status.trim();
    }

    if (query.building) {
      dbQuery.building = { $regex: new RegExp(query.building, "i") };
    }

    if (query.floor) {
      dbQuery.floor = { $regex: new RegExp(query.floor, "i") };
    }

    if (typeof query.isActive === "boolean") {
      dbQuery.isActive = query.isActive;
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
        { "contact.phone": { $regex: searchRegex } },
        { "contact.email": { $regex: searchRegex } },
        { "contact.operatingHours": { $regex: searchRegex } },
      ];
    }

    return dbQuery;
  }

  private async getPointOfInterestWithRelations(id: string) {
    return PointOfInterest.findById(id)
      .populate("organization", "name organizationType")
      .populate("createdBy", "firstName lastName email")
      .populate("updatedBy", "firstName lastName email");
  }

  async getAllPointsOfInterest(query: PointOfInterestQuery) {
    const page = query.page && query.page > 0 ? query.page : 1;
    const limit = query.limit && query.limit > 0 ? Math.min(query.limit, 100) : 10;
    const skip = (page - 1) * limit;

    const dbQuery = this.buildPointOfInterestQuery(query);

    const [pointsOfInterest, total, statsAggregation] = await Promise.all([
      PointOfInterest.find(dbQuery)
        .populate("organization", "name organizationType")
        .populate("createdBy", "firstName lastName email")
        .populate("updatedBy", "firstName lastName email")
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit),
      PointOfInterest.countDocuments(dbQuery),
      PointOfInterest.aggregate([
        { $match: dbQuery },
        {
          $group: {
            _id: null,
            active: {
              $sum: {
                $cond: [{ $eq: ["$status", PointOfInterestStatus.ACTIVE] }, 1, 0],
              },
            },
            categories: { $addToSet: "$category" },
            accessible: {
              $sum: {
                $cond: [
                  {
                    $or: [
                      { $eq: ["$accessibility.wheelchairAccessible", true] },
                      { $eq: ["$accessibility.hearingLoop", true] },
                      { $eq: ["$accessibility.visualAidSupport", true] },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            active: 1,
            accessible: 1,
            categories: { $size: "$categories" },
          },
        },
      ]),
    ]);

    const statsData = statsAggregation[0] ?? { active: 0, categories: 0, accessible: 0 };

    return {
      pointsOfInterest,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        limit,
      },
      stats: {
        total,
        active: statsData.active ?? 0,
        categories: statsData.categories ?? 0,
        accessible: statsData.accessible ?? 0,
      },
    };
  }

  async getPointOfInterestById(id: string) {
    const pointOfInterest = await PointOfInterest.findById(id)
      .populate("organization", "name organizationType")
      .populate("createdBy", "firstName lastName email")
      .populate("updatedBy", "firstName lastName email");

    return pointOfInterest;
  }

  async createPointOfInterest(data: CreatePointOfInterestData, createdBy: string) {
    const organization = await Organization.findById(data.organizationId);
    if (!organization) {
      throw new Error("Organization not found");
    }

    const pointOfInterest = new PointOfInterest({
      organization: data.organizationId,
      name: data.name,
      category: data.category,
      categoryType: data.categoryType,
      building: data.building,
      floor: data.floor,
      roomNumber: data.roomNumber,
      description: data.description,
      tags: data.tags?.map((tag) => tag.trim()).filter(Boolean) ?? [],
      amenities: data.amenities?.map((amenity) => amenity.trim()).filter(Boolean) ?? [],
      contact: data.contact,
      accessibility: {
        wheelchairAccessible: data.accessibility?.wheelchairAccessible ?? false,
        hearingLoop: data.accessibility?.hearingLoop ?? false,
        visualAidSupport: data.accessibility?.visualAidSupport ?? false,
      },
      status: data.status ?? PointOfInterestStatus.ACTIVE,
      mapCoordinates: data.mapCoordinates,
      isActive: data.isActive ?? true,
      createdBy,
      updatedBy: createdBy,
    });

    await pointOfInterest.save();

    return this.getPointOfInterestWithRelations(pointOfInterest.id);
  }

  async updatePointOfInterest(id: string, data: UpdatePointOfInterestData, updatedBy: string) {
    const pointOfInterest = await PointOfInterest.findById(id);
    if (!pointOfInterest) {
      throw new Error("Point of interest not found");
    }

    if (data.organizationId) {
      const organization = await Organization.findById(data.organizationId);
      if (!organization) {
        throw new Error("Organization not found");
      }
      pointOfInterest.organization = organization._id as typeof pointOfInterest.organization;
    }

    if (typeof data.name === "string") {
      pointOfInterest.name = data.name;
    }
    if (typeof data.category === "string") {
      pointOfInterest.category = data.category;
    }
    if (typeof data.categoryType === "string") {
      pointOfInterest.categoryType = data.categoryType;
    }
    if (typeof data.building === "string") {
      pointOfInterest.building = data.building;
    }
    if (typeof data.floor === "string") {
      pointOfInterest.floor = data.floor;
    }
    if (typeof data.roomNumber === "string" || data.roomNumber === null) {
      pointOfInterest.roomNumber = data.roomNumber ?? undefined;
    }
    if (typeof data.description === "string" || data.description === null) {
      pointOfInterest.description = data.description ?? undefined;
    }
    if (Array.isArray(data.tags)) {
      pointOfInterest.tags = data.tags.map((tag) => tag.trim()).filter(Boolean);
    }
    if (Array.isArray(data.amenities)) {
      pointOfInterest.amenities = data.amenities.map((amenity) => amenity.trim()).filter(Boolean);
    }
    if (data.contact) {
      pointOfInterest.contact = {
        ...pointOfInterest.contact,
        ...data.contact,
      };
    }
    if (data.accessibility) {
      pointOfInterest.accessibility = {
        wheelchairAccessible:
          data.accessibility.wheelchairAccessible ?? pointOfInterest.accessibility.wheelchairAccessible,
        hearingLoop: data.accessibility.hearingLoop ?? pointOfInterest.accessibility.hearingLoop,
        visualAidSupport: data.accessibility.visualAidSupport ?? pointOfInterest.accessibility.visualAidSupport,
      };
    }
    if (data.status) {
      pointOfInterest.status = data.status;
    }
    if (data.mapCoordinates) {
      pointOfInterest.mapCoordinates = {
        ...pointOfInterest.mapCoordinates,
        ...data.mapCoordinates,
      };
    }
    if (typeof data.isActive === "boolean") {
      pointOfInterest.isActive = data.isActive;
    }
    pointOfInterest.updatedBy = updatedBy as any;

    await pointOfInterest.save();

    return this.getPointOfInterestWithRelations(id);
  }

  async deactivatePointOfInterest(id: string, updatedBy: string) {
    const pointOfInterest = await PointOfInterest.findById(id);
    if (!pointOfInterest) {
      throw new Error("Point of interest not found");
    }

    if (!pointOfInterest.isActive) {
      throw new Error("Point of interest is already inactive");
    }

    pointOfInterest.isActive = false;
    pointOfInterest.status = PointOfInterestStatus.INACTIVE;
    pointOfInterest.updatedBy = updatedBy as any;

    await pointOfInterest.save();

    return this.getPointOfInterestWithRelations(id);
  }

  async deletePointOfInterestPermanently(id: string) {
    const pointOfInterest = await this.getPointOfInterestWithRelations(id);
    if (!pointOfInterest) {
      throw new Error("Point of interest not found");
    }

    await pointOfInterest.deleteOne();

    return pointOfInterest;
  }
}

export const pointOfInterestService = new PointOfInterestService();

