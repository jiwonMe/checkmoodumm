import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['picsum.photos'], // picsum.photos 도메인의 이미지 허용
  },
};

export default nextConfig;
