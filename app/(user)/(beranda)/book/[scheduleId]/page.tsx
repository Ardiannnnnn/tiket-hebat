import Booking from "@/app/ui/booking/book";

export default function BookDetailPage({ params }: { params: { scheduleId: string } }) {
  const { scheduleId } = params;
  return <Booking scheduleid={scheduleId} />;
}
