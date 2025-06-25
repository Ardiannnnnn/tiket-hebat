// app/ui/dashboard/dataPelabuhan.tsx
"use client";
import { useState, useMemo } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "@/components/ui/input";
import { deleteharbor } from "@/service/harborService";
import { Harbor } from "@/types/harbor";
import { toast } from "sonner";
import clsx from "clsx";
import ReusableTable, { ColumnDef } from "./table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useHarbors } from "@/app/hooks/useHarbor"; // ✅ Import hook

// ✅ Loading skeleton component
function TableSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          {/* Header skeleton */}
          <div className="flex justify-between items-center">
            <div className="h-8 bg-gray-200 rounded w-48"></div>
            <div className="flex gap-4">
              <div className="h-10 bg-gray-200 rounded w-32"></div>
              <div className="h-10 bg-gray-200 rounded w-64"></div>
            </div>
          </div>
          
          {/* Table skeleton */}
          <div className="space-y-3">
            {/* Table header */}
            <div className="grid grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-8 bg-gray-200 rounded"></div>
              ))}
            </div>
            
            {/* Table rows */}
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="grid grid-cols-6 gap-4">
                {Array.from({ length: 6 }).map((_, j) => (
                  <div key={j} className="h-12 bg-gray-100 rounded"></div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ value }: { value: string }) {
  const statusClass = clsx("text-white text-xs px-2 py-1 rounded-md w-fit", {
    "bg-green-500": value === "active",
    "bg-red-500": value === "Tidak Beroperasi",
  });
  return <span className={statusClass}>{value}</span>;
}

export default function DataPelabuhanPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // ✅ Use React Query hook
  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch
  } = useHarbors(currentPage, pageSize);

  const columns: ColumnDef<Harbor>[] = [
    { key: "id", label: "ID" },
    { key: "harbor_name", label: "Nama Pelabuhan" },
    {
      key: "status",
      label: "Status",
      render: (value) => <StatusBadge value={value as string} />,
    },
    { key: "year_operation", label: "Tahun" },
  ];

  // ✅ Extract data safely
  const allData = response?.data || [];
  const meta = response?.meta;

  // ✅ Local filtering (for search)
  const filteredData = useMemo(() => {
    if (!debouncedSearch.trim()) {
      return allData;
    }
    return allData.filter((item) =>
      item.harbor_name.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [debouncedSearch, allData]);

  // ✅ Debounced search
  const handleSearch = useDebouncedCallback((term: string) => {
    setDebouncedSearch(term);
  }, 300);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    handleSearch(e.target.value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEdit = (item: Harbor) => {
    window.location.href = `/pelabuhan/edit/${item.id}`;
  };

  const handleDelete = async (item: Harbor) => {
    try {
      const success = await deleteharbor(item.id);
      if (success) {
        toast.success("Pelabuhan berhasil dihapus");
        refetch(); // ✅ Refetch with React Query
      } else {
        toast.error("Gagal menghapus pelabuhan");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat menghapus data");
    }
  };

  // ✅ Show skeleton while loading
  if (isLoading) {
    return <TableSkeleton />;
  }

  // ✅ Show error state
  if (isError) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full">
        <div className="p-6">
          <div className="text-center py-12">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-xl">⚠️</span>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Error Loading Data</h3>
            <p className="text-gray-600 mb-4">
              {error?.message || 'Terjadi kesalahan saat memuat data'}
            </p>
            <Button variant="outline" onClick={() => refetch()}>
              Coba Lagi
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Data Pelabuhan</h1>
          <div className="flex gap-4 items-center">
            <Link href="/pelabuhan/create">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Tambah Pelabuhan
              </Button>
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
          data={filteredData}
          showActions
          onEdit={handleEdit}
          onDelete={handleDelete}
          editUrl={(item) => `/pelabuhan/edit/${item.id}`}
          displayNameField="harbor_name"
          isLoading={false} // Already handled above
          skeletonRows={pageSize}
          meta={meta}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}