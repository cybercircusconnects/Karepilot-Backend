import { AdminUser } from "../../../models/admin/user-management";
import { generateToken } from "../../../utils/index";

export class LoginService {
  async loginAdminUser(email: string, password: string, rememberMe: boolean = false) {
    const adminUser = await AdminUser.findOne({ email: email.toLowerCase(), isActive: true }).select("+password");
    if (!adminUser) {
      throw new Error("Invalid email or password");
    }

    const isPasswordValid = await adminUser.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    adminUser.lastLogin = new Date();
    await adminUser.save();

    const token = generateToken((adminUser._id as any).toString(), rememberMe);

    return {
      user: adminUser,
      token,
    };
  }
}

export default new LoginService();

