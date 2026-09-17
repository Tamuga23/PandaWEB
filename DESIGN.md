---
name: Panda Store
description: Catálogo virtual de tecnología para el hogar y el negocio, en Managua, Nicaragua
colors:
  fondo: "#09090b"
  superficie: "#18181b"
  superficie2: "#27272a"
  borde: "#27272a"
  borde2: "#3f3f46"
  texto: "#fafafa"
  suave: "#a1a1aa"
  tenue: "#71717a"
  acento: "#22d3ee"
  precio: "#34d399"
  agotado: "#fb7185"
  promo: "#fbbf24"
  marca-inicio: "#10b981"
  marca-medio: "#06b6d4"
  marca-fin: "#0284c7"
typography:
  display:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 5vw, 3.75rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 3vw, 2.25rem)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
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

PandaWEB es el mostrador real de la tienda, llevado a la pantalla. No es una vitrina fría de e-commerce: es un catálogo oscuro, cálido y directo donde el panda hace de vendedor de confianza — te muestra el producto, la cuota exacta, y te pasa a un humano por WhatsApp antes de que la fricción tenga tiempo de aparecer. La energía visual viene del degradado de marca (esmeralda → cian → azul cielo), reservado casi exclusivamente para lo que se puede tocar: botones, píldoras activas, ofertas. El resto de la interfaz es deliberadamente calmo — fondo casi negro, superficies apenas más claras, bordes finos — para que ese degradado nunca compita consigo mismo.

El tono es enérgico y cálido, no corporativo ni frío: tipografía Inter sin serifs, texto siempre en español, botones redondeados por completo (nunca esquinas duras), y transiciones suaves en cada estado interactivo. Nada de sombras dramáticas ni gradientes de fondo decorativos — la calidez viene de la redondez, la tibieza del color de superficie, y la promesa concreta en cada CTA ("Lo quiero", "Consultar mi caso"), no de efectos visuales.

**Key Characteristics:**
- Tema oscuro por defecto (zinc casi negro), con un tema claro paralelo que solo invierte los mismos tokens.
- Un único degradado de marca (esmeralda→cian→azul), usado con moderación en superficies de acción.
- Radios generosos y consistentes: pastillas completas para todo lo accionable, esquinas redondeadas grandes para contenedores.
- Separación por borde y color de superficie, no por sombra — el sistema es plano por diseño, con espacio para crecer en profundidad.
- Los tres colores semánticos (precio, agotado, promo) nunca decoran: solo aparecen cuando dicen algo real sobre el producto.

## Colors

Paleta acotada y semántica: cada color dice algo funcional, ninguno es decorativo puro. Nombrado técnico y directo — sin metáforas, para que se pueda escanear rápido junto al código.

### Primary
- **Acento Cian** (`#22d3ee` oscuro / `#0891b2` claro): color de acción y de enlace. Bordes de foco, hover de tarjetas (`border-acento/50`), títulos de producto al pasar el mouse.

### Secondary
- **Verde Precio** (`#34d399` oscuro / `#059669` claro): el color más importante del sitio después del acento — todo precio, badge "0% interés", y el fondo tintado (`bg-precio/5`) del bloque de financiamiento.

### Tertiary
- **Ámbar Promo** (`#fbbf24` oscuro / `#d97706` claro): reservado para campañas activas (`producto.campania`), nunca para precio ni para CTA.
- **Rosa Agotado** (`#fb7185` oscuro / `#e11d48` claro): único uso — el estado "Agotado" y su badge. No se reutiliza para errores genéricos ni para otra cosa.

### Neutral
- **Fondo** (`#09090b`, zinc-950): el lienzo de toda la app. Casi negro, no negro puro.
- **Superficie** (`#18181b`, zinc-900): tarjetas, inputs, contenedores elevados un paso sobre el fondo.
- **Superficie 2** (`#27272a`, zinc-800): un paso más arriba — hover de superficie, chips inactivos.
- **Borde** (`#27272a`) / **Borde 2** (`#3f3f46`): separación de tarjetas (borde) y contornos más marcados como botones secundarios (borde2).
- **Texto** (`#fafafa`), **Suave** (`#a1a1aa`), **Tenue** (`#71717a`): jerarquía de tres niveles — título/cuerpo, texto secundario, metadatos y placeholders.

### Degradado de marca
- **Esmeralda → Cian → Azul Cielo** (`#10b981` → `#06b6d4` → `#0284c7`, 135deg): el único gradiente del sistema. Vive en `bg-marca`/`text-marca`, y se usa para: el CTA principal de cada sección, la píldora de categoría activa, el badge de oferta, y el logo. Nunca se aplica a texto de párrafo ni a fondos grandes de sección.

### Named Rules
**La Regla del Degradado Único.** Solo hay un gradiente en todo el sistema y es el de marca. Ningún componente inventa su propio degradado — si algo necesita destacar, usa `bg-marca` o un color semántico plano, nunca una mezcla nueva.

