import { Router } from "express";

import { getAllClasses , upsert} from "../controllers/classes";



const ClassesRouter = Router();

ClassesRouter.get("/getAllClasses", getAllClasses);
ClassesRouter.post("/upsert", upsert);

export default ClassesRouter;