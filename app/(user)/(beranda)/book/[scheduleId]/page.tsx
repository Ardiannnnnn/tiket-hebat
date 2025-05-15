import Booking from "@/app/ui/booking/book";
import { FC } from "react";

interface BookDetailPageProps {
  params: {
    scheduleId: string;
  };
}

const BookDetailPage: FC<BookDetailPageProps> = ({ params }) => {
  return <Booking scheduleId={params.scheduleId} />;
};

export default BookDetailPage;
