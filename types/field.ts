export type FieldType = 'text' | 'number' | 'select' | 'date';

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: { label: string; value: string }[]; // untuk select
  required?: boolean;
}
