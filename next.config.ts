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

  // Headers de seguridad en todas las respuestas. Vercel ya pone HSTS; estos
  // son los que faltaban y no rompen nada de lo que usa la web (Google Ads,
  // el mapa y los videos de YouTube embebidos).
  //
  // Sin una Content-Security-Policy completa a propósito: el script del tema,
  // el de Google Ads y los de Next son inline, y una CSP estricta exige nonces
  // por pedido, que vuelven dinámicas las páginas y anulan el caché (ISR).
  // Solo va `frame-ancestors`, que no toca los scripts.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // El navegador no adivina el tipo de un archivo distinto al declarado.
          { key: "X-Content-Type-Options", value: "nosniff" },
          // A otros sitios solo les llega el dominio, no la ruta ni la búsqueda.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Ningún otro sitio puede mostrar la tienda dentro de un iframe
          // (clickjacking). La primera es para navegadores viejos.
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
          // Permisos que la web no usa nunca: nadie puede pedirlos desde acá.
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
