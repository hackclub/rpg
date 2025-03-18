import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    turbo: {
      resolveAlias: {
        '@/components': './components'
      }
    }
  },
};

export default nextConfig;
