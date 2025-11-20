"use strict";

import mongoose, { Document, Schema } from "mongoose";
import MapFloorPlan from "./mapFloorPlan";
import AdminUser from "../user-management/users";

export interface IMapEditorLabel extends Document {
  floorPlan: mongoose.Types.ObjectId;
  text: string;
  coordinates: {
    x: number;
    y: number;
  };
  fontSize?: string;
  fontWeight?: string;
  color?: string;
  isActive: boolean;
  createdBy?: mongoose.Types.ObjectId | null;
  updatedBy?: mongoose.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const coordinatesSchema = new Schema(
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

const mapEditorLabelSchema = new Schema<IMapEditorLabel>(
  {
    floorPlan: {
      type: Schema.Types.ObjectId,
      ref: "MapFloorPlan",
      required: [true, "Floor plan is required"],
      index: true,
    },
    text: {
      type: String,
      required: [true, "Label text is required"],
      trim: true,
      minlength: [1, "Label text must be at least 1 character long"],
      maxlength: [200, "Label text cannot exceed 200 characters"],
    },
    coordinates: {
      type: coordinatesSchema,
      required: [true, "Coordinates are required"],
    },
    fontSize: {
      type: String,
      trim: true,
      maxlength: [20, "Font size cannot exceed 20 characters"],
      default: "16px",
    },
    fontWeight: {
      type: String,
      trim: true,
      maxlength: [20, "Font weight cannot exceed 20 characters"],
      default: "Normal",
    },
    color: {
      type: String,
      trim: true,
      maxlength: [20, "Color cannot exceed 20 characters"],
      default: "#000000",
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

mapEditorLabelSchema.index({ floorPlan: 1, isActive: 1 });

mapEditorLabelSchema.pre("save", async function (next) {
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

mapEditorLabelSchema.pre(["updateOne", "findOneAndUpdate"], async function (next) {
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

const MapEditorLabel = mongoose.model<IMapEditorLabel>("MapEditorLabel", mapEditorLabelSchema);

export default MapEditorLabel;

