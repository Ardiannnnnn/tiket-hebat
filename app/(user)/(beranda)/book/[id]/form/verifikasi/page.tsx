import VerifikasiData from "@/app/ui/verifikasi/verifikasi"

export default async function Verifikasi({ params }: { params: Promise<{ id: string }> }){
    const resolvedParams = await params;
    return(
        <VerifikasiData scheduleid={resolvedParams.id}/>
    )
}
