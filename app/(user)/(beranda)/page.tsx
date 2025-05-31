import Card from "@/app/ui/beranda/card"
import Schedule from "@/app/ui/beranda/schedule"
import InfoShips from "@/app/ui/beranda/infoShips"
import { Toaster } from "sonner"

export default function Beranda(){
    return(
        <div className="flex flex-col justify-center items-center">
            <Toaster position="top-center"/>
            <Card/>
            <Schedule/>
            <InfoShips/>
        </div> 
    )
}