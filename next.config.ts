import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.hdnux.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.staticflickr.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'awsimages.detik.net.id',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.cnbcfm.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'statik.tempo.co',
        port: '',
        pathname: '/**',
      },
    ],
    // Tambahkan unoptimized untuk development
    unoptimized: process.env.NODE_ENV === 'development',
  },
};

export default nextConfig;
