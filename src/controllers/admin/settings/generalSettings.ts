import { Request, Response } from 'express';
import { GeneralSettingsService } from '../../../services/admin/settings';

export const getGeneralSettings = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const settings = await GeneralSettingsService.getGeneralSettings(userId);

    return res.status(200).json({
      success: true,
      message: 'General settings retrieved successfully',
      data: settings
    });
  } catch (error: any) {
    console.error('Get general settings error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

export const updateProfileSettings = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const settings = await GeneralSettingsService.updateProfile(userId, req.body);

    return res.status(200).json({
      success: true,
      message: 'Profile settings updated successfully',
      data: settings
    });
  } catch (error: any) {
    console.error('Update profile settings error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};

export const updateUserPreferences = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const settings = await GeneralSettingsService.updatePreferences(userId, req.body);

    return res.status(200).json({
      success: true,
      message: 'User preferences updated successfully',
      data: settings
    });
  } catch (error: any) {
    console.error('Update user preferences error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};
