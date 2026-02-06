import { apiInstance } from "@/utils/api";

import { LoginCredentials, RegisterCredentials } from "../interfaces/auth";

import type { IDataResponse } from "@/interfaces/dataResponse";

export const login = async (
  credentials: LoginCredentials
): Promise<IDataResponse> => {
  try {
    const { data } = await apiInstance.post(`/auth/login`, credentials);
    return { success: true, data: data.data, error: null };
  } catch (error) {
    throw error;
  }
};

export const register = async (
  credentials: RegisterCredentials
): Promise<IDataResponse> => {
  try {
    const { data } = await apiInstance.post(`/auth/register`, credentials);
    return { success: true, data: data.data, error: null };
  } catch (error) {
    throw error;
  }
};

export const getCurrentUser = async (
  userId: string
): Promise<IDataResponse> => {
  try {
    const { data } = await apiInstance.post(`/auth/getMe/${userId}`);
    return { success: true, data: data.data, error: null };
  } catch (error) {
    throw error;
  }
};

export const logout = async (): Promise<IDataResponse> => {
  try {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
    }
    return { success: true, data: null, error: null };
  } catch (error) {
    throw error;
  }
};
