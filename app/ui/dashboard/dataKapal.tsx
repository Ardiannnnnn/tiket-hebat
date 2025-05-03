"use client";
import { useState, useMemo, useCallback, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDebouncedCallback } from "use-debounce";
import clsx from "clsx";
import TambahModal, { DynamicField } from "./tambah";
import { getShips } from "@/service/shipService";
import { Ship } from "@/types/ship";  // gunakan tipe baru Ship

export default function KapalPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [kapalData, setKapalData] = useState<Ship[]>([]); // dari API
  const [formData, setFormData] = useState({
    name: "",
    status: "",
    ship_type: "",
    year: "",
    image: "",
    Description: "",
  });

  const fields: DynamicField[] = [
    { name: "name", label: "Nama Kapal" },
    { name: "status", label: "Status" },
    { name: "ship_type", label: "Jenis" },
    { name: "year", label: "Tahun Operasi" },
    { name: "image", label: "Gambar" },
    { name: "Description", label: "Deskripsi" },
  ];

  // Fetch data dari API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getShips();
        if (response.status) {
          setKapalData(response.data);
        }
      } catch (error) {
        console.error("Gagal mengambil data kapal:", error);
      }
    };
    fetchData();
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onReset = () => {
    setFormData({
      name: "",
      status: "",
      ship_type: "",
      year: "",
      image: "",
      Description: "",
    });
  };

  const onAdd = () => {
    // Untuk sekarang hanya local push, bisa diubah menjadi POST ke API
    if (!formData.name || !formData.status) return;
    setKapalData((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        ...formData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);
    onReset();
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

  const filteredData = useMemo(() => {
    const search = debouncedSearch.toLowerCase();
    return kapalData.filter((item) =>
      [
        item.name,
        item.status,
        item.ship_type,
        item.year,
        item.Description,
      ].some((field) => field?.toLowerCase().includes(search))
    );
  }, [debouncedSearch, kapalData]);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Data Kapal</h1>
        <div className="flex gap-4 items-center">
          <TambahModal
            fields={fields}
            formData={formData}
            onChange={onChange}
            onReset={onReset}
            onAdd={onAdd}
            judul="Kapal"
          />
          <Input
            placeholder="Cari kapal..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-64"
          />
        </div>
      </div>

      <Table>
        <TableCaption>Daftar Kapal</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Nama Kapal</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Jenis</TableHead>
            <TableHead>Tahun</TableHead>
            <TableHead>Deskripsi</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>
                <span
                  className={clsx(
                    "px-2 py-1 rounded text-white text-xs font-semibold",
                    {
                      "bg-green-500": item.status === "Beroperasi",
                      "bg-orange-500": item.status === "Dock",
                    }
                  )}
                >
                  {item.status}
                </span>
              </TableCell>
              <TableCell>{item.ship_type}</TableCell>
              <TableCell>{item.year}</TableCell>
              <TableCell>{item.Description}</TableCell>
              <TableCell>
                <Button className="bg-yellow-300 text-black hover:bg-yellow-400 mr-2">
                  Edit
                </Button>
                <Button className="bg-orange-500 text-white hover:bg-orange-600">
                  Hapus
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
