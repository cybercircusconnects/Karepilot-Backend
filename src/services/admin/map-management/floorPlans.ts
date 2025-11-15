"use strict";

import { Types } from "mongoose";
import { MapBuilding, MapFloorPlan } from "../../../models/admin/map-management";
import {
  CreateMapFloorPlanPayload,
  MapFloorPlanListResponse,
  MapFloorPlanOverview,
  MapFloorPlanQuery,
  MapFloorPlanStatus,
  MapFloorPlanMetadata,
  MapFloorPlanMedia,
  UpdateMapFloorPlanPayload,
} from "../../../types/admin/map-management";
import { IMapFloorPlan } from "../../../models/admin/map-management/mapFloorPlan";

const sanitizeStringArray = (values?: string[]): string[] => {
  if (!Array.isArray(values)) {
    return [];
  }

  const unique = new Set<string>();
  values.forEach((value) => {
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (trimmed.length > 0) {
        unique.add(trimmed);
      }
    }
  });

  return Array.from(unique);
};

const buildMediaObject = (media?: MapFloorPlanMedia) => ({
  fileUrl: media?.fileUrl ?? null,
  fileKey: media?.fileKey ?? null,
});

const buildMetadataObject = (metadata?: MapFloorPlanMetadata) => ({
  scale: metadata?.scale ?? null,
  description: metadata?.description ?? null,
  tags: sanitizeStringArray(metadata?.tags),
});

const toObjectId = (value?: string | null): Types.ObjectId | null => {
  if (!value || !Types.ObjectId.isValid(value)) {
    return null;
  }
  return new Types.ObjectId(value);
};

