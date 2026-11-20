---
name: Panda Store
description: Catálogo virtual de tecnología para el hogar y el negocio, en Managua, Nicaragua
colors:
  fondo: "#090c11"
  superficie: "#111822"
  superficie2: "#1a2330"
  borde: "#1f2a37"
  borde2: "#334155"
  texto: "#fafafa"
  suave: "#a3adba"
  tenue: "#8a94a3"
  acento: "#22d3ee"
  precio: "#34d399"
  precio-sello: "#34d399"
  agotado: "#fb7185"
  promo: "#fbbf24"
  marca-inicio: "#10b981"
  marca-medio: "#06b6d4"
  marca-fin: "#0284c7"
  marca-texto-inicio: "#34d399"
  marca-texto-medio: "#22d3ee"
  marca-texto-fin: "#38bdf8"
  seleccion: "#0e7490"
  bandeja: "#ffffff"
typography:
  display:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 1.6rem + 4.2vw, 4.5rem)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.045em"
  titular:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 1.6rem + 2.6vw, 3.5rem)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.04em"
  seccion:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "clamp(1.625rem, 1.25rem + 1.5vw, 2.25rem)"
    fontWeight: 800
    lineHeight: 1.08
    letterSpacing: "-0.03em"
  cifra:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "clamp(2rem, 1.5rem + 2vw, 3rem)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.035em"
  eyebrow:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.22em"
  title:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "0.05em"
  micro:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.625rem"
    fontWeight: 900
    lineHeight: 1.2
    letterSpacing: "0.1em"
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  full: "9999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "40px"
components:
  button-primary:
    backgroundColor: "{colors.marca-inicio}"
    textColor: "#ffffff"
    rounded: "{rounded.full}"
    padding: "12px 20px"
  button-primary-hover:
    backgroundColor: "{colors.marca-medio}"
    textColor: "#ffffff"
    rounded: "{rounded.full}"
    padding: "12px 20px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.texto}"
    rounded: "{rounded.full}"
    padding: "12px 20px"
  card:
    backgroundColor: "{colors.superficie}"
    textColor: "{colors.texto}"
    rounded: "{rounded.lg}"
    padding: "16px"
  badge-oferta:
    backgroundColor: "{colors.marca-inicio}"
    textColor: "#ffffff"
    rounded: "{rounded.sm}"
    padding: "4px 10px"
---

# Design System: Panda Store

## Overview

**Creative North Star: "El Mostrador Digital"**

PandaWEB es el mostrador real de la tienda, llevado a la pantalla. No es una vitrina fría de e-commerce: es un catálogo oscuro (negro azulado, como las piezas de redes de la tienda), cálido y directo donde el panda hace de vendedor de confianza — te muestra el producto, la cuota exacta, y te pasa a un humano por WhatsApp antes de que la fricción tenga tiempo de aparecer. La energía visual viene del degradado de marca (esmeralda → cian → azul cielo), reservado casi exclusivamente para lo que se puede tocar: botones, píldoras activas, ofertas. El resto de la interfaz es deliberadamente calmo — lienzo negro azulado, superficies azuladas apenas más claras, bordes finos — para que ese degradado nunca compita consigo mismo.

El tono es enérgico y cálido, no corporativo ni frío: tipografía Inter sin serifs, texto siempre en español (con voseo y frases cortas con punto final, como en las piezas), botones redondeados por completo (nunca esquinas duras), y transiciones suaves en cada estado interactivo. Nada de sombras dramáticas ni gradientes de fondo decorativos — con una sola excepción con nombre, el **Escenario de producto** (ver Elevation) — la calidez viene de la redondez, la tibieza del color de superficie, y la promesa concreta en cada CTA ("Lo quiero", "Consultar mi caso"), no de efectos visuales.

**Identidad de marca (nov-2026, rama `identidad-marca`, `docs/plan-identidad-marca.md`):** la estética de las piezas de Instagram y Facebook de Panda Store se llevó a la web: el lienzo azulado, el titular de dos líneas con el remate en degradado, el eyebrow en mayúsculas espaciadas, el escenario (brillo + dial) detrás del producto protagonista, la ficha con estructura de afiche, el panda sin baldosa y la firma de WhatsApp. No se traduce lo que es propio del feed: paginación de carrusel, texto metido en imágenes, precios o vigencias escritos a mano (la web los lee del POS), tipografía condensada de lanzamientos, el escenario en cada tarjeta, fondos con grilla en todo el sitio.

**Key Characteristics:**
- Tema oscuro por defecto (negro azulado `#090c11`, nunca negro neutro ni puro), con un tema claro paralelo que solo invierte los mismos tokens.
- Un único degradado de marca (esmeralda→cian→azul), usado con moderación en superficies de acción, y en texto solo en el remate de un titular (Regla del Remate).
- Titulares en Inter 800, apretados y grandes, como los afiches: display / titular / sección / cifra, más el eyebrow.
- Radios generosos y consistentes: pastillas completas para todo lo accionable, esquinas redondeadas grandes para contenedores.
- Separación por borde y color de superficie, no por sombra — las tarjetas son planas en reposo. La única profundidad que no depende de un estado es la del escenario de producto, y es ambiental y decorativa (`aria-hidden`).
- Los tres colores semánticos (precio, agotado, promo) nunca decoran: solo aparecen cuando dicen algo real sobre el producto.

## Colors

Paleta acotada y semántica: cada color dice algo funcional, ninguno es decorativo puro. Nombrado técnico y directo — sin metáforas, para que se pueda escanear rápido junto al código.

### Primary
- **Acento Cian** (`#22d3ee` oscuro / `#0e7490` claro, cyan-700): color de acción y de enlace. Anillo de foco (`:focus-visible`), hover de tarjetas (`border-acento/50`), títulos de producto al pasar el mouse. **Actualizado (nov-2026):** en claro era `#0891b2` (cyan-600), que daba 3.5:1 sobre `--fondo` y fallaba AA como texto chico; cyan-700 da 5.1:1.

### Secondary
- **Verde Precio** (`#34d399` oscuro / `#047857` claro, emerald-700): el color más importante del sitio después del acento — todo precio, el fondo del sello "0% interés" de la ficha, y el fondo tintado (`bg-precio/5`) del bloque de financiamiento y del recuadro de cuotas. Siempre plano, nunca en degradado. Desde la identidad de marca también pinta los checks que dicen algo concreto de la compra (fila de garantías, "Por qué te sirve") y el borde, el tinte y el punto de la pastilla de estado del hero ("● Entrega inmediata en Managua"), el mismo patrón que "Disponible"; el texto de esas pastillas va en Verde Sello (abajo). El eyebrow del financiamiento de la portada no es verde (`text-tenue`): el verde queda para precios y para el 0%. En claro era `#059669` (3.6:1, falla AA en texto chico); emerald-700 da 5.2:1.
- **Verde Sello** (`--precio-sello`, `text-precio-sello`: en oscuro es `var(--precio)`, en claro `#065f46`, emerald-800). **Agregado (nov-2026):** el texto verde que va sobre un tinte verde — la pastilla de estado del hero, "Disponible", el "0%" de la tarjeta y los números de los pasos del financiamiento. En claro, emerald-700 sobre su propio tinte quedaba al límite o debajo de AA (4.57:1 en "Disponible", 4.43:1 en el 0% de la tarjeta, 3.99:1 en los pasos); emerald-800 da 6.4, 6.2 y 5.6:1. En oscuro el mismo verde ya pasa AA, por eso el token apunta a `--precio`. No es un segundo verde para cifras: los precios siguen en `text-precio`.

