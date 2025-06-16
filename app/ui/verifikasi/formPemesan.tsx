"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useFormContext, FieldErrors, Controller } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

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

      // Ambil data dari penumpang atau kendaraan
      const firstPassenger =
        parsedData.penumpang?.[0] || parsedData.kendaraan?.[0];
      if (isChecked && firstPassenger) {
        setValue("nama", firstPassenger.nama);
        setValue("jenisID", firstPassenger.jenis_id); // Default jenis ID
        setValue("noID", firstPassenger.nomor_identitas || "");

        // Simpan data ke sessionStorage
        const pemesanData = {
          nama: firstPassenger.nama || "",
          jenisID: firstPassenger.jenis_id, // Default ke NIK jika tidak ada
          noID: firstPassenger.nomor_identitas || "",
        };
        sessionStorage.setItem("dataPemesan", JSON.stringify(pemesanData));
      }
    }
  }, [isChecked, setValue]);

  return (
    <>
      <div className="col-span-2 mb-2">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="h-4 w-4"
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
          />
          <span className="text-sm text-gray-500">Samakan dengan data pelanggan</span>
        </label>
      </div>
      <Card className={cn("py-0 gap-0")}>
        <CardHeader className="border-b p-4 text-center">
          <h2 className="text-base font-semibold">Data Pemesan</h2>
        </CardHeader>
        <CardContent className="p-4 grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="nama">Nama</Label>
            <Input
              id="nama"
              className="mt-2 text-sm"
              {...register("nama", { required: "Nama wajib diisi" })}
            />
            {fieldErrors.nama && (
              <p className="text-red-500 text-sm">
                {fieldErrors.nama.message as string}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="nohp">No HP</Label>
            <Input
              id="nohp"
              className="mt-2 text-sm"
              {...register("nohp", { required: "No HP wajib diisi" })}
            />
            {fieldErrors.nohp && (
              <p className="text-red-500 text-sm">
                {fieldErrors.nohp.message as string}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="idType">ID</Label>
            <Controller
              name="jenisID"
              control={control}
              rules={{ required: "ID Type wajib dipilih" }}
              render={({ field }) => (
                <Select
                  onValueChange={(value) => {
                    field.onChange(value); // Perbarui nilai di react-hook-form
                    setValue("jenisID", value); // Pastikan nilai diperbarui di form
                  }}
                  value={watch("jenisID") ?? field.value}
                >
                  <SelectTrigger id="jenisID" className="w-full mt-2">
                    <SelectValue placeholder="Pilih ID" />
                  </SelectTrigger>
                  <SelectContent className="mt-2">
                    <SelectGroup>
                      <SelectItem value="nik">NIK</SelectItem>
                      <SelectItem value="sim">SIM</SelectItem>
                      <SelectItem value="pasport">Passport</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {fieldErrors.jenisID && (
              <p className="text-red-500 text-sm mt-1">
                {fieldErrors.jenisID.message as string}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="noId">No ID</Label>
            <Input
              id="noID"
              className="mt-2 text-sm"
              {...register("noID", { required: "No ID wajib diisi" })}
            />
            {fieldErrors.noID && (
              <p className="text-red-500 text-sm mt-1">
                {fieldErrors.noID.message as string}
              </p>
            )}
          </div>
          <div className="col-span-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              className="mt-2 text-sm"
              {...register("email", { required: "Email wajib diisi" })}
            />
            {fieldErrors.email && (
              <p className="text-red-500 text-sm">
                {fieldErrors.email.message as string}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
