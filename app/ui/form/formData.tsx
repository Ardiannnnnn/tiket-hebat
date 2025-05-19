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
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import type { SessionData, SessionTicket } from "@/types/session";

interface Penumpang {
  nama: string;
  jenis_kelamin: string;
  jenis_id: string;
  nomor_identitas: string;
  usia: string;
  alamat: string;
}

interface FormValues {
  penumpang: Penumpang[];
}

interface FormPenumpangProps {
  session: SessionData;
}

export default function FormPenumpang({ session }: FormPenumpangProps) {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { control, register, handleSubmit, setValue, watch } = useForm<FormValues>({
    defaultValues: {
      penumpang: [],
    },
  });

  const { fields, replace } = useFieldArray({
    control,
    name: "penumpang",
  });

  // Ambil value terkini dari react-hook-form
  const penumpangValues = watch("penumpang");

  useEffect(() => {
    if (session?.tickets) {
      const defaultFields = session.tickets.map(() => ({
        nama: "",
        jenis_kelamin: "",
        jenis_id: "",
        nomor_identitas: "",
        usia: "",
        alamat: "",
      }));
      replace(defaultFields);
    }
  }, [session, replace]);

  const onSubmit = (data: FormValues) => {
    const penumpangDenganKelas = data.penumpang.map((item, index) => ({
      ...item,
      kelas: session.tickets[index]?.class.class_name || "Tidak diketahui",
      ticket_id: session.tickets[index]?.ticket_id,
    }));

    console.log("DEBUG: penumpangDenganKelas hasil mapping:", penumpangDenganKelas);

    localStorage.setItem("dataPenumpang", JSON.stringify(penumpangDenganKelas));
    console.log(
      "Data penumpang disimpan ke localStorage:",
      penumpangDenganKelas
    );

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
                  onValueChange={(val) =>
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
              </div>

              {/* Jenis ID */}
              <div className="col-span-1">
                <Label className="text-gray-600">Jenis ID</Label>
                <Select
                  value={penumpangValues?.[index]?.jenis_id || ""}
                  onValueChange={(val) =>
                    setValue(`penumpang.${index}.jenis_id`, val)
                  }
                >
                  <SelectTrigger className="w-full h-10 placeholder:text-sm">
                    <SelectValue placeholder="NIK" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ktp">NIK</SelectItem>
                    <SelectItem value="sim">SIM</SelectItem>
                    <SelectItem value="paspor">Paspor</SelectItem>
                  </SelectContent>
                </Select>
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