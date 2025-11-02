import { AdminUser } from '../../../models/admin';
import { AdminSecuritySettings } from '../../../models/admin/settings';
import { AdminPasswordChange, UpdateSecurityRequest } from '../../../types';


export class SecuritySettingsService {
  static async getSecuritySettings(userId: string) {
    let settings = await AdminSecuritySettings.findOne({ userId });

    if (!settings) {
      settings = new AdminSecuritySettings({
        userId,
        twoFactorEnabled: false,
        sessionTimeout: 30,
        maxLoginAttempts: 5,
        passwordExpiry: 90,
        auditLogs: true,
      });

      await settings.save();
    }

    return settings;
  }

  static async updateSecuritySettings(userId: string, securityData: UpdateSecurityRequest) {
    const settings = await AdminSecuritySettings.findOneAndUpdate(
      { userId },
      securityData,
      { new: true, upsert: true, runValidators: true }
    );

    return settings;
  }

  static async changePassword(userId: string, passwordData: AdminPasswordChange) {
    const user = await AdminUser.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const isCurrentPasswordValid = await user.comparePassword(passwordData.currentPassword);
    if (!isCurrentPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    user.password = passwordData.newPassword;
    await user.save();

    return { success: true };
  }
}

