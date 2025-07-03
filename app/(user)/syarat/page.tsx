"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { poppins } from "@/app/ui/fonts";
import {
  FileText,
  CreditCard,
  RotateCcw,
  Clock,
  CheckCircle,
  Car,
  AlertCircle,
  ArrowLeft,
  Shield,
  DollarSign,
  Calendar,
  MapPin,
} from "lucide-react";
import Link from "next/link";

export default function SyaratPage() {
  return (
    <div className={`${poppins.className} min-h-screen py-8`}>
      <div className="container mx-auto px-4 max-w-4xl">
        {/* ✅ Header Section */}
        <div className="mb-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Syarat dan Ketentuan
            </h1>
            <p className="text-gray-600 text-lg">Pemesanan Tiket Kapal Ferry</p>
          </div>
        </div>

        {/* ✅ Main Content */}
        <div className="space-y-6">
          {/* 1. Pemesanan Tiket */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <h2 className="text-xl font-bold flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                1. Pemesanan Tiket
              </h2>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">
                  Pemesanan hanya dapat dilakukan melalui website resmi yang
                  telah ditentukan.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">
                  Setiap penumpang wajib mengisi data dengan benar dan sesuai
                  identitas resmi (KTP, SIM, Paspor).
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">
                  Tiket hanya berlaku untuk jadwal dan rute yang dipilih saat
                  pemesanan.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 2. Pembayaran */}
          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <h2 className="text-xl font-bold flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-green-600" />
                </div>
                2. Pembayaran
              </h2>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">
                  Pembayaran dilakukan secara online menggunakan metode yang
                  tersedia (transfer bank, e-wallet, kartu kredit, dll).
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">
                  Tiket akan diterbitkan setelah pembayaran berhasil
                  dikonfirmasi.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">
                  <span className="font-semibold text-red-600">
                    Batas waktu pembayaran adalah 30 menit - 2 jam
                  </span>{" "}
                  sejak pemesanan dilakukan. Melebihi waktu tersebut, pesanan
                  akan otomatis dibatalkan.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 3. Pembatalan dan Pengembalian Dana */}
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader>
              <h2 className="text-xl font-bold flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <RotateCcw className="w-4 h-4 text-orange-600" />
                </div>
                3. Pembatalan dan Pengembalian Dana
              </h2>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">
                  Pembatalan tiket dapat dilakukan maksimal{" "}
                  <span className="font-semibold">
                    1×24 jam sebelum jadwal keberangkatan
                  </span>
                  .
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">
                  Pengembalian dana (refund) dikenakan{" "}
                  <span className="font-semibold text-orange-600">
                    biaya administrasi 10%
                  </span>{" "}
                  dari harga tiket.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">
                  Tiket yang sudah dicetak atau digunakan tidak dapat dibatalkan
                  atau diubah.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 4. Perubahan Jadwal */}
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader>
              <h2 className="text-xl font-bold flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-purple-600" />
                </div>
                4. Perubahan Jadwal
              </h2>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">
                  Perubahan jadwal hanya dapat dilakukan{" "}
                  <span className="font-semibold">
                    sekali, maksimal 12 jam sebelum keberangkatan
                  </span>{" "}
                  dan tergantung ketersediaan kursi.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">
                  Perubahan dikenakan biaya administrasi tertentu sesuai
                  kebijakan perusahaan.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 5. Check-in dan Keberangkatan */}
          <Card className="border-l-4 border-l-teal-500">
            <CardHeader>
              <h2 className="text-xl font-bold flex items-center gap-3">
                <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-teal-600" />
                </div>
                5. Check-in dan Keberangkatan
              </h2>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">
                  Penumpang wajib check-in di pelabuhan minimal{" "}
                  <span className="font-semibold text-teal-600">
                    60 menit sebelum keberangkatan
                  </span>
                  .
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">
                  Penumpang yang datang terlambat tidak berhak atas pengembalian
                  dana.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">
                  Harap membawa tiket elektronik (e-ticket) dan identitas asli
                  saat check-in.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 6. Tiket Kendaraan */}
          <Card className="border-l-4 border-l-indigo-500">
            <CardHeader>
              <h2 className="text-xl font-bold flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <Car className="w-4 h-4 text-indigo-600" />
                </div>
                6. Tiket Kendaraan
              </h2>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">
                  Kendaraan wajib masuk area pelabuhan minimal{" "}
                  <span className="font-semibold text-indigo-600">
                    90 menit sebelum keberangkatan
                  </span>
                  .
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">
                  Pastikan data kendaraan sesuai dengan yang diinput saat
                  pemesanan (nomor polisi, jenis kendaraan, panjang/tinggi).
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 7. Ketentuan Umum */}
          <Card className="border-l-4 border-l-red-500">
            <CardHeader>
              <h2 className="text-xl font-bold flex items-center gap-3">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                </div>
                7. Ketentuan Umum
              </h2>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">
                  Tiket tidak dapat dipindahtangankan tanpa persetujuan resmi.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">
                  Operator berhak membatalkan atau menjadwal ulang pelayaran
                  jika terjadi cuaca buruk atau keadaan darurat, tanpa
                  kompensasi selain pengembalian tiket.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700 font-semibold">
                  Dengan memesan tiket, penumpang dianggap menyetujui seluruh
                  syarat dan ketentuan ini.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ✅ Summary Card */}
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="text-center">
                <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Penting untuk Diingat
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="text-center">
                    <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="font-semibold text-sm">Check-in</p>
                    <p className="text-xs text-gray-600">60 menit sebelum</p>
                  </div>
                  <div className="text-center">
                    <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="font-semibold text-sm">Pembayaran</p>
                    <p className="text-xs text-gray-600">Maksimal 30 menit</p>
                  </div>
                  <div className="text-center">
                    <RotateCcw className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                    <p className="font-semibold text-sm">Pembatalan</p>
                    <p className="text-xs text-gray-600">1×24 jam sebelum</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ✅ Action Buttons dengan subject email */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Link href="/" className="flex-1">
              <Button
                size="lg"
                className="w-full bg-Orange hover:bg-orange-600 text-white"
              >
                <MapPin className="w-5 h-5 mr-2" />
                Mulai Pesan Tiket
              </Button>
            </Link>
            <a
              href="mailto:TiketHebat2@gmail.com?subject=Pertanyaan%20Syarat%20dan%20Ketentuan&body=Halo%20Tim%20TiketHebat,%0A%0ASaya%20memiliki%20pertanyaan%20terkait%20syarat%20dan%20ketentuan%20pemesanan%20tiket.%0A%0ATerima%20kasih."
              className="flex-1"
            >
              <Button variant="outline" size="lg" className="w-full">
                <FileText className="w-5 h-5 mr-2" />
                Hubungi Kami
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
