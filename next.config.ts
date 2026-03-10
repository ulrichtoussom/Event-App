import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images :{
    remotePatterns:[
      {
        protocol : 'https',
        hostname : 'images.unsplash.com',
        port: '',
        pathname: '/**', // Ajoute ceci pour autoriser tous les chemins d'Unsplash
      },
      {
        protocol : 'https',
        hostname:'pzftodjzvusftuarvifx.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      }
    ]
  },
  output : 'standalone' 
  /* config options here */
};

export default nextConfig;
