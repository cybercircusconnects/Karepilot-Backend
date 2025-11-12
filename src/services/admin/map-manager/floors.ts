import { FilterQuery, Types } from "mongoose";
import MapFloor, { IMapFloor } from "../../../models/admin/map-manager/mapFloor";
import MapBuilding from "../../../models/admin/map-manager/mapBuilding";
import { buildPaginationMeta, getPaginationParams } from "../../../utils";
import { CreateFloorDTO, FloorQuery, UpdateFloorDTO } from "../../../types/admin/map-manager";

type LeanFloor = Omit<IMapFloor, "save"> & { _id: Types.ObjectId };

const buildFilters = (query: FloorQuery): FilterQuery<IMapFloor> => {
  const filters: FilterQuery<IMapFloor> = {};

  if (query.organization) {
    filters.organization = new Types.ObjectId(query.organization);
  }

  if (query.building) {
    filters.building = new Types.ObjectId(query.building);
  }

  if (query.isActive !== undefined) {
    filters.isActive = query.isActive;
  }

  if (query.search) {
    const regex = new RegExp(query.search.trim(), "i");
    filters.$or = [{ name: regex }, { code: regex }, { tags: regex }];
  }

  return filters;
};

const ensureBuildingExists = async (buildingId: string | Types.ObjectId) => {
  const exists = await MapBuilding.exists({ _id: buildingId });
  if (!exists) {
    throw new Error("Building not found");
  }
};

export const mapManagerFloorService = {
  async getFloors(query: FloorQuery) {
    const filters = buildFilters(query);
    const { page, limit, skip } = getPaginationParams({ page: query.page ?? 1, limit: query.limit ?? 10 });

    if (filters.building) {
      await ensureBuildingExists(filters.building);
    }

    const floors = await MapFloor.find(filters)
      .sort({ sequence: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("building", "name code")
      .lean<LeanFloor[]>();

    const total = await MapFloor.countDocuments(filters);

    const data = floors.map((floor) => ({
      ...floor,
      id: floor._id,
    }));

    return {
      floors: data,
      pagination: buildPaginationMeta(total, page, limit),
    };
  },

  async getFloorById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid floor id");
    }

    const floor = await MapFloor.findById(id).populate("building", "name code").lean<LeanFloor | null>();

    if (!floor) {
      throw new Error("Floor not found");
    }

    return {
      ...floor,
      id: floor._id,
    };
  },

  async createFloor(payload: CreateFloorDTO, userId?: string) {
    await ensureBuildingExists(payload.building);

    const floor = await MapFloor.create({
      ...payload,
      tags: payload.tags ?? [],
      createdBy: userId ? new Types.ObjectId(userId) : undefined,
      updatedBy: userId ? new Types.ObjectId(userId) : undefined,
    });

    if (payload.isDefault) {
      await MapFloor.updateMany(
        { building: new Types.ObjectId(payload.building), _id: { $ne: floor._id } },
        { $set: { isDefault: false } },
      );
    }

    await MapBuilding.findByIdAndUpdate(payload.building, {
      $inc: { floorCount: 1 },
      ...(payload.isDefault ? { $set: { defaultFloor: floor._id } } : {}),
    });

    return floor.toObject();
  },

  async updateFloor(id: string, payload: UpdateFloorDTO, userId?: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid floor id");
    }

    const floor = await MapFloor.findById(id);

    if (!floor) {
      throw new Error("Floor not found");
    }

    const update: Record<string, unknown> = {
      ...payload,
      updatedBy: userId ? new Types.ObjectId(userId) : undefined,
    };

    if (payload.attributes === null) {
      update.attributes = undefined;
    }

    const updatedFloor = await MapFloor.findByIdAndUpdate(id, { $set: update }, { new: true, runValidators: true });

    if (!updatedFloor) {
      throw new Error("Floor not found");
    }

    if (payload.isDefault !== undefined) {
      if (payload.isDefault) {
        await MapFloor.updateMany(
          { building: updatedFloor.building, _id: { $ne: updatedFloor._id } },
          { $set: { isDefault: false } },
        );
        await MapBuilding.findByIdAndUpdate(updatedFloor.building, { $set: { defaultFloor: updatedFloor._id } });
      } else {
        await MapBuilding.findOneAndUpdate(
          { _id: updatedFloor.building, defaultFloor: updatedFloor._id },
          { $set: { defaultFloor: null } },
        );
      }
    }

    return updatedFloor.toObject();
  },

  async deleteFloor(id: string, userId?: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid floor id");
    }

    const floor = await MapFloor.findById(id);

    if (!floor) {
      throw new Error("Floor not found");
    }

    if (!floor.isActive) {
      return floor.toObject();
    }

    const wasDefault = floor.isDefault;
    floor.isActive = false;
    if (userId) {
      floor.updatedBy = new Types.ObjectId(userId);
    }
    await floor.save();

    const buildingUpdate: any = {
      $inc: { floorCount: -1 },
    };

    if (wasDefault) {
      buildingUpdate.$set = { defaultFloor: null };
    }

    await MapBuilding.findByIdAndUpdate(floor.building, buildingUpdate);
    await MapBuilding.updateOne({ _id: floor.building, floorCount: { $lt: 0 } }, { $set: { floorCount: 0 } });

    return floor.toObject();
  },
};

export type MapManagerFloorService = typeof mapManagerFloorService;


