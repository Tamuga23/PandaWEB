# Plan de identidad de marca (nov-2026)

Objetivo: que la web se vea como las piezas de Instagram y Facebook de Panda Store,
sin perder lo que ya funciona (SEO y JSON-LD, accesibilidad AA, una sola precarga
de imagen por página, tema claro y oscuro, lógica de cuotas, comparador, WhatsApp
con medición de conversiones, dirección y teléfono reales).

Rama: `identidad-marca`. Cada fase es un commit chico con push. Fusionar a `main`
requiere el permiso explícito de Carlos.

Verificación: SIEMPRE contra `CATALOG_SOURCE=fixture npx next start -p 3100`
(datos de prueba, cero lecturas de Firestore). Nunca capturas contra producción.

## De dónde sale

Once piezas de redes (Black Panda, GTA VI, tips y curiosidades, afiches de
A810 Lite, HY300 Pro+, Cubelite Ultra, HY320 Pro, HY350 Max, Bip 6, "Elegí tu
smartwatch", calendario de diciembre) y el logo. Las analizó un workflow de seis
agentes (2026-11-19): sistema visual, composición, UI UX Pro Max (sistema de
diseño, contraste WCAG, reglas de UX), Taste Skill (principios y sus
verificadores en navegador como línea base), brecha con el sitio actual y las
sub-skills `brand` y `design-system` (arquitectura de tokens).

## La marca, en una página

- **Lienzo:** negro azulado, nunca neutro ni negro puro (#090c11), con viñeta
  suave. Superficies azuladas un paso arriba (#111822, #1a2330), bordes finos.
- **Degradado de marca:** verde #10b981 → cian #06b6d4 → azul #0284c7. Es el que
  ya usa la web (no cambia). En texto corre horizontal (90deg) y en el tema claro
  usa paradas oscuras (#047857 → #0e7490 → #0369a1) para llegar a AA.
- **Verde precio:** #34d399 (oscuro), plano, nunca en degradado. Todo precio y el
  0% de interés (que sigue saliendo de la lógica de cuotas, nunca a ojo).
- **Titular de dos líneas:** primera línea en blanco, la segunda (el "remate") en
  degradado: "Elegí tu / smartwatch", "Tu pared / es tu cine". Inter 800 con
  tracking muy cerrado (-0.045em) e interlineado 0.95. Un remate por pantalla.
- **Eyebrow:** mayúsculas espaciadas (0.22em) en gris, "MAGCUBIC · HY350 MAX".
- **Escenario de producto:** el producto grande sobre un brillo radial (verde o
  azul) y un dial circular con marcas, como un velocímetro. Solo detrás del
  producto protagonista (hero y galería de la ficha), nunca detrás de texto.
- **Afiche de producto:** eyebrow marca · categoría, nombre enorme, una frase
  corta, datos clave en 2x2 con ícono de línea (cifra grande + bajada gris),
  precio enorme con "C$" chico arriba, cuotas al lado y fila de garantías con
  check (Cuotas con Banpro · Garantía 3 meses · Entrega inmediata · Con factura).
- **Firma:** logo + "Colectivo Dreamy · Managua" a la izquierda; círculo de
  WhatsApp en degradado + "Escribinos por WhatsApp" + 8372 5528 enorme.
- **Voz:** voseo, frases cortas con punto final ("Tu primer cine en casa.").

## Lo que NO se traduce

Paginación de carrusel ("1/6", "DESLIZÁ"), íconos de reel, texto metido en
imágenes, precios o vigencias escritas a mano (la web los lee del POS), cinta
diagonal animada, tipografía condensada de los lanzamientos (sería otra fuente),
el escenario completo en cada tarjeta del catálogo (ruido y costo de pintado),
más de un remate en degradado por pantalla, fondos con grilla en todo el sitio.

De Taste Skill se ignora: el sorteo de paleta/tipografía (la marca ya existe), su
regla 9 (aquí dirección, teléfono y coordenadas reales son obligatorios para el
SEO local), su kit de assets y el gate/hook Stop.

## Reglas de DESIGN.md que cambian

1. "Nada de gradientes de fondo decorativos" → excepción con nombre: **Escenario
   de producto** (un brillo por vista, solo detrás del producto protagonista).
2. "No aplicar text-marca a nada nuevo" → **Regla del Remate**: solo en la última
   línea de un titular display, una vez por pantalla, nunca en párrafos ni precios.
3. Paleta neutra zinc → **escala azulada** (mismos nombres de token, otros valores).
4. Display solo en el h1 de portada → escala **display / titular / sección / cifra
   / eyebrow** en Inter 800 (misma fuente variable, sin descarga extra).
5. "Plano en reposo" → se aclara que la profundidad del escenario es ambiental y
   decorativa (aria-hidden); las tarjetas siguen planas en reposo.
6. Se mantienen: la Regla de la Bandeja (las fotos del POS tienen fondo blanco),
   los tres semánticos, el patrón de hover sin temblor y los tokens de elevación.

## Fases

| # | Fase | Estado |
|---|------|--------|
| 1 | Tokens: lienzo azulado, AA del tema claro, text-marca por tema, escala display, theme-color y OG | hecho |
| 2 | Escenario de producto: brillo + dial (CSS/SVG), en hero y galería | hecho |
| 3 | Portada: hero (eyebrow, remate, pastilla), vitrina, encabezados de sección, ubicación | en curso (hero hecho) |
| 4 | Ficha tipo afiche: eyebrow, h1, datos clave 2x2, precio protagonista, fila de garantías | hecho |
| 5 | Catálogo y tarjeta: jerarquía, precio, foco visible en filtros | pendiente |
| 6 | Firma de marca en el footer, skip link, áreas táctiles | pendiente |
| 7 | QA: verificadores de Taste, checklist de UI UX Pro Max, AA en ambos temas, regresión funcional | pendiente |

## Línea base (antes de tocar nada)

Verificadores de Taste sobre el fixture (portada y ficha del HY450MAX, 1440 y 390):
- FAIL reales: "Comparar" en --tenue sobre --superficie2 da 4.13:1; 3 estilos de
  botón y 2 alturas; `focus:outline-none` sin reemplazo en CatalogoCliente; en la
  ficha a 390 el precio (36px) supera al h1 (30px).
- WARN reales: sin skip link; links del nav en 14 y 16px; links del footer de
  17-20px de alto (bajo 44px); "Por qué te sirve" en 14px.
- Tema claro: --acento #0891b2 (3.5:1), --precio #059669 (3.6:1) y --promo
  #d97706 (3.2:1) fallan AA como texto chico.

## Pendiente del lado de Carlos

- Wordmark "pandastore" en SVG (texto en contornos, sin mapas de bits) para
  reemplazar el texto en Inter del header y el footer.
- Recortes PNG sin fondo de los productos estrella, si se quiere el escenario sin
  bandeja blanca (las fotos del POS tienen fondo blanco).
- Confirmar si la dirección lleva "Mód 2" (aparece en la pieza del Bip 6, no en
  la web ni en el JSON-LD).
