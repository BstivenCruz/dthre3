import { Router } from "express";

import { getRecordDataByUserId } from "../controllers/record";

const RecordRouter = Router();

RecordRouter.get("/getRecordDataByUserId/:userId", getRecordDataByUserId);

export default RecordRouter;