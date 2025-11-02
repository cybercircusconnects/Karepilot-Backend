export interface AdminNotificationSettings {
  userId: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsAlerts: boolean;
  securityAlerts: boolean;
  emergencyAlerts: boolean;
  weeklyReports: boolean;
}

export interface UpdateNotificationsRequest {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsAlerts: boolean;
  securityAlerts: boolean;
  emergencyAlerts: boolean;
  weeklyReports: boolean;
}

