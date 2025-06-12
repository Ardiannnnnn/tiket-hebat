import { api , Baseapi } from "./api";
import { LoginPayload, LoginResponse } from "@/types/login";

export const loginUser = async (payload: LoginPayload): Promise<LoginResponse> => {
  try {
    const response = await Baseapi.post("/auth/login", payload);
    return response.data;
  } catch (error: any) {
    console.error("❌ Login failed:", error?.response?.data || error.message);
    throw new Error(error?.response?.data?.message || "Login failed, please try again.");
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await Baseapi.post("/auth/logout");// Hapus token dari cookie
    console.log("✅ Berhasil logout dan token dihapus");
  } catch (error: any) {
    console.error("❌ Gagal logout:", error?.response?.data || error.message);
    throw new Error(
      error?.response?.data?.message || "Logout gagal, silakan coba lagi."
    );
  }
};

