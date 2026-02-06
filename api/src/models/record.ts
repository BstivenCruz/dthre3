import pool from "../utils/database";

import createLogger from "../utils/logger";

import { RecordData } from "../interfaces/record";

import { _getRecordDataByUserId } from "../queries/record";

const getRecordDataByUserId = async (
  userId: string
): Promise<RecordData[] | null> => {
  try {
    createLogger.info({
        model: "Record",
      method: "getRecordDataByUserId",
      userId: userId,
    });
    const resultgetRecordDataByUserId = await pool.query(
      _getRecordDataByUserId,
      [userId]
    );
    return resultgetRecordDataByUserId.rowCount &&
      resultgetRecordDataByUserId.rowCount > 0
      ? resultgetRecordDataByUserId.rows[0]
          .record_data_get_by_user_id || []
      : null;
  } catch (error) {
    createLogger.error({
      model: "Record",
      method: "getRecordDataByUserId",
      userId: userId,
      error: error,
    });
    throw error;
  }
};

export { getRecordDataByUserId };
