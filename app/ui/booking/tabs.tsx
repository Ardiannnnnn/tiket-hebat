"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { poppins } from "@/app/ui/fonts";
import TiketKendaraan from "./tiketKendaraan";
import TiketPenumpang from "./tiketPenumpang";

interface TiketTabsProps {
  scheduleid: string;
}

export default function TiketTabs({ scheduleid }: TiketTabsProps) {
  const [tabValue, setTabValue] = useState<string>("kendaraan");

  return (
    <div className={`${poppins.className} md:w-1/2 md:space-y-10 mt-4 md:mt-10`}>
      <div className="flex text-xl items-center justify-center gap-4 ">
        <div className="p-1 w-10 text-2xl flex items-center justify-center bg-Blue rounded-full font-semibold text-white">
          1
        </div>
        <h1 className="text-2xl font-semibold">Booking Tiket</h1>
      </div>
      <Tabs
        value={tabValue}
        onValueChange={setTabValue}
        className=""
      >
        <TabsList className="w-full flex justify-between">
          <TabsTrigger disabled value="kendaraan">
            Tiket Kendaraan
          </TabsTrigger>
          <TabsTrigger disabled value="penumpang">
            Tiket Penumpang
          </TabsTrigger>
        </TabsList>
        <TabsContent value="kendaraan">
          <TiketKendaraan setTabValue={setTabValue} scheduleid={scheduleid}/>
        </TabsContent>
        <TabsContent value="penumpang">
          <TiketPenumpang setTabValue={setTabValue} scheduleid={scheduleid}/>
        </TabsContent>
      </Tabs>
    </div>
  );
}
