import api, {Baseapi} from "./api";
import { LoginPayload, LoginResponse } from "@/types/login";


export const loginUser = async (
  payload: LoginPayload
): Promise<LoginResponse> => {
  try {
    const response = await Baseapi.post("/v1/auth/login", payload); // diproxy ke backend
    const data = response.data;
    return data;
  } catch (error: any) {
    console.error("❌ Gagal login:", error?.response?.data || error.message);
    throw new Error(
      error?.response?.data?.message || "Login gagal, silakan coba lagi."
    );
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await Baseapi.post("/v1/auth/logout");// Hapus token dari cookie
    console.log("✅ Berhasil logout dan token dihapus");
  } catch (error: any) {
    console.error("❌ Gagal logout:", error?.response?.data || error.message);
    throw new Error(
      error?.response?.data?.message || "Logout gagal, silakan coba lagi."
    );
  }
};

