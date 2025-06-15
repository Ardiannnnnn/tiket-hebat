export interface XenditData {
  id: string;
  invoice_url: string;
  status: string;
}

export interface MidtransData {
  payment_url: string;
  order_id: string;
}

export interface ClaimSessionResponse {
  status: boolean;
  message: string;
  order_id: string;
  booking_id: number;
  xendit: XenditData;
  midtrans: MidtransData;
  midtrans_snap: string;
  updated_ticket_ids: number[];
  failed_tickets: null | any;
}
