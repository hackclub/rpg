import type { NextConfig } from "next";
const path = require('path')
const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  webpack(config, options) {
    config.resolve.alias["@/components"] = path.resolve(__dirname, "components");
    return config;
  }
};

export default nextConfig;
