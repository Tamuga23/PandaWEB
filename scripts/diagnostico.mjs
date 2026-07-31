// Diagnóstico de acceso a Firestore.
//
//   node scripts/diagnostico.mjs
//
// Prueba en orden cada eslabón de la cadena para saber exactamente dónde se
// corta: la sesión anónima, la base de datos, la colección o la regla.

const API_KEY = "AIzaSyAgvQOfiVIyKDIWn-fPd5SJEPbVRYkwQ0Q";
const PROJECT = "gen-lang-client-0460782288";
const DB = "ai-studio-5c0f20d4-1ed2-4741-aa36-9644b15dbb81";

const ok = (m) => console.log(`  \x1b[32m✓\x1b[0m ${m}`);
const bad = (m) => console.log(`  \x1b[31m✗\x1b[0m ${m}`);
const info = (m) => console.log(`    ${m}`);
const titulo = (m) => console.log(`\n\x1b[36m${m}\x1b[0m`);

// ---------------------------------------------------------------------------
titulo("1. Sesión anónima (Identity Toolkit)");

let idToken = null;
try {
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ returnSecureToken: true }),
    },
  );
  const data = await res.json();

  if (!res.ok) {
    bad(`falló (${res.status})`);
    info(JSON.stringify(data?.error?.message ?? data));
    if (String(data?.error?.message).includes("ADMIN_ONLY_OPERATION")) {
      info("→ Habilitá el proveedor 'Anónimo' en Firebase > Authentication > Sign-in method");
    }
  } else {
    idToken = data.idToken;
    ok("sesión anónima creada");
    // El payload del JWT dice quién sos para las reglas.
    const payload = JSON.parse(
      Buffer.from(idToken.split(".")[1], "base64url").toString(),
    );
    info(`uid: ${payload.user_id ?? payload.sub}`);
    info(`aud (debe ser el projectId): ${payload.aud}`);
    info(`provider: ${payload.firebase?.sign_in_provider}`);
  }
} catch (e) {
  bad(`error de red: ${e.message}`);
}

// ---------------------------------------------------------------------------
const base = (db) =>
  `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/${db}/documents`;

async function probar(etiqueta, url, conToken) {
  const headers = conToken && idToken ? { Authorization: `Bearer ${idToken}` } : {};
  try {
    const res = await fetch(url, { headers });
    const cuerpo = await res.json().catch(() => ({}));
    const estado = cuerpo?.error?.status ?? "";
    if (res.ok) {
      const n = cuerpo.documents?.length ?? (cuerpo.fields ? 1 : 0);
      ok(`${etiqueta} → ${res.status}, ${n} documento(s)`);
      return cuerpo;
    }
    bad(`${etiqueta} → ${res.status} ${estado}`);
    if (cuerpo?.error?.message) info(cuerpo.error.message);
    return null;
  } catch (e) {
    bad(`${etiqueta} → error de red: ${e.message}`);
    return null;
  }
}

async function consultar(etiqueta, collectionId, limit = 1000) {
  const headers = {
    "Content-Type": "application/json",
    ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
  };
  try {
    const res = await fetch(`${base(DB)}:runQuery`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        structuredQuery: { from: [{ collectionId, allDescendants: false }], limit },
      }),
    });
    const cuerpo = await res.json();
    if (!res.ok) {
      const err = Array.isArray(cuerpo) ? cuerpo[0]?.error : cuerpo?.error;
      bad(`${etiqueta} → ${res.status} ${err?.status ?? ""}`);
      if (err?.message) info(err.message);
      return null;
    }
    const docs = cuerpo.filter((f) => f.document).map((f) => f.document);
    ok(`${etiqueta} → ${docs.length} documento(s)`);
    return docs;
  } catch (e) {
    bad(`${etiqueta} → error de red: ${e.message}`);
    return null;
  }
}

titulo("2. Los dos métodos de lectura, con el mismo token");
await probar(
  "documents.list (el que fallaba)",
  `${base(DB)}/catalogo_publico?pageSize=5`,
  true,
);
const docs = await consultar("runQuery (el que usa el SDK)", "catalogo_publico");

titulo("3. Otras colecciones vía runQuery");
await consultar("company (para la tasa de cambio)", "company", 10);

// ---------------------------------------------------------------------------
titulo("4. Contenido del catálogo");

if (docs?.length) {
  console.log(`  ${docs.length} producto(s) en catalogo_publico`);

  const campo = (d, k) => d.fields?.[k];
  const conFoto = docs.filter(
    (d) => !!campo(d, "media")?.mapValue?.fields?.heroImage?.stringValue,
  ).length;
  const disponibles = docs.filter(
    (d) => campo(d, "disponible")?.booleanValue === true,
  ).length;

  const categorias = {};
  for (const d of docs) {
    const c =
      campo(d, "categorySlug")?.stringValue ??
      campo(d, "category")?.stringValue ??
      "(sin categoría)";
    categorias[c] = (categorias[c] ?? 0) + 1;
  }

  console.log(`  con foto:     ${conFoto} de ${docs.length}`);
  console.log(`  disponibles:  ${disponibles} de ${docs.length}`);
  console.log(`  categorías:   ${Object.entries(categorias).map(([k, v]) => `${k}=${v}`).join("  ")}`);

  const sinFoto = docs
    .filter((d) => !campo(d, "media")?.mapValue?.fields?.heroImage?.stringValue)
    .slice(0, 10)
    .map((d) => campo(d, "name")?.stringValue ?? d.name.split("/").pop());
  if (sinFoto.length) {
    console.log(`\n  Sin foto (primeros ${sinFoto.length}):`);
    for (const n of sinFoto) info(`· ${n}`);
  }
} else {
  console.log("  (sin datos que revisar — resolvé primero el acceso)");
}

console.log("");
