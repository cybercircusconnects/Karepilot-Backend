import { Router } from "express";
import { loginAdminUser } from "../../../../controllers/admin/auth";
import { adminUserLoginSchema } from "../../../../validations/admin/auth";
import { validate } from "../../../../utils";

const loginRouter = Router();

loginRouter.post("/", validate(adminUserLoginSchema), loginAdminUser);

export default loginRouter;

