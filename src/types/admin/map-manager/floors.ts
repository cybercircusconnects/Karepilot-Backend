export interface CreateFloorDTO {
  organization: string;
  building: string;
  name: string;
  code?: string;
  level: number;
  sequence: number;
  description?: string;
  isBasement?: boolean;
  isDefault?: boolean;
  tags?: string[];
  attributes?: Record<string, any>;
  isActive?: boolean;
}

export interface UpdateFloorDTO {
  name?: string;
  code?: string;
  level?: number;
  sequence?: number;
  description?: string;
  isBasement?: boolean;
  isDefault?: boolean;
  tags?: string[];
  attributes?: Record<string, any> | null;
  isActive?: boolean;
}

export interface FloorQuery {
  page?: number | undefined;
  limit?: number | undefined;
  organization?: string | undefined;
  building?: string | undefined;
  search?: string | undefined;
  isActive?: boolean | undefined;
  includeInactiveBuilding?: boolean | undefined;
}