**La Regla de los Tres Semánticos.** Precio (verde), Agotado (rosa) y Promo (ámbar) son los únicos colores con significado fijo. Si un componente nuevo necesita "llamar la atención" sin ser ninguna de esas tres cosas, la respuesta es el degradado de marca, no un cuarto color semántico.

## Typography

**Display Font:** Inter (con `system-ui, sans-serif` de respaldo)
**Body Font:** Inter — la misma familia para todo, sin una segunda tipografía de acento.

**Character:** Enérgica y cálida sin dejar de ser legible a las 2 de la mañana en un teléfono con poca señal: pesos altos (bold/black) para lo que vende, pesos medios para lo que orienta, y mayúsculas con tracking amplio para las etiquetas que casi nadie lee dos veces.

### Hierarchy
- **Display** (700, `clamp(2.25rem, 5vw, 3.75rem)`, leading 1.1): el `<h1>` de la portada únicamente. Tracking negativo (-0.02em) para que se sienta compacto pese al tamaño.
- **Headline** (700, `clamp(1.5rem, 3vw, 2.25rem)`, leading 1.2): títulos de sección (`Qué estás buscando`, `Lo más pedido`) y el `<h1>` de catálogo/ficha de producto.
- **Title** (600, 1rem, leading 1.4): nombre de producto en tarjeta y encabezados de subsección (`Especificaciones`, `Por qué te sirve`).
- **Body** (400, 0.875rem, leading 1.6): descripciones, bullets, texto de apoyo. Sube a 1.125rem en el beneficio destacado de la ficha de producto.
- **Label** (600, 11px, tracking 0.05em, uppercase): eyebrow de categoría sobre el nombre del producto, encabezados de sección chicos.
- **Micro** (900, 10px, tracking 0.1em, uppercase, black): los badges más chicos y de más peso — "0% interés", "-16% Oferta", el texto del pill "Agotado". Es la excepción que compite por atención: más chico que Label pero mucho más pesado.

### Named Rules
**La Regla del Precio Gigante.** El precio actual siempre es el elemento tipográfico más grande de su bloque (`text-4xl` en ficha, `text-lg` bold en tarjeta) — nunca compite en tamaño con el nombre del producto. **Excepción confirmada:** en un producto agotado, el precio baja a `text-2xl text-tenue` y la calculadora de cuotas se oculta entera — no tiene sentido que la pieza más grande de la pantalla venda algo que no se puede comprar ahora mismo.

## Layout

Contenedor central `max-w-6xl` (72rem) con `px-4` de margen lateral en todo el sitio — nunca full-bleed salvo el hero y el footer. Ritmo vertical por secciones de `py-16`/`py-20` en desktop, comprimido a `py-10` en el catálogo (más denso, orientado a tarea).

Grillas responsive por breakpoint: el catálogo pasa de 2 columnas en móvil a 3 (`lg`) y 4 (`xl`); los destacados de portada van de 2 a 4 columnas a partir de `lg`. Las tarjetas nunca superan el ancho de su columna — sin excepciones de ancho variable dentro de una misma grilla.

**Mobile-first real, no solo responsive:** la ficha de producto tiene una barra de compra fija en la parte inferior en móvil (`barra-producto`) que desaparece en desktop a favor de un CTA inline — no es el mismo componente reescalado, es una composición distinta a propósito.

## Elevation & Depth

El sistema es plano por defecto: la separación entre superficies se resuelve con `border-borde` y el salto de `bg-fondo` a `bg-superficie`, no con sombra. La única sombra reutilizada es `shadow-md`, y aparece en apenas tres lugares: la píldora de categoría activa, el badge de oferta sobre la imagen de producto, y accesorios flotantes puntuales — siempre como refuerzo de "esto está por encima/activo ahora mismo", nunca como decoración ambiental.

**Dirección confirmada, no implementada todavía:** el objetivo es explorar más profundidad de la que hay hoy — capas, elevación real en modales/tarjetas al interactuar — sin que la base plana deje de ser la regla. Cualquier trabajo de `bolder`/`polish`/`animate` sobre elevación tiene license para proponer esto; no es una preferencia por dejar el sitio como está.

### Shadow Vocabulary
- **Acento flotante** (`box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)` — Tailwind `shadow-md`): píldora activa, badge de oferta. Señala "por encima del resto", no ambiente general.

### Named Rules
**La Regla de la Sombra con Motivo.** Ninguna sombra existe sin una razón puntual (activo, flotante, destacado). Si un elemento no tiene un estado especial que justificarla, va sin sombra.

## Shapes

Radios generosos y consistentes, con una jerarquía clara por tamaño de elemento:
- **Pastilla completa** (`rounded-full`, 9999px): todo lo accionable — botones primarios y secundarios, píldoras de filtro, badges de estado (Disponible/Agotado), el ícono de WhatsApp.
- **Grande** (`rounded-2xl`/`rounded-3xl`, 16–24px): contenedores — tarjetas de producto, tarjetas de categoría, el panel de financiamiento, modales.
- **Medio** (`rounded-xl`, 12px): elementos secundarios dentro de un contenedor — botones de ícono, casillas de cuota individual, campo de búsqueda.
- **Chico** (`rounded-lg`, 8px): badges de oferta sobre imagen — la única forma no-pastilla que aparece flotando sobre contenido.

