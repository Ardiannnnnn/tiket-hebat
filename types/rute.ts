export interface Harbor {
  id: number;
  harbor_name: string;
}

export interface Route {
  id: number;
  departure_harbor: Harbor;
  arrival_harbor: Harbor;
  created_at: string;
  updated_at: string;
}

export interface Meta {
  total: number;
  per_page: number;
  current_page: number;
  total_pages: number;
  from: number;
  to: number;
  path: string;
  has_next_page: boolean;
  has_prev_page: boolean;
}

export interface RouteResponse {
  status: boolean;
  message: string;
  data: Route[];
  meta: Meta;
}
