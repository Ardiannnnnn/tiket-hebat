import OrderTable from "@/app/ui/petugas/pesanan";
import Keterangan from "@/app/ui/petugas/keterangan";
import Verifikasi from "@/app/ui/petugas/verifikasi"

export default function Home() {
  return (
    <div className="flex">
      <div className="flex w-full">
        <div className="w-1/2">
          <OrderTable />
        </div>
        <div className="w-1/2">
          <Verifikasi />
        </div>
      </div>
      {/* <div className="h-screen">
        <Keterangan />
      </div> */}
    </div>
  );
}
