"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PilihTiketTab from "./pilihTiket";
import IsiDataTab from "./isiData";
import { Button } from "@/components/ui/button";

interface TambahModalProps {
  scheduleId: number;
}

export default function TambahModal({ scheduleId }: TambahModalProps) {
  const [open, setOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"pilih" | "isi">("pilih"); // Tambahkan state untuk tab aktif

  const handleLocked = (sessionId: string) => {
    setSessionId(sessionId);
    setActiveTab("isi"); // Pindah ke tab "Isi Data" setelah tiket dikunci
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-Blue hover:bg-Blue/90">Tambah</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Tambah Tiket</DialogTitle>
        </DialogHeader>
        <Tabs
          value={activeTab}
          onValueChange={(value: string) =>
            setActiveTab(value as "pilih" | "isi")
          }
          className="w-full"
        >
          <TabsList className="mb-4 w-full">
            <TabsTrigger value="pilih" className="w-full">
              Pilih Tiket
            </TabsTrigger>
            <TabsTrigger value="isi" disabled={!sessionId}>
              Isi Data
            </TabsTrigger>
          </TabsList>
          <TabsContent value="pilih">
            <PilihTiketTab scheduleId={scheduleId} onLocked={handleLocked} />
          </TabsContent>
          <TabsContent value="isi">
            {sessionId && (
              <IsiDataTab
                sessionId={sessionId}
                onClose={() => setOpen(false)}
              />
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
