import TiketPenumpang from "./tiketPenumpang";
import TiketKendaraan from "./tiketKendaraan";
import TiketTabs from "./tabs";
import { Toaster } from "sonner";
import {ClassAvailability} from "@/types/classAvailability";

interface BookingProps {
  scheduleid: string;
  quota: ClassAvailability[];
}

export default function Booking({ scheduleid, quota }: BookingProps) {
  return (
    <div className="flex flex-col justify-center items-center">
      <Toaster position="top-center" />
      <TiketTabs scheduleid={scheduleid} quota={quota}/>
    </div>
  );
}
