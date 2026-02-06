import { createWithEqualityFn } from "zustand/traditional";

import { getAdminStats } from "../services/admin.Service";

import type { AdminDashboardData } from "../interfaces/admin";

import { getErrorMessage } from "@/utils/error";

interface AdminStoreState {
  adminDashboardData: AdminDashboardData | null;
  isLoading: boolean;
  error: string | null;
  getAdminStats: () => Promise<void>;
}

export const adminStore = createWithEqualityFn<AdminStoreState>(
  (set) => ({
    adminDashboardData: null,
    isLoading: false,
    error: null,

    getAdminStats: async () => {
      try {
        set((state) => ({ ...state, isLoading: true, error: null }));
        const response = await getAdminStats();
        set({
          adminDashboardData: response.data,
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
