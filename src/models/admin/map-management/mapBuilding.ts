"use strict";

import mongoose, { Document, Schema } from "mongoose";
import Organization from "../organization/organization";
import VenueTemplate from "../organization/venueTemplate";
import AdminUser from "../user-management/users";
import { MapBuildingStatus } from "../../../types/admin/map-management";

export interface IMapBuilding extends Document {
  organization: mongoose.Types.ObjectId;
  name: string;
  code?: string | null;
  description?: string | null;
  tags: string[];
  status: MapBuildingStatus;
  venueTemplate?: mongoose.Types.ObjectId | null;
  isActive: boolean;
  createdBy?: mongoose.Types.ObjectId | null;
  updatedBy?: mongoose.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const mapBuildingSchema = new Schema<IMapBuilding>(
  {
    organization: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: [true, "Organization is required"],
      index: true,
    },
    name: {
      type: String,
      required: [true, "Building name is required"],
      trim: true,
      minlength: [2, "Building name must be at least 2 characters long"],
      maxlength: [120, "Building name cannot exceed 120 characters"],
    },
    code: {
      type: String,
      trim: true,
      maxlength: [50, "Building code cannot exceed 50 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: (tags: string[]) => tags.every((tag) => typeof tag === "string" && tag.trim().length > 0),
        message: "Each tag must be a non-empty string",
      },
    },
    status: {
      type: String,
      enum: Object.values(MapBuildingStatus),
      default: MapBuildingStatus.ACTIVE,
      index: true,
    },
    venueTemplate: {
      type: Schema.Types.ObjectId,
      ref: "VenueTemplate",
      default: null,
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

mapBuildingSchema.index({ organization: 1, name: 1 }, { unique: true });
mapBuildingSchema.index({ organization: 1, code: 1 }, { unique: false, sparse: true });
mapBuildingSchema.index({ tags: 1 });

mapBuildingSchema.pre("save", async function (next) {
  if (!this.organization) {
    return next(new Error("Organization is required"));
  }

  const organization = await Organization.findById(this.organization);
  if (!organization) {
    return next(new Error("Organization not found"));
  }

  if (this.venueTemplate) {
    const template = await VenueTemplate.findById(this.venueTemplate);
    if (!template) {
      return next(new Error("Venue template not found"));
    }
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

mapBuildingSchema.pre(["updateOne", "findOneAndUpdate"], async function (next) {
  const update = this.getUpdate() as any;
  if (update?.organization) {
    const organization = await Organization.findById(update.organization);
    if (!organization) {
      return next(new Error("Organization not found"));
    }
  }

  if (update?.venueTemplate) {
    const template = await VenueTemplate.findById(update.venueTemplate);
    if (!template) {
      return next(new Error("Venue template not found"));
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

const MapBuilding = mongoose.model<IMapBuilding>("MapBuilding", mapBuildingSchema);

export default MapBuilding;

