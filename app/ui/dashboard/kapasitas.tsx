// app/ui/dashboard/kapasitas.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import ReusableTable, { ColumnDef } from "./table";
import { toast } from "sonner";
import { getManifest, deleteManifest } from "@/service/kapasitas";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebouncedCallback } from "use-debounce";
import { Manifest, Meta } from "@/types/kapasitas";
// ✅ Interface untuk data yang diflat
interface FlattenedManifest {
  id: number;
  schedule_id: string;
  class_name: string;
  type: string;
  quota: number;
  price: number;
  class_id: number;
}

// ✅ Update flattenData function
// ✅ Enhanced flattenData function dengan null safety dan formatting
const flattenData = (data: Manifest[]): FlattenedManifest[] => {
  return data.map((item) => {
    // ✅ Extract schedule data dengan null safety
    const schedule = item.schedule;
    const departureHarbor = schedule?.departure_harbor || "Pelabuhan Asal";
    const arrivalHarbor = schedule?.arrival_harbor || "Pelabuhan Tujuan";
    const shipName = schedule?.ship_name || "Kapal Tidak Diketahui";
    
    // ✅ Format schedule info dengan ship name
    const scheduleInfo = `${departureHarbor} → ${arrivalHarbor}`;
    
    return {
      id: item.id,
      schedule_id: scheduleInfo, // ✅ More informative schedule display
      class_name: item.class.class_name,
      type: item.class.type,
      quota: item.quota,
      price: item.price,
      class_id: item.class.id,
    };
  });
};

// ✅ Format price function
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);
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

export default function ManifestPage() {
  const [allData, setAllData] = useState<FlattenedManifest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredData, setFilteredData] = useState<FlattenedManifest[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [meta, setMeta] = useState<Meta | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(100);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // ✅ Update columns definition
  const columns: ColumnDef<FlattenedManifest>[] = [
    { key: "id", label: "ID" },
    { key: "schedule_id", label: "ID Jadwal" },
    { key: "class_name", label: "Kelas" },
    { 
      key: "type", 
      label: "Tipe",
      render: (value: string | number, item: FlattenedManifest) => {
        return getTypeBadge(String(value));
      }
    },
    { 
      key: "quota", 
      label: "Kuota",
      render: (value: string | number, item: FlattenedManifest) => {
        const quota = typeof value === 'number' ? value : parseInt(String(value)) || 0;
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            quota > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {quota}
          </span>
        );
      }
    },
    { 
      key: "price", 
      label: "Harga",
      render: (value: string | number, item: FlattenedManifest) => {
        const price = typeof value === 'number' ? value : parseFloat(String(value)) || 0;
        return (
          <span className="font-medium text-green-600">
            {formatPrice(price)}
          </span>
        );
      }
    },
  ];

  console.log("📊 Manifest data:", filteredData);

  const fetchData = useCallback(
    async (page: number) => {
      setIsLoading(true);
      try {
        console.log(`🔄 Fetching manifest page ${page}...`);
        const response = await getManifest(page, pageSize);
        
        console.log("📊 API Response:", response);
        
        if (response && response.status) {
          const flattened = flattenData(response.data);
          console.log("📋 Flattened data:", flattened);
          
          setAllData(flattened);
          setMeta(response.meta ?? null);
          setFilteredData(flattened);
          
          toast.success(`${flattened.length} data kuota dimuat`);
        } else {
          console.error("❌ Invalid response:", response);
          toast.error("Gagal memuat data kuota");
        }
      } catch (error) {
        console.error("❌ Error fetching manifest:", error);
        toast.error("Terjadi kesalahan saat memuat data kuota");
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
          [
            item.class_name, 
            item.type,
            String(item.schedule_id),
            String(item.quota),
            String(item.price)
          ].some((field) =>
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
    if (!confirm(`Apakah Anda yakin ingin menghapus kuota ${item.class_name}?`)) {
      return;
    }

    try {
      const success = await deleteManifest(item.id);
      if (success) {
        toast.success("Kuota berhasil dihapus");
        fetchData(currentPage);
      } else {
        toast.error("Gagal menghapus kuota");
      }
    } catch (error) {
      console.error("❌ Error deleting manifest:", error);
      toast.error("Terjadi kesalahan saat menghapus kuota");
    }
  };

  const handleEdit = (item: FlattenedManifest) => {
    window.location.href = `/kapasitasTiket/edit/${item.id}`;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-4">
      <div className="md:flex justify-between items-center mb-4 space-y-4">
        <div>
          <h1 className="text-xl font-bold text-center md:text-start">
            Kapasitas & Harga Tiket
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Kelola kuota dan harga tiket untuk setiap kelas
          </p>
        </div>
        
        <div className="flex gap-4 items-center">
          <Link href="/kapasitasTiket/create">
            <Button className="bg-Blue hover:bg-teal-600">
              + Tambah Kuota
            </Button>
          </Link>

          <Input
            placeholder="Cari kelas, tipe, atau harga..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-64"
          />
        </div>
      </div>

      {/* ✅ Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-600">Total Kuota</h3>
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
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-600">Total Kapasitas</h3>
          <p className="text-2xl font-bold text-orange-600">
            {allData.reduce((sum, item) => sum + item.quota, 0)}
          </p>
        </div>
      </div>

      <ReusableTable<FlattenedManifest>
        caption="Data Kapasitas & Harga Tiket"
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