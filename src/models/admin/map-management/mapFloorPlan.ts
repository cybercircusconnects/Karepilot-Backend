"use strict";

import mongoose, { Document, Schema } from "mongoose";
import Organization from "../organization/organization";
import MapBuilding from "./mapBuilding";
import AdminUser from "../user-management/users";
import { MapFloorPlanStatus } from "../../../types/admin/map-management";

export interface IMapFloorPlan extends Document {
  organization: mongoose.Types.ObjectId;
  building: mongoose.Types.ObjectId;
  title: string;
  floorLabel: string;
  floorNumber?: number | null;
  status: MapFloorPlanStatus;
  location: {
    latitude?: number | null;
    longitude?: number | null;
  };
  media: {
    fileUrl?: string | null; 
    fileKey?: string | null; 
  };
  metadata: {
    scale?: string | null;
    description?: string | null;
    tags: string[];
  };
  version: number;
  versionNotes?: string | null;
  publishedAt?: Date | null;
  isTemplate: boolean;
  isActive: boolean;
  createdBy?: mongoose.Types.ObjectId | null;
  updatedBy?: mongoose.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const mapFloorPlanSchema = new Schema<IMapFloorPlan>(
  {
    organization: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: [true, "Organization is required"],
      index: true,
    },
    building: {
      type: Schema.Types.ObjectId,
      ref: "MapBuilding",
      required: [true, "Building is required"],
      index: true,
    },
    title: {
      type: String,
      required: [true, "Floor plan title is required"],
      trim: true,
      minlength: [2, "Floor plan title must be at least 2 characters long"],
      maxlength: [150, "Floor plan title cannot exceed 150 characters"],
    },
    floorLabel: {
      type: String,
      required: [true, "Floor label is required"],
      trim: true,
      maxlength: [80, "Floor label cannot exceed 80 characters"],
    },
    floorNumber: {
      type: Number,
      default: null,
      min: [-10, "Floor number cannot be less than -10"],
      max: [200, "Floor number cannot exceed 200"],
    },
    status: {
      type: String,
      enum: Object.values(MapFloorPlanStatus),
      default: MapFloorPlanStatus.DRAFT,
      index: true,
    },
    location: {
      latitude: {
        type: Number,
        default: null,
        min: [-90, "Latitude must be between -90 and 90"],
        max: [90, "Latitude must be between -90 and 90"],
      },
      longitude: {
        type: Number,
        default: null,
        min: [-180, "Longitude must be between -180 and 180"],
        max: [180, "Longitude must be between -180 and 180"],
      },
    },
    media: {
      fileUrl: { type: String, default: null },
      fileKey: { type: String, default: null },
    },
    metadata: {
      scale: { type: String, default: null, trim: true },
      description: { type: String, default: null, trim: true, maxlength: 2000 },
      tags: {
        type: [String],
        default: [],
      },
    },
    version: {
      type: Number,
      default: 1,
      min: [1, "Version must be at least 1"],
    },
    versionNotes: {
      type: String,
      default: null,
      trim: true,
      maxlength: [1000, "Version notes cannot exceed 1000 characters"],
    },
    publishedAt: {
      type: Date,
      default: null,
    },
    isTemplate: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "AdminUser",
      default: null,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "AdminUser",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

mapFloorPlanSchema.index({ organization: 1, building: 1, floorLabel: 1 }, { unique: false });
mapFloorPlanSchema.index({ organization: 1, status: 1 });
mapFloorPlanSchema.index({ organization: 1, "metadata.tags": 1 });

mapFloorPlanSchema.pre("save", async function (next) {
  const organization = await Organization.findById(this.organization);
  if (!organization) {
    return next(new Error("Organization not found"));
  }

  const building = await MapBuilding.findById(this.building);
  if (!building) {
    return next(new Error("Building not found"));
  }

  if (this.createdBy) {
    const creator = await AdminUser.findById(this.createdBy);
    if (!creator) {
      return next(new Error("Created by admin not found"));
    }
  }

  if (this.updatedBy) {
    const updater = await AdminUser.findById(this.updatedBy);
    if (!updater) {
      return next(new Error("Updated by admin not found"));
    }
  }

  next();
});

mapFloorPlanSchema.pre(["updateOne", "findOneAndUpdate"], async function (next) {
  const update = this.getUpdate() as any;

  if (update?.organization) {
    const organization = await Organization.findById(update.organization);
    if (!organization) {
      return next(new Error("Organization not found"));
    }
  }

  if (update?.building) {
    const building = await MapBuilding.findById(update.building);
    if (!building) {
      return next(new Error("Building not found"));
    }
  }

  if (update?.createdBy) {
    const creator = await AdminUser.findById(update.createdBy);
    if (!creator) {
      return next(new Error("Created by admin not found"));
    }
  }

  if (update?.updatedBy) {
    const updater = await AdminUser.findById(update.updatedBy);
    if (!updater) {
      return next(new Error("Updated by admin not found"));
    }
  }

  next();
});

const MapFloorPlan = mongoose.model<IMapFloorPlan>("MapFloorPlan", mapFloorPlanSchema);

export default MapFloorPlan;

