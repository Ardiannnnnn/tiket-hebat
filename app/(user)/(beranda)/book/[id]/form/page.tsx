"use client";

import FormDataUI from "@/app/ui/form/form";
import { useRouter } from "next/navigation";
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

export default function FormData() {
  const router = useRouter();
  const [showExitDialog, setShowExitDialog] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      (e as any).returnValue = "";
    };

    const handlePopState = (e: PopStateEvent) => {
      // Tampilkan dialog modern alih-alih window.confirm
      setShowExitDialog(true);
      
      // Dorong kembali state sementara dialog ditampilkan
      history.pushState({ fromForm: true }, "", window.location.href);
    };

    // Tambahkan state hanya jika belum ada
    if (!history.state?.fromForm) {
      history.pushState({ fromForm: true }, "", window.location.href);
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
    // State sudah di-push kembali di handlePopState, jadi tidak perlu action tambahan
  };

  return (
    <>
      <FormDataUI />
      
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent className="sm:max-w-[425px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
                <span className="text-orange-600 text-sm">⚠</span>
              </div>
              Konfirmasi Keluar
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              Jika Anda keluar sekarang, semua data yang telah diisi akan hilang. 
              Apakah Anda yakin ingin meninggalkan halaman ini?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-2">
            <AlertDialogCancel 
              onClick={handleCancelExit}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-300"
            >
              Tetap di Halaman
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