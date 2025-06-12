import { FieldConfig } from "@/types/field";

export const createFieldConfigs: Record<string, FieldConfig[]> = {
  tiket: [
    { name: "nama", label: "Nama", type: "text", required: true },
    { name: "usia", label: "Usia", type: "number", required: true },
    {
      name: "kelas",
      label: "Kelas",
      type: "select",
      required: true,
      options: [
        { label: "Ekonomi", value: "ekonomi" },
        { label: "Bisnis", value: "bisnis" },
      ],
    },
  ],
  kapal: [
    { name: "ship_name", label: "Nama Kapal", type: "text", required: true },
    {
      name: "status",
      label: "status",
      type: "select",
      required: true,
      options: [
        { label: "Beroperasi", value: "Beroperasi" },
        { label: "Dock", value: "Dock" },
      ],
    },
    { name: "year_operation", label: "Tahun Operasional", type: "text", required: true },
    {
      name: "ship_type",
      label: "Jenis Kapal",
      type: "select",
      required: true,
      options: [
        { label: "RoRO", value: "RoRO" },
        { label: "Kargo", value: "Kargo" },
      ],
    },
    { name: "image_link", label: "Gambar", type: "text", required: true },
    { name: "description", label: "Deskripsi", type: "text", required: true },
    
  ],
  pelabuhan: [
    { name: "harbor_name", label: "Nama Pelabuhan", type: "text", required: true },
    { name: "year_operation", label: "Tahun Operasional", type: "text", required: true },
    {
      name: "status",
      label: "Status Pelabuhan",
      type: "select",
      required: true,
      options: [
        { label: "Beroperasi", value: "Beroperasi" },
        { label: "Tidak Beroperasi", value: "Tidak Beroperasi" },
      ],
    },
  ],
  // ...existing code...

    pengguna: [
    { name: "username", label: "Username", type: "text", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "password", label: "Password", type: "text", required: true },
    { name: "full_name", label: "Nama Lengkap", type: "text", required: true },
    { 
      name: "role_id", 
      label: "Role", 
      type: "select", 
      required: true,
      options: [] // Will be populated dynamically
    },
  ],
};
