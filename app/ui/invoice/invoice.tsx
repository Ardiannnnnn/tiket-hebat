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
import { PaymentTransactionDetail } from "@/types/paymentDetail";

function getTimeFromDateTime(dateTime: string): string {
  const date = new Date(dateTime);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
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
  const [paymentData, setPaymentData] =
    useState<PaymentTransactionDetail | null>(null);
  const [countdown, setCountdown] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      if (orderId) {
        try {
          const bookingResponse = await getBookingById(orderId);
          const bookingData: BookingData = bookingResponse.data;
          setBooking(bookingData);

          // Ambil reference_number dari booking data
          const referenceNumber = bookingResponse.data.reference_number;
          if (referenceNumber) {
            const paymentResponse = await getPaymentTransactionDetail(
              referenceNumber
            );
            const paymentData: PaymentTransactionDetail = paymentResponse.data;
            setQrUrl(paymentData.qr_url); // Simpan QR URL
            setPaymentData(paymentData); // Simpan data pembayaran

            // Countdown untuk waktu pembayaran
            const interval = setInterval(() => {
              const now = Math.floor(Date.now() / 1000); // Waktu sekarang dalam detik
              const remainingTime = paymentData.expired_time - now; // Hitung waktu tersisa
              if (remainingTime <= 0) {
                clearInterval(interval);
                setCountdown("Waktu pembayaran telah habis");
              } else {
                const hours = Math.floor(remainingTime / 3600);
                const minutes = Math.floor((remainingTime % 3600) / 60);
                const seconds = remainingTime % 60;
                setCountdown(
                  `${hours.toString().padStart(2, "0")}:${minutes
                    .toString()
                    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
                );
              }
            }, 1000);
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
    <div className="space-y-8">
      <div className="mt-6 flex items-center justify-center gap-4">
        <div className="bg-Blue rounded-full p-2 w-12 text-white font-bold flex justify-center items-center text-2xl">
          5
        </div>
        <div className="text-2xl font-semibold">Bukti Booking</div>
      </div>
      <div
        className={`${poppins.className} flex flex-col 2xl:flex-row justify-center items-center 2xl:items-start gap-8 md:mx-20 mb-8 md:mb-0`}
      >
        <Card className="w-fit py-0 gap-0 mx-4">
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
                {new Date(
                  booking.schedule.departure_datetime
                ).toLocaleDateString("id-ID", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
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
              {/* Informasi Penumpang */}
              {booking.tickets.some((item) => item.type === "passenger") && (
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
                          {formatPrice(data.price)}
                        </p>
                      ))}
                  </div>
                </div>
              )}

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
                          {formatPrice(data.price)}
                        </p>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* QR Code */}
            <div className="w-full flex justify-center p-8 md:w-100">
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
            <div
              className={cn(
                "md:flex-row flex-col border-t-2 border-dashed px-0 h-full w-full"
              )}
            >
              {/* Status Pembayaran */}
              <div className="w-full text-center py-4">
                <p>Status Pembayaran:</p>
                <p
                  className={`font-semibold ${
                    paymentData?.status === "PAID"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {paymentData?.status === "PAID"
                    ? "Sudah Dibayar"
                    : "Belum Dibayar"}
                </p>
              </div>

              {/* Countdown atau Status */}
              <div className="w-full text-center py-4">
                {paymentData?.status === "PAID" ? (
                  <>
                    <p>Waktu Tersisa untuk Pembayaran:</p>
                    <p className="font-semibold text-green-500">
                      Sudah Dibayar
                    </p>
                  </>
                ) : (
                  <>
                    <p>Waktu Tersisa untuk Pembayaran:</p>
                    <p className="font-semibold text-blue-500">{countdown}</p>
                  </>
                )}
              </div>
            </div>
          </CardFooter>
        </Card>
        <Card className="w-fit py-0 gap-0 mx-4 md:mx-0 md:mb-6">
          <CardHeader className="flex flex-row items-center p-4 justify-center border-b-2 border-dashed">
            <div className="px-3 rounded-full items-center bg-Orange">!</div>
            <CardTitle className="text-cente">
              Langkah-Langkah Pembayaran
            </CardTitle>
          </CardHeader>
          <CardContent className="md:px-10 py-4">
            {paymentData?.instructions.map((instruction, index) => (
              <div key={index} className="mb-4">
                <h3 className="font-semibold">{instruction.title}</h3>
                <ul className="list-decimal pl-5 text-sm">
                  {instruction.steps.map((step, stepIndex) => (
                    <li key={stepIndex}>{step}</li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
