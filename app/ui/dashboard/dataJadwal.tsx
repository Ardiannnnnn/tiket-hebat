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
import { Schedule } from "@/types/invoice";
import { getScheduleAll } from "@/service/schedule";

interface FlattenedHargaProps {
  id: number;
  departure_harbor: string;
  arrival_harbor: string;
  ship_name: string;
  departure_datetime: string;
  arrival_datetime: string;
}

const formatDatetime = (datetime: string): string => {
  const date = new Date(datetime);

  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "long", // 'Oktober'
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

  return `${day}-${month}-${year}, ${hour}.${minute}`;
};


const flattenData = (data: Schedule[]): FlattenedHargaProps[] => {
  return data.map((item) => ({
    id: item.id,
    departure_harbor: item.route.departure_harbor.harbor_name,
    arrival_harbor: item.route.arrival_harbor.harbor_name,
    ship_name: item.ship.ship_name,
    departure_datetime:formatDatetime(item.departure_datetime),
    arrival_datetime: formatDatetime( item.arrival_datetime),
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
    { key: "departure_harbor", label: "Pelabuhan Asal" },
    { key: "arrival_harbor", label: "Pelabuhan Tujuan" },
    { key: "ship_name", label: "Kapal" },
    { key: "departure_datetime", label: "Waktu Keberangkatan" },
    { key: "arrival_datetime", label: "Waktu Tiba" },
  ];

  console.log("data:", filteredData);

  const fetchData = useCallback(
    async (page: number) => {
      setIsLoading(true);
      try {
        const response = await getScheduleAll(page, pageSize);
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
          [item.departure_harbor, item.arrival_harbor, item.ship_name].some((field) =>
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
          Data Jadwal
        </h1>
        <div className="flex gap-4 items-center">
          <Link href="/uploadJadwal/create">
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
