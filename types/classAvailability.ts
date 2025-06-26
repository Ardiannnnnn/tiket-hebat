// types/classAvailability.ts
export interface ClassAvailability {
  class_id: number;
  class_name: string;
  type: "passenger" | "vehicle";
  quota: number;
  available_capacity: number;
  price: number;
  currency: string;
}