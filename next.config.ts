import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "api.dreamknot.co.in",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "api.dreamknot.co.in",
        pathname: "/uploads/**",
      },
    ],
    unoptimized: false,
  },
};

export default nextConfig;
