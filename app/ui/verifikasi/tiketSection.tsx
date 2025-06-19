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
      <Card className="py-4">
        <CardHeader className="">
          <CardTitle>Pilih Metode Pembayaran Anda</CardTitle>
          <CardDescription>
            Silakan pilih metode pembayaran yang tersedia
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 flex flex-col md:flex-row justify-center gap-8">
          <div className="w-full">
            <Select onValueChange={(value) => setSelected(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih metode pembayaran" />
              </SelectTrigger>
              <SelectContent className="p-2">
                {/* Virtual Account */}
                {channels.some((ch) => ch.group === "Virtual Account") && (
                  <>
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      Virtual Account
                    </p>
                    <SelectGroup>
                      {channels
                        .filter((ch) => ch.group === "Virtual Account")
                        .map((ch) => (
                          <SelectItem key={ch.code} value={ch.code}>
                            <div className="flex items-center gap-2">
                              <span>{ch.name}</span>{" "}
                              {/* Nama metode pembayaran */}
                              <img
                                src={ch.icon_url}
                                alt={ch.name}
                                className="w-8 h-3"
                              />{" "}
                              {/* Ikon */}
                            </div>
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  </>
                )}

                {/* E-Wallet */}
                {channels.some((ch) => ch.group === "E-Wallet") && (
                  <>
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      E-Wallet
                    </p>
                    <SelectGroup>
                      {channels
                        .filter((ch) => ch.group === "E-Wallet")
                        .map((ch) => (
                          <SelectItem key={ch.code} value={ch.code}>
                             <div className="flex items-center gap-2">
                              <span>{ch.name}</span>{" "}
                              {/* Nama metode pembayaran */}
                              <img
                                src={ch.icon_url}
                                alt={ch.name}
                                className="w-8 h-3"
                              />{" "}
                              {/* Ikon */}
                            </div>
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          {loading ? (
            <div className="w-full text-center text-gray-500 font-semibold">
              Sedang diproses...
            </div>
          ) : (
            <Button
              className="w-full bg-Blue hover:bg-teal-600"
              onClick={handleBayar}
              disabled={!selected || loading}
            >
              Bayar
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Dialog Konfirmasi */}
      <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Pembayaran</AlertDialogTitle>
            <AlertDialogDescription>
              Anda hanya memiliki waktu 2 jam untuk melakukan pembayaran. Apakah
              Anda yakin ingin melanjutkan?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpenDialog(false)}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmBayar} className="bg-Blue hover:bg-teal-600">
              Lanjutkan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