class MapFloorPlanService {
  private buildQuery(query: MapFloorPlanQuery) {
    const dbQuery: Record<string, unknown> = {};

    const organizationId = toObjectId(query.organizationId);
    if (organizationId) {
      dbQuery.organization = organizationId;
    }

    const buildingId = toObjectId(query.buildingId);
    if (buildingId) {
      dbQuery.building = buildingId;
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

    if (query.floorLabel) {
      dbQuery.floorLabel = { $regex: new RegExp(query.floorLabel, "i") };
    }

    if (query.tags) {
      const tags = Array.isArray(query.tags) ? query.tags : [query.tags];
      const sanitized = sanitizeStringArray(tags);
      if (sanitized.length > 0) {
        dbQuery["metadata.tags"] = { $all: sanitized };
      }
    }

    if (query.search) {
      const searchRegex = new RegExp(query.search, "i");
      dbQuery.$or = [
        { title: { $regex: searchRegex } },
        { floorLabel: { $regex: searchRegex } },
        { versionNotes: { $regex: searchRegex } },
        { "metadata.description": { $regex: searchRegex } },
        { "metadata.tags": { $elemMatch: { $regex: searchRegex } } },
      ];
    }

    return dbQuery;
  }

  private serializeFloorPlan(doc: IMapFloorPlan): MapFloorPlanOverview {
    const plain = doc.toObject({ virtuals: false });

    const building =
      plain.building && typeof plain.building === "object"
        ? {
            id: plain.building._id?.toString() ?? plain.building.id?.toString() ?? "",
            name: plain.building.name ?? "",
          }
        : null;

    return {
      id: plain._id.toString(),
      title: plain.title,
      floorLabel: plain.floorLabel,
      floorNumber: typeof plain.floorNumber === "number" ? plain.floorNumber : null,
      status: plain.status,
      building,
      metadata: {
        scale: plain.metadata?.scale ?? null,
        description: plain.metadata?.description ?? null,
        tags: Array.isArray(plain.metadata?.tags) ? plain.metadata.tags : [],
      },
      media: {
        fileUrl: plain.media?.fileUrl ?? null,
        fileKey: plain.media?.fileKey ?? null,
      },
      version: plain.version ?? 1,
      versionNotes: plain.versionNotes ?? null,
      publishedAt: plain.publishedAt ?? null,
      createdAt: plain.createdAt,
      updatedAt: plain.updatedAt,
    };
  }

  private async getFloorPlanWithRelations(id: string) {
    return MapFloorPlan.findById(id)
      .populate("building", "name")
      .populate("organization", "name");
  }

  async getFloorPlans(query: MapFloorPlanQuery): Promise<MapFloorPlanListResponse> {
    const page = query.page && query.page > 0 ? query.page : 1;
    const limit = query.limit && query.limit > 0 ? Math.min(query.limit, 50) : 12;
    const skip = (page - 1) * limit;

    const dbQuery = this.buildQuery(query);

    const baseFilter: Record<string, unknown> = {};
    const organizationId = toObjectId(query.organizationId);
    if (organizationId) {
      baseFilter.organization = organizationId;
    }

    const [floorPlanDocs, total, statsAggregation, filtersAggregation, buildingFloorCounts] = await Promise.all([
      MapFloorPlan.find(dbQuery)
        .populate("building", "name")
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit),
      MapFloorPlan.countDocuments(dbQuery),
      MapFloorPlan.aggregate([
        { $match: dbQuery },
        {
          $group: {
            _id: null,
            totalMaps: { $sum: 1 },
            publishedMaps: {
              $sum: { $cond: [{ $eq: ["$status", MapFloorPlanStatus.PUBLISHED] }, 1, 0] },
            },
            draftedMaps: { $sum: { $cond: [{ $eq: ["$status", MapFloorPlanStatus.DRAFT] }, 1, 0] } },
            disabledMaps: {
              $sum: { $cond: [{ $eq: ["$status", MapFloorPlanStatus.DISABLED] }, 1, 0] },
            },
            archivedMaps: {
              $sum: { $cond: [{ $eq: ["$status", MapFloorPlanStatus.ARCHIVED] }, 1, 0] },
            },
            buildingIds: { $addToSet: "$building" },
          },
        },
        {
          $project: {
            _id: 0,
            totalMaps: 1,
            publishedMaps: 1,
            draftedMaps: 1,
            disabledMaps: 1,
            archivedMaps: 1,
            buildingIds: 1,
          },
        },
      ]),
      MapFloorPlan.aggregate([
        { $match: baseFilter },
        {
          $group: {
            _id: null,
            tags: { $addToSet: "$metadata.tags" },
            floorLabels: { $addToSet: "$floorLabel" },
            buildingIds: { $addToSet: "$building" },
          },
        },
      ]),
      MapFloorPlan.aggregate([
        { $match: baseFilter },
        {
          $group: {
            _id: "$building",
            floors: { $sum: 1 },
          },
        },
      ]),
    ]);

    const statsData = statsAggregation[0] ?? {
      totalMaps: 0,
      publishedMaps: 0,
      draftedMaps: 0,
      disabledMaps: 0,
      archivedMaps: 0,
      buildingIds: [],
    };

    const filtersData = filtersAggregation[0] ?? { tags: [], floorLabels: [], buildingIds: [] };

    const tagsSet = new Set<string>();
    (filtersData.tags as string[][]).forEach((tagGroup) => {
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

    const floorLabels = Array.isArray(filtersData.floorLabels)
      ? (filtersData.floorLabels as Array<string | null | undefined>)
          .filter((label): label is string => typeof label === "string" && label.trim().length > 0)
          .map((label: string) => label.trim())
      : [];

    const buildingIdsForFilters =
      Array.isArray(buildingFloorCounts) && buildingFloorCounts.length > 0
        ? buildingFloorCounts
            .map((item) => {
              if (!item?._id) {
                return null;
              }
              return item._id instanceof Types.ObjectId ? item._id : new Types.ObjectId(item._id);
            })
            .filter((id): id is Types.ObjectId => id !== null)
        : [];

    const buildingDocs =
      buildingIdsForFilters.length > 0
        ? await MapBuilding.find({ _id: { $in: buildingIdsForFilters } }).select("name").lean()
        : [];

    const buildingNameMap = new Map<string, string>();
    buildingDocs.forEach((building) => {
      buildingNameMap.set(building._id.toString(), building.name ?? "Unnamed Building");
    });

    const availableFilterBuildings = buildingFloorCounts.map((item) => {
      const objectId =
        item._id instanceof Types.ObjectId ? item._id : item._id ? new Types.ObjectId(item._id) : null;
      const id = objectId ? objectId.toString() : "";
      return {
        id,
        name: buildingNameMap.get(id) ?? "Unnamed Building",
        floors: item.floors ?? 0,
      };
    });

    const floorPlans = floorPlanDocs.map((doc) => this.serializeFloorPlan(doc));

    return {
      floorPlans,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit) || 1,
        total,
        limit,
      },
      stats: {
        totalMaps: statsData.totalMaps ?? 0,
        publishedMaps: statsData.publishedMaps ?? 0,
        draftedMaps: statsData.draftedMaps ?? 0,
        disabledMaps: statsData.disabledMaps ?? 0,
        archivedMaps: statsData.archivedMaps ?? 0,
        buildings: Array.isArray(statsData.buildingIds) ? statsData.buildingIds.length : 0,
      },
      availableFilters: {
        buildings: availableFilterBuildings,
        statuses: Object.values(MapFloorPlanStatus),
        tags: Array.from(tagsSet).sort(),
        floorLabels: [...floorLabels].sort((a: string, b: string) => a.localeCompare(b)),
      },
    };
  }

