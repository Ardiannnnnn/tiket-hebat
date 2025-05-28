export interface SessionTicket {
  ticket_id: number;
  class: {
    id: number;
    class_name: string;
    type: "vehicle" | "passenger";
  };
  price: number;
}

export interface SessionPrice {
  class: {
    id: number;
    class_name: string;
    type: "vehicle" | "passenger";
  };
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Harbor {
  id: number;
  harbor_name: string;
}

export interface Route {
  id: number;
  departure_harbor: Harbor;
  arrival_harbor: Harbor;
}

export interface Ship {
  id: number;
  ship_name: string;
}

export interface Schedule {
  id: number;
  ship: Ship;
  route: Route;
  departure_datetime: string;
  arrival_datetime: string;
}

export interface SessionData {
  id: number;
  session_id: string;
  schedule_id: number;
  schedule: Schedule;
  claimed_at: string;
  expires_at: string;
  prices: SessionPrice[];
  tickets: SessionTicket[];
  total_amount: number;
  created_at: string;
  updated_at: string;
}

export interface SessionResponse {
  status: boolean;
  message: string;
  data: SessionData;
}
