import { Router } from "express";
import adminRouter from "./admin/admin";
import mobileRouter from "./mobile/user";
import uploadRouter from "./common/upload";

const mainRouter = Router();

const defaultRoutes = [
  {
    path: "/users/admin",
    route: adminRouter,
  },
  {
    path: "/users/mobile",
    route: mobileRouter,
  },
  {
    path: "/upload",
    route: uploadRouter,
  },
];

defaultRoutes.forEach((route) => {
  mainRouter.use(route.path, route.route);
});

export default mainRouter;
