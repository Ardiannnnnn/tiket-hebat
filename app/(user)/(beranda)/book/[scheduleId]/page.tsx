import Booking from "@/app/ui/booking/book";

interface Props {
  params: Promise<{ scheduleId: string }>;
}

export default function BookDetailPage({params,}: {params: { scheduleId: string };}) {
  return <Booking scheduleId={params.scheduleId} />;
}
