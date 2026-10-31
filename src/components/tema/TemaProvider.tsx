"use client";

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
} from "react";

export type Tema = "dark" | "light";

export const CLAVE_TEMA = "pandaweb-tema";

interface Ctx {
  tema: Tema;
  alternar: () => void;
  /** Falso hasta que el componente se hidrata, para no renderizar el ícono equivocado. */
  listo: boolean;
}

const TemaCtx = createContext<Ctx>({
  tema: "dark",
  alternar: () => {},
  listo: false,
});

export const useTema = () => useContext(TemaCtx);

/**
 * Avisa a React cada vez que cambia la clase de <html> (al alternar el tema).
 *
 * Además repone la clase del tema si desaparece: cuando falla un render del
 * servidor, React vuelve a dibujar <html> en el navegador con el className
 * del servidor y borra la que puso SCRIPT_TEMA. Pasaba en la pantalla de
 * error (error.tsx), que en tema claro salía en oscuro.
 */
function suscribirClaseHtml(avisar: () => void) {
  const observador = new MutationObserver(() => {
    reponerClaseTema();
    avisar();
  });
  observador.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  // Después de observar: si la repone acá, el observador avisa el cambio.
  reponerClaseTema();
  return () => observador.disconnect();
}

/** Si a <html> le falta la clase del tema, la vuelve a poner desde lo guardado. */
function reponerClaseTema() {
  const raiz = document.documentElement;
  if (raiz.classList.contains("dark") || raiz.classList.contains("light")) return;
  let guardado: string | null = null;
  try {
    guardado = localStorage.getItem(CLAVE_TEMA);
  } catch {
    // Almacenamiento bloqueado: queda el tema por defecto, como en SCRIPT_TEMA.
  }
  raiz.classList.add(guardado === "light" ? "light" : "dark");
}

function temaDelDom(): Tema {
  return document.documentElement.classList.contains("light") ? "light" : "dark";
}

// En el servidor no hay DOM: "dark" es también el default de SCRIPT_TEMA.
const temaDelServidor = (): Tema => "dark";

// Para `listo`: nada que observar, solo distinguir servidor de navegador.
const sinCambios = () => () => {};
const siempreListo = () => true;
const nuncaListo = () => false;

/**
 * Estado del tema.
 *
 * La clase en <html> ya la puso el script que corre antes de pintar (ver
 * layout.tsx). Este provider solo lee lo que quedó aplicado y se encarga de
 * los cambios posteriores — así no hay destello ni desajuste de hidratación.
 */
export function TemaProvider({ children }: { children: React.ReactNode }) {
  // El tema vive en la clase de <html>, fuera de React: se lee con
  // useSyncExternalStore y no copiándolo a un estado dentro de un efecto, que
  // forzaba un segundo render en cascada al montar. Al hidratar, React usa el
  // valor del servidor y enseguida el real, sin desajuste.
  const tema = useSyncExternalStore(suscribirClaseHtml, temaDelDom, temaDelServidor);
  // false en el servidor y durante la hidratación; true ya en el navegador.
  const listo = useSyncExternalStore(sinCambios, siempreListo, nuncaListo);

  const alternar = useCallback(() => {
    const nuevo: Tema = temaDelDom() === "dark" ? "light" : "dark";
    const raiz = document.documentElement;
    // El MutationObserver de suscribirClaseHtml avisa el cambio a React.
    raiz.classList.remove("dark", "light");
    raiz.classList.add(nuevo);
    try {
      localStorage.setItem(CLAVE_TEMA, nuevo);
    } catch {
      // Modo incógnito con almacenamiento bloqueado: el tema igual cambia,
      // solo que no se recuerda.
    }
  }, []);

  return (
    <TemaCtx.Provider value={{ tema, alternar, listo }}>
      {children}
    </TemaCtx.Provider>
  );
}

/**
 * Script que corre ANTES del primer pintado.
 *
 * Sin esto, la página se pinta con el tema por defecto y salta al elegido
 * cuando React se hidrata: el destello blanco clásico. Va inline en <head>
 * justamente para ejecutarse antes que cualquier CSS pintado.
 */
export const SCRIPT_TEMA = `
(function () {
  try {
    var guardado = localStorage.getItem('${CLAVE_TEMA}');
    var tema = guardado === 'light' || guardado === 'dark'
      ? guardado
      : 'dark';
    document.documentElement.classList.add(tema);
  } catch (e) {
    document.documentElement.classList.add('dark');
  }
})();
`;
