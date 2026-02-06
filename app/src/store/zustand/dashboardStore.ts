import { createWithEqualityFn } from "zustand/traditional";

import { getDashboardDataByUserId } from "../services/dashboard.Service";

import type { DashboardData } from "../interfaces/dashboard";

import { getErrorMessage } from "@/utils/error";

interface DashboardStoreState {
  dashboardData: DashboardData | null;
  isLoading: boolean;
  error: string | null;
  getDashboardDataByUserId: (userId: string) => Promise<void>;
}

export const dashboardStore = createWithEqualityFn<DashboardStoreState>(
  (set) => ({
    dashboardData: null,
    isLoading: false,
    error: null,

    getDashboardDataByUserId: async (userId: string) => {
      try {
        set((state) => ({ ...state, isLoading: true, error: null }));
        const response = await getDashboardDataByUserId(userId);
        set({
          dashboardData: response.data,
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
