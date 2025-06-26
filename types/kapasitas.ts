export interface ClassData {
  id: number;
  class_name: string;
  type: 'passenger' | 'vehicle';
}

export interface ShipData {
  id: number;
  ship_name: string;
  ship_type: string;
}

export interface Manifest {
  id: number;
  class: ClassData;
  ship: ShipData;
  schedule_id: number;
  quota: number;
  price: number;
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

export interface ManifestResponse {
  status: boolean;
  message: string;
  data: Manifest[];
  meta: Meta;
}
