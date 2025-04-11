"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCallback, useMemo, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

const data = [
  {
    id: 1,
    name: "Joko",
    address: "Simeulue",
    age: 30,
    Jk: "Laki-laki",
    Role: "Petugas Loket",
    Harbor: "Pelabuhan Singkil",
  },
  {
    id: 2,
    name: "Siti",
    address: "Singkil",
    age: 28,
    Jk: "Perempuan",
    Role: "Petugas Keamanan",
    Harbor: "Pelabuhan Singkil",
  },
  {
    id: 3,
    name: "Rahmat",
    address: "Pulau Banyak",
    age: 35,
    Jk: "Laki-laki",
    Role: "Petugas Loket",
    Harbor: "Pelabuhan Pulau Banyak",
  },
  {
    id: 4,
    name: "Dina",
    address: "Meulaboh",
    age: 27,
    Jk: "Perempuan",
    Role: "Petugas Kebersihan",
    Harbor: "Pelabuhan Meulaboh",
  },
  {
    id: 5,
    name: "Andi",
    address: "Calang",
    age: 32,
    Jk: "Laki-laki",
    Role: "Petugas Loket",
    Harbor: "Pelabuhan Calang",
  },
  {
    id: 6,
    name: "Rina",
    address: "Simeulue",
    age: 26,
    Jk: "Perempuan",
    Role: "Petugas Loket",
    Harbor: "Pelabuhan Simeulue",
  },
  {
    id: 7,
    name: "Bayu",
    address: "Singkil",
    age: 31,
    Jk: "Laki-laki",
    Role: "Petugas Bongkar Muat",
    Harbor: "Pelabuhan Singkil",
  },
  {
    id: 8,
    name: "Citra",
    address: "Pulau Banyak",
    age: 29,
    Jk: "Perempuan",
    Role: "Petugas Keamanan",
    Harbor: "Pelabuhan Pulau Banyak",
  },
  {
    id: 9,
    name: "Fajar",
    address: "Meulaboh",
    age: 33,
    Jk: "Laki-laki",
    Role: "Petugas Bongkar Muat",
    Harbor: "Pelabuhan Meulaboh",
  },
  {
    id: 10,
    name: "Yuni",
    address: "Calang",
    age: 25,
    Jk: "Perempuan",
    Role: "Petugas Kebersihan",
    Harbor: "Pelabuhan Calang",
  },
];

export default function PenggunaDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const handleSearch = useDebouncedCallback((term: string) => {
    setDebouncedSearch(term);
  }, 500);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
      handleSearch(e.target.value);
    },
    [handleSearch]
  );

  const filteredData = useMemo(() => {
    const lower = debouncedSearch.toLowerCase();
    return data.filter((item) =>
      [
        item.name,
        item.address,
        item.Jk,
        item.Role,
        item.Harbor,
        item.age.toString(),
        item.id.toString(),
      ].some((field) => field.toLowerCase().includes(lower))
    );
  }, [debouncedSearch]);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Data Pengguna</h1>
        <div className="flex gap-4 items-center">
          <Button variant="outline" className="bg-Blue text-white">
            Tambah
          </Button>
          <Input
            placeholder="Cari kapal..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-64"
          />
        </div>
      </div>
      <Table>
        <TableCaption>Daftar pengguna pelabuhan.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Alamat</TableHead>
            <TableHead>Umur</TableHead>
            <TableHead>JK</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Pelabuhan</TableHead>
            <TableHead>Tindakan</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="p-4">{item.id}</TableCell>
              <TableCell className="p-4">{item.name}</TableCell>
              <TableCell className="p-4">{item.address}</TableCell>
              <TableCell className="p-4">{item.age}</TableCell>
              <TableCell className="p-4">{item.Jk}</TableCell>
              <TableCell className="p-4">{item.Role}</TableCell>
              <TableCell className="p-4">{item.Harbor}</TableCell>
              <TableCell className="p-4">
                <button className="bg-blue-500 text-white px-2 py-1 rounded">
                  Edit
                </button>
                <button className="bg-red-500 text-white px-2 py-1 rounded ml-2">
                  Hapus
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
