import api from "./api";
import { LoginPayload, LoginResponse } from "@/types/login";

/**
 * Kirim data login ke endpoint /auth/login
 */
export const loginUser = async (payload: LoginPayload): Promise<LoginResponse> => {
    try {
    const response = await fetch('https://tikethebat.ambitiousflower-0b7495d3.southeastasia.azurecontainerapps.io/api/v1/auth/login', {
      method: 'POST', // WAJIB supaya cookie diterima dan disimpan browser
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }

    const data = await response.json();
    return data as LoginResponse;
  } catch (error) {
    console.error('Login gagal:', error);
    throw error;
  }
};


export const logoutUser = async (): Promise<void> => {
  try {
    await api.post("/auth/logout", null, {
      withCredentials: true, // ⬅️ Tambahkan juga di sini
    });
  } catch (error) {
    console.error("Logout gagal:", error);
    throw error;
  }
};
