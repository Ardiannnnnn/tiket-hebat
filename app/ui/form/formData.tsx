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
import { useEffect } from "react";
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
    },
  });

  const { fields, replace } = useFieldArray({
    control,
    name: "penumpang",
  });

  // Watch form values for saving to localStorage
  const penumpangValues = watch("penumpang");

  // Load saved data from localStorage or from session on mount
  useEffect(() => {
    // Ambil data dari localStorage
    const savedData = sessionStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        // Pastikan data sesuai struktur dan length sama dengan session tickets
        if (Array.isArray(parsedData) && parsedData.length === session.tickets.length) {
          replace(parsedData);
          reset({ penumpang: parsedData }); // sync react-hook-form state
          return;
        }
      } catch {
        // Jika error parsing, abaikan dan load default dari session
      }
    }

    // Jika tidak ada data tersimpan, inisialisasi form dari session
    if (session?.tickets) {
      const defaultFields = session.tickets.map(() => ({
        nama: "",
        jenis_kelamin: "pria" as const,
        jenis_id: "nik" as const,
        nomor_identitas: "",
        usia: "", // bisa string atau number sesuai schema
        alamat: "",
      }));
      replace(defaultFields);
      reset({ penumpang: defaultFields });
    }
  }, [session, replace, reset]);

  // Simpan data form ke localStorage setiap ada perubahan di penumpangValues
  useEffect(() => {
    if (penumpangValues && penumpangValues.length > 0) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(penumpangValues));
    }
  }, [penumpangValues]);

  const onSubmit = (data: PenumpangFormSchema) => {
    const penumpangDenganKelas = data.penumpang.map((item, index) => ({
      ...item,
      usia: Number(item.usia),
      kelas: session.tickets[index]?.class.class_name || "Tidak diketahui",
      ticket_id: session.tickets[index]?.ticket_id,
    }));


    console.log("Data yang disimpan:", penumpangDenganKelas);


    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(penumpangDenganKelas));
    router.push(`/book/${id}/form/verifikasi?session_id=${sessionId}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="md:space-y-6 space-y-8">
      {fields.map((field, index) => (
        <Card key={field.id} className={cn("py-0 gap-0")}>
          <CardHeader className="p-4 border-b flex flex-row justify-between">
            <p className="flex flex-col md:flex-row md:gap-2">
              Isi Data Penumpang{" "}
              <span className="font-bold">
                ({session.tickets[index]?.class.class_name})
              </span>
            </p>
          </CardHeader>
          <CardContent className="p-4 md:px-8">
            <div className="grid grid-cols-3 gap-6 md:text-sm">
              {/* Jenis Kelamin */}
              <div className="col-span-1">
                <Label className="text-gray-600 md:block hidden">
                  Jenis Kelamin
                </Label>
                <Label className="md:hidden">JK</Label>
                <Select
                  value={penumpangValues?.[index]?.jenis_kelamin || ""}
                  onValueChange={(val: "pria" | "wanita") =>
                    setValue(`penumpang.${index}.jenis_kelamin`, val)
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

              {/* Nama Lengkap */}
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

              {/* Jenis ID */}
              <div className="col-span-1">
                <Label className="text-gray-600">Jenis ID</Label>
                <Select
                  value={penumpangValues?.[index]?.jenis_id || ""}
                  onValueChange={(val: "nik" | "sim" | "paspor") =>
                    setValue(`penumpang.${index}.jenis_id`, val)
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

              {/* Nomor Identitas */}
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

              {/* Usia */}
              <div className="col-span-1">
                <Label className="text-gray-600">Usia</Label>
                <Input
                  className="h-10 placeholder:text-sm"
                  type="number"
                  placeholder="18"
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

              {/* Alamat */}
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
