// lib/pemesanSchema.ts
import { z } from "zod";

// ✅ Enhanced nama validation with character limit
const namaSchema = z
  .string()
  .min(1, { message: "Nama tidak boleh kosong" })
  .max(32, { message: "Nama maksimal 50 karakter" })
  .refine((val) => val.trim().length > 0, { message: "Nama tidak boleh hanya spasi" })
  .refine((val) => /^[a-zA-Z\s]+$/.test(val), { message: "Nama hanya boleh mengandung huruf dan spasi" });

// ✅ Simplified Nomor HP validation - only number and length
const nohpSchema = z
  .string()
  .min(1, { message: "Nomor HP tidak boleh kosong" })
  .min(10, { message: "Nomor HP minimal 10 digit" })
  .max(14, { message: "Nomor HP maksimal 14 digit" })
  .refine((val) => /^[0-9]+$/.test(val), { message: "Nomor HP hanya boleh angka" });

// ✅ Simplified Email validation - basic email format only
const emailSchema = z
  .string()
  .min(1, { message: "Email tidak boleh kosong" })
  .email({ message: "Format email tidak valid" })
  .max(100, { message: "Email maksimal 100 karakter" });

// ✅ Base pemesan schema
const pemesanBaseSchema = z.object({
  nama: namaSchema,
  nohp: nohpSchema,
  email: emailSchema,
  jenisID: z.enum(["nik", "sim", "pasport"], {
    errorMap: () => ({ message: "Jenis identitas wajib dipilih" }),
  }),
  noID: z.string().min(1, { message: "Nomor identitas tidak boleh kosong" }),
});

// ✅ Add cross-field validation for nomor identitas (keep this validation)
const pemesanWithValidation = pemesanBaseSchema.refine(
  (data) => {
    const { jenisID, noID } = data;
    
    // ✅ Check if noID contains only numbers
    if (!/^\d+$/.test(noID)) {
      return false;
    }

    // ✅ Validate length based on jenisID
    switch (jenisID) {
      case "nik":
        return noID.length === 16;
      case "sim":
        return noID.length === 14;
      case "pasport":
        return noID.length === 8;
      default:
        return false;
    }
  },
  (data) => {
    const { jenisID, noID } = data;
    
    // ✅ Check if it's not numeric first
    if (!/^\d+$/.test(noID)) {
      return { 
        message: "Nomor identitas harus berupa angka",
        path: ["noID"]
      };
    }

    // ✅ Return specific error message based on jenisID
    switch (jenisID) {
      case "nik":
        return { 
          message: "NIK (KTP) harus 16 digit angka", 
          path: ["noID"] 
        };
      case "sim":
        return { 
          message: "SIM harus 14 digit angka", 
          path: ["noID"] 
        };
      case "pasport":
        return { 
          message: "Paspor harus 8 digit angka", 
          path: ["noID"] 
        };
      default:
        return { 
          message: "Jenis identitas tidak valid", 
          path: ["noID"] 
        };
    }
  }
);

// ✅ Main pemesan schema
export const pemesanSchema = pemesanWithValidation;

// ✅ Export type
export type PemesanFormData = z.infer<typeof pemesanSchema>;

// ✅ Helper function to get identity format info for pemesan
export const getPemesanIdentityFormat = (jenisID: "nik" | "sim" | "pasport") => {
  switch (jenisID) {
    case "nik":
      return {
        label: "NIK (KTP)",
        digits: 16,
        placeholder: "Contoh: 1234567890123456",
        description: "16 digit angka sesuai KTP"
      };
    case "sim":
      return {
        label: "SIM",
        digits: 14,
        placeholder: "Contoh: 12345678901234",
        description: "14 digit angka sesuai SIM"
      };
    case "pasport":
      return {
        label: "Paspor",
        digits: 8,
        placeholder: "Contoh: 12345678",
        description: "8 digit angka sesuai Paspor"
      };
    default:
      return {
        label: "Identitas",
        digits: 0,
        placeholder: "Pilih jenis identitas terlebih dahulu",
        description: ""
      };
  }
};

// ✅ Validation helper for real-time input pemesan
export const validatePemesanIdentityInput = (jenisID: string, noID: string) => {
  if (!noID) return { isValid: true, message: "" };
  
  // Only allow numbers
  if (!/^\d*$/.test(noID)) {
    return { isValid: false, message: "Hanya boleh angka" };
  }
  
  const format = getPemesanIdentityFormat(jenisID as "nik" | "sim" | "pasport");
  
  if (noID.length > format.digits) {
    return { isValid: false, message: `Maksimal ${format.digits} digit` };
  }
  
  if (noID.length < format.digits && noID.length > 0) {
    return { 
      isValid: false, 
      message: `${format.label} memerlukan ${format.digits} digit (${noID.length}/${format.digits})` 
    };
  }
  
  return { isValid: true, message: "" };
};

// ✅ Simplified helper function to validate phone number format
export const validatePhoneNumber = (nohp: string) => {
  if (!nohp) return { isValid: true, message: "" };
  
  // Only allow numbers
  if (!/^\d*$/.test(nohp)) {
    return { isValid: false, message: "Hanya boleh angka" };
  }
  
  // ✅ Change max from 15 to 14 to match schema
  if (nohp.length > 14) {
    return { isValid: false, message: "Nomor HP maksimal 14 digit" };
  }
  
  if (nohp.length > 0 && nohp.length < 10) {
    return { 
      isValid: false, 
      message: `Nomor HP minimal 10 digit (${nohp.length}/10)` 
    };
  }
  
  return { isValid: true, message: "" };
};