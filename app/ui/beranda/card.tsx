import Image from "@/public/image/kapal3.png";
import { Form } from "./form";

export default function Card() {
  return (
    <>
      <div
        className="bg-cover bg-center m-4 md:m-24 rounded-lg md:flex  p-4 md:p-12"
        style={{ backgroundImage: `url(${Image.src})` }}
      >
        <div className="m-4 text-white md:w-1/2 md:p-8 space-y-10 mb-10 text-center md:text-left ">
          <div className="text-4xl md:text-7xl font-semibold">
            <span>Pastikan </span>{" "}
            <span className="text-Orange">Jadwal</span>{" "}
            <span>Keberangkatan </span>{" "}
            <span className="text-Orange">Anda</span>
          </div>

          <p className="hidden md:block">
            Tiket Hebat siap menemani anda untuk mempersiapkan jadwal
            keberangkatan yang sesuai dengan schedule anda
          </p>
        </div>
        <Form />
      </div>
    </>
  );
}
