"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RiShipFill } from "react-icons/ri";

export default function RiwayatTable() {
  const [orders] = useState([
    {
      id: "C01",
      status: "Verifikasi",
      name: "Ardian",
      address: "Air Dingin",
      age: 18,
      gender: "Pria",
      idType: "KTP",
      idNumber: "112345678912345678",
      class: "Bisnis",
      route: "Calang",
      ship: "Aceh Hebat 1",
    },
    {
      id: "C02",
      status: "Verifikasi",
      name: "Ardian",
      address: "Air Dingin",
      age: 18,
      gender: "Pria",
      idType: "KTP",
      idNumber: "112345678912345678",
      class: "Ekonomi",
      route: "Calang",
      ship: "Aceh Hebat 1",
    },
    {
      id: "C03",
      status: "Verifikasi",
      name: "Ardian",
      address: "Air Dingin",
      age: 18,
      gender: "Pria",
      idType: "KTP",
      idNumber: "112345678912345678",
      class: "VIP",
      route: "Calang",
      ship: "Aceh Hebat 1",
    },
  ]);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between">
        <h2 className="text-lg font-semibold">Pemesanan</h2>
        <div className="flex items-center gap-2">
          <RiShipFill />
          <h2 className="text-lg font-semibold">Pelabuhan Calang</h2>
        </div>
      </div>

      {/* Filter dan Search */}
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          <Select>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Pilih Jadwal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="jadwal1">Jadwal 1</SelectItem>
              <SelectItem value="jadwal2">Jadwal 2</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Pilih jenis tiket" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bisnis">Bisnis</SelectItem>
              <SelectItem value="ekonomi">Ekonomi</SelectItem>
              <SelectItem value="vip">VIP</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Input placeholder="Cari" className="w-[200px]" />
      </div>

      {/* Tabel */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-left text-sm font-semibold">
              <th className="border border-gray-200 px-4 py-2">Order ID</th>
              <th className="border border-gray-200 px-4 py-2">Status</th>
              <th className="border border-gray-200 px-4 py-2">Nama</th>
              <th className="border border-gray-200 px-4 py-2">Alamat</th>
              <th className="border border-gray-200 px-4 py-2">Umur</th>
              <th className="border border-gray-200 px-4 py-2">Jenis Kelamin</th>
              <th className="border border-gray-200 px-4 py-2">Jenis ID</th>
              <th className="border border-gray-200 px-4 py-2">NO ID</th>
              <th className="border border-gray-200 px-4 py-2">Kelas</th>
              <th className="border border-gray-200 px-4 py-2">Rute</th>
              <th className="border border-gray-200 px-4 py-2">Kapal</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="text-sm">
                <td className="border border-gray-200 px-4 py-2">{order.id}</td>
                <td className="border border-gray-200 px-4 py-2">
                  <span className="bg-lime-400 text-white px-3 py-1 rounded-lg">
                    {order.status}
                  </span>
                </td>
                <td className="border border-gray-200 px-4 py-2">{order.name}</td>
                <td className="border border-gray-200 px-4 py-2">{order.address}</td>
                <td className="border border-gray-200 px-4 py-2">{order.age}</td>
                <td className="border border-gray-200 px-4 py-2">{order.gender}</td>
                <td className="border border-gray-200 px-4 py-2">{order.idType}</td>
                <td className="border border-gray-200 px-4 py-2">{order.idNumber}</td>
                <td className="border border-gray-200 px-4 py-2">{order.class}</td>
                <td className="border border-gray-200 px-4 py-2">{order.route}</td>
                <td className="border border-gray-200 px-4 py-2">{order.ship}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
