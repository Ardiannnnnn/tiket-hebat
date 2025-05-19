import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { FaLongArrowAltRight } from "react-icons/fa";
import type { SessionData } from "@/types/session";

interface CardPriceProps {
  session: SessionData;
}

export default function CardPrice({ session }: CardPriceProps) {
  const kapal = session.schedule?.ship?.ship_name ?? "Tidak diketahui";
  const keberangkatan = {
    asal: session.schedule?.route?.departure_harbor?.harbor_name ?? "-",
    tujuan: session.schedule?.route?.arrival_harbor?.harbor_name ?? "-",
    jadwal: new Date(
      session.schedule?.departure_datetime ?? ""
    ).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    jam: new Date(
      session.schedule?.departure_datetime ?? ""
    ).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };

  const prices = session.prices ?? [];
  const tickets = session.tickets ?? [];

  const totalHargaPenumpang = prices.reduce(
    (acc, item) => acc + item.subtotal,
    0
  );
  const totalHargaKendaraan = 0; // Belum ada data kendaraan

  return (
    <div>
      <Card className={cn("py-0 gap-0 text-sm")}>
        <CardHeader className="flex flex-row justify-between border-b p-6">
          <CardTitle className="font-normal">Detail Keberangkatan</CardTitle>
          <CardTitle>{kapal}</CardTitle>
        </CardHeader>

        <CardContent className="flex gap-4 md:gap-24 px-3 md:px-6">
          <div>
            {/* Keberangkatan */}
            <div className="w-full mt-4">
              <label htmlFor="" className="text-gray-500">
                Keberangkatan
              </label>
              <div className="flex items-center gap-2">
                <span>{keberangkatan.asal}</span>
                <FaLongArrowAltRight className="text-lg" />
                <span>{keberangkatan.tujuan}</span>
              </div>
              <span className="text-white">pe</span>
            </div>

            {/* Kelas Tiket */}
            <div className="w-full mt-4">
              <label htmlFor="" className="text-gray-500">
                Kelas tiket
              </label>
              {prices.map((tiket, index) => (
                <div key={index} className="flex flex-col">
                  <p>{tiket.class.class_name} x {tiket.quantity}</p>
                </div>
              ))}
            </div>

            {/* Kendaraan */}
            <div className="w-full mt-4">
              <label htmlFor="" className="text-gray-500">
                Kendaraan
              </label>
              {/* Belum ada data kendaraan */}
              <p className="text-sm italic text-muted-foreground">
                Tidak ada data kendaraan
              </p>
            </div>
          </div>

          <div>
            {/* Jadwal */}
            <div className="w-full mt-4">
              <label htmlFor="" className="text-gray-500 flex justify-end">
                jadwal
              </label>
              <div className="text-end flex flex-col">
                <span>{keberangkatan.jadwal}</span>
                <span>{keberangkatan.jam}</span>
              </div>
            </div>

            {/* Harga */}
            <div className="w-full mt-4 flex flex-col text-end">
              <label htmlFor="" className="text-gray-500">
                Harga
              </label>
              {prices.map((tiket,index) => (
                <div key={index} className="">
                  <p>Rp{tiket.subtotal.toLocaleString()}</p>
                </div>
              ))}
            </div>

            {/* Harga Motor (dummy aslinya) */}
            <div className="w-full mt-4">
              <label htmlFor="" className="text-white">
                hargamotor
              </label>
              <div className="text-end flex flex-col">
                <span>Rp{totalHargaKendaraan.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </CardContent>

        {/* Footer */}
        <CardFooter className="border-t px-3 md:px-6 py-4 mt-4 flex justify-between">
          <div>
            <p>Harga Total Tiket :</p>
            <p>Harga Total Kendaraan :</p>
            <p className="mt-4 font-bold">Total:</p>
          </div>
          <div>
            <p>Rp{totalHargaPenumpang.toLocaleString()}</p>
            <p>Rp{totalHargaKendaraan.toLocaleString()}</p>
            <p className="mt-4 font-bold">
              Rp{(totalHargaPenumpang + totalHargaKendaraan).toLocaleString()}
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
