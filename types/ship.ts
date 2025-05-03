export interface Ship {
  id: number;
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
  status: string;
  message: string;
  data: Ship[];
}
