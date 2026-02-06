import { createWithEqualityFn } from "zustand/traditional";
import { getErrorMessage } from "@/utils/error";
import { getPackagesByUserId } from "../services/packages.Service";

import type { PackagesData } from "../interfaces/packages";

interface PackagesStoreState {
  packages: PackagesData | null;
  isLoading: boolean;
  error: string | null;
  getPackagesByUserId: (userId: string) => Promise<void>;
}

export const packagesStore = createWithEqualityFn<PackagesStoreState>(
  (set, get) => ({
    packages: null,
    isLoading: false,
    error: null,

    getPackagesByUserId: async (userId: string) => {
      try {
        set((state) => ({ ...state, isLoading: true, error: null }));
        const response = await getPackagesByUserId(userId);
        set({
          packages: response.data,
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
