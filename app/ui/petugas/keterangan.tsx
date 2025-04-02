import Image from "next/image";
import img from "@/public/image/asdp.png"

const ticketData = {
  kapal: {
    nama: "Aceh Hebat 1",
    rute: "Calang - Sinabang",
    tanggal: "Senin, 12 Maret 2024",
  },
  statusPemesanan: [
    { kategori: "VIP", jumlah: 100 },
    { kategori: "Bisnis", jumlah: 100 },
    { kategori: "Ekonomi", jumlah: 100 },
    { kategori: "Kendaraan", jumlah: 100 },
  ],
  statusVerifikasi: [
    { kategori: "VIP", jumlah: 100 },
    { kategori: "Bisnis", jumlah: 100 },
    { kategori: "Ekonomi", jumlah: 100 },
    { kategori: "Kendaraan", jumlah: 100 },
  ],
};

const TicketCard = () => {
  return (
    <div className="border h-full bg-white">
      {/* Logo dan Informasi Kapal */}
      <div className="flex flex-col items-center text-center my-10">
        <Image src={img} width={150} height={150} alt="ASDP Logo" />
        <h2 className="font-semibold text-lg mt-2">{ticketData.kapal.nama}</h2>
        <p className="text-gray-600 text-sm">{ticketData.kapal.rute}</p>
        <p className="text-gray-600 text-sm">{ticketData.kapal.tanggal}</p>
      </div>    

      {/* Status Pemesanan */}
      <div className="p-8 border-t mb-8">
        <h3 className="font-semibold">Status Pemesanan</h3>
        <hr className="border-black my-1" />
        {ticketData.statusPemesanan.map((item, index) => (
          <div key={index} className="flex justify-between mt-2">
            <p>{item.kategori}</p>
            <p>{item.jumlah}</p>
          </div>
        ))}
      </div>

      {/* Status Verifikasi */}
      <div className="p-8 border-t">
        <h3 className="font-semibold">Status Verifikasi</h3>
        <hr className="border-black my-1" />
        {ticketData.statusVerifikasi.map((item, index) => (
          <div key={index} className="flex justify-between mt-2">
            <p>{item.kategori}</p>
            <p>{item.jumlah}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TicketCard;
