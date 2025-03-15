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
    { id: 1, kelas: "Ekonomi", dewasa: 1, anak: 1 },
    { id: 2, kelas: "Bisnis", dewasa: 1, anak: 0 },
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
    <form className="space-y-6">
      {/* Form Data Pemesan */}
      <Card className={cn("py-0 border-l")}>
        <CardContent className={cn("px-0")}>
          <CardHeader className="p-4 border-b text-center">
            Isi Data penumpang
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
              <div key={vihicle.id} className="mt-4 text-sm ">
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
      {/* {pemesananData.jumlah_penumpang.map((field, index) => (
        <Card key={field.id} className="border-l-4 border-blue-500">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-bold text-lg">
              Detail Penumpang ({field.kelas})
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="Nama Lengkap" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="Nomor Identitas" />
            </div>

            <Input readOnly className="bg-gray-100" />
          </CardContent>
        </Card>
      ))} */}

      <Button type="submit" className="w-full bg-Blue text-white">
        Lanjutkan
      </Button>
    </form>
  );
}
