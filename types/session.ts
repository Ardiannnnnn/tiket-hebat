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

export interface Ship {
  id: number;
  ship_name: string;
}

export interface Schedule {
  id: number;
  ship: Ship;
  departure_harbor: Harbor;
  arrival_harbor: Harbor;
  departure_datetime: string;
  arrival_datetime: string;
}

export interface SessionData {
  id: number;
  session_id: string;
  schedule: {
    id: number;
    ship: {
      id: number;
      ship_name: string;
    };
    departure_harbor: {
      id: number;
      harbor_name: string;
    };
    arrival_harbor: {
      id: number;
      harbor_name: string;
    };
    departure_datetime: string;
    arrival_datetime: string;
  };
  status: string;
  tickets: Ticket[]; // This might be empty
  claim_items: ClaimItem[]; // ✅ This contains the actual ticket data
  total_amount: number;
  expires_at: string;
  created_at: string;
  updated_at: string;
}

export interface ClaimItem {
  class_id: number;
  class: {
    id: number;
    class_name: string;
    type: "passenger" | "vehicle";
  };
  subtotal: number;
  quantity: number;
}

export interface Ticket {
  ticket_id: string;
  class: {
    id: number;
    class_name: string;
    type: "passenger" | "vehicle";
  };
  class_id: number;
  seat_number?: string | null;
}

export interface SessionResponse {
  status: boolean;
  message: string;
  data: SessionData;
}
