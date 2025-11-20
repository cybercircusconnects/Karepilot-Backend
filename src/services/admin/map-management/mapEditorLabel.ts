"use strict";

import { Types } from "mongoose";
import MapEditorLabel from "../../../models/admin/map-management/mapEditorLabel";
import {
  CreateMapEditorLabelPayload,
  UpdateMapEditorLabelPayload,
  MapEditorLabelQuery,
  MapEditorLabelOverview,
} from "../../../types/admin/map-management/mapEditorLabel";
import { IMapEditorLabel } from "../../../models/admin/map-management/mapEditorLabel";
import MapFloorPlan from "../../../models/admin/map-management/mapFloorPlan";

const toObjectId = (value?: string | null): Types.ObjectId | null => {
  if (!value || !Types.ObjectId.isValid(value)) {
    return null;
  }
  return new Types.ObjectId(value);
};

class MapEditorLabelService {
  private serializeLabel(doc: IMapEditorLabel): MapEditorLabelOverview {
    const result: MapEditorLabelOverview = {
      id: (doc as any)._id.toString(),
      floorPlan: {
        id: doc.floorPlan.toString(),
        title: (doc.populated("floorPlan") as any)?.title || "",
        floorLabel: (doc.populated("floorPlan") as any)?.floorLabel || "",
      },
      text: doc.text,
      coordinates: {
        x: doc.coordinates.x,
        y: doc.coordinates.y,
      },
      isActive: doc.isActive,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
    if (doc.fontSize) {
      result.fontSize = doc.fontSize;
    }
    if (doc.fontWeight) {
      result.fontWeight = doc.fontWeight;
    }
    if (doc.color) {
      result.color = doc.color;
    }

    return result;
  }

  private async getLabelWithRelations(id: string): Promise<IMapEditorLabel | null> {
    return MapEditorLabel.findById(id).populate("floorPlan", "title floorLabel");
  }

  async getLabelsByFloorPlan(query: MapEditorLabelQuery): Promise<MapEditorLabelOverview[]> {
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
      dbQuery.text = { $regex: searchRegex };
    }

    const labels = await MapEditorLabel.find(dbQuery)
      .populate("floorPlan", "title floorLabel")
      .sort({ createdAt: -1 })
      .lean();

    return labels.map((doc: any): MapEditorLabelOverview => {
      const result: MapEditorLabelOverview = {
        id: doc._id.toString(),
        floorPlan: {
          id: doc.floorPlan._id.toString(),
          title: doc.floorPlan.title || "",
          floorLabel: doc.floorPlan.floorLabel || "",
        },
        text: doc.text,
        coordinates: {
          x: doc.coordinates.x,
          y: doc.coordinates.y,
        },
        isActive: doc.isActive,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      };

      if (doc.fontSize) {
        result.fontSize = doc.fontSize;
      }
      if (doc.fontWeight) {
        result.fontWeight = doc.fontWeight;
      }
      if (doc.color) {
        result.color = doc.color;
      }

      return result;
    });
  }

  async getLabelById(id: string): Promise<MapEditorLabelOverview | null> {
    const label = await this.getLabelWithRelations(id);
    if (!label) {
      return null;
    }
    return this.serializeLabel(label as any);
  }

  async createLabel(data: CreateMapEditorLabelPayload, adminId: string): Promise<MapEditorLabelOverview> {
    const floorPlanId = toObjectId(data.floorPlanId);
    if (!floorPlanId) {
      throw new Error("Invalid floor plan ID");
    }

    const floorPlan = await MapFloorPlan.findById(floorPlanId);
    if (!floorPlan) {
      throw new Error("Floor plan not found");
    }

    const label = new MapEditorLabel({
      floorPlan: floorPlanId,
      text: data.text.trim(),
      coordinates: {
        x: data.coordinates.x,
        y: data.coordinates.y,
      },
      fontSize: data.fontSize?.trim() || "16px",
      fontWeight: data.fontWeight?.trim() || "Normal",
      color: data.color?.trim() || "#000000",
      isActive: true,
      createdBy: toObjectId(adminId),
      updatedBy: toObjectId(adminId),
    });

    await label.save();

    const populated = await this.getLabelWithRelations(label.id);
    if (!populated) {
      throw new Error("Failed to retrieve created label");
    }

    return this.serializeLabel(populated as any);
  }

  async updateLabel(
    id: string,
    data: UpdateMapEditorLabelPayload,
    adminId: string,
  ): Promise<MapEditorLabelOverview> {
    const label = await MapEditorLabel.findById(id);
    if (!label) {
      throw new Error("Label not found");
    }

    if (data.text !== undefined) {
      label.text = data.text.trim();
    }

    if (data.coordinates !== undefined) {
      label.coordinates = {
        x: data.coordinates.x,
        y: data.coordinates.y,
      };
    }

    if (data.fontSize !== undefined) {
      label.fontSize = data.fontSize?.trim() || "16px";
    }

    if (data.fontWeight !== undefined) {
      label.fontWeight = data.fontWeight?.trim() || "Normal";
    }

    if (data.color !== undefined) {
      label.color = data.color?.trim() || "#000000";
    }

    if (data.isActive !== undefined) {
      label.isActive = data.isActive;
    }

    label.updatedBy = toObjectId(adminId);

    await label.save();

    const populated = await this.getLabelWithRelations(label.id);
    if (!populated) {
      throw new Error("Failed to retrieve updated label");
    }

    return this.serializeLabel(populated as any);
  }

  async deleteLabel(id: string): Promise<void> {
    const label = await MapEditorLabel.findById(id);
    if (!label) {
      throw new Error("Label not found");
    }

    await MapEditorLabel.findByIdAndDelete(id);
  }

  async deleteLabelsByFloorPlan(floorPlanId: string): Promise<void> {
    const floorPlanObjectId = toObjectId(floorPlanId);
    if (!floorPlanObjectId) {
      throw new Error("Invalid floor plan ID");
    }

    await MapEditorLabel.deleteMany({ floorPlan: floorPlanObjectId });
  }
}

const mapEditorLabelService = new MapEditorLabelService();

export { mapEditorLabelService };
export default mapEditorLabelService;

