import { FaArrowLeft } from "react-icons/fa6";
import Link from "next/link";

export default function Info() {
  return (
    <div className="flex flex-col justify-center items-center md:items-end md:justify-end md:gap-14 gap-4">
      <div className="relative flex h-14 md:h-40 w-60 justify-center items-center md:left-20">
        <div className="absolute md:bottom-5 left-22  md:left-6 w-6 h-6 md:w-15 md:h-15 bg-Blue rounded-full"></div>
        <div className="absolute md:top-5 right-22 md:right-10 w-6 h-6 md:w-26 md:h-26 bg-Orange rounded-full"></div>
      </div>
      <div className="md:text-end text-center">
        <p className="font-semibold text-2xl">Persiapkan Keberangkatan</p>
        <p className="font-semibold text-xl">Dengan Menjadwalkannya</p>
      </div>
      <div className="md:text-end text-center space-y-4">
        <div className="mr-4">
          <p>Informasi Jadwal</p>
          <p>Keberangkatan Minggu Ini</p>
        </div>
        <Link href="/jadwal">
          <div className="md:w-3xs p-2 md:p-4 bg-Orange rounded-full flex items-center justify-center space-x-6">
            <FaArrowLeft className="md:w-6 md:h-6 text-white" />
            <p className="text-center md:text-xl text-white font-semibold">
              Lihat Lengkap
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
