"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { poppins } from "@/app/ui/fonts";
import { FaArrowRight } from "react-icons/fa6";

const items = [
  { id: 1, title: "Aceh Hebat 1", image: "/image/aceh-hebat-1.jpeg" },
  { id: 2, title: "Teluk Sinabang", image: "/image/teluk-sinabang.jpg" },
  { id: 3, title: "Teluk Singkil", image: "/image/teluk-singkil.jpg" },
  { id: 4, title: "Aceh Hebat 3", image: "/image/aceh-hebat-3.jpg" },
];

export default function InfoShips() {
  return (
    <div className={`${poppins.className} w-full md:p-10 m-16 `}>
      <div className="flex w-full justify-center items-center gap-6 mb-10">
        <hr className="w-1/2 border-t-2 border-Orange" />
        <h2 className="text-2xl font-bold text-gray-500">Informasi</h2>
        <hr className="w-1/2 border-t-2 border-Orange" />
      </div>

      {/* Grid untuk Desktop */}
      <div className="hidden md:grid grid-cols-4 gap-6 mt-32">
        {items.map((item) => (
          <Card
            key={item.id}
            className="relative border-none overflow-hidden shadow-lg rounded-2xl transition-transform duration-300 hover:scale-105 h-[550px]"
          >
            {/* Gambar sebagai Background */}
            <div className="inset-0">
              <Image
                src={item.image}
                alt={item.title}
                layout="fill"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className="rounded-2xl"
                style={{ objectFit: "cover" }}
              />
              <div className="absolute inset-0 bg-black/30 rounded-2xl" />
            </div>

            {/* Label Judul */}
            <div className="absolute top-4 left-4 bg-white border-3 border-Orange px-3 py-1 rounded-full text-sm font-semibold shadow-md">
              {item.title}
            </div>

            {/* Konten Card */}
            <CardContent className="absolute bottom-4 w-full flex">
              <Button
                variant="outline"
                className="w-full font-semibold flex gap-22 items-center border text-gray-700 border-gray-300 p-6 rounded-full bg-white shadow-md text-lg"
              >
                Info Kapal
                <FaArrowRight className="ml-10 text-Orange"/>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Grid untuk Mobile */}
      <div className="md:hidden w-full overflow-x-auto ">
        <div className="flex w-full min-w-0 mt-2 px-6">
          {items.map((item, index) => (
            <Card
              key={item.id}
              className="relative border-none overflow-hidden shadow-lg rounded-2xl transition-transform duration-300 hover:scale-105 w-[80vw] max-w-[350px] h-[450px] flex-shrink-0 space-x-6"
            >
              {/* Gambar sebagai Background */}
              <div className="absolute inset-0">
                <Image
                  src={item.image}
                  alt={item.title}
                  layout="fill"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="rounded-2xl"
                  style={{ objectFit: "cover" }}
                />
                <div className="absolute inset-0 bg-black/30 rounded-2xl" />
              </div>

              {/* Label Judul */}
              <div className="absolute top-4 left-4 bg-white border border-orange-500 text-orange-600 px-3 py-1 rounded-full text-sm font-semibold shadow-md">
                {item.title}
              </div>

              {/* Konten Card */}
              <CardContent className="absolute right-3 w-full bottom-4 flex justify-center">
                <Button
                  variant="outline"
                  className="w-full max-w-[200px] font-semibold flex justify-between items-center border border-gray-300 rounded-full bg-white shadow-md px-4"
                >
                  Info Kapal
                  <FaArrowRight />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
