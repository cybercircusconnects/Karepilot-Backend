import { Request, Response } from "express";
import loginService from "../../../services/admin/auth/login";

export const loginAdminUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, rememberMe = false } = req.body;

    const result = await loginService.loginAdminUser(email, password, rememberMe);

    res.status(200).json({
      success: true,
      message: "Admin user logged in successfully",
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
          lastLogin: result.user.lastLogin,
        },
        token: result.token,
      },
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error.message || "Invalid credentials",
    });
  }
};

