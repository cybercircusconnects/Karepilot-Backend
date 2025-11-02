import { Router } from "express";
import usersRouter from "./users";
import rolesPermissionsRouter from "./roles-permissions";
import departmentsRouter from "./departments";

const userManagementRouter = Router();

userManagementRouter.use("/users", usersRouter);

userManagementRouter.use("/roles-permissions", rolesPermissionsRouter);

userManagementRouter.use("/departments", departmentsRouter);

export default userManagementRouter;

