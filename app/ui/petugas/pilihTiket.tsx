'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';
import { getQuotaByScheduleId } from '@/service/quota';
import { lockTickets } from '@/service/session';

interface PilihTiketTabProps {
  scheduleId: number;
  onLocked: (sessionId: string) => void;
}

interface ClassAvailability {
  class_id: number;
  class_name: string;
  total_capacity: number;
  available_capacity: number;
  price: number;
  currency: string;
  type: string;
}

interface SelectedTicket {
  class_id: number;
  quantity: number;
}

export default function PilihTiketTab({ scheduleId, onLocked }: PilihTiketTabProps) {
  const [quota, setQuota] = useState<ClassAvailability[]>([]);
  const [selectedItems, setSelectedItems] = useState<SelectedTicket[]>([]);

  useEffect(() => {
    const fetchQuota = async () => {
      const res = await getQuotaByScheduleId(scheduleId);
      setQuota(res);
    };
    fetchQuota();
  }, [scheduleId]);

  const updateQuantity = (class_id: number, isIncrement: boolean) => {
    setSelectedItems((prev) => {
      const existing = prev.find((item) => item.class_id === class_id);
      if (!existing) {
        return isIncrement
          ? [...prev, { class_id, quantity: 1 }]
          : prev;
      }

      const updated = prev.map((item) => {
        if (item.class_id === class_id) {
          const newQty = item.quantity + (isIncrement ? 1 : -1);
          return { ...item, quantity: Math.max(newQty, 0) };
        }
        return item;
      });

      return updated;
    });
  };

  const getQty = (class_id: number) => {
    return selectedItems.find((item) => item.class_id === class_id)?.quantity ?? 0;
  };

  const handleLock = async () => {
    const items = selectedItems.filter((item) => item.quantity > 0);
    if (items.length === 0) return;

    const res = await lockTickets({
      schedule_id: scheduleId,
      items,
    });

    onLocked(res.data.session_id);
  };

  return (
    <div className="space-y-4">
      {quota.map((item) => (
        <div key={item.class_id} className="border p-4 rounded-xl shadow-sm space-y-3">
          <div className="flex justify-between">
            <div>
              <p className="font-semibold">{item.class_name}</p>
              <p className="text-sm text-muted-foreground capitalize">{item.type}</p>
              <p className="text-sm">
                Tersedia: {item.available_capacity} | Harga: Rp {item.price.toLocaleString('id-ID')}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => updateQuantity(item.class_id, false)}>
                <Minus size={14} />
              </Button>
              <span>{getQty(item.class_id)}</span>
              <Button size="sm" variant="outline" onClick={() => updateQuantity(item.class_id, true)}>
                <Plus size={14} />
              </Button>
            </div>
          </div>
        </div>
      ))}

      <Button
        className='bg-Blue w-full'
        onClick={handleLock}
        disabled={selectedItems.every((item) => item.quantity === 0)}
      >
        Kunci Tiket
      </Button>
    </div>
  );
}
