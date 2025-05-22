import api from "./api";
import { LoginPayload, LoginResponse } from "@/types/login";

/**
 * Kirim data login ke endpoint /auth/login
 */
export const loginUser = async (payload: LoginPayload): Promise<LoginResponse> => {
  try {
    const response = await api.post("/auth/login", payload);
    console.log("Login response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Login gagal:", error);
    throw error;
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await api.post("/auth/logout"); // pastikan endpoint ini menerima POST
  } catch (error) {
    console.error("Logout gagal:", error);
    throw error;
  }
};
