import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { SITE } from "@/config/site";

// Vista previa al compartir la portada o el catálogo por WhatsApp, Facebook
// o X. Las fichas no la usan: muestran la foto del producto.
//
// Se genera una vez en el build. Sin "0% de interés": la imagen queda fija y
// esa promesa depende de lo que diga el POS en cada momento.

export const alt = `${SITE.nombre}: tecnología en Managua, Nicaragua`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Los colores de DESIGN.md: el fondo casi negro de todo el sitio y el
// degradado de marca solo en el logotipo, como en el header.
const FONDO = "#09090b";
const TEXTO = "#fafafa";
const SUAVE = "#a1a1aa";
const BORDE = "#27272a";
const MARCA = "linear-gradient(135deg, #10b981, #06b6d4, #0284c7)";

export default async function Image() {
  // `next/og` solo trae Geist: Inter se lee del repo para que la imagen use
  // la misma letra que la web.
  const [bold, regular, logo] = await Promise.all([
    readFile(join(process.cwd(), "src/app/_og/Inter-Bold.ttf")),
    readFile(join(process.cwd(), "src/app/_og/Inter-Regular.ttf")),
    readFile(join(process.cwd(), "public/logo.png"), "base64"),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: FONDO,
          color: TEXTO,
          fontFamily: "Inter",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse no usa next/image */}
          <img src={`data:image/png;base64,${logo}`} alt="" width={96} height={90} />
          <div style={{ display: "flex", fontSize: 52, fontWeight: 700, letterSpacing: -1.5 }}>
            <span>panda</span>
            <span style={{ backgroundImage: MARCA, backgroundClip: "text", color: "transparent" }}>
              store
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* balance: igual que el h1 de la portada, dos líneas parejas en
              vez de "negocio" solo abajo. */}
          <div
            style={{
              fontSize: 76,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: -2.5,
              textWrap: "balance",
            }}
          >
            {SITE.tagline}
          </div>
          <div style={{ fontSize: 34, color: SUAVE }}>
            Proyectores Magcubic · Dashcams 70mai · Smartwatches
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: `1px solid ${BORDE}`,
            paddingTop: 28,
            fontSize: 28,
            color: SUAVE,
          }}
        >
          <span>Cuotas con Banpro · Envíos a todo Nicaragua</span>
          <span style={{ color: TEXTO }}>Managua, Nicaragua</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Inter", data: bold, weight: 700, style: "normal" },
        { name: "Inter", data: regular, weight: 400, style: "normal" },
      ],
    },
  );
}
