import api from "./api";
import { LockTicketPayload } from "@/types/lock";
import { SessionResponse } from "@/types/session";


interface SessionRequestOptions {
  signal?: AbortSignal;
  timeout?: number;
}

export const lockTickets = async (payload: LockTicketPayload) => {
  try {
    const response = await api.post("/claim/lock", payload);
    console.log("Lock response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to lock tickets:", error);
    throw error;
  }
};

export const getSessionById = async (
  sessionId: string,
  options?: SessionRequestOptions
): Promise<SessionResponse | null> => {
  try {
    // ✅ Build request config
    const config: any = {
      timeout: options?.timeout || 8000, // 8 second default timeout
    };

    // ✅ Add abort signal if provided
    if (options?.signal) {
      config.signal = options.signal;
    }

    console.log("🔍 Fetching session with config:", {
      sessionId,
      timeout: config.timeout,
      hasSignal: !!config.signal,
    });

    const response = await api.get<SessionResponse>(
      `/claim/session/${sessionId}`,
      config
    );

    console.log("✅ Session fetch successful:", {
      sessionId,
      hasData: !!response.data,
      expiresAt: response.data?.data?.expires_at,
    });

    return response.data;
  } catch (error: any) {
    // ✅ Enhanced error logging
    console.error("❌ Error fetching session:", {
      sessionId,
      error: error.message,
      status: error.response?.status,
      isAborted: error.name === "AbortError" || error.code === "ECONNABORTED",
      isTimeout:
        error.code === "ECONNABORTED" || error.message?.includes("timeout"),
    });

    // ✅ Don't return null for certain errors - let them bubble up
    if (
      error.response?.status === 404 ||
      error.response?.status === 410 ||
      error.response?.status === 422
    ) {
      // These are session-related errors that should be handled by caller
      throw error;
    }

    // ✅ For network errors, also throw to let caller handle
    if (
      error.name === "AbortError" ||
      error.code === "ECONNABORTED" ||
      error.message?.includes("network")
    ) {
      throw error;
    }

    // ✅ For other errors, return null to maintain backward compatibility
    return null;
  }
};

// ✅ Add convenience method for quick session validation
export const validateSessionTimeout = async (
  sessionId: string,
  timeoutMs: number = 5000
): Promise<SessionResponse | null> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const result = await getSessionById(sessionId, {
      signal: controller.signal,
      timeout: timeoutMs,
    });
    clearTimeout(timeoutId);
    return result;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

export async function cancelSession(id: Number) {
  try {
    const response = await api.delete(`/session/${id}`);
    return response.data;
  } catch (error) {
    console.error("Gagal membatalkan sesi:", error);
    throw error;
  }
}
