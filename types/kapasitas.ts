export interface ClassData {
  id: number;
  class_name: string;
  type: 'passenger' | 'vehicle';
}

export interface ScheduleData {
  id: number;
  ship_name: string;
  departure_harbor: string;
  arrival_harbor: string;
  departure_datetime: string; // ISO string format
  arrival_datetime: string;   // ISO string format
}

// ✅ Updated Manifest interface sesuai response API
export interface Manifest {
  id: number;
  schedule_id: number;
  class: ClassData;
  schedule: ScheduleData;
  price: number;
  quota: number;
  Capacity: number; // ✅ Note: Capital 'C' sesuai response
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

export interface ManifestResponse {
  status: boolean;
  message: string;
  data: Manifest[];
  meta: Meta;
}

// ✅ Enhanced FlattenedManifest untuk UI display
export interface FlattenedManifest {
  id: number;
  schedule_id: number;
  class_name: string;
  type: string;
  quota: number;
  capacity: number; // ✅ lowercase untuk consistency di UI
  price: number;
  class_id: number;
  // ✅ Schedule display fields
  schedule_info: string;
  ship_name: string;
  route: string;
  departure_date: string;
  departure_time: string;
  arrival_date: string;
  arrival_time: string;
  full_schedule_text: string;
  // ✅ Additional computed fields
  quota_percentage: number;
  status: 'available' | 'low' | 'full';
}

// ✅ Create payload interface
export interface CreateKapasitasPayload {
  schedule_id: number;
  class_id: number;
  capacity: number; // ✅ lowercase untuk request
  price: number;
}
