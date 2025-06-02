"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getShipById, updateShip } from "@/service/shipService";
import { Ship } from "@/types/ship";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";

export default function EditKapalPage() {
   const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const router = useRouter();
  const [kapal, setKapal] = useState<Ship | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const validId = Array.isArray(id) ? id[0] : id;

    if (!validId) {
      toast.error("ID kapal tidak valid");
      router.push("/kapal");
      return;
    }

    const fetchData = async () => {
      const ship = await getShipById(validId);
      if (ship) {
        setKapal(ship);
      } else {
        toast.error("Data kapal tidak ditemukan");
        router.push("/kapal");
      }
      setLoading(false);
    };

    fetchData();
  }, [id, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDialogOpen(true); // Open dialog on submit to confirm
  };

  const confirmUpdate = async () => {
    if (!kapal) return;

    const validId = Array.isArray(id) ? id[0] : id;

    if (!validId) {
      toast.error("ID kapal tidak valid");
      return;
    }

    const success = await updateShip(validId, kapal);
    if (success) {
      toast.success("Kapal berhasil diperbarui");
      router.push("/kapal");
    } else {
      toast.error("Gagal memperbarui kapal");
    }
    setIsDialogOpen(false); // Close dialog after action
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (!kapal) return <div className="p-4">Data kapal tidak ditemukan</div>;

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Edit Kapal</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          value={kapal.ship_name}
          onChange={(e) => setKapal({ ...kapal, ship_name: e.target.value })}
          placeholder="Nama Kapal"
        />
        <Input
          value={kapal.status}
          onChange={(e) => setKapal({ ...kapal, status: e.target.value })}
          placeholder="Status"
        />
        <Input
          value={kapal.ship_type}
          onChange={(e) => setKapal({ ...kapal, ship_type: e.target.value })}
          placeholder="Jenis Kapal"
        />
        <Input
          value={kapal.year_operation}
          onChange={(e) => setKapal({ ...kapal, year_operation: e.target.value })}
          placeholder="Tahun"
        />
        <Textarea
          value={kapal.description}
          onChange={(e) => setKapal({ ...kapal, description: e.target.value })}
          placeholder="Deskripsi"
        />
        <Button type="submit">Simpan Perubahan</Button>
      </form>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi</DialogTitle>
          </DialogHeader>
          <p>Apakah Anda yakin ingin memperbarui kapal ini?</p>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={confirmUpdate}>Ya, Perbarui</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
