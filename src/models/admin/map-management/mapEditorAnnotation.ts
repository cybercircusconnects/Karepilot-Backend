import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMapEditorAnnotationCoordinates {
  x: number;
  y: number;
}

export interface IMapEditorAnnotation extends Document {
  floorPlan: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  type: string;
  coordinates: IMapEditorAnnotationCoordinates;
  color?: string;
  isActive: boolean;
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const MapEditorAnnotationCoordinatesSchema = new Schema<IMapEditorAnnotationCoordinates>(
  {
    x: {
      type: Number,
      required: true,
    },
    y: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const MapEditorAnnotationSchema = new Schema<IMapEditorAnnotation>(
  {
    floorPlan: {
      type: Schema.Types.ObjectId,
      ref: "MapFloorPlan",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      trim: true,
      default: "POI",
    },
    coordinates: {
      type: MapEditorAnnotationCoordinatesSchema,
      required: true,
    },
    color: {
      type: String,
      default: "#F59E0B",
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

MapEditorAnnotationSchema.index({ floorPlan: 1, isActive: 1 });
MapEditorAnnotationSchema.index({ createdAt: -1 });

const MapEditorAnnotation: Model<IMapEditorAnnotation> = mongoose.models
  .MapEditorAnnotation ||
  mongoose.model<IMapEditorAnnotation>(
    "MapEditorAnnotation",
    MapEditorAnnotationSchema
  );

export default MapEditorAnnotation;

