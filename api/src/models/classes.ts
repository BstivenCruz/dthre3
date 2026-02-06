import pool from "../utils/database";

import createLogger from "../utils/logger";

import { _getAllClasses, _upsert } from "../queries/classes";
import { ClassesData } from "../interfaces/classes";

const getAllClasses = async (
): Promise<ClassesData[] | null> => {
    try {
        createLogger.info({
            model: "Classes",
            method: "getAllClasses",
        });
        const resultgetAllClasses = await pool.query(_getAllClasses
        );


        return resultgetAllClasses.rowCount &&
            resultgetAllClasses.rowCount > 0
            ? resultgetAllClasses.rows[0]
                .classes_get_all || []
            : null;
    } catch (error) {
        createLogger.error({
            model: "Classes",
            method: "getAllClasses",
            error: error,
        });
        throw error;
    }
};


const upsert = async (
    data: string
): Promise<ClassesData[] | null> => {
    try {
        createLogger.info({
            model: "Classes",
            method: "upsert",
            data: data,
        });
        const resultupsert = await pool.query(_upsert, [data]
        );

        return resultupsert.rowCount &&
            resultupsert.rowCount > 0
            ? resultupsert.rows[0]
                .class_upsert || []
            : null;
    } catch (error) {
        createLogger.error({
            model: "Classes",
            method: "upsert",
            error: error,
        });
        throw error;
    }
};
export { getAllClasses, upsert };