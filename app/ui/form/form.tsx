import CardPrice from "./cardPrice";
import KendaraanForm from "./formData"
import { poppins } from "@/app/ui/fonts";

export default function Form(){
    return(
        <div className={`${poppins.className } m-4 flex flex-col-reverse md:flex-row gap-8 justify-center`}>
            <div className="flex justify-center">
                <KendaraanForm/>
            </div>
            <div className="flex justify-center">
                <CardPrice/>
            </div>
        </div>
    )
}