import TiketPenumpang from "./tiketPenumpang"
import TiketKendaraan from "./tiketKendaraan"
import TiketTabs from "./tabs"

export default function Booking() {
    return (
        <div className="flex flex-col justify-center items-center">
            <TiketTabs/>
        </div>
    )
}