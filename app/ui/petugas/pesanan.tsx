"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RiShipFill } from "react-icons/ri";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export default function OrderTable() {
  const [orders, setOrders] = useState([
    {
      id: "C01",
      name: "Ardian",
      address: "Air Dingin",
      age: 18,
      gender: "Pria",
      idType: "KTP",
      idNumber: "112345678912345678",
      class: "Bisnis",
    },
    {
      id: "C02",
      name: "Budi",
      address: "Jakarta",
      age: 22,
      gender: "Pria",
      idType: "KTP",
      idNumber: "112345678912345679",
      class: "Ekonomi",
    },
    {
      id: "C03",
      name: "Citra",
      address: "Bandung",
      age: 25,
      gender: "Wanita",
      idType: "SIM",
      idNumber: "112345678912345680",
      class: "VIP",
    },
  
  ]);

  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [newOrder, setNewOrder] = useState({
    id: "",
    name: "",
    address: "",
    age: "",
    gender: "",
    idType: "",
    idNumber: "",
    class: "",
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleVerification = () => {
    if (!selectedOrder) return;
    toast.success(`Order ${selectedOrder.id} berhasil diverifikasi!`);
    setSelectedOrder(null);
  };

  const handleAddOrder = () => {
    if (!newOrder.id || !newOrder.name || !newOrder.address) {
      toast.error("Harap isi semua data!");
      return;
    }

    setOrders([...orders, { ...newOrder, age: Number(newOrder.age) }]);
    toast.success(`Order ${newOrder.id} berhasil ditambahkan!`);
    setIsAddModalOpen(false);
    setNewOrder({
      id: "",
      name: "",
      address: "",
      age: "",
      gender: "",
      idType: "",
      idNumber: "",
      class: "",
    });
  };

  return (
    <div className="p-4 border-r">
      <Toaster />

      <div className="flex justify-between">
        <div>
          <h2 className="text-lg font-semibold">Pemesanan</h2>
          <p>Sinabang-Calang</p>
        </div>
        <div className="">
          <div className="flex items-center gap-2">
            <RiShipFill />
            <h2 className="text-lg font-semibold">Pelabuhan Calang</h2>
          </div>
          <p className="text-end">Senin, 17 Maret 2025</p>
        </div>
      </div>

      {/* Filter dan Search */}
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          <Select>
            <SelectTrigger className="">
              <SelectValue placeholder="Pilih Jadwal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="jadwal1">Jadwal 1</SelectItem>
              <SelectItem value="jadwal2">Jadwal 2</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="">
              <SelectValue placeholder="Pilih jenis tiket" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bisnis">Bisnis</SelectItem>
              <SelectItem value="ekonomi">Ekonomi</SelectItem>
              <SelectItem value="vip">VIP</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 text-white">Tambah</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tambah Order</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-2">
                <Input
                  placeholder="Order ID"
                  value={newOrder.id}
                  onChange={(e) =>
                    setNewOrder({ ...newOrder, id: e.target.value })
                  }
                />
                <Input
                  placeholder="Nama"
                  value={newOrder.name}
                  onChange={(e) =>
                    setNewOrder({ ...newOrder, name: e.target.value })
                  }
                />
                <Input
                  placeholder="Alamat"
                  value={newOrder.address}
                  onChange={(e) =>
                    setNewOrder({ ...newOrder, address: e.target.value })
                  }
                />
                <Input
                  placeholder="Umur"
                  type="number"
                  value={newOrder.age}
                  onChange={(e) =>
                    setNewOrder({ ...newOrder, age: e.target.value })
                  }
                />
                <Input
                  placeholder="Jenis Kelamin"
                  value={newOrder.gender}
                  onChange={(e) =>
                    setNewOrder({ ...newOrder, gender: e.target.value })
                  }
                />
                <Input
                  placeholder="Jenis ID"
                  value={newOrder.idType}
                  onChange={(e) =>
                    setNewOrder({ ...newOrder, idType: e.target.value })
                  }
                />
                <Input
                  placeholder="No ID"
                  value={newOrder.idNumber}
                  onChange={(e) =>
                    setNewOrder({ ...newOrder, idNumber: e.target.value })
                  }
                />
                <Input
                  placeholder="Kelas"
                  value={newOrder.class}
                  onChange={(e) =>
                    setNewOrder({ ...newOrder, class: e.target.value })
                  }
                />
                <Button onClick={handleAddOrder}>Simpan</Button>
              </div>
            </DialogContent>
          </Dialog>

          <Input placeholder="Cari" className="" />
        </div>
      </div>

      {/* Tabel */}
      <div className="mt-4 overflow-x-auto">
        <table className="border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-left text-sm font-semibold">
              <th className="border border-gray-200 px-4 py-2">Order ID</th>
              <th className="border border-gray-200 px-4 py-2">Aksi</th>
              <th className="border border-gray-200 px-4 py-2">Nama</th>
              <th className="border border-gray-200 px-4 py-2">Alamat</th>
              <th className="border border-gray-200 px-4 py-2">Umur</th>
              <th className="border border-gray-200 px-4 py-2">
                Jenis Kelamin
              </th>
              <th className="border border-gray-200 px-4 py-2">Jenis ID</th>
              <th className="border border-gray-200 px-4 py-2">NO ID</th>
              <th className="border border-gray-200 px-4 py-2">Kelas</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="text-sm">
                <td className="border border-gray-200 px-4 py-2">{order.id}</td>
                <td className="border border-gray-200 px-4 py-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        className="bg-yellow-300 text-black hover:text-white"
                        onClick={() => setSelectedOrder(order)}
                      >
                        Verifikasi
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Konfirmasi Verifikasi
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Apakah Anda yakin ingin memverifikasi order{" "}
                          <strong>{selectedOrder?.id}</strong>?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleVerification}>
                          Ya, Verifikasi
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  {order.name}
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  {order.address}
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  {order.age}
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  {order.gender}
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  {order.idType}
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  {order.idNumber}
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  {order.class}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
