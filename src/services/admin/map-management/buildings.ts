"use strict";

import { Types } from "mongoose";
import { MapBuilding, MapFloorPlan } from "../../../models/admin/map-management";
import {
  CreateMapBuildingPayload,
  MapBuildingListResponse,
  MapBuildingQuery,
  MapBuildingStatus,
  MapBuildingSummary,
  MapFloorPlanStatus,
  UpdateMapBuildingPayload,
} from "../../../types/admin/map-management";
import { IMapBuilding } from "../../../models/admin/map-management/mapBuilding";

const toObjectId = (value?: string | null): Types.ObjectId | null => {
  if (!value || !Types.ObjectId.isValid(value)) {
    return null;
  }
  return new Types.ObjectId(value);
};

const sanitizeTags = (tags?: string[]) => {
  if (!Array.isArray(tags)) {
    return [];
  }
  const unique = new Set<string>();
  tags.forEach((tag) => {
    if (typeof tag === "string") {
      const trimmed = tag.trim();
      if (trimmed.length > 0) {
        unique.add(trimmed);
      }
    }
  });
  return Array.from(unique);
};

class MapBuildingService {
  private buildQuery(query: MapBuildingQuery) {
    const dbQuery: Record<string, unknown> = {};

    const organizationId = toObjectId(query.organizationId);
    if (organizationId) {
      dbQuery.organization = organizationId;
    }

    if (query.status) {
      if (Array.isArray(query.status)) {
        const statuses = query.status.filter(Boolean);
        if (statuses.length > 0) {
          dbQuery.status = { $in: statuses };
        }
      } else if (typeof query.status === "string" && query.status.trim()) {
        dbQuery.status = query.status.trim();
      }
    }

    if (typeof query.isActive === "boolean") {
      dbQuery.isActive = query.isActive;
    }

    if (query.tags) {
      const tags = Array.isArray(query.tags) ? query.tags : [query.tags];
      const sanitized = sanitizeTags(tags);
      if (sanitized.length > 0) {
        dbQuery.tags = { $all: sanitized };
      }
    }

    if (query.search) {
      const searchRegex = new RegExp(query.search, "i");
      dbQuery.$or = [
        { name: { $regex: searchRegex } },
        { code: { $regex: searchRegex } },
        { description: { $regex: searchRegex } },
        { tags: { $elemMatch: { $regex: searchRegex } } },
      ];
    }

    return dbQuery;
  }

  private async buildFloorStatsMap(buildingIds: Types.ObjectId[]) {
    if (!buildingIds.length) {
      return new Map<
        string,
        {
          total: number;
          published: number;
          drafted: number;
          disabled: number;
        }
      >();
    }

    const aggregation = await MapFloorPlan.aggregate([
      { $match: { building: { $in: buildingIds } } },
      {
        $group: {
          _id: "$building",
          total: { $sum: 1 },
          published: { $sum: { $cond: [{ $eq: ["$status", MapFloorPlanStatus.PUBLISHED] }, 1, 0] } },
          drafted: { $sum: { $cond: [{ $eq: ["$status", MapFloorPlanStatus.DRAFT] }, 1, 0] } },
          disabled: { $sum: { $cond: [{ $eq: ["$status", MapFloorPlanStatus.DISABLED] }, 1, 0] } },
        },
      },
    ]);

    const statsMap = new Map<
      string,
      {
        total: number;
        published: number;
        drafted: number;
        disabled: number;
      }
    >();

    aggregation.forEach((item) => {
      const id = item._id?.toString();
      if (!id) return;
      statsMap.set(id, {
        total: item.total ?? 0,
        published: item.published ?? 0,
        drafted: item.drafted ?? 0,
        disabled: item.disabled ?? 0,
      });
    });

    return statsMap;
  }

