"use strict";

import { Types } from "mongoose";
import { MapBuilding, MapFloorPlan, MapEditorPath } from "../../models/admin/map-management";
import { MapBuildingStatus } from "../../types/admin/map-management/buildings";
import { MapFloorPlanStatus } from "../../types/admin/map-management/floorPlans";

export class MobileMapService {
  async getBuildings(organizationId?: string) {
    const query: Record<string, unknown> = {
      isActive: true,
      status: MapBuildingStatus.ACTIVE,
    };

    if (organizationId && Types.ObjectId.isValid(organizationId)) {
      query.organization = new Types.ObjectId(organizationId);
    }

    const buildings = await MapBuilding.find(query)
      .populate("organization", "name organizationType")
      .select("-createdBy -updatedBy")
      .sort({ name: 1 })
      .lean();

    return buildings.map((building: any) => ({
      id: building._id,
      name: building.name,
      code: building.code || null,
      description: building.description || null,
      organization: building.organization && typeof building.organization === "object"
        ? {
            id: building.organization._id || building.organization,
            name: (building.organization as any).name || "",
            organizationType: (building.organization as any).organizationType || null,
          }
        : null,
      tags: Array.isArray(building.tags) ? building.tags : [],
      isActive: building.isActive ?? true,
      status: building.status,
      createdAt: building.createdAt,
      updatedAt: building.updatedAt,
    }));
  }

  async getBuildingById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid building ID");
    }

    const building = await MapBuilding.findOne({
      _id: new Types.ObjectId(id),
      isActive: true,
      status: MapBuildingStatus.ACTIVE,
    })
      .populate("organization", "name organizationType")
      .select("-createdBy -updatedBy")
      .lean();

    if (!building) {
      throw new Error("Building not found");
    }

    return {
      id: building._id,
      name: building.name,
      code: building.code || null,
      description: building.description || null,
      organization: building.organization && typeof building.organization === "object"
        ? {
            id: building.organization._id || building.organization,
            name: (building.organization as any).name || "",
            organizationType: (building.organization as any).organizationType || null,
          }
        : null,
      tags: Array.isArray(building.tags) ? building.tags : [],
      isActive: building.isActive ?? true,
      status: building.status,
      createdAt: building.createdAt,
      updatedAt: building.updatedAt,
    };
  }

  async getFloorPlans(buildingId: string) {
    if (!Types.ObjectId.isValid(buildingId)) {
      throw new Error("Invalid building ID");
    }

    const floorPlans = await MapFloorPlan.find({
      building: new Types.ObjectId(buildingId),
      isActive: true,
      status: MapFloorPlanStatus.PUBLISHED,
    })
      .populate("building", "name code")
      .select("-createdBy -updatedBy")
      .sort({ floorNumber: 1, name: 1 })
      .lean();

    return floorPlans.map((floorPlan: any) => ({
      id: floorPlan._id,
      name: floorPlan.title || floorPlan.name || null,
      floorNumber: floorPlan.floorNumber || null,
      description: floorPlan.metadata?.description || floorPlan.description || null,
      building: floorPlan.building && typeof floorPlan.building === "object"
        ? {
            id: floorPlan.building._id || floorPlan.building,
            name: (floorPlan.building as any).name || "",
            code: (floorPlan.building as any).code || null,
          }
        : null,
      mapImage: floorPlan.media?.fileUrl || floorPlan.mapImage || null,
      mapData: floorPlan.mapData || null,
      status: floorPlan.status,
      isActive: floorPlan.isActive ?? true,
      createdAt: floorPlan.createdAt,
      updatedAt: floorPlan.updatedAt,
    }));
  }

  async getFloorPlanById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid floor plan ID");
    }

    const floorPlan = await MapFloorPlan.findOne({
      _id: new Types.ObjectId(id),
      isActive: true,
      status: MapFloorPlanStatus.PUBLISHED,
    })
      .populate("building", "name code")
      .select("-createdBy -updatedBy")
      .lean();

    if (!floorPlan) {
      throw new Error("Floor plan not found");
    }

    return {
      id: floorPlan._id,
      name: (floorPlan as any).title || (floorPlan as any).name || null,
      floorNumber: (floorPlan as any).floorNumber || null,
      description: (floorPlan as any).metadata?.description || (floorPlan as any).description || null,
      building: floorPlan.building && typeof floorPlan.building === "object"
        ? {
            id: floorPlan.building._id || floorPlan.building,
            name: (floorPlan.building as any).name || "",
            code: (floorPlan.building as any).code || null,
          }
        : null,
      mapImage: (floorPlan as any).media?.fileUrl || (floorPlan as any).mapImage || null,
      mapData: (floorPlan as any).mapData || null,
      status: (floorPlan as any).status,
      isActive: (floorPlan as any).isActive ?? true,
      createdAt: floorPlan.createdAt,
      updatedAt: floorPlan.updatedAt,
    };
  }

  async getNavigationPaths(floorPlanId: string) {
    if (!Types.ObjectId.isValid(floorPlanId)) {
      throw new Error("Invalid floor plan ID");
    }

    const paths = await MapEditorPath.find({
      floorPlan: new Types.ObjectId(floorPlanId),
      isActive: true,
    })
      .select("-createdBy -updatedBy")
      .sort({ name: 1 })
      .lean();

    return paths.map((path: any) => ({
      id: path._id,
      name: path.name || null,
      points: Array.isArray(path.points) ? path.points : [],
      color: path.color || "#3D8C6C",
      strokeWidth: path.strokeWidth || 2,
      isActive: path.isActive ?? true,
      createdAt: path.createdAt,
      updatedAt: path.updatedAt,
    }));
  }
}

export default new MobileMapService();

