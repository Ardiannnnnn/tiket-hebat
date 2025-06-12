"use client";
import { useState, useEffect, useCallback } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "@/components/ui/input";
import { deleteharbor, getHarbors } from "@/service/harborService";
import { Harbor, HarborResponse } from "@/types/harbor";
import { toast } from "sonner";
import clsx from "clsx";
import ReusableTable, { ColumnDef } from "./table";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function StatusBadge({ value }: { value: string }) {
  const statusClass = clsx("text-white text-xs px-2 py-1 rounded-md w-fit", {
    "bg-green-500": value === "Beroperasi",
    "bg-red-500": value === "Tidak Beroperasi",
  });
  return <span className={statusClass}>{value}</span>;
}

export default function DataPelabuhanPage() {
  const [allData, setAllData] = useState<Harbor[]>([]); // Data asli dari API
  const [filteredData, setFilteredData] = useState<Harbor[]>([]); // Data hasil filter
  const [meta, setMeta] = useState<HarborResponse["meta"] | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = meta?.per_page ?? 10;

  const columns: ColumnDef<Harbor>[] = [
    { key: "id", label: "ID" },
    { key: "harbor_name", label: "Nama Pelabuhan" },
    {
      key: "status",
      label: "Status",
      render: (value: string | number) => <StatusBadge value={String(value)} />,
    },
    { key: "year_operation", label: "Tahun" },
  ];

  // Fetch data tanpa search, hanya page dan limit
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getHarbors(currentPage, pageSize);
      if (response && response.status) {
        setAllData(response.data || []);
        setMeta(response.meta);
        setFilteredData(response.data || []); // set juga filteredData awalnya sama
      } else {
        toast.error("Gagal memuat data");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat memuat data");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reset page saat search berubah supaya selalu di halaman 1
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  // Filter data secara lokal saat search berubah
  useEffect(() => {
    if (debouncedSearch.trim() === "") {
      setFilteredData(allData);
    } else {
      const filtered = allData.filter((item) =>
        item.harbor_name.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [debouncedSearch, allData]);

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

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleEdit = (item: Harbor) => {
    window.location.href = `/pelabuhan/edit/${item.id}`;
  };

  const handleDelete = async (item: Harbor) => {
    const success = await deleteharbor(item.id);
    if (success) {
      toast.success("Pelabuhan berhasil dihapus");
      fetchData();
    } else {
      toast.error("Gagal menghapus pelabuhan");
    }
  };

  return (
    <div className="p-4">
      <div className="md:flex justify-between items-center mb-4 space-y-4">
        <h1 className="text-xl font-bold text-center md:text-start">Data Pelabuhan</h1>
        <div className="flex gap-4 items-center">
          <Link href="/pelabuhan/create">
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
        caption="Daftar Pelabuhan"
        columns={columns}
        data={filteredData} // pakai data yang sudah difilter
        showActions
        onEdit={handleEdit}
        onDelete={handleDelete}
        editUrl={(item) => `/pelabuhan/edit/${item.id}`}
        displayNameField="harbor_name"
        isLoading={isLoading}
        skeletonRows={pageSize}
        meta={meta ?? undefined}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
