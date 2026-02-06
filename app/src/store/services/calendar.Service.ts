import { apiInstance } from "@/utils/api";
import type { IDataResponse } from "@/interfaces/dataResponse";
import type { CalendarData } from "../interfaces/calendar";

export const getCalendarClassesByUserId = async (userId: string): Promise<
  IDataResponse<CalendarData>
> => {
  try {
    const { data } = await apiInstance.post(`/calendar/classes/${userId}`);
    return { success: true, data: data.data, error: null };
  } catch (error) {
    throw error;
  }
};
