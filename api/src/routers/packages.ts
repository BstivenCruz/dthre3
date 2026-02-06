import { Router } from "express";

import { getPackagesByUserId } from "../controllers/packages";

const PackagesRouter = Router();

PackagesRouter.get("/getPackagesByUserId/:userId", getPackagesByUserId);

export default PackagesRouter;
