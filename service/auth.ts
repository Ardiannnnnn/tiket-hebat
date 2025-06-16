import { api, Baseapi } from "./api";
import { LoginPayload, LoginResponse } from "@/types/login";
import type { MeResponse } from "@/types/me"; // Sesuaikan tipe jika sudah dibuat

export const loginUser = async (payload: LoginPayload): Promise<LoginResponse> => {
  try {
    const response = await Baseapi.post("/auth/login", payload, {
      withCredentials: true, // pastikan cookie dikirim & diterima
    });
    return response.data;
  } catch (error: any) {
    console.error("❌ Login failed:", error?.response?.data || error.message);
    throw new Error(error?.response?.data?.message || "Login failed, please try again.");
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await Baseapi.post("/auth/logout", {}, { withCredentials: true });
    console.log("✅ Berhasil logout dan token dihapus");
  } catch (error: any) {
    console.error("❌ Gagal logout:", error?.response?.data || error.message);
    throw new Error(error?.response?.data?.message || "Logout gagal, silakan coba lagi.");
  }
};

// ✅ Fungsi baru: Ambil data user dari endpoint /me
export const getCurrentUser = async (): Promise<MeResponse> => {
  try {
    const response = await Baseapi.get("auth/me", {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    console.error("❌ Gagal ambil data user:", error?.response?.data || error.message);
    throw new Error(error?.response?.data?.message || "Gagal mengambil data user.");
  }
};
