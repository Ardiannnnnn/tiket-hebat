export type FieldType = 'text' | 'number' | 'select' | 'date';

export interface SelectOption {
  value: string;
  label: string;
}

export interface FieldConfig {
  name: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'password' | 'select' | 'datetime-local';
  required?: boolean;
  placeholder?: string;
  options?: SelectOption[]; // Format for date fields, e.g., 'YYYY-MM-DD'
}
