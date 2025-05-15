export const dynamic = "force-static";

import Booking from "@/app/ui/booking/book";

export default function BookDetailPage({
  params,
}: {
  params: { scheduleId: string };
}) {
  return <Booking scheduleId={params.scheduleId} />;
}