  private async serializeBuilding(doc: IMapBuilding): Promise<MapBuildingSummary> {
    const buildingId = doc._id as Types.ObjectId;
    const statsMap = await this.buildFloorStatsMap([buildingId]);

    const stats = statsMap.get(buildingId.toString()) ?? {
      total: 0,
      published: 0,
      drafted: 0,
      disabled: 0,
    };

    const organization =
      doc.organization && typeof doc.organization === "object"
        ? {
            id: (doc.organization as any)._id?.toString() ?? (doc.organization as any).id?.toString() ?? "",
            name: (doc.organization as any).name ?? "",
          }
        : null;

    const template =
      doc.venueTemplate && typeof doc.venueTemplate === "object"
        ? {
            id: (doc.venueTemplate as any)._id?.toString() ?? (doc.venueTemplate as any).id?.toString() ?? "",
            name: (doc.venueTemplate as any).name ?? (doc.venueTemplate as any).templateName ?? "",
          }
        : null;

    return {
      id: buildingId.toString(),
      name: doc.name,
      code: doc.code ?? null,
      description: doc.description ?? null,
      tags: Array.isArray(doc.tags) ? doc.tags : [],
      status: doc.status,
      organization,
      template,
      floors: stats.total,
      publishedFloors: stats.published,
      draftedFloors: stats.drafted,
      disabledFloors: stats.disabled,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  async getBuildings(query: MapBuildingQuery): Promise<MapBuildingListResponse> {
    const page = query.page && query.page > 0 ? query.page : 1;
    const limit = query.limit && query.limit > 0 ? Math.min(query.limit, 50) : 12;
    const skip = (page - 1) * limit;

    const dbQuery = this.buildQuery(query);

    const [buildings, total, statusAggregation, tagsAggregation, matchingBuildingIdsAggregation] = await Promise.all([
      MapBuilding.find(dbQuery)
        .populate("organization", "name")
        .populate("venueTemplate", "name templateName")
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit),
      MapBuilding.countDocuments(dbQuery),
      MapBuilding.aggregate([
        { $match: dbQuery },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            active: { $sum: { $cond: [{ $eq: ["$status", MapBuildingStatus.ACTIVE] }, 1, 0] } },
            inactive: { $sum: { $cond: [{ $eq: ["$status", MapBuildingStatus.INACTIVE] }, 1, 0] } },
          },
        },
      ]),
      MapBuilding.aggregate([
        { $match: dbQuery },
        {
          $group: {
            _id: null,
            tags: { $addToSet: "$tags" },
          },
        },
      ]),
      MapBuilding.aggregate([
        { $match: dbQuery },
        {
          $group: {
            _id: null,
            ids: { $addToSet: "$_id" },
          },
        },
      ]),
    ]);

    const statusStats = statusAggregation[0] ?? { total: 0, active: 0, inactive: 0 };

    const tagsSet = new Set<string>();
    const tagsData = tagsAggregation[0]?.tags ?? [];
    (tagsData as string[][]).forEach((tagGroup) => {
      if (Array.isArray(tagGroup)) {
        tagGroup.forEach((tag) => {
          if (typeof tag === "string") {
            const trimmed = tag.trim();
            if (trimmed.length > 0) {
              tagsSet.add(trimmed);
            }
          }
        });
      }
    });

    const matchingIds =
      Array.isArray(matchingBuildingIdsAggregation[0]?.ids)
        ? (matchingBuildingIdsAggregation[0].ids as Array<Types.ObjectId | string>).map((id) =>
            id instanceof Types.ObjectId ? id : new Types.ObjectId(id),
          )
        : [];

    const floorStatsOverallAggregation =
      matchingIds.length > 0
        ? await MapFloorPlan.aggregate([
            { $match: { building: { $in: matchingIds } } },
            {
              $group: {
                _id: null,
                totalFloors: { $sum: 1 },
                publishedFloors: {
                  $sum: { $cond: [{ $eq: ["$status", MapFloorPlanStatus.PUBLISHED] }, 1, 0] },
                },
                draftedFloors: { $sum: { $cond: [{ $eq: ["$status", MapFloorPlanStatus.DRAFT] }, 1, 0] } },
                disabledFloors: {
                  $sum: { $cond: [{ $eq: ["$status", MapFloorPlanStatus.DISABLED] }, 1, 0] },
                },
              },
            },
          ])
        : [];

    const floorStatsOverall = floorStatsOverallAggregation[0] ?? {
      totalFloors: 0,
      publishedFloors: 0,
      draftedFloors: 0,
      disabledFloors: 0,
    };

    const pageBuildingIds = buildings.map((building) => building._id as Types.ObjectId);
    const pageStatsMap = await this.buildFloorStatsMap(pageBuildingIds);

    const buildingSummaries: MapBuildingSummary[] = buildings.map((building) => {
      const buildingId = building._id as Types.ObjectId;
      const stats = pageStatsMap.get(buildingId.toString()) ?? {
        total: 0,
        published: 0,
        drafted: 0,
        disabled: 0,
      };

      const organization =
        building.organization && typeof building.organization === "object"
          ? {
              id:
                (building.organization as any)._id?.toString() ??
                (building.organization as any).id?.toString() ??
                "",
              name: (building.organization as any).name ?? "",
            }
          : null;

      const template =
        building.venueTemplate && typeof building.venueTemplate === "object"
          ? {
              id:
                (building.venueTemplate as any)._id?.toString() ??
                (building.venueTemplate as any).id?.toString() ??
                "",
              name:
                (building.venueTemplate as any).name ??
                (building.venueTemplate as any).templateName ??
                "",
            }
          : null;

      return {
        id: buildingId.toString(),
        name: building.name,
        code: building.code ?? null,
        description: building.description ?? null,
        tags: Array.isArray(building.tags) ? building.tags : [],
        status: building.status,
        organization,
        template,
        floors: stats.total,
        publishedFloors: stats.published,
        draftedFloors: stats.drafted,
        disabledFloors: stats.disabled,
        createdAt: building.createdAt,
        updatedAt: building.updatedAt,
      };
    });

