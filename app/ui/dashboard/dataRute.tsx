"use client";

import { useCallback, useEffect, useState } from "react";
import ReusableTable, { ColumnDef } from "./table";
import { toast } from "sonner";
import { Route } from "@/types/rute";
import { deleteRute, getRute } from "@/service/rute";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebouncedCallback } from "use-debounce";

interface FlattenedRoute {
  id: number;
  
  route_asal: string;
  route_tujuan: string;
}

const flattenData = (data: Route[]): FlattenedRoute[] => {
  return data.map((item) => ({
    id: item.id,
    route_asal: `${item.departure_harbor.harbor_name}`,
    route_tujuan: `${item.arrival_harbor.harbor_name}`,
  }));
};

export default function RutePage() {
  const [allData, setAllData] = useState<FlattenedRoute[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredData, setFilteredData] = useState<FlattenedRoute[]>([]);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    setFilteredData(allData);
  }, [allData]);
  const [searchTerm, setSearchTerm] = useState("");
  const [meta, setMeta] = useState<{
    total: number;
    per_page: number;
    current_page: number;
    total_pages: number;
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const columns: ColumnDef<FlattenedRoute>[] = [
    { key: "id", label: "ID" },
    { key: "route_asal", label: "Asal" },
    { key: "route_tujuan", label: "Tujuan" },
  ];

  const fetchData = useCallback(
    async (page: number) => {
      setIsLoading(true);
      try {
        const response = await getRute(page, pageSize);
        if (response && response.status) {
          const flattened = flattenData(response.data);
          setAllData(flattened);
          setMeta(response.meta ?? null);
          setFilteredData(flattened);
        } else {
          toast.error("Gagal memuat data rute");
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

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredData(allData);
    } else {
      const search = searchTerm.toLowerCase();
      setFilteredData(
        allData.filter(
          (item) =>
            item.route_asal.toLowerCase().includes(search) ||
            item.route_tujuan.toLowerCase().includes(search)
        )
      );
    }
  }, [searchTerm, allData]);

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

  const handleDelete = async (item: FlattenedRoute) => {
    const success = await deleteRute(item.id);
    if (success) {
      toast.success("Rute berhasil dihapus");
      fetchData(currentPage);
    } else {
      toast.error("Gagal menghapus rute");
    }
  };

  const handleEdit = (item: FlattenedRoute) => {
    window.location.href = `/rute/edit/${item.id}`;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-4">
      <div className="md:flex justify-between items-center mb-4 space-y-4">
        <h1 className="text-xl font-bold text-center md:text-start">
          Data Rute
        </h1>
        <div className="flex gap-4 items-center">
          <Link href="/dataRute/create">
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

      <ReusableTable<FlattenedRoute>
        caption="Data Rute"
        columns={columns}
        data={filteredData}
        isLoading={isLoading}
        meta={meta ?? undefined}
        showActions
        onEdit={handleEdit}
        onDelete={handleDelete}
        skeletonRows={pageSize}
        editUrl={(item) => `/rute/edit/${item.id}`}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
