import { Request, Response } from "express";
import registerService from "../../../services/admin/auth/register";

export const registerAdminUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await registerService.createAdminUser(req.body);

    res.status(201).json({
      success: true,
      message: "Admin user created successfully",
      data: {
        user: {
          id: result.user._id,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          email: result.user.email,
          role: result.user.role,
          department: result.user.department,
          phoneNumber: result.user.phoneNumber,
          badgeNumber: result.user.badgeNumber,
          shift: result.user.shift,
          isActive: result.user.isActive,
        },
        token: result.token,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Error creating admin user",
    });
  }
};

