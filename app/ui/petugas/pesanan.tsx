"use client";
import { useEffect, useState } from "react";
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
export default function OrderTable({ tickets }: { tickets: any[] }) {
  const [ordersTiket, setOrdersTiket] = useState<any[]>([]); // Start empty
  const uniqueSchedules = Array.from(
    new Map(tickets.map((t) => [t.schedule.id, t.schedule])).values()
  );
  const [selectedSchedule, setSelectedSchedule] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedScheduleData, setSelectedScheduleData] = useState<any>(null);

  // Add loading state
  const [loading, setLoading] = useState(true);

  // Update handler untuk select jadwal
  const handleScheduleChange = (scheduleId: string) => {
    setSelectedSchedule(scheduleId);
    const schedule = uniqueSchedules.find((s) => String(s.id) === scheduleId);
    setSelectedScheduleData(schedule);

    // Filter tickets berdasarkan jadwal yang dipilih
    const filteredTickets = tickets.filter(
      (ticket) => String(ticket.schedule.id) === scheduleId
    );
    setOrdersTiket(filteredTickets);
  };

  // Format tanggal
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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

    setOrdersTiket([
      ...ordersTiket,
      { ...newOrder, age: Number(newOrder.age) },
    ]);
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

  // Add useEffect to handle initial loading
  useEffect(() => {
    if (tickets.length > 0) {
      setLoading(false);
    }
  }, [tickets]);

  return (
    <div className="p-4">
      <Toaster />

      <div className="flex justify-between">
        <div>
          <h2 className="text-lg font-semibold">Pemesanan</h2>
          <p>
            {selectedScheduleData ? (
              `${selectedScheduleData.route.departure_harbor.harbor_name} - ${selectedScheduleData.route.arrival_harbor.harbor_name}`
            ) : (
              "Pilih Jadwal"
            )}
          </p>
        </div>
        <div className="">
          <div className="flex items-center gap-2">
            <RiShipFill />
            <h2 className="text-lg font-semibold">
              {selectedScheduleData ? (
                `Pelabuhan ${selectedScheduleData.route.departure_harbor.harbor_name}`
              ) : (
                "Pilih Jadwal"
              )}
            </h2>
          </div>
          <p className="text-end">
            {selectedScheduleData ? (
              formatDate(selectedScheduleData.departure_datetime)
            ) : (
              "Pilih Jadwal"
            )}
          </p>
        </div>
      </div>

      {/* Filter dan Search */}
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          <Select onValueChange={handleScheduleChange}>
            <SelectTrigger className="min-w-[200px]">
              <SelectValue
                placeholder="Pilih Jadwal Terlebih Dahulu"
              />
            </SelectTrigger>
            <SelectContent>
              {loading ? (
                <div className="flex items-center justify-center py-2 text-gray-500">
                  Memuat data...
                </div>
              ) : (
                uniqueSchedules.map((sch) => (
                  <SelectItem key={sch.id} value={String(sch.id)}>
                    {sch.ship.ship_name} - {formatDate(sch.departure_datetime)}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>

          {selectedSchedule && (
            <>
              <Select onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis tiket" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua</SelectItem>
                  <SelectItem value="passenger">Penumpang</SelectItem>
                  <SelectItem value="vehicle">Kendaraan</SelectItem>
                </SelectContent>
              </Select>

              {/* Tambah Button */}
              <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-Blue hover:bg-Blue/90">Tambah</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Tambah Order Baru</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <Input
                      placeholder="Nama Penumpang"
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
                      value={newOrder.age}
                      onChange={(e) =>
                        setNewOrder({ ...newOrder, age: e.target.value })
                      }
                    />
                    <Select
                      value={newOrder.idType}
                      onValueChange={(value) =>
                        setNewOrder({ ...newOrder, idType: value })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih Jenis ID" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="KTP">KTP</SelectItem>
                        <SelectItem value="SIM">SIM</SelectItem>
                        <SelectItem value="Paspor">Paspor</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Nomor ID"
                      value={newOrder.idNumber}
                      onChange={(e) =>
                        setNewOrder({ ...newOrder, idNumber: e.target.value })
                      }
                    />
                    <Select
                      value={newOrder.class}
                      onValueChange={(value) =>
                        setNewOrder({ ...newOrder, class: value })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih Kelas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ekonomi">Ekonomi</SelectItem>
                        <SelectItem value="bisnis">Bisnis</SelectItem>
                        <SelectItem value="utama">Utama</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    className="w-full bg-Blue hover:bg-teal-600"
                    onClick={handleAddOrder}
                  >
                    Tambah Order
                  </Button>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>

        {selectedSchedule && (
          <div className="flex gap-2">
            <Input
              placeholder="Cari"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Tabel */}
      {selectedSchedule ? (
        <div className="mt-4 overflow-x-auto">
          <table className="border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-left text-sm font-semibold">
                <th className="border border-gray-200 px-4 py-2">Aksi</th>
                <th className="border border-gray-200 px-4 py-2">Nama</th>
                <th className="border border-gray-200 px-4 py-2">Alamat</th>
                <th className="border border-gray-200 px-4 py-2">Umur</th>

                <th className="border border-gray-200 px-4 py-2">Jenis ID</th>
                <th className="border border-gray-200 px-4 py-2">NO ID</th>
                <th className="border border-gray-200 px-4 py-2">Kelas</th>
                <th className="border border-gray-200 px-4 py-2">Status</th>
                <th className="border border-gray-200 px-4 py-2">Keterangan</th>
              </tr>
            </thead>
            <tbody>
              {ordersTiket
                .filter((order) => {
                  const matchSchedule = selectedSchedule
                    ? String(order.schedule.id) === selectedSchedule
                    : true;
                  // Jika selectedType "all" atau null, tampilkan semua, jika tidak filter sesuai type
                  const matchType =
                    !selectedType || selectedType === "all"
                      ? true
                      : order.type === selectedType;
                  const matchSearch =
                    searchTerm.trim() === "" ||
                    (order.passenger_name &&
                      order.passenger_name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())) ||
                    (order.address &&
                      order.address.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (order.class?.class_name &&
                      order.class.class_name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()));
                  return matchSchedule && matchType && matchSearch;
                })
                .map((order) => (
                  <tr key={order.id} className="text-sm">
                    <td className="border border-gray-200 px-4 py-2">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            className="bg-yellow-300 text-black hover:bg-yellow-400"
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
                              Apakah Anda yakin ingin memverifikasi tiket{" "}
                              <strong>{selectedOrder?.passenger_name}</strong>?
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
                      {order.passenger_name}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {order.address}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {order.passenger_age}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {order.id_type}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {order.id_number}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {order.class.class_name}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {order.status}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {order.seat_number}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-4 text-center text-gray-500">
          Pilih jadwal untuk melihat data tiket
        </div>
      )}
    </div>
  );
}
