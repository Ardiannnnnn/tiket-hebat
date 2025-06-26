// app/ui/dashboard/dataJadwal.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import ReusableTable, { ColumnDef } from "./table";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebouncedCallback } from "use-debounce";
import { getScheduleAll, deleteSchedule } from "@/service/schedule";

// ✅ Update interface sesuai response API
interface ScheduleResponse {
  id: number;
  ship: {
    id: number;
    ship_name: string;
  };
  departure_harbor: {
    id: number;
    harbor_name: string;
  };
  arrival_harbor: {
    id: number;
    harbor_name: string;
  };
  departure_datetime: string;
  arrival_datetime: string;
  status: string;
  quotas: any[];
  created_at: string;
  updated_at: string;
}

// ✅ Interface untuk data yang diflat
interface FlattenedScheduleProps {
  id: number;
  departure_harbor: string;
  arrival_harbor: string;
  ship_name: string;
  departure_datetime: string;
  arrival_datetime: string;
  status: string;
  quotas_count: number;
}

const formatDatetime = (datetime: string): string => {
  const date = new Date(datetime);

  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Jakarta",
  };

  const formatter = new Intl.DateTimeFormat("id-ID", options);
  const parts = formatter.formatToParts(date);

  const day = parts.find(p => p.type === "day")?.value;
  const month = parts.find(p => p.type === "month")?.value;
  const year = parts.find(p => p.type === "year")?.value;
  const hour = parts.find(p => p.type === "hour")?.value;
  const minute = parts.find(p => p.type === "minute")?.value;

  return `${day} ${month} ${year}, ${hour}:${minute}`;
};

// ✅ Update fungsi flattenData sesuai struktur baru
const flattenData = (data: ScheduleResponse[]): FlattenedScheduleProps[] => {
  return data.map((item) => ({
    id: item.id,
    departure_harbor: item.departure_harbor.harbor_name,
    arrival_harbor: item.arrival_harbor.harbor_name,
    ship_name: item.ship.ship_name,
    departure_datetime: formatDatetime(item.departure_datetime),
    arrival_datetime: formatDatetime(item.arrival_datetime),
    status: item.status,
    quotas_count: item.quotas?.length || 0,
  }));
};

// ✅ Fungsi untuk format status
const getStatusBadge = (status: string) => {
  const statusConfig = {
    SCHEDULED: { label: "Terjadwal", color: "bg-blue-100 text-blue-800" },
    FINISHED: { label: "Selesai", color: "bg-green-100 text-green-800" },
    CANCELLED: { label: "Dibatalkan", color: "bg-red-100 text-red-800" },
  };
  
  const config = statusConfig[status as keyof typeof statusConfig] || 
    { label: status, color: "bg-gray-100 text-gray-800" };
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
};

export default function DataJadwal() {
  const [allData, setAllData] = useState<FlattenedScheduleProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredData, setFilteredData] = useState<FlattenedScheduleProps[]>([]);
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

  // ✅ Update columns definition
  const columns: ColumnDef<FlattenedScheduleProps>[] = [
  { key: "id", label: "ID" },
  { key: "ship_name", label: "Kapal" },
  { key: "departure_harbor", label: "Pelabuhan Asal" },
  { key: "arrival_harbor", label: "Pelabuhan Tujuan" },
  { key: "departure_datetime", label: "Keberangkatan" },
  { key: "arrival_datetime", label: "Tiba" },
  { 
    key: "status", 
    label: "Status",
    // ✅ Fix: Handle both string and number types
    render: (value: string | number, item: FlattenedScheduleProps) => {
      const statusValue = String(value); // Convert to string
      return getStatusBadge(statusValue);
    }
  },
  { key: "quotas_count", label: "Kuota" },
];

  console.log("📊 Schedule data:", filteredData);

  const fetchData = useCallback(
    async (page: number) => {
      setIsLoading(true);
      try {
        console.log(`🔄 Fetching schedules page ${page}...`);
        const response = await getScheduleAll(page, pageSize);
        
        console.log("📊 API Response:", response);
        
        if (response && response.status) {
          const flattened = flattenData(response.data);
          console.log("📋 Flattened data:", flattened);
          
          setAllData(flattened);
          setMeta(response.meta ?? null);
          setFilteredData(flattened);
          
          toast.success(`${flattened.length} jadwal dimuat`);
        } else {
          console.error("❌ Invalid response:", response);
          toast.error("Gagal memuat data jadwal");
        }
      } catch (error) {
        console.error("❌ Error fetching schedules:", error);
        toast.error("Terjadi kesalahan saat memuat data jadwal");
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
            item.departure_harbor, 
            item.arrival_harbor, 
            item.ship_name,
            item.status
          ].some((field) =>
            field.toLowerCase().includes(search)
          )
        )
      );
    }
  }, [searchTerm, allData]);

  // ✅ Update handleDelete untuk menggunakan deleteSchedule
  const handleDelete = async (item: FlattenedScheduleProps) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus jadwal ${item.ship_name}?`)) {
      return;
    }

    try {
      const success = await deleteSchedule(item.id);
      if (success) {
        toast.success("Jadwal berhasil dihapus");
        // Refetch data
        fetchData(currentPage);
      } else {
        toast.error("Gagal menghapus jadwal");
      }
    } catch (error) {
      console.error("❌ Error deleting schedule:", error);
      toast.error("Terjadi kesalahan saat menghapus jadwal");
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

  // ✅ Update handleEdit untuk redirect ke edit jadwal
  const handleEdit = (item: FlattenedScheduleProps) => {
    window.location.href = `/uploadJadwal/edit/${item.id}`;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-4">
      <div className="md:flex justify-between items-center mb-4 space-y-4">
        <div>
          <h1 className="text-xl font-bold text-center md:text-start">
            Data Jadwal Kapal
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Kelola jadwal keberangkatan dan kedatangan kapal
          </p>
        </div>
        
        <div className="flex gap-4 items-center">
          <Link href="/uploadJadwal/create">
            <Button className="bg-Blue hover:bg-teal-600">
              + Tambah Jadwal
            </Button>
          </Link>

          <Input
            placeholder="Cari kapal, pelabuhan, atau status..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-64"
          />
        </div>
      </div>

      {/* ✅ Summary card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-600">Total Jadwal</h3>
          <p className="text-2xl font-bold text-gray-900">{meta?.total || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-600">Terjadwal</h3>
          <p className="text-2xl font-bold text-blue-600">
            {allData.filter(item => item.status === 'SCHEDULED').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-600">Selesai</h3>
          <p className="text-2xl font-bold text-green-600">
            {allData.filter(item => item.status === 'FINISHED').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-600">Dibatalkan</h3>
          <p className="text-2xl font-bold text-red-600">
            {allData.filter(item => item.status === 'CANCELLED').length}
          </p>
        </div>
      </div>

      <ReusableTable<FlattenedScheduleProps>
        caption="Data Jadwal Kapal"
        columns={columns}
        data={filteredData}
        isLoading={isLoading}
        meta={meta ?? undefined}
        showActions
        onEdit={handleEdit}
        onDelete={handleDelete}
        skeletonRows={pageSize}
        editUrl={(item) => `/uploadJadwal/edit/${item.id}`}
        onPageChange={handlePageChange}
      />
    </div>
  );
}