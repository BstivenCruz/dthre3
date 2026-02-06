import { apiInstance } from "@/utils/api";
import type { IDataResponse } from "@/interfaces/dataResponse";
import type { PackagesData } from "../interfaces/packages";

export const getPackagesByUserId = async (
  userId: string
): Promise<IDataResponse<PackagesData>> => {
  try {
    const { data } = await apiInstance.get(
      `/packages/getPackagesByUserId/${userId}`
    );
    return { success: true, data: data.data, error: null };
  } catch (error) {
    throw error;
  }
};
