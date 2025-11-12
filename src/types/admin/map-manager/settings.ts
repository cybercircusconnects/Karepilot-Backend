import { MapLayerType } from "../../../models/admin/map-manager";

export interface UpdateSettingsDTO {
  organization: string;
  autoPublishUpdates?: boolean;
  highResThumbnails?: boolean;
  enableVersionControl?: boolean;
  defaultGridSize?: number;
  defaultGridUnit?: "px" | "ft" | "m";
  defaultSnapToGrid?: boolean;
  defaultShowGrid?: boolean;
  defaultZoom?: number;
  defaultMapScale?: string | null;
  allowedFileTypes?: string[];
  maxUploadSizeMb?: number;
  defaultLayerVisibility?: Partial<Record<MapLayerType, boolean>>;
  notificationPreferences?: {
    publishSuccess?: boolean;
    publishFailure?: boolean;
    approvalRequired?: boolean;
  };
  retentionPolicy?: {
    keepDraftVersions?: number;
    keepPublishedSnapshots?: number;
  };
}


