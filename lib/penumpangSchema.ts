import { z } from "zod";

// ✅ Enhanced nama validation with character limit
const namaSchema = z
  .string()
  .min(1, { message: "Nama tidak boleh kosong" })
  .max(32, { message: "Nama maksimal 32 karakter" })
  .refine((val) => val.trim().length > 0, {
    message: "Nama tidak boleh hanya spasi",
  })
  .refine((val) => /^[a-zA-Z\s]+$/.test(val), {
    message: "Nama hanya boleh mengandung huruf dan spasi",
  });

// ✅ Enhanced alamat validation with character limit
// lib/penumpangSchema.ts
// ...existing code...

// ✅ Update alamat validation - change to 100 characters instead of 200
const alamatSchema = z
  .string()
  .min(1, { message: "Alamat tidak boleh kosong" })
  .max(100, { message: "Alamat maksimal 100 karakter" }) // ✅ Changed from 200 to 100
  .refine((val) => val.trim().length > 0, {
    message: "Alamat tidak boleh hanya spasi",
  });

// ...rest of existing code remains the same...

// ✅ Simple base schemas without complex validation first
const penumpangBaseSchema = z.object({
  nama: namaSchema,
  jenis_kelamin: z.enum(["pria", "wanita"], {
    errorMap: () => ({ message: "Jenis kelamin wajib dipilih" }),
  }),
  jenis_id: z.enum(["nik", "sim", "paspor"], {
    errorMap: () => ({ message: "Jenis ID wajib dipilih" }),
  }),
  nomor_identitas: z
    .string()
    .min(1, { message: "Nomor identitas tidak boleh kosong" }),
  usia: z
    .string()
    .min(1, { message: "Usia tidak boleh kosong" })
    .refine((val) => !isNaN(Number(val)), {
      message: "Usia harus berupa angka",
    })
    .refine((val) => Number(val) > 0, { message: "Usia harus lebih dari 0" })
    .refine((val) => Number(val) <= 120, {
      message: "Usia tidak valid (maksimal 120 tahun)",
    }),
  alamat: alamatSchema,
  ticket_id: z.string().optional(),
  class_name: z.string().optional(),
});

const kendaraanBaseSchema = z.object({
  nomor_polisi: z
    .string()
    .min(1, { message: "Nomor polisi tidak boleh kosong" })
    .max(24, { message: "Nomor polisi maksimal 24 karakter" })
    .refine((val) => /^[A-Z0-9\s]+$/.test(val), {
      message: "Nomor polisi hanya boleh huruf kapital, angka, dan spasi",
    }),
  nama: namaSchema,
  alamat: alamatSchema,
  usia: z
    .string()
    .min(1, { message: "Usia tidak boleh kosong" })
    .refine((val) => !isNaN(Number(val)), {
      message: "Usia harus berupa angka",
    })
    .refine((val) => Number(val) > 0, { message: "Usia harus lebih dari 0" })
    .refine((val) => Number(val) <= 120, {
      message: "Usia tidak valid (maksimal 120 tahun)",
    }),
  ticket_id: z.string().optional(),
  class_name: z.string().optional(),
});

// ✅ Add cross-field validation for penumpang
const penumpangWithValidation = penumpangBaseSchema.refine(
  (data) => {
    const { jenis_id, nomor_identitas } = data;

    // ✅ Check if nomor_identitas contains only numbers
    if (!/^\d+$/.test(nomor_identitas)) {
      return false;
    }

    // ✅ Validate length based on jenis_id
    switch (jenis_id) {
      case "nik":
        return nomor_identitas.length === 16;
      case "sim":
        return nomor_identitas.length === 14;
      case "paspor":
        return nomor_identitas.length === 8;
      default:
        return false;
    }
  },
  (data) => {
    const { jenis_id, nomor_identitas } = data;

    // ✅ Check if it's not numeric first
    if (!/^\d+$/.test(nomor_identitas)) {
      return {
        message: "Nomor identitas harus berupa angka",
        path: ["nomor_identitas"],
      };
    }

    // ✅ Return specific error message based on jenis_id
    switch (jenis_id) {
      case "nik":
        return {
          message: "NIK (KTP) harus 16 digit angka",
          path: ["nomor_identitas"],
        };
      case "sim":
        return {
          message: "SIM harus 14 digit angka",
          path: ["nomor_identitas"],
        };
      case "paspor":
        return {
          message: "Paspor harus 8 digit angka",
          path: ["nomor_identitas"],
        };
      default:
        return {
          message: "Jenis identitas tidak valid",
          path: ["nomor_identitas"],
        };
    }
  }
);

