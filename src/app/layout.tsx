import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { BarraComparar } from "@/components/comparar/BarraComparar";
import { CompararProvider } from "@/components/comparar/CompararProvider";
import { ModalComparar } from "@/components/comparar/ModalComparar";
import { SCRIPT_TEMA, TemaProvider } from "@/components/tema/TemaProvider";
import { SITE } from "@/config/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Sin esta variable no se carga la etiqueta: en desarrollo no se mandan hits
// que contaminen los datos de la cuenta real.
const ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.nombre} — ${SITE.tagline}`,
    template: `%s | ${SITE.nombre}`,
  },
  description: SITE.descripcion,
  openGraph: {
    type: "website",
    locale: "es_NI",
    siteName: SITE.nombre,
    title: `${SITE.nombre} — ${SITE.tagline}`,
    description: SITE.descripcion,
  },
  robots: {
    // La web todavía no es pública. Al lanzar, cambiar a index: true
    // Y a la vez EN_CONSTRUCCION = false en src/app/robots.ts
    index: false,
    follow: false,
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
        <TemaProvider>
          <CompararProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <BarraComparar />
            <ModalComparar />
          </CompararProvider>
        </TemaProvider>
      </body>
    </html>
  );
}
