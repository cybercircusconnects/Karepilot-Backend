import { Router } from "express";
import {
  registerMobileUser,
  verifyEmail,
  resendVerificationCode,
  loginMobileUser,
  guestLogin,
  getMobileProfile,
  updateMobileProfile,
  changeMobilePassword,
  getUserSettings,
  updateUserSettings,
  requestPasswordReset,
  verifyPasswordResetCode,
  resetPassword,
} from "../../../controllers/mobile/mobileUser";
import { authenticateMobile, authenticatePasswordReset } from "../../../middlewares/auth";
import {
  mobileUserRegistrationSchema,
  mobileUserLoginSchema,
  mobileUserUpdateSchema,
  mobilePasswordChangeSchema,
  emailVerificationSchema,
  userSettingsSchema,
  passwordResetRequestSchema,
  passwordResetVerifySchema,
  passwordResetSchema,
} from "../../../validations/mobile/mobileUser";
import { validate } from "../../../utils";

const mobileRouter = Router();

mobileRouter.post("/register", validate(mobileUserRegistrationSchema), registerMobileUser);

mobileRouter.post("/verify-email", validate(emailVerificationSchema), verifyEmail);

mobileRouter.post("/login", validate(mobileUserLoginSchema), loginMobileUser);

mobileRouter.post("/guest/login", guestLogin);

mobileRouter.post(
  "/forgot-password",
  validate(passwordResetRequestSchema),
  requestPasswordReset,
);

mobileRouter.post(
  "/verify-reset-code",
  validate(passwordResetVerifySchema),
  verifyPasswordResetCode,
);

mobileRouter.post(
  "/reset-password",
  authenticatePasswordReset,
  validate(passwordResetSchema),
  resetPassword,
);

mobileRouter.use(authenticateMobile);

mobileRouter.get("/resend-verification", resendVerificationCode);

mobileRouter.get("/profile", getMobileProfile);

mobileRouter.patch("/profile", validate(mobileUserUpdateSchema), updateMobileProfile);

mobileRouter.put("/change-password", validate(mobilePasswordChangeSchema), changeMobilePassword);

mobileRouter.get("/settings", getUserSettings);

mobileRouter.patch("/settings", validate(userSettingsSchema), updateUserSettings);

export default mobileRouter;
