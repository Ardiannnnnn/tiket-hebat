// app/ui/dashboard/kelas.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import ReusableTable, { ColumnDef } from "./table";
import { deleteKelas, getKelas } from "@/service/kelas";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebouncedCallback } from "use-debounce";

// ✅ Update interface sesuai response API
interface KelasResponse {
  id: number;
  class_name: string;
  class_alias: string;
  type: string; // "Passenger" or "Vehicle"
  created_at: string;
  updated_at: string;
}

// ✅ Interface untuk data yang akan ditampilkan
interface KelasProps {
  id: number;
  class_name: string;
  class_alias: string;
  type: string;
  created_at: string;
  updated_at: string;
}

// ✅ Meta interface
interface Meta {
  total: number;
  per_page: number;
  current_page: number;
  total_pages: number;
}

// ✅ Format date function
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  };
  return new Intl.DateTimeFormat("id-ID", options).format(date);
};

// ✅ Get type badge function
const getTypeBadge = (type: string) => {
  const typeConfig = {
    Passenger: { label: "Penumpang", color: "bg-blue-100 text-blue-800" },
    Vehicle: { label: "Kendaraan", color: "bg-green-100 text-green-800" },
    passenger: { label: "Penumpang", color: "bg-blue-100 text-blue-800" },
    vehicle: { label: "Kendaraan", color: "bg-green-100 text-green-800" },
  };
  
  const config = typeConfig[type as keyof typeof typeConfig] || 
    { label: type, color: "bg-gray-100 text-gray-800" };
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
};

export default function KelasPage() {
  const [allData, setAllData] = useState<KelasProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredData, setFilteredData] = useState<KelasProps[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [meta, setMeta] = useState<Meta | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // ✅ Update columns definition
  const columns: ColumnDef<KelasProps>[] = [
    { key: "id", label: "ID" },
    { key: "class_name", label: "Nama Kelas" },
    { key: "class_alias", label: "Alias Kelas" },
    { 
      key: "type", 
      label: "Tipe",
      render: (value: string | number, item: KelasProps) => {
        return getTypeBadge(String(value));
      }
    },
    { 
      key: "created_at", 
      label: "Dibuat",
      render: (value: string | number, item: KelasProps) => {
        return formatDate(String(value));
      }
    },
  ];

  console.log("📊 Kelas data:", filteredData);

  const fetchData = useCallback(
    async (page: number) => {
      setIsLoading(true);
      try {
        console.log(`🔄 Fetching kelas page ${page}...`);
        const response = await getKelas(page, pageSize);
        
        console.log("📊 API Response:", response);
        
        if (response && response.status) {
          console.log("📋 Kelas data:", response.data);
          
          setAllData(response.data);
          setMeta(response.meta ?? null);
          setFilteredData(response.data);
          
          toast.success(`${response.data.length} kelas dimuat`);
        } else {
          console.error("❌ Invalid response:", response);
          toast.error("Gagal memuat data kelas");
        }
      } catch (error) {
        console.error("❌ Error fetching kelas:", error);
        toast.error("Terjadi kesalahan saat memuat data kelas");
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

  const handleDelete = async (item: KelasProps) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus kelas ${item.class_name}?`)) {
      return;
    }

    try {
      const success = await deleteKelas(item.id);
      if (success) {
        toast.success("Kelas berhasil dihapus");
        fetchData(currentPage);
      } else {
        toast.error("Gagal menghapus kelas");
      }
    } catch (error) {
      console.error("❌ Error deleting kelas:", error);
      toast.error("Terjadi kesalahan saat menghapus kelas");
    }
  };

  const handleEdit = (item: KelasProps) => {
    window.location.href = `/kelasTiket/edit/${item.id}`;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-4">
      <div className="md:flex justify-between items-center mb-4 space-y-4">
        <div>
          <h1 className="text-xl font-bold text-center md:text-start">
            Data Kelas Tiket
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Kelola kelas tiket untuk penumpang dan kendaraan
          </p>
        </div>
        
        <div className="flex gap-4 items-center">
          <Link href="/kelasTiket/create">
            <Button className="bg-Blue hover:bg-teal-600">
              + Tambah Kelas
            </Button>
          </Link>

          <Input
            placeholder="Cari nama kelas, alias, atau tipe..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-64"
          />
        </div>
      </div>

      {/* ✅ Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-600">Total Kelas</h3>
          <p className="text-2xl font-bold text-gray-900">{meta?.total || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-600">Kelas Penumpang</h3>
          <p className="text-2xl font-bold text-blue-600">
            {allData.filter(item => item.type.toLowerCase().includes('passenger')).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-600">Kelas Kendaraan</h3>
          <p className="text-2xl font-bold text-green-600">
            {allData.filter(item => item.type.toLowerCase().includes('vehicle')).length}
          </p>
        </div>
      </div>

      <ReusableTable<KelasProps>
        caption="Data Kelas Tiket"
        columns={columns}
        data={filteredData}
        isLoading={isLoading}
        meta={meta ?? undefined}
        showActions
        onEdit={handleEdit}
        onDelete={handleDelete}
        skeletonRows={pageSize}
        editUrl={(item) => `/kelasTiket/edit/${item.id}`}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
