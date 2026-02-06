import pool from "../utils/database";

import createLogger from "../utils/logger";

import { CalendarData } from "../interfaces/calendar";

import { _getCalendarClassesByUserId } from "../queries/calendar";

const getCalendarClassesByUserId = async (
  userId: string
): Promise<CalendarData[] | null> => {
  try {
    createLogger.info({
      model: "Calendar",
      method: "getCalendarClassesByUserId",
      userId: userId,
    });
    const resultgetCalendarClassesByUserId = await pool.query(
      _getCalendarClassesByUserId,
      [userId]
    );
    return resultgetCalendarClassesByUserId.rowCount &&
      resultgetCalendarClassesByUserId.rowCount > 0
      ? resultgetCalendarClassesByUserId.rows[0]
          .calendar_classes_get_by_user_id || []
      : null;
  } catch (error) {
    createLogger.error({
      model: "Calendar",
      method: "getCalendarClassesByUserId",
      userId: userId,
      error: error,
    });
    throw error;
  }
};

export { getCalendarClassesByUserId };
