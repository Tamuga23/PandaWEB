import { serializarJsonLd } from "@/lib/seo";

/**
 * Datos estructurados para Google. Un <script> nativo y no next/script: es
 * JSON que se lee, no código que se ejecuta. El armado vive en lib/seo.ts.
 */
export function JsonLd({ datos }: { datos: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializarJsonLd(datos) }}
    />
  );
}
