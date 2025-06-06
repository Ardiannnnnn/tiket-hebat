import TiketTabs from "./tabs";
import {ClassAvailability} from "@/types/classAvailability";

interface BookingProps {
  scheduleid: string;
  quota: ClassAvailability[];
}

export default function Booking({ scheduleid, quota }: BookingProps) {
  return (
    <div className="flex flex-col justify-center items-center">
      <TiketTabs scheduleid={scheduleid} quota={quota}/>
    </div>
  );
}
