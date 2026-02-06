import { apiInstance } from "@/utils/api";
import type { IDataResponse } from "@/interfaces/dataResponse";
import type { DashboardData } from "../interfaces/dashboard";

export const getDashboardDataByUserId = async (userId: string): Promise<
  IDataResponse<DashboardData>
> => {
  try {
    const { data } = await apiInstance.get(`/dashboard/getDashboardDataByUserId/${userId}`);
    return { success: true, data: data.data, error: null };
  } catch (error) {
    throw error;
  }
};
