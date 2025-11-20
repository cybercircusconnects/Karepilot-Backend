"use strict";

import mongoose, { Document, Schema } from "mongoose";
import MapFloorPlan from "./mapFloorPlan";
import AdminUser from "../user-management/users";

export interface IMapEditorPath extends Document {
  floorPlan: mongoose.Types.ObjectId;
  name?: string;
  points: Array<{
    x: number;
    y: number;
  }>;
  color?: string;
  strokeWidth?: number;
  isActive: boolean;
  createdBy?: mongoose.Types.ObjectId | null;
  updatedBy?: mongoose.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const pointSchema = new Schema(
  {
    x: {
      type: Number,
      required: [true, "X coordinate is required"],
    },
    y: {
      type: Number,
      required: [true, "Y coordinate is required"],
    },
  },
  { _id: false },
);

const mapEditorPathSchema = new Schema<IMapEditorPath>(
  {
    floorPlan: {
      type: Schema.Types.ObjectId,
      ref: "MapFloorPlan",
      required: [true, "Floor plan is required"],
      index: true,
    },
    name: {
      type: String,
      trim: true,
      maxlength: [150, "Path name cannot exceed 150 characters"],
    },
    points: {
      type: [pointSchema],
      required: [true, "Path points are required"],
      validate: {
        validator: function (points: Array<{ x: number; y: number }>) {
          return points.length >= 2;
        },
        message: "Path must have at least 2 points",
      },
    },
    color: {
      type: String,
      trim: true,
      maxlength: [20, "Color cannot exceed 20 characters"],
      default: "#2563EB",
    },
    strokeWidth: {
      type: Number,
      min: [1, "Stroke width must be at least 1"],
      max: [20, "Stroke width cannot exceed 20"],
      default: 3,
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

mapEditorPathSchema.index({ floorPlan: 1, isActive: 1 });

mapEditorPathSchema.pre("save", async function (next) {
  const floorPlan = await MapFloorPlan.findById(this.floorPlan);
  if (!floorPlan) {
    return next(new Error("Floor plan not found"));
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

mapEditorPathSchema.pre(["updateOne", "findOneAndUpdate"], async function (next) {
  const update = this.getUpdate() as any;

  if (update?.floorPlan) {
    const floorPlan = await MapFloorPlan.findById(update.floorPlan);
    if (!floorPlan) {
      return next(new Error("Floor plan not found"));
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

const MapEditorPath = mongoose.model<IMapEditorPath>("MapEditorPath", mapEditorPathSchema);

export default MapEditorPath;

