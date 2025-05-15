export interface Ship {
  id: string;
  name: string;
  status: string;
  ship_type: string;
  year: string;
  image: string;
  Description: string;
  created_at: string;
  updated_at: string;
}

export interface ShipResponse {
  status: boolean;
  message?: string;
  data: Ship[];
}