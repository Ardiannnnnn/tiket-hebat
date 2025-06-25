// app/infokapal/[id]/page.tsx
import { getShipById } from "@/service/shipService";
import InfoKapalDetail from "@/app/ui/beranda/detailKapal";
import { notFound } from "next/navigation";


export default async function InfoKapalPage({ params }: { params: Promise<{ id: string }> }) {

  const resolvedParams = await params;
  const id = resolvedParams.id;

  try {
    const ship = await getShipById(id);

    if (!ship) {
      notFound();
    }

    return <InfoKapalDetail ship={ship} />;
  } catch (error) {
    console.error("Error fetching ship:", error);
    notFound();
  }
}