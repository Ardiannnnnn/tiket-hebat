
"use client";
import Invoices from "@/app/ui/invoice/invoice";
import { useParams } from "next/navigation";

export default function InvoicePage() {
  const params = useParams();
  const rawOrderId = params?.orderid; // Ambil orderId dari URL 
  const orderId = Array.isArray(rawOrderId) ? rawOrderId[0] : rawOrderId;

  return <Invoices orderId={orderId} />;
}