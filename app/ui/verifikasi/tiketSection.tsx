"use client";

import { useEffect, useState } from "react";
import {
  getPaymentChannels,
  createPaymentTransaction,
} from "@/service/payment";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreditCard, Wallet, Building2, Smartphone, Shield, Clock } from "lucide-react";

export default function TiketSesi({ orderId }: { orderId: string }) {
  const [channels, setChannels] = useState<any[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false); // State untuk dialog konfirmasi
  const router = useRouter();

  useEffect(() => {
    if (orderId) {
      getPaymentChannels()
        .then((res) => setChannels(res))
        .catch(() => setChannels([]));
    }
  }, [orderId]);

  const handleConfirmBayar = async () => {
    setOpenDialog(false); // Tutup dialog
    setLoading(true);
    try {
      const result = await createPaymentTransaction(
        orderId,
        selected ? selected : "manual"
      );
      const invoiceUrl = `/invoice/${orderId}`;
      if (invoiceUrl) {
        router.push(invoiceUrl); // Redirect ke halaman pembayaran
      } else {
        alert("Gagal mendapatkan link pembayaran.");
      }
    } catch {
      alert("Gagal membuat transaksi pembayaran.");
    } finally {
      setLoading(false);
    }
  };

  const handleBayar = () => {
    if (!selected || !orderId) return;
    setOpenDialog(true); // Tampilkan dialog konfirmasi
  };

  return (
    <>
      {/* ✅ Enhanced Payment Card */}
      <Card className="shadow-xl border-0 bg-white overflow-hidden py-0 gap-0">
        
        {/* ✅ Modern Header */}
        <CardHeader className="bg-gradient-to-r from-Blue/10 to-Orange/10 border-b border-Blue/20 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-Blue/20 rounded-full flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-Blue" />
            </div>
            <div>
              <CardTitle className="text-xl text-gray-900">Metode Pembayaran</CardTitle>
              <CardDescription className="text-gray-600 mt-1">
                Pilih metode pembayaran yang Anda inginkan
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* ✅ Payment Options with Icons */}
          <div className="space-y-6">
            
            {/* Payment Method Selector */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Wallet className="w-4 h-4" />
                Pilih Metode Pembayaran
              </label>
              
              <Select onValueChange={(value) => setSelected(value)}>
                <SelectTrigger className="w-full h-14 text-left border-2 border-gray-200 hover:border-Blue/50 focus:border-Blue transition-colors">
                  <SelectValue placeholder="Pilih metode pembayaran..." />
                </SelectTrigger>
                <SelectContent className="p-0 border-0 shadow-xl">
                  
                  {/* ✅ Virtual Account Section */}
                  {channels.some((ch) => ch.group === "Virtual Account") && (
                    <div className="p-3 border-b border-gray-100">
                      <div className="flex items-center gap-2 mb-3 px-2">
                        <Building2 className="w-4 h-4 text-Blue" />
                        <p className="text-sm font-semibold text-gray-700">Virtual Account</p>
                      </div>
                      <SelectGroup>
                        {channels
                          .filter((ch) => ch.group === "Virtual Account")
                          .map((ch) => (
                            <SelectItem key={ch.code} value={ch.code} className="p-3 cursor-pointer hover:bg-Blue/5">
                              <div className="flex items-center justify-between w-full">
                                <span className="font-medium">{ch.name}</span>
                                <img
                                  src={ch.icon_url}
                                  alt={ch.name}
                                  className="w-10 h-6 object-contain"
                                />
                              </div>
                            </SelectItem>
                          ))}
                      </SelectGroup>
                    </div>
                  )}

                  {/* ✅ E-Wallet Section */}
                  {channels.some((ch) => ch.group === "E-Wallet") && (
                    <div className="p-3">
                      <div className="flex items-center gap-2 mb-3 px-2">
                        <Smartphone className="w-4 h-4 text-Orange" />
                        <p className="text-sm font-semibold text-gray-700">E-Wallet</p>
                      </div>
                      <SelectGroup>
                        {channels
                          .filter((ch) => ch.group === "E-Wallet")
                          .map((ch) => (
                            <SelectItem key={ch.code} value={ch.code} className="p-3 cursor-pointer hover:bg-Orange/5">
                              <div className="flex items-center justify-between w-full">
                                <span className="font-medium">{ch.name}</span>
                                <img
                                  src={ch.icon_url}
                                  alt={ch.name}
                                  className="w-10 h-6 object-contain"
                                />
                              </div>
                            </SelectItem>
                          ))}
                      </SelectGroup>
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* ✅ Security & Time Notice */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                <Shield className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-green-800">Pembayaran Aman</p>
                  <p className="text-xs text-green-600">Dilindungi enkripsi SSL</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg border border-orange-200">
                <Clock className="w-5 h-5 text-orange-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-orange-800">Batas Waktu</p>
                  <p className="text-xs text-orange-600">2 jam setelah konfirmasi</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>

        {/* ✅ Enhanced Footer */}
        <CardFooter className="p-6 bg-gray-50 border-t border-gray-200">
          {loading ? (
            <div className="w-full bg-Blue/10 text-Blue py-4 rounded-lg text-center font-medium">
              <div className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-2 border-Blue border-t-transparent rounded-full animate-spin"></div>
                Sedang memproses pembayaran...
              </div>
            </div>
          ) : (
            <Button
              className={`w-full h-14 text-lg font-semibold transition-all duration-200 ${
                selected 
                  ? "bg-gradient-to-r from-Blue to-Blue/90 hover:from-Blue/90 hover:to-Blue shadow-lg hover:shadow-xl" 
                  : "bg-gray-300 cursor-not-allowed"
              }`}
              onClick={handleBayar}
              disabled={!selected || loading}
            >
              {selected ? "Lanjutkan Pembayaran" : "Pilih Metode Pembayaran"}
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* ✅ Enhanced Confirmation Dialog */}
      <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
        <AlertDialogContent className="sm:max-w-[450px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-Blue/10 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-Blue" />
              </div>
              <div>
                <p className="text-lg">Konfirmasi Pembayaran</p>
                <p className="text-sm text-gray-500 font-normal">Periksa kembali pesanan Anda</p>
              </div>
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 leading-relaxed space-y-2">
              <p>Anda akan dialihkan ke halaman pembayaran dan memiliki waktu <span className="font-semibold text-orange-600">2 jam</span> untuk menyelesaikan transaksi.</p>
              <p className="text-sm text-gray-500">Pastikan detail pesanan sudah benar sebelum melanjutkan.</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3">
            <AlertDialogCancel 
              onClick={() => setOpenDialog(false)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-300"
            >
              Periksa Kembali
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmBayar} 
              className="bg-gradient-to-r from-Blue to-Blue/90 hover:from-Blue/90 hover:to-Blue"
            >
              Ya, Lanjutkan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
