import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  basePath: process.env.NODE_ENV === 'production' ? '/eu_legislation_viewer' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/eu_legislation_viewer' : '',
};

export default nextConfig;
