"use strict";

import { Types } from "mongoose";
import Asset, { AssetType, AssetStatus } from "../../../models/admin/asset-tracking/asset";
import {
  CreateAssetData,
  UpdateAssetData,
  AssetQuery,
  AssetStats,
  AssetListResponse,
} from "../../../types/admin/asset-tracking/asset";

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

export class AssetService {
  private buildQuery(query: AssetQuery) {
    const dbQuery: Record<string, unknown> = {};

    const organizationId = toObjectId(query.organizationId);
    if (organizationId) {
      dbQuery.organization = organizationId;
    }

    const buildingId = toObjectId(query.buildingId);
    if (buildingId) {
      dbQuery.building = buildingId;
    }

    const floorId = toObjectId(query.floorId);
    if (floorId) {
      dbQuery.floor = floorId;
    }

    const departmentId = toObjectId(query.departmentId);
    if (departmentId) {
      dbQuery.department = departmentId;
    }

    if (query.type) {
      if (Array.isArray(query.type)) {
        const types = query.type.filter(Boolean);
        if (types.length > 0) {
          dbQuery.type = { $in: types };
        }
      } else if (typeof query.type === "string") {
        dbQuery.type = query.type;
      }
    }

    if (query.status) {
      if (Array.isArray(query.status)) {
        const statuses = query.status.filter(Boolean);
        if (statuses.length > 0) {
          dbQuery.status = { $in: statuses };
        }
      } else if (typeof query.status === "string") {
        dbQuery.status = query.status;
      }
    }

    if (typeof query.isActive === "boolean") {
      dbQuery.isActive = query.isActive;
    }

    if (query.search) {
      const searchRegex = new RegExp(query.search, "i");
      dbQuery.$or = [
        { name: { $regex: searchRegex } },
        { location: { $regex: searchRegex } },
        { description: { $regex: searchRegex } },
        { tags: { $elemMatch: { $regex: searchRegex } } },
      ];
    }

    return dbQuery;
  }

