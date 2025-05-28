// schemas/penumpangSchema.ts
import { z } from "zod";

export const penumpangSchema = z.object({
  kendaraan: z.array( z.object({
    nomor_polisi: z.string().min(1, { message: "Nomor polisi tidak boleh kosong" })
})),
  penumpang: z.array(
    z.object({
      nama: z.string().min(1, { message: "Nama tidak boleh kosong" }),
      jenis_kelamin: z.enum(["pria", "wanita"], {
        errorMap: () => ({ message: "Jenis kelamin wajib dipilih" }),
      }),
      jenis_id: z.enum(["nik", "sim", "paspor"], {
        errorMap: () => ({ message: "Jenis ID wajib dipilih" }),
      }),
      nomor_identitas: z
        .string()
        .min(1, { message: "Nomor identitas tidak boleh kosong" }),
      usia: z.union([
          z.number().min(0, { message: "Usia tidak boleh negatif" }),
        z.string().min(1, { message: "Usia wajib diisi" }),
      ]),
      alamat: z.string().min(1, { message: "Alamat tidak boleh kosong" }),
    })
  ),
});

export type PenumpangFormSchema = z.infer<typeof penumpangSchema>;


