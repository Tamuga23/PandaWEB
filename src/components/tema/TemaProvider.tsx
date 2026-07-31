"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
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
 * Estado del tema.
 *
 * La clase en <html> ya la puso el script que corre antes de pintar (ver
 * layout.tsx). Este provider solo lee lo que quedó aplicado y se encarga de
 * los cambios posteriores — así no hay destello ni desajuste de hidratación.
 */
export function TemaProvider({ children }: { children: React.ReactNode }) {
  const [tema, setTema] = useState<Tema>("dark");
  const [listo, setListo] = useState(false);

  useEffect(() => {
    const actual = document.documentElement.classList.contains("light")
      ? "light"
      : "dark";
    setTema(actual);
    setListo(true);
  }, []);

  const alternar = useCallback(() => {
    setTema((previo) => {
      const nuevo: Tema = previo === "dark" ? "light" : "dark";
      const raiz = document.documentElement;
      raiz.classList.remove("dark", "light");
      raiz.classList.add(nuevo);
      try {
        localStorage.setItem(CLAVE_TEMA, nuevo);
      } catch {
        // Modo incógnito con almacenamiento bloqueado: el tema igual cambia,
        // solo que no se recuerda.
      }
      return nuevo;
    });
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
