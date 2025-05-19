export interface LockTicketItem {
  class_id: number;
  quantity: number;
}

export interface LockTicketPayload {
  schedule_id: number;
  items: LockTicketItem[];
}