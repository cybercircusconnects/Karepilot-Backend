import { FilterQuery, Types } from "mongoose";
import MapBuilding, { IMapBuilding } from "../../../models/admin/map-manager/mapBuilding";
import MapFloor from "../../../models/admin/map-manager/mapFloor";
import {
  BuildingQuery,
  CreateBuildingDTO,
  UpdateBuildingDTO,
  BuildingStats,
} from "../../../types/admin/map-manager";
import { buildPaginationMeta, getPaginationParams } from "../../../utils";

type LeanBuilding = Omit<IMapBuilding, "save"> & { _id: Types.ObjectId };

const buildFilters = (query: BuildingQuery): FilterQuery<IMapBuilding> => {
  const filters: FilterQuery<IMapBuilding> = {};

  if (query.organization) {
    filters.organization = new Types.ObjectId(query.organization);
  }

  if (query.isActive !== undefined) {
    filters.isActive = query.isActive;
  }

  if (query.search) {
    const regex = new RegExp(query.search.trim(), "i");
    filters.$or = [{ name: regex }, { code: regex }, { tags: regex }];
  }

  if (query.tag) {
    filters.tags = query.tag;
  }

  return filters;
};

export const mapManagerBuildingService = {
  async getBuildings(query: BuildingQuery) {
    const filters = buildFilters(query);
    const { page, limit, skip } = getPaginationParams({ page: query.page ?? 1, limit: query.limit ?? 10 });

    const buildings = await MapBuilding.find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean<LeanBuilding[]>();

    const total = await MapBuilding.countDocuments(filters);

    const buildingIds = buildings.map((building) => building._id);
    const floorCounts = buildingIds.length
      ? await MapFloor.aggregate([
          { $match: { building: { $in: buildingIds }, isActive: true } },
          { $group: { _id: "$building", totalFloors: { $sum: 1 } } },
        ])
      : [];

    const floorCountMap = new Map<string, number>();
    floorCounts.forEach((item) => {
      floorCountMap.set(item._id.toString(), item.totalFloors);
    });

    const data = buildings.map((building) => ({
      ...building,
      id: building._id,
      floorCount: floorCountMap.get(building._id.toString()) ?? building.floorCount,
    }));

    return {
      buildings: data,
      pagination: buildPaginationMeta(total, page, limit),
    };
  },

  async getBuildingById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid building id");
    }

    const building = await MapBuilding.findById(id).lean<LeanBuilding | null>();

    if (!building) {
      throw new Error("Building not found");
    }

    return {
      ...building,
      id: building._id,
    };
  },

  async createBuilding(payload: CreateBuildingDTO, userId?: string) {
    const document = await MapBuilding.create({
      ...payload,
      tags: payload.tags ?? [],
      createdBy: userId ? new Types.ObjectId(userId) : undefined,
      updatedBy: userId ? new Types.ObjectId(userId) : undefined,
    });

    return document.toObject();
  },

  async updateBuilding(id: string, payload: UpdateBuildingDTO, userId?: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid building id");
    }

    const update: Record<string, unknown> = {
      ...payload,
      updatedBy: userId ? new Types.ObjectId(userId) : undefined,
    };

    if (payload.address === null) {
      update.address = undefined;
    }

    if (payload.geoLocation === null) {
      update.geoLocation = undefined;
    }

    if (payload.metadata === null) {
      update.metadata = undefined;
    }

    const building = await MapBuilding.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true, runValidators: true },
    ).lean<LeanBuilding | null>();

    if (!building) {
      throw new Error("Building not found");
    }

    return {
      ...building,
      id: building._id,
    };
  },

  async deleteBuilding(id: string, userId?: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid building id");
    }

    const building = await MapBuilding.findByIdAndUpdate(
      id,
      {
        $set: {
          isActive: false,
          updatedBy: userId ? new Types.ObjectId(userId) : undefined,
        },
      },
      { new: true },
    ).lean<LeanBuilding | null>();

    if (!building) {
      throw new Error("Building not found");
    }

    return {
      ...building,
      id: building._id,
    };
  },

  async getBuildingStats(query: BuildingQuery = {}): Promise<BuildingStats> {
    const filters = buildFilters(query);

    const [total, active, inactive, totalFloors] = await Promise.all([
      MapBuilding.countDocuments(filters),
      MapBuilding.countDocuments({ ...filters, isActive: true }),
      MapBuilding.countDocuments({ ...filters, isActive: false }),
      MapFloor.countDocuments(filters.organization ? { organization: filters.organization } : {}),
    ]);

    return {
      total,
      active,
      inactive,
      totalFloors,
    };
  },
};

export type MapManagerBuildingService = typeof mapManagerBuildingService;


