import type { NextConfig } from "next";
import os from "os";

// Dynamically fetch all local network interface IPs to allow HMR over local connections (Wi-Fi, USB Tethering, etc.)
const getLocalNetworkIPs = () => {
  const interfaces = os.networkInterfaces();
  const ips: string[] = [];
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name] || []) {
      if (net.family === "IPv4") {
        ips.push(net.address);
        ips.push(`${net.address}:3000`);
        ips.push(`${net.address}:3001`); // in case port 3001 is used
      }
    }
  }
  return ips;
};

const nextConfig: NextConfig = {
  serverExternalPackages: ["node-llama-cpp"],
  // Allow hot-reload in development from localhost, localtunnels, and any local network IP
  allowedDevOrigins: [
    "localhost:3000",
    "localhost:3001",
    "*.loca.lt",
    ...getLocalNetworkIPs()
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      }
    ],
  },
} as any;

export default nextConfig;


