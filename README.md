# PandaWEB

Catálogo virtual público de **Panda Store**. Tercer consumidor del mismo espejo
de Firestore que ya alimenta al POS y a PandaLink.

- **POS** (`PandaFactoryPOS`) → fuente de verdad, donde Carlos edita productos
- **PandaLink** → asistente de venta en la tablet de la tienda
- **PandaWEB** (este repo) → cara pública para el cliente final

Ver `PLAN.md` para el plan completo, las decisiones tomadas y los riesgos.

---

## Arrancar

```bash
npm install
npm run dev          # http://localhost:3000
```

No hace falta configurar nada: la config de Firebase tiene valores por defecto
en `src/config/firebase.ts`. Si querés cambiar algo, copiá `.env.example` como
`.env.local`.

```bash
npm run build        # build de producción
npm run typecheck    # solo tipos
npm test             # 36 pruebas de la lógica de datos
npm run lint
```

---

## Cómo llegan los datos

```
products (POS, con cost)
   │  scripts/backfill_catalogo_publico.mjs   ← se corre en el repo del POS
   ▼
catalogo_publico (sin cost)  ──lee──►  PandaWEB (servidor)  ──HTML──►  cliente
```

La lectura ocurre **en el servidor de Next**, por REST, no con el SDK de
Firebase. Eso significa: nada de Firebase en el navegador, páginas indexables, y
vista previa con foto al compartir un producto por WhatsApp.

Cada página se regenera cada 15 minutos (`revalidate = 900`), así que mil
visitas no son mil lecturas de Firestore.

**El espejo se actualiza solo cuando se corre el backfill** (el plan Spark no
permite Cloud Functions). Hasta que quede automatizado, después de cambiar
precios o stock hay que correr, en el repo del POS:

```bash
npm run backfill
```

### Dos modos de acceso

`CATALOG_ACCESS` en `.env.local`:

| Valor | Qué hace | Cuándo |
|---|---|---|
| `anon` | pide un token anónimo antes de leer | **ahora** (las reglas exigen sesión) |
| `public` | lee sin token | tras abrir las reglas en la Fase 0 |

---

## Sistema de diseño

Los componentes **no usan colores sueltos** (`zinc-900`, `slate-50`). Usan tokens
semánticos definidos en `src/app/globals.css`:

| Token | Para qué |
|---|---|
| `bg-fondo` | fondo de página |
| `bg-superficie` / `bg-superficie2` | tarjetas y superficies hundidas |
| `border-borde` / `border-borde2` | bordes normales y marcados |
| `text-texto` / `text-suave` / `text-tenue` | jerarquía de texto |
| `text-acento` | acción, enlaces |
| `text-precio` / `text-agotado` / `text-promo` | semánticos |
| `bg-marca` / `text-marca` | degradado de marca (emerald → cyan → sky) |

Cambiar de tema intercambia el valor de esas variables. Nada de pares `dark:`
por elemento: el boceto de AI Studio lo hizo así y necesitó dos scripts de
parcheo para mantenerlo.

**Tema:** clase `dark` o `light` en `<html>`, puesta por un script inline que
corre antes del primer pintado (`SCRIPT_TEMA` en `components/tema/TemaProvider.tsx`)
para que no haya destello. La preferencia se guarda en `localStorage`
(`pandaweb-tema`). El oscuro es el predeterminado.

**Badge de oferta:** se enciende solo cuando el producto tiene un precio de
lista mayor al vigente, o sea cuando hay un `precioPromo` cargado en el POS.
No hay ningún booleano que mantener a mano, y el porcentaje que se muestra es
el real.

## Estructura

```
src/
  config/
    site.ts             textos, WhatsApp, cuotas, categorías  ← editar acá
    firebase.ts         proyecto Firebase y modo de acceso
  lib/
    firestore-decode.ts formato REST de Firestore → JS plano
    firestore-rest.ts   auth anónima + lectura de colecciones
    normalize.ts        documento crudo → Producto público
    catalog.ts          lo que consumen las páginas
    format.ts           córdobas, cuotas, enlaces de WhatsApp
    types.ts            tipos públicos (sin cost, sin efectivo)
  components/
    tema/               provider, script anti-parpadeo, botón
    comparar/           selección, barra flotante, modal comparativo
  app/
    page.tsx            portada
    catalogo/           grid con filtros y buscador
    producto/[id]/      ficha
tests/                  pruebas de la lógica de datos
```

**Todo el texto comercial vive en `src/config/site.ts`.** Número de WhatsApp,
plazos de financiamiento, dirección, categorías: un solo lugar.

---

## Dos reglas que no se rompen

1. **`cost` nunca sale del POS.** No está en el espejo y no debe estar nunca.
2. **`precio.efectivo` no se publica.** El descuento por pago en efectivo es la
   carta del asesor para cerrar por WhatsApp. `src/lib/normalize.ts` lo descarta
   antes de que llegue a cualquier componente, y hay pruebas que lo verifican.

---

## Antes de hacerla pública

Esto **no** está hecho todavía y es bloqueante:

- [ ] **Cerrar `products` y `sales`.** Hoy cualquier sesión anónima puede leer
      los costos y todas las ventas. Publicar la web amplifica esa exposición.
- [ ] **Rotar la llave de service account** que está en la raíz del repo del POS.
- [ ] Abrir lectura pública de `catalogo_publico` y pasar `CATALOG_ACCESS=public`.
- [ ] Poner `EN_CONSTRUCCION = false` en `src/app/robots.ts` **y** `index: true`
      en `src/app/layout.tsx`. Las dos cosas, o Google recibe señales opuestas.
- [ ] Cargar fotos: hoy los productos sin imagen muestran un marcador "Sin foto".
- [ ] Logo real de Panda Store (el PNG que existe es de PandaLink).
- [ ] `NEXT_PUBLIC_SITE_URL` con el dominio definitivo.

---

## Deuda técnica conocida

- **Imágenes en Imgur.** Sus términos prohíben el uso comercial y el hotlinking;
  puede bloquear o borrar. `ProductImage` ya cae en un marcador si falla. Migrar
  a Cloudinary es reemplazar strings de URL en el POS.
- **Backfill manual.** Con plan Blaze se despliega `onProductWritten` (ya escrita
  en el POS) y el espejo se sincroniza al instante.
- **Slugs de categoría duplicados.** PandaWEB canoniza las seis categorías a
  español; PandaLink todavía traduce a inglés y deja `dashcam` sin mapear.
  Conviene unificarlo allá también.
- Quedaron los SVG de la plantilla de Next en `public/`. Se pueden borrar.
