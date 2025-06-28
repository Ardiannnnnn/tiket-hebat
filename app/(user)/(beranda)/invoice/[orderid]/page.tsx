"use client";

import Invoices from "@/app/ui/invoice/invoice";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
import { ArrowLeft, FileText } from "lucide-react";

export default function InvoicePage() {
  const params = useParams();
  const router = useRouter();
  const rawOrderId = params?.orderid; // Ambil orderId dari URL
  const orderId = Array.isArray(rawOrderId) ? rawOrderId[0] : rawOrderId;

  const [showExitDialog, setShowExitDialog] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      (e as any).returnValue = "";
      setShowExitDialog(true);
    };

    const handlePopState = (e: PopStateEvent) => {
      // Tampilkan dialog modern alih-alih window.confirm
      setShowExitDialog(true);

      // Dorong kembali state sementara dialog ditampilkan
      history.pushState({ fromInvoice: true }, "", window.location.href);
    };

    // Tambahkan state hanya jika belum ada
    if (!history.state?.fromInvoice) {
      history.pushState({ fromInvoice: true }, "", window.location.href);
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [router]);

  const handleConfirmExit = () => {
    setShowExitDialog(false);
    router.replace("/");
  };

  const handleCancelExit = () => {
    setShowExitDialog(false);
    // State sudah di-push kembali di handlePopState
  };

  return (
    <>
      {/* ✅ Main Invoice Content */}
      <div className="min-h-screen">


        {/* ✅ Invoice Component */}
        <div className="container mx-auto p-4">
          <Invoices orderId={orderId} />
        </div>

        {/* ✅ Security Notice */}
        <div className="container mx-auto px-4 pb-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 text-xs">✓</span>
                </div>
                <div className="text-gray-700">
                  <span className="font-medium">Transaksi Berhasil</span> -
                  Invoice ini adalah bukti pembayaran resmi. Simpan untuk keperluan perjalanan Anda.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Enhanced Exit Dialog */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent className="sm:max-w-[450px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <ArrowLeft className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-lg">Keluar dari Invoice?</p>
                <p className="text-sm text-gray-500 font-normal">
                  Pastikan Anda sudah menyimpan invoice
                </p>
              </div>
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 leading-relaxed">
              Anda akan meninggalkan halaman invoice. Pastikan Anda sudah mengunduh
              atau menyimpan invoice untuk keperluan perjalanan. Anda masih bisa
              mengakses invoice ini melalui menu "Riwayat Pemesanan".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3">
            <AlertDialogCancel
              onClick={handleCancelExit}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-300"
            >
              Tetap di Halaman
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmExit}
              className="bg-Blue hover:bg-Blue/90 text-white"
            >
              Ya, Keluar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}