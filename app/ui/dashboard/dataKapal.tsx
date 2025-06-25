"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { getShips, deleteShip } from "@/service/shipService";
import { Ship } from "@/types/ship";
import ReusableTable, { ColumnDef } from "./table";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import clsx from "clsx";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import DriveImage from "@/app/ui/driveImage"; // ✅ Import komponen gambar
import { Eye, ExternalLink } from "lucide-react";

function StatusBadge({ value }: { value: string }) {
  const statusClass = clsx("text-white text-xs px-2 py-1 rounded-md w-fit", {
    "bg-green-500": value === "ACTIVE",
    "bg-orange-500": value === "Dock",
  });

  return <span className={statusClass}>{value}</span>;
}

// ✅ Component untuk menampilkan gambar kapal
function ShipImage({ imageUrl, shipName }: { imageUrl: string; shipName: string }) {
  if (!imageUrl || imageUrl === "null" || imageUrl === "undefined") {
    return (
      <div className="w-16 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
        <span className="text-xs text-gray-500">No Image</span>
      </div>
    );
  }

  return (
    <div className="relative group">
      <DriveImage
        src={imageUrl}
        alt={`Kapal ${shipName}`}
        width={64}
        height={48}
        className="w-16 h-12 rounded-lg object-cover border border-gray-200 cursor-pointer hover:shadow-md transition-all"
      />
      
      {/* ✅ Overlay untuk preview yang lebih besar */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
        <Eye className="w-4 h-4 text-white" />
      </div>
    </div>
  );
}

// ✅ Component untuk link dengan preview
function ImageLinkCell({ imageUrl, shipName }: { imageUrl: string; shipName: string }) {
  if (!imageUrl || imageUrl === "null" || imageUrl === "undefined") {
    return <span className="text-gray-400 text-sm">Tidak ada gambar</span>;
  }

  const isGoogleDriveLink = imageUrl.includes('drive.google.com') || imageUrl.includes('docs.google.com');
  const truncatedUrl = imageUrl.length > 30 ? imageUrl.substring(0, 30) + "..." : imageUrl;

  return (
    <div className="flex items-center gap-2">
      <ShipImage imageUrl={imageUrl} shipName={shipName} />
      <div className="flex flex-col">
        <a 
          href={imageUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1"
        >
          {isGoogleDriveLink ? "Google Drive" : "Link"}
          <ExternalLink className="w-3 h-3" />
        </a>
        <span className="text-xs text-gray-500">{truncatedUrl}</span>
      </div>
    </div>
  );
}

export default function KapalPage() {
  const [allData, setAllData] = useState<Ship[]>([]);
  const [filteredData, setFilteredData] = useState<Ship[]>([]);
  const [meta, setMeta] = useState<{ total: number; per_page: number; current_page: number; total_pages: number } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [isloading, setIsLoading] = useState(true);

  // ✅ Updated columns dengan gambar
  const columns: ColumnDef<Ship>[] = [
    { key: "id", label: "ID", width: "60px" },
    { 
      key: "ship_name", 
      label: "Nama Kapal", 
      maxLength: 20, 
      showTooltip: true,
      width: "150px" 
    },
    {
      key: "ship_alias",
      label: "Alias Kapal",
      
    },
    {
      key: "status",
      label: "Status",
      render: (value, item) => <StatusBadge value={String(value ?? "")} />,
      width: "100px"
    },
    { 
      key: "ship_type", 
      label: "Jenis", 
      maxLength: 15, 
      showTooltip: true,
      width: "120px" 
    },
    { 
      key: "year_operation", 
      label: "Tahun",
      width: "80px" 
    },
    {
      key: "image_link",
      label: "Gambar",
      render: (value, item) => (
        <ImageLinkCell 
          imageUrl={String(value ?? "")} 
          shipName={item.ship_name ?? "Unknown"} 
        />
      ),
      width: "200px",
      className: "text-center"
    },
    { 
      key: "description", 
      label: "Deskripsi", 
      maxLength: 30, 
      showTooltip: true,
      width: "180px" 
    },
  ];

  const fetchData = useCallback(async (page: number) => {
    setIsLoading(true);
    try {
      const response = await getShips(page, pageSize);
      if (response && response.status) {
        setAllData(response.data || []);
        setMeta(response.meta ?? null);
        setFilteredData(response.data || []);
      } else {
        toast.error("Gagal memuat data");
      }
    } catch (error) {
      console.error("Error fetching ships:", error);
      toast.error("Terjadi kesalahan saat memuat data");
    } finally {
      setIsLoading(false);
    }
  }, [pageSize]);

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
            item.ship_name ?? "",
            item.status ?? "",
            item.ship_type ?? "",
            String(item.year_operation ?? ""),
            item.description ?? "",
          ].some((field) => field.toLowerCase().includes(search))
        )
      );
    }
  }, [searchTerm, allData]);

  const handleDelete = async (item: Ship) => {
    try {
      const success = await deleteShip(item.id);
      if (success) {
        toast.success("Kapal berhasil dihapus");
        fetchData(currentPage);
      } else {
        toast.error("Gagal menghapus kapal");
      }
    } catch (error) {
      console.error("Error deleting ship:", error);
      toast.error("Terjadi kesalahan saat menghapus kapal");
    }
  };

  const handleEdit = (item: Ship) => {
    window.location.href = `/kapal/edit/${item.id}`;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // ✅ Export function untuk gambar
  const handleExport = () => {
    // Implementasi export sesuai kebutuhan
    toast.info("Fitur export akan segera tersedia");
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Data Kapal</h1>
        <div className="flex gap-4 items-center">
          <Link href="/kapal/create">
            <Button className="bg-Blue hover:bg-teal-600">Tambah Kapal</Button>
          </Link>

          <Input
            placeholder="Cari kapal..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
        </div>
      </div>

      <ReusableTable
        title="Daftar Kapal"
        description="Kelola data kapal ferry"
        columns={columns}
        data={filteredData}
        showActions
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRefresh={() => fetchData(currentPage)}
        onExport={handleExport}
        skeletonRows={pageSize}
        isLoading={isloading}
        editUrl={(item) => `/kapal/edit/${item.id}`}
        meta={meta ?? undefined}
        onPageChange={handlePageChange}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Cari nama kapal, jenis, atau status..."
      />
    </div>
  );
}
