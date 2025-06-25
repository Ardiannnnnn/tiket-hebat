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
import { penumpangSchema } from "@/lib/penumpangSchema";
import type { SessionData } from "@/types/session";
import { toast } from "sonner";
import type { z } from "zod";
import {
  Car,
  Users,
  Info,
  ArrowRight,
  User,
  CreditCard,
  MapPin,
  Calendar,
} from "lucide-react";

interface FormPenumpangProps {
  session: SessionData;
}

const STORAGE_KEY = "dataPenumpang";

type PenumpangFormSchema = z.infer<typeof penumpangSchema>;

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

  // Initialize form data
  useEffect(() => {
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
      usia: 0,
      alamat: "",
    }));

    const defaultKendaraan = vehicleTickets.map(() => ({
      nomor_polisi: "",
      nama: "",
      alamat: "",
      usia: 0,
    }));

    replacePassenger(defaultPenumpang);
    replaceKendaraan(defaultKendaraan);
    reset({
      penumpang: defaultPenumpang,
      kendaraan: defaultKendaraan,
    });

    setInitialized(true);
  }, [passengerTickets.length, vehicleTickets.length]);

  // Save form data to session storage
  useEffect(() => {
    if (initialized) {
      const formData = {
        penumpang: watch("penumpang"),
        kendaraan: watch("kendaraan"),
      };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    }
  }, [watch("penumpang"), watch("kendaraan"), initialized]);

  const onSubmit = (data: PenumpangFormSchema) => {
    if (passengerTickets.length === 0 && vehicleTickets.length === 0) {
      toast.error("Pilih tiket terlebih dahulu");
      return;
    }

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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Vehicle Forms */}
      {kendaraanFields.map((field, index) => (
        <Card key={field.id} className="shadow-md py-0 gap-0">
          <CardHeader className="p-4 border-b bg-green-50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Car className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Data Kendaraan</h3>
                <p className="text-sm text-gray-600">
                  {vehicleTickets[index]?.class.class_name}
                </p>
              </div>
            </div>
          </CardHeader>

          {/* Info Notice */}
          <div className="p-4 bg-amber-50 border-l-4 border-amber-400">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-medium mb-1">Perhatian:</p>
                <ul className="space-y-1">
                  <li>• Isi Nomor Polisi sesuai dengan STNK</li>
                  <li>• Golongan tidak sesuai akan dikenakan biaya tambahan</li>
                </ul>
              </div>
            </div>
          </div>

          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-gray-700 font-medium">
                  <CreditCard className="w-4 h-4" />
                  Nomor Polisi
                </Label>
                <Input
                  className="h-11"
                  placeholder="Contoh: B 1234 XYZ"
                  {...register(`kendaraan.${index}.nomor_polisi`)}
                />
                {errors.kendaraan?.[index]?.nomor_polisi && (
                  <p className="text-xs text-red-500">
                    {errors.kendaraan[index].nomor_polisi?.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-gray-700 font-medium">
                  <Car className="w-4 h-4" />
                  Golongan Kendaraan
                </Label>
                <Input
                  className="h-11 bg-gray-50"
                  value={vehicleTickets[index]?.class.class_name}
                  readOnly
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-gray-700 font-medium">
                  <User className="w-4 h-4" />
                  Nama Pemilik
                </Label>
                <Input
                  className="h-11"
                  placeholder="Nama sesuai STNK"
                  {...register(`kendaraan.${index}.nama`)}
                />
                {errors.kendaraan?.[index]?.nama && (
                  <p className="text-xs text-red-500">
                    {errors.kendaraan[index].nama?.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-gray-700 font-medium">
                  <Calendar className="w-4 h-4" />
                  Usia
                </Label>
                <Input
                  className="h-11"
                  type="number"
                  placeholder="Usia pemilik"
                  {...register(`kendaraan.${index}.usia`, {
                    valueAsNumber: true,
                  })}
                />
                {errors.kendaraan?.[index]?.usia && (
                  <p className="text-xs text-red-500">
                    {errors.kendaraan[index].usia?.message}
                  </p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label className="flex items-center gap-2 text-gray-700 font-medium">
                  <MapPin className="w-4 h-4" />
                  Alamat
                </Label>
                <Input
                  className="h-11"
                  placeholder="Alamat lengkap"
                  {...register(`kendaraan.${index}.alamat`)}
                />
                {errors.kendaraan?.[index]?.alamat && (
                  <p className="text-xs text-red-500">
                    {errors.kendaraan[index].alamat?.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Passenger Forms */}
      {passengerFields.map((field, index) => (
        <Card key={field.id} className="shadow-md py-0 gap-0">
          <CardHeader className="p-4 border-b">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">
                  Data Penumpang {index + 1}
                </h3>
                <p className="text-sm text-gray-600">
                  {passengerTickets[index]?.class.class_name}
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Jenis Kelamin */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-gray-700 font-medium">
                  <User className="w-4 h-4" />
                  Jenis Kelamin
                </Label>
                <Select
                  value={watch(`penumpang.${index}.jenis_kelamin`) || ""}
                  onValueChange={(val) =>
                    setValue(
                      `penumpang.${index}.jenis_kelamin`,
                      val as "pria" | "wanita"
                    )
                  }
                >
                  <SelectTrigger className="h-11 w-full">
                    <SelectValue placeholder="Pilih jenis kelamin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pria">Pria</SelectItem>
                    <SelectItem value="wanita">Wanita</SelectItem>
                  </SelectContent>
                </Select>
                {errors.penumpang?.[index]?.jenis_kelamin && (
                  <p className="text-xs text-red-500">
                    {errors.penumpang[index].jenis_kelamin?.message}
                  </p>
                )}
              </div>

              {/* Nama Lengkap */}
              <div className="space-y-2 md:col-span-2">
                <Label className="flex items-center gap-2 text-gray-700 font-medium">
                  <User className="w-4 h-4" />
                  Nama Lengkap
                </Label>
                <Input
                  className="h-11"
                  placeholder="Nama sesuai identitas"
                  {...register(`penumpang.${index}.nama`)}
                />
                <p className="text-xs text-gray-500">
                  Sesuai KTP/SIM/Paspor (tanpa gelar)
                </p>
                {errors.penumpang?.[index]?.nama && (
                  <p className="text-xs text-red-500">
                    {errors.penumpang[index].nama?.message}
                  </p>
                )}
              </div>

              {/* Jenis ID */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-gray-700 font-medium">
                  <CreditCard className="w-4 h-4" />
                  Jenis Identitas
                </Label>
                <Select
                  value={watch(`penumpang.${index}.jenis_id`) || ""}
                  onValueChange={(val) =>
                    setValue(
                      `penumpang.${index}.jenis_id`,
                      val as "nik" | "sim" | "paspor"
                    )
                  }
                >
                  <SelectTrigger className="h-11 w-full">
                    <SelectValue placeholder="Pilih jenis ID" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nik">NIK (KTP)</SelectItem>
                    <SelectItem value="sim">SIM</SelectItem>
                    <SelectItem value="paspor">Paspor</SelectItem>
                  </SelectContent>
                </Select>
                {errors.penumpang?.[index]?.jenis_id && (
                  <p className="text-xs text-red-500">
                    {errors.penumpang[index].jenis_id?.message}
                  </p>
                )}
              </div>

              {/* Nomor Identitas */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-gray-700 font-medium">
                  <CreditCard className="w-4 h-4" />
                  Nomor Identitas
                </Label>
                <Input
                  className="h-11"
                  placeholder="Nomor identitas"
                  {...register(`penumpang.${index}.nomor_identitas`)}
                />

                {errors.penumpang?.[index]?.nomor_identitas && (
                  <p className="text-xs text-red-500">
                    {errors.penumpang[index].nomor_identitas?.message}
                  </p>
                )}
              </div>

              {/* Usia */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-gray-700 font-medium">
                  <Calendar className="w-4 h-4" />
                  Usia
                </Label>
                <Input
                  className="h-11"
                  type="number"
                  placeholder="Usia"
                  {...register(`penumpang.${index}.usia`, {
                    valueAsNumber: true,
                  })}
                />
                {errors.penumpang?.[index]?.usia && (
                  <p className="text-xs text-red-500">
                    {errors.penumpang[index].usia?.message}
                  </p>
                )}
              </div>

              {/* Alamat */}
              <div className="space-y-2 md:col-span-3">
                <Label className="flex items-center gap-2 text-gray-700 font-medium">
                  <MapPin className="w-4 h-4" />
                  Alamat
                </Label>
                <Input
                  className="h-11"
                  placeholder="Alamat lengkap"
                  {...register(`penumpang.${index}.alamat`)}
                />
                <p className="text-xs text-gray-500">
                  Contoh: Jl. Merdeka No. 123, Air Dingin
                </p>
                {errors.penumpang?.[index]?.alamat && (
                  <p className="text-xs text-red-500">
                    {errors.penumpang[index].alamat?.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Submit Button */}
      <div className="pt-4">
        <Button
          type="submit"
          className="w-full h-12 bg-Blue text-white hover:bg-teal-600 font-medium flex items-center justify-center gap-2"
        >
          <span>Lanjutkan ke Verifikasi</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </form>
  );
}
