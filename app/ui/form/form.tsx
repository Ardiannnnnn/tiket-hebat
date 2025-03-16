import CardPrice from "./cardPrice";
import KendaraanForm from "./formData";
import { poppins } from "@/app/ui/fonts";

export default function Form() {
  return (
    <div className={`${poppins.className} flex flex-col items-center gap-6`}>
      <div className="mt-6 flex items-center justify-center gap-4">
        <div className="bg-Blue rounded-full p-1 w-10 text-white font-bold flex justify-center text-2xl">
          2
        </div>
        <p className="text-2xl font-semibold">
            Isi Data Diri
        </p>
      </div>
      <div className="flex flex-col-reverse md:flex-row gap-4 justify-center">
        <div className="flex justify-center m-2">
          <KendaraanForm />
        </div>
        <div className="flex justify-center m-2">
          <CardPrice />
        </div>
      </div>
    </div>
  );
}
