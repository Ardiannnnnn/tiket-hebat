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

export default function OrderTable() {
  const orders = [
    {
      id: "C01",
      name: "Ardian",
      address: "Air Dingin",
      age: 18,
      gender: "Pria",
      idType: "KTP",
      idNumber: "112345678912345678",
      class: "Bisnis",
    },
    {
      id: "C01",
      name: "Ardian",
      address: "Air Dingin",
      age: 18,
      gender: "Pria",
      idType: "KTP",
      idNumber: "112345678912345678",
      class: "Bisnis",
    },
    {
      id: "C01",
      name: "Ardian",
      address: "Air Dingin",
      age: 18,
      gender: "Pria",
      idType: "KTP",
      idNumber: "112345678912345678",
      class: "Ekonomi",
    },
    {
      id: "C01",
      name: "Ardian",
      address: "Air Dingin",
      age: 18,
      gender: "Pria",
      idType: "KTP",
      idNumber: "112345678912345678",
      class: "VIP",
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Verifikasi</h2>
        <div className="flex gap-2">
          <Input placeholder="Cari" className="w-[200px]" />
        </div>
      </div>    

      {/* Tabel */}
      <div className="mt-4 overflow-x-auto ">
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-left text-sm font-semibold">
              <th className="border border-gray-200 px-4 py-2">Order ID</th>
              <th className="border border-gray-200 px-4 py-2">Status</th>
              <th className="border border-gray-200 px-4 py-2">Nama</th>
              <th className="border border-gray-200 px-4 py-2">Alamat</th>
              <th className="border border-gray-200 px-4 py-2">Umur</th>
              <th className="border border-gray-200 px-4 py-2">
                Jenis Kelamin
              </th>
              <th className="border border-gray-200 px-4 py-2">Jenis ID</th>
              <th className="border border-gray-200 px-4 py-2">NO ID</th>
              <th className="border border-gray-200 px-4 py-2">Kelas</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={index} className="text-sm">
                <td className="border border-gray-200 px-4 py-2">{order.id}</td>
                <td className="border border-gray-200 px-4 py-2">
                  <button className="rounded-md bg-green-400 px-3 py-1 text-sm">
                    Verifikasi
                  </button>
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  {order.name}
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  {order.address}
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  {order.age}
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  {order.gender}
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  {order.idType}
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  {order.idNumber}
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  {order.class}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
