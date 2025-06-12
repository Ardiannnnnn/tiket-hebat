"use client";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ReusableTable, { ColumnDef } from "./table";
import { deleteUser, getUsers } from "@/service/user";
import type { User } from "@/types/user";
import { toast } from "sonner";
import Link from "next/link";
import { useDebouncedCallback } from "use-debounce";

export default function PenggunaDashboard() {
  const [users, setUsers] = useState<User[]>([]); // Data asli dari API
  const [filteredData, setFilteredData] = useState<User[]>([]); // Data hasil filter
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [meta, setMeta] = useState({
    total: 0,
    per_page: 5,
    current_page: 1,
    total_pages: 0
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const fetchUsers = useCallback(async (page: number = 1) => {
    setLoading(true);
    try {
      const response = await getUsers(page, meta.per_page);
      if (response && response.status) {
        setUsers(response.data);
        setMeta(response.meta);
        setFilteredData(response.data);
      } else {
        throw new Error(response?.message || "Failed to fetch users");
      }
    } catch (error: any) {
      setError(error.message);
      toast.error("Gagal memuat data pengguna");
    } finally {
      setLoading(false);
    }
  }, [meta.per_page]);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  // Filter data locally when search term changes
  useEffect(() => {
    if (debouncedSearch.trim() === "") {
      setFilteredData(users);
    } else {
      const search = debouncedSearch.toLowerCase();
      const filtered = users.filter((item) =>
        item.full_name.toLowerCase().includes(search) ||
        item.username.toLowerCase().includes(search) ||
        item.email.toLowerCase().includes(search) ||
        item.role.role_name.toLowerCase().includes(search)
      );
      setFilteredData(filtered);
    }
  }, [debouncedSearch, users]);

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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchUsers(page);
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [fetchUsers, currentPage]);

  // Table columns definition
  const columns: ColumnDef<User>[] = [
    { key: "id", label: "ID" },
    { key: "username", label: "Username" },
    { key: "email", label: "Email" },
    { key: "full_name", label: "Nama Lengkap" },
    { 
      key: "role",
      label: "Role",
      render: (value) => {
        if (typeof value === 'object' && value !== null && 'role_name' in value) {
          return value.role_name;
        }
        return '-';
      }
    },
  ];

  const handleEdit = (user: User) => {
    window.location.href = `/pengguna/edit/${user.id}`;
  };

  const handleDelete = async (item: User) => {
    const success = await deleteUser(item.id);
    if (success) {
      toast.success("Pelabuhan berhasil dihapus");
      fetchUsers();
    } else {
      toast.error("Gagal menghapus pelabuhan");
    }
  };

  return (
    <div className="p-4">
      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-md">
          {error}
        </div>
      )}
      
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Data Pengguna Sistem</h1>
        <div className="flex gap-4 items-center">
          <Link href="/pengguna/create">
            <Button className="bg-Blue hover:bg-teal-600">Tambah</Button>
          </Link>

          <Input
            placeholder="Cari pengguna..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-64"
          />
        </div>
      </div>

      <ReusableTable
        columns={columns}
        data={filteredData}
        isLoading={loading}
        showActions={true}
        onEdit={handleEdit}
        onDelete={handleDelete}
        meta={meta}
        onPageChange={handlePageChange}
        displayNameField="full_name"
        editUrl={(item) => `/pengguna/edit/${item.id}`}
        caption="Daftar pengguna sistem"
      />
    </div>
  );
}