### Tertiary
- **Ámbar Promo** (`#fbbf24` oscuro / `#b45309` claro, amber-700): reservado para campañas activas (`producto.campania`), nunca para precio ni para CTA. En claro era `#d97706` (3.2:1); amber-700 da 4.8:1 sobre `--fondo` y 5.0:1 sobre `--superficie`.
- **Rosa Agotado** (`#fb7185` oscuro / `#e11d48` claro): único uso — el estado "Agotado" y su badge. No se reutiliza para errores genéricos ni para otra cosa.

### Neutral
**Actualizado (nov-2026): escala azulada.** Mismos nombres de token, otros valores: la escala zinc (`#09090b`, `#18181b`, `#27272a`, `#3f3f46`) al lado de los afiches de redes se veía gris. Los valores de oscuro salen de las piezas (`docs/plan-identidad-marca.md`); el tema claro sigue en slate, que ya era frío.
- **Fondo** (`#090c11` oscuro / `#f8fafc` claro): el lienzo de toda la app. Negro azulado, nunca negro neutro ni puro. También es el `theme-color` oscuro (`layout.tsx`) y el fondo de la imagen OG.
- **Superficie** (`#111822` / `#ffffff`): tarjetas, inputs, contenedores elevados un paso sobre el fondo.
- **Superficie 2** (`#1a2330` / `#f1f5f9`): un paso más arriba — hover de superficie, chips inactivos, sin foto.
- **Borde** (`#1f2a37` / `#e2e8f0`) / **Borde 2** (`#334155` / `#cbd5e1`): separación de tarjetas (borde) y contornos más marcados como botones secundarios (borde2).
- **Texto** (`#fafafa` / `#0f172a`), **Suave** (`#a3adba` / `#5b6779`), **Tenue** (`#8a94a3` / `#5b6779`): jerarquía de tres niveles — título/cuerpo, texto secundario, metadatos y placeholders. Grises fríos para no verse sucios sobre el azul: en oscuro Suave mide 7.9:1 sobre `--superficie` y Tenue 5.8:1 (6.4:1 sobre `--fondo` y 5.2:1 sobre `--superficie2`; con los zinc anteriores, Tenue sobre Superficie 2 daba 4.13:1). **Actualizado (nov-2026): en claro, Suave y Tenue comparten `#5b6779`**, un poco más oscuro que slate-500: `#64748b` daba 4.34:1 sobre `--superficie2` (el contador de las categorías, el chip "Comparar" cuando tenía relleno) y no llegaba a AA en texto chico; `#5b6779` da 5.24:1 sobre `--superficie2`, 5.48:1 sobre `--fondo` y 5.1:1 sobre la caja teñida de cuotas. En claro no hay margen para un tercer nivel más claro que siga pasando AA (slate-400 daba ~2.56:1), así que ahí Suave y Tenue son el mismo tono.
- **Bandeja de foto** (`--bandeja` #fff con `--velo-foto` encima: `rgb(9 12 17 / .14)` ≈ #dcddde en oscuro, ≈ #f6f6f7 en claro): la superficie de toda foto de producto. Es la única excepción a "solo tokens" (el blanco de estudio de las fotos) y vive en un token. Ver "Foto de producto".
- **Selección** (`--seleccion`, `#0e7490` en los dos temas): fondo de `::selection` con texto blanco. Antes era `--marca-medio` (~2.4:1 con blanco).

### Degradado de marca
- **Esmeralda → Cian → Azul Cielo** (`#10b981` → `#06b6d4` → `#0284c7`, 135deg): el único gradiente del sistema, igual en los dos temas. Vive en `bg-marca` (con un velo negro al 35% encima para que el blanco pase AA) y se usa para: el CTA principal de cada sección, la píldora de categoría activa, el badge de oferta, el círculo de WhatsApp de la firma del footer, y los íconos de categoría de la portada (cada tarjeta toma un tramo según su posición, con `colorDeMarca()` en `components/IconoCategoria.tsx`, así la grilla completa recorre el degradado; pedido de Carlos, oct-2026). Fuera de la página, el borde de la baldosa de los íconos de la app (`icon.png`, `apple-icon.png`), horneado en la imagen; el panda del header y del footer va sin baldosa y sin degradado (ver Logo). Nunca se aplica a texto de párrafo ni a fondos grandes de sección.
- **Paradas para texto** (`--marca-texto-inicio/medio/fin`, por tema): el mismo verde→cian→azul en tonos que pasan AA como texto, en `text-marca`, corriendo horizontal (90deg) como en las piezas. Oscuro: `#34d399` → `#22d3ee` → `#38bdf8` (las 400; el `#0284c7` de relleno daba 4.4:1 sobre superficie, `#38bdf8` más de 8:1). Claro: `#047857` → `#0e7490` → `#0369a1` (las 700; las 500 de relleno daban 2.4:1). El color sólido de respaldo es `--marca-texto-medio`, y con `forced-colors` vuelve a `CanvasText`. No es un segundo degradado: es el mismo, con paradas legibles.
- **Escenario** (`--halo-verde`, `--halo-azul`, `--dial-marca`, `--trama`, por tema): el brillo de un solo tono, el dial y la trama del Escenario de producto. Oscuro: halo verde `rgb(16 185 129 / .22)`, azul `rgb(2 132 199 / .26)`, dial `rgb(255 255 255 / .13)`, trama `rgb(148 163 184 / .05)`. Claro: el mismo brillo mucho más suave (halos al 10%, dial `rgb(15 23 42 / .12)`, trama `rgb(15 23 42 / .04)`). El tramo encendido del dial usa `--marca-texto-inicio` (verde) o `--marca-texto-fin` (azul). El halo de la variante queda en `--escenario-halo` (lo fijan `escenario` y `escenario-azul`), que también tiñe la sombra de piso de la foto de la ficha.

### Named Rules
**La Regla del Degradado Único.** Solo hay un gradiente en todo el sistema y es el de marca. Ningún componente inventa su propio degradado — si algo necesita destacar, usa `bg-marca` o un color semántico plano, nunca una mezcla nueva. Las paradas para texto son ese mismo degradado; el brillo del escenario es un radial de un solo tono (verde o azul de marca que se apaga a transparente), no una mezcla, y solo existe dentro de `escenario`.

**La Regla de los Tres Semánticos.** Precio (verde), Agotado (rosa) y Promo (ámbar) son los únicos colores con significado fijo. Si un componente nuevo necesita "llamar la atención" sin ser ninguna de esas tres cosas, la respuesta es el degradado de marca, no un cuarto color semántico. El Verde Sello no es un cuarto: es el mismo verde de precio, en el tono que pasa AA como texto sobre su propio tinte.

## Typography

**Display Font:** Inter (con `system-ui, sans-serif` de respaldo)
**Body Font:** Inter — la misma familia para todo, sin una segunda tipografía de acento.

**Character:** Enérgica y cálida sin dejar de ser legible a las 2 de la mañana en un teléfono con poca señal: pesos altos (bold/black) para lo que vende, pesos medios para lo que orienta, y mayúsculas con tracking amplio para las etiquetas que casi nadie lee dos veces. Los titulares son la grotesca negrísima y apretada de los afiches ("A810 Lite", "Elegí tu smartwatch"): Inter 800 de la misma fuente variable que ya se carga, sin descarga extra ni segunda familia.

### Hierarchy
**Actualizado (nov-2026):** el Display ya no es lo único grande. La escala de titulares de la marca vive en `@theme` de `globals.css` como utilidades de Tailwind (`text-display`, `text-titular`, `text-seccion`, `text-cifra`), cada una con su tamaño fluido, interlineado, tracking y peso 800; el eyebrow es un `@utility`.
- **Display** (`text-display`, 800, `clamp(2.5rem, 1.6rem + 4.2vw, 4.5rem)`, leading 0.95, tracking -0.045em): el `<h1>` de la portada únicamente, en dos líneas con el remate en degradado (Regla del Remate).
- **Titular** (`text-titular`, 800, `clamp(2.25rem, 1.6rem + 2.6vw, 3.5rem)`, leading 1, tracking -0.04em): el `<h1>` del catálogo y de la ficha (el nombre del modelo, con `text-balance`). El nombre de un producto nunca va en degradado. En la ficha, si el nombre arranca con la marca ("Amazfit Active Max"; `prefijoMarca` en `lib/seo.ts`, sin líneas de producto como "Echo Dot"), la marca va chica encima del modelo, dentro del mismo `<h1>` (`<span className="eyebrow mb-2 block text-tenue">`): el texto del `<h1>` sigue siendo el nombre completo, para Google y los lectores de pantalla.
- **Sección** (`text-seccion`, 800, `clamp(1.625rem, 1.25rem + 1.5vw, 2.25rem)`, leading 1.08, tracking -0.03em): los `<h2>` de sección de la portada (`Qué estás buscando`, `Lo más pedido`, `Llevalo hoy / y pagalo en cuotas`, `Visitanos`).
- **Cifra** (`text-cifra`, 800, `clamp(2rem, 1.5rem + 2vw, 3rem)`, leading 1, tracking -0.035em, `tabular-nums`): el precio protagonista de la ficha. Siempre más chica que el Titular de la misma página (a 390px: 32 vs 36px; a 1440: 48 vs 56px). Ver Regla del Precio Gigante.
- **Eyebrow** (`eyebrow`, 600, 0.75rem, tracking 0.22em, uppercase): la línea de los afiches sobre el titular ("MAGCUBIC · HY350 MAX"). En la ficha es `MARCA · CATEGORÍA` sobre el `<h1>` solo cuando el nombre no arranca con la marca; si arranca, la marca va dentro del `<h1>` (ver Titular) y no hay eyebrow aparte (la categoría ya está en las migas). En la portada es la línea del financiamiento ("Financiamiento Banpro"), en `text-tenue`: el verde queda para precios y para el 0%. El color lo pone cada uso (`text-tenue` o `text-suave`; los dos pasan AA en ambos temas a ese tamaño).
- **Title** (600–700, leading 1.4): nombre de producto en tarjeta (`text-sm font-bold tracking-tight`). **Actualizado (nov-2026):** los `<h2>` de la ficha (`Por qué te sirve`, `Descripción`, `Especificaciones` y `También te puede servir`) van en `text-2xl font-bold tracking-tight`: en 14px no se distinguían del cuerpo, y en `text-lg` quedaban más chicos que las cifras de Datos clave (`text-2xl`).
- **Body** (400, 0.875rem, leading 1.6): descripciones, texto de apoyo. Sube a 1rem en los bullets de "Por qué te sirve" y a 1.125rem en el beneficio destacado de la ficha de producto.
- **Label** (600, 11px, uppercase): categoría sobre el nombre del producto en la tarjeta (con tracking 0.18em, el registro del eyebrow en chico; 0.12em debajo de `sm`, y siempre en una línea con `truncate`: a 390px "Cámaras de seguridad" en dos renglones dejaba los nombres de una misma fila a distinta altura), la pastilla "Agotado" de la tarjeta (sin mayúsculas), encabezados de sección chicos.
- **Micro** (900, 10px, tracking 0.1em, uppercase, black): los badges más chicos y de más peso — el "0%" de la tarjeta y "-16% Oferta". Es la excepción que compite por atención: más chico que Label pero mucho más pesado. **Corregido (nov-2026):** el sello "0% interés" de la ficha ya no es Micro (es `text-xs font-bold` sobre verde plano, ver Badges), y la pastilla "Agotado" de la tarjeta es Label.

### Named Rules
**La Regla del Precio Gigante.** El precio actual siempre es el elemento tipográfico más grande de su bloque (`text-cifra` en ficha, `text-lg` bold en tarjeta) — nunca compite en tamaño con el nombre del producto: la Cifra es siempre más chica que el Titular de su página. **Actualizado (nov-2026):** en la ficha era `text-4xl` y a 390px (36px) le ganaba al `<h1>` (30px). **Excepción confirmada:** en un producto agotado, el precio baja a `text-2xl text-tenue` y la calculadora de cuotas se oculta entera — no tiene sentido que la pieza más grande de la pantalla venda algo que no se puede comprar ahora mismo.

**La Regla del Remate.** El texto en degradado (`text-marca`) solo va en la última línea de un titular Display o Sección — el "remate" de los afiches: "Elegí tu / **smartwatch**", "Tecnología para tu casa / **y tu negocio**". La primera línea va en `text-texto` y el remate en un `<span className="block w-fit text-marca">` dentro del mismo `<h1>`/`<h2>` (un solo encabezado, el lector lo lee de corrido). `w-fit` hace que el degradado se reparta en el ancho del texto: con `block` a secas ocupaba toda la columna y el remate no llegaba al azul (corregido nov-2026). Un remate por pantalla (por vista, no por página: en la portada están el del hero y el de financiamiento, a varias pantallas de distancia). Nunca en párrafos, precios, nombres de producto, métricas ni botones. La otra excepción es la palabra "store" del logotipo (`Header.tsx`, `Footer.tsx`, `global-error.tsx`), que coincide con el asset de marca real.

## Layout

Contenedor central `max-w-6xl` (72rem) con `px-4` de margen lateral en todo el sitio — nunca full-bleed salvo el hero y el footer. El `px-4` va en el mismo elemento que el `max-w-6xl` (o adentro), no en un envoltorio de ancho completo: así estaba el copyright del footer, y a 1440 quedaba 16px a la izquierda de las columnas (corregido nov-2026). Ritmo vertical por secciones de `py-16`/`py-20` en desktop, comprimido a `py-10` en el catálogo (más denso, orientado a tarea).

Grillas responsive por breakpoint: el catálogo pasa de 2 columnas en móvil a 3 (`lg`) y 4 (`xl`); los destacados de portada van de 2 a 4 columnas a partir de `lg`. Las tarjetas nunca superan el ancho de su columna — sin excepciones de ancho variable dentro de una misma grilla.

**Mobile-first real, no solo responsive:** la ficha de producto tiene una barra de compra fija en la parte inferior en móvil (`barra-producto`) que desaparece en desktop a favor de un CTA inline — no es el mismo componente reescalado, es una composición distinta a propósito.

**Portada (oct-2026):** el hero es texto a la izquierda y vitrina de productos a la derecha en `lg`; en móvil el texto va arriba (alineado a la izquierda, ya no centrado) y la vitrina es una tira horizontal debajo de los botones, para que la primera pantalla del teléfono ya muestre productos con precio. "Qué estás buscando" va a 2 columnas desde móvil y 3 en `lg`, con íconos (no fotos); las ventajas, a 2 columnas en móvil y 4 en `lg`. La profundidad del hero la dan los productos: el resplandor cyan difuminado que había detrás del título se sacó (contradecía "nada de gradientes de fondo decorativos").

**Hero de marca (nov-2026):** pastilla de estado en verde (`border-precio/35 bg-precio/10 text-precio-sello`, con punto `bg-precio`) → `<h1>` Display en dos líneas con el remate "y tu negocio" en `text-marca` → bajada → botones. La vitrina va sobre el Escenario de producto (brillo verde; el dial solo desde `lg`, porque en el celular la vitrina es una tira con scroll y el círculo quedaría cortado). El brillo nunca queda detrás del texto. La sección lleva `overflow-x-clip` para recortar el dial, que se sale de la vitrina a propósito. **Corregido (nov-2026):** como ítem de la grilla, el escenario tomaba el ancho mínimo de la tira de la vitrina (~676px) y en el celular cortaba a la derecha el `<h1>`, la bajada y los botones (el `overflow-x-clip` lo escondía: no había scroll lateral, solo texto recortado). Por eso `escenario` lleva `min-width: 0`.

**Ficha con estructura de afiche (nov-2026):** galería a la izquierda, con la foto principal sobre el Escenario (variante verde o azul por producto; las miniaturas quedan fuera). A la derecha, en este orden: fila de estado (Disponible/Agotado, la campaña si hay y el código del producto en `text-xs text-tenue`) → `<h1>` Titular con la marca chica encima (dentro del `<h1>` si el nombre arranca con ella; si no, eyebrow `MARCA · CATEGORÍA` sobre el `<h1>`) → beneficio → Datos clave 2x2 → precio protagonista con la cuota más baja al lado → en escritorio, "Lo quiero" y Comparar → recuadro de cuotas → en el celular, Comparar (el CTA va en la barra fija) → fila de garantías 2x2 con checks → nota de precio, factura y envíos. **Actualizado (nov-2026):** el CTA de escritorio iba después del recuadro de cuotas y a 1440×900 quedaba debajo del pliegue; el código iba en su propia línea bajo el `<h1>` y, con un nombre largo, empujaba "Lo quiero" debajo del pliegue a 1366×768. Con grilla de datos clave, la frase armada con specs no se repite, y ninguna fila de la grilla vuelve a aparecer en la tabla de Especificaciones (el JSON-LD de producto sigue recibiendo la descripción armada con specs). El contenedor lleva `overflow-x-clip` (no `hidden`: rompería el `sticky` de `.galeria-ficha`).

**Skip link:** "Saltar al contenido" es la primera parada del Tab en todas las páginas (`layout.tsx`): `sr-only` hasta recibir foco, y entonces una pastilla fija arriba a la izquierda (`bg-superficie`, `shadow-flotante`) que salta a `<main id="contenido">`.

## Elevation & Depth

El sistema es plano en reposo (salvo la profundidad ambiental del Escenario de producto, ver abajo): la separación entre superficies se resuelve con `border-borde` y el salto de `bg-fondo` a `bg-superficie`, no con sombra. La profundidad aparece cuando algo pasa — una tarjeta bajo el mouse, una barra que flota sobre el contenido, un modal — y vive en tres tokens de elevación (`shadow-elevada`, `shadow-flotante`, `shadow-modal`), definidos por tema en `globals.css` igual que los colores. **Implementado en oct-2026 (Fase 2 de `docs/plan-mejora-visual.md`).**

En oscuro, cada token lleva un brillo de 1px en el borde superior (`inset 0 1px 0 rgb(255 255 255 / 0.06)`): una sombra oscura sola no se ve sobre `#090c11`, y ese canto iluminado es lo que se lee como "está arriba". La sombra está teñida con el azul del lienzo (`rgb(2 6 12 / …)`, nov-2026), no negro puro, que se veía gris sobre él. En claro no hay brillo, solo sombra teñida con slate-900 (no negro puro, que se ve sucio sobre slate-50).

### Profundidad ambiental: el Escenario de producto
**Excepción con nombre a "nada de gradientes de fondo decorativos" (nov-2026).** Es el brillo y el dial de los afiches detrás del producto protagonista, y solo ahí: la vitrina del hero y la foto principal de la ficha. Un brillo por vista. No es elevación ni estado: es profundidad ambiental, decorativa (`aria-hidden`), que no suma imágenes ni precargas. Las tarjetas siguen planas en reposo; la única sombra sin estado del sistema es la de piso de la foto de la ficha, y es parte del escenario (abajo).
- **Brillo y trama** (`@utility escenario`): un `::before` pintado una vez con un radial de un solo tono (`--halo-verde` o, con `escenario-azul`, `--halo-azul`) sobre una trama de 48px (`--trama`) que se apaga hacia los bordes con `mask-image`. Sin `filter: blur` ni imágenes. Lleva `min-width: 0`: como ítem de grid o flex, sin eso toma el ancho mínimo de lo que envuelve (ver Hero de marca).
- **Dial** (SVG en `Escenario`): un círculo fino con 60 marcas (una más larga cada cinco), como un velocímetro, y un tramo encendido en el color de la variante (arco corto abajo a la izquierda en verde, arco largo arriba a la izquierda en azul). Se sale de la caja a propósito (118% de ancho; 112% en la foto de la ficha, con `dialAncho`, para que el trazo no llegue a la columna de texto): un ancestro lo recorta con `overflow-x-clip`.
- **Sombra de piso** (solo en la ficha): la caja de la foto principal lleva `shadow-[0_24px_60px_-20px_var(--escenario-halo)]`, una sombra hacia abajo en el color del brillo de su variante y de su tema. La bandeja blanca de la foto tapa casi todo el brillo; la sombra lo deja ver debajo. Es parte del escenario, no elevación: no responde a un estado.

### Shadow Vocabulary
- **Elevada** (`shadow-elevada`): tarjeta de producto y tarjeta de categoría, solo en hover. Va junto con subir 2px (`motion-safe:-translate-y-0.5`) y el borde a `acento/50`. Nunca en reposo.
- **Flotante** (`shadow-flotante`): lo que flota sobre el contenido sin estar anclado a un borde — la barra del comparador y su toast.
- **Modal** (`shadow-modal`): el panel del modal del comparador. Casi no se ve porque el velo `bg-black/70` ya hace el trabajo; está para que el panel no quede pegado al velo en claro.
- **Acento flotante** (Tailwind `shadow-md`): píldora activa y badge de oferta. Se queda en `shadow-md`: en algo de 20px de alto, una sombra difusa grande se vería pesada.
- **Piso del escenario** (`shadow-[0_24px_60px_-20px_var(--escenario-halo)]`): la foto principal de la ficha, dentro del Escenario. Es la única sombra arbitraria: sigue al tema porque su color es `--escenario-halo`, y existe porque existe el escenario.
- La barra de compra fija de la ficha (móvil) no lleva sombra: está anclada al borde de la pantalla y su `border-t` alcanza.

### Patrón: hover sin temblor
El elemento que detecta el hover no se mueve: es un envoltorio `group` (en `ProductCard`) o el propio `<Link>` (tarjeta de categoría), y la tarjeta de adentro es la que sube con `group-hover:`. Si subiera el mismo elemento que detecta el hover, con el cursor en los 2px de abajo la tarjeta se iría de debajo del cursor, bajaría y volvería a subir.

### Named Rules
**La Regla de la Sombra con Motivo.** Ninguna sombra existe sin una razón puntual (hover, flotante, modal, activo). Si un elemento no tiene un estado especial que la justifique, va sin sombra. Y si la tiene, usa uno de los tres tokens: nada de `shadow-xl`/`shadow-2xl` sueltos, que no cambian con el tema. La única excepción es la sombra de piso del Escenario en la ficha, que es parte de la profundidad ambiental con nombre y toma el color del halo del tema.

**La Regla del Escenario.** El escenario va detrás del producto protagonista de la vista y de nada más: nunca detrás de texto, nunca en cada tarjeta del catálogo (ruido y costo de pintado), nunca como fondo de sección, y nunca dos en la misma vista. Es la única profundidad sin estado que lo justifique, y por eso tiene nombre.

## Shapes

Radios generosos y consistentes, con una jerarquía clara por tamaño de elemento:
- **Pastilla completa** (`rounded-full`, 9999px): todo lo accionable — botones primarios y secundarios, píldoras de filtro, badges de estado (Disponible/Agotado), el ícono de WhatsApp.
- **Grande** (`rounded-2xl`/`rounded-3xl`, 16–24px): contenedores — tarjetas de producto, tarjetas de categoría, el panel de financiamiento, modales.
- **Medio** (`rounded-xl`, 12px): elementos secundarios dentro de un contenedor — botones de ícono, casillas de cuota individual, campo de búsqueda, la bandeja de foto y las miniaturas de foto (galería y barra del comparador).
- **Chico** (`rounded-lg`, 8px): badges de oferta sobre imagen — la única forma no-pastilla que aparece flotando sobre contenido.

Sin bordes duros en ningún componente interactivo. Las únicas esquinas a 0px son estructurales (la barra de compra fija en móvil, que se ancla al borde de la pantalla).

## Components

### Buttons
- **Shape:** pastilla completa (`rounded-full`) sin excepción.
- **Primary:** fondo `bg-marca` (degradado esmeralda→cian→azul), texto blanco, `font-semibold`, `px-5 py-3` (o `px-6 py-4` para el CTA principal de ficha). Hover: `opacity-90`, sin cambio de color ni de tamaño.
- **Secondary / Ghost:** uno solo: pastilla con `border border-borde2` y texto `text-texto font-semibold`. Hover: el borde y el texto pasan a `acento`. **Actualizado (nov-2026):** sin relleno en ningún lado, también en la portada ("Hablar con un asesor" del hero llevaba `bg-superficie` y era el único), y con hover en `acento` en todos, incluido el que abre WhatsApp: el verde queda para el precio. "Comparar" es el mismo secundario, en la ficha (`px-5 py-3 text-sm`) y en el chip de la tarjeta (`px-3 py-2 text-xs font-medium`), que antes iba en `bg-superficie2 text-tenue`, se veía distinto en cada lugar y en claro daba 4.34:1. Activos, los dos pasan a `border-acento/40`, tinte `bg-acento/10` (ficha) o `bg-acento/15` (tarjeta) y texto `text-acento`. Los secundarios de las pantallas de error, la 404 y el catálogo vacío también van sin relleno.
- **Icon button:** cuadrado `rounded-xl` de `h-9 w-9`, fondo `bg-superficie`, borde `border-borde`. Hover: fondo `bg-marca`, texto blanco — el único botón secundario que sí cambia de color completo al pasar el mouse.

### Badges / Chips
- **Oferta:** `rounded-lg`, fondo `bg-marca`, texto blanco `font-black uppercase` con tracking amplio. Siempre sobre imagen, nunca en línea de texto.
- **Agotado (sobre imagen, en tarjeta):** `rounded-full`, fondo `bg-superficie/95` con `ring-1 ring-agotado/30`, texto rosa. Flota sobre la imagen, opuesto al badge de oferta. (Era `bg-fondo/90`: en claro, sobre la bandeja de foto, el rosa quedaba en ~4.48:1.)
- **0% interés:** solo aparece cuando todos los planes del producto son de verdad sin recargo (`todosSinInteres`: lo decide la lógica de cuotas, nunca a ojo) — nunca decorativo. **Actualizado (nov-2026):** en la ficha es el sello de los afiches, verde plano: `rounded-full bg-precio px-2.5 py-0.5 text-xs font-bold text-fondo`, "0% interés" sin mayúsculas, en el recuadro de cuotas (~10:1 en oscuro, 5.2:1 en claro; verde sobre tinte verde no llegaba a AA en claro). En la tarjeta sigue siendo la píldora tintada: `rounded-full bg-precio/15 text-micro font-black uppercase tracking-wider text-precio-sello`, "0%" (con "de interés" solo para lectores de pantalla).
- **Pastilla de estado del hero** ("● Entrega inmediata en Managua", nov-2026): `rounded-full`, `border border-precio/35 bg-precio/10 text-precio-sello text-xs font-semibold`, con el punto `bg-precio`. Es la pastilla "● Disponible" de las piezas: informa, no es un botón.
- **Píldora de filtro (categoría):** `rounded-full`. Inactiva: borde + `bg-superficie`. Activa: `bg-marca`, texto blanco, `font-bold`, `shadow-md` y un punto blanco a la izquierda.
- **Disponible / Agotado (inline, en ficha):** `rounded-full`, con un punto (`h-1.5 w-1.5 rounded-full`) a la izquierda del texto. Disponible: `bg-precio/10 text-precio-sello`, punto `bg-precio`. Agotado: `bg-agotado/10 text-agotado`. **Corregido (audit técnico):** documentaba `bg-marca/10`, pero `bg-marca` es un `@utility` con `background-image` (no un color de `@theme`), así que Tailwind nunca generó el modificador `/10` — la píldora "Disponible" no tenía fondo en absoluto en producción. `bg-precio/10` además hace que el patrón calce con "Agotado" (mismo token para el punto y el fondo; el texto de "Disponible" va en `text-precio-sello` desde nov-2026, porque en claro emerald-700 sobre ese tinte daba 4.57:1, al límite). Es un patrón propio, distinto del badge "Agotado" que flota sobre la imagen en la tarjeta — viven en contextos distintos (inline junto al nombre vs. flotando sobre una foto), no hace falta unificarlos.

### Cards / Containers
- **Corner Style:** `rounded-2xl`.
- **Background:** `bg-superficie` sobre `bg-fondo`.
- **Shadow Strategy:** ninguna en reposo (ver Elevation; la única excepción es la sombra de piso de la foto de la ficha, parte del Escenario). En hover: `shadow-elevada`, sube 2px y el borde pasa a `acento/50`, con el patrón de hover sin temblor.
- **Border:** `border border-borde` siempre presente, incluso sin hover.
- **Internal Padding:** `p-4` a `p-5`; el panel de financiamiento sube a `p-8`/`p-12` en desktop por ser una sección hero-like.

### Vitrina del hero y tarjeta de categoría
- **Vitrina** (`Vitrina`/`TarjetaVitrina` en `app/page.tsx`): hasta 4 productos, uno por categoría antes de repetir (`elegirHero` en `lib/portada.ts`), siempre con foto. Tarjeta = bandeja de foto + nombre (una línea) + precio en `text-precio`. En `lg` es un mosaico: el primero ancho (`aspect-[2/1]`) arriba y dos cuadrados abajo; el cuarto solo existe en la tira móvil. Es el mismo marcado en los dos tamaños para que cada foto se descargue una vez.
- **Tarjeta de categoría:** ícono propio de la categoría (`IconoCategoria`, mismo estilo de trazo que `iconos.tsx`) en una pastilla `rounded-2xl` de `h-12`/`h-14`, arriba a la izquierda; la pastilla del conteo arriba a la derecha; nombre debajo y la descripción solo desde `sm`. El ícono se pinta con su tramo del degradado de marca (`userSpaceOnUse`, de arriba-izquierda a abajo-derecha) y la pastilla lleva ese mismo color al 12%, el recurso de las ventajas (`bg-acento/10`). No usa fotos: con fotos de producto, una categoría sin imágenes en el POS (Smart TV) quedaba vacía, y la foto podía no representar la categoría. No cambia de fondo en hover (la pastilla del conteo es `bg-superficie2` y desaparecía).
- La vitrina usa la misma bandeja de foto que el catálogo (ver "Foto de producto").
- El hero no repite productos en "Lo más pedido".
- La vitrina va dentro de `<Escenario dial="escritorio">` (ver abajo).

### Escenario de producto (Escenario)
**Implementado en nov-2026 (fase 2 de `docs/plan-identidad-marca.md`).** `components/Escenario.tsx` envuelve al producto protagonista con el brillo y la trama (`escenario`, ver Elevation) y el dial SVG.
- **Props:** `variante` (`"verde"` por defecto, o `"azul"`), `dial` (`true`, `false` o `"escritorio"`: sin dial en el celular), `dialAncho` (`"w-[118%]"` por defecto, o `"w-[112%]"`: el ancho del dial respecto del contenido), `className`.
- **Variante:** en las piezas, los afiches alternan brillo verde y azul para que dos seguidos no se vean iguales; no sale de la categoría ni del color del producto. En la ficha se elige con `varianteDe(producto.id)` (un hash del id), así cada producto tiene siempre la misma y el catálogo se reparte entre las dos. La misma variante tiñe los íconos de Datos clave.
- **Dónde:** la vitrina del hero (verde, `dial="escritorio"`) y la foto principal de la ficha (variante del producto, `dialAncho="w-[112%]"`). En la ficha lo pone `Galeria` cuando recibe `variante`, y envuelve solo la foto principal: con las miniaturas adentro, el dial quedaba centrado en la galería entera y no en el producto. En ningún otro lado (Regla del Escenario).
- **Fotos:** las fotos del POS tienen fondo blanco, así que el escenario rodea la bandeja de foto, no la reemplaza (la Regla de la Bandeja sigue). Un escenario sin bandeja necesita recortes PNG sin fondo, pendientes del lado de Carlos. Como la bandeja tapa casi todo el brillo, en la ficha la caja de la foto suma la sombra de piso en el color del escenario (ver Elevation).

### Datos clave (DatosClave)
La grilla 2x2 de los afiches ("4K adelante · 1080p atrás", "Wi-Fi 6 hasta 25 MB/s"), en la ficha entre el beneficio y el precio.
- **Datos:** las primeras `MAX_DATOS_CLAVE` (4) filas de `filasDeSpecs`, que `categorySpecs` ya ordena por lo que más vende en cada categoría. No inventa ni elige datos, solo los presenta. Con menos de dos filas no se muestra.
- **Estructura:** un `<dl>` de `grid-cols-2 gap-5`. Cada dato: ícono de línea de 24px (mismo trazo que `iconos.tsx`, uno por familia de dato, `IconoDato` para el resto) en el tono de la variante (`--marca-texto-inicio` o `--marca-texto-fin`); la cifra en `text-2xl font-bold tracking-tight text-texto` con la unidad en `text-base` ("1100" + "lúmenes ANSI"), y la etiqueta (`dt`, `text-sm text-suave`) debajo como la bajada gris de los afiches, con `flex-col-reverse` para que en el DOM vaya antes. **Actualizado (nov-2026):** la columna lleva además `justify-end`, que en `column-reverse` empuja todo hacia arriba: la cifra queda alineada con el ícono aunque la celda vecina sea más alta.
- **Valores libres del POS:** solo se parte en cifra + unidad si el valor empieza con una cifra corta. La cifra puede llevar hasta dos letras pegadas ("1080p Full HD", "4K adelante") o ser una relación ("1.2:1"), y la unidad es opcional: "1080P" a secas también va grande. Si no empieza así, va entero en `text-lg`. Nunca se parte a medias.
- **Relación de proyección** (`throwRatio`): si el POS manda solo el número ("1"), se muestra "1:1", que en el afiche sí dice algo; tiene ícono propio (el haz del proyector, `IconoProyeccion`).

### Precio protagonista (PrecioFicha)
- **Fila del precio** (`flex flex-wrap items-end gap-x-4 gap-y-2`): con el producto disponible, la Cifra de los afiches, `text-cifra tabular-nums text-precio`, con el "C$" chico (0.46em) alineado arriba, como en las piezas. Son dos spans seguidos: el lector de pantalla sigue diciendo "C$7,270". Al lado, el precio de lista tachado (`text-lg text-tenue line-through`) y, **desde nov-2026**, la cuota más baja como en los afiches: "N cuotas de C$X" en `font-bold text-texto` y debajo "con tu tarjeta Banpro" (`text-sm leading-tight text-suave`). Sale de los planes ya calculados (`planMasBajo`), nunca de una cuenta en el componente, y un agotado no la muestra. `items-end` apoya los tres en la misma línea de abajo; si no entran juntos, la cuota baja entera.
- **Acción** (prop `accion`): lo que va entre la fila del precio y el recuadro de cuotas. La ficha pasa ahí el CTA de escritorio ("Lo quiero" y Comparar, `hidden lg:flex`): después del recuadro, a 1440×900 "Lo quiero" quedaba debajo del pliegue. En el celular no cambia (barra fija).
- **Recuadro de cuotas:** solo con el producto disponible y con planes. `rounded-2xl border border-precio/20 bg-precio/5 p-4`: "Pagalo en cuotas con Banpro" en `text-precio`, el sello "0% interés" cuando corresponde (ver Badges) y una casilla por plazo.
- **Agotado o sin precio:** el formato anterior (`text-2xl text-tenue` en agotado), sin cuota al lado ni recuadro de cuotas.
- **Tarjeta:** sin cambios (`text-lg font-bold text-precio`).

### Fila de garantías (PropuestaValorCompacta)
La fila de checks de los afiches ("✓ Cuotas con Banpro ✓ Garantía 3 meses ✓ Entrega inmediata"), debajo del recuadro de cuotas de la ficha (y, en el celular, del botón Comparar); en la web dice "Financiamiento Banpro · Garantía N meses · Entrega inmediata · Atención personal", y en un agotado quedan solo garantía y atención (no se promete financiamiento ni entrega de algo que no hay). Un `<ul aria-label="Lo que incluye tu compra">` en `grid grid-cols-2 gap-x-5 gap-y-2`, un 2x2 parejo (con `flex-wrap`, a 1440 quedaban tres arriba y una sola abajo); cada ítem es `IconoCheck` (`h-4 w-4 text-precio`) + texto `text-sm font-medium text-texto`. Reemplaza las cuatro cajitas con ícono de antes, que competían con el precio. Los textos salen de `itemsPropuestaValor` (banco y meses de garantía de `config/site`, no escritos a mano), la misma fuente que la propuesta de valor de la portada.

### Logo (LogoPanda)
**Implementado en nov-2026.** El panda va solo, sin baldosa, como en los afiches: blanco sobre el fondo en oscuro y con su tinta en claro. No hay SVG: son dos PNG del mismo lienzo (297×256, en `public/marca/`) que apila `components/LogoPanda.tsx`.
- **`panda.png`:** solo lo blanco del panda y sus grises. En oscuro va solo: lo negro del panda (orejas, ojos, boca, brazo) es el fondo de la página, igual que en las piezas.
- **`panda-tinta.png`:** la máscara de lo negro del panda más un contorno fino. En claro se pinta debajo del panda blanco con el color `--texto` (`.light .logo-panda::before` en `globals.css`); sin ella, el blanco se perdía contra el fondo claro. La regla va dentro de `@supports (mask-image: none)`: sin soporte de máscaras no hay tinta, nunca un rectángulo sólido.
- **Tamaño y carga:** la altura va en `className` (`h-9` en el header, `h-12` en la firma del footer) y el ancho sale de `aspect-[297/256]`; `sizes` es ese ancho en px (42 y 56). En el header se pide al leer el HTML (`eager` + `fetchPriority="low"`), sin precarga: nunca es el LCP. En el footer, `lazy`. Es decorativo (`aria-hidden`, `alt=""`): el nombre lo dan el enlace del header y el texto "pandastore" de al lado.
- **Fuera de la página:** los íconos de la app (`src/app/icon.png`, `apple-icon.png`) conservan la baldosa con el borde degradado: un ícono necesita fondo propio. La imagen para compartir (`opengraph-image.tsx`) usa `panda.png` sobre el fondo oscuro, como en los afiches. `public/logo.png`, la baldosa que usaban el header y la firma, ya no existe.

### Firma de WhatsApp (Footer)
La firma de cierre de todos los afiches, arriba del footer: una tarjeta `rounded-3xl border border-borde bg-superficie p-5`/`sm:p-6`, apilada en el celular y en fila desde `sm`.
- **Izquierda:** el panda sin baldosa (`LogoPanda`, `h-12`, carga diferida; ver Logo), "panda**store**" en `text-xl font-bold` ("store" en `text-marca`, la excepción del logotipo) y debajo "Colectivo Dreamy · Managua" con el ícono de ubicación, armado desde `CONTACTO.direccion` (el tramo antes de la primera coma; nunca escrito a mano). **Actualizado (nov-2026):** antes el logo iba en una baldosa `h-14 w-14 rounded-2xl border-borde2 bg-fondo`.
- **Derecha:** todo es un `EnlaceWhatsApp`, así el clic se mide como conversión igual que los demás. Círculo `h-12 w-12 rounded-full bg-marca` con el ícono blanco, "Escribinos por WhatsApp" en `text-sm text-suave` y el número (de `CONTACTO.whatsappVisible`, sin el +505) en `text-3xl font-extrabold tracking-tight tabular-nums`, que pasa a `text-acento` en hover.

### Foto de producto (ProductImage)
**Implementado en oct-2026 (Fase 4 de `docs/plan-mejora-visual.md`).** Las fotos del POS son de estudio con fondo blanco y no se pueden editar; en oscuro, un cuadrado blanco de borde a borde era lo más brillante de la pantalla y le ganaba al precio.

- **Bandeja:** la pone `ProductImage` en los 6 lugares que muestran fotos (tarjeta, vitrina, galería y sus miniaturas, barra y modal del comparador). Son dos utilidades: `bandeja-foto` (fondo `--bandeja`, #fff, el blanco de estudio, así nunca asoma el recuadro de la imagen) y `velo-foto` (un `::after` con `--velo-foto`: `rgb(9 12 17 / .14)` en oscuro, teñido con el lienzo azulado, ≈ #dcddde sobre la bandeja; `rgb(15 23 42 / .04)` en claro). Es un color con alfa: nada de `mix-blend-mode` ni `filter`, que abren una capa por foto en gama baja y en iOS pueden perder la mezcla durante el zoom.
- **Aire:** la foto va en un `absolute inset-[5%]` dentro de la bandeja (next/image con `fill` ignora el padding del contenedor). Siempre `object-contain`.
- **Marco:** tarjeta, vitrina y ficha llevan `p-1` (4px) y la bandeja `rounded-xl`, concéntrica con el `rounded-2xl` del contenedor (16 − 4 = 12). En miniaturas, barra y modal la bandeja llena la caja, que ya recorta con su radio.
- **Agotado en listas** (`apagada`): capa `bg-superficie/30` sobre la bandeja entera, solo cuando hay foto (sobre el ícono del sin foto lo dejaba debajo de 3:1). Tres niveles en oscuro: disponible (≈ #dcddde) > agotado con foto (≈ #9fa2a5) > agotado sin foto (`bg-superficie2`, #1a2330). En claro la capa es blanca sobre blanco: la bandeja queda igual y el producto pierde contraste, que es el apagado natural del tema claro; se acepta que ahí no haya escalón de bandeja. En la ficha no se apaga.
- **Sin foto:** el ícono de la categoría (`IconoCategoria` monocromo, `text-tenue`, 40% de la bandeja con tope de 64px), nunca un texto "SIN FOTO" ni un ícono genérico de imagen. Sin foto en el POS va siempre sobre `bg-superficie2`, en la tarjeta, el comparador y la ficha: una bandeja clara vacía era el bloque más brillante sin decir nada. Solo una foto que falló en una lista (Imgur caído) conserva la bandeja, para no abrir un hueco oscuro entre vecinos. La foto grande de la ficha (`leyenda`) que falla cae a `bg-superficie2` con el ícono y "Sin foto". En la ficha sin fotos ni video: banda `aspect-[3/1]` (`2:1` en `lg`) en `bg-superficie2`, con el ícono y la leyenda "Sin foto" en `text-texto` (con `text-suave` no llega a AA en claro).
- **Fotos de escena** (las de la galería con etiqueta del POS: "Con Luz", "A Oscuras", "Funciones"…): `escena`, sobre `bg-superficie` con el mismo `velo-foto`. Sobre la bandeja blanca quedaban con bandas gris claro a los costados; sin velo, una infografía con lienzo blanco volvía a ser lo más brillante de la pantalla. Si fallan, no caen a la bandeja blanca.

### Named Rules
**La Regla de la Bandeja.** Ninguna foto de producto se pinta sobre el fondo propio de un lugar: la bandeja la pone `ProductImage`, y cada lugar solo decide el marco y el radio. Un lugar nuevo que muestre fotos usa `ProductImage`, no un `next/image` suelto.

### Inputs / Fields
- **Style:** `rounded-xl`, `border border-borde`, fondo `bg-superficie`, texto `text-sm`.
- **Focus:** el borde cambia a `border-acento` y además queda el anillo global de `:focus-visible` (`outline: 2px solid var(--acento)`, offset 2px). **Corregido (nov-2026):** el buscador y el orden del catálogo tenían `focus:outline-none` y solo cambiaban el borde, que no alcanza como foco visible; ningún control usa `focus:outline-none` sin reemplazo. Este archivo (con los demás `.md` de la raíz) y `docs/` quedan fuera del escaneo de Tailwind (`@source not` en `globals.css`): citan clases de ejemplo como esa, y Tailwind las generaba igual — CSS que nadie usa y que confundía las auditorías de foco.
- **Placeholder:** siempre en `text-tenue`, el nivel más bajo de la jerarquía de texto.

### Navigation
- **Header:** fijo (`sticky top-0`), fondo `bg-fondo/85` con `backdrop-blur-md` — nunca opaco sólido, siempre deja intuir el contenido detrás. A la izquierda, el panda (`LogoPanda`, `h-9`, sin baldosa; ver Logo) y "panda**store**" en `text-lg font-bold`, en un solo enlace a la portada. Enlaces en píldora al hover (`hover:bg-superficie2`). El CTA de WhatsApp del header es el único botón `bg-marca` que vive fuera del flujo principal de contenido.
- **Mobile:** la navegación secundaria baja a una fila propia con scroll horizontal sin barra visible (`scrollbar-none`) en vez de un menú hamburguesa.
- **Skip link:** "Saltar al contenido", antes del header (ver Layout). Invisible hasta el primer Tab; con foco es una pastilla `rounded-full bg-superficie text-texto font-semibold shadow-flotante`, fija arriba a la izquierda.

## Do's and Don'ts

### Do:
- **Do** reservar `bg-marca` (el degradado) para lo accionable: CTA primario, píldora activa, badge de oferta, el círculo de WhatsApp de la firma del footer, y los íconos de categoría de la portada (un tramo por tarjeta). Es la Regla del Degradado Único.
- **Do** armar los titulares grandes como en los afiches: Inter 800 de la escala (`text-display`, `text-titular`, `text-seccion`), y cuando hay remate, la primera línea en `text-texto` y la última en `<span className="block w-fit text-marca">` dentro del mismo encabezado. Es la Regla del Remate.
- **Do** poner un eyebrow (`eyebrow`, en `text-tenue` o `text-suave`) sobre el titular cuando hay una marca o categoría que nombrar, como "MAGCUBIC · PROYECTORES". En la ficha, si el nombre ya arranca con la marca, la marca va chica dentro del `<h1>` y no se repite en un eyebrow.
- **Do** usar `Escenario` detrás del producto protagonista de la vista (vitrina del hero, foto principal de la ficha), con la variante del producto (`varianteDe`) y un ancestro con `overflow-x-clip`. Es la Regla del Escenario.
- **Do** escribir en `text-precio-sello` el texto verde que va sobre un tinte verde (pastillas de estado, el 0% de la tarjeta, pasos numerados); los precios, siempre en `text-precio`.
- **Do** usar `LogoPanda` para el panda en la web: va sin baldosa, blanco en oscuro y con su tinta en claro. La baldosa queda para los íconos de la app.
- **Do** sacar todo dato del afiche de lo que ya existe (specs del POS, `config/site`, `CONTACTO`, lógica de cuotas): la web nunca escribe a mano precios, vigencias, datos técnicos, dirección ni teléfono.
- **Do** mostrar toda foto de producto con `ProductImage`, que pone la bandeja de foto con su velo y su aire; cada lugar solo elige marco y radio. Es la Regla de la Bandeja.
- **Do** usar pastilla completa (`rounded-full`) para todo botón, badge de estado y filtro — es la forma por defecto de "esto se puede tocar".
- **Do** mostrar el precio como el elemento tipográfico más grande de su bloque, y en la ficha con `text-cifra` y el "C$" chico arriba, siempre más chico que el `<h1>` (Regla del Precio Gigante).
- **Do** dejar que el borde y el salto de superficie hagan el trabajo de separar contenido, antes de recurrir a una sombra.

### Don't:
- **Don't** crear un segundo degradado. Si algo necesita destacar más, sube de peso tipográfico o usa un color semántico plano — nunca mezcles otro gradiente.
- **Don't** aplicar `text-marca` (texto con gradiente) fuera del remate de un titular o de "store" en el logotipo. **Actualizado (nov-2026):** antes era una excepción de dos usos (el logotipo); ahora la Regla del Remate la abre solo a la última línea de un titular Display o Sección, una vez por pantalla. Nunca en párrafos, precios, nombres de producto, métricas, botones ni en dos líneas del mismo titular.
- **Don't** poner el escenario (brillo o dial) detrás de texto, en cada tarjeta del catálogo ni como fondo de sección, ni dos en la misma vista; tampoco sumar otros fondos decorativos (grillas en todo el sitio, resplandores detrás de titulares). La excepción a "nada de gradientes de fondo" es una sola y tiene nombre.
- **Don't** usar negro neutro o puro (`#000`, la escala zinc, `bg-black` como superficie) en el lienzo, las superficies o las sombras de oscuro: la marca es negro azulado y las sombras van teñidas con él.
- **Don't** usar las paradas de relleno (`--marca-inicio/medio/fin`) para texto: no pasan AA como texto (2.4:1 en claro). El texto en degradado usa `--marca-texto-*`, que cambian por tema.
- **Don't** traer al sitio lo que es propio del feed: paginación de carrusel ("1/6", "DESLIZÁ"), íconos de reel, texto metido en imágenes, cinta diagonal animada ni tipografía condensada (sería otra fuente).
- **Don't** quitar el foco visible (`focus:outline-none`) sin un reemplazo igual de visible; el anillo global de `:focus-visible` es el piso.
- **Don't** usar el rosa "Agotado" ni el ámbar "Promo" fuera de su significado fijo (estado de stock y campaña activa, respectivamente). No son colores decorativos de repuesto.
- **Don't** agregar una sombra sin que un estado real la justifique (hover, flotante, modal, activo), ni una que no sea `shadow-md` o uno de los tres tokens de elevación — ver la Regla de la Sombra con Motivo. La sombra de piso del Escenario en la ficha es la única excepción.
- **Don't** pintar una foto de producto con un `next/image` suelto ni sobre el fondo propio de un lugar, ni bajarle el brillo con `mix-blend-mode` o `filter`: la bandeja y el velo (`bandeja-foto`, `velo-foto`) los pone `ProductImage`.
- **Don't** usar esquinas duras (`rounded-none` o radios chicos tipo `rounded-md`) en ningún elemento interactivo; el sistema no tiene ese registro.
