import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const order = {
  orderId: "W9495620E",
  namaPemesan: "Ardian",
  email: "ardian@gmail.com",
  keberangkatan: "Sinabang -> Calang",
  telepon: "09854434789",
  jenisKapal: "Aceh Hebat 1",
  jadwal: "Senin, 18 November 2024",
  berangkat: "17.00 WIB",
  tiba: "08.00 WIB",
  totalKendaraan: "Golongan II x1",
  totalPenumpang: [
    { kelas: "Ekonomi (Dewasa)", jumlah: 1 },
    { kelas: "Bisnis (Dewasa)", jumlah: 1 },
    { kelas: "VIP (Dewasa)", jumlah: 1 },
  ],
};

export default function Info() {
  return (
    <Card className="border py-0 border-gray-300 shadow-md">
      <CardHeader className="border-b p-4">
        <CardTitle className="flex px-2 justify-between text-sm font-medium text-gray-700">
          <span>ORDER ID</span>
          <span className="font-semibold">{order.orderId}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="">
        <div className="grid grid-cols-2 gap-y-4 gap-x-4 text-sm text-gray-700">
          <span className="font-medium">Nama Pemesan</span>
          <span className="text-end">{order.namaPemesan}</span>

          <span className="font-medium">Email</span>
          <span className="text-blue-600 text-end">{order.email}</span>

          <span className="font-medium">Keberangkatan</span>
          <span className="text-end">{order.keberangkatan}</span>

          <span className="font-medium">Nomor Telepon</span>
          <span className="text-end">{order.telepon}</span>

          <span className="font-medium">Jenis Kapal</span>
          <span className="text-end">{order.jenisKapal}</span>

          <span className="font-medium">Jadwal Keberangkatan</span>
          <span className="text-end">{order.jadwal}</span>

          <span className="font-medium">Berangkat</span>
          <span className="text-end">{order.berangkat}</span>

          <span className="font-medium">Tiba</span>
          <span className="text-end">{order.tiba}</span>
        </div>
      </CardContent>
      <CardFooter className="border-t py-4">
        <div className="text-sm w-full">
          <div className="flex justify-between">
            <span className="font-medium">Total Kendaraan</span>
            <span className="text-end">{order.totalKendaraan}</span>
          </div>
          <div className="mt-2 flex justify-between">
            <span className="font-medium ">Total Penumpang</span>
            <div className="mt-1 flex flex-col gap-1 text-end">
              {order.totalPenumpang.map((p, index) => (
                <p
                  key={index}
                >
                  {p.kelas} x{p.jumlah}
                </p>
              ))}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
