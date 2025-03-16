import Link from "next/link";
import { poppins } from "../fonts";
import Data from "./data";
import Info from "./info";

export default function Verifikasi() {
  return (
    <div className={`${poppins.className}`}>
      <div className="mt-6 flex items-center justify-center gap-4">
        <div className="bg-Blue rounded-full p-1 w-10 text-white font-bold flex justify-center text-2xl">
          3
        </div>
        <p className="text-2xl font-semibold">Verifikasi Data </p>
      </div>
      <div className=" flex flex-col-reverse md:flex-row gap-8 justify-center mt-8 m-4">
            <Data/>
            <Info/>
      </div>
    </div>
  );
}
