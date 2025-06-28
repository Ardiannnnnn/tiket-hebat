export interface PassengerEntry {
  class_id: number;
  passenger_name: string;
  passenger_age: number;
  address: string;
  passenger_gender: string;
  id_type: string;
  id_number: string;
  seat_number?: string;
}

export interface VehicleEntry {
  class_id: number;
  license_plate: string;
  passenger_name: string;
  passenger_age: number;
  address: string;
}

export type TicketEntry = PassengerEntry | VehicleEntry;

export interface TicketEntryPayload {
  session_id: string;
  customer_name: string;
  phone_number: string;
  email: string;
  id_type: string;
  id_number: string;
  payment_method: string;
  ticket_data: TicketEntry[];
}


      