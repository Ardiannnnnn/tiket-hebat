export type Harbor = {
  id: number;
  harbor_name: string;
};

export type Route = {
  id: number;
  departure_harbor: Harbor;
  arrival_harbor: Harbor;
};

export type Ship = {
  id: number;
  ship_name: string;
};

export type Schedule = {
  id: number;
  ship: Ship;
  route: Route;
  departure_datetime: string;
  arrival_datetime: string;
};

export type TicketClass = {
  id: number;
  class_name: string;
  type: string;
};

export type Ticket = {
  id: number;
  class: TicketClass;
  status: string;
  type: string;
  passenger_name?: string;
  passenger_age?: number;
  address?: string;
  id_type?: string;
  id_number?: string;
  seat_number?: string;
  license_plate?: string | null;
  price: number;
};

export type Booking = {
  id: number;
  order_id: string;
  schedule: Schedule;
  customer_name: string;
  id_type: string;
  id_number: string;
  phone_number: string;
  email_address: string;
  status: string;
  booked_at: string;
  created_at: string;
  updated_at: string;
  tickets: Ticket[];
};

export type BookingResponse = {
  status: boolean;
  message: string;
  data: Booking;
};