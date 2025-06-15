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

export default function TiketSesi({ orderId, scheduleId }: { orderId: string; scheduleId?: string }) {
  const [channels, setChannels] = useState<any[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false); // State untuk dialog konfirmasi
  const router = useRouter();

  useEffect(() => {
    if (orderId) {
      getPaymentChannels()
        .then((res) => setChannels(res.data))
        .catch(() => setChannels([]));
    }
  }, [orderId]);

  const handleConfirmBayar = async () => {
    setOpenDialog(false); // Tutup dialog
    setLoading(true);
    try {
      const result = await createPaymentTransaction(orderId, selected? selected : "manual");
      const invoiceUrl = `/book/${scheduleId}/invoice/${orderId}`;
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
            Silakan pilih metode pembayaran yang tersedia untuk menyelesaikan
            transaksi Anda.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {channels.map((ch: any) => (
            <label
              key={ch.code}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="radio"
                name="payment"
                value={ch.code}
                checked={selected === ch.code}
                onChange={() => setSelected(ch.code)}
              />
              <img src={ch.icon_url} alt={ch.name} width={32} height={32} />
              <span>
                {ch.name} ({ch.group})
              </span>
            </label>
          ))}
        </CardContent>
        <CardFooter>
          <Button className="w-full bg-Blue" onClick={handleBayar} disabled={!selected || loading}>
            Bayar
          </Button>
        </CardFooter>
      </Card>

      {/* Dialog Konfirmasi */}
      <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Pembayaran</AlertDialogTitle>
            <AlertDialogDescription>
              Anda hanya memiliki waktu 2 jam untuk melakukan pembayaran. Apakah Anda yakin ingin melanjutkan?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpenDialog(false)}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmBayar}>
              Lanjutkan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}