import Booking from "@/app/ui/booking/book";
import { getQuotaByScheduleId } from "@/service/quota";

export default async function BookPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const scheduleid = resolvedParams.id;

const quota = await getQuotaByScheduleId(scheduleid);

  return <Booking scheduleid={scheduleid} quota={quota} />;
}
