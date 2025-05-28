export interface LockTicketItem {
  class_id: number;
  quantity: number;
  type: 'passenger' | 'vehicle';
}

export interface LockTicketPayload {
  schedule_id: number;
  items: LockTicketItem[];
}
