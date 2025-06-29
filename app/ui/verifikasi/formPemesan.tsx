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
import { User, Phone, Mail, CreditCard, UserCheck } from "lucide-react";
import {
  getPemesanIdentityFormat,
  validatePemesanIdentityInput,
  validatePhoneNumber,
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

  // ✅ Enhanced auto-fill effect WITHOUT default values
  useEffect(() => {
    const storedData = sessionStorage.getItem("dataPenumpang");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        const firstPassenger =
          parsedData.penumpang?.[0] || parsedData.kendaraan?.[0];

        if (isChecked && firstPassenger) {
          console.log("🤖 Auto-filling data:", firstPassenger);

          // ✅ Only fill if data exists, don't use default values
          setValue("nama", firstPassenger.nama || "", {
            shouldValidate: true,
            shouldDirty: true,
          });

          // ✅ Only set jenisID if it actually exists in data
          const jenisIDValue =
            firstPassenger.jenis_id || firstPassenger.jenisID;
          if (jenisIDValue && jenisIDValue !== "") {
            setValue("jenisID", jenisIDValue, {
              shouldValidate: true,
              shouldDirty: true,
            });
          }

          // ✅ Only set noID if jenisID exists
          const noIDValue =
            firstPassenger.nomor_identitas || firstPassenger.noID;
          if (noIDValue && noIDValue !== "" && jenisIDValue) {
            setValue("noID", noIDValue, {
              shouldValidate: true,
              shouldDirty: true,
            });
          }

          console.log("✅ Auto-fill completed with actual data only");
        } else if (!isChecked) {
          // ✅ Clear form when unchecked - back to placeholder state
          setValue("nama", "", { shouldValidate: true });
          setValue("jenisID", "", { shouldValidate: true }); // ✅ Empty string for placeholder
          setValue("noID", "", { shouldValidate: true });
          setValue("nohp", "", { shouldValidate: true });
          setValue("email", "", { shouldValidate: true });
          sessionStorage.removeItem("dataPemesan");
          console.log("🧹 Form cleared, back to placeholder state");
        }
      } catch (error) {
        console.error("❌ Error in auto-fill:", error);
      }
    }
  }, [isChecked, setValue]);

  return (
    <div className="space-y-4">
      {/* ✅ Auto-fill Checkbox */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            checked={isChecked}
            onChange={(e) => {
              console.log("☑️ Checkbox toggled:", e.target.checked);
              setIsChecked(e.target.checked);
            }}
          />
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">
              Samakan dengan data penumpang
            </span>
          </div>
        </label>

        {/* ✅ Helper text */}
        <p className="text-xs text-blue-600 mt-1 ml-7">
          {isChecked
            ? "✅ Data akan diisi otomatis dari penumpang pertama"
            : "Centang untuk mengisi data otomatis dari penumpang"}
        </p>
      </div>

      {/* ✅ Form Card */}
      <Card className="shadow-md py-0 gap-0">
        <CardHeader className="border-b p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Data Pemesan
              </h2>
              <p className="text-sm text-gray-600">
                Isi data orang yang memesan tiket
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* ✅ Nama Field */}
            <div className="space-y-2">
              <Label
                htmlFor="nama"
                className="flex items-center gap-2 text-gray-700 text-sm"
              >
                <User className="w-4 h-4" />
                Nama Lengkap
              </Label>
              <Input
                id="nama"
                className="h-11 placeholder:text-sm text-sm"
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
                <span
                  className={`${
                    (watch("nama")?.length || 0) > 40
                      ? "text-amber-600"
                      : "text-gray-400"
                  }`}
                >
                  {watch("nama")?.length || 0}/50
                </span>
              </div>
              {fieldErrors.nama && (
                <p className="text-red-500 text-xs">
                  {fieldErrors.nama.message as string}
                </p>
              )}
            </div>

            {/* ✅ No HP Field */}
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
                className="h-11 placeholder:text-sm text-sm"
                placeholder="Contoh: 08123456789"
                maxLength={14}
                inputMode="numeric"
                {...register("nohp", {
                  required: "Nomor HP tidak boleh kosong",
                  minLength: {
                    value: 10,
                    message: "Nomor HP minimal 10 digit",
                  },
                  maxLength: {
                    value: 14,
                    message: "Nomor HP maksimal 14 digit",
                  },
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "Nomor HP hanya boleh angka",
                  },
                })}
                onInput={(e) => {
                  const target = e.target as HTMLInputElement;
                  let value = target.value.replace(/[^0-9]/g, "");
                  if (value.length > 14) {
                    value = value.substring(0, 14);
                  }
                  target.value = value;

                  // ✅ Trigger setValue to update form state
                  setValue("nohp", value, { shouldValidate: true });
                }}
              />

              {(() => {
                const currentNohp = watch("nohp") || "";
                const validation = validatePhoneNumber(currentNohp);
                return (
                  <>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">
                        Nomor HP aktif (10-14 digit)
                      </span>
                      <span
                        className={`${
                          !validation.isValid
                            ? "text-red-500"
                            : currentNohp.length >= 10 &&
                              currentNohp.length <= 14
                            ? "text-green-600"
                            : "text-gray-400"
                        }`}
                      >
                        {currentNohp.length}/14
                      </span>
                    </div>
                    {!validation.isValid && validation.message && (
                      <p className="text-xs text-amber-600">
                        {validation.message}
                      </p>
                    )}
                  </>
                );
              })()}

              {/* ✅ Show form errors */}
              {fieldErrors.nohp && (
                <p className="text-red-500 text-xs flex items-center gap-1">
                  <span>⚠</span>
                  {fieldErrors.nohp.message as string}
                </p>
              )}
            </div>

            {/* ✅ Enhanced Jenis ID Select with proper placeholder */}
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
                render={({ field }) => {
                  const currentValue = field.value;

                  return (
                    <Select
                      onValueChange={(value) => {
                        console.log("🔄 Jenis ID selected:", value);
                        field.onChange(value);
                        setValue("jenisID", value, {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                        // ✅ Clear noID when jenisID changes
                        setValue("noID", "", { shouldValidate: true });
                      }}
                      value={currentValue || ""} // ✅ Empty string shows placeholder
                    >
                      <SelectTrigger className="h-11 w-full">
                        <SelectValue placeholder="Pilih jenis identitas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nik">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span>NIK (KTP)</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="sim">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span>SIM</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="pasport">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                            <span>Paspor</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  );
                }}
              />

              {fieldErrors.jenisID && (
                <p className="text-red-500 text-xs flex items-center gap-1">
                  <span>⚠</span>
                  {fieldErrors.jenisID.message as string}
                </p>
              )}

              {/* ✅ Helper text */}
              <div className="text-xs text-gray-500">
                Pilih jenis dokumen identitas yang akan digunakan
              </div>
            </div>

            {/* ✅ Enhanced No ID Field */}
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
                const validation = validatePemesanIdentityInput(
                  currentJenisID,
                  currentNoID
                );

                return (
                  <>
                    <Input
                      id="noID"
                      className={`h-11 placeholder:text-sm text-sm ${
                        !validation.isValid
                          ? "border-red-300 focus:border-red-500"
                          : ""
                      }`}
                      placeholder={
                        currentJenisID
                          ? format.placeholder
                          : "Pilih jenis identitas terlebih dahulu"
                      }
                      maxLength={format.digits}
                      inputMode="numeric"
                      {...register("noID")}
                      onInput={(e) => {
                        const target = e.target as HTMLInputElement;
                        target.value = target.value.replace(/[^0-9]/g, "");
                      }}
                      disabled={!currentJenisID} // ✅ Disable if no jenisID selected
                    />
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">
                        {currentJenisID
                          ? format.description
                          : "Pilih jenis identitas untuk melanjutkan"}
                      </span>
                      <span
                        className={`${
                          !currentJenisID
                            ? "text-gray-400"
                            : !validation.isValid
                            ? "text-red-500"
                            : currentNoID.length === format.digits
                            ? "text-green-600"
                            : "text-gray-400"
                        }`}
                      >
                        {currentJenisID
                          ? `${currentNoID.length}/${format.digits}`
                          : "0/0"}
                      </span>
                    </div>
                    {currentJenisID &&
                      !validation.isValid &&
                      validation.message && (
                        <p className="text-xs text-amber-600">
                          {validation.message}
                        </p>
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

            {/* ✅ Email Field */}
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
                className="h-11 placeholder:text-sm text-sm"
                placeholder="contoh@email.com"
                maxLength={100}
                {...register("email")}
              />
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">
                  Email untuk konfirmasi pemesanan
                </span>
                <span
                  className={`${
                    (watch("email")?.length || 0) > 80
                      ? "text-amber-600"
                      : "text-gray-400"
                  }`}
                >
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
