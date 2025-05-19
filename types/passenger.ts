export interface PassengerEntry {
  ticket_id: number;
  passenger_name: string;
  passenger_age: number;
  address: string;
  id_type: string;
  id_number: string;
  seat_number?: string;
}

export interface PassengerEntryPayload {
  session_id: string;
  passenger_data: PassengerEntry[];
}
