import { AdminNotificationSettings } from '../../../models/admin/settings';
import { UpdateNotificationsRequest } from '../../../types';

export class NotificationSettingsService {
  static async getNotificationSettings(userId: string) {
    let settings = await AdminNotificationSettings.findOne({ userId });

    if (!settings) {
      settings = new AdminNotificationSettings({
        userId,
        emailNotifications: false,
        pushNotifications: false,
        smsAlerts: true,
        securityAlerts: true,
        emergencyAlerts: true,
        weeklyReports: true,
      });

      await settings.save();
    }

    return settings;
  }

  static async updateNotifications(userId: string, notificationData: UpdateNotificationsRequest) {
    const settings = await AdminNotificationSettings.findOneAndUpdate(
      { userId },
      notificationData,
      { new: true, upsert: true, runValidators: true }
    );

    return settings;
  }
}

