import Card from "@/app/ui/beranda/card"
import Schedule from "@/app/ui/beranda/schedule"

export default function Beranda(){
    return(
        <div className="flex flex-col justify-center items-center">
            <Card/>
            <Schedule/>
        </div> 
    )
}