Sin bordes duros en ningún componente interactivo. Las únicas esquinas a 0px son estructurales (la barra de compra fija en móvil, que se ancla al borde de la pantalla).

## Components

### Buttons
- **Shape:** pastilla completa (`rounded-full`) sin excepción.
- **Primary:** fondo `bg-marca` (degradado esmeralda→cian→azul), texto blanco, `font-semibold`, `px-5 py-3` (o `px-6 py-4` para el CTA principal de ficha). Hover: `opacity-90`, sin cambio de color ni de tamaño.
- **Secondary / Ghost:** transparente con `border border-borde2`, texto `text-texto`. Hover: el borde y el texto pasan a `text-acento`.
- **Icon button:** cuadrado `rounded-xl` de `h-9 w-9`, fondo `bg-superficie`, borde `border-borde`. Hover: fondo `bg-marca`, texto blanco — el único botón secundario que sí cambia de color completo al pasar el mouse.

### Badges / Chips
- **Oferta:** `rounded-lg`, fondo `bg-marca`, texto blanco `font-black uppercase` con tracking amplio. Siempre sobre imagen, nunca en línea de texto.
- **Agotado:** `rounded-full`, fondo `bg-fondo/90` con `ring-1 ring-agotado/30`, texto rosa. Flota sobre la imagen, opuesto al badge de oferta.
- **0% interés:** `rounded-full`, fondo `bg-precio/15`, texto verde `font-black uppercase`. Solo aparece cuando el producto de verdad no lleva recargo — nunca decorativo.
- **Píldora de filtro (categoría):** `rounded-full`. Inactiva: borde + `bg-superficie`. Activa: `bg-marca`, texto blanco, `font-bold`, `shadow-md` y un punto blanco a la izquierda.

### Cards / Containers
- **Corner Style:** `rounded-2xl`.
- **Background:** `bg-superficie` sobre `bg-fondo`.
- **Shadow Strategy:** ninguna en reposo (ver Elevation). Solo el borde cambia en hover (`hover:border-acento/50`).
- **Border:** `border border-borde` siempre presente, incluso sin hover.
- **Internal Padding:** `p-4` a `p-5`; el panel de financiamiento sube a `p-8`/`p-12` en desktop por ser una sección hero-like.

### Inputs / Fields
- **Style:** `rounded-xl`, `border border-borde`, fondo `bg-superficie`, texto `text-sm`.
- **Focus:** el borde cambia a `border-acento`, sin anillo de foco adicional (`focus:outline-none` + color de borde alcanza).
- **Placeholder:** siempre en `text-tenue`, el nivel más bajo de la jerarquía de texto.

### Navigation
- **Header:** fijo (`sticky top-0`), fondo `bg-fondo/85` con `backdrop-blur-md` — nunca opaco sólido, siempre deja intuir el contenido detrás. Enlaces en píldora al hover (`hover:bg-superficie2`). El CTA de WhatsApp del header es el único botón `bg-marca` que vive fuera del flujo principal de contenido.
- **Mobile:** la navegación secundaria baja a una fila propia con scroll horizontal sin barra visible (`scrollbar-none`) en vez de un menú hamburguesa.

## Do's and Don'ts

### Do:
- **Do** reservar `bg-marca` (el degradado) para lo accionable: CTA primario, píldora activa, badge de oferta, logo. Es la Regla del Degradado Único.
- **Do** usar pastilla completa (`rounded-full`) para todo botón, badge de estado y filtro — es la forma por defecto de "esto se puede tocar".
- **Do** mostrar el precio como el elemento tipográfico más grande de su bloque (Regla del Precio Gigante).
- **Do** dejar que el borde y el salto de superficie hagan el trabajo de separar contenido, antes de recurrir a una sombra.

### Don't:
- **Don't** crear un segundo degradado. Si algo necesita destacar más, sube de peso tipográfico o usa un color semántico plano — nunca mezcles otro gradiente.
- **Don't** aplicar `text-marca` (texto con gradiente) a nada nuevo. Su única excepción confirmada es la palabra "store" en el logotipo (`Header.tsx`, `Footer.tsx`) — coincide con el asset de marca real. No es un patrón a reutilizar en títulos, métricas ni ningún otro texto; es una excepción de dos usos, no una herramienta disponible.
- **Don't** usar el rosa "Agotado" ni el ámbar "Promo" fuera de su significado fijo (estado de stock y campaña activa, respectivamente). No son colores decorativos de repuesto.
- **Don't** agregar una sombra sin que un estado real la justifique (activo, flotante, destacado) — ver la Regla de la Sombra con Motivo.
- **Don't** usar esquinas duras (`rounded-none` o radios chicos tipo `rounded-md`) en ningún elemento interactivo; el sistema no tiene ese registro.
