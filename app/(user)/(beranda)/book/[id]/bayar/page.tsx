'use client';

import TiketSesi from '@/app/ui/verifikasi/tiketSection';
import Total from '@/app/ui/verifikasi/totalBayar';
import { useSearchParams, useParams } from 'next/navigation';

export default function BayarPage() {
  const searchParams = useSearchParams();
  const params = useParams(); // ✅ gunakan useParams

  const orderId = searchParams?.get('order_id');
  const scheduleId = params?.id as string; // 💡 jika `params` dari dynamic segment [id]

  return (
    <div className="flex flex-col justify-center items-center m-4 gap-4 reverse">
      <TiketSesi orderId={orderId || ''} scheduleId={scheduleId || ''} />
      <Total orderId={orderId || ''} />
    </div>
  );
}
