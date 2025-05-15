import TiketPenumpang from "./tiketPenumpang";
import TiketKendaraan from "./tiketKendaraan";
import TiketTabs from "./tabs";
import { Toaster } from "sonner";

interface BookingProps {
  scheduleid: string;
}

export default function Booking({ scheduleid }: BookingProps) {
  return (
    <div className="flex flex-col justify-center items-center">
      <Toaster position="top-center" />
      <TiketTabs scheduleid={scheduleid} />
    </div>
  );
}
