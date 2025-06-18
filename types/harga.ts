export interface Harbor {
  id: number;
  harbor_name: string;
}

export interface Route {
  id: number;
  departure_harbor: Harbor;
  arrival_harbor: Harbor;
}

export interface Class {
  id: number;
  class_name: string;
}

export interface Ship {
  id: number;
  ship_name: string;
}

export interface Manifest {
  id: number;
  class: Class;
  ship: Ship;
}

export interface HargaProps {
  id: number;
  route: Route;
  manifest: Manifest;
  ticket_price: number;
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

export interface HargaResponse {
  status: boolean;
  message: string;
  data: HargaProps[];
  meta: Meta;
}

export interface CreateHargaPayload {
  route_id: number;
  manifest_id: number;
  ticket_price: number;
}