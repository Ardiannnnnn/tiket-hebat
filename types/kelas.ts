export interface kelasProps {
  id: number;
  class_name: string;
  class_alias: string;
  type: string;
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

export interface kelasResponse {
  status: boolean;
  message: string;
  data: kelasProps[];
  meta: Meta;
}