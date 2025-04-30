"use client";
import { useState, useMemo, useCallback } from "react";
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

const kapalData = [
  {
    id: 1,
    name: "Aceh Hebat 1",
    route: "Sinabang - Calang",
    status: "Beroperasi",
    noKapal: "AC001",
    type: "Roll-on Roll-off",
    years: "1980 - 2025",
  },
  {
    id: 2,
    name: "Teluk Singkil",
    route: "Sinabang - Meulaboh",
    status: "Dock",
    noKapal: "AC002",
    type: "Roll-on Roll-off",
    years: "1980 - 2024",
  },
  {
    id: 3,
    name: "Aceh Hebat 3",
    route: "Singkil - Gunung Sitoli",
    status: "Beroperasi",
    noKapal: "AC003",
    type: "Roll-on Roll-off",
    years: "1995 - 2030",
  },
  {
    id: 4,
    name: "Teluk Sinabang",
    route: "Calang - Meulaboh",
    status: "Dock",
    noKapal: "AC004",
    type: "Roll-on Roll-off",
    years: "1990 - 2028",
  },
];

export default function KapalPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    route: "",
    status: "",
    noKapal: "",
    type: "",
    years: "",
  });
  const fields: DynamicField[] =[
    { name: "name", label: "Nama Kapal" },
    { name: "route", label: "Rute" },
    { name: "status", label: "Status" },
    { name: "noKapal", label: "No Kapal" },
    { name: "type", label: "Jenis" },
    { name: "years", label: "Tahun Operasi" },
  ];

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
      route: "",
      status: "",
      noKapal: "",
      type: "",
      years: "",
    });
  };

  const onAdd = () => {
    if (!formData.name || !formData.route || !formData.status) return;
    kapalData.push({
      id: kapalData.length + 1,
      ...formData,
    });
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
        item.route,
        item.status,
        item.noKapal,
        item.type,
        item.years,
      ].some((field) => field.toLowerCase().includes(search))
    );
  }, [debouncedSearch]);

  // 


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
            <TableHead>Rute</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>No Kapal</TableHead>
            <TableHead>Jenis</TableHead>
            <TableHead>Tahun Operasi</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.route}</TableCell>
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
              <TableCell>{item.noKapal}</TableCell>
              <TableCell>{item.type}</TableCell>
              <TableCell>{item.years}</TableCell>
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
