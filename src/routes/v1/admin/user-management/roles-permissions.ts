import { Router } from "express";
import {
  getAllRolesPermissions,
  getRolePermissionsById,
  createRolePermissions,
  updateRolePermissions,
  deleteRolePermissions,
} from "../../../../controllers/admin/user-management";
import { authenticateAdmin } from "../../../../middlewares/auth";
import {
  createRolePermissionsSchema,
  updateRolePermissionsSchema,
  rolePermissionsIdParamSchema,
} from "../../../../validations/admin/user-management";
import { validate } from "../../../../utils";

const rolesPermissionsRouter = Router();

rolesPermissionsRouter.use(authenticateAdmin);

rolesPermissionsRouter.get("/", getAllRolesPermissions);

rolesPermissionsRouter.get(
  "/:id",
  validate(rolePermissionsIdParamSchema, "params"),
  getRolePermissionsById
);

rolesPermissionsRouter.post(
  "/",
  validate(createRolePermissionsSchema),
  createRolePermissions
);

rolesPermissionsRouter.put(
  "/:id",
  validate(rolePermissionsIdParamSchema, "params"),
  validate(updateRolePermissionsSchema),
  updateRolePermissions
);

rolesPermissionsRouter.delete(
  "/:id",
  validate(rolePermissionsIdParamSchema, "params"),
  deleteRolePermissions
);

export default rolesPermissionsRouter;

