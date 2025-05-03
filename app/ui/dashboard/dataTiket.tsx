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

export default function TiketPage() {
  const data = [
    {
      id: 1,
      nama: "Tiket A",
      kapal: "Aceh Hebat 1",
      kategori: "Dewasa",
      pelabuhan: "Pelabuhan Singkil",
      harga: "Rp45.000",
    },
    {
      id: 2,
      nama: "Tiket B",
      kapal: "Aceh Hebat 2",
      kategori: "Anak-anak",
      pelabuhan: "Pelabuhan Meulaboh",
      harga: "Rp30.000",
    },
  ]

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Manajemen Tiket</CardTitle>
        <Button variant="default" className="flex gap-2 items-center">
          <PlusCircle size={16} /> Tambah Tiket
        </Button>
      </CardHeader>

      <CardContent>
        <div className="mb-4">
          <Input placeholder="Cari tiket..." className="w-64" />
        </div>
        <Table>
          <TableCaption>Daftar tiket tersedia</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>Nama Tiket</TableHead>
              <TableHead>Kapal</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Pelabuhan</TableHead>
              <TableHead>Harga</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, idx) => (
              <TableRow key={item.id}>
                <TableCell>{idx + 1}</TableCell>
                <TableCell>{item.nama}</TableCell>
                <TableCell>{item.kapal}</TableCell>
                <TableCell>{item.kategori}</TableCell>
                <TableCell>{item.pelabuhan}</TableCell>
                <TableCell>{item.harga}</TableCell>
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
