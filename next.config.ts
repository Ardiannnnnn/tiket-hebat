// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*", // tetap
        destination:
          "https://tikethebat.gentlemeadow-35df1a19.southeastasia.azurecontainerapps.io/api/:path*", // TANPA /api/v1
      },
    ];
  },
};

export default nextConfig;
