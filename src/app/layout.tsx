import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { CapturaAtribucion } from "@/components/CapturaAtribucion";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { BarraComparar } from "@/components/comparar/BarraComparar";
import { CompararProvider } from "@/components/comparar/CompararProvider";
import { FondoDePagina } from "@/components/comparar/FondoDePagina";
import { ModalComparar } from "@/components/comparar/ModalComparar";
import { ToastComparar } from "@/components/comparar/ToastComparar";
import { SCRIPT_TEMA, TemaProvider } from "@/components/tema/TemaProvider";
import { JsonLd } from "@/components/JsonLd";
import { SITE } from "@/config/site";
import { OPEN_GRAPH_BASE, TITULO_SITIO, tiendaJsonLd } from "@/lib/seo";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Sin esta variable no se carga la etiqueta: en desarrollo no se mandan hits
// que contaminen los datos de la cuenta real.
const ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;

// Sin `alternates.canonical` acá: el layout lo heredan todas las páginas, y
// una que se olvidara de definir el suyo le diría a Google que es la portada.
// Cada página declara su canonical.
export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: TITULO_SITIO,
    template: `%s | ${SITE.nombre}`,
  },
  description: SITE.descripcion,
  applicationName: SITE.nombre,
  // La imagen la pone app/opengraph-image.tsx; las fichas usan la foto del
  // producto.
  openGraph: {
    ...OPEN_GRAPH_BASE,
    title: TITULO_SITIO,
    description: SITE.descripcion,
  },
  // Título, descripción e imagen los completa Next con los de Open Graph.
  twitter: { card: "summary_large_image" },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "ra4mZEYKTUPaAFELjZb4ukFR9Hvqa-AouQ-BPGQ2Tnc",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning: el script de abajo agrega la clase del tema
    // antes de que React hidrate, así que el className del servidor y el del
    // cliente no coinciden a propósito.
    <html lang="es-NI" className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_TEMA }} />
        {/* La tienda (dirección en el Colectivo Dreamy, mapa, redes) en todas
            las páginas: así las ofertas de cada ficha la citan como vendedor. */}
        <JsonLd datos={tiendaJsonLd()} />
      </head>
      <body className="flex min-h-dvh flex-col bg-fondo font-sans text-texto">
        {ADS_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${ADS_ID}`}
              strategy="afterInteractive"
            />
            <Script id="gtag-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];
                function gtag(){dataLayer.push(arguments);}
                gtag('js',new Date());
                gtag('config','${ADS_ID}');`}
            </Script>
          </>
        )}
        <CapturaAtribucion />
        <TemaProvider>
          <CompararProvider>
            <FondoDePagina>
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </FondoDePagina>
            <BarraComparar />
            <ModalComparar />
            <ToastComparar />
          </CompararProvider>
        </TemaProvider>
      </body>
    </html>
  );
}
