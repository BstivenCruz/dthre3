import pool from "../utils/database";

import createLogger from "../utils/logger";

import { PackagesData } from "../interfaces/packages";

import { _getPackagesByUserId } from "../queries/packages";

const getPackagesByUserId = async (
  userId: string
): Promise<PackagesData[] | null> => {
  try {
    createLogger.info({
      model: "Packages",
      method: "getPackagesByUserId",
      userId: userId,
    });
    const resultgetPackagesByUserId = await pool.query(_getPackagesByUserId, [
      userId,
    ]);
    return resultgetPackagesByUserId.rowCount &&
      resultgetPackagesByUserId.rowCount > 0
      ? resultgetPackagesByUserId.rows[0].packages_get_by_user_id || []
      : null;
  } catch (error) {
    createLogger.error({
      model: "Packages",
      method: "getPackagesByUserId",
      userId: userId,
      error: error,
    });
    throw error;
  }
};

export { getPackagesByUserId };
