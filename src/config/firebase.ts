// Config del proyecto Firebase compartido por POS, PandaLink y PandaWEB.
// La apiKey de una app web NO es un secreto: identifica al proyecto, no autoriza
// nada. Lo que protege los datos son las reglas de Firestore.
//
// IMPORTANTE: la base de datos NO es la "(default)". Es una base NOMBRADA.
// Omitir el databaseId es el error número uno al conectarse a este proyecto.

export const FIREBASE = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "gen-lang-client-0460782288",
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ??
    "AIzaSyAgvQOfiVIyKDIWn-fPd5SJEPbVRYkwQ0Q",
  databaseId:
    process.env.NEXT_PUBLIC_FIREBASE_DATABASE_ID ??
    "ai-studio-5c0f20d4-1ed2-4741-aa36-9644b15dbb81",
} as const;

// Modo de acceso al catálogo:
//
//   "anon"   → inicia sesión anónima antes de leer. Funciona HOY con las reglas
//              actuales (catalogo_publico exige isSignedIn()).
//   "public" → lee sin token. Activar cuando se ejecute la Fase 0 y las reglas
//              abran la lectura pública del espejo.
//
// Cambiar de uno a otro es solo esta variable de entorno: la capa de datos ya
// contempla ambos caminos.
export const CATALOG_ACCESS: "anon" | "public" =
  process.env.CATALOG_ACCESS === "public" ? "public" : "anon";
