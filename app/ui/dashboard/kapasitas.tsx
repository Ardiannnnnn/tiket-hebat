"use client";

import { useCallback, useEffect, useState } from "react";
import ReusableTable, { ColumnDef } from "./table";
import { toast } from "sonner";
import { getManifest, deleteManifest } from "@/service/kapasitas";
import { Manifest, Meta } from "@/types/kapasitas";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebouncedCallback } from "use-debounce";

interface FlattenedManifest {
  id: number;
  class_name: string;
  type: "passenger" | "vehicle";
  ship_name: string;
  capacity: number;
}

const flattenData = (data: Manifest[]): FlattenedManifest[] => {
  return data.map((item) => ({
    id: item.id,
    class_name: item.class.class_name,
    type: item.class.type,
    ship_name: item.ship.ship_name,
    capacity: item.capacity,
  }));
};

export default function ManifestPage() {
  const [allData, setAllData] = useState<FlattenedManifest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredData, setFilteredData] = useState<FlattenedManifest[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [meta, setMeta] = useState<Meta | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
   const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    setFilteredData(allData);
  }, [allData]);
  const columns: ColumnDef<FlattenedManifest>[] = [
    { key: "id", label: "ID" },
    { key: "class_name", label: "Kelas" },
    { key: "type", label: "Tipe" },
    { key: "ship_name", label: "Kapal" },
    { key: "capacity", label: "Kapasitas" },
  ];

  const fetchData = useCallback(
    async (page: number) => {
      setIsLoading(true);
      try {
        const response = await getManifest(page, pageSize);
        if (response && response.status) {
          const flattened = flattenData(response.data);
          setAllData(flattened);
          setMeta(response.meta);
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

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredData(allData);
    } else {
      const search = searchTerm.toLowerCase();
      setFilteredData(
        allData.filter((item) =>
          [item.class_name, item.type, item.ship_name].some((field) =>
            field.toLowerCase().includes(search)
          )
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

  const handleDelete = async (item: FlattenedManifest) => {
    const success = await deleteManifest(item.id);
    if (success) {
      toast.success("Kelas berhasil dihapus");
      fetchData(currentPage);
    } else {
      toast.error("Gagal menghapus kelas");
    }
  };

  const handleEdit = (item: FlattenedManifest) => {
    window.location.href = `/kapasitas/edit/${item.id}`;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-4">
      <div className="md:flex justify-between items-center mb-4 space-y-4">
        <h1 className="text-xl font-bold text-center md:text-start">
          Kapasitas Tiket
        </h1>
        <div className="flex gap-4 items-center">
          <Link href="/kapasitasTiket/create">
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
      <ReusableTable<FlattenedManifest>
        caption="Data Kapasitas"
        columns={columns}
        data={filteredData}
        isLoading={isLoading}
        meta={meta ?? undefined}
        showActions
        onEdit={handleEdit}
        onDelete={handleDelete}
        skeletonRows={pageSize}
        editUrl={(item) => `/kapasitas/edit/${item.id}`}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
