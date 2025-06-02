export interface PassengerEntry {
  ticket_id: number;
  passenger_name: string;
  passenger_age: number;
  address: string;
  id_type: string;
  id_number: string;
  seat_number?: string;
}

export interface VehicleEntry {
  ticket_id: number;
  license_plate: string;
}

export type TicketEntry = PassengerEntry | VehicleEntry;

export interface TicketEntryPayload {
  session_id: string;
  customer_name: string;
  phone_number: string;
  email: string;
  id_type: string;
  id_number: string;
  ticket_data: TicketEntry[];
}


