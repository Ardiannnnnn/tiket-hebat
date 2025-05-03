"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle } from "lucide-react";
import { useState } from "react";

export default function JadwalPage() {
  const [tanggalKeberangkatan, setTanggalKeberangkatan] = useState<Date>();
  const [tanggalKedatangan, setTanggalKedatangan] = useState<Date>();

  return (
    <Card className="p-6">
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-xl font-bold">Upload Jadwal</CardTitle>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Tambah Jadwal
        </Button>
      </CardHeader>

      <CardContent className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Rute */}
          <div className="space-y-2">
            <Label htmlFor="rute">Rute</Label>
            <Select>
              <SelectTrigger id="rute">
                <SelectValue placeholder="Pilih Rute" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="singkil-pulau-banyak">
                  Singkil - Pulau Banyak
                </SelectItem>
                <SelectItem value="meulaboh-simeulue">
                  Meulaboh - Simeulue
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Jenis Kapal */}
          <div className="space-y-2">
            <Label htmlFor="kapal">Jenis Kapal</Label>
            <Select>
              <SelectTrigger id="kapal">
                <SelectValue placeholder="Pilih Jenis Kapal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aceh-hebat-1">Aceh Hebat 1</SelectItem>
                <SelectItem value="aceh-hebat-2">Aceh Hebat 2</SelectItem>
                <SelectItem value="teluk-singkil">Teluk Singkil</SelectItem>
                <SelectItem value="teluk-sinabang">Teluk Sinabang</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Waktu Keberangkatan & Kedatangan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Keberangkatan</Label>
            <div className="flex flex-col md:flex-row gap-2 mt-2 items-start">
              <Input placeholder="Hari" className="w-full md:w-[120px]" />
              <Calendar
                mode="single"
                selected={tanggalKeberangkatan}
                onSelect={setTanggalKeberangkatan}
                className="rounded-md border"
              />
              <Input
                placeholder="Jam"
                type="time"
                className="w-full md:w-[120px]"
              />
            </div>
          </div>
          <div>
            <Label>Kedatangan</Label>
            <div className="flex flex-col md:flex-row gap-2 mt-2 items-start">
              <Input placeholder="Hari" className="w-full md:w-[120px]" />
              <Calendar
                mode="single"
                selected={tanggalKedatangan}
                onSelect={setTanggalKedatangan}
                className="rounded-md border"
              />
              <Input
                placeholder="Jam"
                type="time"
                className="w-full md:w-[120px]"
              />
            </div>
          </div>
        </div>

        {/* Catatan */}
        <div className="space-y-2">
          <Label htmlFor="catatan">Catatan (opsional)</Label>
          <Textarea id="catatan" placeholder="Isi catatan tambahan jika ada" />
        </div>

        <div className="flex justify-end">
          <Button>Simpan Jadwal</Button>
        </div>
      </CardContent>
    </Card>
  );
}
