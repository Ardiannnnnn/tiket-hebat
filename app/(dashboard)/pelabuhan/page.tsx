import DataPelabuhan from "@/app/ui/dashboard/dataPelabuhan";

import { getHarbor } from "@/service/harborService";
import { ShipResponse } from "@/types/ship"; // Pastikan path-nya sesuai
// // Pastikan path-nya sesuai struktur folder

const { data } = await getHarbor();

data.data.forEach((harbor) => {
  console.log(harbor.name); // nama kelasnya (VIP, ECONOMY, dll)
});

export default function KapalPage() {
  return (
    <div>
      <DataPelabuhan />
    </div>
  );
}
