"use client";
import { useState, useMemo, useCallback } from "react";
import { useDebouncedCallback } from "use-debounce";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const pelabuhanData = [
  {
    id: 1,
    name: "Pelabuhan Sinabang",
    status: "Beroperasi",
    kapal: "Aceh Hebat 1, Teluk Sinabang, Teluk Singkil, Aceh Hebat 3",
    years: "1990 - 2028",
  },
  {
    id: 2,
    name: "Pelabuhan Calang",
    status: "Dock",
    kapal: "Aceh Hebat 3, Teluk Singkil",
    years: "2000 - 2026",
  },
  {
    id: 3,
    name: "Pelabuhan Singkil",
    status: "Beroperasi",
    kapal: "Aceh Hebat 1, Teluk Sinabang",
    years: "1995 - 2027",
  },
  {
    id: 4,
    name: "Pelabuhan Bubun",
    status: "Beroperasi",
    kapal: "Teluk Singkil",
    years: "2005 - 2029",
  },
  {
    id: 5,
    name: "Pelabuhan Pulau Banyak",
    status: "Dock",
    kapal: "Aceh Hebat 3",
    years: "2008 - 2026",
  },
];

export default function DataPelabuhanPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

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
    return pelabuhanData.filter((item) =>
      [
        item.name,
        item.status,
        item.kapal,
        item.years,
      ].some((field) => field.toLowerCase().includes(search))
    );
  }, [debouncedSearch]);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Data Pelabuhan</h1>
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
        <TableCaption>Data status pelabuhan dan kapal yang beroperasi</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Nama Pelabuhan</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Kapal</TableHead>
            <TableHead>Periode</TableHead>
            <TableHead>Tindakan</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.status}</TableCell>
              <TableCell>{item.kapal}</TableCell>
              <TableCell>{item.years}</TableCell>
              <TableCell>
                <Button className="bg-yellow-300 text-black mr-2">Edit</Button>
                <Button className="bg-orange-500 text-white">Hapus</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
