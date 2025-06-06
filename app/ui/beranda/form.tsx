"use client";

import React, { useEffect, useState } from "react";
import SelectInput from "./selectInput";
import { RiShipFill } from "react-icons/ri";
import { IoMdHome } from "react-icons/io";
import { FaCalendarWeek } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { getSchedule } from "@/service/schedule";
import { Schedule } from "@/types/schedule";
import { toast } from "sonner";

export function Form() {
  const router = useRouter();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState({
    asal: "",
    tujuan: "",
    jadwal: "",
    kapal: "",
    scheduleid: "",
  });

  useEffect(() => {
    async function fetchSchedules() {
      setLoading(true);
      const res = await getSchedule();

      if (res?.status) {
        setSchedules(res.data);
      }
      // Tambahkan delay 1 detik agar loading terlihat
      // await new Promise(resolve => setTimeout(resolve, 5000));
      setLoading(false);
    }
    fetchSchedules();
  }, []);

  const handleChange = (field: keyof typeof selected, value: string) => {
    setSelected((prev) => {
      const newSelected = { ...prev, [field]: value };

      if (field === "asal") {
        const foundSchedule = schedules.find(
          (sch) => sch.route.departure_harbor.harbor_name === value
        );

        if (foundSchedule) {
          newSelected.tujuan = foundSchedule.route.arrival_harbor.harbor_name;
          newSelected.kapal = foundSchedule.ship.ship_name;
          newSelected.jadwal = getDateTimeString(foundSchedule.arrival_datetime);
          newSelected.scheduleid = String(foundSchedule.id);
        } else {
          newSelected.tujuan = "";
          newSelected.kapal = "";
          newSelected.jadwal = "";
          newSelected.scheduleid = "";
        }
      }

      // Tambahan: jika field jadwal diubah, update kapal otomatis
      if (field === "jadwal") {
        const foundSchedule = schedules.find(
          (sch) =>
            getDateTimeString(sch.departure_datetime) === value &&
            sch.route.departure_harbor.harbor_name === prev.asal &&
            sch.route.arrival_harbor.harbor_name === prev.tujuan
        );
        if (foundSchedule) {
          newSelected.kapal = foundSchedule.ship.ship_name;
          newSelected.scheduleid = String(foundSchedule.id);
        } else {
          newSelected.kapal = "";
          newSelected.scheduleid = "";
        }
      }

      return newSelected;
    });
  };

  // Helper untuk mengambil tanggal dan jam dari ISO string
  function getDateTimeString(dateTime: string) {
    const date = new Date(dateTime);
    const tanggal = date.toISOString().split("T")[0];
    const jam = date.toTimeString().slice(0, 5); // "HH:MM"
    return `${tanggal} ${jam}`;
  }

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
        (sch) => getDateTimeString(sch.departure_datetime)
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
      isLoading: loading,
    },
    {
      title: "Pilih Tujuan",
      id: "tujuan",
      options: tujuanOptions,
      icon: <IoMdHome className="w-5 h-5" />,
      value: selected.tujuan,
      onChange: (v: string) => handleChange("tujuan", v),
      isLoading: loading,
    },
    {
      title: "Pilih Jadwal",
      id: "jadwal",
      options: jadwalOptions,
      icon: <FaCalendarWeek className="w-4 h-4" />,
      value: selected.jadwal,
      onChange: (v: string) => handleChange("jadwal", v),
      isLoading: loading,
    },
    {
      title: "Pilih Kapal",
      id: "kapal",
      options: kapalOptions,
      icon: <RiShipFill className="w-5 h-5" />,
      value: selected.kapal,
      onChange: (v: string) => handleChange("kapal", v),
      isLoading: loading,
    },
  ];

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validasi semua field wajib
    if (
      !selected.asal ||
      !selected.tujuan ||
      !selected.jadwal ||
      !selected.kapal
    ) {
      toast("Silakan memilih jadwal sebelum melanjutkan.");
      return;
    }

    const selectedSchedule = schedules.find(
      (sch) =>
        sch.route.departure_harbor.harbor_name === selected.asal &&
        sch.route.arrival_harbor.harbor_name === selected.tujuan &&
        getDateTimeString(sch.departure_datetime) === selected.jadwal &&
        sch.ship.ship_name === selected.kapal
    );

    if (!selectedSchedule) {
      toast("Jadwal yang dipilih tidak ditemukan. Pastikan data sudah benar.");
      return;
    }

    router.push(`/book/${selectedSchedule.id}`);
  };

  return (
    <div className="p-6 md:p-8 rounded-lg bg-amber-50 md:w-1/2">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-center space-y-2 md:space-y-10"
      >
        <h2 className="text-2xl font-semibold text-Orange text-center">
          Cari Jadwal Kapal
        </h2>
        <div className="grid md:grid-cols-2 md:gap-4">
          {propsExample.map((prop) => (
            <SelectInput
              key={prop.id}
              icon={prop.icon}
              title={prop.title}
              id={prop.id}
              option={prop.options}
              value={prop.value}
              onChange={prop.onChange}
              isLoading={prop.isLoading}
            />
          ))}
        </div>
        <button
          type="submit"
          className="bg-Blue text-white rounded-lg p-2.5 hover:bg-teal-600"
        >
          Pilih Jadwal
        </button>
      </form>
    </div>
  );
}
