// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: "https://api.tikethebat.live/api/v1/:path*",
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
      },
      {
        protocol: 'https',
        hostname: '16qwbq9b-8080.asse.devtunnels.ms',
        pathname: '/**',
      }
    ],
  },
    compiler: {
    removeConsole: process.env.NODE_ENV === "production"
  },
};

export default nextConfig;