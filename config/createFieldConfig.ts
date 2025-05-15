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
    { name: "nama", label: "Nama Kapal", type: "text", required: true },
    { name: "kapasitas", label: "Kapasitas", type: "number" },
    { name: "tahun_operasional", label: "Tahun Operasional", type: "date" },
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
