export interface ScheduleResponse {
  status: boolean;
  message: string;
  data: Schedule[];
  meta: {
    total: number;
    per_page: number;
    current_page: number;
    total_pages: number;
    next_page: number | null;
    has_next_page: boolean;
    has_prev_page: boolean;
  };
}

export interface Schedule {
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
  status: string;
  created_at: string;
  updated_at: string;
}