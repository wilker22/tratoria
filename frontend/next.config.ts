import type { NextConfig } from "next";
import { hostname } from "os";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images:{
    remotePatterns : [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
      }
    ]
  }
};

export default nextConfig;
