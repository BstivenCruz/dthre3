import pool from "../utils/database";

import createLogger from "../utils/logger";

import { _getDashboardDataByUserId } from "../queries/dashboard";
import { DashboardData } from "../interfaces/dashboard";

const getDashboardDataByUserId = async (userId: string): Promise<DashboardData | null> => {
  try {
    createLogger.info({
      model: "Dashboard",
      method: "getDashboardDataByUserId",
      userId: userId,
    });
    const resultgetDashboardDataByUserId = await pool.query(_getDashboardDataByUserId, [userId]);
    return resultgetDashboardDataByUserId.rowCount && resultgetDashboardDataByUserId.rowCount > 0
      ? resultgetDashboardDataByUserId.rows[0].dashboard_get_by_user_id || []
      : null;
  } catch (error) {
    createLogger.error({
      model: "Dashboard",
      method: "getDashboardDataByUserId",
      userId: userId,
      error: error,
    });
    throw error;
  }
};

export { getDashboardDataByUserId };
