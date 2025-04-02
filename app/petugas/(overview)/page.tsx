import OrderTable from "@/app/ui/petugas/pesanan";
import Keterangan from "@/app/ui/petugas/keterangan";
import Verifikasi from "@/app/ui/petugas/verifikasi"

export default function Home() {
  return (
    <div className="grid grid-cols-4">
      <div className="col-span-3 h-fit">
        <div>
          <OrderTable />
        </div>
        <div className="border-t mt-8">
          <Verifikasi />
        </div>
      </div>
      <div className="h-screen">
        <Keterangan />
      </div>
    </div>
  );
}
