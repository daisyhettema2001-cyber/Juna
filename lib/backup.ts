/** Bewaar en herstel alle Juna-gegevens van dit toestel als één bestand. Alles blijft lokaal. */
const PREFIX = "juna.";

export function maakBackup(): string {
  const data: Record<string, string> = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(PREFIX)) {
        const v = localStorage.getItem(k);
        if (v !== null) data[k] = v;
      }
    }
  } catch {
    /* ignore */
  }
  return JSON.stringify({ app: "juna", versie: 1, datum: new Date().toISOString().slice(0, 10), data });
}

export function downloadBackup() {
  const blob = new Blob([maakBackup()], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const d = new Date();
  a.href = url;
  a.download = `juna-gegevens-${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Geeft true als het gelukt is. Controleert strikt wat er in het bestand staat. */
export function herstelBackup(tekst: string): boolean {
  try {
    if (tekst.length > 2_000_000) return false;
    const j = JSON.parse(tekst);
    if (!j || j.app !== "juna" || j.versie !== 1 || typeof j.data !== "object" || j.data === null) return false;
    const items = Object.entries(j.data as Record<string, unknown>);
    if (items.length === 0 || items.length > 60) return false;
    for (const [k, v] of items) {
      if (!k.startsWith(PREFIX) || k.length > 60 || typeof v !== "string" || v.length > 200_000) return false;
      JSON.parse(v);
    }
    for (const [k, v] of items) localStorage.setItem(k, v as string);
    return true;
  } catch {
    return false;
  }
}
