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
  });

  return <span className={statusClass}>{value}</span>;
}

export default function KapalPage() {
  const [kapalData, setKapalData] = useState<Ship[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedShip, setSelectedShip] = useState<Ship | null>(null);
  const [pageSize] = useState(10); // 10 items per page
  const [isloading, setIsLoading] = useState(true);

  const columns: ColumnDef<Ship>[] = [
    { key: "id", label: "ID" },
    { key: "ship_name", label: "Nama Kapal" },
    {
      key: "status",
      label: "Status",
      render: (value: string) => <StatusBadge value={value} />, // Render StatusBadge hanya di KapalPage
    },
    { key: "ship_type", label: "Jenis" },
    { key: "year_operation", label: "Tahun" },
    {
      key: "image_link",
      label: "Gambar",
    },
    { key: "Description", label: "Deskripsi" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const response = await getShips();
      if (response && response.status) {
        setKapalData(response.data || []);
      } else {
        toast.error("Gagal memuat data");
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);

const handleDelete = async (item: Ship) => {
    // The actual delete function that will be called after confirmation
    const success = await deleteShip(item.id);
    if (success) {
      toast.success("Kapal berhasil dihapus");
      // Update the local state to remove the deleted item
      setKapalData(kapalData.filter((ship) => ship.id !== item.id));
    } else {
      toast.error("Gagal menghapus kapal");
    }
  };

    const handleEdit = (item: Ship) => {
      console.log("Edit action triggered for:", item);
      // Navigate to the edit page dynamically
      window.location.href = `/kapal/edit/${item.id}`;
    };
  

  const filteredData = useMemo(() => {
    const search = searchTerm.toLowerCase();
    return kapalData.filter((item) =>
      [
        item.ship_name ?? "",
        item.status ?? "",
        item.ship_type ?? "",
        String(item.year_operation ?? ""),
        item.image_link ?? "", // pastikan year jadi string
        item.Description ?? "",
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
        skeletonRows={pageSize}
        isLoading={isloading}
        editUrl={(item) => `/kapal/edit/${item.id}`}
      />
    </div>
  );
}
