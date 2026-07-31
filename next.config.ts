import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Hosts permitidos para imágenes de producto.
    // Hoy las fotos viven en Imgur (URLs cargadas en el catálogo maestro del POS).
    // Cloudinary y Firebase Storage quedan listos para la migración futura.
    remotePatterns: [
      { protocol: "https", hostname: "i.imgur.com" },
      { protocol: "https", hostname: "imgur.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      { protocol: "https", hostname: "*.firebasestorage.app" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
    formats: ["image/webp"],
  },
};

export default nextConfig;
