import { AlertType, AlertSeverity, AlertStatus } from "../../../models/admin/alerts-geofencing/alert";

export interface Alert {
  _id: string;
  organization: string | { _id: string; name: string };
  building?: string | { _id: string; name: string } | null;
  floor?: string | { _id: string; title: string } | null;
  department?: string | { _id: string; name: string } | null;
  asset?: string | { _id: string; name: string } | null;
  name: string;
  description?: string | null;
  type: AlertType;
  severity: AlertSeverity;
  status: AlertStatus;
  location?: string | null;
  room?: string | null;
  timestamp: Date;
  acknowledgedBy?: string | { _id: string; firstName: string; lastName: string } | null;
  acknowledgedAt?: Date | null;
  resolvedBy?: string | { _id: string; firstName: string; lastName: string } | null;
  resolvedAt?: Date | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AlertStats {
  activeAlerts: number;
  critical: number;
  unacknowledged: number;
  zoneTriggers: number;
}

export interface AlertOverviewStats {
  active: number;
  acknowledged: number;
  resolved: number;
}

export interface AlertListResponse {
  success: boolean;
  message: string;
  data: {
    alerts: Alert[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    availableFilters: {
      types: string[];
      severities: string[];
      statuses: string[];
      buildings: Array<{ id: string; name: string }>;
      departments: Array<{ id: string; name: string }>;
    };
  };
}

export interface AlertResponse {
  success: boolean;
  message: string;
  data: {
    alert: Alert;
  };
}

export interface AlertStatsResponse {
  success: boolean;
  message: string;
  data: {
    stats: AlertStats;
    overview: AlertOverviewStats;
  };
}

export interface CreateAlertRequest {
  organizationId: string;
  buildingId?: string | null;
  floorId?: string | null;
  departmentId?: string | null;
  assetId?: string | null;
  name: string;
  description?: string | null;
  type: AlertType;
  severity: AlertSeverity;
  location?: string | null;
  room?: string | null;
  timestamp?: Date | null;
}

export interface UpdateAlertRequest {
  buildingId?: string | null;
  floorId?: string | null;
  departmentId?: string | null;
  assetId?: string | null;
  name?: string;
  description?: string | null;
  type?: AlertType;
  severity?: AlertSeverity;
  status?: AlertStatus;
  location?: string | null;
  room?: string | null;
  timestamp?: Date | null;
}

export interface AlertQuery {
  organizationId: string;
  buildingId?: string | undefined;
  floorId?: string | undefined;
  departmentId?: string | undefined;
  assetId?: string | undefined;
  type?: AlertType | undefined;
  severity?: AlertSeverity | undefined;
  status?: AlertStatus | undefined;
  search?: string | undefined;
  isActive?: boolean | undefined;
  page?: number | undefined;
  limit?: number | undefined;
}

export interface AcknowledgeAlertRequest {
  acknowledgedBy?: string;
}

export interface ResolveAlertRequest {
  resolvedBy?: string;
}

