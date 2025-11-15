export interface MapManagementSettingsPayload {
  organizationId: string;
  autoPublishUpdates?: boolean;
  highResolutionThumbnails?: boolean;
  enableVersionControl?: boolean;
}

export interface MapManagementSettingsResponse {
  organizationId: string;
  autoPublishUpdates: boolean;
  highResolutionThumbnails: boolean;
  enableVersionControl: boolean;
  updatedAt: Date;
}

