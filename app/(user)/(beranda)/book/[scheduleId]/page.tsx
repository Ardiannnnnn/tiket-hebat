export const dynamic = "force-static";

import Booking from "@/app/ui/booking/book";

export default function BookDetailPage({
  params,
}: {
  params: { scheduleid: string };
}) {
  return <Booking scheduleid={params.scheduleid} />;
}
