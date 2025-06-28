"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  UserCheck,
} from "lucide-react";
import { 
  getPemesanIdentityFormat, 
  validatePemesanIdentityInput, 
  validatePhoneNumber 
} from "@/lib/pemesanSchema";

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
                maxLength={50}
                {...register("nama")}
                onInput={(e) => {
                  const target = e.target as HTMLInputElement;
                  target.value = target.value.replace(/[^a-zA-Z\s]/g, "");
                }}
              />
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">
                  Sesuai identitas (huruf saja)
                </span>
                <span className={`${
                  (watch("nama")?.length || 0) > 40
                    ? "text-amber-600"
                    : "text-gray-400"
                }`}>
                  {watch("nama")?.length || 0}/50
                </span>
              </div>
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
                maxLength={15}
                inputMode="numeric"
                {...register("nohp")}
                onInput={(e) => {
                  const target = e.target as HTMLInputElement;
                  target.value = target.value.replace(/[^0-9]/g, "");
                }}
              />
              {(() => {
                const currentNohp = watch("nohp") || "";
                const validation = validatePhoneNumber(currentNohp);
                return (
                  <>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">
                        Dimulai dengan 08 atau 62
                      </span>
                      <span className={`${
                        !validation.isValid ? "text-red-500" : 
                        currentNohp.length >= 10 ? "text-green-600" : "text-gray-400"
                      }`}>
                        {currentNohp.length}/15
                      </span>
                    </div>
                    {!validation.isValid && validation.message && (
                      <p className="text-xs text-amber-600">{validation.message}</p>
                    )}
                  </>
                );
              })()}
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
              {(() => {
                const currentJenisID = watch("jenisID");
                const currentNoID = watch("noID") || "";
                const format = getPemesanIdentityFormat(currentJenisID);
                const validation = validatePemesanIdentityInput(currentJenisID, currentNoID);

                return (
                  <>
                    <Input
                      id="noID"
                      className={`h-11 ${!validation.isValid ? "border-red-300 focus:border-red-500" : ""}`}
                      placeholder={format.placeholder}
                      maxLength={format.digits}
                      inputMode="numeric"
                      {...register("noID")}
                      onInput={(e) => {
                        const target = e.target as HTMLInputElement;
                        target.value = target.value.replace(/[^0-9]/g, "");
                      }}
                    />
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">{format.description}</span>
                      <span className={`${
                        !validation.isValid ? "text-red-500" : 
                        currentNoID.length === format.digits ? "text-green-600" : "text-gray-400"
                      }`}>
                        {currentNoID.length}/{format.digits}
                      </span>
                    </div>
                    {!validation.isValid && validation.message && (
                      <p className="text-xs text-amber-600">{validation.message}</p>
                    )}
                  </>
                );
              })()}
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
                maxLength={100}
                {...register("email")}
              />
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">
                  Email untuk konfirmasi pemesanan
                </span>
                <span className={`${
                  (watch("email")?.length || 0) > 80
                    ? "text-amber-600"
                    : "text-gray-400"
                }`}>
                  {watch("email")?.length || 0}/100
                </span>
              </div>
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
