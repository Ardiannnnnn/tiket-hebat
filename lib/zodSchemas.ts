import { z } from "zod";

export const schemas: Record<string, z.ZodObject<any>> = {
  tiket: z.object({
    nama: z.string().min(1, "Nama wajib diisi"),
    usia: z.coerce.number().min(1, "Usia tidak valid"),
    kelas: z.enum(["ekonomi", "bisnis"]),
  }),
  kapal: z.object({
    name: z.string().min(1, "Nama kapal wajib diisi"),
    status: z.enum(["Beroperasi", "Dock"]),
    ship_type: z.string().min(1, "Tipe kapal wajib diisi"),
    year: z.string().optional(),
    image: z.string().optional(),
    Description: z.string().optional(),
  }),
  pelabuhan: z.object({
    harbor_name: z.string().min(1, "Nama pelabuhan wajib diisi"),
    year_operation: z.string().min(1, "Tahun wajib diisi"),
    status: z.enum(["Beroperasi", "Tidak Beroperasi"]),
  }),
};
