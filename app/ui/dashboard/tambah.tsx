"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Order } from "@/types/order";
import { useState } from "react";
import { toast } from "sonner";

interface Schedule {
  id: string;
  destination: string;
  orders: Order[];
}

interface TambahModalProps {
  selectedSchedule?: Schedule;
  onAddOrder: (order: Order) => void;
}
export default function TambahModal({
  selectedSchedule,
  onAddOrder,
}: TambahModalProps) {
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState<Order>({
    id: "",
    name: "",
    address: "",
    age: 0,
    gender: "",
    idType: "",
    idNumber: "",
    class: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "age" ? parseInt(value) || 0 : value,
    }));
  };

  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      address: "",
      age: 0,
      gender: "",
      idType: "",
      idNumber: "",
      class: "",
    });
  };

  const handleSubmit = () => {
    if (!selectedSchedule) {
      toast.error("Silakan pilih jadwal terlebih dahulu.");
      return;
    }

    if (!formData.id || !formData.name || !formData.address) {
      toast.error("Harap lengkapi data terlebih dahulu.");
      return;
    }

    console.log("Submit ke jadwal:", selectedSchedule);
    console.log("Data:", formData);

    onAddOrder(formData);
    toast.success("Data berhasil ditambahkan!");
    resetForm();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-Blue text-white">
          Tambah
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Tambah Data</DialogTitle>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          className="space-y-2"
        >
          <Input
            placeholder="ID"
            name="id"
            value={formData.id}
            onChange={handleChange}
          />
          <Input
            placeholder="Nama"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          <Input
            placeholder="Alamat"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
          <Input
            placeholder="Umur"
            name="age"
            value={formData.age.toString()}
            onChange={handleChange}
          />
          <Input
            placeholder="Jenis Kelamin"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          />
          <Input
            placeholder="Jenis ID"
            name="idType"
            value={formData.idType}
            onChange={handleChange}
          />
          <Input
            placeholder="No ID"
            name="idNumber"
            value={formData.idNumber}
            onChange={handleChange}
          />
          <Input
            placeholder="Kelas"
            name="class"
            value={formData.class}
            onChange={handleChange}
          />

          {/* AlertDialog untuk konfirmasi */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button type="button" className="bg-Blue text-white w-full">
                Simpan
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Konfirmasi Tambah Data</AlertDialogTitle>
                <AlertDialogDescription>
                  Apakah Anda yakin ingin menambahkan data ini ke jadwal{" "}
                  <strong>{selectedSchedule?.destination}</strong>?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction onClick={handleSubmit}>
                  Ya, Tambahkan
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </form>
      </DialogContent>
    </Dialog>
  );
}
