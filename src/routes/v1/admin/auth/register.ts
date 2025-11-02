import { Router } from "express";
import { registerAdminUser } from "../../../../controllers/admin/auth";
import { adminUserRegistrationSchema } from "../../../../validations/admin/auth";
import { validate } from "../../../../utils";

const registerRouter = Router();

registerRouter.post("/", validate(adminUserRegistrationSchema), registerAdminUser);

export default registerRouter;

