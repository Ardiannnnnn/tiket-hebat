export interface Harbor {
  id: number;
  harbor_name: string;
  status: string;
  harbor_alias: string;
  year_operation: string;
  created_at: string;
  updated_at: string;
}

export interface HarborMeta {
  total: number;
  per_page: number;
  current_page: number;
  total_pages: number;
}

export interface HarborResponse {
  status: boolean;
  message: string;
  data: Harbor[];
  meta: HarborMeta;
}

export interface HarborParams {
  page?: number;
  per_page?: number;
  search?: string;
} 