import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow phones/tablets on the local network to load dev-server assets
  allowedDevOrigins: ["10.0.0.91"],
};

export default nextConfig;
