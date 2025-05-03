import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle } from "lucide-react"

export default function RutePage() {
  const data = [
    {
      id: 1,
      kapal: "Aceh Hebat 1",
      pelabuhanAsal: "Pelabuhan Singkil",
      pelabuhanTujuan: "Pelabuhan Pulau Banyak",
      jarak: "50 km",
      estimasi: "1 jam",
    },
    {
      id: 2,
      kapal: "Teluk Sinabang",
      pelabuhanAsal: "Pelabuhan Meulaboh",
      pelabuhanTujuan: "Pelabuhan Simeulue",
      jarak: "70 km",
      estimasi: "2 jam",
    },
  ]

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Manajemen Rute</CardTitle>
        <Button variant="default" className="flex gap-2 items-center">
          <PlusCircle size={16} /> Tambah Rute
        </Button>
      </CardHeader>

      <CardContent>
        <div className="mb-4">
          <Input placeholder="Cari rute..." className="w-64" />
        </div>
        <Table>
          <TableCaption>Daftar rute kapal</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>Kapal</TableHead>
              <TableHead>Pelabuhan Asal</TableHead>
              <TableHead>Pelabuhan Tujuan</TableHead>
              <TableHead>Jarak</TableHead>
              <TableHead>Estimasi</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, idx) => (
              <TableRow key={item.id}>
                <TableCell>{idx + 1}</TableCell>
                <TableCell>{item.kapal}</TableCell>
                <TableCell>{item.pelabuhanAsal}</TableCell>
                <TableCell>{item.pelabuhanTujuan}</TableCell>
                <TableCell>{item.jarak}</TableCell>
                <TableCell>{item.estimasi}</TableCell>
                <TableCell className="space-x-2">
                  <Button size="sm" variant="secondary">
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive">
                    Hapus
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
