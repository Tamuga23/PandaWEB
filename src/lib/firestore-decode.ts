// Traductor del formato REST de Firestore a JavaScript plano.
//
// Firestore REST devuelve cada valor etiquetado con su tipo:
//   { "stringValue": "HY310X" }
//   { "integerValue": "5" }        ← ojo: los enteros llegan como STRING
//   { "mapValue": { "fields": { ... } } }
//
// Vive en su propio módulo para poder probarlo sin red ni Next.

export type FirestoreValue = Record<string, unknown>;

export function decodeValue(v: FirestoreValue): unknown {
  if (v == null) return undefined;
  if ("nullValue" in v) return null;
  if ("stringValue" in v) return v.stringValue as string;
  if ("booleanValue" in v) return v.booleanValue as boolean;
  if ("integerValue" in v) return Number(v.integerValue);
  if ("doubleValue" in v) return Number(v.doubleValue);
  if ("timestampValue" in v) return new Date(v.timestampValue as string).getTime();
  if ("referenceValue" in v) return String(v.referenceValue).split("/").pop();
  if ("geoPointValue" in v) return v.geoPointValue;
  if ("bytesValue" in v) return undefined; // el catálogo no usa bytes
  if ("arrayValue" in v) {
    const arr = (v.arrayValue as { values?: FirestoreValue[] })?.values ?? [];
    return arr.map(decodeValue);
  }
  if ("mapValue" in v) {
    const fields = (v.mapValue as { fields?: Record<string, FirestoreValue> })?.fields ?? {};
    return decodeFields(fields);
  }
  return undefined;
}

export function decodeFields(
  fields: Record<string, FirestoreValue>,
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(fields)) out[k] = decodeValue(v);
  return out;
}

export interface RestDocument {
  name?: string;
  fields?: Record<string, FirestoreValue>;
}

/** El id del documento sale del último segmento de `name`. */
export function decodeDocument(doc: RestDocument): Record<string, unknown> {
  const id = doc.name ? doc.name.split("/").pop()! : "";
  return { ...decodeFields(doc.fields ?? {}), id };
}
