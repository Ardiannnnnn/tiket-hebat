"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useFormContext, FieldErrors, Controller } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import {
  User,
  Phone,
  Mail,
  CreditCard,
  CheckSquare,
  UserCheck,
} from "lucide-react";

export default function FormPemesan() {
  const {
    register,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const fieldErrors = errors as FieldErrors;
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    const storedData = sessionStorage.getItem("dataPenumpang");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      const firstPassenger =
        parsedData.penumpang?.[0] || parsedData.kendaraan?.[0];

      if (isChecked && firstPassenger) {
        setValue("nama", firstPassenger.nama);
        setValue("jenisID", firstPassenger.jenis_id);
        setValue("noID", firstPassenger.nomor_identitas || "");

        const pemesanData = {
          nama: firstPassenger.nama || "",
          jenisID: firstPassenger.jenis_id,
          noID: firstPassenger.nomor_identitas || "",
        };
        sessionStorage.setItem("dataPemesan", JSON.stringify(pemesanData));
      }
    }
  }, [isChecked, setValue]);

  return (
    <div className="space-y-4">
      {/* Checkbox untuk auto-fill */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
          />
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">
              Samakan dengan data penumpang
            </span>
          </div>
        </label>
      </div>

      {/* Form Card */}
      <Card className="shadow-md py-0 gap-0">
        <CardHeader className="border-b p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-purple-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Data Pemesan</h2>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nama */}
            <div className="space-y-2">
              <Label
                htmlFor="nama"
                className="flex items-center gap-2 text-gray-700 font-medium"
              >
                <User className="w-4 h-4" />
                Nama Lengkap
              </Label>
              <Input
                id="nama"
                className="h-11"
                placeholder="Nama sesuai identitas"
                {...register("nama", { required: "Nama wajib diisi" })}
              />
              {fieldErrors.nama && (
                <p className="text-red-500 text-xs">
                  {fieldErrors.nama.message as string}
                </p>
              )}
            </div>

            {/* No HP */}
            <div className="space-y-2">
              <Label
                htmlFor="nohp"
                className="flex items-center gap-2 text-gray-700 font-medium"
              >
                <Phone className="w-4 h-4" />
                Nomor Handphone
              </Label>
              <Input
                id="nohp"
                className="h-11"
                placeholder="Contoh: 08123456789"
                {...register("nohp", { required: "No HP wajib diisi" })}
              />
              {fieldErrors.nohp && (
                <p className="text-red-500 text-xs">
                  {fieldErrors.nohp.message as string}
                </p>
              )}
            </div>

            {/* Jenis ID */}
            <div className="space-y-2">
              <Label
                htmlFor="jenisID"
                className="flex items-center gap-2 text-gray-700 font-medium"
              >
                <CreditCard className="w-4 h-4" />
                Jenis Identitas
              </Label>
              <Controller
                name="jenisID"
                control={control}
                rules={{ required: "Jenis identitas wajib dipilih" }}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);  
                      setValue("jenisID", value);
                    }}
                    value={watch("jenisID") ?? field.value}
                  >
                    <SelectTrigger className="h-11 w-full">
                      <SelectValue placeholder="Pilih jenis identitas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nik">NIK (KTP)</SelectItem>
                      <SelectItem value="sim">SIM</SelectItem>
                      <SelectItem value="pasport">Paspor</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {fieldErrors.jenisID && (
                <p className="text-red-500 text-xs">
                  {fieldErrors.jenisID.message as string}
                </p>
              )}
            </div>

            {/* No ID */}
            <div className="space-y-2">
              <Label
                htmlFor="noID"
                className="flex items-center gap-2 text-gray-700 font-medium"
              >
                <CreditCard className="w-4 h-4" />
                Nomor Identitas
              </Label>
              <Input
                id="noID"
                className="h-11"
                placeholder="Nomor identitas"
                {...register("noID", { required: "Nomor identitas wajib diisi" })}
              />
              {fieldErrors.noID && (
                <p className="text-red-500 text-xs">
                  {fieldErrors.noID.message as string}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2 md:col-span-2">
              <Label
                htmlFor="email"
                className="flex items-center gap-2 text-gray-700 font-medium"
              >
                <Mail className="w-4 h-4" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                className="h-11"
                placeholder="contoh@email.com"
                {...register("email", {
                  required: "Email wajib diisi",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Format email tidak valid",
                  },
                })}
              />
              {fieldErrors.email && (
                <p className="text-red-500 text-xs">
                  {fieldErrors.email.message as string}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
