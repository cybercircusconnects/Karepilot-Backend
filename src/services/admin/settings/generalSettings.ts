import { AdminUser } from '../../../models/admin';
import { AdminGeneralSettings } from '../../../models/admin/settings';
import { UpdateProfileRequest, UpdatePreferencesRequest } from '../../../types/admin/settings/generalSettings';

export class GeneralSettingsService {
  static async getGeneralSettings(userId: string) {
    let settings = await AdminGeneralSettings.findOne({ userId });

    if (!settings) {
      const adminUser = await AdminUser.findById(userId);
      if (!adminUser) {
        throw new Error('Admin user not found');
      }

      const nameParts = adminUser.name.split(' ').filter(part => part.trim());
      const firstName = nameParts[0] || 'Admin';
      const lastName = nameParts.slice(1).join(' ').trim() || 'User';

      settings = new AdminGeneralSettings({
        userId,
        firstName,
        lastName,
        email: adminUser.email,
        profileImage: adminUser.profileImage,
        theme: 'system',
        language: 'English',
        timezone: 'UTC',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '24',
        autoRefresh: true,
        refreshInterval: 30,
      });

      await settings.save();
    }

    return settings;
  }

  static async updateProfile(userId: string, profileData: UpdateProfileRequest) {
    if (profileData.email) {
      const existingUser = await AdminUser.findOne({
        email: profileData.email.toLowerCase(),
        _id: { $ne: userId },
      });

      if (existingUser) {
        throw new Error('Email is already taken by another user');
      }
    }

    const settings = await AdminGeneralSettings.findOneAndUpdate(
      { userId },
      {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email?.toLowerCase(),
        profileImage: profileData.profileImage,
      },
      { new: true, upsert: true, runValidators: true }
    );

    await AdminUser.findByIdAndUpdate(
      userId,
      {
        name: `${profileData.firstName} ${profileData.lastName}`.trim(),
        email: profileData.email?.toLowerCase(),
        profileImage: profileData.profileImage,
      },
      { runValidators: true }
    );

    return settings;
  }

  static async updatePreferences(userId: string, preferencesData: UpdatePreferencesRequest) {
    const settings = await AdminGeneralSettings.findOneAndUpdate(
      { userId },
      preferencesData,
      { new: true, upsert: true, runValidators: true }
    );

    return settings;
  }
}

