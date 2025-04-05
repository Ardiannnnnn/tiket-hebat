"use client";
import { Order } from "@/types/order";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useCallback, useMemo, useState } from "react";
import TambahModal from "./tambah";
import { useDebouncedCallback } from "use-debounce";
import { Toaster } from "sonner";

const schedules = [
  {
    id: "jadwal1",
    destination: "Jakarta - Banda Aceh",
    orders: [
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
        name: "Dewi",
        address: "Medan",
        age: 30,
        gender: "Wanita",
        idType: "KTP",
        idNumber: "112345678912345681",
        class: "VIP",
      },
      {
        id: "C03",
        name: "Joko",
        address: "Padang",
        age: 27,
        gender: "Pria",
        idType: "SIM",
        idNumber: "112345678912345682",
        class: "Ekonomi",
      },
    ],
  },
  {
    id: "jadwal2",
    destination: "Singkil - Simeulue",
    orders: [
      {
        id: "C04",
        name: "Budi",
        address: "Jakarta",
        age: 22,
        gender: "Pria",
        idType: "KTP",
        idNumber: "112345678912345679",
        class: "Ekonomi",
      },
      {
        id: "C05",
        name: "Sari",
        address: "Simeulue",
        age: 24,
        gender: "Wanita",
        idType: "SIM",
        idNumber: "112345678912345683",
        class: "Bisnis",
      },
      {
        id: "C06",
        name: "Andi",
        address: "Meulaboh",
        age: 29,
        gender: "Pria",
        idType: "KTP",
        idNumber: "112345678912345684",
        class: "VIP",
      },
    ],
  },
  {
    id: "jadwal3",
    destination: "Sabang - Banda Aceh",
    orders: [
      {
        id: "C07",
        name: "Citra",
        address: "Bandung",
        age: 25,
        gender: "Wanita",
        idType: "SIM",
        idNumber: "112345678912345680",
        class: "VIP",
      },
      {
        id: "C08",
        name: "Putra",
        address: "Aceh",
        age: 31,
        gender: "Pria",
        idType: "KTP",
        idNumber: "112345678912345685",
        class: "Bisnis",
      },
      {
        id: "C09",
        name: "Rina",
        address: "Lhokseumawe",
        age: 20,
        gender: "Wanita",
        idType: "KTP",
        idNumber: "112345678912345686",
        class: "Ekonomi",
      },
    ],
  },
];

export default function Tiket() {
  const [selectedScheduleId, setSelectedScheduleId] = useState("");
  const [schedulesData, setSchedulesData] = useState(schedules);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const handleAddOrder = (newOrder: Order) => {
    setSchedulesData((prev) =>
      prev.map((schedule) =>
        schedule.id === selectedScheduleId
          ? { ...schedule, orders: [...schedule.orders, newOrder] }
          : schedule
      )
    );
  };

  const handleSearch = useDebouncedCallback((term: string) => {
    setDebouncedSearch(term);
  }, 500); // delay 0.5 detik

  // Input handler
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
      handleSearch(e.target.value);
    },
    [handleSearch]
  );

  // Filter berdasarkan beberapa field
  // Ambil orders berdasarkan jadwal
  const selectedSchedule = useMemo(() => {
    return schedulesData.find((s) => s.id === selectedScheduleId);
  }, [selectedScheduleId, schedulesData]);

  const selectedOrders = useMemo(() => {
    if (!selectedSchedule) return [];

    const searchLower = debouncedSearch.toLowerCase();

    return selectedSchedule.orders.filter((item) =>
      [
        item.name,
        item.address,
        item.gender,
        item.idType,
        item.idNumber,
        item.class,
        item.id,
        item.age.toString(),
      ].some((field) => field.toLowerCase().includes(searchLower))
    );
  }, [debouncedSearch, selectedSchedule]);

  return (
    <div>
      <Toaster />
      <div>
        <div className="flex justify-between p-2">
          <div className="flex gap-2">
            <Select onValueChange={setSelectedScheduleId}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih Jadwal" />
              </SelectTrigger>
              <SelectContent>
                {schedules.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.destination}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              placeholder="Cari Jadwal..."
              className="mb-4 shadow-none focus:outline-none"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          <TambahModal
            selectedSchedule={selectedSchedule}
            onAddOrder={handleAddOrder}
          />
        </div>
      </div>
      <div>
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Pesanan</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Alamat</TableHead>
              <TableHead>Umur</TableHead>
              <TableHead>Jenis Kelamin</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>No ID</TableHead>
              <TableHead>Kelas</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {selectedOrders.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="p-4">{item.id}</TableCell>
                <TableCell className="p-4">{item.name}</TableCell>
                <TableCell className="p-4">{item.address}</TableCell>
                <TableCell className="p-4">{item.age}</TableCell>
                <TableCell className="p-4">{item.gender}</TableCell>
                <TableCell className="p-4">{item.idType}</TableCell>
                <TableCell className="p-4">{item.idNumber}</TableCell>
                <TableCell className="p-4">{item.class}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
