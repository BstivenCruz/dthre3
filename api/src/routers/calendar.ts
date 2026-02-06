import { Router } from "express";

import { getCalendarClasses } from "../controllers/calendar";

const CalendarRouter = Router();

CalendarRouter.post("/classes/:userId", getCalendarClasses);

export default CalendarRouter;
