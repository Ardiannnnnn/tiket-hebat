
import Booking from "@/app/ui/booking/book";


export default async function BookPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <Booking scheduleid={resolvedParams.id} />;
}