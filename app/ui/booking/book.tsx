import TiketPenumpang from "./tiketPenumpang";
import TiketKendaraan from "./tiketKendaraan";
import TiketTabs from "./tabs";
import { Toaster } from "sonner";

interface BookingProps {
  scheduleId: string;
}

export default function Booking({ scheduleId }: BookingProps) {
  return (
    <div className="flex flex-col justify-center items-center">
      <Toaster position="top-center" />
      <TiketTabs scheduleId={scheduleId} />
    </div>
  );
}
