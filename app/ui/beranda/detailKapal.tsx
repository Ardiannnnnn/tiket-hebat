// app/ui/beranda/detailKapal.tsx
"use client";

import { useState } from "react";
import DriveImage from "@/app/ui/driveImage";
import { Ship } from "@/types/ship";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { poppins } from "@/app/ui/fonts";
import { 
  Ship as ShipIcon, 
  Calendar, 
  Info, 
  Star, 
  ArrowLeft,
  ExternalLink,
  MapPin,
  Users,
  Settings
} from "lucide-react";
import Link from "next/link";

interface DetailKapalProps {
  ship: Ship;
}

export default function DetailKapal({ ship }: DetailKapalProps) {
  const [imageError, setImageError] = useState(false);

  // ✅ Helper function untuk format tahun
  const formatYear = (year: number | string | null) => {
    if (!year) return "Tidak diketahui";
    return `${year}`;
  };

  // ✅ Helper function untuk status badge
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'ACTIVE': { color: 'bg-green-500', text: 'Aktif', icon: '✓' },
      'DOCK': { color: 'bg-orange-500', text: 'Dok', icon: '⚡' },
      'MAINTENANCE': { color: 'bg-red-500', text: 'Maintenance', icon: '🔧' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      color: 'bg-gray-500',
      text: status || 'Unknown',
      icon: '?'
    };

    return (
      <Badge className={`${config.color} text-white px-3 py-1 rounded-full text-sm font-medium`}>
        <span className="mr-1">{config.icon}</span>
        {config.text}
      </Badge>
    );
  };

  return (
    <div className={`${poppins.className} min-h-screen bg-gray-50 py-8`}>
      <div className="container mx-auto px-4 max-w-6xl">
        {/* ✅ Header dengan Back Button */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
           
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                {ship.ship_name || "Informasi Kapal"}
              </h1>
              <p className="text-gray-600">Detail lengkap kapal ferry</p>
            </div>
          </div>
          {ship.status && getStatusBadge(ship.status)}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ✅ Left Column - Image & Gallery */}
          <div className="space-y-6">
            {/* Main Image */}
            <Card className="overflow-hidden py-0 gap-0">
              <div className="relative aspect-[4/3] bg-gray-100">
                {ship.image_link && !imageError ? (
                  <DriveImage
                    src={ship.image_link}
                    alt={ship.ship_name || "Kapal"}
                    fill
                    className="object-cover"
                    priority
                    onError={() => setImageError(true)}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                    <ShipIcon className="w-20 h-20 text-white/80" />
                  </div>
                )}
                
                {/* Image Overlay */}
                <div className="absolute inset-0 bg-black/20"></div>
                
                {/* Image Source Link */}
                {ship.image_link && (
                  <div className="absolute bottom-4 right-4">
                    <a 
                      href={ship.image_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-white/90 hover:bg-white text-gray-700 px-3 py-2 rounded-full text-sm flex items-center gap-2 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Lihat Asli
                    </a>
                  </div>
                )}
              </div>
            </Card>

            {/* ✅ Quick Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="text-center p-4">
                <Calendar className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <p className="text-sm text-gray-600">Tahun Operasi</p>
                <p className="font-bold text-xl">{formatYear(ship.year_operation)}</p>
              </Card>
              <Card className="text-center p-4">
                <Settings className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <p className="text-sm text-gray-600">Jenis Kapal</p>
                <p className="font-bold text-lg">{ship.ship_type || "Ferry"}</p>
              </Card>
            </div>
          </div>

          {/* ✅ Right Column - Ship Information */}
          <div className="space-y-6">
            {/* Basic Info Card */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Info className="w-6 h-6 text-blue-600" />
                  Informasi Kapal
                </h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Nama Kapal</label>
                    <p className="text-lg font-semibold">{ship.ship_name || "Tidak diketahui"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Status</label>
                    <div className="mt-1">
                      {ship.status && getStatusBadge(ship.status)}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Jenis Kapal</label>
                    <p className="text-lg">{ship.ship_type || "Ferry"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Tahun Operasi</label>
                    <p className="text-lg">{formatYear(ship.year_operation)}</p>
                  </div>
                </div>

                {/* ✅ Ship ID (for admin reference) */}
                <div className="pt-4 border-t">
                  <label className="text-sm font-medium text-gray-600">ID Kapal</label>
                  <p className="text-sm text-gray-500 font-mono">#{ship.id}</p>
                </div>
              </CardContent>
            </Card>

            {/* ✅ Description Card */}
            {ship.description && (
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-600" />
                    Deskripsi
                  </h2>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700 leading-relaxed text-justify">
                      {ship.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* ✅ Features/Amenities Card */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  Fasilitas & Layanan
                </h2>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Kapasitas Besar</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">AC & Ventilasi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-sm">Keamanan Terjamin</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm">Pelayanan Ramah</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ✅ Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/jadwal" className="flex-1">
                <Button size="lg" className="w-full bg-Orange hover:bg-orange-600 text-white">
                  <MapPin className="w-5 h-5 mr-2" />
                  Cek Jadwal Kapal
                </Button>
              </Link>
              <Link href="/contact" className="flex-1">
                <Button variant="outline" size="lg" className="w-full">
                  <Info className="w-5 h-5 mr-2" />
                  Hubungi Kami
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* ✅ Additional Information Section */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold text-center">Tentang Layanan Ferry</h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShipIcon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Kapal Modern</h3>
                  <p className="text-sm text-gray-600">
                    Armada kapal yang terawat dengan baik dan teknologi terkini
                  </p>
                </div>
                <div>
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Kapasitas Besar</h3>
                  <p className="text-sm text-gray-600">
                    Dapat mengangkut penumpang dan kendaraan dengan aman
                  </p>
                </div>
                <div>
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-orange-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Pelayanan Terbaik</h3>
                  <p className="text-sm text-gray-600">
                    Crew berpengalaman dan pelayanan yang memuaskan
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}