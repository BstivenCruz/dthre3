export const _getAll = "SELECT * FROM users";

export const _getByEmail = "SELECT user_get_by_email($1);";

export const _upsert = "SELECT user_upsert($1)";

export const _getById = "SELECT user_get_by_id($1)";
