'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';

const ticketOptions = [
  { label: 'Ekonomi', value: 'ekonomi', available: 200 },
  { label: 'Bisnis', value: 'bisnis', available: 150 },
  { label: 'VIP', value: 'vip', available: 100 },
];

const vehicleOptions = [
  { label: 'Golongan 1', value: '1' },
  { label: 'Golongan 2', value: '2' },
  { label: 'Golongan 3', value: '3' },
  { label: 'Golongan 4', value: '4' },
  { label: 'Golongan 5', value: '5' },
  { label: 'Golongan 6', value: '6' },
  { label: 'Golongan 7', value: '7' },
  { label: 'Golongan 8', value: '8' },
];

const numberOptions = Array.from({ length: 10 }, (_, i) => i.toString());

export default function TicketSelection() {
  const [passengers, setPassengers] = useState([
    { id: 1, ticketType: 'ekonomi', availableTickets: 200, adults: '0', children: '0' },
  ]);
  const [vehicles, setVehicles] = useState([{ id: 1, type: '' }]);

  const addPassenger = () => {
    setPassengers([
      ...passengers,
      { id: passengers.length + 1, ticketType: 'ekonomi', availableTickets: 200, adults: '0', children: '0' },
    ]);
  };

  const addVehicle = () => {
    setVehicles([...vehicles, { id: vehicles.length + 1, type: '' }]);
  };

  const updateTicketType = (id: number, type: string) => {
    const selectedTicket = ticketOptions.find((option) => option.value === type);
    setPassengers(
      passengers.map((p) =>
        p.id === id ? { ...p, ticketType: type, availableTickets: selectedTicket?.available || 0 } : p
      )
    );
  };

  const updatePassengerCount = (id: number, field: string, value: string) => {
    setPassengers(
      passengers.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  return (
    <div className="flex justify-center items-center">
      <div className="w-full max-w-4xl bg-white shadow-md p-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Pilih Kelas dan Jumlah Penumpang</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Passenger Section */}
          <Card className=''>
            <CardHeader>
              <CardTitle className="text-lg font-bold">Penumpang</CardTitle>
            </CardHeader>
            <CardContent className=''>
              {passengers.map((passenger) => (
                <div key={passenger.id} className="mb-4">
                  <label className="text-sm font-medium">Kelas</label>
                  <Select onValueChange={(value) => updateTicketType(passenger.id, value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Kelas" />
                    </SelectTrigger>
                    <SelectContent>
                      {ticketOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="mt-2 text-sm text-gray-600">Sisa Tiket: {passenger.availableTickets}</div>

                  <label className="text-sm font-medium mt-2 block">Dewasa</label>
                  <Select onValueChange={(value) => updatePassengerCount(passenger.id, 'adults', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="0" />
                    </SelectTrigger>
                    <SelectContent>
                      {numberOptions.map((num) => (
                        <SelectItem key={num} value={num}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <label className="text-sm font-medium mt-2 block">Anak-Anak</label>
                  <Select onValueChange={(value) => updatePassengerCount(passenger.id, 'children', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="0" />
                    </SelectTrigger>
                    <SelectContent>
                      {numberOptions.map((num) => (
                        <SelectItem key={num} value={num}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
              <Button variant="ghost" className="flex items-center gap-2 text-teal-500" onClick={addPassenger}>
                <Plus size={16} /> Tambah Penumpang
              </Button>
            </CardContent>
          </Card>

          {/* Vehicle Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold">Kendaraan</CardTitle>
            </CardHeader>
            <CardContent>
              {vehicles.map((vehicle) => (
                <div key={vehicle.id} className="mb-4">
                  <label className="text-sm font-medium">Kendaraan {vehicle.id}</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Golongan Kendaraan" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicleOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
              <Button variant="ghost" className="flex items-center gap-2 text-teal-500" onClick={addVehicle}>
                <Plus size={16} /> Tambah Kendaraan
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center mt-6">
          <Button className="bg-teal-500 text-white px-6 py-2 rounded-lg">Selanjutnya</Button>
        </div>
      </div>
    </div>
  );
}
