// app/(user)/(beranda)/book/[scheduleId]/page.tsx
import Booking from "@/app/ui/booking/book";

interface BookDetailPageProps {
  params: {
    scheduleId: string;
  };
}

export default function BookDetailPage({ params }: BookDetailPageProps) {
  const { scheduleId } = params;
  return <Booking scheduleid={scheduleId} />;
}