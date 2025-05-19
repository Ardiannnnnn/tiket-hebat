import api from "./api";
import { PassengerEntryPayload } from "@/types/passenger";

/**
 * Kirim data penumpang ke endpoint /session/ticket/data/entry
 */
export const submitPassengerData = async (payload: PassengerEntryPayload) => {
  try {
    const response = await api.post("/session/ticket/data/entry", payload);
    console.log("Passenger entry response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to submit passenger data:", error);
    throw error;
  }
};