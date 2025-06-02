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

export default function FormPemesan() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  const fieldErrors = errors as FieldErrors;

  return (
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
                onValueChange={field.onChange}
                value={field.value || ""}
                defaultValue=""
              >
                <SelectTrigger id="jenisID" className="w-full mt-2">
                  <SelectValue placeholder="Pilih ID" />
                </SelectTrigger>
                <SelectContent className="mt-2">
                  <SelectGroup>
                    <SelectItem value="NIK">NIK</SelectItem>
                    <SelectItem value="SIM">SIM</SelectItem>
                    <SelectItem value="Passport">Passport</SelectItem>
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
  );
}
