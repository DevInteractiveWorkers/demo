import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: { proxyClientMaxBodySize: "500mb" },
  allowedDevOrigins: ["10.200.8.140", "10.0.28.190", "10.0.28.56", "10.0.28.*"],
};

export default nextConfig;
