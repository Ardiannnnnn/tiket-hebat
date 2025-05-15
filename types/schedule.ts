export interface ScheduleResponse {
  status: boolean;
  message: string;
  data: Schedule[];
}

export interface Schedule {
  id: number;
  ship: Ship;
  route: Route;
  departure_datetime: string;
  arrival_datetime: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Ship {
  id: number;
  ship_name: string;
}

export interface Route {
  id: number;
  departure_harbor: Harbor;
  arrival_harbor: Harbor;
}

export interface Harbor {
  id: number;
  harbor_name: string;
}
