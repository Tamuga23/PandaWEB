// Cliente Firestore por REST, pensado para correr en el SERVIDOR de Next.js.
//
// ¿Por qué REST y no el SDK de Firebase?
//   1. El SDK pesa ~300 KB en el navegador. Acá el navegador no carga nada:
//      las páginas llegan ya renderizadas con los datos dentro.
//   2. Google indexa el contenido y compartir un producto por WhatsApp muestra
//      vista previa con foto.
//   3. Next cachea la respuesta y la revalida cada N minutos, así que mil
//      visitas no son mil lecturas de Firestore.
//
// Soporta los dos modos de acceso (ver config/firebase.ts):
//   - "anon"   → pide un idToken anónimo y lo manda como Bearer.
//   - "public" → no manda token.

import { CATALOG_ACCESS, FIREBASE } from "@/config/firebase";
import { decodeDocument, type RestDocument } from "./firestore-decode";

const FIRESTORE_BASE = `https://firestore.googleapis.com/v1/projects/${FIREBASE.projectId}/databases/${FIREBASE.databaseId}/documents`;

const IDENTITY_SIGNUP = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE.apiKey}`;

// ---------------------------------------------------------------------------
// Autenticación anónima
// ---------------------------------------------------------------------------
// El token dura una hora. Se guarda en memoria del proceso para no pedir uno
// nuevo en cada render.

let tokenCache: { token: string; expira: number } | null = null;

async function getAnonToken(): Promise<string | null> {
  if (CATALOG_ACCESS === "public") return null;

  const ahora = Date.now();
  if (tokenCache && tokenCache.expira > ahora + 60_000) return tokenCache.token;

  const res = await fetch(IDENTITY_SIGNUP, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ returnSecureToken: true }),
    cache: "no-store",
  });

  if (!res.ok) {
    const detalle = await res.text().catch(() => "");
    throw new Error(
      `No se pudo iniciar sesión anónima en Firebase (${res.status}). ` +
        `Verificá que el proveedor "Anónimo" esté habilitado en Authentication. ${detalle.slice(0, 200)}`,
    );
  }

  const data = (await res.json()) as { idToken: string; expiresIn: string };
  tokenCache = {
    token: data.idToken,
    expira: ahora + Number(data.expiresIn ?? 3600) * 1000,
  };
  return tokenCache.token;
}

async function authHeaders(): Promise<Record<string, string>> {
  const token = await getAnonToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ---------------------------------------------------------------------------
// Lecturas
// ---------------------------------------------------------------------------

export interface FetchOpts {
  /** Segundos antes de volver a consultar Firestore. */
  revalidate?: number;
}

/**
 * Lee una colección completa.
 *
 * Usa `:runQuery` y NO el método `documents.list`. La diferencia importa:
 * con las mismas reglas y el mismo token anónimo, `documents.list` responde
 * 403 mientras `runQuery` funciona. Es el mismo camino que usa el SDK de
 * Firebase por debajo, que es por lo que el POS y PandaLink nunca tuvieron
 * este problema.
 *
 * Sin filtros ni orden en el servidor a propósito: el catálogo es chico y
 * filtrar en el cliente evita crear índices compuestos (firestore.indexes.json
 * está vacío en el POS).
 */
export async function listCollection(
  collectionId: string,
  opts: FetchOpts & { limit?: number } = {},
): Promise<Record<string, unknown>[]> {
  const headers = {
    ...(await authHeaders()),
    "Content-Type": "application/json",
  };

  const res = await fetch(`${FIRESTORE_BASE}:runQuery`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      structuredQuery: {
        from: [{ collectionId, allDescendants: false }],
        limit: opts.limit ?? 1000,
      },
    }),
    // Next no cachea POST. No es problema: las páginas son estáticas con
    // revalidación, así que Firestore solo se consulta al regenerarlas.
    cache: "no-store",
  });

  if (!res.ok) {
    const detalle = await res.text().catch(() => "");
    throw new Error(
      `Firestore devolvió ${res.status} al consultar "${collectionId}". ${traducirError(res.status)} ${detalle.slice(0, 200)}`,
    );
  }

  // runQuery devuelve un arreglo de resultados. Las entradas sin `document`
  // son metadatos (readTime, transaction) y se descartan.
  const filas = (await res.json()) as { document?: RestDocument }[];
  return filas
    .filter((f) => f.document)
    .map((f) => decodeDocument(f.document!));
}

/** Lee un documento suelto. Devuelve null si no existe. */
export async function getDocument(
  path: string,
  opts: FetchOpts = {},
): Promise<Record<string, unknown> | null> {
  const headers = await authHeaders();
  const res = await fetch(`${FIRESTORE_BASE}/${path}`, {
    headers,
    next: { revalidate: opts.revalidate ?? 900 },
  });

  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(
      `Firestore devolvió ${res.status} al leer "${path}". ${traducirError(res.status)}`,
    );
  }
  return decodeDocument((await res.json()) as RestDocument);
}

function traducirError(status: number): string {
  if (status === 403)
    return "Sin permisos: revisá las reglas de Firestore para esta colección.";
  if (status === 401)
    return "Token rechazado: la sesión anónima venció o Authentication no la permite.";
  if (status === 404)
    return "Ruta no encontrada: revisá el projectId y el databaseId (la base es NOMBRADA, no la default).";
  return "";
}
