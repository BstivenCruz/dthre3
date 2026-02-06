import { createWithEqualityFn } from "zustand/traditional";
import { getErrorMessage } from "@/utils/error";
import type { CalendarData } from "../interfaces/calendar";
import { getCalendarClassesByUserId } from "../services/calendar.Service";

interface CalendarStoreState {
  calendarData: CalendarData | null;
  isLoading: boolean;
  error: string | null;
  getCalendarClassesByUserId: (userId: string) => Promise<void>;
}

export const calendarStore = createWithEqualityFn<CalendarStoreState>(
  (set) => ({
    calendarData: null,
    isLoading: false,
    error: null,

    getCalendarClassesByUserId: async (userId: string) => {
      try {
        set((state) => ({ ...state, isLoading: true, error: null }));
        const response = await getCalendarClassesByUserId(userId);
        set({
          calendarData: response.data,
          isLoading: false,
        });
      } catch (error) {
        set((state) => ({
          ...state,
          isLoading: false,
          error: getErrorMessage(error),
        }));
        throw error;
      }
    },
  })
);
