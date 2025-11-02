export interface AdminSecuritySettings {
  userId: string;
  twoFactorEnabled: boolean;
  sessionTimeout: number;
  maxLoginAttempts: number;
  passwordExpiry: number;
  auditLogs: boolean;
}

export interface AdminPasswordChange {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface UpdateSecurityRequest {
  twoFactorEnabled: boolean;
  sessionTimeout: number;
  maxLoginAttempts: number;
  passwordExpiry: number;
  auditLogs: boolean;
}

