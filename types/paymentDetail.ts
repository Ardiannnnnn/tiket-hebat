export interface PaymentTransactionDetail {
  reference: string;
  merchant_ref: string;
  payment_selection_type: string;
  payment_method: string;
  payment_name: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  callback_url: string;
  return_url: string;
  amount: number;
  fee_merchant: number;
  fee_customer: number;
  total_fee: number;
  amount_received: number;
  pay_code: string;
  pay_url: string | null;
  checkout_url: string;
  status: string;
  expired_time: number;
  order_items: Array<{
    sku: string;
    name: string;
    price: number;
    quantity: number;
    subtotal: number;
    product_url: string;
    image_url: string;
  }>;
  instructions: Array<{
    title: string;
    steps: string[];
  }>;
  qr_string: string;
  qr_url: string; // URL untuk QR Code
}

export interface PaymentChannel {
  group: string; // Grup metode pembayaran (contoh: "Virtual Account", "E-Wallet")
  code: string; // Kode metode pembayaran (contoh: "BRIVA", "OVO")
  name: string; // Nama metode pembayaran (contoh: "BRI Virtual Account", "OVO")
  type: string; // Tipe metode pembayaran (contoh: "direct", "redirect")
  fee_merchant: {
    flat: number; // Biaya merchant dalam bentuk flat
    percent: number; // Biaya merchant dalam bentuk persentase
  };
  fee_customer: {
    flat: number; // Biaya pelanggan dalam bentuk flat
    percent: number; // Biaya pelanggan dalam bentuk persentase
  };
  total_fee: {
    flat: number; // Total biaya dalam bentuk flat
    percent: string; // Total biaya dalam bentuk persentase (string)
  };
  minimum_fee: number; // Biaya minimum
  maximum_fee: number; // Biaya maksimum
  minimum_amount: number; // Jumlah minimum pembayaran
  maximum_amount: number; // Jumlah maksimum pembayaran
  icon_url: string; // URL ikon metode pembayaran
  active: boolean; // Status aktif metode pembayaran
}