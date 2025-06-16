import api from "./api";
import { PaymentTransactionDetail, PaymentChannel } from "@/types/paymentDetail";

export const getPaymentChannels = async (): Promise<PaymentChannel[]> => {
  const response = await api.get("/payment-channels");
  return response.data.data;
};

export const createPaymentTransaction = async (orderId: string, paymentMethod: string) => {
  const response = await api.post("/payment/transaction/create", {
    order_id: orderId,
    payment_method: paymentMethod,
  });
  return response.data;
};

export const getPaymentTransactionDetail = async (
  referenceNumber: string
): Promise<{ data: PaymentTransactionDetail }> => {
  const response = await api.get(`/payment/transaction/detail/${referenceNumber}`);
  return response.data;
};