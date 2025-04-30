export interface ClassInfo {
    id: number;
    name: string;
  }
  
  export interface ShipInfo {
    id: number;
    name: string;
  }
  
  export interface ShipClass {
    id: number;
    class: ClassInfo;
    ship: ShipInfo;
    capacity: number;
  }
  
  export interface Ship {
    id: number;
    name: string;
    ship_classes: ShipClass[];
    created_at: string;
    updated_at: string;
  }
  
  export interface ShipResponse {
    status: boolean;
    message: string;
    data: Ship[];
  }
  