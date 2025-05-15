"use client";
import { useState, useMemo, useCallback, useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "@/components/ui/input";
import TambahModal, { DynamicField } from "./tambah";
import { deleteharbor, getHarbors } from "@/service/harborService";
import { Harbor } from "@/types/harbor";
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
  const [harborData, setHarborData] = useState<Harbor[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Loading state
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10); // 10 items per page
  
  const [formData, setFormData] = useState({
    name: "",
    status: "",
    kapal: "",
    years: "",
  });
  const [fields] = useState<DynamicField[]>([
    { name: "name", label: "Nama Pelabuhan" },
    { name: "status", label: "Status" },
    { name: "kapal", label: "Kapal" },
    { name: "years", label: "Periode" },
  ]);

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

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await getHarbors();
        if (response && response.status) {
          setHarborData(response.data || []);
        } else {
          toast.error("Gagal memuat data");
        }
      } catch (error) {
        toast.error("Terjadi kesalahan saat memuat data");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Reset to first page when search changes
    setCurrentPage(1);
  }, [debouncedSearch]);

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const onReset = useCallback(() => {
    setFormData({
      name: "",
      status: "",
      kapal: "",
      years: "",
    });
  }, []);

  const onAdd = useCallback(async (): Promise<{
    success: boolean;
    message: string;
  }> => {
    try {
      // Simulate an API call or add your actual API logic here
      console.log("Data added:", formData);

      // Reset the form after adding
      onReset();

      // Return success response
      return { success: true, message: "Data berhasil ditambahkan!" };
    } catch (error) {
      console.error("Error adding data:", error);

      // Return failure response
      return { success: false, message: "Gagal menambahkan data." };
    }
  }, [formData, onReset]);
  
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

  // Filter data based on search term
  const filteredData = useMemo(() => {
    const search = debouncedSearch.toLowerCase();
    return harborData.filter((item) =>
      [item.harbor_name, item.status, item.year_operation].some((field) =>
        String(field).toLowerCase().includes(search)
      )
    );
  }, [debouncedSearch, harborData]);

  // Get total items count for pagination
  const totalItems = filteredData.length;

  // Get current page data
  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize]);

  // Page change handler
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleEdit = (item: Harbor) => {
    console.log("Edit action triggered for:", item);
    // Navigate to the edit page dynamically
    window.location.href = `/pelabuhan/edit/${item.id}`;
  };

  const handleDelete = async (item: Harbor) => {
    // The actual delete function that will be called after confirmation
    const success = await deleteharbor(item.id);
    if (success) {
      toast.success("Pelabuhan berhasil dihapus");
      // Update the local state to remove the deleted item
      setHarborData(harborData.filter((harbor) => harbor.id !== item.id));
    } else {
      toast.error("Gagal menghapus pelabuhan");
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Data Pelabuhan</h1>
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
        data={currentData} // Now using paginated data
        showActions
        onEdit={handleEdit}
        onDelete={handleDelete}
        editUrl={(item) => `/pelabuhan/edit/${item.id}`} // Dynamic edit URL
        displayNameField="harbor_name" // Specify which field to use for display name
        isLoading={isLoading} // Pass loading state
        skeletonRows={pageSize} // Show skeleton rows equal to page size
        // Pagination props
        pageSize={pageSize}
        currentPage={currentPage}
        totalItems={totalItems}
        onPageChange={handlePageChange}
      />
    </div>
  );
}