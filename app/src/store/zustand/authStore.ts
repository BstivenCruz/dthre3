import { createWithEqualityFn } from "zustand/traditional";
import { User } from "../interfaces/user";
import { LoginCredentials, RegisterCredentials } from "../interfaces/auth";
import { getErrorMessage } from "@/utils/error";
import { decodeJWT } from "@/utils/jwt";

import {
  login,
  register,
  getCurrentUser,
  logout,
} from "../services/auth.Service";

interface AuthStoreState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  checkAuth: () => Promise<void>;
}
export const authStore = createWithEqualityFn<AuthStoreState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (credentials: LoginCredentials) => {
    try {
      set((state) => ({ ...state, isLoading: true, error: null }));
      const response = await login(credentials);
      if (typeof window !== "undefined") {
        localStorage.setItem("auth_token", response.data.token);
      }
      set({
        user: response.data.user.user,
        token: response.data.token,
        isAuthenticated: true,
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
  register: async (credentials: RegisterCredentials) => {
    try {
      set((state) => ({ ...state, isLoading: true, error: null }));
      const response = await register(credentials);
      if (typeof window !== "undefined") {
        localStorage.setItem("auth_token", response.data.token);
      }
      set({
        user: response.data.user.user,
        token: response.data.token,
        isAuthenticated: true,
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
  logout: async () => {
    try {
      set((state) => ({ ...state, isLoading: true, error: null }));
      await logout();
      set({
        user: null,
        token: null,
        isAuthenticated: false,
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
  setUser: (user: User | null) => {
    try {
      set((state) => ({ ...state, user, error: null }));
    } catch (error) {
      set((state) => ({ ...state, user: null, error: getErrorMessage(error) }));
      throw error;
    }
  },

  setToken: (token: string | null) => {
    try {
      set((state) => ({ ...state, token, error: null }));
      if (typeof window !== "undefined" && token) {
        localStorage.setItem("auth_token", token);
      }
    } catch (error) {
      set((state) => ({
        ...state,
        token: null,
        error: getErrorMessage(error),
      }));
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
      }
      throw error;
    }
  },

  checkAuth: async () => {
    try {
      set((state) => ({ ...state, isLoading: true, error: null }));

      let token = get().token;
      if (!token && typeof window !== "undefined") {
        token = localStorage.getItem("auth_token") || "";
      }

      if (!token) {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
        return;
      }

      const decodedToken = decodeJWT(token);
      if (!decodedToken?.userId) {
        throw new Error("Token inválido");
      }

      const { data } = await getCurrentUser(decodedToken.userId);
      set({
        user: data?.user || null,
        token: token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set((state) => ({
        ...state,
        isLoading: false,
        error: getErrorMessage(error),
        isAuthenticated: false,
        user: null,
        token: null,
      }));
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
      }
      throw error;
    }
  },
}));
