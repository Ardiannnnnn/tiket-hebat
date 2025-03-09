import Card from "@/app/ui/beranda/card"
import Schedule from "@/app/ui/beranda/schedule"
import InfoShips from "@/app/ui/beranda/infoShips"

export default function Beranda(){
    return(
        <div className="flex flex-col justify-center items-center">
            <Card/>
            <Schedule/>
            <InfoShips/>
        </div> 
    )
}