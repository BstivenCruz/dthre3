import { createWithEqualityFn } from "zustand/traditional";
import { getErrorMessage } from "@/utils/error";
import { getRecordDataByUserId } from "../services/record.Service";
import type { RecordData } from "../interfaces/record";

interface RecordStoreState {
  recordData: RecordData | null;
  isLoading: boolean;
  error: string | null;
  getRecordDataByUserId: (userId: string) => Promise<void>;
}

export const recordStore = createWithEqualityFn<RecordStoreState>(
  (set, get) => ({
    recordData: null,
    isLoading: false,
    error: null,

    getRecordDataByUserId: async (userId: string) => {
      try {
        set((state) => ({ ...state, isLoading: true, error: null }));
        const response = await getRecordDataByUserId(userId);
        set({
          recordData: response.data,
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
