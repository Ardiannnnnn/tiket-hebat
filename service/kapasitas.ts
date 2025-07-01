import api, { Baseapi } from "./api";
import { ManifestResponse } from "@/types/kapasitas";

interface CreateKapasitasPayload {
  schedule_id: number;
  class_id: number;
  capacity: number;
  price: number;
}

export const getManifest = async (page = 1, limit = 100): Promise<ManifestResponse | null> => {
  try {
    // ✅ Fix: Gunakan backticks (`) bukan single quotes (')
    const response = await api.get(`/quotas?page=${page}&limit=${limit}`);
    
    console.log("📋 API Request:", `/quotas?page=${page}&limit=${limit}`);
    console.log("📊 API Response:", {
      status: response.status,
      dataLength: response.data?.data?.length || 0,
      meta: response.data?.meta
    });
    
    return response.data;
  } catch (error) {
    console.error("❌ Gagal mengambil data kapasitas:", error);
    throw error;
  }
};

// ✅ Alternative using params object (recommended)
export const getManifestWithParams = async (page = 1, limit = 100): Promise<ManifestResponse | null> => {
  try {
    console.log(`🔄 Fetching quotas: page=${page}, limit=${limit}`);
    
    const response = await api.get("/quotas", {
      params: {
        page: page,
        limit: limit
      }
    });
    
    console.log("📋 Request URL:", response.config?.url);
    console.log("📊 Response data length:", response.data?.data?.length || 0);
    console.log("📊 Meta info:", response.data?.meta);
    
    return response.data;
  } catch (error) {
    console.error("❌ Gagal mengambil data kapasitas:", error);
    throw error;
  }
};

// ✅ Single create function
export const createKapasitas = async (payload: CreateKapasitasPayload): Promise<boolean> => {
  try {
    console.log("📤 Creating kapasitas with payload:", payload);
    
    const response = await Baseapi.post("/quota/create", payload);
    
    console.log("✅ Create kapasitas response:", response.data);
    
    if (response.data?.status === true || 
        response.data?.success === true ||
        response.status === 200 || 
        response.status === 201) {
      return true;
    }
    
    return false;
  } catch (error: any) {
    console.error("❌ Error creating kapasitas:", error);
    return false;
  }
};

// ✅ Delete function - Fix endpoint
export const deleteManifest = async (id: number): Promise<boolean> => {
  try {
    console.log(`🗑️ Deleting quota with ID: ${id}`);
    
    // ✅ Fix: Use correct endpoint for quotas
    const response = await api.delete(`/quotas/${id}`);
    
    console.log("✅ Delete response:", response.data);
    return true;
  } catch (error) {
    console.error("❌ Gagal menghapus quota:", error);
    return false;
  }
};

// ✅ Bulk create function
export const createBulkKapasitas = async (payload: CreateKapasitasPayload[]): Promise<boolean> => {
  try {
    console.log("📤 Creating bulk kapasitas with payload:", payload);
    console.log("📊 Payload count:", payload.length);
    
    // Log each item untuk debugging
    payload.forEach((item, index) => {
      console.log(`📋 Item ${index + 1}:`, {
        schedule_id: item.schedule_id,
        class_id: item.class_id,
        capacity: item.capacity,
        price: item.price
      });
    });
    
    // ✅ Try bulk endpoint first
    try {
      const response = await Baseapi.post("/quota/create/bulk", payload);
      
      console.log("✅ Bulk create kapasitas response:", response.data);
      
      if (response.data?.status === true || 
          response.data?.success === true ||
          response.status === 200 || 
          response.status === 201) {
        return true;
      }
      
      console.warn("⚠️ Unexpected bulk response structure:", response.data);
      return false;
    } catch (bulkError: any) {
      console.warn("⚠️ Bulk endpoint failed, trying individual creates:", bulkError.message);
      
      // ✅ Fallback to individual creates
      return await createMultipleKapasitas(payload);
    }
  } catch (error: any) {
    console.error("❌ Error creating bulk kapasitas:", error);
    
    if (error.response?.data) {
      console.error("❌ Error response data:", error.response.data);
      console.error("❌ Error status:", error.response.status);
    }
    
    return false;
  }
};

// ✅ Individual create approach (fallback)
export const createMultipleKapasitas = async (payload: CreateKapasitasPayload[]): Promise<boolean> => {
  try {
    console.log("📤 Creating multiple kapasitas individually:", payload.length, "items");
    
    const results = await Promise.all(
      payload.map(async (item, index) => {
        try {
          console.log(`📋 Creating item ${index + 1}/${payload.length}:`, item);
          
          // Add delay between requests to avoid rate limiting
          if (index > 0) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
          
          const success = await createKapasitas(item);
          console.log(`${success ? "✅" : "❌"} Item ${index + 1} result:`, success);
          return success;
        } catch (error) {
          console.error(`❌ Error creating item ${index + 1}:`, error);
          return false;
        }
      })
    );
    
    const successCount = results.filter(Boolean).length;
    const failCount = results.length - successCount;
    
    console.log(`📊 Individual create results: ${successCount} success, ${failCount} failed`);
    
    // Return true jika minimal 80% berhasil
    return failCount === 0 || (successCount / results.length) >= 0.8;
  } catch (error) {
    console.error("❌ Error in multiple create:", error);
    return false;
  }
};

// ✅ Get single quota by ID
export const getQuotaById = async (id: number): Promise<any> => {
  try {
    console.log(`🔍 Fetching quota by ID: ${id}`);
    
    const response = await api.get(`/quotas/${id}`);
    
    console.log("✅ Quota detail:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching quota by ID:", error);
    throw error;
  }
};

// ✅ Update quota
export const updateQuota = async (id: number, payload: CreateKapasitasPayload): Promise<boolean> => {
  try {
    console.log(`📝 Updating quota ${id} with payload:`, payload);
    
    const response = await Baseapi.put(`/quota/${id}`, payload);
    
    console.log("✅ Update quota response:", response.data);
    
    if (response.data?.status === true || 
        response.data?.success === true ||
        response.status === 200) {
      return true;
    }
    
    return false;
  } catch (error: any) {
    console.error("❌ Error updating quota:", error);
    return false;
  }
};