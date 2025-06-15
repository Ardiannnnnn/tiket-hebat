"use client";
import { useEffect, useState } from "react";
import { getPaymentChannels, createPaymentTransaction } from "@/service/payment";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DialogPembayaranProps {
  orderId: string | number;
  open: boolean;
  onClose: () => void;
  onSuccess: (paymentResult: any) => void;
}

export default function DialogPembayaran({ orderId, open, onClose, onSuccess }: DialogPembayaranProps) {
  const [channels, setChannels] = useState<any[]>([]);
  const [selected, setSelected] = useState<string|null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      getPaymentChannels().then(res => setChannels(res.data));
    }
  }, [open]);

  const handleBayar = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      const result = await createPaymentTransaction(orderId.toString(), selected);
      onSuccess(result); // lanjut ke dialog konfirmasi
      onClose();
    } catch {
      alert("Gagal membuat transaksi pembayaran");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pilih Metode Pembayaran</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          {channels.map((ch: any) => (
            <label key={ch.code} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="payment"
                value={ch.code}
                checked={selected === ch.code}
                onChange={() => setSelected(ch.code)}
              />
              <img src={ch.icon_url} alt={ch.name} width={32} height={32} />
              <span>{ch.name} ({ch.group})</span>
            </label>
          ))}
        </div>
        <DialogFooter>
          <Button onClick={handleBayar} disabled={!selected || loading}>
            Bayar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}