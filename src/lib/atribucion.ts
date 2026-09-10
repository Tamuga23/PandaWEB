const CLAVE = "panda_ads_click";
const PARAMS = ["gclid", "gbraid", "wbraid"] as const;
/** 90 días: cubre la ventana de conversión más larga que usa Google Ads. */
const VIDA_MS = 90 * 24 * 60 * 60 * 1000;

interface ClickPublicitario {
  id: string;
  tipo: (typeof PARAMS)[number];
  ts: number;
}

/** Llamar una vez, al montar la app. Si no hay parámetro, no toca nada. */
export function capturarClick(): void {
  if (typeof window === "undefined") return;
  const q = new URLSearchParams(window.location.search);
  for (const tipo of PARAMS) {
    const id = q.get(tipo);
    if (!id) continue;
    try {
      const dato: ClickPublicitario = { id, tipo, ts: Date.now() };
      window.localStorage.setItem(CLAVE, JSON.stringify(dato));
    } catch {
      // Modo privado o almacenamiento bloqueado: se sigue sin atribución.
    }
    return;
  }
}

export function clickGuardado(): ClickPublicitario | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CLAVE);
    if (!raw) return null;
    const dato = JSON.parse(raw) as ClickPublicitario;
    if (!dato?.id || Date.now() - dato.ts > VIDA_MS) return null;
    return dato;
  } catch {
    return null;
  }
}

/**
 * Le agrega la referencia al mensaje prellenado de WhatsApp.
 * Sin click guardado devuelve la URL intacta.
 */
export function agregarRef(urlWhatsApp: string): string {
  const dato = clickGuardado();
  if (!dato) return urlWhatsApp;
  try {
    const u = new URL(urlWhatsApp);
    const texto = u.searchParams.get("text") ?? "";
    u.searchParams.set("text", `${texto}\n\n—\nref: ${dato.id}`);
    return u.toString();
  } catch {
    return urlWhatsApp;
  }
}
