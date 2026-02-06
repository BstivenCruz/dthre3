import pool from "../utils/database";

import { _getByUserId } from "../queries/student";
import createLogger from "../utils/logger";
import { StudentProfile } from "../interfaces/student";

const getByUserId = async (userId: string): Promise<StudentProfile | null> => {
  try {
    createLogger.info({
      model: "Student",
      method: "getByUserId",
      userId: userId,
    });
    const resultgetByUserId = await pool.query(_getByUserId, [userId]);
    return resultgetByUserId.rowCount && resultgetByUserId.rowCount > 0
      ? resultgetByUserId.rows[0].student_profiles_get_by_user_id || []
      : null;
  } catch (error) {
    createLogger.error({
      model: "Student",
      method: "getByUserId",
      userId: userId,
      error: error,
    });
    throw error;
  }
};

export { getByUserId };
