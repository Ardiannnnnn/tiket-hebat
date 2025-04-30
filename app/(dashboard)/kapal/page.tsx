import DataKapalberanda from "@/app/ui/dashboard/dataKapal"
import { getShips } from "@/service/shipService";  
import { ShipResponse } from "@/types/ship";  // Pastikan path-nya sesuai
// // Pastikan path-nya sesuai struktur folder


const { data } = await getShips();

data.data.forEach((ship) => {
  console.log(ship.name); // akses nama kapalnya
  ship.ship_classes.forEach((kelas) => {
    console.log(kelas.class.name); // nama kelasnya (VIP, ECONOMY, dll)
  });
});


export default function DataKapal(){
    return(
       <div>
            <DataKapalberanda/>
       </div>
    )
}