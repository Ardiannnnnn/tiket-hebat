"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { poppins } from "@/app/ui/fonts";
import {
  Shield,
  Database,
  Settings,
  Lock,
  Share2,
  Cookie,
  User,
  RefreshCw,
  Mail,
  Phone,
  ArrowLeft,
  Eye,
  UserCheck,
  CreditCard,
  Bell,
  BarChart3,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";

export default function KebijakanPage() {
  return (
    <div className={`${poppins.className} min-h-screen py-8`}>
      <div className="container mx-auto px-4 max-w-4xl">
        {/* ✅ Header Section */}
        <div className="mb-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Kebijakan Privasi
            </h1>
            <p className="text-gray-600 text-lg">
              Perlindungan data dan informasi pribadi pengguna
            </p>
          </div>
        </div>

        {/* ✅ Main Content */}
        <div className="space-y-6">
          {/* 1. Pengumpulan Informasi */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <h2 className="text-xl font-bold flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Database className="w-4 h-4 text-blue-600" />
                </div>
                1. Pengumpulan Informasi
              </h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 font-medium">
                Kami mengumpulkan informasi pribadi dari pengguna saat:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <CreditCard className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">Pemesanan tiket</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <Bell className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">Layanan pelanggan</p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-gray-700 font-medium mb-3">
                  Informasi yang dikumpulkan dapat mencakup:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {[
                    "Nama lengkap",
                    "Alamat email",
                    "Nomor telepon",
                    "Alamat identitas",
                    "Informasi kendaraan (untuk tiket kendaraan)",
                    "Data pembayaran (diproses melalui pihak ketiga yang aman)",
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                      <span className="text-gray-700 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 2. Penggunaan Informasi */}
          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <h2 className="text-xl font-bold flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Settings className="w-4 h-4 text-green-600" />
                </div>
                2. Penggunaan Informasi
              </h2>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-gray-700 font-medium mb-4">
                Data yang kami kumpulkan digunakan untuk:
              </p>

              <div className="space-y-3">
                {[
                  {
                    icon: CreditCard,
                    text: "Memproses dan mengelola pemesanan tiket",
                  },
                  { icon: Bell, text: "Mengirim notifikasi terkait pemesanan" },
                  { icon: User, text: "Menyediakan layanan pelanggan" },
                  {
                    icon: BarChart3,
                    text: "Meningkatkan kualitas layanan dan fitur website",
                  },
                  { icon: Shield, text: "Keperluan audit dan keamanan sistem" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-green-50 rounded-lg"
                  >
                    <item.icon className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700">{item.text}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 3. Perlindungan Data */}
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader>
              <h2 className="text-xl font-bold flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <Lock className="w-4 h-4 text-orange-600" />
                </div>
                3. Perlindungan Data
              </h2>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <Shield className="w-6 h-6 text-orange-600 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">
                    Kami menerapkan langkah-langkah keamanan teknis dan
                    administratif untuk melindungi data pengguna dari akses
                    tidak sah, penyalahgunaan, atau kebocoran.
                  </p>
                </div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <CreditCard className="w-6 h-6 text-orange-600 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">
                    Data pembayaran ditangani melalui mitra pembayaran resmi
                    yang telah bersertifikat keamanan.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 4. Berbagi Informasi */}
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader>
              <h2 className="text-xl font-bold flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Share2 className="w-4 h-4 text-purple-600" />
                </div>
                4. Berbagi Informasi
              </h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                  <p className="text-gray-700 font-medium">
                    Kami{" "}
                    <span className="text-red-600 font-bold">
                      tidak akan menjual, menyewakan, atau menukar
                    </span>{" "}
                    informasi pribadi Anda kepada pihak ketiga tanpa persetujuan
                    Anda, kecuali jika diwajibkan oleh hukum atau proses hukum.
                  </p>
                </div>
              </div>

              <p className="text-gray-700 font-medium">
                Informasi hanya dibagikan kepada:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <CreditCard className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">
                    Penyedia layanan pembayaran
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <UserCheck className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">
                    Pihak pelabuhan atau operator kapal
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <Shield className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">
                    Otoritas hukum jika diminta secara sah
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 5. Cookie dan Teknologi Pelacakan */}
          <Card className="border-l-4 border-l-teal-500">
            <CardHeader>
              <h2 className="text-xl font-bold flex items-center gap-3">
                <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                  <Cookie className="w-4 h-4 text-teal-600" />
                </div>
                5. Cookie dan Teknologi Pelacakan
              </h2>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-gray-700 font-medium">
                Kami menggunakan cookie untuk:
              </p>

              <div className="space-y-2">
                {[
                  "Meningkatkan pengalaman pengguna",
                  "Mengingat preferensi pengguna",
                  "Menganalisis perilaku pengunjung di website",
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-teal-500 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>

              <div className="bg-teal-50 p-4 rounded-lg mt-4">
                <p className="text-gray-700 text-sm">
                  <span className="font-medium">Catatan:</span> Pengguna dapat
                  mengatur browser untuk menolak cookie, namun beberapa fitur
                  situs mungkin tidak berfungsi optimal.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 6. Hak Pengguna */}
          <Card className="border-l-4 border-l-indigo-500">
            <CardHeader>
              <h2 className="text-xl font-bold flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-indigo-600" />
                </div>
                6. Hak Pengguna
              </h2>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-gray-700 font-medium mb-4">
                Pengguna berhak untuk:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <Eye className="w-8 h-8 text-indigo-600 mb-2" />
                  <p className="text-sm font-medium mb-1">Akses & Update</p>
                  <p className="text-xs text-gray-600">
                    Mengakses, memperbarui, atau menghapus informasi pribadi
                  </p>
                </div>
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <RefreshCw className="w-8 h-8 text-indigo-600 mb-2" />
                  <p className="text-sm font-medium mb-1">
                    Menarik Persetujuan
                  </p>
                  <p className="text-xs text-gray-600">
                    Kapan saja dalam batas legal yang diperbolehkan
                  </p>
                </div>
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <AlertTriangle className="w-8 h-8 text-indigo-600 mb-2" />
                  <p className="text-sm font-medium mb-1">Mengajukan Keluhan</p>
                  <p className="text-xs text-gray-600">
                    Jika merasa data disalahgunakan
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 7. Perubahan Kebijakan */}
          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader>
              <h2 className="text-xl font-bold flex items-center gap-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <RefreshCw className="w-4 h-4 text-yellow-600" />
                </div>
                7. Perubahan Kebijakan
              </h2>
            </CardHeader>
            <CardContent>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  Kebijakan privasi ini dapat diperbarui sewaktu-waktu.
                  Perubahan akan diinformasikan melalui halaman ini dan mulai
                  berlaku segera setelah dipublikasikan.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 8. Kontak */}
          <Card className="border-l-4 border-l-red-500">
            <CardHeader>
              <h2 className="text-xl font-bold flex items-center gap-3">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <Mail className="w-4 h-4 text-red-600" />
                </div>
                8. Kontak
              </h2>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Jika Anda memiliki pertanyaan mengenai kebijakan privasi ini,
                silakan hubungi kami di:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mail className="w-6 h-6 text-red-600" />
                    <div>
                      <p className="font-medium text-gray-900">Email</p>
                      <a
                        href="mailto:support@kapalferi.co.id"
                        className="text-red-600 hover:text-red-700 transition-colors"
                      >
                        support@kapalferi.co.id
                      </a>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Phone className="w-6 h-6 text-red-600" />
                    <div>
                      <p className="font-medium text-gray-900">Telepon</p>
                      <a
                        href="tel:+6281234567890"
                        className="text-red-600 hover:text-red-700 transition-colors"
                      >
                        0822-3783-4717
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ✅ Summary Card */}
          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="text-center">
                <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Komitmen Keamanan Data
                </h3>
                <p className="text-gray-700 mb-6">
                  Kami berkomitmen untuk melindungi privasi dan keamanan data
                  pribadi Anda dengan standar keamanan terbaik.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <Lock className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="font-semibold text-sm">Enkripsi Data</p>
                  </div>
                  <div className="text-center">
                    <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="font-semibold text-sm">Keamanan Berlapis</p>
                  </div>
                  <div className="text-center">
                    <User className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <p className="font-semibold text-sm">Kontrol Pengguna</p>
                  </div>
                  <div className="text-center">
                    <AlertTriangle className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                    <p className="font-semibold text-sm">Transparansi</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ✅ Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Link href="/" className="flex-1">
              <Button
                size="lg"
                className="w-full bg-Orange hover:bg-orange-600 text-white"
              >
                <User className="w-5 h-5 mr-2" />
                Mulai Menggunakan Layanan
              </Button>
            </Link>
            <Link href="/kontak" className="flex-1">
              <Button variant="outline" size="lg" className="w-full">
                <Mail className="w-5 h-5 mr-2" />
                Hubungi Kami
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
