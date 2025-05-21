import Booking from "@/app/ui/booking/book";

export default async function BookPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const scheduleid = resolvedParams.id;

// export default async function BookPage({ params }: { params: { id: string } }) {
//   const scheduleid = params.id;

  const res = await fetch(
    `https://tikethebat.ambitiousflower-0b7495d3.southeastasia.azurecontainerapps.io/api/v1/schedule/${scheduleid}/quota`
  );

  const json = await res.json();
  const quota = json.data.classes_availability;

  return <Booking scheduleid={scheduleid} quota={quota} />;
}
