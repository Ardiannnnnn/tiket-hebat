"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import asdp from "@/public/image/asdp.png";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BookingData } from "@/types/invoice";
import { getBookingById } from "@/service/invoice";
import { getPaymentTransactionDetail } from "@/service/payment";
import { PaymentTransactionDetail } from "@/types/paymentDetail";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Ship,
  Calendar,
  Clock,
  MapPin,
  User,
  CreditCard,
  QrCode,
  CheckCircle,
  Timer,
  AlertCircle,
  XCircle,
  Hash,
  Copy,
  Ticket,
} from "lucide-react";

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
  const rawOrderId = propOrderId || params?.orderId;
  const orderId = Array.isArray(rawOrderId) ? rawOrderId[0] : rawOrderId;

  const [booking, setBooking] = useState<BookingData | null>(null);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] =
    useState<PaymentTransactionDetail | null>(null);
  const [countdown, setCountdown] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchPaymentStatus = async (referenceNumber: string) => {
    try {
      const paymentResponse = await getPaymentTransactionDetail(
        referenceNumber
      );
      const paymentData: PaymentTransactionDetail = paymentResponse.data;
      setQrUrl(paymentData.qr_url);
      setPaymentData(paymentData);
      return paymentData;
    } catch (error) {
      console.error("Error fetching payment status:", error);
      return null;
    }
  };

  const handleManualRefresh = async () => {
    if (!booking?.reference_number) return;

    setIsRefreshing(true);
    try {
      const updatedPaymentData = await fetchPaymentStatus(
        booking.reference_number
      );
      if (updatedPaymentData?.status === "PAID") {
        toast.success("Pembayaran berhasil dikonfirmasi!");
      } else {
        toast.info("Status pembayaran diperbarui");
      }
    } catch (error) {
      toast.error("Gagal memperbarui status pembayaran");
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    let pollInterval: NodeJS.Timeout | null = null;
    let countdownInterval: NodeJS.Timeout | null = null;

    const fetchData = async () => {
      if (orderId) {
        try {
          const bookingResponse = await getBookingById(orderId);
          const bookingData: BookingData = bookingResponse.data;
          setBooking(bookingData);

          const referenceNumber = bookingResponse.data.reference_number;
          if (referenceNumber) {
            const paymentData = await fetchPaymentStatus(referenceNumber);

            if (paymentData) {
              // Auto-polling hanya jika belum dibayar
              if (paymentData.status !== "PAID") {
                pollInterval = setInterval(async () => {
                  const updatedPaymentData = await fetchPaymentStatus(
                    referenceNumber
                  );
                  if (updatedPaymentData?.status === "PAID") {
                    if (pollInterval) clearInterval(pollInterval);
                    toast.success(
                      "Pembayaran berhasil! Status otomatis diperbarui."
                    );
                  }
                }, 30000); // Check setiap 30 detik
              }

              // Setup countdown timer
              countdownInterval = setInterval(() => {
                const now = Math.floor(Date.now() / 1000);
                const remainingTime = paymentData.expired_time - now;

                if (remainingTime <= 0) {
                  if (countdownInterval) clearInterval(countdownInterval);
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
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();

    // Cleanup function yang benar
    return () => {
      if (pollInterval) clearInterval(pollInterval);
      if (countdownInterval) clearInterval(countdownInterval);
    };
  }, [orderId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-800 border-green-200";
      case "UNPAID":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "EXPIRED":
        return "bg-red-100 text-red-800 border-red-200";
      case "FAILED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PAID":
        return <CheckCircle className="w-4 h-4" />;
      case "UNPAID":
        return <Timer className="w-4 h-4" />;
      case "EXPIRED":
      case "FAILED":
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-Blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-Blue font-medium">Memuat invoice...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="text-center py-8">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Invoice Tidak Ditemukan
            </h3>
            <p className="text-gray-600">
              Data invoice tidak dapat dimuat. Silakan periksa kembali nomor
              pesanan Anda.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center m-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-12 h-12 bg-Blue rounded-full flex items-center justify-center text-white font-bold text-xl">
              5
            </div>
            <h1 className="text-2xl font-semibold text-gray-600">
              Bukti Booking
            </h1>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Main Invoice Card */}
            <div className="xl:col-span-2">
              <Card className="overflow-hidden bg-white py-0 gap-0 border">
                {/* Header - Blue Theme */}
                <CardHeader className="p-4">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                        <Ship className="w-8 h-8 text-Blue" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-bold text-gray-600">
                          PT ASDP Indonesia Ferry
                        </CardTitle>
                        <p className="text-Blue-100 text-sm">
                          Invoice Pembayaran Resmi
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Image
                        src={asdp}
                        className="w-20 h-auto"
                        alt="ASDP Logo"
                      />
                      <Badge
                        className={cn(
                          "px-3 py-1 text-sm font-medium border",
                          getStatusColor(paymentData?.status || "")
                        )}
                      >
                        <div className="flex items-center gap-1">
                          {getStatusIcon(paymentData?.status || "")}
                          {paymentData?.status === "PAID"
                            ? "Sudah Dibayar"
                            : "Belum Dibayar"}
                        </div>
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-0">
                  {/* Trip Information */}
                  <div className="p-6 bg-Blue/10 border-b border-Blue/20">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Date & Order Info */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-Blue" />
                          <div>
                            <p className="text-sm text-Blue/80">
                              Tanggal Keberangkatan
                            </p>
                            <p className="font-semibold text-gray-600">
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
                        </div>

                        <div className="flex items-center gap-3">
                          <User className="w-5 h-5 text-Blue" />
                          <div>
                            <p className="text-sm text-Blue/80">Nama Pemesan</p>
                            <p className="font-semibold text-gray-600">
                              {booking.customer_name}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Route & Time */}
                      {/* Route & Time */}
                      <div className="lg:col-span-2">
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-0">
                          <div className="text-center">
                            <div className="flex items-center gap-2 mb-2 justify-center">
                              <MapPin className="w-4 h-4 text-Blue" />
                              <p className="text-sm text-Blue/80">
                                Keberangkatan
                              </p>
                            </div>
                            <p className="font-bold text-xl text-Blue">
                              {getTimeFromDateTime(
                                booking.schedule.departure_datetime
                              )}
                            </p>
                            <p className="font-medium text-gray-700 mt-1">
                              {
                                booking.schedule.route.departure_harbor
                                  .harbor_name
                              }
                            </p>
                          </div>

                          <div className="flex flex-col items-center mx-4">
                            <Ship className="w-8 h-8 text-Blue mb-2" />
                            <div className=" w-0.5 h-8 lg:w-20 lg:h-0.5 bg-Blue/50"></div>
                            <p className="text-xs text-Blue mt-2 font-medium">
                              Ferry
                            </p>
                          </div>

                          <div className="text-center">
                            <div className="flex items-center gap-2 mb-2 justify-center">
                              <MapPin className="w-4 h-4 text-Orange" />
                              <p className="text-sm text-Orange/80">
                                Kedatangan
                              </p>
                            </div>
                            <p className="font-bold text-xl text-Orange">
                              {getTimeFromDateTime(
                                booking.schedule.arrival_datetime
                              )}
                            </p>
                            <p className="font-medium text-gray-700 mt-1">
                              {
                                booking.schedule.route.arrival_harbor
                                  .harbor_name
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ticket Details */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Passenger Tickets */}
                      {booking.tickets.some(
                        (item) => item.type === "passenger"
                      ) && (
                        <div>
                          <h3 className="text-lg font-semibold text-Blue mb-4 flex items-center gap-2">
                            <User className="w-5 h-5 text-Blue" />
                            Tiket Penumpang
                          </h3>
                          <div className="space-y-3">
                            {booking.tickets
                              .filter((item) => item.type === "passenger")
                              .map((ticket, index) => (
                                <div
                                  key={index}
                                  className="bg-Blue/10 border border-Blue/30 rounded-lg p-4"
                                >
                                  <div className="grid grid-cols-3 gap-4">
                                    <div>
                                      <p className="text-sm text-Blue/80">
                                        Kelas
                                      </p>
                                      <p className="font-semibold text-gray-600 text-sm md:text-base">
                                        {ticket.class.class_name}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-Blue/80">
                                        Kursi
                                      </p>
                                      <p className="font-semibold text-gray-600 text-sm md:text-base">
                                        {ticket.seat_number || "Tidak ada"}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-Blue/80">
                                        Harga
                                      </p>
                                      <p className="font-semibold text-Orange text-sm md:text-base">
                                        {formatPrice(ticket.price)}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}

                      {/* Vehicle Tickets */}
                      {booking.tickets.some(
                        (item) => item.type === "vehicle"
                      ) && (
                        <div>
                          <h3 className="text-lg font-semibold text-Orange mb-4 flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-Orange" />
                            Tiket Kendaraan
                          </h3>
                          <div className="space-y-3">
                            {booking.tickets
                              .filter((item) => item.type === "vehicle")
                              .map((ticket, index) => (
                                <div
                                  key={index}
                                  className="bg-Orange/10 border border-Orange/30 rounded-lg p-4"
                                >
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-sm text-Orange/80">
                                        Jenis Kendaraan
                                      </p>
                                      <p className="font-semibold text-gray-600 text-sm md:text-base">
                                        {ticket.class.class_name}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-Orange/80">
                                        Harga
                                      </p>
                                      <p className="font-semibold text-Orange text-sm md:text-base">
                                        {formatPrice(ticket.price)}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Footer Information */}
                  <div className="p-6 bg-gradient-to-r from-Blue/10 to-Orange/10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Order Number */}
                      <div className="text-center md:text-left">
                        <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                          <Ticket className="w-4 h-4 text-Blue" />
                          <p className="text-sm text-Blue/80">
                            Nomor Pemesanan
                          </p>
                        </div>
                        <p className="font-mono font-bold text-lg text-Blue">
                          {booking.order_id}
                        </p>
                      </div>

                      {/* Countdown */}
                      <div className="text-center md:text-right">
                        <div className="flex items-center gap-2 justify-center md:justify-end mb-2">
                          <Clock className="w-4 h-4 text-Orange" />
                          <p className="text-sm text-Orange/80">
                            Status Pembayaran
                          </p>
                        </div>
                        {paymentData?.status === "PAID" ? (
                          <p className="font-semibold text-green-600">
                            Sudah Dibayar
                          </p>
                        ) : (
                          <p className="font-mono font-bold text-Orange">
                            {countdown}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payment & Instructions Sidebar */}
            <div className="space-y-6">
              {/* Payment Method Card */}
              <Card className="overflow-hidden border-2 border-Blue/30">
                <CardHeader className="bg-Blue/10 border-b border-Blue/20 p-4">
                  <CardTitle className="text-lg text-Blue flex items-center gap-2">
                    <QrCode className="w-5 h-5" />
                    Metode Pembayaran
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {(() => {
                    const isQRPayment = paymentData?.qr_url;
                    const isVAPayment =
                      paymentData?.pay_code && !paymentData?.qr_url;
                    const isRedirectPayment =
                      paymentData?.pay_url &&
                      !paymentData?.qr_url &&
                      !paymentData?.pay_code;

                    if (isQRPayment && paymentData?.qr_url) {
                      return (
                        <div className="text-center">
                          <div className="bg-white p-4 rounded-lg border-2 border-Blue/20 mb-4">
                            <Image
                              width={200}
                              height={200}
                              src={paymentData.qr_url}
                              className="w-40 h-40 mx-auto"
                              alt="QR Code untuk Pembayaran"
                            />
                          </div>
                          <p className="text-sm text-gray-600">
                            Scan dengan aplikasi mobile banking atau e-wallet
                          </p>
                        </div>
                      );
                    } else if (isVAPayment) {
                      return (
                        <div className="text-center space-y-4">
                          <div className="bg-Blue/5 rounded-lg p-4 border border-Blue/20">
                            <div className="flex items-center justify-center gap-2 mb-2">
                              <Hash className="w-4 h-4 text-Blue" />
                              <p className="text-sm text-Blue/80">
                                Nomor Virtual Account
                              </p>
                            </div>
                            <p className="font-mono font-bold text-lg text-Blue tracking-wider">
                              {paymentData.pay_code}
                            </p>
                          </div>
                          <Button
                            onClick={() => {
                              navigator.clipboard.writeText(
                                paymentData.pay_code
                              );
                              toast.success("Nomor Virtual Account disalin!");
                            }}
                            className="w-full bg-Orange hover:bg-Orange/90 text-white"
                            size="sm"
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Salin Nomor
                          </Button>
                        </div>
                      );
                    } else if (isRedirectPayment) {
                      return (
                        <div className="text-center space-y-4">
                          <div className="bg-Orange/5 rounded-lg p-4 border border-Orange/20">
                            <div className="flex items-center justify-center gap-2 mb-2">
                              <CreditCard className="w-4 h-4 text-Orange" />
                              <p className="text-sm text-Orange/80">
                                Halaman Checkout
                              </p>
                            </div>
                            <p className="text-sm text-gray-600 mb-4">
                              Klik tombol di bawah untuk melanjutkan pembayaran
                            </p>
                          </div>
                          <Button
                            onClick={() => {
                              window.open(paymentData.pay_url, "_blank");
                            }}
                            className="w-full bg-gradient-to-r from-Orange to-Orange/90 hover:from-Orange/90 hover:to-Orange text-white"
                            size="lg"
                          >
                            <CreditCard className="w-4 h-4 mr-2" />
                            Lanjutkan Pembayaran
                          </Button>
                          <p className="text-xs text-gray-500">
                            Anda akan diarahkan ke halaman pembayaran Tripay
                          </p>
                        </div>
                      );
                    } else {
                      return (
                        <div className="text-center text-gray-500 py-8">
                          <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                          <p>Informasi pembayaran sedang dimuat...</p>
                        </div>
                      );
                    }
                  })()}
                </CardContent>
              </Card>
              {/* Bottom Notice */}
              <div className="mt-8 text-center text-sm bg-gradient-to-r from-Blue/20 to-Orange/20 rounded-lg p-4">
                <p className="text-Blue font-medium">
                  Simpan invoice ini sebagai bukti pembayaran
                </p>
                <p className="text-Orange font-medium">
                  Tunjukkan saat check-in di pelabuhan
                </p>
              </div>
            </div>
            {/* Instructions Card */}
            <Card className="overflow-hidden shadow-lg border-2 border-Orange/30 xl:col-span-3 py-0 gap-0 mb-4">
              <CardHeader className="bg-Orange/10 border-b border-Orange/20 p-4 ">
                <CardTitle className="text-lg text-Orange flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Panduan Pembayaran
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4">
                  {paymentData?.instructions.map((instruction, index) => (
                    <div key={index}>
                      <h4 className="font-semibold text-gray-600 mb-2">
                        {instruction.title}
                      </h4>
                      <ol className="list-decimal pl-5 space-y-1">
                        {instruction.steps.map((step, stepIndex) => (
                          <li key={stepIndex} className="text-sm text-gray-600">
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
