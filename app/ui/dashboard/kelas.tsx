"use client";

import { useCallback, useEffect, useState } from "react";
import ReusableTable, { ColumnDef } from "./table";
import { kelasResponse, kelasProps } from "@/types/kelas";
import { deleteKelas, getKelas } from "@/service/kelas";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebouncedCallback } from "use-debounce";

export default function kelas() {
  const [allData, setAllData] = useState<kelasProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredData, setFilteredData] = useState<kelasProps[]>([]);
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

  const columns: ColumnDef<kelasProps>[] = [
    { key: "id", label: "ID" },
    { key: "class_name", label: "Nama Tiket" },
    { key: "class_alias", label: "Jenis" },
    { key: "type", label: "Tipe" },
  ];

  console.log("data:", filteredData )

  const fetchData = useCallback(
    async (page: number) => {
      setIsLoading(true);
      const response = await getKelas(page, pageSize);
      if (response && response.status) {
        setAllData(response.data);
        setMeta(response.meta ?? null);
        setFilteredData(response.data);
      } else {
        toast.error("Gagal memuat data");
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
            [
              item.class_name ?? "",
              item.class_alias ?? "",
              item.type ?? "",
            ].some((field) => field.toLowerCase().includes(search))
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
  
    const handleDelete = async (item: kelasProps) => {
      const success = await deleteKelas(item.id);
      if (success) {
        toast.success("Kapal berhasil dihapus");
        // refetch data supaya data terbaru sesuai API
        fetchData(currentPage);
      } else {
        toast.error("Gagal menghapus kapal");
      }
    };
  
    const handleEdit = (item: kelasProps) => {
      window.location.href = `/kapal/edit/${item.id}`;
    };
  
    const handlePageChange = (page: number) => {
      setCurrentPage(page);
    };

  return (

    <div className="p-4">
      <div className="md:flex justify-between items-center mb-4 space-y-4">
        <h1 className="text-xl font-bold text-center md:text-start">Data Kelas</h1>
        <div className="flex gap-4 items-center">
          <Link href="/kelasTiket/create">
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
      <ReusableTable
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
