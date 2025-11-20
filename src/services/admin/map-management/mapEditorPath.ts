"use strict";

import { Types } from "mongoose";
import MapEditorPath from "../../../models/admin/map-management/mapEditorPath";
import {
  CreateMapEditorPathPayload,
  UpdateMapEditorPathPayload,
  MapEditorPathQuery,
  MapEditorPathOverview,
} from "../../../types/admin/map-management/mapEditorPath";
import { IMapEditorPath } from "../../../models/admin/map-management/mapEditorPath";
import MapFloorPlan from "../../../models/admin/map-management/mapFloorPlan";

const toObjectId = (value?: string | null): Types.ObjectId | null => {
  if (!value || !Types.ObjectId.isValid(value)) {
    return null;
  }
  return new Types.ObjectId(value);
};

class MapEditorPathService {
  private serializePath(doc: IMapEditorPath): MapEditorPathOverview {
    const result: MapEditorPathOverview = {
      id: (doc as any)._id.toString(),
      floorPlan: {
        id: doc.floorPlan.toString(),
        title: (doc.populated("floorPlan") as any)?.title || "",
        floorLabel: (doc.populated("floorPlan") as any)?.floorLabel || "",
      },
      points: doc.points.map((point) => ({ x: point.x, y: point.y })),
      isActive: doc.isActive,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
    if (doc.name) {
      result.name = doc.name;
    }
    if (doc.color) {
      result.color = doc.color;
    }
    if (doc.strokeWidth) {
      result.strokeWidth = doc.strokeWidth;
    }

    return result;
  }

  private async getPathWithRelations(id: string): Promise<IMapEditorPath | null> {
    return MapEditorPath.findById(id).populate("floorPlan", "title floorLabel");
  }

  async getPathsByFloorPlan(query: MapEditorPathQuery): Promise<MapEditorPathOverview[]> {
    const floorPlanId = toObjectId(query.floorPlanId);
    if (!floorPlanId) {
      throw new Error("Invalid floor plan ID");
    }

    const dbQuery: Record<string, unknown> = {
      floorPlan: floorPlanId,
      isActive: typeof query.isActive === "boolean" ? query.isActive : true,
    };

    if (query.search) {
      const searchRegex = new RegExp(query.search, "i");
      dbQuery.name = { $regex: searchRegex };
    }

    const paths = await MapEditorPath.find(dbQuery)
      .populate("floorPlan", "title floorLabel")
      .sort({ createdAt: -1 })
      .lean();

    return paths.map((doc: any): MapEditorPathOverview => {
      const result: MapEditorPathOverview = {
        id: doc._id.toString(),
        floorPlan: {
          id: doc.floorPlan._id.toString(),
          title: doc.floorPlan.title || "",
          floorLabel: doc.floorPlan.floorLabel || "",
        },
        points: doc.points.map((point: any) => ({ x: point.x, y: point.y })),
        isActive: doc.isActive,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      };

      if (doc.name) {
        result.name = doc.name;
      }
      if (doc.color) {
        result.color = doc.color;
      }
      if (doc.strokeWidth) {
        result.strokeWidth = doc.strokeWidth;
      }

      return result;
    });
  }

  async getPathById(id: string): Promise<MapEditorPathOverview | null> {
    const path = await this.getPathWithRelations(id);
    if (!path) {
      return null;
    }
    return this.serializePath(path as any);
  }

  async createPath(data: CreateMapEditorPathPayload, adminId: string): Promise<MapEditorPathOverview> {
    const floorPlanId = toObjectId(data.floorPlanId);
    if (!floorPlanId) {
      throw new Error("Invalid floor plan ID");
    }

    if (!data.points || data.points.length < 2) {
      throw new Error("Path must have at least 2 points");
    }

    const floorPlan = await MapFloorPlan.findById(floorPlanId);
    if (!floorPlan) {
      throw new Error("Floor plan not found");
    }

    const path = new MapEditorPath({
      floorPlan: floorPlanId,
      name: data.name?.trim() || undefined,
      points: data.points.map((point) => ({ x: point.x, y: point.y })),
      color: data.color?.trim() || "#2563EB",
      strokeWidth: data.strokeWidth || 3,
      isActive: true,
      createdBy: toObjectId(adminId),
      updatedBy: toObjectId(adminId),
    });

    await path.save();

    const populated = await this.getPathWithRelations(path.id);
    if (!populated) {
      throw new Error("Failed to retrieve created path");
    }

    return this.serializePath(populated as any);
  }

  async updatePath(
    id: string,
    data: UpdateMapEditorPathPayload,
    adminId: string,
  ): Promise<MapEditorPathOverview> {
    const path = await MapEditorPath.findById(id);
    if (!path) {
      throw new Error("Path not found");
    }

    if (data.name !== undefined) {
      path.name = data.name?.trim() || "";
    }

    if (data.points !== undefined) {
      if (data.points.length < 2) {
        throw new Error("Path must have at least 2 points");
      }
      path.points = data.points.map((point) => ({ x: point.x, y: point.y }));
    }

    if (data.color !== undefined) {
      path.color = data.color?.trim() || "#2563EB";
    }

    if (data.strokeWidth !== undefined) {
      path.strokeWidth = data.strokeWidth;
    }

    if (data.isActive !== undefined) {
      path.isActive = data.isActive;
    }

    path.updatedBy = toObjectId(adminId);

    await path.save();

    const populated = await this.getPathWithRelations(path.id);
    if (!populated) {
      throw new Error("Failed to retrieve updated path");
    }

    return this.serializePath(populated as any);
  }

  async deletePath(id: string): Promise<void> {
    const path = await MapEditorPath.findById(id);
    if (!path) {
      throw new Error("Path not found");
    }

    await MapEditorPath.findByIdAndDelete(id);
  }

  async deletePathsByFloorPlan(floorPlanId: string): Promise<void> {
    const floorPlanObjectId = toObjectId(floorPlanId);
    if (!floorPlanObjectId) {
      throw new Error("Invalid floor plan ID");
    }

    await MapEditorPath.deleteMany({ floorPlan: floorPlanObjectId });
  }
}

const mapEditorPathService = new MapEditorPathService();

export { mapEditorPathService };
export default mapEditorPathService;

