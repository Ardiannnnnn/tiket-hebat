// service/quota.ts
import api from "./api";
import { ClassAvailability } from "@/types/classAvailability";
import { AxiosResponse } from "axios";

// ✅ Update interface sesuai struktur API yang benar
export interface QuotaApiResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    ship: {
      id: number;
      ship_name: string;
    };
    departure_harbor: {
      id: number;
      harbor_name: string;
    };
    arrival_harbor: {
      id: number;
      harbor_name: string;
    };
    departure_datetime: string;
    arrival_datetime: string;
    status: string;
    quotas: {
      id: number;
      class: {
        id: number;
        class_name: string;
        type: string;
      };
      quota: number;
      price: number;
    }[];
    created_at: string;
    updated_at: string;
  };
}

export const getQuotaByScheduleId = async (
  scheduleId: string | number
): Promise<ClassAvailability[]> => {
  try {
    console.log(`🔍 Fetching quota for schedule ID: ${scheduleId}`);
    
    const res: AxiosResponse<QuotaApiResponse> = await api.get(`/schedule/${scheduleId}`);
    
    console.log("📊 Raw API Response:", res.data);
    
    if (!res.data.status || !res.data.data) {
      console.error("❌ API response status false or no data");
      return [];
    }

    const schedule = res.data.data;
    
    if (!schedule.quotas || schedule.quotas.length === 0) {
      console.warn("⚠️ No quotas found in schedule");
      return [];
    }

    // ✅ Transform quotas ke format ClassAvailability
    const classAvailability: ClassAvailability[] = schedule.quotas.map((quota) => ({
      class_id: quota.class.id,
      class_name: quota.class.class_name,
      type: quota.class.type as "passenger" | "vehicle",
      quota: quota.quota,
      available_capacity: quota.quota, // Asumsi available = quota (bisa disesuaikan)
      price: quota.price,
      currency: "IDR" // Default currency
    }));

    console.log("✅ Transformed class availability:", classAvailability);
    
    return classAvailability;
    
  } catch (error) {
    console.error("❌ Error fetching quota:", error);
    throw error; // Rethrow untuk penanganan lebih lanjut
  }
};