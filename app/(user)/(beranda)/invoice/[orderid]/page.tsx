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
import { ArrowLeft } from "lucide-react";

export default function InvoicePage() {
  const params = useParams();
  const router = useRouter();
  const rawOrderId = params?.orderid;
  const orderId = Array.isArray(rawOrderId) ? rawOrderId[0] : rawOrderId;

  const [showExitDialog, setShowExitDialog] = useState(false);

  useEffect(() => {
    // ✅ Only handle back button navigation
    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      setShowExitDialog(true);

      // Push state back to prevent actual navigation
      history.pushState({ fromInvoice: true }, "", window.location.href);
    };

    // Add state for back button detection
    if (!history.state?.fromInvoice) {
      history.pushState({ fromInvoice: true }, "", window.location.href);
    }

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [router]);

  const handleConfirmExit = () => {
    setShowExitDialog(false);
    // ✅ Remove the history state before navigating
    history.replaceState(null, "", window.location.href);
    router.replace("/");
  };

  const handleCancelExit = () => {
    setShowExitDialog(false);
    // State already pushed back in handlePopState
  };

  return (
    <>
      {/* ✅ Main Invoice Content */}
      <div className="min-h-screen">
        {/* ✅ Invoice Component */}
        <div className="container mx-auto">
          <Invoices orderId={orderId} />
        </div>

        {/* ✅ Enhanced Security Notice */}
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
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span>🔄 Refresh halaman: ✅ Diizinkan</span>
                    <span>↩️ Tombol back: ⚠️ Akan dikonfirmasi</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Exit Dialog */}
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
                  Menggunakan tombol back browser
                </p>
              </div>
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 leading-relaxed">
              Anda mencoba kembali menggunakan tombol back browser. Pastikan Anda sudah
              mengunduh atau menyimpan invoice untuk keperluan perjalanan.
              <br /><br />
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <span className="text-sm font-medium text-blue-700">
                  💡 Tip: Anda bisa refresh halaman ini kapan saja tanpa konfirmasi
                </span>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3">
            <AlertDialogCancel
              onClick={handleCancelExit}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-300"
            >
              Tetap di Invoice
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