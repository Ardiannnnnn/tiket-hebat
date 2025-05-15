"use client";

import React, { useEffect, useState } from "react";
import SelectInput from "./selectInput";
import { RiShipFill } from "react-icons/ri";
import { IoMdHome } from "react-icons/io";
import { FaCalendarWeek } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { getSchedule } from "@/service/schedule";
import { Schedule } from "@/types/schedule"; // contoh import service dan tipe
// import { encryptId } from "@/utils/encrypt";

export function Form() {
  const router = useRouter();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selected, setSelected] = useState({
    asal: "",
    tujuan: "",
    jadwal: "",
    kapal: "",
    scheduleId: "",
  });

  // Ambil data schedule dari API saat mount
  useEffect(() => {
    async function fetchSchedules() {
      const res = await getSchedule();

      if (res?.status) {
        setSchedules(res.data);
      }
    }
    fetchSchedules();
  }, []);

  // Fungsi handleChange untuk update selected dan otomatis isi field lain kalau asal dipilih
  const handleChange = (field: keyof typeof selected, value: string) => {
    setSelected((prev) => {
      const newSelected = { ...prev, [field]: value };

      // Jika yang diubah asal, otomatis isi field tujuan, kapal, jadwal
      if (field === "asal") {
        const foundSchedule = schedules.find(
          (sch) => sch.route.departure_harbor.harbor_name === value
        );

        if (foundSchedule) {
          newSelected.tujuan = foundSchedule.route.arrival_harbor.harbor_name;
          newSelected.kapal = foundSchedule.ship.ship_name;
          newSelected.jadwal = new Date(foundSchedule.arrival_datetime)
            .toISOString()
            .split("T")[0];
          newSelected.scheduleId = String(foundSchedule.id); // simpan ID-nya
        } else {
          newSelected.tujuan = "";
          newSelected.kapal = "";
          newSelected.jadwal = "";
          newSelected.scheduleId = ""; // kosongkan jika tidak ada
        }
      }

      return newSelected;
    });
  };

  // Data option dinamis dari schedules, filter unik asal, tujuan, kapal, jadwal
  const asalOptions = Array.from(
    new Set(schedules.map((sch) => sch.route.departure_harbor.harbor_name))
  );

  const tujuanOptions = Array.from(
    new Set(schedules.map((sch) => sch.route.arrival_harbor.harbor_name))
  );

  const kapalOptions = Array.from(
    new Set(schedules.map((sch) => sch.ship.ship_name))
  );

  const jadwalOptions = Array.from(
    new Set(
      schedules.map(
        (sch) => new Date(sch.arrival_datetime).toISOString().split("T")[0]
      )
    )
  );

  const propsExample = [
    {
      title: "Pilih Asal",
      id: "asal",
      options: asalOptions,
      icon: <IoMdHome className="w-5 h-5" />,
      value: selected.asal,
      onChange: (v: string) => handleChange("asal", v),
    },
    {
      title: "Pilih Tujuan",
      id: "tujuan",
      options: tujuanOptions,
      icon: <IoMdHome className="w-5 h-5" />,
      value: selected.tujuan,
      onChange: (v: string) => handleChange("tujuan", v),
    },
    {
      title: "Pilih Jadwal",
      id: "jadwal",
      options: jadwalOptions,
      icon: <FaCalendarWeek className="w-4 h-4" />,
      value: selected.jadwal,
      onChange: (v: string) => handleChange("jadwal", v),
    },
    {
      title: "Pilih Kapal",
      id: "kapal",
      options: kapalOptions,
      icon: <RiShipFill className="w-5 h-5" />,
      value: selected.kapal,
      onChange: (v: string) => handleChange("kapal", v),
    },
  ];
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selected.scheduleId) {
      alert("Silakan pilih jadwal terlebih dahulu.");
      return;
    }
    

    router.push(`/book/${selected.scheduleId}`);
  };

  return (
    <div className="p-6 md:p-8 rounded-lg bg-amber-50 md:w-1/2">
      <form
        onSubmit={handleSubmit}
        action=""
        className="flex flex-col justify-center space-y-2 md:space-y-10"
      >
        <h2 className="text-2xl font-semibold text-Orange text-center">
          Cari Jadwal Kapal
        </h2>
        <div className="grid md:grid-cols-2 md:gap-4">
          {propsExample.map((prop) => (
            <SelectInput
              icon={prop.icon}
              key={prop.id}
              title={prop.title}
              id={prop.id}
              option={prop.options}
              value={prop.value}
              onChange={prop.onChange}
            />
          ))}
        </div>
        <button
          type="submit"
          className="bg-Blue text-white rounded-lg p-2.5 hover:bg-teal-600"
          disabled={!selected.scheduleId}
        >
          Pilih Jadwal
        </button>
      </form>
    </div>
  );
}
