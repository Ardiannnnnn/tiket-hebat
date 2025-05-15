"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createShip } from "@/service/shipService";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";

export default function CreateShipPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    status: "",
    ship_type: "",
    year: "",
    image: "",
    Description: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDialogOpen(true); // Open dialog on submit to confirm
  };

  const confirmCreate = async () => {
    const success = await createShip(formData);
    if (success) {
      toast.success("Kapal berhasil ditambahkan");
      router.push("/kapal");
    } else {
      toast.error("Gagal menambahkan kapal");
    }
    setIsDialogOpen(false); // Close dialog after action
  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <h1 className="text-xl font-bold">Tambah Kapal</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Nama Kapal</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </div>

        <div>
          <Label>Status</Label>
          <Select onValueChange={(val) => handleChange("status", val)}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Beroperasi">Beroperasi</SelectItem>
              <SelectItem value="Dock">Dock</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Jenis Kapal</Label>
          <Select onValueChange={(val) => handleChange("ship_type", val)}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih Jenis Kapal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Kargo">Kargo</SelectItem>
              <SelectItem value="Penumpang">Penumpang</SelectItem>
              <SelectItem value="Pelayaran">Pelayaran</SelectItem>
              <SelectItem value="RoRo">RoRo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="year">Tahun</Label>
          <Input
            id="year"
            value={formData.year}
            onChange={(e) => handleChange("year", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="image">URL Gambar</Label>
          <Input
            id="image"
            value={formData.image}
            onChange={(e) => handleChange("image", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="Description">Deskripsi</Label>
          <Textarea
            id="Description"
            value={formData.Description}
            onChange={(e) => handleChange("Description", e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Button type="submit" >Simpan</Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.back()}
          >
            Batal
          </Button>
        </div>
      </form>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi</DialogTitle>
          </DialogHeader>
          <p>Apakah Anda yakin ingin menambahkan kapal ini?</p>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={confirmCreate}>Ya, Tambahkan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
