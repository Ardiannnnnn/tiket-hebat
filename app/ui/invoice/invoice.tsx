"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import img from "@/public/image/qr.png";
import asdp from "@/public/image/asdp.png";
import { poppins } from "../fonts";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Booking } from "@/types/invoice";
import { getBookingById } from "@/service/invoice";

const ticketData = {
  orderId: "W9495620E",
  pemesan: "Ardian",
  asal: "Simeulue",
  tujuan: "Calang",
  tanggal: "Senin, 27-Oktober-2024",
  jamBerangkat: "17.00 WIB",
  jamSampai: "08.00 WIB",
  kelas: [
    { nama: "Ekonomi x1", harga: "Rp78.000", tempat: "E.01" },
    { nama: "Bisnis x1", harga: "Rp91.000", tempat: "B.01" },
  ],
  kendaraan: { jenis: "Golongan II", harga: "Rp191.000" },
};

function getTimeFromDateTime(dateTime: string): string {
  // Mengambil jam dan menit dari format ISO, misal: "2025-05-28T07:30:00Z" -> "07:30"
  const date = new Date(dateTime);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

export default function Invoice({ bookid: propBookid }: { bookid?: string }) {
  const params = useParams();
  const rawBookid = propBookid || params?.bookid;
  const bookid = Array.isArray(rawBookid) ? rawBookid[0] : rawBookid;
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bookid) {
      getBookingById(bookid)
        .then((res) => setBooking(res.data))
        .finally(() => setLoading(false));
    }
  }, [bookid]);

  if (loading) return <div className="text-center py-8">Memuat invoice...</div>;
  if (!booking)
    return (
      <div className="text-center py-8 text-red-500">
        Data invoice tidak ditemukan.
      </div>
    );

  return (
    <div
      className={`${poppins.className} flex flex-col justify-center items-center gap-8 mb-8 md:mb-0`}
    >
      <div className="mt-6 flex items-center justify-center gap-4">
        <div className="bg-Blue rounded-full p-2 w-12 text-white font-bold flex justify-center items-center text-2xl">
          4
        </div>
        <div className="text-2xl font-semibold">Bukti Booking</div>
      </div>
      <Card className="w-fit py-0 gap-0">
        <CardHeader className="p-4 border-b-2 gap-4 md:gap-0 border-dashed flex-row justify-between items-center">
          <CardTitle>PT ASDP Indonesia Ferry</CardTitle>
          <div>
            <Image
              src={asdp}
              className="w-16 md:w-32"
              alt="Screenshots of the dashboard project showing desktop version"
            />
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div>
            <p>Hari/Tanggal</p>
            <p>
              {new Date(booking.schedule.departure_datetime).toLocaleDateString(
                "id-ID",
                {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )}
            </p>
          </div>
          <div className="flex justify-between">
            <div className="">
              <div className="mb-2">
                <p>Jam Berangkat</p>
                <p className="font-semibold">
                  {getTimeFromDateTime(booking.schedule.departure_datetime)}
                </p>
              </div>
              <div>
                <p>Jam Tiba</p>
                <p className="font-semibold">
                  {getTimeFromDateTime(booking.schedule.arrival_datetime)}
                </p>
              </div>
            </div>
            <div className="text-end md:mr-2">
              <div className="mb-2">
                <p>Asal</p>
                <p className="font-semibold">
                  {
                    booking.schedule.route.departure_harbor.harbor_name
                  }
                </p>
              </div>
              <div>
                <p>Tujuan</p>
                <p className="font-semibold">
                  {
                    booking.schedule.route.arrival_harbor.harbor_name
                  }
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter
          className={cn(
            "md:flex-row items-start flex-col border-t-2 border-dashed px-0"
          )}
        >
          {/* No. Order */}
          <div className="w-full md:w-fit border-b-2 md:border-none border-dashed items-end p-4 md:items-start md:justify-center flex flex-col">
            <p>No. Order</p>
            <p>c937465758</p>
          </div>

          {/* Informasi Tiket */}
          <div className="p-4 w-full space-y-4 md:border-l-2 border-dashed md:p-4">
            <div className="text-center md:text-start">
              <p>Nama Pemesan</p>
              <p className="font-semibold">{booking.customer_name}</p>
            </div>

            {/* Detail Kelas dan Harga */}
            <div className="grid text-center md:text-start grid-cols-3 gap-4 space-y-4 md:space-y-0">
              <div>
                <p>Kelas</p>
                {booking.tickets
                  .filter((item) => item.type === "passenger")
                  .map((data, index) => (
                    <p key={index} className="font-semibold">
                      {data.class.class_name}
                    </p>
                  ))}
              </div>
              <div>
                <p>Tempat</p>
                {booking.tickets
                  .filter((item) => item.type === "passenger")
                  .map((data, index) => (
                    <p key={index} className="font-semibold">
                      {data.seat_number || "Tidak ada tempat"}
                    </p>
                  ))}
              </div>
              <div>
                <p>Harga</p>
                {booking.tickets
                  .filter((item) => item.type === "passenger")
                  .map((data, index) => (
                    <p key={index} className="font-semibold">
                      {data.price}
                    </p>
                  ))}
              </div>
            </div>

            {/* Kendaraan & Harga */}
            {booking.tickets.some((item) => item.type === "vehicle") && (
              <div className="text-center md:text-start grid grid-cols-2 md:grid-cols-3 gap-4 items-start">
                <div>
                  <p>Kendaraan</p>
                  {booking.tickets
                    .filter((item) => item.type === "vehicle")
                    .map((data, index) => (
                      <p key={index} className="font-semibold">
                        {data.class.class_name}
                      </p>
                    ))}
                </div>
                <div>
                  <p>Harga</p>
                  {booking.tickets
                    .filter((item) => item.type === "vehicle")
                    .map((data, index) => (
                      <p key={index} className="font-semibold">
                        {data.price}
                      </p>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* QR Code */}
          <div className="md:ml-12 w-full flex justify-center md:w-fit">
            <Image src={img} className="w-40 md:w-60" alt="QR Code" />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
