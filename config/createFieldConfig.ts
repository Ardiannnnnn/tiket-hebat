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
    { name: "Description", label: "Deskripsi", type: "text", required: true },
    
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
};
