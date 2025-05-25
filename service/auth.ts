import { headers } from "next/headers";
import api from "./api";
import { LoginPayload, LoginResponse } from "@/types/login";

/**
 * Kirim data login ke endpoint /auth/login
 */
 // lib/api.ts
export const loginUser = async (payload: LoginPayload): Promise<LoginResponse> => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // WAJIB agar browser simpan cookie
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Login failed');
  }

  return response.json();
};



export const logoutUser = async (): Promise<void> => {
  try {
    await api.post("/auth/logout", null, {
       // ⬅️ Tambahkan juga di sini
    });
  } catch (error) {
    console.error("Logout gagal:", error);
    throw error;
  }
};
