"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getBookingById } from "@/service/invoice"; // pastikan path benar
import { BookingData, BookingResponse } from "@/types/invoice";
import { Toaster, toast } from "sonner";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import asdp from "@/public/image/asdp.png";
import { cn } from "@/lib/utils";
import { getPaymentTransactionDetail } from "@/service/payment";
import { PaymentTransactionDetail } from "@/types/paymentDetail";

export default function CekTiket() {
  const [orderId, setOrderId] = useState("");
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [paymentData, setPaymentData] =
    useState<PaymentTransactionDetail | null>(null);
  const [countdown, setCountdown] = useState<string>("");

  const handleCekTiket = async () => {
    if (!orderId) return;

    try {
      setLoading(true);
      const bookingResponse = await getBookingById(orderId);
      const bookingData: BookingData = bookingResponse.data;
      setBookingData(bookingData);

      const referenceNumber = bookingResponse.data.reference_number;
      if (referenceNumber) {
        const paymentResponse = await getPaymentTransactionDetail(
          referenceNumber
        );
        const paymentData: PaymentTransactionDetail = paymentResponse.data;
        setQrUrl(paymentData.qr_url);
        setPaymentData(paymentData);

        const interval = setInterval(() => {
          const now = Math.floor(Date.now() / 1000);
          const remainingTime = paymentData.expired_time - now;
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
  };

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

  console.log(bookingData);

  return (
    <div className="flex flex-col justify-center items-center p-4">
      <Toaster />
      <h1 className="font-semibold">Cek Tiket Anda</h1>
      <div className="flex items-center gap-2 w-full max-w-md mx-auto m-4">
        <Input
          type="text"
          placeholder="Masukkan Nomor Tiket"
          className="flex-1 p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-Orange focus:border-transparent"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
        />
        <Button
          onClick={handleCekTiket}
          className="bg-Orange hover:bg-amber-600 text-white"
          disabled={loading}
        >
          {loading ? "Mengecek..." : "Cek Tiket"}
        </Button>
      </div>

      {bookingData && (
        <Card className="w-fit py-0 gap-0 ">
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
                  bookingData.schedule.departure_datetime
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
                    {getTimeFromDateTime(
                      bookingData.schedule.departure_datetime
                    )}
                  </p>
                </div>
                <div>
                  <p>Jam Tiba</p>
                  <p className="font-semibold">
                    {getTimeFromDateTime(bookingData.schedule.arrival_datetime)}
                  </p>
                </div>
              </div>
              <div className="text-end md:mr-2">
                <div className="mb-2">
                  <p>Asal</p>
                  <p className="font-semibold">
                    {bookingData.schedule.route.departure_harbor.harbor_name}
                  </p>
                </div>
                <div>
                  <p>Tujuan</p>
                  <p className="font-semibold">
                    {bookingData.schedule.route.arrival_harbor.harbor_name}
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
              <p className="font-semibold">{bookingData.order_id}</p>
            </div>

            {/* Informasi Tiket */}
            <div className="p-4 w-full space-y-4 md:border-l-2 border-dashed flex-grow">
              <div className="text-center md:text-start">
                <p>Nama Pemesan</p>
                <p className="font-semibold">{bookingData.customer_name}</p>
              </div>

              {/* Detail Kelas dan Harga */}
              {/* Informasi Penumpang */}
              {bookingData.tickets.some(
                (item) => item.type === "passenger"
              ) && (
                <div className="grid text-center md:text-start grid-cols-3 gap-4 space-y-4 md:space-y-0">
                  <div>
                    <p>Kelas</p>
                    {bookingData.tickets
                      .filter((item) => item.type === "passenger")
                      .map((data, index) => (
                        <p key={index} className="font-semibold">
                          {data.class.class_name}
                        </p>
                      ))}
                  </div>
                  <div>
                    <p>Tempat</p>
                    {bookingData.tickets
                      .filter((item) => item.type === "passenger")
                      .map((data, index) => (
                        <p key={index} className="font-semibold">
                          {data.seat_number || "Tidak ada tempat"}
                        </p>
                      ))}
                  </div>
                  <div>
                    <p>Harga</p>
                    {bookingData.tickets
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
              {bookingData.tickets.some((item) => item.type === "vehicle") && (
                <div className="text-center md:text-start grid grid-cols-2 md:grid-cols-3 gap-4 items-start">
                  <div>
                    <p>Kendaraan</p>
                    {bookingData.tickets
                      .filter((item) => item.type === "vehicle")
                      .map((data, index) => (
                        <p key={index} className="font-semibold">
                          {data.class.class_name}
                        </p>
                      ))}
                  </div>
                  <div>
                    <p>Harga</p>
                    {bookingData.tickets
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
      )}
    </div>
  );
}
