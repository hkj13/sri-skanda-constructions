import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Old page addresses that named one city, kept working.
  async redirects() {
    return [
      { source: "/services/house-construction-pondicherry", destination: "/services/house-construction", permanent: true },
      { source: "/services/commercial-construction-pondicherry", destination: "/services/commercial-construction", permanent: true },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [60, 75],
  },
};

export default nextConfig;
