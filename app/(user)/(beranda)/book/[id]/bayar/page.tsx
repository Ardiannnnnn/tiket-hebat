"use client";

import TiketSesi from "@/app/ui/verifikasi/tiketSection";
import Total from "@/app/ui/verifikasi/totalBayar";
import { useSearchParams, useRouter } from "next/navigation";
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
import { CreditCard, ArrowLeft } from "lucide-react";

export default function BayarPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams?.get("order_id");
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
      history.pushState({ fromPayment: true }, "", window.location.href);
    };

    // Tambahkan state hanya jika belum ada
    if (!history.state?.fromPayment) {
      history.pushState({ fromPayment: true }, "", window.location.href);
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
      {/* ✅ Enhanced Container with Gradient Background */}
      <div className="">
        {/* ✅ Modern Header Section */}
        <div className="">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {/* Step Indicator */}
              <div className="flex flex-col md-flex-row items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-Blue to-Blue/90 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  4
                </div>
                <div className="text-center sm:text-left">
                  <h1 className="text-xl font-semibold text-gray-900">
                    Pembayaran
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Main Content with Better Layout */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            {/* ✅ Responsive Grid Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
              {/* Payment Section - Takes 2 columns on xl screens */}
              <div className="xl:col-span-2 order-2 xl:order-1">
                <TiketSesi orderId={orderId || ""} />
              </div>

              {/* Summary Section - Takes 1 column on xl screens */}
              <div className="xl:col-span-1 order-1 xl:order-2">
                <div className="sticky top-8">
                  <Total orderId={orderId || ""} />
                </div>
              </div>
            </div>

            {/* ✅ Security Notice */}
            <div className="mt-8 max-w-4xl mx-auto">
              <div className="bg-gradient-to-r from-Blue/10 to-Orange/10 rounded-lg p-4 border border-Blue/20">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-6 h-6 bg-Blue/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-Blue text-xs">🔒</span>
                  </div>
                  <div className="text-gray-700">
                    <span className="font-medium">Transaksi Aman</span> - Data
                    pembayaran Anda dilindungi dengan enkripsi SSL 256-bit
                  </div>
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
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <ArrowLeft className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-lg">Keluar dari Pembayaran?</p>
                <p className="text-sm text-gray-500 font-normal">
                  Transaksi belum selesai
                </p>
              </div>
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 leading-relaxed">
              Anda akan meninggalkan halaman pembayaran dan transaksi belum
              selesai. Progres pembayaran akan hilang dan Anda harus memulai
              dari awal.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3">
            <AlertDialogCancel
              onClick={handleCancelExit}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-300"
            >
              Lanjut Bayar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmExit}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Ya, Keluar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
