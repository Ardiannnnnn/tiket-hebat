import api from "./api";

export const getPaymentChannels = async () => {
  const response = await api.get("/payment-channels");
  return response.data;
};

export const createPaymentTransaction = async (orderId: string, paymentMethod: string) => {
  const response = await api.post("/payment/transaction", {
    order_id: orderId,
    payment_method: paymentMethod,
  });
  return response.data;
};