    return {
      buildings: buildingSummaries,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit) || 1,
        total,
        limit,
      },
      stats: {
        totalBuildings: statusStats.total ?? 0,
        activeBuildings: statusStats.active ?? 0,
        inactiveBuildings: statusStats.inactive ?? 0,
      },
      floorStats: {
        totalFloors: floorStatsOverall.totalFloors ?? 0,
        publishedFloors: floorStatsOverall.publishedFloors ?? 0,
        draftedFloors: floorStatsOverall.draftedFloors ?? 0,
        disabledFloors: floorStatsOverall.disabledFloors ?? 0,
      },
      availableFilters: {
        statuses: Object.values(MapFloorPlanStatus),
        tags: Array.from(tagsSet).sort((a, b) => a.localeCompare(b)),
      },
    };
  }

  async getBuildingById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid building ID");
    }

    const building = await MapBuilding.findById(id)
      .populate("organization", "name")
      .populate("venueTemplate", "name templateName");

    if (!building) {
      throw new Error("Building not found");
    }

    return this.serializeBuilding(building);
  }

  async createBuilding(data: CreateMapBuildingPayload, adminId: string) {
    const organizationId = toObjectId(data.organizationId);
    if (!organizationId) {
      throw new Error("Valid organization ID is required");
    }

    const building = new MapBuilding({
      organization: organizationId,
      name: data.name.trim(),
      code: data.code?.trim() ?? null,
      description: data.description?.trim() ?? null,
      tags: sanitizeTags(data.tags),
      status: data.status ?? MapBuildingStatus.ACTIVE,
      venueTemplate: toObjectId(data.venueTemplateId),
      isActive:
        typeof data.isActive === "boolean"
          ? data.isActive
          : !(data.status === MapBuildingStatus.ARCHIVED || data.status === MapBuildingStatus.INACTIVE),
      createdBy: toObjectId(adminId),
      updatedBy: toObjectId(adminId),
    });

    await building.save();

    const created = await MapBuilding.findById(building.id)
      .populate("organization", "name")
      .populate("venueTemplate", "name templateName");

    if (!created) {
      throw new Error("Failed to load building after creation");
    }

    return this.serializeBuilding(created);
  }

  async updateBuilding(id: string, data: UpdateMapBuildingPayload, adminId: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid building ID");
    }

    const building = await MapBuilding.findById(id);
    if (!building) {
      throw new Error("Building not found");
    }

    if (typeof data.name === "string") {
      building.name = data.name.trim();
    }

    if (typeof data.code === "string" || data.code === null) {
      building.code = data.code ? data.code.trim() : null;
    }

    if (typeof data.description === "string" || data.description === null) {
      building.description = data.description ? data.description.trim() : null;
    }

    if (Array.isArray(data.tags)) {
      building.tags = sanitizeTags(data.tags);
    }

    if (data.status) {
      building.status = data.status;
      if (data.status === MapBuildingStatus.ARCHIVED) {
        building.isActive = false;
      } else if (data.status === MapBuildingStatus.INACTIVE) {
        building.isActive = false;
      } else if (data.status === MapBuildingStatus.ACTIVE) {
        building.isActive = true;
      }
    }

    if (typeof data.isActive === "boolean") {
      building.isActive = data.isActive;
    }

    if (data.venueTemplateId !== undefined) {
      building.venueTemplate = toObjectId(data.venueTemplateId) ?? null;
    }

    const adminObjectId = toObjectId(adminId);
    if (adminObjectId) {
      building.updatedBy = adminObjectId;
    }

    await building.save();

    const updated = await MapBuilding.findById(id)
      .populate("organization", "name")
      .populate("venueTemplate", "name templateName");

    if (!updated) {
      throw new Error("Failed to load building after update");
    }

    return this.serializeBuilding(updated);
  }

  async archiveBuilding(id: string, adminId: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid building ID");
    }

    const building = await MapBuilding.findById(id);
    if (!building) {
      throw new Error("Building not found");
    }

    building.status = MapBuildingStatus.ARCHIVED;
    building.isActive = false;
    const adminObjectId = toObjectId(adminId);
    if (adminObjectId) {
      building.updatedBy = adminObjectId;
    }

    await building.save();

    const updated = await MapBuilding.findById(id)
      .populate("organization", "name")
      .populate("venueTemplate", "name templateName");

    if (!updated) {
      throw new Error("Failed to load building after archival");
    }

    return this.serializeBuilding(updated);
  }

  async deleteBuildingPermanently(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid building ID");
    }

    const building = await MapBuilding.findById(id);
    if (!building) {
      throw new Error("Building not found");
    }

    const associatedFloors = await MapFloorPlan.countDocuments({ building: building._id });
    if (associatedFloors > 0) {
      throw new Error("Cannot delete building with associated floor plans");
    }

    await building.deleteOne();

    return { id };
  }
}

export const mapBuildingService = new MapBuildingService();

