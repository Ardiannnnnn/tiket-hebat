"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { penumpangSchema, PenumpangFormSchema } from "@/lib/penumpangSchema";
import type { SessionData } from "@/types/session";

interface FormPenumpangProps {
  session: SessionData;
}

const STORAGE_KEY_PASSENGER = "dataPenumpang";
const STORAGE_KEY_VEHICLE = "dataKendaraan";

export default function FormPenumpang({ session }: FormPenumpangProps) {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const searchParams = useSearchParams();
  const sessionId = searchParams?.get("session_id");

  // === Penumpang form setup ===
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
      kendaraan: [],
      penumpang: [],
    },
  });

  const { fields: passengerFields, replace: replacePassengers } = useFieldArray(
    {
      control,
      name: "penumpang",
    }
  );

  const { fields: vehicleFields, replace: replaceVehicles } = useFieldArray({
    control,
    name: "kendaraan",
  });

  // Watch form values for saving to sessionStorage
  const penumpangValues = watch("penumpang");
  const kendaraanValues = watch("kendaraan");

  // Load saved data from sessionStorage or from session on mount
  useEffect(() => {
    // Load penumpang from sessionStorage
    const savedPenumpang = sessionStorage.getItem(STORAGE_KEY_PASSENGER);
    // Load kendaraan from sessionStorage
    const savedKendaraan = sessionStorage.getItem(STORAGE_KEY_VEHICLE);

    if (savedPenumpang) {
      try {
        const parsedPenumpang = JSON.parse(savedPenumpang);
        if (
          Array.isArray(parsedPenumpang) &&
          parsedPenumpang.length ===
            session.tickets.filter((t) => t.class.type === "passenger").length
        ) {
          replacePassengers(parsedPenumpang);
          reset((formValues) => ({
            ...formValues,
            penumpang: parsedPenumpang,
          }));
          // Do NOT return here, still want to load kendaraan
        }
      } catch {
        // ignore error
      }
    }

    if (savedKendaraan) {
      try {
        const parsedKendaraan = JSON.parse(savedKendaraan);
        if (
          Array.isArray(parsedKendaraan) &&
          parsedKendaraan.length ===
            session.tickets.filter((t) => t.class.type === "vehicle").length
        ) {
          replaceVehicles(parsedKendaraan);
          reset((formValues) => ({
            ...formValues,
            kendaraan: parsedKendaraan,
          }));
        }
      } catch {
        // ignore error
      }
    }

    // If no saved penumpang, init from session.tickets penumpang
    if (!savedPenumpang && session?.tickets) {
      const penumpangDefaults = session.tickets
        .filter((t) => t.class.type === "passenger")
        .map(() => ({
          nama: "",
          jenis_kelamin: "pria" as const,
          jenis_id: "nik" as const,
          nomor_identitas: "",
          usia: "",
          alamat: "",
        }));
      replacePassengers(penumpangDefaults);
      reset((formValues) => ({ ...formValues, penumpang: penumpangDefaults }));
    }

    // If no saved kendaraan, init from session.tickets kendaraan
    if (!savedKendaraan && session?.tickets) {
      const kendaraanDefaults = session.tickets
        .filter((t) => t.class.type === "vehicle")
        .map(() => ({
          nomor_polisi: "",
          Golos_Text: "",
        }));
      replaceVehicles(kendaraanDefaults);
      reset((formValues) => ({ ...formValues, kendaraan: kendaraanDefaults }));
    }
  }, [session, replacePassengers, replaceVehicles, reset]);

  // Save penumpang to sessionStorage on change
  useEffect(() => {
    if (penumpangValues && penumpangValues.length > 0) {
      sessionStorage.setItem(
        STORAGE_KEY_PASSENGER,
        JSON.stringify(penumpangValues)
      );
    }
  }, [penumpangValues]);

  // Save kendaraan to sessionStorage on change
  useEffect(() => {
    if (kendaraanValues && kendaraanValues.length > 0) {
      sessionStorage.setItem(
        STORAGE_KEY_VEHICLE,
        JSON.stringify(kendaraanValues)
      );
    }
  }, [kendaraanValues]);

  const onSubmit = (data: PenumpangFormSchema) => {
    // Tambah kelas dan ticket_id ke penumpang sesuai urutan penumpang dalam session.tickets
    const penumpangDenganKelas = data.penumpang.map((item, idx) => {
      const penumpangTicket = session.tickets.filter(
        (t) => t.class.type === "passenger"
      )[idx];
      return {
        ...item,
        usia: Number(item.usia),
        kelas: penumpangTicket?.class.class_name || "Tidak diketahui",
        ticket_id: penumpangTicket?.ticket_id,
      };
    });

    // Tambah kelas dan ticket_id ke kendaraan sesuai urutan kendaraan dalam session.tickets
    const kendaraanDenganKelas = data.kendaraan.map((item, idx) => {
      const kendaraanTicket = session.tickets.filter(
        (t) => t.class.type === "vehicle"
      )[idx];
      return {
        ...item,
        kelas: kendaraanTicket?.class.class_name || "Tidak diketahui",
        ticket_id: kendaraanTicket?.ticket_id,
      };
    });

    // Simpan ke sessionStorage (bisa sesuaikan jika mau kirim ke backend)
    sessionStorage.setItem(
      STORAGE_KEY_PASSENGER,
      JSON.stringify(penumpangDenganKelas)
    );
    sessionStorage.setItem(
      STORAGE_KEY_VEHICLE,
      JSON.stringify(kendaraanDenganKelas)
    );

    console.log("Data penumpang disimpan:", penumpangDenganKelas);
    console.log("Data kendaraan disimpan:", kendaraanDenganKelas);

    router.push(`/book/${id}/form/verifikasi?session_id=${sessionId}`);
  };

  // Filter tickets by type, to display in order and show class info on form header
  const penumpangTickets = session.tickets.filter(
    (t) => t.class.type === "passenger"
  );
  const kendaraanTickets = session.tickets.filter(
    (t) => t.class.type === "vehicle"
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="md:space-y-6 space-y-8">
      {/* Form Kendaraan */}
      {vehicleFields.map((field, index) => (
        <Card key={field.id} className={cn("py-0 gap-0")}>
          <CardHeader className="p-4 border-b flex flex-row justify-between">
            <p className="flex flex-col md:flex-row md:gap-2">
              Isi Data Kendaraan{" "}
              <span className="font-bold">
                ({kendaraanTickets[index]?.class.class_name})
              </span>
            </p>
          </CardHeader>
          <div className="p-6">
            <div className="bg-red-300 flex items-center gap-6 p-4 rounded-lg">
              <div className="text-xl h-4 w-4 p-4 border border-red-500 rounded-full flex items-center justify-center">
                i
              </div>
              <div className="text-xs text-gray-600">
                <p>
                  1. Isi Nomor Polisi sesuai dengan Nomor Polisi yang tertera
                  pada STNK.
                </p>
                <p>
                  2. Golongan Kendaraan yang tidak sesuai akan dikenakan biaya
                  tambahan.
                </p>
              </div>
            </div>
            </div>
          <CardContent className="p-4 md:px-8">
            <div className="grid grid-cols-3 gap-6 md:text-sm">
              {/* Nomor Polisi */}
              <div className="col-span-1">
                <Label className="text-gray-600">Nomor Polisi</Label>
                <Input
                  className="h-10 placeholder:text-sm"
                  placeholder="Nomor Polisi"
                  {...register(`kendaraan.${index}.nomor_polisi`)}
                />
              </div>
              <div className="w-full">
                    <label htmlFor="">Golongan</label>
                    <Input
                      className={cn("h-12")}
                      placeholder={kendaraanTickets[index]?.class.class_name}
                      type="text"
                      readOnly
                    />
                  </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Form Penumpang */}
      {passengerFields.map((field, index) => (
        <Card key={field.id} className={cn("py-0 gap-0")}>
          <CardHeader className="p-4 border-b flex flex-row justify-between">
            <p className="flex flex-col md:flex-row md:gap-2">
              Isi Data Penumpang{" "}
              <span className="font-bold">
                ({penumpangTickets[index]?.class.class_name})
              </span>
            </p>
          </CardHeader>
          <CardContent className="p-4 md:px-8">
            <div className="grid grid-cols-3 gap-6 md:text-sm">
              {/* Nama */}
              <div className="col-span-1">
                <Label className="text-gray-600">Nama</Label>
                <Input
                  className="h-10 placeholder:text-sm"
                  placeholder="Nama"
                  {...register(`penumpang.${index}.nama`)}
                />
                {errors.penumpang?.[index]?.nama && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors.penumpang[index]?.nama?.message}
                  </p>
                )}
              </div>

              {/* Jenis Kelamin */}
              <div className="col-span-1">
                <Label className="text-gray-600">Jenis Kelamin</Label>
                <Select
                  defaultValue="pria"
                  {...register(`penumpang.${index}.jenis_kelamin`)}
                >
                  <SelectTrigger className="h-10 w-full">
                    <SelectValue placeholder="Pilih Jenis Kelamin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pria">Pria</SelectItem>
                    <SelectItem value="wanita">Wanita</SelectItem>
                  </SelectContent>
                </Select>
                {errors.penumpang?.[index]?.jenis_kelamin && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors.penumpang[index]?.jenis_kelamin?.message}
                  </p>
                )}
              </div>

              {/* Jenis ID */}
              <div className="col-span-1">
                <Label className="text-gray-600">Jenis ID</Label>
                <Select
                  defaultValue="nik"
                  {...register(`penumpang.${index}.jenis_id`)}
                >
                  <SelectTrigger className="h-10 w-full">
                    <SelectValue placeholder="Pilih Jenis ID" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nik">NIK</SelectItem>
                    <SelectItem value="passport">Passport</SelectItem>
                    <SelectItem value="sim">SIM</SelectItem>
                  </SelectContent>
                </Select>
                {errors.penumpang?.[index]?.jenis_id && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors.penumpang[index]?.jenis_id?.message}
                  </p>
                )}
              </div>

              {/* Nomor Identitas */}
              <div className="col-span-1">
                <Label className="text-gray-600">Nomor Identitas</Label>
                <Input
                  className="h-10 placeholder:text-sm"
                  placeholder="Nomor Identitas"
                  {...register(`penumpang.${index}.nomor_identitas`)}
                />
                {errors.penumpang?.[index]?.nomor_identitas && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors.penumpang[index]?.nomor_identitas?.message}
                  </p>
                )}
              </div>

              {/* Usia */}
              <div className="col-span-1">
                <Label className="text-gray-600">Usia</Label>
                <Input
                  className="h-10 placeholder:text-sm"
                  type="number"
                  min={0}
                  placeholder="Usia"
                  {...register(`penumpang.${index}.usia`)}
                />
                {errors.penumpang?.[index]?.usia && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors.penumpang[index]?.usia?.message}
                  </p>
                )}
              </div>

              {/* Alamat */}
              <div className="col-span-3">
                <Label className="text-gray-600">Alamat</Label>
                <Input
                  className="h-10 placeholder:text-sm"
                  placeholder="Alamat"
                  {...register(`penumpang.${index}.alamat`)}
                />
                {errors.penumpang?.[index]?.alamat && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors.penumpang[index]?.alamat?.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <Button type="submit" className="w-full md:w-auto">
        Lanjutkan
      </Button>
    </form>
  );
}
