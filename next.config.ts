import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: { proxyClientMaxBodySize: "500mb" },
  allowedDevOrigins: ["10.100.10.31"],
};

export default nextConfig;
