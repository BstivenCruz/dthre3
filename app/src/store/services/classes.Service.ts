import { apiInstance } from "@/utils/api";
import type { IDataResponse } from "@/interfaces/dataResponse";
import type { SaveClassRequest } from "../interfaces/classes";



export const getAllClasses = async (): Promise<IDataResponse> => {
  try {
    const { data } = await apiInstance.get(`/classes/getAllClasses`);
    return { success: true, data: data.data, error: null };
  } catch (error) {
    throw error;
  }
};

export const upsert = async (payload: SaveClassRequest): Promise<IDataResponse> => {
  try {
    const { data } = await apiInstance.post(`/classes/upsert`, payload);
    return { success: true, data: data.data, error: null };
  } catch (error) {
    throw error;
  }
};