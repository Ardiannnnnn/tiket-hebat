import { poppins } from "@/app/ui/fonts";
import Info from "./itemDua";
import ScheduleTable from "./itemSatu";

export default function Schedule() {
  return (
      <div
        className={`${poppins.className} mt-14 md:mt-0 gap-16 w-full  flex md:flex-row flex-col-reverse items-center justify-center`}
      >
        <ScheduleTable />
        <Info />
      </div>
  );
}
