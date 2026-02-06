import { Router } from "express";

import { getDashboardDataByUserId } from "../controllers/dashboard";

const DashboardRouter = Router();

DashboardRouter.get("/getDashboardDataByUserId/:userId", getDashboardDataByUserId);

export default DashboardRouter;
