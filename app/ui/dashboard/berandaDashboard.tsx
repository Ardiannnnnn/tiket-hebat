// "use client";

// import { useEffect, useState } from "react";
// import { getPaymentChannels, createPaymentTransaction } from "@/service/payment";
// import { useRouter, useSearchParams } from "next/navigation";
// import { Button } from "@/components/ui/button";

// export default function PilihPembayaranPage() {
//   const [channels, setChannels] = useState<any[]>([]);
//   const [selected, setSelected] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const searchParams = useSearchParams();
//   const router = useRouter();

//   // Ambil order_id dari query parameter
//   const orderId = searchParams.get("order_id");

//   useEffect(() => {
//     if (orderId) {
//       getPaymentChannels()
//         .then((res) => setChannels(res.data))
//         .catch(() => setChannels([]));
//     }
//   }, [orderId]);

//   const handleBayar = async () => {
//     if (!selected || !orderId) return;
//     setLoading(true);
//     try {
//       const result = await createPaymentTransaction(orderId, selected);
//       const invoiceUrl = result?.data?.invoice_url;
//       if (invoiceUrl) {
//         router.push(invoiceUrl); // Redirect ke halaman pembayaran
//       } else {
//         alert("Gagal mendapatkan link pembayaran.");
//       }
//     } catch {
//       alert("Gagal membuat transaksi pembayaran.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="space-y-6 p-6">
//       <h1 className="text-2xl font-bold">Pilih Metode Pembayaran</h1>
//       <div className="space-y-2">
//         {channels.map((ch: any) => (
//           <label key={ch.code} className="flex items-center gap-2 cursor-pointer">
//             <input
//               type="radio"
//               name="payment"
//               value={ch.code}
//               checked={selected === ch.code}
//               onChange={() => setSelected(ch.code)}
//             />
//             <img src={ch.icon_url} alt={ch.name} width={32} height={32} />
//             <span>{ch.name} ({ch.group})</span>
//           </label>
//         ))}
//       </div>
//       <Button onClick={handleBayar} disabled={!selected || loading}>
//         Bayar
//       </Button>
//     </div>
//   );
// }