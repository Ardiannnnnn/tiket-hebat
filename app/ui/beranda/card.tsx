import Image from "@/public/image/kapal3.png";
import { Form } from "./form";
import { poppins } from "@/app/ui/fonts";
import { montserrat } from "@/app/ui/fonts";

export default function Card() {
  return (
    <>
      <div
        className={`${poppins.className} bg-cover bg-center m-4 xl:m-24 rounded-lg xl:flex p-4 xl:p-12`}
        style={{ backgroundImage: `url(${Image.src})` }}
      >
        <div className="m-4 text-white xl:w-1/2 xl:p-8 space-y-10 mb-10 text-center xl:text-left ">
          <div className="text-4xl xl:text-5xl 2xl:text-7xl font-semibold">
            <span>Pastikan </span>{" "}
            <span className="text-Orange">Jadwal</span>{" "}
            <span>Keberangkatan </span>{" "}
            <span className="text-Orange">Anda</span>
          </div>

          <p className="hidden xl:block">
            Tiket Hebat siap menemani anda untuk mempersiapkan jadwal
            keberangkatan yang sesuai dengan schedule anda
          </p>
        </div>
        <Form />
      </div>
    </>
  );
}
