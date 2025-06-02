// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*", // ini adalah path yang dipanggil dari frontend
        destination:
          "https://tikethebat.ambitiousflower-0b7495d3.southeastasia.azurecontainerapps.io/api/:path*", // path lengkap ke backend
      },
    ];
  },
};

export default nextConfig;
