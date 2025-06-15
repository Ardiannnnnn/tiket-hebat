import { Input } from "@/components/ui/input";

export default function cekTiket() {
  return (
    <div className="mt-10 flex flex-col justify-center items-center p-4">
    <h1 className="text-start">Cek Tiket Anda</h1>
      <Input
        type="text"
        placeholder="Masukkan Nomor Tiket"
        className="w-full max-w-md mx-auto p-4 border mt-4 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-Orange focus:border-transparent"
      ></Input>
    </div>
  );
}
