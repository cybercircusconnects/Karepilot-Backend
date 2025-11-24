export interface DashboardStats {
  activePatients: number;
  activePatientsChange: number;
  emergencyAlerts: number;
  emergencyAlertsChange: number;
  equipmentTracked: number;
  equipmentTrackedChange: number;
  navigationRequests: number;
  navigationRequestsChange: number;
}

export interface SystemHealthItem {
  name: string;
  health: number;
  status: "Healthy" | "Warning" | "Critical";
  time: string;
}

export interface DashboardActivity {
  id: string;
  text: string;
  author: string;
  time: string;
  color: string;
  type: string;
  createdAt: Date;
}

export interface DashboardResponse {
  stats: DashboardStats;
  systemHealth: SystemHealthItem[];
  recentActivities: DashboardActivity[];
}

export interface DashboardQuery {
  organizationId: string;
  startDate?: Date;
  endDate?: Date;
}

