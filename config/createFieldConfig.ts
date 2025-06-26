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
        { label: "Beroperasi", value: "ACTIVE" },
        { label: "Dock", value: "INACTIVE" },
      ],
    },
    {
      name: "ship_alias",
      label: "Alias",
      type: "text",
      required: true,
      options: [],
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
    { name: "harbor_alias", label: "Alias Pelabuhan", type: "text", required: true },
    {
      name: "status",
      label: "Status Pelabuhan",
      type: "select",
      required: true,
      options: [
        { label: "Beroperasi", value: "active" },
        { label: "Tidak Beroperasi", value: "inactive" },
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
  hargaTiket: [
    { name: "route_id", label: "Rute", type: "select", required: true, options: [] },
    { name: "manifest_id", label: "Manifest", type: "select", required: true, options: [] },
    { name: "ticket_price", label: "Harga Tiket", type: "number", required: true },
  ],
  kelasTiket: [
    { name: "class_name", label: "Nama Kelas", type: "text", required: true },
    { name: "class_alias", label: "Alias", type: "text", required: true },
    { name: "type", label: "Tipe", type: "select", required: true, options: [
      { label: "Kendaraan", value: "vihicle" },
      { label: "Penumpang", value: "passenger" },
    ] },
  ],
  dataRute: [
    {
      name:"departure_harbor_id", label: "Pelabuhan Asal", type: "select", required: true, options:[]
    },
    {
      name:"arrival_harbor_id", label: "Pelabuhan Tujuan", type: "select", required: true, options:[]
    }
  ],
  kapasitasTiket: [
    {
      name:"schedule_id", label: "jadwal", type: "select", required: true, options:[]
    },
    {
      name:"class_id", label: "Kelas", type: "select", required: true, options:[]
    },
    {
      name:"quota", label:"Kapasitas", type:"text", required:true
    },
    {
      name:"price", label:"Harga", type:"text", required:true
    }
  ],
   uploadJadwal: [
    { 
      name: "departure_harbor_id", 
      label: "Pelabuhan Asal", 
      type: "select", 
      required: true, 
      options: [] // Will be populated from options prop
    },
    { 
      name: "arrival_harbor_id", 
      label: "Pelabuhan Tujuan", 
      type: "select", 
      required: true, 
      options: [] // Will be populated from options prop
    },
    { 
      name: "ship_id", 
      label: "Kapal", 
      type: "select", 
      required: true, 
      options: [] // Will be populated from options prop
    },
    { 
      name: "departure_datetime", 
      label: "Waktu Keberangkatan", 
      type: "datetime-local", 
      required: true 
    },
    { 
      name: "arrival_datetime", 
      label: "Waktu Tiba", 
      type: "datetime-local", 
      required: true 
    },
    {
      name: "status",
      label: "Status Jadwal",
      type: "select",
      required: true,
      options: [
        { label: "Terjadwal", value: "SCHEDULED" },
        { label: "Selesai", value: "FINISHED" },
        { label: "Dibatalkan", value: "CANCELLED" },
      ],
    },
  ],
};
