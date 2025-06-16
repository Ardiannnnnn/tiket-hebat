export interface TicketResponse {
  status: boolean;
  message: string;
  data: Ticket[];
  meta: TicketMeta;
}

export interface Ticket {
  id: number;
  claim_session_id: number;
  schedule: {
    id: number;
    ship: {
      id: number;
      ship_name: string;
    };
    route: {
      id: number;
      departure_harbor: {
        id: number;
        harbor_name: string;
      };
      arrival_harbor: {
        id: number;
        harbor_name: string;
      };
    };
    departure_datetime: string;
    arrival_datetime: string;
  };
  class: {
    id: number;
    class_name: string;
    type: "passenger" | "vehicle";
  };
  status: string;
  booking_id: number;
  type: "passenger" | "vehicle";
  passenger_name: string;
  passenger_age: number;
  address: string;
  id_type: string;
  id_number: string;
  seat_number: string | null;
  license_plate: string | null;
  price: number;
  expires_at: string;
  claimed_at: string;
  created_at: string;
  updated_at: string;
}

export interface TicketMeta {
  total: number;
  per_page: number;
  current_page: number;
  total_pages: number;
  next_page: number;
  from: number;
  to: number;
  path: string;
  has_next_page: boolean;
  has_prev_page: boolean;
}