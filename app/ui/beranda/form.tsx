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
      setLoading(false);
    }
    fetchSchedules();
  }, []);

  // ✅ Updated handleChange for cascading selection
  const handleChange = (field: keyof typeof selected, value: string) => {
    setSelected((prev) => {
      const newSelected = { ...prev, [field]: value };

      if (field === "asal") {
        // ✅ Reset semua field dependent ketika asal berubah
        newSelected.tujuan = "";
        newSelected.jadwal = "";
        newSelected.kapal = "";
        newSelected.scheduleid = "";
      }

      if (field === "tujuan") {
        // ✅ Reset jadwal dan kapal ketika tujuan berubah
        newSelected.jadwal = "";
        newSelected.kapal = "";
        newSelected.scheduleid = "";
      }

      if (field === "jadwal") {
        // ✅ Reset kapal ketika jadwal berubah
        newSelected.kapal = "";
        newSelected.scheduleid = "";
      }

      if (field === "kapal") {
        // ✅ Set scheduleid ketika kapal dipilih
        const foundSchedule = schedules.find(
          (sch) =>
            sch.departure_harbor.harbor_name === newSelected.asal &&
            sch.arrival_harbor.harbor_name === newSelected.tujuan &&
            getDateTimeString(sch.departure_datetime) === newSelected.jadwal &&
            sch.ship.ship_name === value
        );

        if (foundSchedule) {
          newSelected.scheduleid = String(foundSchedule.id);
        } else {
          newSelected.scheduleid = "";
        }
      }

      return newSelected;
    });
  };

  // Helper untuk mengambil tanggal dan jam dari ISO string
  function getDateTimeString(dateTime: string) {
  try {
    const date = new Date(dateTime);
    
    // ✅ Validasi date object
    if (isNaN(date.getTime())) {
      console.warn(`Invalid date: ${dateTime}`);
      return "Tanggal tidak valid";
    }
    
    // ✅ Array nama hari dalam bahasa Indonesia
    const namaHari = [
      "Minggu", "Senin", "Selasa", "Rabu", 
      "Kamis", "Jumat", "Sabtu"
    ];
    
    // ✅ Array nama bulan dalam bahasa Indonesia
    const namaBulan = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    
    // ✅ Ambil komponen tanggal
    const hari = namaHari[date.getDay()];
    const tanggal = date.getDate();
    const bulan = namaBulan[date.getMonth()];
    const tahun = date.getFullYear();
    
    // ✅ Format jam dengan timezone WIB (UTC+7)
    // Adjust untuk timezone Indonesia jika diperlukan
    const jam = date.getHours().toString().padStart(2, '0');
    const menit = date.getMinutes().toString().padStart(2, '0');
    
    // ✅ Return format: "Senin, 17 Maret 2023 - 16.00 WIB"
    return `${hari}, ${tanggal} ${bulan} ${tahun} - ${jam}.${menit} WIB`;
    
  } catch (error) {
    console.error(`Error formatting date: ${dateTime}`, error);
    return "Format tanggal error";
  }
}

  // ✅ Options berdasarkan cascading selection
  const asalOptions = Array.from(
    new Set(schedules.map((sch) => sch.departure_harbor.harbor_name))
  );

  // ✅ Tujuan hanya berdasarkan asal yang dipilih
  const tujuanOptions = selected.asal
    ? Array.from(
        new Set(
          schedules
            .filter((sch) => sch.departure_harbor.harbor_name === selected.asal)
            .map((sch) => sch.arrival_harbor.harbor_name)
        )
      )
    : [];

  // ✅ Jadwal hanya berdasarkan asal dan tujuan yang dipilih
  const jadwalOptions = selected.asal && selected.tujuan
    ? Array.from(
        new Set(
          schedules
            .filter(
              (sch) =>
                sch.departure_harbor.harbor_name === selected.asal &&
                sch.arrival_harbor.harbor_name === selected.tujuan
            )
            .map((sch) => getDateTimeString(sch.departure_datetime))
        )
      )
    : [];

  // ✅ Kapal hanya berdasarkan asal, tujuan, dan jadwal yang dipilih
  const kapalOptions = selected.asal && selected.tujuan && selected.jadwal
    ? Array.from(
        new Set(
          schedules
            .filter(
              (sch) =>
                sch.departure_harbor.harbor_name === selected.asal &&
                sch.arrival_harbor.harbor_name === selected.tujuan &&
                getDateTimeString(sch.departure_datetime) === selected.jadwal
            )
            .map((sch) => sch.ship.ship_name)
        )
      )
    : [];

  const propsExample = [
    {
      title: "Pilih Asal",
      id: "asal",
      options: asalOptions,
      icon: <IoMdHome className="w-5 h-5" />,
      value: selected.asal,
      onChange: (v: string) => handleChange("asal", v),
      isLoading: loading,
      disabled: false,
      placeholder: "Pilih pelabuhan asal",
    },
    {
      title: "Pilih Tujuan",
      id: "tujuan",
      options: tujuanOptions,
      icon: <IoMdHome className="w-5 h-5" />,
      value: selected.tujuan,
      onChange: (v: string) => handleChange("tujuan", v),
      isLoading: loading,
      disabled: !selected.asal, // ✅ Disabled jika asal belum dipilih
      placeholder: selected.asal ? "Pilih pelabuhan tujuan" : "Pilih asal terlebih dahulu",
    },
    {
      title: "Pilih Jadwal",
      id: "jadwal",
      options: jadwalOptions,
      icon: <FaCalendarWeek className="w-4 h-4" />,
      value: selected.jadwal,
      onChange: (v: string) => handleChange("jadwal", v),
      isLoading: loading,
      disabled: !selected.asal || !selected.tujuan, // ✅ Disabled jika asal/tujuan belum dipilih
      placeholder: 
        !selected.asal ? "Pilih asal terlebih dahulu" :
        !selected.tujuan ? "Pilih tujuan terlebih dahulu" :
        "Pilih jadwal keberangkatan",
    },
    {
      title: "Pilih Kapal",
      id: "kapal",
      options: kapalOptions,
      icon: <RiShipFill className="w-5 h-5" />,
      value: selected.kapal,
      onChange: (v: string) => handleChange("kapal", v),
      isLoading: loading,
      disabled: !selected.asal || !selected.tujuan || !selected.jadwal, // ✅ Disabled jika prerequisite belum lengkap
      placeholder: 
        !selected.asal ? "Pilih asal terlebih dahulu" :
        !selected.tujuan ? "Pilih tujuan terlebih dahulu" :
        !selected.jadwal ? "Pilih jadwal terlebih dahulu" :
        "Pilih kapal",
    },
  ];

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // ✅ Enhanced validation
    if (!selected.asal) {
      toast.error("Silakan pilih pelabuhan asal terlebih dahulu.");
      return;
    } 

    if (!selected.tujuan) {
      toast.error("Silakan pilih pelabuhan tujuan.");
      return;
    }

    if (!selected.jadwal) {
      toast.error("Silakan pilih jadwal keberangkatan.");
      return;
    }

    if (!selected.kapal) {
      toast.error("Silakan pilih kapal.");
      return;
    }

    // ✅ Find exact schedule match
    const selectedSchedule = schedules.find(
      (sch) =>
        sch.departure_harbor.harbor_name === selected.asal &&
        sch.arrival_harbor.harbor_name === selected.tujuan &&
        getDateTimeString(sch.departure_datetime) === selected.jadwal &&
        sch.ship.ship_name === selected.kapal
    );

    if (!selectedSchedule) {
      toast.error("Jadwal yang dipilih tidak ditemukan. Silakan coba lagi.");
      return;
    }

    console.log("🚢 Selected schedule:", selectedSchedule);
    router.push(`/book/${selectedSchedule.id}`);
  };

  return (
    <div className="p-6 md:p-8 rounded-lg bg-amber-50 xl:w-1/2">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-center space-y-2 xl:space-y-10"
      >
        <h2 className="text-2xl font-semibold text-Orange text-center">
          Cari Jadwal Kapal
        </h2>
        <div className="grid xl:grid-cols-2 xl:gap-4">
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
              disabled={prop.disabled}
              placeholder={prop.placeholder}
            />
          ))}
        </div>

        {/* ✅ Enhanced submit button with validation info */}
        <button
          type="submit"
          disabled={!selected.asal || !selected.tujuan || !selected.jadwal || !selected.kapal}
          className={`rounded-lg p-2.5 transition-colors ${
            selected.asal && selected.tujuan && selected.jadwal && selected.kapal
              ? "bg-Blue text-white hover:bg-teal-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {!selected.asal ? "Pilih Pelabuhan Asal" :
           !selected.tujuan ? "Pilih Pelabuhan Tujuan" :
           !selected.jadwal ? "Pilih Jadwal" :
           !selected.kapal ? "Pilih Kapal" :
           "Pilih Jadwal"}
        </button>
      </form>
    </div>
  );
}
