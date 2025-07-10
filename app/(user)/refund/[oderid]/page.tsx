"use client";

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Mail, Clock, CreditCard, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function RefundSuccessPage() {
  const params = useParams();
  const rawOrderId = params?.orderid;
  const orderId = Array.isArray(rawOrderId) ? rawOrderId[0] : rawOrderId;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="text-center">
          <CardHeader className="pb-6">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl text-gray-900">
              Pengajuan Refund Berhasil
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Permintaan refund untuk booking #{orderId} telah berhasil dikirim
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">Langkah Selanjutnya:</h3>
              <div className="space-y-3 text-sm text-blue-700">
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 mt-0.5 text-blue-600" />
                  <p>Kami akan mengirim konfirmasi ke email Anda dalam 1x24 jam</p>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 mt-0.5 text-blue-600" />
                  <p>Proses review pengajuan refund membutuhkan waktu 2-3 hari kerja</p>
                </div>
                <div className="flex items-start gap-3">
                  <CreditCard className="w-4 h-4 mt-0.5 text-blue-600" />
                  <p>Jika disetujui, dana akan dikembalikan dalam 3-7 hari kerja</p>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 rounded-lg p-4">
              <h3 className="font-semibold text-amber-800 mb-2">Catatan Penting:</h3>
              <p className="text-sm text-amber-700">
                Silakan simpan nomor booking #{orderId} sebagai referensi. 
                Anda dapat menghubungi customer service jika memerlukan bantuan lebih lanjut.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href={`/invoice/${orderId}`} className="flex-1">
                <Button variant="outline" size="lg" className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Kembali ke Invoice
                </Button>
              </Link>
              
              <Link href="/" className="flex-1">
                <Button size="lg" className="w-full bg-Blue hover:bg-Blue/90 text-white">
                  Ke Beranda
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}