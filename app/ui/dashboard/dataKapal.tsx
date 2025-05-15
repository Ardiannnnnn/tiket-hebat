"use client";

import { useState, useEffect, useMemo } from "react";
import { getShips, deleteShip } from "@/service/shipService";
import { Ship } from "@/types/ship";
import ReusableTable, { ColumnDef } from "./table";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import clsx from "clsx";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
// Komponen StatusBadge untuk KapalPage
function StatusBadge({ value }: { value: string }) {
  const statusClass = clsx("text-white text-xs px-2 py-1 rounded-md w-fit", {
    "bg-green-500": value === "Beroperasi",
    "bg-orange-500": value === "Dock",
    "bg-red-500": value === "Maintenance",
    "bg-gray-500": !["Beroperasi", "Dock", "Maintenance"].includes(value),
  });

  return <span className={statusClass}>{value}</span>;
}

export default function KapalPage() {
  const [kapalData, setKapalData] = useState<Ship[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedShip, setSelectedShip] = useState<Ship | null>(null);

  const columns: ColumnDef<Ship>[] = [
    { key: "id", label: "ID" },
    { key: "name", label: "Nama Kapal" },
    {
      key: "status",
      label: "Status",
      render: (value: string) => <StatusBadge value={value} />, // Render StatusBadge hanya di KapalPage
    },
    { key: "ship_type", label: "Jenis" },
    { key: "year", label: "Tahun" },
    { key: "Description", label: "Deskripsi" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const response = await getShips();
      if (response && response.status) {
        setKapalData(response.data || []);
      } else {
        toast.error("Gagal memuat data");
      }
    };

    fetchData();
  }, []);

  const handleDelete = (ship: Ship) => {
    setSelectedShip(ship);
    setIsDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedShip) {
      const success = await deleteShip(selectedShip.id);
      if (success) {
        toast.success("Kapal berhasil dihapus");
        // Replace 'ships' with 'kapalData' and define the type of 'ship'
        setKapalData(
          kapalData.filter((ship: Ship) => ship.id !== selectedShip.id)
        );
      } else {
        toast.error("Gagal menghapus kapal");
      }
      setIsDialogOpen(false); // Close dialog after action
    }
  };
  const handleEdit = (item: Ship) => {
    router.push(`/kapal/edit/${item.id}`);
  };

  const filteredData = useMemo(() => {
    const search = searchTerm.toLowerCase();
    return kapalData.filter((item) =>
      [
        item.name,
        item.status,
        item.ship_type,
        item.year,
        item.Description,
      ].some((field) => field.toLowerCase().includes(search))
    );
  }, [searchTerm, kapalData]);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Data Kapal</h1>
        <div className="flex gap-4 items-center">
          <Link href="/kapal/create">
            <Button className="bg-Blue hover:bg-teal-600">Tambah</Button>
          </Link>

          <Input
            placeholder="Cari kapal..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
        </div>
      </div>

      <ReusableTable
        caption="Daftar Kapal"
        columns={columns}
        data={filteredData}
        showActions
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi</DialogTitle>
          </DialogHeader>
          <p>Apakah Anda yakin ingin menghapus kapal ini?</p>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={confirmDelete}>Ya, Hapus</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
