export interface Ship {
  id: number; // ubah ke number sesuai response
  ship_name: string;
  status: string;
  ship_type: string;
  ship_alias?: string; // opsional, ada di response tapi sebelumnya tidak dipakai
  year_operation: string;
  image_link: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Meta {
  total: number;
  per_page: number;
  current_page: number;
  total_pages: number;
}

export interface ShipResponse {
  status: boolean;
  message?: string;
  data: Ship[];
  meta?: Meta;
}
