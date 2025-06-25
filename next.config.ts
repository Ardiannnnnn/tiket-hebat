// filepath: c:\Users\LENOVO\Documents\semester 7\TA\tiket-hebat\next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*", // tetap
        destination:
          "https://tikethebat.gentleglacier-f20ff377.southeastasia.azurecontainerapps.io/api/:path*", // TANPA /api/v1
      },
    ];
  },
  images: {
    domains: ["tripay.co.id"], 
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'drive.google.com',
        pathname: '/uc/**',
      }, // Tambahkan domain eksternal di sini
    ],
  },
};

export default nextConfig;