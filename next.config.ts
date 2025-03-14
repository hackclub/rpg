import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  experimental: {
    turbo: {
      resolveAlias: {
        '@/components': './components'
      }
    }
  },
};

export default nextConfig;