// ✅ Form schema with string usia (for React Hook Form)
export const penumpangSchema = z.object({
  penumpang: z.array(penumpangWithValidation).default([]),
  kendaraan: z.array(kendaraanBaseSchema).default([]),
});

// ✅ Create transformation schemas separately
const penumpangTransformed = penumpangBaseSchema
  .extend({
    usia: z.string().transform((val) => Number(val)),
  })
  .refine(
    (data) => {
      const { jenis_id, nomor_identitas } = data;

      if (!/^\d+$/.test(nomor_identitas)) {
        return false;
      }

      switch (jenis_id) {
        case "nik":
          return nomor_identitas.length === 16;
        case "sim":
          return nomor_identitas.length === 14;
        case "paspor":
          return nomor_identitas.length === 8;
        default:
          return false;
      }
    },
    (data) => {
      const { jenis_id, nomor_identitas } = data;

      if (!/^\d+$/.test(nomor_identitas)) {
        return {
          message: "Nomor identitas harus berupa angka",
          path: ["nomor_identitas"],
        };
      }

      switch (jenis_id) {
        case "nik":
          return {
            message: "NIK (KTP) harus 16 digit angka",
            path: ["nomor_identitas"],
          };
        case "sim":
          return {
            message: "SIM harus 14 digit angka",
            path: ["nomor_identitas"],
          };
        case "paspor":
          return {
            message: "Paspor harus 8 digit angka",
            path: ["nomor_identitas"],
          };
        default:
          return {
            message: "Jenis identitas tidak valid",
            path: ["nomor_identitas"],
          };
      }
    }
  );

const kendaraanTransformed = kendaraanBaseSchema.extend({
  usia: z.string().transform((val) => Number(val)),
});

// ✅ Submission schema with number usia (for API)
export const penumpangSubmissionSchema = z.object({
  penumpang: z.array(penumpangTransformed).default([]),
  kendaraan: z.array(kendaraanTransformed).default([]),
});

// ✅ Export types
export type PenumpangFormData = z.infer<typeof penumpangSchema>;
export type PenumpangSubmissionData = z.infer<typeof penumpangSubmissionSchema>;

// ✅ Create input type alias for backward compatibility
export type PenumpangSchemaInput = PenumpangFormData;

// ✅ Helper function to get identity format info
export const getIdentityFormat = (jenis_id: "nik" | "sim" | "paspor") => {
  switch (jenis_id) {
    case "nik":
      return {
        label: "NIK (KTP)",
        digits: 16,
        placeholder: "Contoh: 1234567890123456",
        description: "16 digit angka sesuai KTP",
      };
    case "sim":
      return {
        label: "SIM",
        digits: 14,
        placeholder: "Contoh: 12345678901234",
        description: "14 digit angka sesuai SIM",
      };
    case "paspor":
      return {
        label: "Paspor",
        digits: 8,
        placeholder: "Contoh: 12345678",
        description: "8 digit angka sesuai Paspor",
      };
    default:
      return {
        label: "Identitas",
        digits: 0,
        placeholder: "Pilih jenis identitas terlebih dahulu",
        description: "",
      };
  }
};

// ✅ Validation helper for real-time input
export const validateIdentityInput = (
  jenis_id: string,
  nomor_identitas: string
) => {
  if (!nomor_identitas) return { isValid: true, message: "" };

  // Only allow numbers
  if (!/^\d*$/.test(nomor_identitas)) {
    return { isValid: false, message: "Hanya boleh angka" };
  }

  const format = getIdentityFormat(jenis_id as "nik" | "sim" | "paspor");

  if (nomor_identitas.length > format.digits) {
    return { isValid: false, message: `Maksimal ${format.digits} digit` };
  }

  if (nomor_identitas.length < format.digits && nomor_identitas.length > 0) {
    return {
      isValid: false,
      message: `${format.label} memerlukan ${format.digits} digit (${nomor_identitas.length}/${format.digits})`,
    };
  }

  return { isValid: true, message: "" };
};
