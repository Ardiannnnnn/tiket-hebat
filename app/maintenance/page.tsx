"use client";

import { Wrench, Clock, AlertCircle, Mail, Phone } from "lucide-react";

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl border border-blue-200 overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-12 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <Wrench className="w-10 h-10 text-white animate-pulse" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Website Dalam Pemeliharaan
          </h1>
          <p className="text-blue-100 text-lg">Website tidak berfungsi</p>
        </div>

        {/* Content Section */}
        <div className="px-8 py-12">
          <div className="text-center space-y-8">
            {/* Main Message */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <div className="flex items-center justify-center gap-3 mb-4">
                <AlertCircle className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-blue-800">
                  Pemberitahuan
                </h2>
              </div>
              <p className="text-blue-700 leading-relaxed">
                Mohon maaf atas ketidaknyamanan ini. Website kami sedang dalam
                proses pemeliharaan dan sementara tidak dapat diakses. Silakan
                kembali lagi nanti.
              </p>
            </div>

            {/* Status Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="w-5 h-5 text-gray-600" />
                  <h3 className="font-semibold text-gray-800">Status</h3>
                </div>
                <p className="text-gray-600">Sedang Pemeliharaan</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <Wrench className="w-5 h-5 text-gray-600" />
                  <h3 className="font-semibold text-gray-800">Progress</h3>
                </div>
                <p className="text-gray-600">Dalam Proses</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-100 px-8 py-6 text-center border-t border-gray-200">
          <p className="text-gray-600 text-sm">
            © 2025 Tiket Hebat. Terima kasih atas kesabaran Anda.
          </p>
        </div>
      </div>
    </div>
  );
}
