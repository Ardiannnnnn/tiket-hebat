import api from "./api";

export const getPaymentChannels = async () => {
  const response = await api.get("/payment-channels");
  return response.data;
};

export const createPaymentTransaction = async (orderId: string, paymentMethod: string) => {
  const response = await api.post("/payment/transaction/create", {
    order_id: orderId,
    payment_method: paymentMethod,
  });
  return response.data;
};

export const getPaymentTransactionDetail = async (referenceNumber: string) => {
  const response = await api.get(`/payment/transaction/detail/${referenceNumber}`);
  return response.data;
};