import { Request, Response } from 'express';
import { SecuritySettingsService } from '../../../services/admin/settings';

export const getSecuritySettings = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const settings = await SecuritySettingsService.getSecuritySettings(userId);

    return res.status(200).json({
      success: true,
      message: 'Security settings retrieved successfully',
      data: settings
    });
  } catch (error: any) {
    console.error('Get security settings error:', error);
    return res.status(500).json({
    success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

export const updateSecuritySettings = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const settings = await SecuritySettingsService.updateSecuritySettings(userId, req.body);

    return res.status(200).json({
      success: true,
      message: 'Security settings updated successfully',
      data: settings
    });
  } catch (error: any) {
    console.error('Update security settings error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    await SecuritySettingsService.changePassword(userId, req.body);

    return res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error: any) {
    console.error('Change password error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};
