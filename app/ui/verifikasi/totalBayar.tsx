"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { FaLongArrowAltRight } from "react-icons/fa";
import { getBookingById } from "@/service/invoice";
import { BookingResponse } from "@/types/invoice";
import { Ship, Calendar, MapPin, Users, Car, Receipt } from "lucide-react";

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

  if (loading) {
    return (
      <Card className="shadow-xl border-0 bg-white">
        <CardContent className="p-8 text-center">
          <div className="w-12 h-12 border-4 border-Blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat detail pesanan...</p>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="shadow-xl border-0 bg-white">
        <CardContent className="p-8 text-center">
          <p className="text-red-600">Data tidak ditemukan</p>
        </CardContent>
      </Card>
    );
  }

  const formatTime = (dateTime: string): { date: string; time: string } => {
    const date = new Date(dateTime);
    const formattedDate = date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const formattedTime = date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return { date: formattedDate, time: formattedTime };
  };

  const penumpang = groupedTickets.filter((t) => t.type === "passenger");
  const kendaraan = groupedTickets.filter((t) => t.type === "vehicle");

  const totalHargaPenumpang = penumpang.reduce((sum, t) => sum + t.subtotal, 0);
  const totalHargaKendaraan = kendaraan.reduce((sum, t) => sum + t.subtotal, 0);

  return (
    <Card className="border-0 bg-white overflow-hidden py-0 gap-0">
      {/* ✅ Enhanced Header */}
      <CardHeader className="bg-gradient-to-r from-Orange/10 to-Blue/10 border-b border-Orange/20 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-Orange/20 rounded-full flex items-center justify-center">
              <Receipt className="w-5 h-5 text-Orange" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Detail Pesanan
              </CardTitle>
              <p className="text-sm text-gray-600">
                {data.schedule.ship.ship_name}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Order ID</p>
            <p className="font-mono text-sm font-medium text-Blue">{orderId}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* ✅ Route Information */}
        <div className="bg-Blue/5 rounded-lg p-4 border border-Blue/20">
          <div className="flex items-center gap-2 mb-3">
            <Ship className="w-4 h-4 text-Blue" />
            <span className="text-sm font-medium text-Blue">Rute Perjalanan</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="text-center">
              <p className="font-medium text-gray-900">
                {data.schedule.route.departure_harbor.harbor_name}
              </p>
              <p className="text-xs text-gray-500">Keberangkatan</p>
            </div>

            <div className="flex-1 mx-4">
              <div className="h-0.5 bg-Blue/30 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-Blue to-Orange"></div>
              </div>
            </div>

            <div className="text-center">
              <p className="font-medium text-gray-900">
                {data.schedule.route.arrival_harbor.harbor_name}
              </p>
              <p className="text-xs text-gray-500">Kedatangan</p>
            </div>
          </div>
        </div>

        {/* ✅ Schedule Information */}
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-Orange mt-0.5 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm text-gray-600">Jadwal Keberangkatan</p>
              <p className="font-medium text-gray-900">
                {formatTime(data.schedule.departure_datetime).date}
              </p>
              <p className="text-lg font-bold text-Orange">
                {formatTime(data.schedule.departure_datetime).time}
              </p>
            </div>
          </div>
        </div>

        {/* ✅ Ticket Details */}
        <div className="space-y-4">
          {/* Passenger Tickets */}
          {penumpang.length > 0 && (
            <div className="border border-Blue/20 rounded-lg p-4 bg-Blue/5">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-Blue" />
                <span className="text-sm font-medium text-Blue">Tiket Penumpang</span>
              </div>
              <div className="space-y-2">
                {penumpang.map((t, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{t.class_name}</p>
                      <p className="text-sm text-gray-600">
                        {t.quantity} penumpang
                      </p>
                    </div>
                    <p className="font-bold text-Blue">
                      Rp{t.subtotal.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vehicle Tickets */}
          {kendaraan.length > 0 && (
            <div className="border border-Orange/20 rounded-lg p-4 bg-Orange/5">
              <div className="flex items-center gap-2 mb-3">
                <Car className="w-4 h-4 text-Orange" />
                <span className="text-sm font-medium text-Orange">Tiket Kendaraan</span>
              </div>
              <div className="space-y-2">
                {kendaraan.map((t, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{t.class_name}</p>
                      <p className="text-sm text-gray-600">{t.quantity} unit</p>
                    </div>
                    <p className="font-bold text-Orange">
                      Rp{t.subtotal.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>

      {/* ✅ Enhanced Footer with Total */}
      <CardFooter className="bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200 p-6">
        <div className="w-full space-y-3">
          {/* Subtotals */}
          <div className="space-y-2 text-sm">
            {totalHargaPenumpang > 0 && (
              <div className="flex justify-between text-gray-600">
                <span>Total Penumpang:</span>
                <span>Rp{totalHargaPenumpang.toLocaleString()}</span>
              </div>
            )}
            {totalHargaKendaraan > 0 && (
              <div className="flex justify-between text-gray-600">
                <span>Total Kendaraan:</span>
                <span>Rp{totalHargaKendaraan.toLocaleString()}</span>
              </div>
            )}
          </div>

          {/* Grand Total */}
          <div className="border-t border-gray-300 pt-3">
            <div className="flex justify-between items-center">
              <span className="text-base font-semibold text-gray-900">
                Total Pembayaran:
              </span>
              <span className="text-base font-semibold text-Blue">
                Rp{(totalHargaPenumpang + totalHargaKendaraan).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
