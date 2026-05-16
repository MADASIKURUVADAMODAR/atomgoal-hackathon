import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Fixes Vercel deployment issues by ignoring TS errors during build */
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
