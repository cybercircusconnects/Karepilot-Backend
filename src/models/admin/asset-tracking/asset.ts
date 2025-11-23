"use strict";

import mongoose, { Document, Schema } from "mongoose";
import Organization from "../organization/organization";
import MapBuilding from "../map-management/mapBuilding";
import MapFloorPlan from "../map-management/mapFloorPlan";
import Department from "../user-management/departments";
import AdminUser from "../user-management/users";

export enum AssetType {
  DEVICE = "device",
  EQUIPMENT = "equipment",
  STAFF = "staff",
  PERSONNEL = "personnel",
}

export enum AssetStatus {
  ONLINE = "online",
  OFFLINE = "offline",
  LOW_BATTERY = "low-battery",
}

export interface IAsset extends Document {
  organization: mongoose.Types.ObjectId;
  name: string;
  type: AssetType;
  status: AssetStatus;
  building?: mongoose.Types.ObjectId | null;
  floor?: mongoose.Types.ObjectId | null;
  location?: string | null; 
  department?: mongoose.Types.ObjectId | null;
  batteryLevel?: number | null;
  lastSeen?: Date | null;
  mapCoordinates?: {
    x?: number | null;
    y?: number | null;
    latitude?: number | null;
    longitude?: number | null;
  };
  description?: string | null;
  tags: string[];
  isActive: boolean;
  createdBy?: mongoose.Types.ObjectId | null;
  updatedBy?: mongoose.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const mapCoordinatesSchema = new Schema(
  {
    x: { type: Number },
    y: { type: Number },
    latitude: { type: Number },
    longitude: { type: Number },
  },
  { _id: false },
);

const assetSchema = new Schema<IAsset>(
  {
    organization: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: [true, "Organization is required"],
      index: true,
    },
    name: {
      type: String,
      required: [true, "Asset name is required"],
      trim: true,
      minlength: [2, "Asset name must be at least 2 characters long"],
      maxlength: [150, "Asset name cannot exceed 150 characters"],
    },
    type: {
      type: String,
      enum: Object.values(AssetType),
      required: [true, "Asset type is required"],
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(AssetStatus),
      default: AssetStatus.OFFLINE,
      index: true,
    },
    building: {
      type: Schema.Types.ObjectId,
      ref: "MapBuilding",
      default: null,
      index: true,
    },
    floor: {
      type: Schema.Types.ObjectId,
      ref: "MapFloorPlan",
      default: null,
    },
    location: {
      type: String,
      trim: true,
      maxlength: [200, "Location cannot exceed 200 characters"],
      default: null,
    },
    department: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      default: null,
      index: true,
    },
    batteryLevel: {
      type: Number,
      min: [0, "Battery level cannot be less than 0"],
      max: [100, "Battery level cannot exceed 100"],
      default: null,
    },
    lastSeen: {
      type: Date,
      default: null,
      index: true,
    },
    mapCoordinates: {
      type: mapCoordinatesSchema,
      default: undefined,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
      default: null,
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: (tags: string[]) => tags.every((tag) => typeof tag === "string" && tag.trim().length > 0),
        message: "All tags must be non-empty strings",
      },
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

assetSchema.index({ organization: 1, type: 1 });
assetSchema.index({ organization: 1, status: 1 });
assetSchema.index({ organization: 1, building: 1 });
assetSchema.index({ organization: 1, department: 1 });
assetSchema.index({ organization: 1, isActive: 1 });
assetSchema.index({ "mapCoordinates.latitude": 1, "mapCoordinates.longitude": 1 });

assetSchema.pre("save", async function (next) {
  if (this.isModified("organization")) {
    const organization = await Organization.findById(this.organization);
    if (!organization) {
      return next(new Error("Organization not found"));
    }
  }

  if (this.building) {
    const building = await MapBuilding.findById(this.building);
    if (!building) {
      return next(new Error("Building not found"));
    }
  }

  if (this.floor) {
    const floorPlan = await MapFloorPlan.findById(this.floor);
    if (!floorPlan) {
      return next(new Error("Floor plan not found"));
    }
  }

  if (this.department) {
    const department = await Department.findById(this.department);
    if (!department) {
      return next(new Error("Department not found"));
    }
  }

  if (this.createdBy) {
    const user = await AdminUser.findById(this.createdBy);
    if (!user) {
      return next(new Error("Created by user not found"));
    }
  }

  if (this.updatedBy) {
    const user = await AdminUser.findById(this.updatedBy);
    if (!user) {
      return next(new Error("Updated by user not found"));
    }
  }

  if (this.batteryLevel !== null && this.batteryLevel !== undefined) {
    if (this.batteryLevel <= 20) {
      this.status = AssetStatus.LOW_BATTERY;
    } else if (this.status === AssetStatus.LOW_BATTERY && this.batteryLevel > 20) {
      this.status = AssetStatus.ONLINE;
    }
  }

  if (this.lastSeen) {
    const minutesSinceLastSeen = (Date.now() - this.lastSeen.getTime()) / (1000 * 60);
    if (minutesSinceLastSeen > 10 && this.status !== AssetStatus.LOW_BATTERY) {
      this.status = AssetStatus.OFFLINE;
    }
  }

  next();
});

assetSchema.pre(["updateOne", "findOneAndUpdate"], async function (next) {
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

  if (update?.floor) {
    const floorPlan = await MapFloorPlan.findById(update.floor);
    if (!floorPlan) {
      return next(new Error("Floor plan not found"));
    }
  }

  if (update?.department) {
    const department = await Department.findById(update.department);
    if (!department) {
      return next(new Error("Department not found"));
    }
  }

  if (update?.createdBy) {
    const user = await AdminUser.findById(update.createdBy);
    if (!user) {
      return next(new Error("Created by user not found"));
    }
  }

  if (update?.updatedBy) {
    const user = await AdminUser.findById(update.updatedBy);
    if (!user) {
      return next(new Error("Updated by user not found"));
    }
  }

  next();
});

const Asset = mongoose.model<IAsset>("Asset", assetSchema);

export default Asset;

