import pool from "../utils/database";

import { _getAll, _getByEmail, _upsert, _getById } from "../queries/user";

import { User, UserResponse } from "../interfaces/user";
import createLogger from "../utils/logger";

const getAll = async (): Promise<User[]> => {
  const resultUsers = await pool.query(_getAll);
  return resultUsers.rows;
};

const getByEmail = async (email: string): Promise<UserResponse | null> => {
  try {
    createLogger.info({
      model: "User",
      method: "getByEmail",
      email: email,
    });
    const resultgetByEmail = await pool.query(_getByEmail, [email]);
    return resultgetByEmail.rowCount && resultgetByEmail.rowCount > 0
      ? resultgetByEmail.rows[0].user_get_by_email || []
      : null;
  } catch (error) {
    createLogger.error({
      model: "User",
      method: "getByEmail",
      email: email,
      error: error,
    });
    throw error;
  }
};

const upsert = async (data: string): Promise<UserResponse | null> => {
  try {
    createLogger.info({
      model: "User",
      method: "upsert",
      data: data,
    });

    const resultUpsert = await pool.query(_upsert, [data]);
    return resultUpsert.rowCount && resultUpsert.rowCount > 0
      ? resultUpsert.rows[0].user_upsert || []
      : null;
  } catch (error) {
    createLogger.error({
      model: "User",
      method: "upsert",
      data: data,
      error: error,
    });
    throw error;
  }
};

const getById = async (id: string): Promise<UserResponse | null> => {
  try {
    createLogger.info({
      model: "User",
      method: "getById",
      id: id,
    });
    const resultgetById = await pool.query(_getById, [id]);
    return resultgetById.rowCount && resultgetById.rowCount > 0
      ? resultgetById.rows[0].user_get_by_id || []
      : null;
  } catch (error) {
    createLogger.error({
      model: "User",
      method: "getById",
      id: id,
      error: error,
    });
    throw error;
  }
};

export { getAll, getByEmail, upsert, getById };
