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
import TambahModal, { DynamicField } from "./tambah";

interface User {
  id: number;
  name: string;
  address: string;
  age: number;
  Jk: string;
  Role: string;
  Harbor: string;
}

const initialData: User[] = [
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
  const [data, setData] = useState<User[]>(initialData);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [formData, setFormData] = useState<Omit<User, "id">>({
    name: "",
    address: "",
    age: 0,
    Jk: "",
    Role: "",
    Harbor: "",
  });

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
  }, [debouncedSearch, data]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onReset = () => {
    setFormData({
      name: "",
      address: "",
      age: 0,
      Jk: "",
      Role: "",
      Harbor: "",
    });
  };

  // ubah nanti disini jika menggunakan API
  // ubah menjadi seperti ini
  // const handleAddUser = async (newUser: Omit<User, "id">) => {
  // const handleAddUser = async (newUser: Omit<User, "id">) => {
  //   try {
  //     const res = await fetch("/api/users", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(newUser),
  //     });

  //     if (!res.ok) throw new Error("Gagal menambahkan pengguna");

  //     const createdUser = await res.json();
  //     setData((prev) => [...prev, createdUser]);
  //   } catch (error) {
  //     console.error("Gagal menambah pengguna:", error);
  //   }
  // };

  // atau

  // const handleAddUser = async (newUser: Omit<User, "id">) => {
  //   try {
  //     const res = await fetch("/api/users", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(newUser),
  //     });
  
  //     if (!res.ok) throw new Error("Gagal menambahkan pengguna");
  
  //     const createdUser = await res.json();
  //     setData((prev) => [...prev, createdUser]);
  //   } catch (error) {
  //     console.error("Gagal menambah pengguna:", error);
  //   }
  // };
  

  const onAdd = (newUser: Omit<User, "id">) => {
    const newId = data.length + 1;
    setData((prev) => [...prev, { id: newId, ...newUser }]);
  };

  const fields: DynamicField[] = [
    { name: "name", label: "Nama" },
    { name: "address", label: "Alamat" },
    { name: "age", label: "Umur", type: "number" },
    { name: "Jk", label: "Jenis Kelamin" },
    { name: "Role", label: "Role" },
    { name: "Harbor", label: "Pelabuhan" },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Data Pengguna</h1>
        <div className="flex gap-4 items-center">
          <TambahModal
            fields={fields}
            formData={formData}
            onChange={onChange}
            onReset={onReset}
            onAdd={onAdd}
            judul="Pengguna"  
          />
          <Input
            placeholder="Cari pengguna..."
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
          {filteredData.map((item) => (
            <TableRow key={item.id}>
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
