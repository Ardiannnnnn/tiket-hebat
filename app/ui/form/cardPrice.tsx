import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { FaLongArrowAltRight } from "react-icons/fa";
import { map } from "zod";

const pemesananData = {
  kapal: "Aceh Hebat 1",
  keberangkatan: {
    asal: "Sinabang",
    tujuan: "Calang",
    jadwal: "2024-11-18", // Format YYYY-MM-DD
    jam: "17:00 WIB",
    zona_waktu: "WIB",
  },
  tiket: {
    penumpang: [
      { 
        id: 1,
        kelas: "Ekonomi",
        jumlah_dewasa: 2,
        jumlah_anak: 1,
        harga_per_tiket: 76000,
      },
      { 
        id: 2,
        kelas: "Bisnis",
        jumlah_dewasa: 1,
        jumlah_anak: 0,
        harga_per_tiket: 120000,
      },
    ],
    kendaraan: [
      { 
        id: 1,
        jenis: "Golongan 1 / Motor",
        jumlah: 1,
        harga_per_kendaraan: 190000,
      },
      { 
        id: 2,
        jenis: "Golongan 2 / Mobil",
        jumlah: 1,
        harga_per_kendaraan: 500000,
      },
    ],
  },
};

const totalHargaPenumpang = pemesananData.tiket.penumpang.reduce(
    (total, tiket) =>
      total +
      tiket.jumlah_dewasa * tiket.harga_per_tiket +
      tiket.jumlah_anak * tiket.harga_per_tiket,
    0
  );
  
  // Hitung total harga kendaraan
  const totalHargaKendaraan = pemesananData.tiket.kendaraan.reduce(
    (total, kendaraan) => total + kendaraan.jumlah * kendaraan.harga_per_kendaraan,
    0
  );
  
  // Hitung total keseluruhan
  const totalHarga = totalHargaPenumpang + totalHargaKendaraan;

export default function CardPrice() {
  return (
    <div>
      <Card className={cn("py-0 gap-0 text-sm")}>
        <CardHeader className="flex flex-row justify-between border-b p-6">
          <CardTitle className="font-normal">Detail Keberangkatan</CardTitle>
          <CardTitle>{pemesananData.kapal}</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4 md:gap-24 px-3 md:px-8">
          <div>
            <div className="w-full mt-4">
              <label htmlFor="" className="text-gray-500">
                Keberangkatan
              </label>
              <div className="flex items-center gap-2">
                <span>{pemesananData.keberangkatan.asal}</span>
                <FaLongArrowAltRight className="text-lg" />
                <span>{pemesananData.keberangkatan.tujuan}</span>
              </div>
              <span className="text-white">pe</span>
            </div>
            {/* penumpang */}
            <div className="w-full mt-4">
              <label htmlFor="" className="text-gray-500">
                Kelas tiket
              </label>
              {pemesananData.tiket.penumpang.map((tiket, index) => (
                <div key={tiket.id} className="flex flex-col">
                  <span key={index}>
                    {tiket.kelas} (Dewasa x{tiket.jumlah_dewasa}
                    {tiket.jumlah_anak > 0 && `, Anak x${tiket.jumlah_anak}`})
                  </span>
                </div>
              ))}
            </div>
            <div className="w-full mt-4">
              <label htmlFor="" className="text-gray-500">
                Kendaraan
              </label>
              {pemesananData.tiket.kendaraan.map((tiket, index) => (
                <div key={tiket.id} className="flex items-center gap-2">
                  <span>{tiket.jenis}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="w-full mt-4">
              <label htmlFor="" className="text-gray-500  flex justify-end">
                jadwal
              </label>
              <div className="text-end flex flex-col">
                <span>{pemesananData.keberangkatan.jadwal}</span>
                <span>{pemesananData.keberangkatan.jam}</span>
              </div>
            </div>
            <div className="w-full mt-4">
              <label htmlFor="" className="text-white">
                harga
              </label>
              <div className="flex flex-col text-end">
                <span>Rp{totalHargaPenumpang.toLocaleString()}</span>
                <span>Rp{totalHargaKendaraan.toLocaleString()}</span>
              </div>
            </div>
            <div className="w-full mt-4">
              <label htmlFor="" className="text-white">
                hargamotor
              </label>
              <div className="text-end flex flex-col">
                <span>Rp{totalHargaKendaraan.toLocaleString()}</span>
                <span>Rp{totalHargaKendaraan.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t px-3 md:px-8  py-4 mt-4 flex justify-between">
            <div className="">
                <p>
                    Harga Total Tiket :
                </p>
                <p>
                    Harga Total Kendaraan :
                </p>
                <p className="mt-4 font-bold">
                    Total:
                </p>
            </div>
            <div>
                <p>Rp{totalHargaPenumpang.toLocaleString()}</p>
                <p>Rp{totalHargaKendaraan.toLocaleString()}</p>
                <p className="mt-4 font-bold">Rp{totalHargaPenumpang.toLocaleString()}</p>
            </div>
        </CardFooter>
      </Card>
    </div>
  );
}
