// app/infokapal/[id]/page.tsx
import { getShipById } from "@/service/shipService";
import InfoKapalDetail from "@/app/ui/beranda/detailKapal";
import { notFound } from "next/navigation";

interface PageProps {
  params: { id: string };
}

export default async function InfoKapalPage({ params }: PageProps) {
  try {
    const ship = await getShipById(params.id);
    
    if (!ship) {
      notFound();
    }

    return <InfoKapalDetail ship={ship} />;
  } catch (error) {
    console.error("Error fetching ship:", error);
    notFound();
  }
}