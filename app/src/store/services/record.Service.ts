import { apiInstance } from "@/utils/api";
import type { IDataResponse } from "@/interfaces/dataResponse";
import type { RecordData } from "../interfaces/record";

export const getRecordDataByUserId = async (
  userId: string
): Promise<IDataResponse<RecordData>> => {
  try {
    const { data } = await apiInstance.get(
      `/record/getRecordDataByUserId/${userId}`
    );
    return { success: true, data: data.data, error: null };
  } catch (error) {
    throw error;
  }
};
