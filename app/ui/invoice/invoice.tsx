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
import { BookingData } from "@/types/invoice";
import { getBookingById } from "@/service/invoice";
import { getPaymentTransactionDetail } from "@/service/payment";

function getTimeFromDateTime(dateTime: string): string {
  const date = new Date(dateTime);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

export default function Invoice({
  orderId: propOrderId,
}: {
  orderId?: string;
}) {
  const params = useParams();
  const rawOrderId = propOrderId || params?.orderId; // Ambil orderId dari URL atau prop
  const orderId = Array.isArray(rawOrderId) ? rawOrderId[0] : rawOrderId;

  const [booking, setBooking] = useState<BookingData | null>(null);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (orderId) {
        try {
          const bookingResponse = await getBookingById(orderId);
          setBooking(bookingResponse.data);

          // Ambil reference_number dari booking data
          const referenceNumber = bookingResponse.data.reference_number;
          if (referenceNumber) {
            const paymentResponse = await getPaymentTransactionDetail(
              referenceNumber
            );
            setQrUrl(paymentResponse.data.qr_url); // Simpan QR URL
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [orderId]);

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
                  {booking.schedule.route.departure_harbor.harbor_name}
                </p>
              </div>
              <div>
                <p>Tujuan</p>
                <p className="font-semibold">
                  {booking.schedule.route.arrival_harbor.harbor_name}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter
          className={cn(
           "md:flex-row items-start flex-col border-t-2 border-dashed px-0 h-full"
          )}
        >
          {/* No. Order */}
          <div className="w-full md:w-fit border-b-2 md:border-none border-dashed p-4 md:items-start items-center justify-center flex flex-col">
            <p>No. Order</p>
            <p className="font-semibold">{booking.order_id}</p>
          </div>

          {/* Informasi Tiket */}
          <div className="p-4 w-full space-y-4 md:border-l-2 border-dashed flex-grow">
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
          <div className="md:ml-12 w-full flex justify-center p-8 md:w-100">
            {qrUrl ? (
              <Image
                width={70}
                height={10}
                src={qrUrl}
                className="w-40 md:w-60"
                alt="QR Code"
              />
            ) : (
              <p>QR Code tidak tersedia.</p>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
