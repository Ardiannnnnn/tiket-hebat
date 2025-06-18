"use client";

import { useCallback, useEffect, useState } from "react";
import ReusableTable, { ColumnDef } from "./table";
import { HargaProps } from "@/types/harga";
import { toast } from "sonner";
import { deleteHarga, getharga } from "@/service/harga";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebouncedCallback } from "use-debounce";

interface FlattenedHargaProps {
  id: number;
  route_name: string;
  class_name: string;
  ship_name: string;
  ticket_price: number;
}

const flattenData = (data: HargaProps[]): FlattenedHargaProps[] => {
  return data.map((item) => ({
    id: item.id,
    route_name: `${item.route.departure_harbor.harbor_name} - ${item.route.arrival_harbor.harbor_name}`,
    class_name: item.manifest.class.class_name,
    ship_name: item.manifest.ship.ship_name,
    ticket_price: item.ticket_price,
  }));
};

export default function kelas() {
  const [allData, setAllData] = useState<FlattenedHargaProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredData, setFilteredData] = useState<FlattenedHargaProps[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [meta, setMeta] = useState<{
    total: number;
    per_page: number;
    current_page: number;
    total_pages: number;
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const columns: ColumnDef<FlattenedHargaProps>[] = [
    { key: "id", label: "ID" },
    { key: "route_name", label: "Rute" },
    { key: "class_name", label: "Kelas" },
    { key: "ship_name", label: "Kapal" },
    {
      key: "ticket_price",
      label: "Harga",
      render: (value) => `Rp ${(value as number).toLocaleString("id-ID")}`,
    },
  ];

  console.log("data:", filteredData);

  const fetchData = useCallback(
    async (page: number) => {
      setIsLoading(true);
      try {
        const response = await getharga(page, pageSize);
        if (response && response.status) {
          const flattened = flattenData(response.data);
          setAllData(flattened);
          setMeta(response.meta ?? null);
          setFilteredData(flattened);
        } else {
          toast.error("Gagal memuat data");
        }
      } catch (error) {
        toast.error("Terjadi kesalahan saat memuat data");
      }
      setIsLoading(false);
    },
    [pageSize]
  );

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
          [item.route_name, item.class_name, item.ship_name].some((field) =>
            field.toLowerCase().includes(search)
          )
        )
      );
    }
  }, [searchTerm, allData]);

  const handleDelete = async (item: FlattenedHargaProps) => {
    const success = await deleteHarga(item.id);
    if (success) {
      toast.success("Kapal berhasil dihapus");
      // refetch data supaya data terbaru sesuai API
      fetchData(currentPage);
    } else {
      toast.error("Gagal menghapus kapal");
    }
  };

  const handleSearch = useDebouncedCallback((term: string) => {
    setDebouncedSearch(term);
  }, 300);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
      handleSearch(e.target.value);
    },
    [handleSearch]
  );

  const handleEdit = (item: FlattenedHargaProps) => {
    window.location.href = `/kapal/edit/${item.id}`;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-4">
      <div className="md:flex justify-between items-center mb-4 space-y-4">
        <h1 className="text-xl font-bold text-center md:text-start">
          Data Pelabuhan
        </h1>
        <div className="flex gap-4 items-center">
          <Link href="/hargaTiket/create">
            <Button className="bg-Blue hover:bg-teal-600">Tambah</Button>
          </Link>

          <Input
            placeholder="Cari pelabuhan..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-64"
          />
        </div>
      </div>
      <ReusableTable<FlattenedHargaProps>
        caption="Data Kelas"
        columns={columns}
        data={filteredData}
        isLoading={isLoading}
        meta={meta ?? undefined}
        showActions
        onEdit={handleEdit}
        onDelete={handleDelete}
        skeletonRows={pageSize}
        editUrl={(item) => `/kapal/edit/${item.id}`}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
