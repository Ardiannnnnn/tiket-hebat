import hargaTiket from "@/app/(dashboard)/hargaTiket/page";
import kelas from "@/app/ui/dashboard/harga";
import { z } from "zod";

export const schemas: Record<string, z.ZodObject<any>> = {
  tiket: z.object({
    nama: z.string().min(1, "Nama wajib diisi"),
    usia: z.coerce.number().min(1, "Usia tidak valid"),
    kelas: z.enum(["ekonomi", "bisnis"]),
  }),
  kapal: z.object({
    ship_name: z.string().min(1, "Nama kapal wajib diisi"),
    status: z.enum(["Beroperasi", "Dock"]),
    ship_type: z.string().min(1, "Tipe kapal wajib diisi"),
    year_operation: z.string().min(1, "Tahun Operasi wajib diisi"),
    image_link: z.string().min(1, "Gambar wajib diisi"),
    description: z.string().min(1, "Dekripsi wajib diisi"),
  }),
  pelabuhan: z.object({
    harbor_name: z.string().min(1, "Nama pelabuhan wajib diisi"),
    year_operation: z.string().min(1, "Tahun wajib diisi"),
    status: z.enum(["Beroperasi", "Tidak Beroperasi"]),
  }),
 pengguna: z.object({
    username: z.string().min(1, "Username wajib diisi"),
    email: z.string().email("Email tidak valid"),
    password: z.string().min(6, "Password minimal 6 karakter"),
    full_name: z.string().min(1, "Nama lengkap wajib diisi"),
    role_id: z.number().min(1, "Role wajib dipilih"),
  }),
  hargaTiket: z.object({
    route_id: z.string()
      .transform((val) => parseInt(val))
      .refine((val) => !isNaN(val), "Route ID harus berupa angka"),
    manifest_id: z.string()
      .transform((val) => parseInt(val))
      .refine((val) => !isNaN(val), "Manifest ID harus berupa angka"),
    ticket_price: z.string()
      .transform((val) => parseInt(val))
      .refine((val) => !isNaN(val) && val > 0, "Harga tiket harus lebih dari 0")
  }),
  kelas: z.object({ 
    class_name: z.string().min(1, "Nama kelas wajib diisi"),
    type: z.string().min(1, "Tipe wajib diisi"),
    class_alias: z.string().min(1, "Alias wajib dipilih"),
  }),
  dataRute: z.object({
     departure_harbor_id: z.string()
      .transform((val) => parseInt(val))
      .refine((val) => !isNaN(val), "Pelabuhan ID harus berupa angka"),
      arrival_harbor_id: z.string()
      .transform((val) => parseInt(val))
      .refine((val) => !isNaN(val), "Pelabuhan ID harus berupa angka"),
  }),
  kapasitasTiket: z.object({
    ship_id: z.string()
      .transform((val) => parseInt(val))
      .refine((val) => !isNaN(val), "ship_id harus berupa angka"),
    class_id: z.string()
      .transform((val) => parseInt(val))
      .refine((val) => !isNaN(val), "class_id harus berupa angka"),
    capacity: z.string()
      .transform((val) => parseInt(val))
      .refine((val) => !isNaN(val) && val > 0, "kapasitas harus lebih dari 0")
  })
};
