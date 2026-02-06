import { createWithEqualityFn } from "zustand/traditional";

import { getErrorMessage } from "@/utils/error";

import type {
  AdminClassManagement,
  ClassesData,
  SaveClassRequest,
} from "../interfaces/classes";
import { getAllClasses, upsert } from "../services/classes.Service";

interface ClassesStoreState {
  classesData: ClassesData | null;
  isLoading: boolean;
  error: string | null;
  isUpserting: boolean;
  upsertError: string | null;
  getAllClasses: () => Promise<void>;
  upsert: (payload: SaveClassRequest) => Promise<{ id: string }>;
}

export const classesStore = createWithEqualityFn<ClassesStoreState>((set) => ({
  classesData: null,
  isLoading: false,
  error: null,
  isUpserting: false,
  upsertError: null,

  getAllClasses: async () => {
    try {

      set((state) => ({ ...state, isLoading: true, error: null }));
      const response = await getAllClasses();
      const raw = response.data;

      const normalized: ClassesData = Array.isArray(raw)
        ? { classes: raw as AdminClassManagement[] }
        : (raw as ClassesData);

      set({
        classesData: normalized,
        isLoading: false,
      });
    } catch (error) {
      set((state) => ({
        ...state,
        isLoading: false,
        error: getErrorMessage(error),
      }));

      // #region agent log H2 - store getAllClasses error
      fetch("http://127.0.0.1:7243/ingest/36b1391c-521f-4125-bfdd-006b85888ced", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: "debug-session",
          runId: "pre-fix",
          hypothesisId: "H2",
          location: "classesStore.ts:getAllClasses:error",
          message: "getAllClasses error",
          data: {},
          timestamp: Date.now(),
        }),
      }).catch(() => { });
      // #endregion
      throw error;
    }
  },

  upsert: async (payload: SaveClassRequest) => {
    try {
      set((state) => ({ ...state, isUpserting: true, upsertError: null }));
      const response = await upsert(payload);
      const raw = response.data;

      const normalized: ClassesData = Array.isArray(raw)
        ? { classes: raw as AdminClassManagement[] }
        : (raw as ClassesData);

      set((state) => ({ ...state, isUpserting: false, classesData: normalized }));

      // Si el backend devolvió una lista, intentamos devolver el id de la clase upserted.
      // Fallback: el id del payload (si era update) o string vacío.
      const returnedId =
        payload.id ??
        normalized?.classes?.[0]?.id ??
        "";

      return { id: returnedId };
    } catch (error) {
      set((state) => ({ ...state, isUpserting: false, upsertError: getErrorMessage(error) }));
      throw error;
    }
  },
}));
