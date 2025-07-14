import { api } from './api';

export interface RefundVerificationRequest {
  order_id: string;
  id_number: string;
  email: string;
}

export interface RefundVerificationResponse {
  success: boolean;
  message: string;
  data?: {
    eligible: boolean;
    refund_amount?: number;
    admin_fee?: number;
    net_refund?: number;
  };
}

export const verifyRefundEligibility = async (
  data: RefundVerificationRequest
): Promise<RefundVerificationResponse> => {
  try {
    const response = await api.post('/booking/refund', data);
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data;
    }
    throw new Error('Network error occurred while verifying refund eligibility');
  }
};