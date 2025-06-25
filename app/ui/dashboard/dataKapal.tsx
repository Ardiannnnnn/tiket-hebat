"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { getShips, deleteShip } from "@/service/shipService";
import { Ship } from "@/types/ship";
import ReusableTable, { ColumnDef } from "./table";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import clsx from "clsx";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function StatusBadge({ value }: { value: string }) {
  const statusClass = clsx("text-white text-xs px-2 py-1 rounded-md w-fit", {
    "bg-green-500": value === "ACTIVE",
    "bg-orange-500": value === "Dock",
  });

  return <span className={statusClass}>{value}</span>;
}

export default function KapalPage() {
  const [allData, setAllData] = useState<Ship[]>([]); // data asli API
  const [filteredData, setFilteredData] = useState<Ship[]>([]); // data hasil filter pencarian
  const [meta, setMeta] = useState<{ total: number; per_page: number; current_page: number; total_pages:number } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [isloading, setIsLoading] = useState(true);

  const columns: ColumnDef<Ship>[] = [
    { key: "id", label: "ID" },
    { key: "ship_name", label: "Nama Kapal" },
    {
      key: "status",
      label: "Status",
      render: (value, item) => <StatusBadge value={String(value ?? "")}  />,
    },
    { key: "ship_type", label: "Jenis" },
    { key: "year_operation", label: "Tahun" },
    { key: "image_link", label: "Gambar" },
    { key: "description", label: "Deskripsi" },
  ];

  const fetchData = useCallback(async (page: number) => {
  setIsLoading(true);
  const response = await getShips(page, pageSize);
  if (response && response.status) {
    setAllData(response.data || []);
    setMeta(response.meta ?? null);
    setFilteredData(response.data || []);
  } else {
    toast.error("Gagal memuat data");
  }
  setIsLoading(false);
}, [pageSize]);


  useEffect(() => {
    fetchData(currentPage);
  }, [fetchData, currentPage]);

  // Reset page jika search berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Filter data lokal saat search berubah
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredData(allData);
    } else {
      const search = searchTerm.toLowerCase();
      setFilteredData(
        allData.filter((item) =>
          [
            item.ship_name ?? "",
            item.status ?? "",
            item.ship_type ?? "",
            String(item.year_operation ?? ""),
            item.image_link ?? "",
            item.description ?? "",
          ].some((field) => field.toLowerCase().includes(search))
        )
      );
    }
  }, [searchTerm, allData]);

  const handleDelete = async (item: Ship) => {
    const success = await deleteShip(item.id);
    if (success) {
      toast.success("Kapal berhasil dihapus");
      // refetch data supaya data terbaru sesuai API
      fetchData(currentPage);
    } else {
      toast.error("Gagal menghapus kapal");
    }
  };

  const handleEdit = (item: Ship) => {
    window.location.href = `/kapal/edit/${item.id}`;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

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
        caption="Daftar Kap"
        columns={columns}
        data={filteredData}
        showActions
        onEdit={handleEdit}
        onDelete={handleDelete}
        skeletonRows={pageSize}
        isLoading={isloading}
        editUrl={(item) => `/kapal/edit/${item.id}`}
        meta={meta ?? undefined}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
