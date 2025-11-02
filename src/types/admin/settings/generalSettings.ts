export interface AdminProfileSettings {
  firstName: string;
  lastName: string;
  email: string;
  profileImage?: string;
}

export interface AdminUserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  timeFormat: '12' | '24';
  autoRefresh: boolean;
  refreshInterval: number;
}

export interface AdminGeneralSettings extends AdminProfileSettings, AdminUserPreferences {
  userId: string;
}

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  email: string;
  profileImage?: string;
}

export interface UpdatePreferencesRequest {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  timeFormat: '12' | '24';
  autoRefresh: boolean;
  refreshInterval: number;
}

