"use client";

import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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

interface Penumpang {
  kelas: string;
  jenis_kelamin: string;
  nama: string;
  jenis_id: string;
  nomor_identitas: string;
  usia: "Dewasa" | "Anak-anak";
}

// interface FormData {
//   pemesan: {
//     nama: string;
//     email: string;
//     nomor_telepon: string;
//   };
//   penumpang: Penumpang[];
// }

const pemesananData = {
  jumlah_kendaraan: [
    { id: 1, jenisKendaraan: 1 },
    { id: 2, jenisKendaraan: 2 },
  ],
  jumlah_penumpang: [
    { id: 1, jenis: "Dewasa", kelas: "Ekonomi", dewasa: 1, anak: 0 },
    { id: 1, jenis: "Anak-anak", kelas: "Ekonomi", dewasa: 0, anak: 1 },
    { id: 2, jenis: "Dewasa", kelas: "Bisnis", dewasa: 1, anak: 0 },
  ],
};

export default function FormPenumpang() {
  // const { control, handleSubmit, register, setValue } = useForm<FormData>({
  //   defaultValues: {
  //     pemesan: { nama: "", email: "", nomor_telepon: "" },
  //     penumpang: [],
  //   },
  // });

  // const { fields, append } = useFieldArray({
  //   control,
  //   name: "penumpang",
  // });

  // // useEffect(() => {
  // //   pemesananData.jumlah_penumpang.forEach((p) => {
  // //     for (let i = 0; i < p.dewasa; i++) {
  // //       append({
  // //         kelas: p.kelas,
  // //         jenis_kelamin: "",
  // //         nama: "",
  // //         jenis_id: "KTP",
  // //         nomor_identitas: "",
  // //         usia: "Dewasa",
  // //       });
  // //     }
  // //     for (let i = 0; i < p.anak; i++) {
  // //       append({
  // //         kelas: p.kelas,
  // //         jenis_kelamin: "",
  // //         nama: "",
  // //         jenis_id: "KTP",
  // //         nomor_identitas: "",
  // //         usia: "Anak-anak",
  // //       });
  // //     }
  // //   });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const onSubmit = (data: FormData) => {
    console.log("Data Pemesan & Penumpang:", data);
  };

  return (
    <form className="md:space-y-6 space-y-8">
      {/* Form Data Pemesan */}
      <Card className={cn("py-0 border-l")}>
        <CardContent className={cn("px-0")}>
          <CardHeader className="p-4 border-b text-center">
            Isi Data Kendaraan
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
            {pemesananData.jumlah_kendaraan.map((vihicle, index) => (
              <div key={index} className="mt-4 text-sm ">
                <p className="text-end">Kendaraan {vihicle.id}</p>
                <div className="mt-2 flex justify-between gap-4">
                  <div className="w-full">
                    <label htmlFor="">Nomor Polisi</label>
                    <Input className={cn("h-12")} placeholder="BL XXXX XX" />
                  </div>
                  <div className="w-full">
                    <label htmlFor="">Golongan</label>
                    <Input
                      className={cn("h-12")}
                      placeholder={`Golongan ${vihicle.jenisKendaraan}`}
                      type="text"
                      readOnly
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      {/* Form Penumpang */}
      {pemesananData.jumlah_penumpang.map((field, index) => (
        <Card key={index} className={cn("py-0 gap-0")}>
          <CardHeader className="p-4 border-b flex flex-row justify-between">
            <p className="flex flex-col md:flex-row md:gap-2">
              Isi Data Penumpang{" "}
              <span className="font-bold">({field.kelas})</span>
            </p>
            <p>{field.jenis}</p>
          </CardHeader>
          <CardContent className="p-4 md:px-8">
            <div className="grid grid-cols-3 gap-6 md:text-sm">
              {/* Jenis Kelamin */}
              <div className="col-span-1">
                <Label className="text-gray-600 md:block hidden">Jenis Kelamin</Label>
                <Label className="md:hidden">JK</Label>
                <Select>
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
                <Input className="h-10 text-sm placeholder:text-sm" placeholder="Masukkan Nama" />
                <p className="text-xs text-gray-500 mt-1">
                  Isi sesuai dengan KTP/SIM/Paspor (tanpa gelar khusus)
                </p>
              </div>

              {/* Jenis ID */}
              <div className="col-span-1">
                <Label className="text-gray-600">Jenis ID</Label>
                <Select>
                  <SelectTrigger className="w-full h-10 placeholder:text-sm">
                    <SelectValue placeholder="KTP" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ktp">KTP</SelectItem>
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
                />
                <p className="text-xs text-gray-500 mt-1">
                  Penumpang di bawah 18 tahun, isi dengan tanggal lahir
                  (hhbbtttt)
                </p>
              </div>

              {/* Usia */}
              <div className="col-span-1">
                <Label className="text-gray-600">Usia</Label>
                <Input className="h-10 placeholder:text-sm" type="number" placeholder="18" />
              </div>

              {/* Alamat */}
              <div className="col-span-2">
                <Label className="text-gray-600">Alamat</Label>
                <Input className="h-10 placeholder:text-sm" placeholder="Masukkan alamat" />
                <p className="text-xs text-gray-500 mt-1">Contoh: Air Dingin</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      <Button type="submit" className="w-full bg-Blue text-white">
        Lanjutkan
      </Button>
    </form>
  );
}