  async getAssets(query: AssetQuery): Promise<AssetListResponse> {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const dbQuery = this.buildQuery(query);

    const assets = await Asset.find(dbQuery)
      .populate("organization", "name")
      .populate("building", "name code")
      .populate("floor", "title floorLabel")
      .populate("department", "name")
      .populate("createdBy", "firstName lastName email")
      .populate("updatedBy", "firstName lastName email")
      .sort({ lastSeen: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Asset.countDocuments(dbQuery);

    return {
      assets,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        limit,
      },
    };
  }

  async getAssetById(id: string) {
    const asset = await Asset.findById(id)
      .populate("organization", "name organizationType")
      .populate("building", "name code description")
      .populate("floor", "title floorLabel floorNumber")
      .populate("department", "name description")
      .populate("createdBy", "firstName lastName email")
      .populate("updatedBy", "firstName lastName email");

    if (!asset) {
      throw new Error("Asset not found");
    }

    return asset;
  }

  async createAsset(data: CreateAssetData, createdBy: string) {
    const asset = await Asset.create({
      organization: data.organization,
      name: data.name,
      type: data.type,
      status: data.status || AssetStatus.OFFLINE,
      building: data.building || null,
      floor: data.floor || null,
      location: data.location || null,
      department: data.department || null,
      batteryLevel: data.batteryLevel || null,
      lastSeen: data.lastSeen || new Date(),
      mapCoordinates: data.mapCoordinates || undefined,
      description: data.description || null,
      tags: sanitizeTags(data.tags),
      isActive: data.isActive !== undefined ? data.isActive : true,
      createdBy,
      updatedBy: createdBy,
    });

    return await Asset.findById(asset._id)
      .populate("organization", "name")
      .populate("building", "name code")
      .populate("floor", "title floorLabel")
      .populate("department", "name")
      .populate("createdBy", "firstName lastName email")
      .populate("updatedBy", "firstName lastName email");
  }

  async updateAsset(id: string, data: UpdateAssetData, updatedBy: string) {
    const asset = await Asset.findById(id);
    if (!asset) {
      throw new Error("Asset not found");
    }

    const updateData: any = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.type !== undefined) updateData.type = data.type;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.building !== undefined) updateData.building = data.building;
    if (data.floor !== undefined) updateData.floor = data.floor;
    if (data.location !== undefined) updateData.location = data.location;
    if (data.department !== undefined) updateData.department = data.department;
    if (data.batteryLevel !== undefined) updateData.batteryLevel = data.batteryLevel;
    if (data.lastSeen !== undefined) updateData.lastSeen = data.lastSeen;
    if (data.mapCoordinates !== undefined) updateData.mapCoordinates = data.mapCoordinates;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.tags !== undefined) updateData.tags = sanitizeTags(data.tags);
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    updateData.updatedBy = updatedBy;

    const updatedAsset = await Asset.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("organization", "name")
      .populate("building", "name code")
      .populate("floor", "title floorLabel")
      .populate("department", "name")
      .populate("createdBy", "firstName lastName email")
      .populate("updatedBy", "firstName lastName email");

    if (!updatedAsset) {
      throw new Error("Asset not found");
    }

    return updatedAsset;
  }

  async deleteAsset(id: string, updatedBy: string) {
    const asset = await Asset.findById(id);
    if (!asset) {
      throw new Error("Asset not found");
    }

    asset.isActive = false;
    asset.updatedBy = updatedBy as any;
    await asset.save();

    return await Asset.findById(id)
      .populate("organization", "name")
      .populate("building", "name code")
      .populate("floor", "title floorLabel")
      .populate("department", "name");
  }

  async getAssetStats(organizationId?: string): Promise<AssetStats> {
    const query: any = { isActive: true };
    if (organizationId) {
      query.organization = toObjectId(organizationId);
    }

    const [total, online, offline, lowBattery, byType] = await Promise.all([
      Asset.countDocuments(query),
      Asset.countDocuments({ ...query, status: AssetStatus.ONLINE }),
      Asset.countDocuments({ ...query, status: AssetStatus.OFFLINE }),
      Asset.countDocuments({ ...query, status: AssetStatus.LOW_BATTERY }),
      Asset.aggregate([
        { $match: query },
        {
          $group: {
            _id: "$type",
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const typeStats = {
      device: 0,
      equipment: 0,
      staff: 0,
      personnel: 0,
    };

    byType.forEach((item) => {
      if (item._id in typeStats) {
        typeStats[item._id as AssetType] = item.count;
      }
    });

    return {
      total,
      online,
      offline,
      lowBattery,
      byType: typeStats,
    };
  }

  async updateAssetLocation(
    id: string,
    locationData: {
      building?: string | null;
      floor?: string | null;
      location?: string | null;
      mapCoordinates?: {
        x?: number | null;
        y?: number | null;
        latitude?: number | null;
        longitude?: number | null;
      };
      lastSeen?: Date;
    },
    updatedBy: string
  ) {
    const asset = await Asset.findById(id);
    if (!asset) {
      throw new Error("Asset not found");
    }

    const updateData: any = {
      updatedBy,
    };

    if (locationData.building !== undefined) updateData.building = locationData.building;
    if (locationData.floor !== undefined) updateData.floor = locationData.floor;
    if (locationData.location !== undefined) updateData.location = locationData.location;
    if (locationData.mapCoordinates !== undefined) updateData.mapCoordinates = locationData.mapCoordinates;
    if (locationData.lastSeen !== undefined) {
      updateData.lastSeen = locationData.lastSeen;
    } else {
      updateData.lastSeen = new Date();
    }

    if (asset.status === AssetStatus.OFFLINE) {
      updateData.status = AssetStatus.ONLINE;
    }

    const updatedAsset = await Asset.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("organization", "name")
      .populate("building", "name code")
      .populate("floor", "title floorLabel")
      .populate("department", "name");

    if (!updatedAsset) {
      throw new Error("Asset not found");
    }

    return updatedAsset;
  }

  async updateAssetBattery(id: string, batteryLevel: number, updatedBy: string) {
    const asset = await Asset.findById(id);
    if (!asset) {
      throw new Error("Asset not found");
    }

    const updateData: any = {
      batteryLevel,
      lastSeen: new Date(),
      updatedBy,
    };

    if (batteryLevel <= 20) {
      updateData.status = AssetStatus.LOW_BATTERY;
    } else if (asset.status === AssetStatus.LOW_BATTERY && batteryLevel > 20) {
      updateData.status = AssetStatus.ONLINE;
    } else if (asset.status === AssetStatus.OFFLINE) {
      updateData.status = AssetStatus.ONLINE;
    }

    const updatedAsset = await Asset.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("organization", "name")
      .populate("building", "name code")
      .populate("floor", "title floorLabel")
      .populate("department", "name");

    if (!updatedAsset) {
      throw new Error("Asset not found");
    }

    return updatedAsset;
  }
}

export default new AssetService();

