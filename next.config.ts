import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimizaciones de compilación de TypeScript
  typescript: {
    // Ignorar errores de TypeScript durante build (solo para desarrollo más rápido)
    // En producción, deberías corregir los errores
    ignoreBuildErrors: false,
  },
  
  // Optimizaciones de ESLint
  eslint: {
    // Ignorar errores de ESLint durante build (solo para desarrollo más rápido)
    // En producción, deberías corregir los errores
    ignoreDuringBuilds: true,
  },
  
  // Optimizaciones de imágenes
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'deploy-pos-nestjs.onrender.com'
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com'
      },
      {
        protocol: 'http',
        hostname: 'res.cloudinary.com'
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com'
      },
      {
        protocol: 'http',
        hostname: 'localhost'
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1'
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com'
      }
    ],
    // Optimizaciones de carga de imágenes
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Optimizaciones experimentales
  experimental: {
    // Optimizar imports
    optimizePackageImports: [
      '@tanstack/react-query',
      'react-hook-form',
      'date-fns',
      'zustand',
      'framer-motion',
      '@tiptap/react',
    ],
  },
  
  // Compresión
  compress: true,
  
  // Headers de caché para mejor rendimiento
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|png|webp|avif)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // PWA: service worker no debe cachearse para detectar actualizaciones
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
