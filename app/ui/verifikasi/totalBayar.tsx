"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { FaLongArrowAltRight } from "react-icons/fa";
import { getBookingById } from "@/service/invoice";
import { BookingResponse } from "@/types/invoice";

interface TotalBayarProps {
  orderId: string;
}

interface GroupedTicket {
  class_name: string;
  type: string;
  quantity: number;
  subtotal: number;
}

export default function TotalBayar({ orderId }: TotalBayarProps) {
  const [data, setData] = useState<BookingResponse["data"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [groupedTickets, setGroupedTickets] = useState<GroupedTicket[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getBookingById(orderId);
        setData(result.data);

        const grouped = groupTickets(result.data.tickets);
        setGroupedTickets(grouped);
      } catch (error) {
        console.error("Error fetching order data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [orderId]);

  const groupTickets = (tickets: BookingResponse["data"]["tickets"]) => {
    const map = new Map<string, GroupedTicket>();

    for (const ticket of tickets) {
      const key = `${ticket.class.class_name}-${ticket.class.type}`;
      if (map.has(key)) {
        const existing = map.get(key)!;
        existing.quantity += 1;
        existing.subtotal += ticket.price;
      } else {
        map.set(key, {
          class_name: ticket.class.class_name,
          type: ticket.class.type,
          quantity: 1,
          subtotal: ticket.price,
        });
      }
    }

    return Array.from(map.values());
  };

  if (loading) return <p>Loading...</p>;
  if (!data) return <p>Data tidak ditemukan.</p>;

  const penumpang = groupedTickets.filter((t) => t.type === "passenger");
  const kendaraan = groupedTickets.filter((t) => t.type === "vehicle");

  const totalHargaPenumpang = penumpang.reduce((sum, t) => sum + t.subtotal, 0);
  const totalHargaKendaraan = kendaraan.reduce((sum, t) => sum + t.subtotal, 0);

  return (
    <Card className="py-0 gap-0 text-sm">
      <CardHeader className="flex flex-row justify-between border-b p-6">
        <CardTitle className="font-normal">Detail Keberangkatan</CardTitle>
        <CardTitle>{data.schedule.ship.ship_name}</CardTitle>
      </CardHeader>

      <CardContent className="flex gap-4 md:gap-24 px-3 md:px-6">
        <div>
          {/* Keberangkatan */}
          <div className="w-full mt-4">
            <label className="text-gray-500">Keberangkatan</label>
            <div className="flex items-center gap-2">
              <span>{data.schedule.route.departure_harbor.harbor_name}</span>
              <FaLongArrowAltRight className="text-lg" />
              <span>{data.schedule.route.arrival_harbor.harbor_name}</span>
            </div>
          </div>

          {/* Kelas Tiket */}
          <div className="w-full mt-4">
            <label className="text-gray-500">Kelas tiket</label>
            {penumpang.map((t, i) => (
              <div key={i} className="flex flex-col">
                <p>{t.class_name} x {t.quantity}</p>
              </div>
            ))}
          </div>

          {/* Kendaraan */}
          <div className="w-full mt-4">
            <label className="text-gray-500">Kendaraan</label>
            {kendaraan.map((t, i) => (
              <div key={i} className="flex flex-col">
                <p>{t.class_name} x {t.quantity}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          {/* Jadwal */}
          <div className="w-full mt-4">
            <label className="text-gray-500 flex justify-end">Jadwal</label>
            <div className="text-end flex flex-col">
              <span>{data.schedule.departure_datetime}</span>
              <span>00</span>
            </div>
          </div>

          {/* Harga Penumpang */}
          <div className="w-full mt-4 flex flex-col text-end">
            <label className="text-gray-500">Harga Penumpang</label>
            {penumpang.map((t, i) => (
              <div key={i}><p>Rp{t.subtotal.toLocaleString()}</p></div>
            ))}
          </div>

          {/* Harga Kendaraan */}
          <div className="w-full mt-4 flex flex-col text-end">
            <label className="text-gray-500">Harga Kendaraan</label>
            {kendaraan.map((t, i) => (
              <div key={i}><p>Rp{t.subtotal.toLocaleString()}</p></div>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t px-3 md:px-6 py-4 mt-4 flex justify-between">
        <div>
          <p>Harga Total Tiket :</p>
          <p>Harga Total Kendaraan :</p>
          <p className="mt-4 font-bold">Total:</p>
        </div>
        <div>
          <p>Rp{totalHargaPenumpang.toLocaleString()}</p>
          <p>Rp{totalHargaKendaraan.toLocaleString()}</p>
          <p className="mt-4 font-bold">Rp{(totalHargaPenumpang + totalHargaKendaraan).toLocaleString()}</p>
        </div>
      </CardFooter>
    </Card>
  );
}
