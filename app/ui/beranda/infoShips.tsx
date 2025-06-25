// app/ui/beranda/infoShips.tsx
"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { poppins } from "@/app/ui/fonts";
import { FaArrowRight } from "react-icons/fa6";
import Link from "next/link";
import { getShips } from "@/service/shipService"; // ✅ Import service
import { Ship } from "@/types/ship"; // ✅ Import type
import DriveImage from "@/app/ui/driveImage"; // ✅ Import DriveImage component
import { Skeleton } from "@/app/ui/skeleton";
import { AlertCircle, Ship as ShipIcon } from "lucide-react";

// ✅ Skeleton component untuk loading state
const ShipCardSkeleton = () => (
  <Card className="relative border-none overflow-hidden shadow-lg h-[550px] md:h-[550px]">
    <Skeleton className="absolute inset-0 rounded-2xl" />
    <div className="absolute top-4 left-4">
      <Skeleton className="w-24 h-6 rounded-full" />
    </div>
    <div className="absolute bottom-4 left-4 right-4">
      <Skeleton className="w-full h-12 rounded-full" />
    </div>
  </Card>
);

// ✅ Error component
const ErrorCard = ({ error }: { error: string }) => (
  <Card className="relative border-none overflow-hidden shadow-lg h-[550px] md:h-[550px] bg-gray-100 flex items-center justify-center">
    <div className="text-center text-gray-500">
      <AlertCircle className="w-12 h-12 mx-auto mb-4" />
      <p className="text-sm">{error}</p>
    </div>
  </Card>
);

// ✅ Ship Card Component
const ShipCard = ({ ship, index }: { ship: Ship; index: number }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <Card
      key={ship.id}
      className="relative border-none overflow-hidden shadow-lg transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl h-[450px] md:h-[550px] flex-shrink-0"
      style={{ 
        marginRight: index < 3 ? '1.5rem' : '0' // Space between cards on mobile
      }}
    >
      {/* ✅ Background Image dengan DriveImage */}
      <div className="absolute inset-0">
        {ship.image_link && !imageError ? (
          <DriveImage
            src={ship.image_link}
            alt={ship.ship_name || "Kapal"}
            fill
            className="rounded-2xl object-cover"
            priority={index < 2} // Prioritize first 2 images
            onError={() => setImageError(true)}
          />
        ) : (
          // ✅ Fallback untuk gambar yang tidak ada
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center">
            <ShipIcon className="w-20 h-20 text-white/80" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/30 rounded-2xl" />
      </div>

      {/* ✅ Ship Status Badge */}
      <div className="absolute top-4 left-4 bg-white border-2 border-Orange px-3 py-1 rounded-full text-sm font-semibold shadow-md">
        {ship.ship_name || "Unknown Ship"}
      </div>


      {/* ✅ Action Button */}
      <CardContent className="absolute bottom-4 left-0 right-0 flex">
        <Link
          href={`/infokapal/${ship.id}`}
          className="w-full font-semibold flex justify-between gap-4 items-center border text-gray-700 border-gray-300 p-3 rounded-lg bg-white/95 backdrop-blur-sm shadow-md text-lg hover:bg-gray-100 transition-colors md:px-5"
        >
          Info Kapal
          <FaArrowRight className="text-Orange" />
        </Link>
      </CardContent>
    </Card>
  );
};

export default function InfoShips() {
  const [ships, setShips] = useState<Ship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Fetch ships data
  useEffect(() => {
    const fetchShips = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Ambil data kapal (first page, limit 8 for display)
        const response = await getShips(1, 8);
        
        if (response && response.status && response.data) {
          // Filter hanya kapal yang aktif untuk tampilan publik
          const activeShips = response.data.filter(ship => 
            ship.status === 'ACTIVE'
          ).slice(0, 4); // Ambil maksimal 4 kapal untuk display
          
          setShips(activeShips);
        } else {
          throw new Error('Gagal memuat data kapal');
        }
      } catch (err) {
        console.error('Error fetching ships:', err);
        setError('Gagal memuat Informasi');
      } finally {
        setLoading(false);
      }
    };

    fetchShips();
  }, []);

  // ✅ Loading state
  if (loading) {
    return (
      <div className={`${poppins.className} w-full md:p-10 m-16`}>
        <div className="flex w-full justify-center items-center gap-6 mb-10">
          <hr className="w-1/2 border-t-2 border-Orange" />
          <h2 className="text-2xl font-bold text-gray-500">Informasi</h2>
          <hr className="w-1/2 border-t-2 border-Orange" />
        </div>

        {/* Desktop Loading */}
        <div className="hidden md:grid grid-cols-4 gap-6 mt-32">
          {Array(4).fill(0).map((_, index) => (
            <ShipCardSkeleton key={`skeleton-${index}`} />
          ))}
        </div>

        {/* Mobile Loading */}
        <div className="md:hidden w-full overflow-x-auto">
          <div className="flex w-full min-w-0 mt-2 px-6">
            {Array(4).fill(0).map((_, index) => (
              <div key={`mobile-skeleton-${index}`} className="w-full flex-shrink-0 mr-6 last:mr-0">
                <ShipCardSkeleton />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ✅ Error state
  if (error) {
    return (
      <div className={`${poppins.className} w-full md:p-10 m-16`}>
        <div className="flex w-full justify-center items-center gap-6 mb-10">
          <hr className="w-1/2 border-t-2 border-Orange" />
          <h2 className="text-2xl font-bold text-gray-500">Informasi</h2>
          <hr className="w-1/2 border-t-2 border-Orange" />
        </div>

        <div className="text-center py-20">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 mb-4">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline"
            className="border-Orange text-Orange hover:bg-Orange hover:text-white"
          >
            Coba Lagi
          </Button>
        </div>
      </div>
    );
  }

  // ✅ Empty state
  if (ships.length === 0) {
    return (
      <div className={`${poppins.className} w-full md:p-10 m-16`}>
        <div className="flex w-full justify-center items-center gap-6 mb-10">
          <hr className="w-1/2 border-t-2 border-Orange" />
          <h2 className="text-2xl font-bold text-gray-500">Informasi</h2>
          <hr className="w-1/2 border-t-2 border-Orange" />
        </div>

        <div className="text-center py-20">
          <ShipIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">Belum ada Informasi tersedia</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${poppins.className} w-full px-4 md:p-10 my-8 md:m-16`}>
      <div className="flex w-full justify-center items-center gap-6 mb-10">
        <hr className="w-1/2 border-t-2 border-Orange" />
        <h2 className="text-xl md:text-2xl font-bold text-gray-500 whitespace-nowrap">Informasi</h2>
        <hr className="w-1/2 border-t-2 border-Orange" />
      </div>

      {/* ✅ Grid untuk Desktop */}
      <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 mt-8 md:mt-32">
        {ships.map((ship, index) => (
          <ShipCard key={ship.id} ship={ship} index={index} />
        ))}
      </div>

      {/* ✅ Fixed Mobile Layout */}
      <div className="block md:hidden w-full mt-8">
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 w-max px-2">
            {ships.map((ship, index) => (
              <div key={ship.id} className="w-80 flex-shrink-0">
                <ShipCard ship={ship} index={index} />
              </div>
            ))}
          </div>
        </div>
        
        {/* Mobile scroll indicator */}
        {ships.length > 1 && (
          <div className="flex justify-center mt-4">
            <p className="text-sm text-gray-500">← Geser untuk melihat lebih banyak →</p>
          </div>
        )}
      </div>
    </div>
  );
}