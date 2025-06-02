export interface Ship {
  id: string;
  ship_name: string;
  status: string;
  ship_type: string;
  year_operation: string;
  image_link: string;
  Description: string;
  created_at: string;
  updated_at: string;
}

export interface ShipResponse {
  status: boolean;
  message?: string;
  data: Ship[];
}