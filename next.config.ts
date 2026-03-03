import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images :{
    remotePatterns:[
      {
        protocol : 'https',
        hostname : 'images.unsplash.com'
      },
      {
        protocol : 'https',
        hostname:'pzftodjzvusftuarvifx.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      }
    ]
  }
  /* config options here */
};

export default nextConfig;