  async getFloorPlanById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid floor plan ID");
    }

    const floorPlan = await this.getFloorPlanWithRelations(id);
    if (!floorPlan) {
      throw new Error("Floor plan not found");
    }

    return this.serializeFloorPlan(floorPlan);
  }

  async createFloorPlan(data: CreateMapFloorPlanPayload, adminId: string) {
    const organizationId = toObjectId(data.organizationId);
    if (!organizationId) {
      throw new Error("Valid organization ID is required");
    }

    const buildingId = toObjectId(data.buildingId);
    if (!buildingId) {
      throw new Error("Valid building ID is required");
    }

    const building = await MapBuilding.findById(buildingId);
    if (!building) {
      throw new Error("Building not found");
    }

    if (building.organization.toString() !== organizationId.toString()) {
      throw new Error("Building does not belong to the specified organization");
    }

    const status = data.status ?? MapFloorPlanStatus.DRAFT;

    const floorPlan = new MapFloorPlan({
      organization: organizationId,
      building: buildingId,
      title: data.title.trim(),
      floorLabel: data.floorLabel.trim(),
      floorNumber: typeof data.floorNumber === "number" ? data.floorNumber : null,
      status,
      media: buildMediaObject(data.media),
      metadata: buildMetadataObject(data.metadata),
      version: 1,
      versionNotes: data.versionNotes ?? null,
      publishedAt: status === MapFloorPlanStatus.PUBLISHED ? new Date() : null,
      isTemplate: data.isTemplate ?? false,
      isActive: status !== MapFloorPlanStatus.DISABLED && status !== MapFloorPlanStatus.ARCHIVED,
      createdBy: toObjectId(adminId),
      updatedBy: toObjectId(adminId),
    });

    await floorPlan.save();

    const populated = await this.getFloorPlanWithRelations(floorPlan.id);
    if (!populated) {
      throw new Error("Failed to load floor plan after creation");
    }

    return this.serializeFloorPlan(populated);
  }

  async updateFloorPlan(id: string, data: UpdateMapFloorPlanPayload, adminId: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid floor plan ID");
    }

    const floorPlan = await MapFloorPlan.findById(id);
    if (!floorPlan) {
      throw new Error("Floor plan not found");
    }

    if (data.buildingId) {
      const buildingId = toObjectId(data.buildingId);
      if (!buildingId) {
        throw new Error("Invalid building ID");
      }

      const building = await MapBuilding.findById(buildingId);
      if (!building) {
        throw new Error("Building not found");
      }

      if (building.organization.toString() !== floorPlan.organization.toString()) {
        throw new Error("Building does not belong to the same organization");
      }

      floorPlan.building = buildingId;
    }

    if (typeof data.title === "string") {
      floorPlan.title = data.title.trim();
    }

    if (typeof data.floorLabel === "string") {
      floorPlan.floorLabel = data.floorLabel.trim();
    }

    if (typeof data.floorNumber === "number" || data.floorNumber === null) {
      floorPlan.floorNumber = typeof data.floorNumber === "number" ? data.floorNumber : null;
    }

    if (data.metadata) {
      const metadata = buildMetadataObject(data.metadata);
      floorPlan.metadata = {
        ...floorPlan.metadata,
        ...metadata,
      };
    }

    if (data.media) {
      const media = buildMediaObject(data.media);
      floorPlan.media = {
        ...floorPlan.media,
        ...media,
      };
    }

    if (typeof data.isTemplate === "boolean") {
      floorPlan.isTemplate = data.isTemplate;
    }

    if (typeof data.versionNotes === "string" || data.versionNotes === null) {
      floorPlan.versionNotes = data.versionNotes ?? null;
    }

    if (data.incrementVersion) {
      floorPlan.version = (floorPlan.version ?? 1) + 1;
    }

    if (data.status) {
      floorPlan.status = data.status;
      if (data.status === MapFloorPlanStatus.PUBLISHED) {
        floorPlan.isActive = true;
        floorPlan.publishedAt = floorPlan.publishedAt ?? new Date();
      } else if (data.status === MapFloorPlanStatus.DISABLED || data.status === MapFloorPlanStatus.ARCHIVED) {
        floorPlan.isActive = false;
      } else {
        floorPlan.isActive = true;
      }
    }

    const adminObjectId = toObjectId(adminId);
    if (adminObjectId) {
      floorPlan.updatedBy = adminObjectId;
    }

    await floorPlan.save();

    const populated = await this.getFloorPlanWithRelations(id);
    if (!populated) {
      throw new Error("Failed to load floor plan after update");
    }

    return this.serializeFloorPlan(populated);
  }

  async deleteFloorPlan(id: string, adminId?: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid floor plan ID");
    }

    const floorPlan = await MapFloorPlan.findById(id);
    if (!floorPlan) {
      throw new Error("Floor plan not found");
    }

    floorPlan.status = MapFloorPlanStatus.ARCHIVED;
    floorPlan.isActive = false;
    const adminObjectId = adminId ? toObjectId(adminId) : null;
    if (adminObjectId) {
      floorPlan.updatedBy = adminObjectId;
    }

    await floorPlan.save();

    const populated = await this.getFloorPlanWithRelations(id);
    if (!populated) {
      throw new Error("Failed to load floor plan after archival");
    }

    return this.serializeFloorPlan(populated);
  }

  async deleteFloorPlanPermanently(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid floor plan ID");
    }

    const floorPlan = await MapFloorPlan.findById(id);
    if (!floorPlan) {
      throw new Error("Floor plan not found");
    }

    await floorPlan.deleteOne();

    return { id };
  }
}

export const mapFloorPlanService = new MapFloorPlanService();

