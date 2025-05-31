"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Label } from "@radix-ui/react-label";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { penumpangSchema, PenumpangFormSchema } from "@/lib/penumpangSchema";
import type { SessionData } from "@/types/session";

interface FormPenumpangProps {
  session: SessionData;
}

const STORAGE_KEY = "dataPenumpang";

export default function FormPenumpang({ session }: FormPenumpangProps) {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const searchParams = useSearchParams();
  const sessionId = searchParams?.get("session_id");

  const passengerTickets = session.tickets.filter(
    (t) => t.class.type === "passenger"
  );
  const vehicleTickets = session.tickets.filter(
    (t) => t.class.type === "vehicle"
  );

  const [initialized, setInitialized] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<PenumpangFormSchema>({
    resolver: zodResolver(penumpangSchema),
    defaultValues: {
      penumpang: [],
      kendaraan: [],
    },
  });

  const { fields: passengerFields, replace: replacePassenger } = useFieldArray({
    control,
    name: "penumpang",
  });

  const { fields: kendaraanFields, replace: replaceKendaraan } = useFieldArray({
    control,
    name: "kendaraan",
  });

  const penumpangValues = watch("penumpang");

  // Initialize only once
  useEffect(() => {
    if (!initialized) {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (
            parsed.penumpang?.length === passengerTickets.length &&
            parsed.kendaraan?.length === vehicleTickets.length
          ) {
            replacePassenger(parsed.penumpang);
            replaceKendaraan(parsed.kendaraan);
            reset(parsed);
            setInitialized(true);
            return;
          }
        } catch {}
      }

      const defaultPenumpang = passengerTickets.map(() => ({
        nama: "",
        jenis_kelamin: "pria" as const,
        jenis_id: "nik" as const,
        nomor_identitas: "",
        usia: "",
        alamat: "",
      }));

      const defaultKendaraan = vehicleTickets.map(() => ({
        nomor_polisi: "",
      }));

      replacePassenger(defaultPenumpang);
      replaceKendaraan(defaultKendaraan);
      reset({
        penumpang: defaultPenumpang,
        kendaraan: defaultKendaraan,
      });

      setInitialized(true);
    }
  }, [
    initialized,
    replacePassenger,
    replaceKendaraan,
    reset,
    passengerTickets,
    vehicleTickets,
  ]);

  useEffect(() => {
    if (initialized) {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          penumpang: watch("penumpang"),
          kendaraan: watch("kendaraan"),
        })
      );
    }
  }, [watch("penumpang"), watch("kendaraan"), initialized]);

  const onSubmit = (data: PenumpangFormSchema) => {
    const penumpangDenganKelas = data.penumpang.map((item, index) => ({
      ...item,
      usia: Number(item.usia),
      kelas: passengerTickets[index]?.class.class_name || "Tidak diketahui",
      ticket_id: passengerTickets[index]?.ticket_id,
    }));

    const kendaraanDenganKelas = data.kendaraan.map((item, index) => ({
      ...item,
      kelas: vehicleTickets[index]?.class.class_name || "Tidak diketahui",
      ticket_id: vehicleTickets[index]?.ticket_id,
    }));

    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        penumpang: penumpangDenganKelas,
        kendaraan: kendaraanDenganKelas,
      })
    );

    console.log("Penumpang yang disimpan:", penumpangDenganKelas);
    console.log("Kendaraan yang disimpan:", kendaraanDenganKelas);

    router.push(`/book/${id}/form/verifikasi?session_id=${sessionId}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="md:space-y-6 space-y-8">
      {kendaraanFields.map((field, index) => (
        <Card key={field.id} className={cn("py-0 gap-0")}>
          <CardHeader className="p-4 border-b flex flex-row justify-between">
            <p className="flex flex-col md:flex-row md:gap-2">
              Isi Data Kendaraan{" "}
              <span className="font-bold">
                ({vehicleTickets[index]?.class.class_name})
              </span>
            </p>
          </CardHeader>
          <div className="p-6">
            <div className="bg-red-300 flex items-center gap-6 p-4 rounded-lg">
              <div className="text-xl h-4 w-4 p-4 border border-red-500 rounded-full flex items-center justify-center">
                i
              </div>
              <div className="text-xs text-gray-600">
                <p>1. Isi Nomor Polisi sesuai dengan STNK.</p>
                <p>2. Golongan tidak sesuai akan dikenakan biaya tambahan.</p>
              </div>
            </div>
          </div>
          <CardContent className="p-4 md:px-8">
            <div className="grid grid-cols-2 gap-6 md:text-sm">
              <div className="w-full">
                <Label className="text-gray-600">Nomor Polisi</Label>
                <Input
                  className="h-10 placeholder:text-sm"
                  placeholder="Nomor Polisi"
                  {...register(`kendaraan.${index}.nomor_polisi`)}
                />
              </div>
              <div className="w-full">
                <label>Golongan</label>
                <Input
                  className={cn("h-10 placeholder:text-black")}
                  placeholder={vehicleTickets[index]?.class.class_name}
                  type="text"
                  readOnly
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {passengerFields.map((field, index) => (
        <Card key={field.id} className={cn("py-0 gap-0")}>
          <CardHeader className="p-4 border-b flex flex-row justify-between">
            <p className="flex flex-col md:flex-row md:gap-2">
              Isi Data Penumpang{" "}
              <span className="font-bold">
                ({passengerTickets[index]?.class.class_name})
              </span>
            </p>
          </CardHeader>
          <CardContent className="p-4 md:px-8">
            <div className="grid grid-cols-3 gap-6 md:text-sm">
              <div className="col-span-1">
                <Label className="text-gray-600 md:block hidden">
                  Jenis Kelamin
                </Label>
                <Label className="md:hidden">JK</Label>
                <Select
                  value={watch(`penumpang.${index}.jenis_kelamin`) || ""}
                  onValueChange={(val) =>
                    setValue(
                      `penumpang.${index}.jenis_kelamin`,
                      val as "pria" | "wanita"
                    )
                  }
                >
                  <SelectTrigger className="w-full h-10 placeholder:text-sm">
                    <SelectValue placeholder="Pria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pria">Pria</SelectItem>
                    <SelectItem value="wanita">Wanita</SelectItem>
                  </SelectContent>
                </Select>
                {errors.penumpang?.[index]?.jenis_kelamin && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.penumpang[index].jenis_kelamin?.message}
                  </p>
                )}
              </div>
              <div className="col-span-2">
                <Label className="text-gray-600">Nama Lengkap</Label>
                <Input
                  className="h-10 text-sm placeholder:text-sm"
                  placeholder="Masukkan Nama"
                  {...register(`penumpang.${index}.nama`)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Isi sesuai dengan KTP/SIM/Paspor (tanpa gelar khusus)
                </p>
                {errors.penumpang?.[index]?.nama && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.penumpang[index].nama?.message}
                  </p>
                )}
              </div>
              <div className="col-span-1">
                <Label className="text-gray-600">Jenis ID</Label>
                <Select
                  value={watch(`penumpang.${index}.jenis_id`) || ""}
                  onValueChange={(val) =>
                    setValue(
                      `penumpang.${index}.jenis_id`,
                      val as "nik" | "sim" | "paspor"
                    )
                  }
                >
                  <SelectTrigger className="w-full h-10 placeholder:text-sm">
                    <SelectValue placeholder="NIK" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nik">NIK</SelectItem>
                    <SelectItem value="sim">SIM</SelectItem>
                    <SelectItem value="paspor">Paspor</SelectItem>
                  </SelectContent>
                </Select>
                {errors.penumpang?.[index]?.jenis_id && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.penumpang[index].jenis_id?.message}
                  </p>
                )}
              </div>
              <div className="col-span-2">
                <Label className="text-gray-600">Nomor Identitas</Label>
                <Input
                  className="h-10 placeholder:text-sm"
                  placeholder="Masukkan Nomor"
                  {...register(`penumpang.${index}.nomor_identitas`)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Penumpang di bawah 18 tahun, isi dengan tanggal lahir
                  (hhbbtttt)
                </p>
                {errors.penumpang?.[index]?.nomor_identitas && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.penumpang[index].nomor_identitas?.message}
                  </p>
                )}
              </div>
              <div className="col-span-1">
                <Label className="text-gray-600">Usia</Label>
                <Input
                  className="h-10 placeholder:text-sm"
                  type="number"
                  placeholder="0"
                  {...register(`penumpang.${index}.usia`, {
                    valueAsNumber: true,
                  })}
                />
                {errors.penumpang?.[index]?.usia && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.penumpang[index].usia?.message}
                  </p>
                )}
              </div>
              <div className="col-span-2">
                <Label className="text-gray-600">Alamat</Label>
                <Input
                  className="h-10 placeholder:text-sm"
                  placeholder="Masukkan alamat"
                  {...register(`penumpang.${index}.alamat`)}
                />
                <p className="text-xs text-gray-500 mt-1">Contoh: Air Dingin</p>
                {errors.penumpang?.[index]?.alamat && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.penumpang[index].alamat?.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      <Button
        type="submit"
        className="w-full bg-Blue text-white hover:bg-teal-600"
      >
        Lanjutkan
      </Button>
    </form>
  );
}
