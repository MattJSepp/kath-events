import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  //eslint: { ignoreDuringBuilds: true },
  //Beispiel für eine Remote-Pattern-Konfiguration für Bilder
  /*
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example-cdn.com',
        port: '',
        pathname: '/**'
      }
    ]
  }*/
};

export default nextConfig;
