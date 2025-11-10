"use strict";

import { Router } from "express";
import pointOfInterestRouter from "./poi";

const pointsOfInterestRouter = Router();

pointsOfInterestRouter.use("/", pointOfInterestRouter);

export default pointsOfInterestRouter;

